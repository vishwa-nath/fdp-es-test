// accessible variables in this scope
var window, document, $, jQuery, moment, kbn;

// All url parameters are available via the ARGS object
var ARGS;

return function(callback) {

	// Set a default timespan if its not specified
	if (_.isUndefined(ARGS.period)) {
		ARGS.period = "1h";
	}

	// get app Id from args
	if (_.isUndefined(ARGS.app)) {
		ARGS.app = prompt("Please enter app id");
	}

	// get cluster name from args
	if (_.isUndefined(ARGS.cluster)) {
		ARGS.cluster = prompt("Please enter cluster name");
	}

	// define panels
	var panels = [
		{
			"title": "ES Cluster Status",
			"span": 12,
			"colorBackground": true,
          	"colorValue": false,
          	"colors": [
            	"rgba(245, 54, 54, 0.9)",
            	"rgba(241, 232, 27, 0.89)",
            	"rgba(50, 172, 45, 0.97)"
          	],			
			"type": "singlestat",
			"thresholds": "-1,0,1",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "cluster.status",
					"alias": "ES Cluster Status",
					"tags": {  }
				}				
			]
		},	
		{
			"title": "Heap Memory Used",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.jvm.mem.heap_used_in_bytes",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.jvm.mem.heap_used_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Non Heap Memory Used",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.jvm.mem.non_heap_used_in_bytes",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.jvm.mem.non_heap_used_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Max CPU(%) User",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.os.cpu.user",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.os.cpu.user",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Max CPU(%) Sys",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.os.cpu.sys",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.os.cpu.sys",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Threads Count",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.jvm.threads.count",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.jvm.threads.count",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				},				
				{
					"aggregator": "max",
					"metric": "nodes.jvm.threads.peak_count",
					"alias": "Peak Count",
					"tags": { }
				}
			]
		},
		{
			"title": "Open File Descriptors",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.process.open_file_descriptors",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.process.open_file_descriptors",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "# of Writes Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.fs.total.disk_writes",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.fs.total.disk_writes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "# of Reads Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.fs.total.disk_reads",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.fs.total.disk_reads",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Max Cache Size (Filter Cache)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.filter_cache.memory_size_in_bytes",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.indices.filter_cache.memory_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Max Cache Size (Id Cache)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.id_cache.memory_size_in_bytes",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.indices.id_cache.memory_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Max Cache Size (Filed Data)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.fielddata.memory_size_in_bytes",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.indices.fielddata.memory_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				},				
				{
					"aggregator": "max",
					"metric": "nodes.breakers.fielddata.limit_size_in_bytes",
					"alias": "Limit",
					"tags": {  }
				}
			]
		},
		{
			"title": "Fetch Requests Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.search.fetch_total",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.indices.search.fetch_total",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Get Requests Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.get.total",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Indexing Requests Per Second (Index Total)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.indexing.index_total",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Query Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.search.query_total",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.indices.search.query_total",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Indexing Requests Per Second (Delete Total)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.indexing.delete_total",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Max Open Search Contexts",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.search.open_contexts",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.indices.search.open_contexts",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Channels (Transport Server Open)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.transport.server_open",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.transport.server_open",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Transport Size (Δ) Tx",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.transport.tx_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Transport Size (Δ) Rx",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.transport.rx_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Cache Evictions (Filter Cache)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.filter_cache.evictions",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Cache Evictions (Field Data)",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.indices.fielddata.evictions",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Bulk Active Threads",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.thread_pool.bulk.active",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.thread_pool.bulk.active",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Index Active Threads",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.thread_pool.index.active",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Refresh Active Threads",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.thread_pool.refresh.active",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Search Active Threads",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.thread_pool.search.active",
					"alias": "Non Data Nodes",
					"tags": { "is_data": "false" }
				},
				{
					"aggregator": "max",
					"metric": "nodes.thread_pool.search.active",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" }
				}				
			]
		},
		{
			"title": "Write Size Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.fs.total.disk_write_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "Read Size Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"bytes",
				"bytes"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.fs.total.disk_read_size_in_bytes",
					"alias": "Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}				
			]
		},
		{
			"title": "GC Count Per Second",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "nodes.jvm.gc.collectors.young.collection_count",
					"alias": "Young Gen Count Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.jvm.gc.collectors.young.collection_count",
					"alias": "Young Gen Count Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				},				
				{
					"aggregator": "max",
					"metric": "nodes.jvm.gc.collectors.old.collection_count",
					"alias": "Old Gen Count Non Data Nodes",
					"tags": { "is_data": "false" },
					"shouldComputeRate": true
				},
				{
					"aggregator": "max",
					"metric": "nodes.jvm.gc.collectors.old.collection_count",
					"alias": "Old Gen Count Data Nodes",
					"tags": { "is_data": "true" },
					"shouldComputeRate": true
				}
			]
		},
		{
			"title": "Cluster Nodes Count",
			"span": 4,
			"type": "graph",
			"y_formats": [
				"short",
				"short"
			],
			"fill": 1,
			"linewidth": 1,
			"stack": false,
			"targets": [
				{
					"aggregator": "max",
					"metric": "cluster.nodes.count.total",
					"alias": "Total",
					"tags": { }
				},
				{
					"aggregator": "max",
					"metric": "cluster.nodes.count.master_only",
					"alias": "Master Only",
					"tags": { }
				},				
				{
					"aggregator": "max",
					"metric": "cluster.nodes.count.master_data",
					"alias": "Master Data",
					"tags": { }
				},
				{
					"aggregator": "max",
					"metric": "cluster.nodes.count.data_only",
					"alias": "Data Only",
					"tags": { }
				},
				{
					"aggregator": "max",
					"metric": "cluster.nodes.count.client",
					"alias": "Client",
					"tags": { }
				}				
			]
		}		
	]

	for (var i in panels) {
		for (var j in panels[i].targets) {
			panels[i].targets[j].downsampleAggregator = "avg";
			panels[i].targets[j].downsampleInterval = "";
		}
	}


	$.get("/public/dashboards/config.json").success(function(config) {

		if (config.usePrefix) {
			for (var i in panels) {
				for (var j in panels[i].targets) {
					panels[i].targets[j].metric = ARGS.app + "." + ARGS.cluster + "." + panels[i].targets[j].metric;
				}
			}
		}

		callback({
			"title": "Elastic Search Metrics",
			"style": "light",
			"time": {
				"from": "now-1h",
				"to": "now"
			},
			"refresh": "1m",
			"rows": [{
				"title": "Elastic Search Metrics",
				"height": "180px",
				"panels": panels
			}]
		});

	})

}
