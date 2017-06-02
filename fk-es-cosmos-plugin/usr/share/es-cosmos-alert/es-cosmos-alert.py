__author__ = 'shubham.saxena'

import json
import requests
import constants
import sys
import logging

def get_request(url):
    response = requests.get(url)
    return response.text

def post_request(alert_url, payload):

    headers = {}
    headers["Content-Type"] = "application/json"
    if constants.debug == 'true':
        logging.debug("alert_url = " + alert_url )
        logging.debug("payload = " + json.dumps(payload, indent=4, sort_keys=True))
    else :
        response = requests.post(alert_url, data=json.dumps(payload), headers=headers)
        if response.status_code == 200:
            logging.info('Alert Created Successfully')
        else:
            logging.info(response.text)

def cluster_health_alert(team_name, app_id, cluster_name, tags):
    logging.info("Configuring EC cluster health alert for team = " + team_name + ", app_id = " + app_id + ", cluster =" + cluster_name + ", tags =" + tags)
    alert_url = constants.alert_base_url + team_name + constants.schedule_rules
    alert_name = constants.cluster_health_alert_name
    alert_query = constants.alert_base_query + app_id + '.' + cluster_name + constants.cluster_health_metric

    with open(constants.alert_single_series_file, 'r') as payload_json_file:
        alert_payload_data = json.load(payload_json_file)

    alert_payload_data[constants.name] = alert_name
    alert_payload_data[constants.tags][0] = tags
    alert_payload_data[constants.checks][0][constants.booleanExpression] = '$Xmax < 1'
    alert_payload_data[constants.checks][1][constants.booleanExpression] = '$Xmax < 0'
    alert_payload_data[constants.dataSerieses][constants.x][constants.query] = alert_query

    #create cluster health alert
    post_request(alert_url, alert_payload_data)

def os_memory_alert(team_name, app_id, cluster_name, tags, host_name):

    alert_url = constants.alert_base_url + team_name + constants.schedule_rules
    alert_name = constants.os_memory_alert_name + host_name
    alert_query = constants.alert_base_query + app_id + '.' + cluster_name + constants.os_memory_metric + host_name + '}'

    with open(constants.alert_single_series_file, 'r') as payload_json_file:
        alert_payload_data = json.load(payload_json_file)

    alert_payload_data[constants.name] = alert_name
    alert_payload_data[constants.tags][0] = tags
    alert_payload_data[constants.checks][0][constants.booleanExpression] = '$Xmax > 80'
    alert_payload_data[constants.checks][1][constants.booleanExpression] = '$Xmax > 90'
    alert_payload_data[constants.dataSerieses][constants.x][constants.query] = alert_query

    post_request(alert_url, alert_payload_data)

def heap_memory_alert(team_name, app_id, cluster_name, tags, host_name):

    alert_url = constants.alert_base_url + team_name + constants.schedule_rules
    alert_name = constants.heap_memory_alert_name + host_name
    alert_query = constants.alert_base_query + app_id + '.' + cluster_name + constants.heap_memory_metric + host_name + '}'

    with open(constants.alert_single_series_file, 'r') as payload_json_file:
        alert_payload_data = json.load(payload_json_file)

    alert_payload_data[constants.name] = alert_name
    alert_payload_data[constants.tags][0] = tags
    alert_payload_data[constants.checks][0][constants.booleanExpression] = '$Xmax > 83'
    alert_payload_data[constants.checks][1][constants.booleanExpression] = '$Xmax > 93'
    alert_payload_data[constants.dataSerieses][constants.x][constants.query] = alert_query

    post_request(alert_url, alert_payload_data)

def thread_pool_queue_alert(team_name, app_id, cluster_name, tags, host_name):

    thread_pool = constants.thread_pool

    for tp in thread_pool:
        alert_url = constants.alert_base_url + team_name + constants.schedule_rules
        alert_name = constants.thread_pool_alert_name + tp + constants.queue + host_name
        alert_query = constants.alert_base_query + app_id + '.' + cluster_name + constants.thread_pool_metric + tp + \
                      constants.queue_metric + host_name + '}'

        with open(constants.alert_single_series_file, 'r') as payload_json_file:
            alert_payload_data = json.load(payload_json_file)

        alert_payload_data[constants.name] = alert_name
        alert_payload_data[constants.tags][0] = tags
        alert_payload_data[constants.checks][0][constants.booleanExpression] = '$Xmax > 1'
        alert_payload_data[constants.checks][1][constants.booleanExpression] = '$Xmax > 2'
        alert_payload_data[constants.dataSerieses][constants.x][constants.query] = alert_query

        post_request(alert_url, alert_payload_data)

def thread_pool_rejected_alert(team_name, app_id, cluster_name, tags, host_name):

    thread_pool = constants.thread_pool

    for tp in thread_pool:
        alert_url = constants.alert_base_url + team_name + constants.schedule_rules
        alert_name = constants.thread_pool_alert_name + tp + constants.rejected + host_name
        alert_query = constants.alert_base_query + app_id + '.' + cluster_name + constants.thread_pool_metric + tp + \
                      constants.rejected_metric + host_name + '}'

        with open(constants.alert_single_series_file, 'r') as payload_json_file:
            alert_payload_data = json.load(payload_json_file)

        alert_payload_data[constants.name] = alert_name
        alert_payload_data[constants.tags][0] = tags
        alert_payload_data[constants.checks][0][constants.booleanExpression] = '$Xmax > 1'
        alert_payload_data[constants.checks][1][constants.booleanExpression] = '$Xmax > 2'
        alert_payload_data[constants.dataSerieses][constants.x][constants.query] = alert_query

        post_request(alert_url, alert_payload_data)

def field_data_alert(team_name, app_id, cluster_name, tags, host_name):

    alert_url = constants.alert_base_url + team_name + constants.schedule_rules
    alert_name = constants.field_data_alert_name + host_name
    alert_query_x = constants.alert_base_query + app_id + '.' + cluster_name + constants.field_data_estimated_metric + host_name + '}'
    alert_query_y = constants.alert_base_query + app_id + '.' + cluster_name + constants.field_data_limit_metric + host_name + '}'

    with open(constants.alert_dual_series_file, 'r') as payload_json_file:
        alert_payload_data = json.load(payload_json_file)

    alert_payload_data[constants.name] = alert_name
    alert_payload_data[constants.tags][0] = tags
    alert_payload_data[constants.checks][0][constants.booleanExpression] = '$Xmax/$Ymax > 80'
    alert_payload_data[constants.checks][1][constants.booleanExpression] = '$Xmax/$Ymax > 90'
    alert_payload_data[constants.dataSerieses][constants.x][constants.query] = alert_query_x
    alert_payload_data[constants.dataSerieses][constants.y][constants.query] = alert_query_y

    post_request(alert_url, alert_payload_data)

if __name__ == '__main__':

    argL = len(sys.argv)
    if  argL < 5:
        print "usage: python es-cosmos_alert.py <team_name> <app_id> <cluster_name> <tags>"
        sys.exit(1)

    team_name = sys.argv[1]
    app_id = sys.argv[2]
    cluster_name = sys.argv[3]
    tags = sys.argv[4]

    if constants.debug == constants.true:
        LOG_LEVEL = logging.DEBUG
    else:
        LOG_LEVEL = logging.INFO

    logging.basicConfig(filename=constants.LOG_FILENAME,level=LOG_LEVEL)

    cluster_health_alert(team_name, app_id, cluster_name, tags)

    node_stats_response = get_request(constants.node_stats_url)
    node_stats_json_root = json.loads(node_stats_response)


    for node_id in node_stats_json_root[constants.nodes].keys():
        host_name = node_stats_json_root[constants.nodes][node_id][constants.host]
        os_memory_alert(team_name, app_id, cluster_name, tags, host_name)
        heap_memory_alert(team_name, app_id, cluster_name, tags, host_name)
        thread_pool_queue_alert(team_name, app_id, cluster_name, tags, host_name)
        thread_pool_rejected_alert(team_name, app_id, cluster_name, tags, host_name)
        field_data_alert(team_name, app_id, cluster_name, tags, host_name)
        break





