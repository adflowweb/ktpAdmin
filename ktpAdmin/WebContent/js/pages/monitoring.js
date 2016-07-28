var tokenID = sessionStorage.getItem("tokenID");
var combined;
var idle;
var used;
var free;
var heapMax;
var heapUsed;
var heapFree;
var diskUsed = 0;
var diskUsed11;
var diskFree = 0;
var diskFree11;
sessionStorage.setItem("rcs-moveCount", 1);
sessionStorage.setItem("dig-moveCount", 1);
var pmsMovecontainerDig = $("#monitoring-transaction-second-dig");
var pmsMovecontainerRcs = $("#monitoring-transaction-second-rcs");
var digMoveData = [];
var digTpsData = [];
var rcsMoveData = [];
var rcsTpsData = [];
var rcsTps;
var digTps;

if (monitoringInterval) {
	console.log('in clear');
	sessionStorage.setItem("rcs-moveCount", 1);
	sessionStorage.setItem("dig-moveCount", 1);
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
			// tpsDigAccount: 0tpsPreckeck: 0
			rcsTps = item.tpsPreckeck;
			digTps = item.tpsDigAccount;

			console.log('모니터링');
			console.log(rcsTps);
			console.log(digTps);
			heapMax = item.heap.heapMax;
			heapUsed = item.heap.heapUsed;
			heapFree = heapMax - heapUsed;
			used = used.toFixed(1);
			free = free.toFixed(1);
			heapMax = heapMax.toFixed(1);
			heapUsed = heapUsed.toFixed(1);
			heapFree = heapFree.toFixed(1);

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
				console.log(sliceDiskUsed);
				console.log(sliceDiskFree);

				diskUsed = diskUsed + sliceDiskUsed;
				console.log(diskUsed);
				diskFree = diskFree + sliceDiskFree;
				console.log(diskUsed);
			}

			console.log('디스크 free');
			console.log(diskFree);
			console.log('디스크 사용');
			console.log(diskUsed);

			combined = combined.toFixed(1);
			idle = idle.toFixed(1);

			digTpsData.push(0);
			digMoveData.push([ 0, digTpsData[0] ]);
			digTpsData.push(digTps * 1);
			digMoveData.push([ 1, digTpsData[1] ]);

			// rcsTpsData

			rcsTpsData.push(0);
			rcsMoveData.push([ 0, rcsTpsData[0] ]);
			rcsTpsData.push(rcsTps * 1);
			rcsMoveData.push([ 1, rcsTpsData[1] ]);

		} else {
			console.log('server errors');
		}

	},
	error : function(data, textStatus, request) {
		console.log(data);

	}
});

rcsseries = [ {
	data : rcsMoveData,
	lines : {
		fill : true
	},
	resize : true
} ];

digseries = [ {
	data : digMoveData,
	lines : {
		fill : true
	},
	resize : true
} ];

var rcstpsGraphMax = 100;
for ( var i in rcsTpsData) {
	if (rcsTpsData[i] > 100) {
		rcstpsGraphMax = rcsTpsData[i] + 100;
	} else {
		rcstpsGraphMax = 100;
	}
}
var digtpsGraphMax = 100;
for ( var i in digTpsData) {
	if (digTpsData[i] > 100) {
		digtpsGraphMax = digTpsData[i] + 100;
	} else {
		digtpsGraphMax = 100;
	}
}

var rcsplot = $
		.plot(
				pmsMovecontainerRcs,
				rcsseries,
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
						max : rcstpsGraphMax
					},
					legend : {
						show : true
					}
				});

var digplot = $
		.plot(
				pmsMovecontainerDig,
				digseries,
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
						max : digtpsGraphMax
					},
					legend : {
						show : true
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

var monitoringInterval = setInterval(
		function() {
			console.log('!!!');
			for ( var i in rcsTpsData) {
				if (rcsTpsData[i] > rcstpsGraphMax) {
					rcstpsGraphMax = rcsTpsData[i] + 100;
				}
			}
			for ( var i in digTpsData) {
				if (digTpsData[i] > digtpsGraphMax) {
					digtpsGraphMax = digTpsData[i] + 100;
				}
			}

			var monitoringStatus = sessionStorage.getItem("monitoringStatus");
			console.log('monitoring status');
			console.log(monitoringStatus);
			if (monitoringStatus == "enable") {
				var rcsmoveCount = sessionStorage.getItem("rcs-moveCount");
				rcsmoveCount = rcsmoveCount * 1 + 1;
				sessionStorage.setItem("rcs-moveCount", rcsmoveCount);
				if (rcsmoveCount > 599) {
					rcsmoveCount = 600 * 1;
					sessionStorage.setItem("rcs-moveCount", rcsmoveCount);
				}
				var digmoveCount = sessionStorage.getItem("dig-moveCount");
				digmoveCount = digmoveCount * 1 + 1;
				sessionStorage.setItem("dig-moveCount", digmoveCount);
				if (digmoveCount > 599) {
					digmoveCount = 600 * 1;
					sessionStorage.setItem("dig-moveCount", digmoveCount);
				}

				$
						.ajax({
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
									rcsTps = item.tpsPreckeck;
									digTps = item.tpsDigAccount;
									heapMax = heapMax.toFixed(1);
									heapUsed = heapUsed.toFixed(1);
									heapFree = heapFree.toFixed(1);
									diskUsed = 0;
									diskFree = 0;
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

										console.log(sliceDiskUsed);
										console.log(sliceDiskFree);

										diskUsed = diskUsed + sliceDiskUsed;
										console.log(diskUsed);
										diskFree = diskFree + sliceDiskFree;
										console.log(diskUsed);
									}

									console.log('디스크 free');
									console.log(diskFree);
									console.log('디스크 사용');
									console.log(diskUsed);
									rcsTpsData.push(rcsTps * 1);

									if (rcsmoveCount > 599) {
										rcsTpsData = rcsTpsData.slice(1);
										rcsMoveData = [];
										for (var i = 0; i < rcsmoveCount; i++) {
											rcsMoveData
													.push([ i, rcsTpsData[i] ]);
										}
									} else {
										rcsMoveData.push([ rcsmoveCount * 1,
												rcsTps * 1 ]);
									}

									digTpsData.push(digTps * 1);

									if (digmoveCount > 599) {
										digTpsData = digTpsData.slice(1);
										digMoveData = [];
										for (var i = 0; i < digmoveCount; i++) {
											digMoveData
													.push([ i, digTpsData[i] ]);
										}
									} else {
										digMoveData.push([ digmoveCount * 1,
												digTps * 1 ]);
									}

									rcsseries = [ {
										data : rcsMoveData,
										lines : {
											fill : true
										},
										resize : true
									} ];

									digseries = [ {
										data : digMoveData,
										lines : {
											fill : true
										},
										resize : true
									} ];

									var rcsplot = $
											.plot(
													pmsMovecontainerRcs,
													rcsseries,
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
															max : rcstpsGraphMax
														},
														legend : {
															show : true
														}
													});

									var digplot = $
											.plot(
													pmsMovecontainerDig,
													digseries,
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
															max : digtpsGraphMax
														},
														legend : {
															show : true
														}
													});

									rcsseries[0].data = rcsMoveData;
									rcsplot.setData(rcsseries);
									rcsplot.draw();

									digseries[0].data = digMoveData;
									digplot.setData(digseries);
									digplot.draw();

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

		}, 6000);
