var tokenID = sessionStorage.getItem("tokenID");
var combined;
var idle;
var used;
var free;
var heapMax;
var heapUsed;
var heapFree;
var diskUsed;
var diskUsed11;
var diskFree;
var diskFree11;

if (monitoringInterval) {
	console.log('in clear');
	clearInterval(monitoringInterval);
}

$.ajax({
	url : '/v1/server',
	type : 'GET',
	headers : {
		'X-ApiKey' : tokenID
	},
	contentType : "application/json",
	async : false,
	success : function(data) {

		if (data.result.success) {

			var item = data.result.data;
			console.log(item);
			// var heapMax;
			// var heapUsed;
			// var heapFree;

			combined = item.cpu.combined;
			idle = item.cpu.idle;
			combined = combined * 100;
			idle = idle * 100;
			used = item.memory.used * 0.001;
			free = item.memory.free * 0.001;

			heapMax = item.heap.heapMax;
			heapUsed = item.heap.heapUsed;
			heapFree = heapMax - heapUsed;
			used = used.toFixed(1);
			free = free.toFixed(1);
			heapMax = heapMax.toFixed(1);
			heapUsed = heapUsed.toFixed(1);
			heapFree = heapFree.toFixed(1);
			diskUsed = item.disk[0].used;
			diskUsed11 = item.disk[11].used;
			diskFree = item.disk[0].avail;
			diskFree11 = item.disk[11].avail;
			diskUsed = pmsDiskUsed.slice(0, -1);
			diskUsed11 = pmsDiskUsed11.slice(0, -1);
			diskFree = pmsDiskFree.slice(0, -1);
			diskFree11 = pmsDiskFree11.slice(0, -1);

			if (item.disk[0].used.indexOf("G") > -1) {
				diskUsed *= 1;
			} else {
				diskUsed *= 0.001;
			}

			if (item.disk[0].avail.indexOf("G") > -1) {
				diskFree *= 1;

			} else {
				diskFree *= 0.001;
			}

			if (item.disk[11].used.indexOf("G") > -1) {
				diskUsed11 *= 1;
			} else {
				diskUsed11 *= 0.001;
			}

			if (item.disk[11].avail.indexOf("G") > -1) {
				diskFree11 *= 1;

			} else {
				diskFree11 *= 0.001;
			}
			diskUsed = diskUsed + diskUsed11;
			diskFree = diskFree + diskFree11;

			combined = combined.toFixed(1);
			idle = idle.toFixed(1);

		} else {
			console.log('server errors');
		}

	},
	error : function(data, textStatus, request) {
		console.log(data);

	}
});

var morrisDataCpu = Morris.Donut({
	element : 'morris-donut-chart-cpu',
	data : [ {
		label : "Combined",
		value : combined
	}, {
		label : "idle",
		value : idle
	} ],

	// colors: [
	// 'red',
	// 'rgb(11, 98, 164)',
	// ],
	resize : true
});

var morrisDataMemory = Morris.Donut({
	element : 'morris-donut-chart-memory',
	data : [ {
		label : "Memory used",
		value : used
	}, {
		label : "Memory free",
		value : free
	} ],
	// colors: [
	// 'rgb(11, 98, 164)',
	// 'aqua',
	// ],
	resize : true
});

var morrisDataheap = Morris.Donut({
	element : 'morris-donut-chart-heap',
	data : [ {
		label : "Heap Used",
		value : heapUsed
	}, {
		label : "Heap Free",
		value : heapFree
	} ],
	resize : true
});

var morrisDatadisk = Morris.Donut({
	element : 'morris-donut-chart-disk',
	data : [ {
		label : "Disk used",
		value : diskUsed
	}, {
		label : "Disk free",
		value : diskFree
	} ],
	resize : true
});
// tps

var monitoringInterval = setInterval(function() {
	console.log('!!!');
	var monitoringStatus = sessionStorage.getItem("monitoringStatus");
	console.log('monitoring status');
	console.log(monitoringStatus);
	if (monitoringStatus == "enable") {

		$.ajax({
			url : '/v1/server',
			type : 'GET',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			async : false,
			success : function(data) {

				if (data.result.success) {

					var item = data.result.data;
					console.log(item);
					combined = item.cpu.combined;
					idle = item.cpu.idle;
					combined = combined * 100;
					idle = idle * 100;
					used = item.memory.used * 0.001;
					free = item.memory.free * 0.001;
					used = used.toFixed(1);
					free = free.toFixed(1);
					combined = combined.toFixed(1);
					idle = idle.toFixed(1);
					heapMax = item.heap.heapMax;
					heapUsed = item.heap.heapUsed;
					heapFree = heapMax - heapUsed;

					heapMax = heapMax.toFixed(1);
					heapUsed = heapUsed.toFixed(1);
					heapFree = heapFree.toFixed(1);
					diskUsed = item.disk[0].used;
					diskUsed11 = item.disk[11].used;
					diskFree = item.disk[0].avail;
					diskFree11 = item.disk[11].avail;
					diskUsed = pmsDiskUsed.slice(0, -1);
					diskUsed11 = pmsDiskUsed11.slice(0, -1);
					diskFree = pmsDiskFree.slice(0, -1);
					diskFree11 = pmsDiskFree11.slice(0, -1);

					if (item.disk[0].used.indexOf("G") > -1) {
						diskUsed *= 1;
					} else {
						diskUsed *= 0.001;
					}

					if (item.disk[0].avail.indexOf("G") > -1) {
						diskFree *= 1;

					} else {
						diskFree *= 0.001;
					}

					if (item.disk[11].used.indexOf("G") > -1) {
						diskUsed11 *= 1;
					} else {
						diskUsed11 *= 0.001;
					}

					if (item.disk[11].avail.indexOf("G") > -1) {
						diskFree11 *= 1;

					} else {
						diskFree11 *= 0.001;
					}
					diskUsed = diskUsed + diskUsed11;
					diskFree = diskFree + diskFree11;
					console.log('disk start');
					console.log(diskUsed);
					console.log(diskFree);
					console.log('disk end');
					morrisDataCpu.setData([ {
						label : "Combined",
						value : combined
					}, {
						label : "idle",
						value : idle
					} ]);

					morrisDataMemory.setData([ {
						label : "Memory used",
						value : used
					}, {
						label : "Memory free",
						value : free
					} ]);

					morrisDataheap.setData([ {
						label : "Heap Used",
						value : heapUsed
					}, {
						label : "Heap Free",
						value : heapFree
					} ]);
					// morrisDataheap
					// morrisDatadisk
					morrisDatadisk.setData([ {
						label : "Disk used",
						value : diskUsed
					}, {
						label : "Disk free",
						value : diskFree
					} ]);

				} else {
					console.log('server errors');
				}

			},
			error : function(data, textStatus, request) {
				console.log(data);

			}
		});
	}

}, 10000);
