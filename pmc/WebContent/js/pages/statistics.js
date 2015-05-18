//getToken
var statisticsToken = sessionStorage.getItem("token");
// getRole
var statisticsRole = sessionStorage.getItem("role");
$("#statistics-search-date-start-input").prop('disabled', true);
$("#statistics-search-date-end-input").prop('disabled', true);
// $("#statistics-reservation-search-date-start-input").prop('disabled', true);
// $("#statistics-reservation-search-date-end-input").prop('disabled', true);
$('#statistics-search-date-month-input').prop('disabled', true);
$('#statistics-reservation-search-date-month-input').prop('disabled', true);

// getAccount Info
$.ajax({
	url : '/v1/pms/adm/' + statisticsRole + '/users',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : statisticsToken
	},
	dataType : 'json',
	async : false,

	success : function(data) {

		var dataResult = data.result.data;

		if (!data.result.errors) {

			for ( var i in data.result.data) {
				var successData = dataResult[i];

				if (successData.role == "sys") {

				} else if (successData.role == "svc") {
					$("#statistics-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>"
									+ successData.userId + "</option>");
					$("#statistics-reservation-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>"
									+ successData.userId + "</option>");
				} else if (successData.role == "svcadm") {
					$("#statistics-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>"
									+ successData.userId + "</option>");
					$("#statistics-reservation-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>"
									+ successData.userId + "</option>");
				}

			}

		} else {

			alert(data.result.errors[0]);
		}

	},
	error : function(data, textStatus, request) {

	}
});

// create messageList(systemAdmin)
var statisticsTable = $('#statistics-datatable')
		.dataTable(
				{
					'bServerSide' : true,
					'bSort' : false,
					"pageLength" : 25,
					"oLanguage" : {
						"oPaginate" : {
							"sFirst" : "처음",
							"sLast" : "끝",
							"sNext" : "다음",
							"sPrevious" : "이전"
						}
					},
					bScrollCollapse : true,
					scrollX : true,
					'dom' : '<"clear">lrtip',
					'columns' : [ {
						"data" : "updateTime"
					}, {
						"data" : "issueName"
					}, {
						"data" : "receiver"
					}, {
						"data" : "status"
					}, {
						"data" : "pmaAckType"
					}, {
						"data" : "pmaAckTime"
					}, {
						"data" : "appAckType"
					}, {
						"data" : "appAckTime"
					}, {
						"data" : "resendCount"
					}, {
						"data" : "resendInterval"
					}, {
						"data" : "serviceId"
					}, {
						"data" : "msgId"
					} ],
					'sPaginationType' : 'full_numbers',
					'sAjaxSource' : '/v1/pms/adm/' + statisticsRole
							+ '/messages',
					// custom ajax
					'fnServerData' : function(sSource, aoData, fnCallback) {
						$
								.ajax({
									dataType : 'json',
									contentType : 'application/json;charset=UTF-8',
									type : 'GET',
									url : sSource,
									headers : {
										'X-Application-Token' : statisticsToken
									},
									data : aoData,

									success : function(data) {

										if (!data.result.errors) {
											var dataResult = data.result.data.data;

											// $('#reservationListCnt_div')
											// .text(
											// data.result.data.recordsTotal);
											$('#statisticsListCnt_div')
													.text(
															data.result.data.recordsTotal);
											for ( var i in dataResult) {

												if (dataResult[i].issueName == null) {
													dataResult[i].issueName = dataResult[i].updateId;
												}

												if (dataResult[i].pmaAckType == null) {

													dataResult[i].pmaAckType = '응답없음';
												} else {
													dataResult[i].pmaAckType = '수신확인';
													var dateTime = dataResult[i].pmaAckTime;
													dataResult[i].pmaAckTime = new Date(
															dateTime)
															.toLocaleString();
												}

												if (dataResult[i].appAckType == null) {

													dataResult[i].appAckType = '응답없음';
												} else {
													dataResult[i].appAckType = '메시지확인';
													var dateTime = dataResult[i].appAckTime;
													dataResult[i].appAckTime = new Date(
															dateTime)
															.toLocaleString();
												}

												switch (dataResult[i].status) {
												case -99:
													dataResult[i].status = "발송오류";
													var dateTime = dataResult[i].updateTime;
													dataResult[i].updateTime = new Date(
															dateTime)
															.toLocaleString();
													break;
												case -2:
													dataResult[i].status = "수신자없음";
													var dateTime = dataResult[i].updateTime;
													dataResult[i].updateTime = new Date(
															dateTime)
															.toLocaleString();
													break;
												case -1:
													dataResult[i].status = "허용갯수초과";
													var dateTime = dataResult[i].updateTime;
													dataResult[i].updateTime = new Date(
															dateTime)
															.toLocaleString();
													break;
												case 0:
													dataResult[i].status = "발송중";
													if (dataResult[i].reservationTime == null) {

														var dateTime = dataResult[i].updateTime;
														dataResult[i].updateTime = new Date(
																dateTime)
																.toLocaleString();
													} else {
														var dateTime = dataResult[i].reservationTime;
														dataResult[i].updateTime = new Date(
																dateTime)
																.toLocaleString()
																+ "(예약)";
													}
													break;
												case 1:
													dataResult[i].status = "발송됨";
													var dateTime = dataResult[i].updateTime;
													dataResult[i].updateTime = new Date(
															dateTime)
															.toLocaleString();
													break;
												case 2:
													dataResult[i].status = "예약취소됨";
													var dateTime = dataResult[i].updateTime;
													dataResult[i].updateTime = new Date(
															dateTime)
															.toLocaleString();
													break;

												}

												dataResult[i].resendInterval = dataResult[i].resendInterval
														+ "분";

											}

											data.result.data.data = dataResult;
											fnCallback(data.result.data);

										} else {
											alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');

										}

									},
									error : function(e) {
										alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');
									}
								});
					},

					'fnServerParams' : function(aoData) {

						var accountSelectValue = $('#statistics-account-select')
								.val();
						var searchSelectValue = $('#statistics-search-select')
								.val();
						var searchSelectText = $(
								'#statistics-search-select option:selected')
								.text();
						var accountSelectText = $(
								'#statistics-account-select option:selected')
								.text();
						var searchInputValue = $('#statistics-search-input')
								.val();
						var searchDateStart = $(
								'#statistics-search-date-start-input').val();
						var searchDateEnd = $(
								'#statistics-search-date-end-input').val();
						var searchMonth = $(
								'#statistics-search-date-month-input').val();

						if (searchMonth == null || searchMonth == "") {
							var nowDate = new Date();
							var year = nowDate.getFullYear();
							var month = nowDate.getMonth() + 1;

							if (month < 10) {
								month = '0' + month;
							}

							searchMonth = year + "/" + month;

							$('#statistics-search-date-month-input').val(
									searchMonth);
						}

						searchMonth = searchMonth.replace("/", "");

						aoData.push({
							'name' : 'cSearchDate',
							'value' : searchMonth
						});
						//						

						if (searchDateStart != "") {
							searchDateStart = dateFormating(searchDateStart);
							// 시작일
							if (searchDateStart) {

								searchDateStart = searchDateStart.toISOString();

								aoData.push({
									'name' : 'cSearchDateStart',
									'value' : searchDateStart
								});
							}
						}

						if (searchDateEnd != "") {
							searchDateEnd = dateFormating(searchDateEnd);

							// 종료일
							if (searchDateEnd) {

								searchDateEnd = searchDateEnd.toISOString();

								aoData.push({
									'name' : 'cSearchDateEnd',
									'value' : searchDateEnd
								});
							}
						}
						// 검색 조건 서치 vlaue

						searchSelectValue = searchSelectValue * 1;
						switch (searchSelectValue) {
						case 0:
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});
							break;
						// status
						case 1:
							var statusValue = $(
									'#statistics-search-status-select option:selected')
									.val();
							// messagelist-search-status-select
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : statusValue
							});
							break;
						// msgid
						case 2:
							searchSelectText = "msgId";
							aoData.push({
								'name' : 'cSearchFilter',
								'value' : searchSelectText
							});
							aoData.push({
								'name' : 'cSearchContent',
								'value' : searchInputValue
							});
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});

							break;
						// receiver
						case 3:
							searchSelectText = "receiver";

							aoData.push({
								'name' : 'cSearchFilter',
								'value' : searchSelectText
							});
							aoData.push({
								'name' : 'cSearchContent',
								'value' : searchInputValue
							});
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});

							break;
						// ack
						case 4:
							var ackValue = $(
									'#statistics-search-ack-select option:selected')
									.val();
							searchSelectText = "ack";

							aoData.push({
								'name' : 'cSearchFilter',
								'value' : searchSelectText
							});
							aoData.push({
								'name' : 'cSearchContent',
								'value' : ackValue
							});
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});

							break;

						default:

							break;
						}

						// 계정을 선택 했을경우
						if (accountSelectValue != 0) {
							aoData.push({
								'name' : 'userId',
								'value' : accountSelectText
							});
						}

						// aoData.push({
						// 'name' : 'cSearchDate',
						// 'value' : defaultMonth
						// });

					}

				});

// create reservationTable(sysAdmin)
var statisticsReservationTable = $('#statistics-reservation-datatable')
		.dataTable(
				{

					'bServerSide' : true,
					'bSort' : false,
					"pageLength" : 25,
					"oLanguage" : {
						"oPaginate" : {
							"sFirst" : "처음",
							"sLast" : "끝",
							"sNext" : "다음",
							"sPrevious" : "이전"
						}
					},
					'dom' : '<"clear">lrtip',
					'columns' : [ {
						"data" : "reservationTime"
					}, {
						"data" : "issueName"
					}, {
						"data" : "receiver"
					}, {
						"data" : "serviceId"
					}, {
						"data" : "msgId"
					} ],
					'sPaginationType' : 'full_numbers',
					'sAjaxSource' : '/v1/pms/adm/' + statisticsRole
							+ '/messages/reservations',
					'fnServerData' : function(sSource, aoData, fnCallback) {
						$
								.ajax({
									dataType : 'json',
									contentType : 'application/json;charset=UTF-8',
									type : 'GET',
									url : sSource,
									headers : {
										'X-Application-Token' : statisticsToken
									},
									data : aoData,

									success : function(data) {

										if (!data.result.errors) {
											var dataResult = data.result.data.data;
											console.log(dataResult);
											$(
													'#statisticsList-reservation-Cnt_div')
													.text(
															data.result.data.recordsTotal);
											for ( var i in dataResult) {

												if (dataResult[i].issueName == null) {
													dataResult[i].issueName = dataResult[i].updateId;
												}

												var dateTime = dataResult[i].reservationTime;

												if (dateTime != null) {
													dataResult[i].reservationTime = new Date(
															dateTime)
															.toLocaleString();
												}

											}

											data.result.data.data = dataResult;
											fnCallback(data.result.data);

										} else {
											alert('예약 메시지 목록을 가지고 오는데 실패하였습니다.');

										}

									},
									error : function(e) {
										alert('예약 메시지 목록을 가지고 오는데 실패 하였습니다.');
									}
								});
					},
					//
					// },
					// custom params
					'fnServerParams' : function(aoData) {
						// 계정select
						var accountSelectValue = $(
								'#statistics-reservation-account-select').val();
						var searchSelectValue = $(
								'#statistics-reservation-search-select').val();
						var searchSelectText = $(
								'#statistics-reservation-search-select option:selected')
								.text();
						var accountSelectText = $(
								'#statistics-reservation-account-select option:selected')
								.text();
						var searchInputValue = $(
								'#statistics-reservation-search-input').val();

						// var searchDateStart = $(
						// '#statistics-reservation-search-date-start-input')
						// .val();
						// var searchDateEnd = $(
						// '#statistics-reservation-search-date-end-input')
						// .val();
						var searchMonth = $(
								'#statistics-reservation-search-date-month-input')
								.val();

						if (searchMonth == null || searchMonth == "") {
							var nowDate = new Date();
							var year = nowDate.getFullYear();
							var month = nowDate.getMonth() + 1;

							if (month < 10) {
								month = '0' + month;
							}

							searchMonth = year + "/" + month;

							$('#statistics-reservation-search-date-month-input')
									.val(searchMonth);
						}

						searchMonth = searchMonth.replace("/", "");

						aoData.push({
							'name' : 'cSearchDate',
							'value' : searchMonth
						});

						// if (searchDateStart != "") {
						// searchDateStart = dateFormating(searchDateStart);
						// // 시작일
						// if (searchDateStart) {
						//
						// searchDateStart = searchDateStart.toISOString();
						//
						// aoData.push({
						// 'name' : 'cSearchDateStart',
						// 'value' : searchDateStart
						// });
						// }
						// }

						// if (searchDateEnd != "") {
						// searchDateEnd = dateFormating(searchDateEnd);
						//
						// if (searchDateEnd) {
						//
						// searchDateEnd = searchDateEnd.toISOString();
						//
						// aoData.push({
						// 'name' : 'cSearchDateEnd',
						// 'value' : searchDateEnd
						// });
						// }
						// }

						searchSelectValue = searchSelectValue * 1;
						switch (searchSelectValue) {
						case 0:
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});
							break;
						// msgid
						case 1:
							searchSelectText = "msgId";
							aoData.push({
								'name' : 'cSearchFilter',
								'value' : searchSelectText
							});
							aoData.push({
								'name' : 'cSearchContent',
								'value' : searchInputValue
							});
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});

							break;
						// receiver
						case 2:
							searchSelectText = "receiver";

							aoData.push({
								'name' : 'cSearchFilter',
								'value' : searchSelectText
							});
							aoData.push({
								'name' : 'cSearchContent',
								'value' : searchInputValue
							});
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : 'ALL'
							});

							break;

						default:

							break;
						}

						if (accountSelectValue != 0) {
							aoData.push({
								'name' : 'userId',
								'value' : accountSelectText
							});
						}

					}

				});

// searchBtn Click
function statisticsDateSearch() {

	var formCheck = checkSearchStatistics();

	if (formCheck) {
		statisticsTable.fnFilter();
	}
}

// searchBtn Click
function statisticsReservationSearch() {

	var formCheck = checkReservationSearch();

	if (formCheck) {
		statisticsReservationTable.fnFilter();
	}
}

// accountChange Check
$("#statistics-account-select").change(function() {

	$('#statistics-account-select').val();
	$('#statistics-search-date-start-input').val("");
	$('#statistics-search-date-end-input').val("");
	$('#statistics-search-input').val("");
	$("#statistics-search-select option:eq(0)").attr("selected", "selected");
	$('#statistics-input-div').show();
	$('#statistics-search-ack-select-div').hide();
	$('#statistics-search-status-select-div').hide();

	// $("#statistics-search-status-select option:eq(0)").attr("selected",
	// "selected");
	// statistics-search-status-select
	setTimeout(changeDateInputStatistics, 500);
	statisticsTable.fnFilter();

});

// accountChange Check
$("#statistics-reservation-account-select").change(
		function() {

			$('#statistics-reservation-account-select').val();
			// $('#statistics-reservation-search-date-start-input').val("");
			// $('#statistics-reservation-search-date-end-input').val("");
			$('#statistics-reservation-search-input').val("");
			$("#statistics-reservation-search-select option:eq(0)").attr(
					"selected", "selected");
			setTimeout(changeDateInputStatisticsR, 500);
			statisticsReservationTable.fnFilter();

		});

// messageList CheckForm
function checkSearchStatistics() {

	var selectOptionValue = $('#statistics-search-select').val();
	var inputSearchValue = $('#statistics-search-input').val();
	var searchDateStart = $('#statistics-search-date-start-input').val();
	var defaultMonth = $('#statistics-search-date-month-input').val();

	if (defaultMonth.substring(5, 6) == 0) {
		defaultMonth = defaultMonth.substring(6);
		defaultMonth = defaultMonth - 1;

	} else {
		defaultMonth = defaultMonth.substring(5);
		defaultMonth = defaultMonth - 1;
	}
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {

		searchDateStart = "";
	}

	var searchDateEnd = $('#statistics-search-date-end-input').val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {

		searchDateEnd = "";
	}

	// if (selectOptionValue == 0) {
	// alert('검색할 항목을 선택해 주세요');
	// return false;
	// }

	if (selectOptionValue == 2 || selectOptionValue == 3) {
		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#statistics-search-input').focus();
			return false;
		}
	}

	if (searchDateStart != null && searchDateStart != "") {

		if (searchDateEnd == null || searchDateEnd == "") {
			alert('검색 종료일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else if (searchDateStart.getMonth() === searchDateEnd.getMonth()
					&& defaultMonth === searchDateEnd.getMonth()
					&& defaultMonth === searchDateStart.getMonth()) {

				return true;
			} else if (searchDateStart.getMonth() !== searchDateEnd.getMonth()
					|| defaultMonth !== searchDateEnd.getMonth()
					|| defaultMonth !== searchDateStart.getMonth()) {

				alert('같은 달에서만 검색이 가능합니다');
				return false;
			} else {
				return true;
			}

		}

	}
	return true;
}

// selectChange Check
function searchSelectSysChange() {

	var selectOptionValue = $('#statistics-search-select').val();

	selectOptionValue = selectOptionValue * 1;

	switch (selectOptionValue) {
	// 발송상태
	case 1:
		$('#statistics-input-div').hide();
		$('#statistics-search-ack-select-div').hide();
		$('#statistics-search-status-select-div').show();
		break;

	// 응답상태
	case 4:
		$('#statistics-input-div').hide();
		$('#statistics-search-ack-select-div').show();
		$('#statistics-search-status-select-div').hide();

		break;
	default:
		$('#statistics-input-div').show();
		$('#statistics-search-ack-select-div').hide();
		$('#statistics-search-status-select-div').hide();
		break;
	}

}

// dp.change Check
$("#statistics-search-date-month-div").on("dp.change", function(e) {
	setTimeout(changeDateInputStatistics, 500);

});

// dp.change Check
// $("#statistics-reservation-search-date-month-div").on("dp.change",
// function(e) {
// setTimeout(changeDateInputStatisticsR, 500);
//
// });
// // dateChange
// function changeDateInputStatisticsR() {
// var messagelist_Picker = $(
// "#statistics-reservation-search-date-month-input").val();
// var messageList_Result = [];
// messageList_Result = messagelist_Picker.split("/");
// $('#statistics-reservation-search-date-start-div').datetimepicker().data(
// "DateTimePicker").setDate(
// chageDateF(messageList_Result[0], messageList_Result[1]));
// $('#statistics-reservation-search-date-end-div').datetimepicker().data(
// "DateTimePicker").setDate(
// chageDateL(messageList_Result[0], messageList_Result[1]));
// $('#statistics-reservation-search-date-start-div').datetimepicker().data(
// "DateTimePicker").setMinDate(
// chageDateF(messageList_Result[0], messageList_Result[1]));
// $('#statistics-reservation-search-date-start-div').datetimepicker().data(
// "DateTimePicker").setMaxDate(
// chageDateL(messageList_Result[0], messageList_Result[1]));
// $('#statistics-reservation-search-date-end-div').datetimepicker().data(
// "DateTimePicker").setMinDate(
// chageDateF(messageList_Result[0], messageList_Result[1]));
// $('#statistics-reservation-search-date-end-div').datetimepicker().data(
// "DateTimePicker").setMaxDate(
// chageDateL(messageList_Result[0], messageList_Result[1]));
//
// }
// dateChange
function changeDateInputStatistics() {
	var messagelist_Picker = $("#statistics-search-date-month-input").val();
	var messageList_Result = [];
	messageList_Result = messagelist_Picker.split("/");
	$('#statistics-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#statistics-search-date-end-div').datetimepicker()
			.data("DateTimePicker").setDate(
					chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#statistics-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setMinDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#statistics-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setMaxDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#statistics-search-date-end-div').datetimepicker()
			.data("DateTimePicker").setMinDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#statistics-search-date-end-div').datetimepicker()
			.data("DateTimePicker").setMaxDate(
					chageDateL(messageList_Result[0], messageList_Result[1]));

}
// exportCsv
function statisticsCsvExport() {

	var messageCount = $('#statisticsListCnt_div').text();
	messageCount = messageCount * 1;

	if (messageCount == 0) {
		alert('다운로드할 데이터가 없습니다.');
		return false;
	}

	if (messageCount <= 10000) {
		if (confirm("총 " + messageCount + "건에 대해서 csv 파일로 다운로드 하시겠습니까?") == true) {
			var accountSelectValue = $('#statistics-account-select').val();
			var searchSelectValue = $('#statistics-search-select').val();
			var searchSelectText = $(
					'#statistics-search-select option:selected').text();
			var accountSelectText = $(
					'#statistics-account-select option:selected').text();
			var searchInputValue = $('#statistics-search-input').val();
			var searchDateStart = $('#statistics-search-date-start-input')
					.val();
			var searchDateEnd = $('#statistics-search-date-end-input').val();
			var searchMonth = $('#statistics-search-date-month-input').val();

			var requestUrl = '?';
			var csvCSearchStatus = "";
			if (searchMonth == null || searchMonth == "") {
				var nowDate = new Date();
				var year = nowDate.getFullYear();
				var month = nowDate.getMonth() + 1;

				if (month < 10) {
					month = '0' + month;
				}

				searchMonth = year + "/" + month;
			}

			searchMonth = searchMonth.replace("/", "");

			requestUrl = requestUrl + 'cSearchDate=' + searchMonth;

			if (searchDateStart != "") {
				searchDateStart = dateFormating(searchDateStart);
				// 시작일
				if (searchDateStart) {

					searchDateStart = searchDateStart.toISOString();

					requestUrl = requestUrl + '&cSearchDateStart='
							+ searchDateStart;
				}
			}

			if (searchDateEnd != "") {
				searchDateEnd = dateFormating(searchDateEnd);

				// 종료일
				if (searchDateEnd) {

					searchDateEnd = searchDateEnd.toISOString();

					requestUrl = requestUrl + '&cSearchDateEnd='
							+ searchDateEnd;
				}
			}
			// 검색 조건 서치 vlaue

			searchSelectValue = searchSelectValue * 1;

			switch (searchSelectValue) {
			case 0:
				csvCSearchStatus = 'ALL';
				requestUrl = requestUrl + '&cSearchStatus=' + csvCSearchStatus;
				break;
			// status
			case 1:
				var statusValue = $(
						'#statistics-search-status-select option:selected')
						.val();

				requestUrl = requestUrl + '&cSearchStatus=' + statusValue;

				break;
			// msgid
			case 2:
				searchSelectText = "msgId";
				requestUrl = requestUrl + '&cSearchFilter=' + searchSelectText;
				requestUrl = requestUrl + '&cSearchContent=' + searchInputValue;
				csvCSearchStatus = "ALL";
				requestUrl = requestUrl + '&cSearchStatus=' + csvCSearchStatus;
				break;
			// receiver
			case 3:
				searchSelectText = "receiver";
				requestUrl = requestUrl + '&cSearchFilter=' + searchSelectText;
				requestUrl = requestUrl + '&cSearchContent=' + searchInputValue;
				csvCSearchStatus = "ALL";
				requestUrl = requestUrl + '&cSearchStatus=' + csvCSearchStatus;

				break;
			// ack
			case 4:
				var ackValue = $(
						'#statistics-search-ack-select option:selected').val();
				searchSelectText = "ack";
				csvCSearchStatus = "ALL";
				requestUrl = requestUrl + '&cSearchFilter=' + searchSelectText;
				requestUrl = requestUrl + '&cSearchContent=' + ackValue;
				requestUrl = requestUrl + '&cSearchStatus=' + csvCSearchStatus;
				break;

			default:

				break;
			}

			// 계정을 선택 했을경우

			if (accountSelectValue != 0) {

				requestUrl = requestUrl + '&userId=' + accountSelectText;
			}

			var xmlhttp = new XMLHttpRequest();

			xmlhttp.onreadystatechange = function() {

				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

					// console.log(xmlhttp.responseText);

					if (navigator.userAgent.indexOf('MSIE') !== -1
							|| navigator.appVersion.indexOf('Trident/') > 0) {
						// MSIE

						var a = document.createElement('a');
						if (window.navigator.msSaveOrOpenBlob) {
							// var fileData = encodeURI(xmlhttp.responseText);
							blobObject = new Blob([ xmlhttp.responseText ]);
							a.onclick = function() {
								window.navigator.msSaveOrOpenBlob(blobObject,
										'message.csv');
							}
						}
						a.appendChild(document
								.createTextNode('Click to Download'));
						document.body.appendChild(a);
						a.click();
					} else {
						var isSafari = /Safari/.test(navigator.userAgent)
								&& /Apple Computer/.test(navigator.vendor);
						if (isSafari) {

							var a = document.createElement('a');
							a.href = 'data:attachment/csv,'
									+ encodeURI(xmlhttp.responseText);
							// a.target = '_blank';
							// a.download = 'message.csv';
							document.body.appendChild(a);
							var evObj = document.createEvent('MouseEvents');
							evObj.initMouseEvent('click', true, true, window);
							a.dispatchEvent(evObj);
						} else {

							var a = document.createElement('a');
							a.href = 'data:attachment/csv,'
									+ encodeURI(xmlhttp.responseText);
							a.target = '_blank';
							a.download = 'message.csv';
							document.body.appendChild(a);
							a.click();
						}

					}

				} else if (xmlhttp.status == 401) {
					alert('파일 다운로드에 실패 하였습니다(권한없음)');
					return false;
				} else if (xmlhttp.status == 500) {
					alert('파일 다운로드에 실패 하였습니다(서버 문제)');
					return false;
				} else if (xmlhttp.status == 404) {
					alert('파일 다운로드에 실패 하였습니다(Not Found)');
					return false;
				}
			};

			xmlhttp.open("GET", '/v1/pms/adm/' + statisticsRole
					+ '/messages/csv' + requestUrl, true);
			xmlhttp.setRequestHeader("X-Application-Token", statisticsToken);

			xmlhttp.send();
			return true;
		}
	} else {
		alert('다운로드는 10000개 목록까지 가능합니다');
		return false;
	}

}
// reset
function statisticsDateReset() {
	wrapperFunction('statistics');
}

// function toBinaryString(data) {
// var ret = [];
// var len = data.length;
// var byte;
// for (var i = 0; i < len; i++) {
// byte = (data.charCodeAt(i) & 0xFF) >>> 0;
// ret.push(String.fromCharCode(byte));
// }
//
// return ret.join('');
// }
// reset
function statisticsReservationReset() {
	wrapperFunction('statistics');
}

// reservationList Check Form
function checkReservationSearch() {

	var selectOptionValue = $('#statistics-reservation-search-select').val();
	var inputSearchValue = $('#statistics-reservation-search-input').val();
	var defaultMonth = $('#statistics-reservation-search-date-month-input')
			.val();

	if (defaultMonth.substring(5, 6) == 0) {
		defaultMonth = defaultMonth.substring(6);
		defaultMonth = defaultMonth - 1;

	} else {
		defaultMonth = defaultMonth.substring(5);
		defaultMonth = defaultMonth - 1;
	}

	// var searchDateStart =
	// $('#statistics-reservation-search-date-start-input')
	// .val();
	// searchDateStart = dateFormating(searchDateStart);
	//
	// if (typeof searchDateStart === undefined
	// || typeof searchDateStart === 'undefined') {
	//
	// searchDateStart = "";
	// }

	// var searchDateEnd = $('#statistics-reservation-search-date-end-input')
	// .val();
	//
	// searchDateEnd = dateFormating(searchDateEnd);
	// if (typeof searchDateEnd === undefined
	// || typeof searchDateEnd === 'undefined') {
	//
	// searchDateEnd = "";
	// }

	if (selectOptionValue != 0) {
		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용 입력해 주세요');
			$('#statistics-reservation-search-input').focus();
			return false;
		}
	} else if (inputSearchValue != null && inputSearchValue != "") {

		if (selectOptionValue == 0) {
			alert('검색 항목을 선택해주세요');

			return false;
		}

	}

	// if (searchDateStart != null && searchDateStart != "") {
	//
	// if (searchDateEnd == null || searchDateEnd == "") {
	// alert('검색 종료일을 입력해 주세요');
	// return false;
	// } else {
	// if (searchDateStart >= searchDateEnd) {
	// alert('검색 시작일이 종료일보다 클 수 없습니다');
	// return false;
	// } else if (searchDateStart.getMonth() === searchDateEnd.getMonth()
	// && defaultMonth === searchDateEnd.getMonth()
	// && defaultMonth === searchDateStart.getMonth()) {
	//
	// return true;
	// } else if (searchDateStart.getMonth() !== searchDateEnd.getMonth()
	// || defaultMonth !== searchDateEnd.getMonth()
	// || defaultMonth !== searchDateStart.getMonth()) {
	//
	// alert('같은 달에서만 검색이 가능합니다');
	// return false;
	// } else {
	// return true;
	// }
	//
	// }
	//
	// }

	// if (searchDateEnd != null && searchDateEnd != "") {
	//
	// if (searchDateStart == null || searchDateStart == "") {
	// alert('검색 시작일을 입력해 주세요');
	// return false;
	// } else {
	// if (searchDateStart >= searchDateEnd) {
	// alert('검색 시작일이 종료일보다 클 수 없습니다');
	// return false;
	// } else {
	// return true;
	// }
	// }
	// } else {
	// return true;
	// }
	console.log("예약 서치 폼체크");
	return true;

}
