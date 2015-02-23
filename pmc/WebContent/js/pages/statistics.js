var statisticsToken = sessionStorage.getItem("token");
var statisticsRole = sessionStorage.getItem("role");
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

		if (dataResult) {
			console.log('/v1/pms/adm/' + statisticsRole + '/users');
			console.log(dataResult);
			if (!data.result.errors) {

				for ( var i in data.result.data) {
					var successData = dataResult[i];
					console.log(successData.role);
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
		} else {

		}

	},
	error : function(data, textStatus, request) {

	}
});

// create messageList
var statisticsTable = $('#statistics-datatable')
		.dataTable(
				{
					'bServerSide' : true,
					'bSort' : false,
					'dom' : 'T<"clear">lrtip',
					'columns' : [ {
						"data" : "msgId"
					}, {
						"data" : "updateId"
					}, {
						"data" : "receiver"
					}, {
						"data" : "status"
					}, {
						"data" : "updateTime"
					}, {
						"data" : "pmaAckType"
					}, {
						"data" : "pmaAckTime"
					}, {
						"data" : "resendMaxCount"
					}, {
						"data" : "resendInterval"
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
										var dataResult = data.result.data.data;
										if (dataResult) {
											console.log('/v1/pms/adm/'
													+ statisticsRole
													+ '/messages(GET)');
											console.log(dataResult);
//											$('#reservationListCnt_div')
//											.text(
//													data.result.data.recordsTotal);
											$('#statisticsListCnt_div').text(data.result.data.recordsTotal);
											for ( var i in dataResult) {
												if (dataResult[i].pmaAckType == null) {
													dataResult[i].pmaAckType = "응답없음";
												} else {
													if (dataResult[i].appAckType != null) {
														dataResult[i].pmaAckType = "사용자응답";
														var dateTime = dataResult[i].appAckTime;
														dataResult[i].pmaAckTime = new Date(
																dateTime)
																.toLocaleString();
													} else {
														dataResult[i].pmaAckType = "기기응답";
														var dateTime = dataResult[i].pmaAckTime;
														dataResult[i].pmaAckTime = new Date(
																dateTime)
																.toLocaleString();
													}

												}

												switch (dataResult[i].status) {
												case -99:
													dataResult[i].status = "발송오류";
													break;
												case -2:
													dataResult[i].status = "수신자없음";
													break;
												case -1:
													dataResult[i].status = "허용갯수초과";
													break;
												case 0:
													dataResult[i].status = "발송중";
													break;
												case 1:
													dataResult[i].status = "발송됨";
													break;
												case 2:
													dataResult[i].status = "예약취소됨";
													break;

												}

												dataResult[i].resendInterval = dataResult[i].resendInterval
														+ "분";
												var dateTime = dataResult[i].updateTime;
												dataResult[i].updateTime = new Date(
														dateTime)
														.toLocaleString();

											}

											data.result.data.data = dataResult;
											fnCallback(data.result.data);

										} else {
											// alert('발송 메시지 목록을 가지고 오는데 실패
											// 하였습니다.');

										}

									},
									error : function(e) {
										// alert('발송 메시지 목록을 가지고 오는데 실패
										// 하였습니다.');
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

						var nowDate = new Date();
						var year = nowDate.getFullYear();
						var month = nowDate.getMonth() + 1;
						console.log(month);
						if (month < 10) {
							month = '0' + month;
						}
						console.log(year + "/" + month);
						var defaultMonth = year + month;

						searchDateStart = dateFormating(searchDateStart);
						// 시작일
						if (searchDateStart) {
							searchDateStart = searchDateStart.toISOString();
							aoData.push({
								'name' : 'cSearchDateStart',
								'value' : searchDateStart
							});
						}

						searchDateEnd = dateFormating(searchDateEnd);

						// 종료일
						if (searchDateEnd) {
							searchDateEnd = searchDateEnd.toISOString();
							aoData.push({
								'name' : 'cSearchDateEnd',
								'value' : searchDateEnd
							});
						}
						// 검색 조건 서치 vlaue
						console.log('검색조건');
						console.log(searchInputValue);
						searchSelectValue=searchSelectValue*1;
						switch (searchSelectValue) {
						case 0:
							break;
						// status
						case 1:
							if (searchInputValue == "발송오류") {
								searchSelectText = -99 * 1;
							} else if (searchInputValue == "수신자 없음") {
								searchSelectText = -2 * 1;
							} else if (searchInputValue == "허용갯수초과") {
								searchSelectText = -1 * 1;
							} else if (searchInputValue == "발송중") {
								searchSelectText = 1 - 1;
							} else if (searchInputValue == "발송됨") {
								console.log(searchSelectText);
								searchSelectText = 1 * 1;
							} else if (searchInputValue == "예약취소됨") {
								searchSelectText = 2 * 1;
							}
							aoData.push({
								'name' : 'cSearchStatus',
								'value' : searchSelectText
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

							break;
						// ack
						case 4:
							searchSelectText = "ack";
							// search value
							if (searchInputValue == "응답없음") {
								searchInputValue = 1 - 1;
							} else if (searchInputValue == "기기응답") {
								searchInputValue = 1 * 1;
							} else if (searchInputValue == "사용자응답") {
								searchInputValue = 1 * 2;
							}
							aoData.push({
								'name' : 'cSearchFilter',
								'value' : searchSelectText
							});
							aoData.push({
								'name' : 'cSearchContent',
								'value' : searchInputValue
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

						aoData.push({
							'name' : 'cSearchDate',
							'value' : defaultMonth
						});

						console.log('서치 일반 데이터');
						console.log(aoData);
						console.log('서치 일반 데이터');
					}

				});

// create reservationMessageList
var statisticsReservationTable = $('#statistics-reservation-datatable')
		.dataTable(
				{

					'bServerSide' : true,
					'bSort' : false,
					'dom' : 'T<"clear">lrtip',
					'columns' : [ {
						"data" : "msgId"
					}, {
						"data" : "updateId"
					}, {
						"data" : "receiver"
					}, {
						"data" : "reservationTime"
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
										var dataResult = data.result.data.data;
										if (dataResult) {
											console
													.log('/v1/pms/adm/'
															+ statisticsRole
															+ '/messages/reservations(GET)');
											console.log(dataResult);
											$('#statisticsList-reservation-Cnt_div').text(data.result.data.recordsTotal);
											for ( var i in dataResult) {

												var dateTime = dataResult[i].reservationTime;
												console.log("dateTime:"
														+ dateTime);
												if (dateTime != null) {
													dataResult[i].reservationTime = new Date(
															dateTime)
															.toLocaleString();
												}

											}

											data.result.data.data = dataResult;
											fnCallback(data.result.data);

										} else {
											// alert('예약 메시지 목록을 가지고 오는데 실패
											// 하였습니다.');

										}

									},
									error : function(e) {
										// alert('예약 메시지 목록을 가지고 오는데 실패
										// 하였습니다.');
									}
								});
					},
					//
					// },
					// custom params
					'fnServerParams' : function(aoData) {
						// 계정select
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

						var nowDate = new Date();
						var year = nowDate.getFullYear();
						var month = nowDate.getMonth() + 1;
						console.log(month);
						if (month < 10) {
							month = '0' + month;
						}
						console.log(year + "/" + month);
						var defaultMonth = year + month;

						searchDateStart = dateFormating(searchDateStart);
						// 시작일
						if (searchDateStart) {
							searchDateStart = searchDateStart.toISOString();
							aoData.push({
								'name' : 'cSearchDateStart',
								'value' : searchDateStart
							});
						}

						searchDateEnd = dateFormating(searchDateEnd);

						// 종료일
						if (searchDateEnd) {
							searchDateEnd = searchDateEnd.toISOString();
							aoData.push({
								'name' : 'cSearchDateEnd',
								'value' : searchDateEnd
							});
						}
						// 검색 조건 서치 vlaue
						console.log('검색조건');
						console.log(searchInputValue);
						searchSelectValue=searchSelectValue*1;
						switch (searchSelectValue) {
						case 0:
							break;
						// msgId
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

						aoData.push({
							'name' : 'cSearchDate',
							'value' : defaultMonth
						});

						console.log('예약 서치 데이터');
						console.log(aoData);
						console.log('예약 서치 데이터');

					}

				});



function statisticsDateSearch() {
	console.log('statisticsDateSearch');
	var formCheck = checkSearchStatistics();

	if (formCheck) {
		statisticsTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}
}

function statisticsReservationSearch() {
	console.log('target click function..');
	var formCheck = checkReservationSearch();

	if (formCheck) {
		statisticsReservationTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}
}

$("#statistics-account-select").change(function() {
	console.log('계정 변경');

	$('#statistics-account-select').val();
	$('#statistics-search-date-start-input').val("");
	$('#statistics-search-date-end-input').val("");
	$('#statistics-search-input').val("");
	$("#statistics-search-select option:eq(0)").attr("selected", "selected");
	statisticsTable.fnFilter();

});

$("#statistics-reservation-account-select").change(
		function() {

			$('#statistics-reservation-account-select').val();
			$('#statistics-reservation-search-date-start-input').val("");
			$('#statistics-reservation-search-date-end-input').val("");
			$('#statistics-reservation-search-input').val("");
			$("#statistics-reservation-search-select option:eq(0)").attr(
					"selected", "selected");
			statisticsReservationTable.fnFilter();

		});

// messageList CheckForm
function checkSearchStatistics() {

	var selectOptionValue = $('#statistics-search-select').val();
	var inputSearchValue = $('#statistics-search-input').val();
	var searchDateStart = $('#statistics-search-date-start-input').val();
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	var searchDateEnd = $('#statistics-search-date-end-input').val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		console.log("dsearchDateEnd.....");
		searchDateEnd = "";
	}

	console.log('selectOptjionValue:' + selectOptionValue);

	// if (selectOptionValue == 0) {
	// alert('검색할 항목을 선택해 주세요');
	// return false;
	// }

	if (selectOptionValue != 0) {
		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#statistics-search-input').focus();
			return false;
		}
	}

	if (searchDateStart != null && searchDateStart != "") {
		console.log(searchDateStart);
		if (searchDateEnd == null || searchDateEnd == "") {
			alert('검색 종료일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}

		}

	}

	if (searchDateEnd != null && searchDateEnd != "") {

		if (searchDateStart == null || searchDateStart == "") {
			alert('검색 시작일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}
		}
	} else {
		return true;
	}

}

function statisticsDateReset() {
	$("#statistics-search-date-start-input").val("");
	$("#statistics-search-date-end-input").val("");
	$('#statistics-search-input').val("");
	$("#statistics-account-select option:eq(0)").attr("selected", "selected");
	$("#statistics-search-select option:eq(0)").attr("selected", "selected");

}

function statisticsReservationReset() {
	$("#statistics-reservation-search-date-start-input").val("");
	$("#statistics-reservation-search-date-end-input").val("");
	$("#statistics-reservation-account-select option:eq(0)").attr("selected",
			"selected");
	$("#statistics-reservation-search-select option:eq(0)").attr("selected",
			"selected");
}

// reservationList Check Form
function checkReservationSearch() {

	var selectOptionValue = $('#statistics-reservation-search-select').val();
	var inputSearchValue = $('#statistics-reservation-search-input').val();
	var searchDateStart = $('#statistics-reservation-search-date-start-input')
			.val();
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	var searchDateEnd = $('#statistics-reservation-search-date-end-input')
			.val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		console.log("dsearchDateEnd.....");
		searchDateEnd = "";
	}

	console.log('selectOptjionValue:' + selectOptionValue);

	if (selectOptionValue != 0) {
		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용 입력해 주세요');
			$('#statistics-reservation-search-input').focus();
			return false;
		}
	}

	if (searchDateStart != null && searchDateStart != "") {
		console.log(searchDateStart);
		if (searchDateEnd == null || searchDateEnd == "") {
			alert('검색 종료일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}

		}

	}

	if (searchDateEnd != null && searchDateEnd != "") {

		if (searchDateStart == null || searchDateStart == "") {
			alert('검색 시작일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}
		}
	} else {
		return true;
	}

}
