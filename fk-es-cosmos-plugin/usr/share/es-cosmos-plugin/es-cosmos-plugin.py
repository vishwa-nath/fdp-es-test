__author__ = 'shubham.saxena'

import requests
import json
import time
import os
import yaml
import constants
import logging

def json_parser(structure, key="", path="", flattened_json=None):
    if flattened_json is None:
        flattened_json = {}
    if type(structure) not in(dict, list):
        flattened_json[((path + ".") if path else "") + key] = structure
    elif isinstance(structure, list):
        for i, item in enumerate(structure):
            json_parser(item, "%d" % i, ".".join(filter(None,[path,key])), flattened_json)
    else:
        for new_key, value in structure.items():
            json_parser(value, new_key, ".".join(filter(None,[path,key])), flattened_json)
    return flattened_json

def get_request(url):
    response = requests.request("GET", url)
    return response.text

def run_cmd(cmd):
    os.system(cmd)

def pump_metrics(payload):
    if constants.debug == constants.true:
        logging.debug(payload)
    else:
        print payload

def collect_stats(node_stats_url, cluster_stats_url, metrics, port_number):

    #get es cluster name
    cluster_state_version_url = constants.base_url + str(port_number) + constants.cluster_state_version_url
    cluster_state_version_response = get_request(cluster_state_version_url)
    cluster_state_version_json_root = json.loads(cluster_state_version_response)
    cluster_name = cluster_state_version_json_root[constants.cluster_name]
    logging.debug("cluster_name = " + cluster_name)

    # get es cluster stats
    stats_url = constants.base_url + str(port_number) + cluster_stats_url
    stats_response = get_request(stats_url)

    #publish cluster stats
    publish_cluster_stats(stats_response, cluster_name)

    #get es node stats
    stats_url = constants.base_url + str(port_number) + node_stats_url + str(metrics)
    stats_response = get_request(stats_url)

    #publish node stats
    publish_node_stats(stats_response, cluster_name)

def publish_cluster_health(port_number):
    cluster_health_url = constants.base_url + str(port_number) + constants.cluster_health_uri
    cluster_health_rsp = get_request(cluster_health_url)
    timestamp = int(time.time())
    cluster_health_rsp_json = json.loads(cluster_health_rsp)
    cluster_name = cluster_health_rsp_json[constants.cluster_name]
    flat_json = json_parser(cluster_health_rsp_json)
    for key,value in flat_json.iteritems():
        cosmos_payload = str(timestamp) + ' ' + str(cluster_name) + '.' + constants.cluster +"." \
                         + str(key) + '.count' + ' ' + str(value)
        pump_metrics(cosmos_payload)


def publish_cluster_stats(stats_response, cluster_name):

    #timestamp at which metric value was retrieved from es published

    stats_json_root = json.loads(stats_response)
    timestamp = stats_json_root[constants.timestamp]
    cluster_status = stats_json_root[constants.status]

    logging.debug("cluster_status = " + cluster_status)
    logging.debug(json.dumps(stats_json_root, indent=4, sort_keys=True))

    es_version = stats_json_root['nodes']['versions'][0]
    logging.debug("es_version = " + es_version)
    nodes_count_data = json_parser(stats_json_root['nodes']['count'])

    for key, value in nodes_count_data.iteritems():
        cosmos_payload = str(timestamp) + ' ' + str(cluster_name) + '.' + constants.cluster + '.' \
                    + constants.nodes + '.' + constants.count + '.' + str(key) + ' ' + str(value)
        pump_metrics(cosmos_payload )

    if cluster_status == constants.green:
        status_value = 1
    elif cluster_status == constants.yellow:
        status_value = 0
    elif cluster_status == constants.red:
        status_value = -1
    else:
        status_value = -2

    cosmos_payload = str(timestamp) + ' ' + str(cluster_name) + '.' + constants.cluster + '.' \
                    + constants.status + ' ' + str(status_value) + " cluster=" + str(cluster_name)
    pump_metrics(cosmos_payload)

def get_node_type(node_attributes):
    is_master = node_attributes.get(constants.master,'true')
    is_data = node_attributes.get(constants.data,'true')
    is_client = node_attributes.get(constants.client,'false')
    node_type = ""
    if is_data == constants.true:
        node_type = "data"
    elif is_master == constants.true:
        node_type = "master"
    elif is_client == constants.true:
        node_type = "client"

    logging.debug("node_attributes = \n" + json.dumps(node_attributes,indent=4, sort_keys=True))
    logging.debug("is_data = " + is_data + ", is_master = " + is_master + ", node_type = " + node_type)

    return node_type

def publish_node_stats(stats_response, cluster_name):

    #timestamp at which metric value is published
    timestamp = int(time.time())

    stats_json_root = json.loads(stats_response)
    for node_id in stats_json_root[constants.nodes].keys():
        logging.debug('node_id = ' + node_id )
        node_status_json = stats_json_root[constants.nodes][node_id]
        logging.debug(json.dumps(node_status_json, indent=4, sort_keys=True))

        host_name = stats_json_root[constants.nodes][node_id][constants.host]
        host_ip = stats_json_root[constants.nodes][node_id][constants.name]

        # ATTRIBUTES (has just master/data)
        node_attrs = stats_json_root[constants.nodes][node_id][constants.attributes]
        node_type = get_node_type(node_attrs)
        is_master = stats_json_root[constants.nodes][node_id][constants.attributes][constants.master]
        for attr_key in stats_json_root[constants.nodes][node_id][constants.attributes].keys():
            if attr_key == constants.data:
                is_data = stats_json_root[constants.nodes][node_id][constants.attributes][constants.data]
            else:
                is_data = constants.true
        #END attributes handling

        node_id_data = json_parser(stats_json_root[constants.nodes][node_id])
        logging.debug("----------FLATTENED JSON ------------\n \n")
        logging.debug(json.dumps(node_id_data,indent=4, sort_keys=True))

        for key, value in node_id_data.iteritems():
            cosmos_payload = str(timestamp) + ' ' + str(cluster_name) + '.' + constants.nodes + '.' \
                            + str(key) + ' ' + str(value) + " host_name=" + str(host_name) + " host_ip=" + str(host_ip) \
                            + " is_master=" + str(is_master) + " is_data=" + str(is_data)  \
                            + " cluster=" + str(cluster_name) + " node_type=" + node_type
            pump_metrics(cosmos_payload )

if __name__ == '__main__':
    with open(constants.config_file, 'r') as stream:
        cfg = yaml.load(stream)

    if constants.debug == constants.true:
        LOG_LEVEL = logging.DEBUG
    else:
         LOG_LEVEL = logging.INFO

    logging.basicConfig(filename=constants.LOG_FILENAME,level=LOG_LEVEL)
    logging.debug(cfg)

    publish_cluster_health(cfg["port_number"])
    collect_stats(constants.node_stats_url, constants.cluster_stats_url, cfg["metrics"], cfg["port_number"])




