//getToken
var reservationListToken = sessionStorage.getItem("token");
// getRole
var reservationListRole = sessionStorage.getItem("role");
var reservationListResult = "";
// // reservationInput disable
// $("#reservation-search-date-start-input").prop('disabled', true);
// // reseravationInput disable
// $("#reservation-search-date-end-input").prop('disabled', true);
// // createReservation Table
var reservationListTable = $('#reservation-datatable')
		.dataTable(
				{
					'bSort' : false,
					'bServerSide' : true,
					'bFilter' : false,
					"pageLength" : 25,
					"oLanguage" : {
						"oPaginate" : {
							"sFirst" : "처음",
							"sLast" : "끝",
							"sNext" : "다음",
							"sPrevious" : "이전"
						}
					},
					// 'dom' : 'T<"clear">lrtip',
					'columns' : [ {
						"data" : "reservationTime"
					}, {
						"data" : "issueName"
					}, {
						"data" : "receiver"
					}, {
						"data" : "content"
					}, {
						"data" : "contentType",
						"visible" : false
					}, {
						"data" : "msgId",
						"visible" : false
					} ],
					'sPaginationType' : 'full_numbers',
					'sAjaxSource' : '/v1/pms/adm/' + reservationListRole
							+ '/messages/reservations',
					'fnServerData' : function(sSource, aoData, fnCallback) {
						$
								.ajax({
									dataType : 'json',
									contentType : 'application/json;charset=UTF-8',
									type : 'GET',
									url : sSource,
									headers : {
										'X-Application-Token' : reservationListToken
									},
									data : aoData,

									success : function(data) {

										if (!data.result.errors) {

											var dataResult = data.result.data.data;

											if (dataResult.length == 0) {
												$("#reservaton-checkbox-id")
														.hide();
												$('#reservation-cancel-div')
														.hide();
											} else {
												reservationListResult = dataResult;
												$('#reservation-cancel-div')
														.show();
												$("#reservaton-checkbox-id")
														.show();
											}
											$('#reservationListCnt_div')
													.text(
															data.result.data.recordsTotal);
											for ( var i in dataResult) {

												dataResult[i].content = b64_to_utf8(dataResult[i].content);
												dataResult[i].contentType = dataResult[i].content;
												if (dataResult[i].content.length > 15) {

													dataResult[i].content = dataResult[i].content
															.substring(0, 15)
															+ "..";
												}
												if (dataResult[i].issueName == null) {
													dataResult[i].issueName = dataResult[i].updateId;
												}

												var dateTime = dataResult[i].reservationTime;

												if (dateTime != null) {
													dataResult[i].reservationTime = '<input name="reservatoin-checkbox" type="checkbox" value="'
															+ dataResult[i].msgId
															+ '"/>&nbsp;'
															+ new Date(dateTime)
																	.toLocaleString();
												}
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
						var searchSelectValue = $('#reservation-search-select')
								.val();
						var searchSelectText = $(
								'#reservation-search-select option:selected')
								.text();
						var searchInputValue = $('#reservation-search-input')
								.val();
						var messageMonth = $('#reservation-date-input').val();
						// var searchDateStart = $(
						// '#reservation-search-date-start-input').val();
						// var searchDateEnd = $(
						// '#reservation-search-date-end-input').val();

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

						if (messageMonth == null || messageMonth == "") {
							var nowDate = new Date();
							var year = nowDate.getFullYear();
							var month = nowDate.getMonth() + 1;

							if (month < 10) {
								month = '0' + month;
							}

							messageMonth = year + "/" + month;

							$('#reservation-date-input').val(messageMonth);
						}

						var reservationStartDate = "";
						var reservationEndDate = "";
						var reservationMonth = messageMonth.split('/');

						reservationStartDate = new Date(reservationMonth[0],
								reservationMonth[1] - 1, 1).toISOString();
						reservationEndDate = new Date(reservationMonth[0],
								reservationMonth[1], 0).toISOString();
						console.log('예약메시지 시작 끝');
						console.log(reservationStartDate);
						console.log(reservationEndDate);
						messageMonth = messageMonth.replace("/", "");

						// aoData.push({
						// 'name' : 'cSearchDate',
						// 'value' : messageMonth
						// });

						aoData.push({
							'name' : 'cSearchDateStart',
							'value' : reservationStartDate
						});
						//					
						aoData.push({
							'name' : 'cSearchDateEnd',
							'value' : reservationEndDate
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
						// // 종료일
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

					}

				});
$('#reservation-datatable tbody')
		.on(
				'click',
				'tr',
				function() {
					if (reservationListResult.length > 0) {
						$("#reservation-datatable tbody tr").removeClass(
								'row_selected');
						console.log('이벤트 발생');
						$(this).addClass('row_selected');

						$('#reservation-detail-div').show();

						var reservationClickData = reservationListTable
								.fnGetData(this);

						console.log(reservationClickData);

						$('#reservation-detail-textarea').val(
								reservationClickData.contentType);

					}
				});

// dp.change check
// $("#reservation-date-div").on("dp.change", function(e) {
// setTimeout(changeDateInputRes, 500);
//
// });
// dateChange
// function changeDateInputRes() {
// var messagelist_Picker = $("#reservation-date-input").val();
// var messageList_Result = []
// messageList_Result = messagelist_Picker.split("/");
// $('#reservation-search-date-start-div').datetimepicker().data(
// "DateTimePicker").setDate(
// chageDateF(messageList_Result[0], messageList_Result[1]));
// $('#reservation-search-date-end-div').datetimepicker().data(
// "DateTimePicker").setDate(
// chageDateL(messageList_Result[0], messageList_Result[1]));
// $('#reservation-search-date-start-div').datetimepicker().data(
// "DateTimePicker").setMinDate(
// chageDateF(messageList_Result[0], messageList_Result[1]));
// $('#reservation-search-date-start-div').datetimepicker().data(
// "DateTimePicker").setMaxDate(
// chageDateL(messageList_Result[0], messageList_Result[1]));
// $('#reservation-search-date-end-div').datetimepicker().data(
// "DateTimePicker").setMinDate(
// chageDateF(messageList_Result[0], messageList_Result[1]));
// $('#reservation-search-date-end-div').datetimepicker().data(
// "DateTimePicker").setMaxDate(
// chageDateL(messageList_Result[0], messageList_Result[1]));
//
// }
// searchBtn Click
function reservationSearch() {

	var formCheck = checkSearchReservation();

	if (formCheck) {
		reservationListTable.fnFilter();
	} else {

	}
}

// checkBox Check
function reservationCheck(source) {
	checkboxes = document.getElementsByName('reservatoin-checkbox');
	for (var i = 0, n = checkboxes.length; i < n; i++) {
		checkboxes[i].checked = source.checked;
	}
}

// reservation Cancel
function reservationCancelFunction() {
	var checkedLength = $('input[name="reservatoin-checkbox"]:checked').length;
	var role = sessionStorage.getItem("role");
	var tokenID = sessionStorage.getItem("token");
	if (checkedLength == 0) {
		alert('취소할 메시지를 선택해주세요');
		return false;
	} else {
		var reservationReq = new Object();
		reservationReq.msgIds = new Array();
		$('input[name="reservatoin-checkbox"]:checked').each(function() {

			if (this.value != "on") {

				reservationReq.msgIds.push(this.value);
			}
		});

		if (reservationReq.msgIds.length == 0) {
			alert('취소할 대상이 없습니다.');
			return false;
		}
		reservationReq = JSON.stringify(reservationReq);

		if (confirm("예약 메시지를 취소합니다.") == true) {

			$.ajax({
				url : '/v1/pms/adm/' + role + '/messages/cancel',
				type : 'POST',
				headers : {
					'X-Application-Token' : tokenID
				},
				contentType : "application/json",
				dataType : 'json',
				async : false,
				data : reservationReq,

				success : function(data) {

					if (!data.result.errors) {

						var dataResult = data.result.data;
						alert(dataResult + "건의 예약 메시지를 취소하였습니다.");
						wrapperFunction('reservationList');
					} else {
						alert("예약 메시지 취소에 실패 하였습니다.");
						wrapperFunction('reservationList');
					}

				},
				error : function(data, textStatus, request) {
					alert("예약 메시지 취소에 실패 하였습니다.");
					wrapperFunction('reservationList');
				}
			});

		} else {
			return false;
		}

	}

}

// formCheck
function checkSearchReservation() {

	var selectOptionValue = $('#reservation-search-select').val();
	var inputSearchValue = $('#reservation-search-input').val();
	var defaultMonth = $('#reservation-date-input').val();

	if (defaultMonth.substring(5, 6) == 0) {
		defaultMonth = defaultMonth.substring(6);
		defaultMonth = defaultMonth - 1;

	} else {
		defaultMonth = defaultMonth.substring(5);
		defaultMonth = defaultMonth - 1;
	}


	if (selectOptionValue == 1 || selectOptionValue == 2) {
		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#reservation-search-input').focus();
			return false;
		}
	}

	return true;
}

// cancelForm Check
function cancelFormCheck() {
	var input_reservationCancelID = $('#reservation-cancel-input').val();
	if (input_reservationCancelID == null || input_reservationCancelID == "") {
		alert('예약을 취소할 대상을 선택해 주세요.');
		$('#reservation-cancel-input').focus();
		return false;
	}

	else {
		return true;
	}

}