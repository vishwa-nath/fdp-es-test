import socket
import time

config_file = '/usr/share/es-cosmos-plugin/config.yml'

ip=[l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")][:1], [[(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) if l][0][0]
base_url = "http://"+ ip + ":"
sleep_cmd = 'sleep 60'

cluster_state_version_url = '/_cluster/state/version'
cluster_health_uri = '/_cluster/health'
cluster_name = 'cluster_name'
count = 'count'

cluster_stats_url = '/_cluster/stats/'
cluster = "cluster"
status = "status"
green = "green"
yellow = "yellow"
red = "red"

node_stats_url = '/_nodes/stats/'
nodes = 'nodes'
name = 'name'
host = 'host'
attributes = 'attributes'
master = 'master'
data = 'data'
true = 'true'
client = 'client'
timestamp='timestamp'

debug = 'false'
LOG_FILENAME="/tmp/es-cosmos-plugin." + ".log"
