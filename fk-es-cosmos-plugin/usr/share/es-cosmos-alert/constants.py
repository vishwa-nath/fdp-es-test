import time
import socket

ip=[l for l in ([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")][:1], [[(s.connect(('8.8.8.8', 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) if l][0][0]
base_url = "http://"+ ip + ":"

node_stats_url = 'http://' + ip + ':9200' + '/_nodes/stats/'
nodes = 'nodes'
host = 'host'

alert_base_url = 'http://10.47.0.149/fk-alert-service/teams/'
schedule_rules = '/scheduledRules'
alert_base_query = 'start=20m-ago&m=max:'
alert_single_series_file = '/usr/share/es-cosmos-alert/alert_payload.json'
alert_dual_series_file = '/usr/share/es-cosmos-alert/alert_payload_dual.json'
name = 'name'
tags = 'tags'
checks = 'checks'
booleanExpression = 'booleanExpression'
dataSerieses = 'dataSerieses'
x = 'x'
y = 'y'
query = 'query'

cluster_health_alert_name = 'Alert_Rule_ES_Cluster_Status'
cluster_health_metric = '.cluster.status'

os_memory_alert_name = 'Alert_Rule_ES_OS_Memory_'
os_memory_metric = '.nodes.os.mem.used_percent{host_name='

heap_memory_alert_name = 'Alert_Rule_ES_Heap_Memory_'
heap_memory_metric = '.nodes.jvm.mem.heap_used_percent{host_name='

thread_pool = ['bulk', 'get', 'index', 'search']
thread_pool_alert_name = 'Alert_Rule_ES_thread_pool_'
queue = '_queue_'
thread_pool_metric = '.nodes.thread_pool.'
queue_metric = '.queue{host_name='
rejected = '_rejected_'
rejected_metric = '.rejected{host_name='

field_data_alert_name = 'Alert_Rule_ES_Field_Data_'
field_data_estimated_metric = '.nodes.breakers.fielddata.estimated_size_in_bytes{host_name='
field_data_limit_metric = '.nodes.breakers.fielddata.limit_size_in_bytes{host_name='

true='true'
debug = 'false'
ts = int(time.time())
LOG_FILENAME="/tmp/es-cosmos-alert." + str(ts) + ".log"
