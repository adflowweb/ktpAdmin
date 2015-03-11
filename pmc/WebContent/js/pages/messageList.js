var messageListToken = sessionStorage.getItem("token");
var messageListRole = sessionStorage.getItem("role");
$("#messagelist-search-date-start-input").prop('disabled', true);
$("#messagelist-search-date-end-input").prop('disabled', true);
var messageListResult = "";
$
		.ajax({
			url : '/v1/pms/adm/' + messageListRole + '/account',
			type : 'GET',
			contentType : "application/json",
			headers : {
				'X-Application-Token' : messageListToken
			},
			dataType : 'json',
			async : false,

			success : function(data) {

				var dataResult = data.result.data;
				if (dataResult) {
					if (!data.result.errors) {
						console.log('/v1/pms/adm/' + messageListRole
								+ '/account(GET)');
						console.log(dataResult);
						if (dataResult.msgCntLimit == -1) {
							$('#messageCnt_div').text("제한없음");
						} else {
							$('#messageCnt_div').text(dataResult.msgCntLimit);
						}

					} else {

						alert(data.result.errors[0]);
					}
				} else {

					// alert('계정 목록을 가지고오는데 실패하였습니다.');
				}

			},
			error : function(data, textStatus, request) {

				// alert('계정 목록을 가지고오는데 실패하였습니다.');
			}
		});

var messageTable = $('#dataTables-messageList')
		.dataTable(
				{

					'bSort' : false,
					'bServerSide' : true,
					'bFilter':false,
					'columns' : [ {
						"data" : "updateTime"
					}, {
						"data" : "updateId"
					}, {
						"data" : "receiver"
					}, {
						"data" : "status"
					}, {
						"data" : "pmaAckType"
					}, {
						"data" : "pmaAckTime"
					}, {
						"data" : "resendCount"
					}, {
						"data" : "resendInterval"
					}, {
						"data" : "msgId"
					} ],
					'sPaginationType' : 'full_numbers',
					'sAjaxSource' : '/v1/pms/adm/' + messageListRole
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
										'X-Application-Token' : messageListToken
									},
									data : aoData,

									success : function(data) {
										console.log(data);
										var dataResult = data.result.data;
										if (dataResult) {
											console.log('/v1/pms/adm/'
													+ messageListRole
													+ '/messages(GET)');
											console.log(dataResult);

											$('#messageListCnt_div')
													.text(
															data.result.data.recordsTotal);
											dataResult = data.result.data.data;
											messageListResult = dataResult;
											for ( var i in dataResult) {

												if (dataResult[i].pmaAckType == null) {

													dataResult[i].pmaAckType = '응답없음';
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

													console
															.log(dataResult[i].reservationTime);
													if (dataResult[i].reservationTime == null) {
														console
																.log('널일경우 예약 메시지가 아닌데 발송중일경우 업데이트 타임표시');
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
										console.log(e);
										alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');
									}
								});
					},
					//
					// },
					// custom params
					'fnServerParams' : function(aoData) {
						var searchSelectValue = $('#messagelist-search-select')
								.val();
						var searchSelectText = $(
								'#messagelist-search-select option:selected')
								.text();
						var searchInputValue = $('#messagelist-input').val();

						var searchDateStart = $(
								'#messagelist-search-date-start-input').val();
						var searchDateEnd = $(
								'#messagelist-search-date-end-input').val();

						var messageMonth = $('#messagelist-date-input').val();

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
									'#messagelist-search-status-select option:selected')
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
									'#messagelist-search-ack-select option:selected')
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

							$('#messagelist-date-input').val(messageMonth);
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

$('#dataTables-messageList tbody')
		.on(
				'click',
				'tr',
				function() {
					$('#remessage-div').show();
					var tableClickData = $(this).children("td").map(function() {
						return $(this).text();
					}).get();

					for ( var i in messageListResult) {
						if (messageListResult[i].msgId == tableClickData[8]) {
							$('#remessage-send-user-target-input').val(
									messageListResult[i].receiver);

							if (messageListResult[i].contentType == "application/base64") {
								messageListResult[i].content = b64_to_utf8(messageListResult[i].content);
							}

							$('#remessage-send-user-textarea').val(
									messageListResult[i].content);
							$('#remessage-send-serviceid').val(
									messageListResult[i].serviceId);
						}

					}

				});

function searchSelectChange() {
	console.log('메시지 리스트 셀렉트 변경 시');
	var selectOptionValue = $('#messagelist-search-select').val();

	selectOptionValue = selectOptionValue * 1;

	switch (selectOptionValue) {
	// 발송상태
	case 1:
		$('#messagelist-input-div').hide();
		$('#messagelist-search-ack-select-div').hide();
		$('#messagelist-search-status-select-div').show();
		break;

	// 응답상태
	case 4:
		$('#messagelist-input-div').hide();
		$('#messagelist-search-ack-select-div').show();
		$('#messagelist-search-status-select-div').hide();

		break;
	default:
		$('#messagelist-input-div').show();
		$('#messagelist-search-ack-select-div').hide();
		$('#messagelist-search-status-select-div').hide();
		break;
	}

}

function messageListSearch() {
	var formCheck = checkSearch();

	if (formCheck) {
		messageTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}
}

$('#messagelist-input').keypress(function(e) {
	if (event.keyCode == 13) {
		var formCheck = checkSearch();

		if (formCheck) {
			messageTable.fnFilter();
		} else {
			console.log('검색항목 선택 안함!!');
		}

	}

});

function MessageReSendUserFunction() {

	if (resendFormCheck()) {
		var messageTarget = $('#remessage-send-user-target-input').val();
		var messageContent = $('#remessage-send-user-textarea').val();

		messageContent = utf8_to_b64(messageContent);
		messageTarget = messageTarget.split(",");
		if (messageListRole == "svc") {

			var messageData = new Object();
			messageData.receivers = messageTarget;
			messageData.content = messageContent;
			messageData.contentType = "application/base64";
			var messageDataResult = JSON.stringify(messageData);
			if (utf8ByteLength(messageDataResult) > 512000) {
				console.log(utf8ByteLength(messageDataResult));
				alert('메시지 사이즈가 너무 큽니다.');
				return false;
			}

			if (confirm("해당 내용으로 메시지를 재전송 하시겠습니까?.") == true) {
				$.ajax({
					url : '/v1/pms/adm/' + messageListRole + '/messages',
					type : 'POST',
					headers : {
						'X-Application-Token' : messageListToken
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : messageDataResult,

					success : function(data) {

						var dataResult = data.result.data;
						if (dataResult) {
							console.log('/v1/pms/adm/' + messageListRole
									+ '/messages(POST)');
							console.log(dataResult);

							alert('메시지를 발송하였습니다.');
							wrapperFunction('messageList');
						} else {
							alert(data.result.errors[0]);

							wrapperFunction('messageList');
						}

					},
					error : function(data, textStatus, request) {
						alert('메시지 전송에 실패 하였습니다.');
						wrapperFunction('messageList');
					}
				});

			} else {

			}

		} else if (messageListRole == "svcadm") {
			var serviceId = $('#remessage-send-serviceid').val();
			var messageData = new Object();
			messageData.receivers = messageTarget;
			messageData.content = messageContent;
			messageData.serviceId = serviceId;
			messageData.contentType = "application/base64";
			messageData.ack = true;
			messageData.msgType = 10;
			messageData.qos = 2;
			messageData.expiry = 0;

			var messageDataResult = JSON.stringify(messageData);

			if (utf8ByteLength(messageDataResult) > 512000) {
				alert('메시지 사이즈가 너무 큽니다.');
				return false;
			}
			console.log(messageDataResult);
			if (confirm("해당 내용으로 메시지를 재전송 하시겠습니까?.") == true) {
				$.ajax({
					url : '/v1/pms/adm/' + messageListRole + '/messages',
					type : 'POST',
					headers : {
						'X-Application-Token' : messageListToken
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : messageDataResult,

					success : function(data) {

						var dataResult = data.result.data;
						if (dataResult) {
							console.log('/v1/pms/adm/' + messageListRole
									+ '/messages(POST)');
							console.log(dataResult);

							alert('메시지를 발송하였습니다.');
							wrapperFunction('messageList');
						} else {
							alert("메시지 전송에 실패 하였습니다.");
							wrapperFunction('messageList');
						}

					},
					error : function(data, textStatus, request) {
						alert('메시지 전송에 실패 하였습니다.');
						wrapperFunction('messageList');
					}
				});

			} else {

			}

		}

	}

}

function resendFormCheck() {

	var messageTarget = $('#remessage-send-user-target-input').val();
	var messageContent = $('#remessage-send-user-textarea').val();

	if (messageTarget == null || messageTarget == "") {
		alert("메세지 보낼 대상을 입력해주세요");
		$('#remessage-send-user-target-input').focus();
		return false;
	}
	if (messageContent == null || messageContent == "") {
		alert("메세지 보낼 내욜을 입력해주세요");
		$('#remessage-send-user-textarea').focus();
		return false;
	}

	return true;
}

function checkSearch() {

	var selectOptionValue = $('#messagelist-search-select').val();
	var inputSearchValue = $('#messagelist-input').val();
	var searchDateStart = $('#messagelist-search-date-start-input').val();
	var defaultMonth = $('#messagelist-date-input').val();

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

	var searchDateEnd = $('#messagelist-search-date-end-input').val();

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
