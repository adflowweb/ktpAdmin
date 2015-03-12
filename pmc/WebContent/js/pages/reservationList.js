var reservationListToken = sessionStorage.getItem("token");
var reservationListRole = sessionStorage.getItem("role");
$("#reservation-search-date-start-input").prop('disabled', true);
$("#reservation-search-date-end-input").prop('disabled', true);
var reservationListTable = $('#reservation-datatable')
		.dataTable(
				{
					'bSort' : false,
					'bServerSide' : true,
					'bFilter' : false,
					"pageLength": 25,
					// 'dom' : 'T<"clear">lrtip',
					'columns' : [ {
						"data" : "msgId"
					}, {
						"data" : "reservationTime"
					}, {
						"data" : "updateId"
					}, {
						"data" : "receiver"
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
										'X-Application-Token' : messageListToken
									},
									data : aoData,

									success : function(data) {
										var dataResult = data.result.data.data;
										if (dataResult) {
											console
													.log('/v1/pms/adm/'
															+ reservationListRole
															+ '/messages/reservations(GET)');
											console.log(dataResult);
											if (dataResult.length == 0) {
												$("#reservaton-checkbox-id")
														.hide();
											}
											$('#reservationListCnt_div')
													.text(
															data.result.data.recordsTotal);
											for ( var i in dataResult) {
												var dateTime = dataResult[i].reservationTime;
												dataResult[i].msgId = '<input name="reservatoin-checkbox" type="checkbox" value="'
														+ dataResult[i].msgId
														+ '"/>&nbsp;'
														+ dataResult[i].msgId;
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
						var searchDateStart = $(
								'#reservation-search-date-start-input').val();
						var searchDateEnd = $(
								'#reservation-search-date-end-input').val();

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
							console.log(month);
							if (month < 10) {
								month = '0' + month;
							}
							console.log(year + "/" + month);
							messageMonth = year + "/" + month;

							$('#reservation-date-input').val(messageMonth);
						}

						messageMonth = messageMonth.replace("/", "");

						aoData.push({
							'name' : 'cSearchDate',
							'value' : messageMonth
						});

						searchDateStart = dateFormating(searchDateStart);
						// 시작일
						if (searchDateStart) {
							console.log('검색 시작일');
							console.log(searchDateStart);
							searchDateStart = searchDateStart.toISOString();
							console.log(searchDateStart);
							aoData.push({
								'name' : 'cSearchDateStart',
								'value' : searchDateStart
							});
						}

						searchDateEnd = dateFormating(searchDateEnd);

						// 종료일
						if (searchDateEnd) {
							console.log('검색 종ㄹ');
							console.log(searchDateEnd);
							searchDateEnd = searchDateEnd.toISOString();
							console.log(searchDateEnd);
							aoData.push({
								'name' : 'cSearchDateEnd',
								'value' : searchDateEnd
							});
						}

						console.log("메시지 리스트  aoData");
						console.log(aoData);
						console.log("메시지 리스트  aoData");

					}

				});

$("#reservation-date-div").on("dp.change", function(e) {
	setTimeout(changeDateInputRes, 500);

});

function changeDateInputRes() {
	var messagelist_Picker = $("#reservation-date-input").val();
	var messageList_Result = []
	messageList_Result = messagelist_Picker.split("/");
	$('#reservation-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#reservation-search-date-end-div').datetimepicker().data(
			"DateTimePicker").setDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#reservation-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setMinDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#reservation-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setMaxDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#reservation-search-date-end-div').datetimepicker().data(
			"DateTimePicker").setMinDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#reservation-search-date-end-div').datetimepicker().data(
			"DateTimePicker").setMaxDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));

}

function reservationSearch() {
	console.log('reservation search click function..');
	var formCheck = checkSearchReservation();

	if (formCheck) {
		reservationListTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}
}

function reservationCheck(source) {
	checkboxes = document.getElementsByName('reservatoin-checkbox');
	for (var i = 0, n = checkboxes.length; i < n; i++) {
		checkboxes[i].checked = source.checked;
	}
}

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
				console.log(this.value);
				reservationReq.msgIds.push(this.value);
			}
		});
		reservationReq = JSON.stringify(reservationReq);
		console.log(JSON.stringify(reservationReq));

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
					console.log('메시지 취소 리퀘스트 결과');
					console.log(data);

					var dataResult = data.result.data;
					if (dataResult) {
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

function checkSearchReservation() {

	var selectOptionValue = $('#reservation-search-select').val();
	var inputSearchValue = $('#reservation-search-input').val();
	var searchDateStart = $('#reservation-search-date-start-input').val();
	var defaultMonth = $('#reservation-date-input').val();

	// 2015/03
	console.log('서브스트링');
	console.log(defaultMonth.substring(5, 6));
	if (defaultMonth.substring(5, 6) == 0) {
		defaultMonth = defaultMonth.substring(6);
		defaultMonth = defaultMonth - 1;
		console.log('기본달');
		console.log(defaultMonth - 1);
	} else {
		defaultMonth = defaultMonth.substring(5);
		defaultMonth = defaultMonth - 1;
	}
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	var searchDateEnd = $('#reservation-search-date-end-input').val();

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

	if (selectOptionValue == 2 || selectOptionValue == 3) {
		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#statistics-search-input').focus();
			return false;
		}
	}

	if (searchDateStart != null && searchDateStart != "") {
		console.log('검색 시작 종료 로그');
		console.log(searchDateStart);
		console.log(searchDateEnd);
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
				console.log(searchDateStart.getMonth());
				console.log('같은월');
				return true;
			} else if (searchDateStart.getMonth() !== searchDateEnd.getMonth()
					|| defaultMonth !== searchDateEnd.getMonth()
					|| defaultMonth !== searchDateStart.getMonth()) {
				console.log('다른월');
				alert('같은 달에서만 검색이 가능합니다');
				return false;
			} else {
				return true;
			}

		}

	}

}

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