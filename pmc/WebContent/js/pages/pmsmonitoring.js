//getToken
var pmsMonitokenID = sessionStorage.getItem("token");
var pmsCombined;
var pmsIdle;
var pmsUsed;
var pmsFree;
var pmsHeapMax;
var pmsHeapUsed;
var pmsHeapFree;
var pmsDiskUsed = 0;

var pmsDiskFree = 0;

var pmsTps;
sessionStorage.setItem("moveCount", 1);
var pmsMovecontainer = $("#monitoring-transaction-second");
var moveData = [];
var tpsData = [];
if (monitoringInterval) {

	sessionStorage.setItem("moveCount", 1);
	clearInterval(monitoringInterval);
}
// getServerInfo
$.ajax({
	url : '/v1/pms/adm/sys/server',
	type : 'GET',
	headers : {
		'X-Application-Token' : pmsMonitokenID
	},
	contentType : "application/json",
	async : false,
	success : function(data) {

		if (data.result.success) {

			var item = data.result.data;

			pmsCombined = item.cpu.combined;

			pmsIdle = item.cpu.idle;
			pmsCombined = pmsCombined * 100;
			pmsIdle = pmsIdle * 100;
			pmsUsed = item.memory.actualUsed * 0.001;

			pmsFree = item.memory.actualFree * 0.001;

			pmsHeapMax = item.heap.heapMax;
			pmsHeapUsed = item.heap.heapUsed;
			pmsHeapFree = pmsHeapMax - pmsHeapUsed;
			pmsUsed = pmsUsed.toFixed(1);
			pmsFree = pmsFree.toFixed(1);
			pmsHeapMax = pmsHeapMax.toFixed(1);
			pmsHeapUsed = pmsHeapUsed.toFixed(1);
			pmsHeapFree = pmsHeapFree.toFixed(1);
			pmsTps = item.tps;

			for ( var i in item.disk) {
				var orgDiskUsed = item.disk[i].used;
				var orgDiskFree = item.disk[i].avail;
				var sliceDiskUsed = 0;
				var sliceDiskFree = 0;

				if (orgDiskUsed.indexOf("G") > -1) {
					sliceDiskUsed = orgDiskUsed.slice(0, -1);
					sliceDiskUsed *= 1;
				} else if (orgDiskUsed.indexOf("M") > -1) {
					sliceDiskUsed = orgDiskUsed.slice(0, -1);
					sliceDiskUsed *= 0.001;
				} else if (orgDiskUsed.indexOf("K") > -1) {
					console.log('K')
					sliceDiskUsed = orgDiskUsed.slice(0, -1);
					sliceDiskUsed *= 0.000001;
				} else {
					sliceDiskUsed = 0

				}

				if (orgDiskFree.indexOf("G") > -1) {
					sliceDiskFree = orgDiskFree.slice(0, -1);
					sliceDiskFree *= 1;
				} else if (orgDiskFree.indexOf("M") > -1) {
					sliceDiskFree = orgDiskFree.slice(0, -1);
					sliceDiskFree *= 0.001;
				} else if (orgDiskFree.indexOf("K") > -1) {
					sliceDiskFree = orgDiskFree.slice(0, -1);
					sliceDiskFree *= 0.000001;
				} else {
					sliceDiskFree = 0;
				}

				pmsDiskUsed = pmsDiskUsed + sliceDiskUsed;

				pmsDiskFree = pmsDiskFree + sliceDiskFree;

			}

			tpsData.push(0);
			moveData.push([ 0, tpsData[0] ]);
			tpsData.push(pmsTps * 1);
			moveData.push([ 1, tpsData[1] ]);

			pmsCombined = pmsCombined.toFixed(1);
			pmsIdle = pmsIdle.toFixed(1);

		} else {

		}

	},
	error : function(data, textStatus, request) {

	}
});

series = [ {
	data : moveData,
	lines : {
		fill : true
	},
	resize : true
} ];
var tpsGraphMax = 100;
for ( var i in tpsData) {
	if (tpsData[i] > 100) {
		tpsGraphMax = tpsData[i] + 100;
	} else {
		tpsGraphMax = 100;
	}
}
// plot chart (tps chart)
var plot = $
		.plot(
				pmsMovecontainer,
				series,
				{
					grid : {
						borderWidth : 1,
						minBorderMargin : 20,
						labelMargin : 10,
						backgroundColor : {
							colors : [ "#fff", "#e4f4f4" ]
						},
						margin : {
							top : 8,
							bottom : 20,
							left : 20
						},
						markings : function(axes) {
							var markings = [];
							var xaxis = axes.xaxis;
							for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
								markings.push({
									xaxis : {
										from : x,
										to : x + xaxis.tickSize
									},
									color : "rgba(232, 232, 255, 0.2)"
								});
							}
							return markings;
						}
					},
					xaxis : {
						tickFormatter : function() {
							return "";
						}
					},
					yaxis : {
						min : 0,
						max : tpsGraphMax
					},
					legend : {
						show : true
					}
				});
// cpu chart
var morrisDataCpu = Morris.Donut({
	element : 'morris-donut-chart-cpu',
	data : [ {
		label : "Combined",
		value : pmsCombined
	}, {
		label : "idle",
		value : pmsIdle
	} ],

	resize : true
});

// memory chart
var morrisDataMemory = Morris.Donut({
	element : 'morris-donut-chart-memory',
	data : [ {
		label : "Memory used",
		value : pmsUsed
	}, {
		label : "Memory free",
		value : pmsFree
	} ],

	resize : true
});

// heap chart
var morrisDataheap = Morris.Donut({
	element : 'morris-donut-chart-heap',
	data : [ {
		label : "Heap Used",
		value : pmsHeapUsed
	}, {
		label : "Heap Free",
		value : pmsHeapFree
	} ],
	resize : true
});

// dist chart
var morrisDatadisk = Morris.Donut({
	element : 'morris-donut-chart-disk',
	data : [ {
		label : "Disk used",
		value : pmsDiskUsed
	}, {
		label : "Disk free",
		value : pmsDiskFree
	} ],
	resize : true
});

// interval
var monitoringInterval = setInterval(
		function() {

			for ( var i in tpsData) {
				if (tpsData[i] > tpsGraphMax) {
					tpsGraphMax = tpsData[i] + 100;
				}
			}

			var monitoringStatus = sessionStorage.getItem("monitoringStatus");

			if (monitoringStatus == "enable") {
				var moveCount = sessionStorage.getItem("moveCount");
				moveCount = moveCount * 1 + 1;
				sessionStorage.setItem("moveCount", moveCount);
				if (moveCount > 599) {
					moveCount = 600 * 1;
					sessionStorage.setItem("moveCount", moveCount);
				}
				$
						.ajax({
							url : '/v1/pms/adm/sys/server',
							type : 'GET',
							headers : {
								'X-Application-Token' : pmsMonitokenID
							},
							contentType : "application/json",
							async : false,
							success : function(data) {

								if (data.result.success) {

									var item = data.result.data;

									pmsCombined = item.cpu.combined;
									pmsIdle = item.cpu.idle;
									pmsCombined = pmsCombined * 100;
									pmsIdle = pmsIdle * 100;
									pmsUsed = item.memory.actualUsed * 0.001;
									pmsFree = item.memory.actualFree * 0.001;
									pmsUsed = pmsUsed.toFixed(1);
									pmsFree = pmsFree.toFixed(1);
									pmsCombined = pmsCombined.toFixed(1);
									pmsIdle = pmsIdle.toFixed(1);
									pmsHeapMax = item.heap.heapMax;
									pmsHeapUsed = item.heap.heapUsed;
									pmsHeapFree = pmsHeapMax - pmsHeapUsed;
									pmsTps = item.tps;
									pmsHeapMax = pmsHeapMax.toFixed(1);
									pmsHeapUsed = pmsHeapUsed.toFixed(1);
									pmsHeapFree = pmsHeapFree.toFixed(1);
									pmsDiskUsed = 0;

									pmsDiskFree = 0;

									for ( var i in item.disk) {
										var orgDiskUsed = item.disk[i].used;
										var orgDiskFree = item.disk[i].avail;
										var sliceDiskUsed = 0;
										var sliceDiskFree = 0;

										if (orgDiskUsed.indexOf("G") > -1) {
											sliceDiskUsed = orgDiskUsed.slice(
													0, -1);
											sliceDiskUsed *= 1;
										} else if (orgDiskUsed.indexOf("M") > -1) {
											sliceDiskUsed = orgDiskUsed.slice(
													0, -1);
											sliceDiskUsed *= 0.001;
										} else if (orgDiskUsed.indexOf("K") > -1) {
											console.log('K')
											sliceDiskUsed = orgDiskUsed.slice(
													0, -1);
											sliceDiskUsed *= 0.000001;
										} else {
											sliceDiskUsed = 0

										}

										if (orgDiskFree.indexOf("G") > -1) {
											sliceDiskFree = orgDiskFree.slice(
													0, -1);
											sliceDiskFree *= 1;
										} else if (orgDiskFree.indexOf("M") > -1) {
											sliceDiskFree = orgDiskFree.slice(
													0, -1);
											sliceDiskFree *= 0.001;
										} else if (orgDiskFree.indexOf("K") > -1) {
											sliceDiskFree = orgDiskFree.slice(
													0, -1);
											sliceDiskFree *= 0.000001;
										} else {
											sliceDiskFree = 0;
										}

										pmsDiskUsed = pmsDiskUsed
												+ sliceDiskUsed;

										pmsDiskFree = pmsDiskFree
												+ sliceDiskFree;

									}
									tpsData.push(pmsTps * 1);

									if (moveCount > 599) {
										tpsData = tpsData.slice(1);
										moveData = [];
										for (var i = 0; i < moveCount; i++) {
											moveData.push([ i, tpsData[i] ]);
										}
									} else {
										moveData.push([ moveCount * 1,
												pmsTps * 1 ]);
									}

									series = [ {
										data : moveData,
										lines : {
											fill : true
										},
										resize : true
									} ];

									var plot = $
											.plot(
													pmsMovecontainer,
													series,
													{
														grid : {
															borderWidth : 1,
															minBorderMargin : 20,
															labelMargin : 10,
															backgroundColor : {
																colors : [
																		"#fff",
																		"#e4f4f4" ]
															},
															margin : {
																top : 8,
																bottom : 20,
																left : 20
															},
															markings : function(
																	axes) {
																var markings = [];
																var xaxis = axes.xaxis;
																for (var x = Math
																		.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
																	markings
																			.push({
																				xaxis : {
																					from : x,
																					to : x
																							+ xaxis.tickSize
																				},
																				color : "rgba(232, 232, 255, 0.2)"
																			});
																}
																return markings;
															}
														},
														xaxis : {
															tickFormatter : function() {
																return "";
															}
														},
														yaxis : {
															min : 0,
															max : tpsGraphMax
														},
														legend : {
															show : true
														}
													});

									series[0].data = moveData;
									plot.setData(series);
									plot.draw();
									morrisDataCpu.setData([ {
										label : "Combined",
										value : pmsCombined
									}, {
										label : "idle",
										value : pmsIdle
									} ]);

									morrisDataMemory.setData([ {
										label : "Memory used",
										value : pmsUsed
									}, {
										label : "Memory free",
										value : pmsFree
									} ]);

									morrisDataheap.setData([ {
										label : "Heap Used",
										value : pmsHeapUsed
									}, {
										label : "Heap Free",
										value : pmsHeapFree
									} ]);

									morrisDatadisk.setData([ {
										label : "Disk used",
										value : pmsDiskUsed
									}, {
										label : "Disk free",
										value : pmsDiskFree
									} ]);

								} else {

								}

							},
							error : function(data, textStatus, request) {

							}
						});
			}

		}, 6000);
