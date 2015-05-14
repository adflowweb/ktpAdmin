//getToken
var messageListToken = sessionStorage.getItem("token");
// getRole
var messageListRole = sessionStorage.getItem("role");
// disable input
$("#messagelist-search-date-start-input").prop('disabled', true);
// disable input
$("#messagelist-search-date-end-input").prop('disabled', true);
var messageListResult = "";

/*
 * // getAccount Info $.ajax({ url : '/v1/pms/adm/' + messageListRole +
 * '/account', type : 'GET', contentType : "application/json", headers : {
 * 'X-Application-Token' : messageListToken }, dataType : 'json', async : false,
 * 
 * success : function(data) { if (!data.result.errors) { var dataResult =
 * data.result.data; if (dataResult.msgCntLimit == -1) {
 * $('#messageCnt_div').text("제한없음"); } else {
 * $('#messageCnt_div').text(dataResult.msgCntLimit); } } else { alert('계정 목록을
 * 가지고오는데 실패하였습니다.'); } }, error : function(data, textStatus, request) {
 * alert('계정 목록을 가지고오는데 실패하였습니다.'); } });
 */

// dp.change check
$("#messagelist-date-div").on("dp.change", function(e) {
	setTimeout(changeDateInput, 500);

});

// setDate
function changeDateInput() {
	var messagelist_Picker = $("#messagelist-date-input").val();
	var messageList_Result = [];
	messageList_Result = messagelist_Picker.split("/");
	$('#messagelist-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#messagelist-search-date-end-div').datetimepicker().data(
			"DateTimePicker").setDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#messagelist-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setMinDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#messagelist-search-date-start-div').datetimepicker().data(
			"DateTimePicker").setMaxDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#messagelist-search-date-end-div').datetimepicker().data(
			"DateTimePicker").setMinDate(
			chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#messagelist-search-date-end-div').datetimepicker().data(
			"DateTimePicker").setMaxDate(
			chageDateL(messageList_Result[0], messageList_Result[1]));

}

// messageTable Create
var messageTable = $('#dataTables-messageList')
		.dataTable(
				{

					'bSort' : false,
					'bServerSide' : true,
					'bFilter' : false,
					bScrollCollapse : true,
					// "autoWidth" : false,
					scrollX : true,

					"pageLength" : 25,
					'columns' : [ {
						"data" : "updateTime",
						'sClass' : 'one-line'
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
						"data" : "appAckType"
					}, {
						"data" : "appAckTime"
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

										if (!data.result.errors) {
											var dataResult = data.result.data;
											$('#hidden-messageListCnt')
													.val(
															data.result.data.recordsTotal);
											dataResult = data.result.data.data;
											messageListResult = dataResult;
											for ( var i in dataResult) {

												if (dataResult[i].pmaAckType == null) {

													dataResult[i].pmaAckType = '응답없음';
												} else {
													dataResult[i].pmaAckType = '기기응답';
													var dateTime = dataResult[i].pmaAckTime;
													dataResult[i].pmaAckTime = new Date(
															dateTime)
															.toLocaleString();
												}

												if (dataResult[i].appAckType == null) {

													dataResult[i].appAckType = '응답없음';
												} else {
													dataResult[i].appAckType = '유저응답';
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
							if (month < 10) {
								month = '0' + month;
							}
							messageMonth = year + "/" + month;

							$('#messagelist-date-input').val(messageMonth);
						}

						messageMonth = messageMonth.replace("/", "");

						aoData.push({
							'name' : 'cSearchDate',
							'value' : messageMonth
						});

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
					}

				});
// dataTable Click
$('#dataTables-messageList tbody')
		.on(
				'click',
				'tr',
				function() {
					if (messageListResult.length > 0) {
						if (confirm("해당 메시지의 본문 내용을 보시겠습니까?") == true) {
							$('#remessage-div').show();
							var messageListContent = "";
							var tableClickData = $(this).children("td").map(
									function() {
										return $(this).text();
									}).get();
							for ( var i in messageListResult) {
								if (messageListResult[i].msgId == tableClickData[10]) {
									$('#remessage-send-user-target-input').val(
											messageListResult[i].receiver);

									if (messageListResult[i].contentType == "application/base64") {
										messageListContent = b64_to_utf8(messageListResult[i].content);
										// messageListResult[i].content =
										// b64_to_utf8(messageListResult[i].content);
									}

									$('#remessage-send-user-textarea').val(
											messageListContent);
									if (messageListRole == "svc") {
										$('#remessage-send-p').show();
										messageListContent = messageListContent
												.trim();
										$('#remessage-send-length-strong')
												.text(
														messageListContent
																.Length());
									} else {
										$('#remessage-send-p').hide();
									}
									$('#remessage-send-serviceid').val(
											messageListResult[i].serviceId);
								}

							}
							$('#remessage-send-user-textarea').focus();
						}

					}
				});

// selectChange
function searchSelectChange() {
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

// searchBtnClick
function messageListSearch() {
	var formCheck = checkSearch();

	if (formCheck) {
		messageTable.fnFilter();
	} else {

	}
}

// searchBtnEnter
$('#messagelist-input').keypress(function(e) {
	if (event.keyCode == 13) {
		var formCheck = checkSearch();

		if (formCheck) {
			messageTable.fnFilter();
		} else {

		}

	}

});

// messageReSend
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

			var p2Numtemp = p2numArray();

			var svcUfmi = sessionStorage.getItem("ufmi");
			console.log(svcUfmi);
			var checkResult = new ufmiVerCheck(svcUfmi);

			var ufmiVer = checkResult.ufmiVer;
			var firstIndex = checkResult.firstIndex;
			var lastIndex = checkResult.lastIndex;

			console.log(ufmiVer);
			console.log(firstIndex);
			console.log(lastIndex);

			if (ufmiVer == "p1") {
				console.log('피원');
				for ( var i in messageData.receivers) {
					if (messageData.receivers[i].length == 0) {
						console.log('리시버 길이 0');
						alert('올바른 무전 번호를 입력하세요');
						$('#remessage-send-user-target-input').focus();
						return false;
					}
					var inputReceiverNum = messageData.receivers[i].split('*');
					var inputNumLength = inputReceiverNum.length;
					var num_check = /^[0-9]*$/;
					switch (inputNumLength) {
					case 1:
						if (!num_check.test(inputReceiverNum[0])
								|| inputReceiverNum[0].length > 6) {
							console.log(inputReceiverNum[0].length);
							alert('개인번호만 입력시 1~6자리 숫자만 입력. ex)1234');
							$('#remessage-send-user-target-input').focus();
							return false;
						}
						messageData.receivers[i] = lastIndex
								+ inputReceiverNum[0];
						break;

					case 2:
						if (!num_check.test(inputReceiverNum[0])
								|| inputReceiverNum[0].length > 6
								|| !num_check.test(inputReceiverNum[1])
								|| inputReceiverNum[1].length > 6) {

							alert('82번호 생략시 1~6자리*1~6자리 형태로 입력! ex)100*1234');
							$('#remessage-send-user-target-input').focus();
							return false;
						}

						messageData.receivers[i] = firstIndex
								+ inputReceiverNum[0] + "*"
								+ inputReceiverNum[1];
						console.log(messageData.receivers[i]);

						break;
					// 별 2개이면 p1 p2 체크
					case 3:
						if (inputReceiverNum[0].length > 2) {
							alert('무전번호의 첫자리는 2자리숫자로 입력!');
							$('#remessage-send-user-target-input').focus();
							return false;
						}
						var p2Substring = inputReceiverNum[0].substring(0, 2);
						var check = false;
						// 00~41 check
						for (var j = 0; j < p2Numtemp.length; j++) {
							if (p2Substring == p2Numtemp[j]) {
								check = true;
							}
						}

						if (inputReceiverNum[0].substring(0, 2) == "82"
								&& inputReceiverNum[1].length < 7
								&& num_check.test(inputReceiverNum[1])
								&& inputReceiverNum[2].length < 7
								&& num_check.test(inputReceiverNum[2])) {
							console.log('p1 번호 ');
						} else if (check && inputReceiverNum[1].length < 5
								&& num_check.test(inputReceiverNum[1])
								&& inputReceiverNum[2].length < 5
								&& num_check.test(inputReceiverNum[2])) {
							console.log('p2 번호');

						} else {
							alert('올바른 무전 번호를 입력해주세요!');
							$('#remessage-send-user-target-input').focus();
							return false;
						}
						console.log('발송 무전번호');
						messageData.receivers[i] = inputReceiverNum[0] + "*"
								+ inputReceiverNum[1] + "*"
								+ inputReceiverNum[2];
						console.log(messageData);

						break;

					default:
						alert('올바른 무전 번호를 입력해주세요!');
						$('#remessage-send-user-target-input').focus();
						return false;
						break;
					}
				}

			}

			// p2
			if (ufmiVer == "p2") {
				console.log('피투');
				// 01~41 push

				console.log(messageData.receivers);

				for ( var i in messageData.receivers) {
					if (messageData.receivers[i].length == 0) {
						console.log('리시버 길이 0');
						alert('올바른 무전 번호를 입력하세요');
						$('#remessage-send-user-target-input').focus();
						return false;
					}

					var inputReceiverNum = messageData.receivers[i].split('*');
					var inputNumLength = inputReceiverNum.length;
					var num_check = /^[0-9]*$/;
					switch (inputNumLength) {
					case 1:
						console.log('케이스 1');
						if (!num_check.test(inputReceiverNum[0])
								|| inputReceiverNum[0].length > 4) {
							console.log(inputReceiverNum[0].length);
							alert('개인번호만 입력시 1자리에서~4자리 숫자만 입력. ex)1234');
							$('#remessage-send-user-target-input').focus();
							return false;
						}
						messageData.receivers[i] = lastIndex
								+ inputReceiverNum[0];

						console.log("실제 전송번호");
						console.log(messageData.receivers[i]);

						break;
					case 2:
						console.log('케이스 2');
						if (!num_check.test(inputReceiverNum[0])
								|| inputReceiverNum[0].length > 4
								|| !num_check.test(inputReceiverNum[1])
								|| inputReceiverNum[1].length > 4) {
							console.log(inputReceiverNum[0].length);
							console.log(inputReceiverNum[1].length);
							alert('첫번째 무전 번호 생략시 1~4자리*1~4자리 형태로 입력! ex)100*1234');
							$('#remessage-send-user-target-input').focus();
							return false;
						}

						messageData.receivers[i] = firstIndex
								+ inputReceiverNum[0] + "*"
								+ inputReceiverNum[1];
						console.log("실제 전송번호");
						console.log(messageData.receivers[i]);

						break;

					case 3:
						console.log('케이스 3');
						if (inputReceiverNum[0].length > 2) {
							alert('무전번호의 첫자리는 2자리숫자로 입력!');
							$('#remessage-send-user-target-input').focus();
							return false;
						}
						var p2Substring = inputReceiverNum[0].substring(0, 2);
						var check = false;
						// 00~41 check
						for (var j = 0; j < p2Numtemp.length; j++) {
							if (p2Substring == p2Numtemp[j]) {
								check = true;
							}
						}

						if (inputReceiverNum[0].substring(0, 2) == "82"
								&& inputReceiverNum[1].length < 7
								&& num_check.test(inputReceiverNum[1])
								&& inputReceiverNum[2].length < 7
								&& num_check.test(inputReceiverNum[2])) {
							console.log('p1 번호 ');
						} else if (check && inputReceiverNum[1].length < 5
								&& num_check.test(inputReceiverNum[1])
								&& inputReceiverNum[2].length < 5
								&& num_check.test(inputReceiverNum[2])) {
							console.log('p2 번호');

						} else {
							alert('올바른 무전 번호를 입력해주세요!');
							$('#remessage-send-user-target-input').focus();
							return false;
						}
						console.log('발송 무전번호');
						messageData.receivers[i] = inputReceiverNum[0] + "*"
								+ inputReceiverNum[1] + "*"
								+ inputReceiverNum[2];
						console.log(messageData);
						break;

					default:
						alert('올바른 무전 번호를 입력해주세요!');
						$('#remessage-send-user-target-input').focus();
						return false;
						break;
					}
				}
			}// p2

			// end 전송대상 체크

			// var contentLength=$('#remessage-send-length-strong').text();
			// messageData.contentLength=contentLength;
			// console.log('메시지 전송전 길이');
			// console.log(messageData.contentLength);

			var messageDataResult = JSON.stringify(messageData);

			/*
			 * if (utf8ByteLength(messageDataResult) > 512000) { alert('메시지 사이즈가
			 * 너무 큽니다.'); return false; }
			 */

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

						if (!data.result.errors) {
							alert('메시지를 발송하였습니다.');
							wrapperFunction('messageList');
						} else {
							alert('메시지 전송에 실패 하였습니다.');
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

			/*
			 * if (utf8ByteLength(messageDataResult) > 512000) { alert('메시지 사이즈가
			 * 너무 큽니다.'); return false; }
			 */

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

						if (!data.result.errors) {
							var dataResult = data.result.data;
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

$('#remessage-send-user-target-input').bind('input keyup paste', function() {
	setTimeout(reSendUfmiCheckTime, 0);
});

function reSendUfmiCheckTime() {
	// $('#message-send-user-ufmi-span').text("실제 전송번호:" +
	// input_messageTarget[i]);
	console.log('무전번호 체크');
	var input_messageTarget = $('#remessage-send-user-target-input').val();
	if (input_messageTarget == null || input_messageTarget == "") {
		$('#remessage-send-user-ufmi-span').text("");
		return false;
	}
	input_messageTarget = input_messageTarget.split(",");
	var p2Numtemp = p2numArray();
	var svcUfmi = sessionStorage.getItem("ufmi");
	var checkResult = new ufmiVerCheck(svcUfmi);
	var ufmiVer = checkResult.ufmiVer;
	var firstIndex = checkResult.firstIndex;
	var lastIndex = checkResult.lastIndex;

	if (ufmiVer == "p1") {
		console.log('피원');
		for ( var i in input_messageTarget) {
			var inputReceiverNum = input_messageTarget[i].split('*');
			var inputNumLength = inputReceiverNum.length;
			var num_check = /^[0-9]*$/;
			switch (inputNumLength) {
			case 1:
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 6) {
					console.log(inputReceiverNum[0].length);
				
					$('#remessage-send-user-target-input').focus();
					return false;
				}
				input_messageTarget[i] = lastIndex + inputReceiverNum[0];

				console.log(input_messageTarget[i]);
				$('#remessage-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;

			case 2:
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 6
						|| !num_check.test(inputReceiverNum[1])
						|| inputReceiverNum[1].length > 6) {

					$('#remessage-send-user-target-input').focus();
					return false;
				}

				input_messageTarget[i] = firstIndex + inputReceiverNum[0] + "*"
						+ inputReceiverNum[1];
				console.log(input_messageTarget[i]);
				$('#remessage-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;
			// 별 2개이면 p1 p2 체크
			case 3:
				if (inputReceiverNum[0].length > 2) {

					$('#remessage-send-user-target-input').focus();
					return false;
				}
				var p2Substring = inputReceiverNum[0].substring(0, 2);
				var check = false;
				// 00~41 check
				for (var j = 0; j < p2Numtemp.length; j++) {
					if (p2Substring == p2Numtemp[j]) {
						check = true;
					}
				}

				if (inputReceiverNum[0].substring(0, 2) == "82"
						&& inputReceiverNum[1].length < 7
						&& num_check.test(inputReceiverNum[1])
						&& inputReceiverNum[2].length < 7
						&& num_check.test(inputReceiverNum[2])) {
					console.log('p1 번호 ');
				} else if (check && inputReceiverNum[1].length < 5
						&& num_check.test(inputReceiverNum[1])
						&& inputReceiverNum[2].length < 5
						&& num_check.test(inputReceiverNum[2])) {
					console.log('p2 번호');

				} else {

					$('#remessage-send-user-target-input').focus();
					return false;
				}
				console.log('발송 무전번호');
				input_messageTarget[i] = inputReceiverNum[0] + "*"
						+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
				$('#remessage-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);

				break;

			default:

				$('#remessage-send-user-target-input').focus();
				return false;
				break;
			}
		}

	}

	// p2
	if (ufmiVer == "p2") {
		console.log('피투');
		// 01~41 push

		for ( var i in input_messageTarget) {

			var inputReceiverNum = input_messageTarget[i].split('*');
			var inputNumLength = inputReceiverNum.length;
			var num_check = /^[0-9]*$/;
			switch (inputNumLength) {
			case 1:
				console.log('케이스 1');
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 4) {
					console.log(inputReceiverNum[0].length);

					$('#remessage-send-user-target-input').focus();
					return false;
				}
				input_messageTarget[i] = lastIndex + inputReceiverNum[0];

				console.log("실제 전송번호");
				console.log(input_messageTarget[i]);
				$('#remessage-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;
			case 2:
				console.log('케이스 2');
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 4
						|| !num_check.test(inputReceiverNum[1])
						|| inputReceiverNum[1].length > 4) {
					console.log(inputReceiverNum[0].length);
					console.log(inputReceiverNum[1].length);

					$('#remessage-send-user-target-input').focus();
					return false;
				}

				input_messageTarget[i] = firstIndex + inputReceiverNum[0] + "*"
						+ inputReceiverNum[1];
				console.log("실제 전송번호");
				console.log(input_messageTarget[i]);
				$('#remessage-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;

			case 3:
				console.log('케이스 3');
				if (inputReceiverNum[0].length > 2) {

					$('#remessage-send-user-target-input').focus();
					return false;
				}
				var p2Substring = inputReceiverNum[0].substring(0, 2);
				var check = false;
				// 00~41 check
				for (var j = 0; j < p2Numtemp.length; j++) {
					if (p2Substring == p2Numtemp[j]) {
						check = true;
					}
				}

				if (inputReceiverNum[0].substring(0, 2) == "82"
						&& inputReceiverNum[1].length < 7
						&& num_check.test(inputReceiverNum[1])
						&& inputReceiverNum[2].length < 7
						&& num_check.test(inputReceiverNum[2])) {
					console.log('p1 번호 ');
				} else if (check && inputReceiverNum[1].length < 5
						&& num_check.test(inputReceiverNum[1])
						&& inputReceiverNum[2].length < 5
						&& num_check.test(inputReceiverNum[2])) {
					console.log('p2 번호');

				} else {

					$('#remessage-send-user-target-input').focus();
					return false;
				}
				console.log('발송 무전번호');
				input_messageTarget[i] = inputReceiverNum[0] + "*"
						+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
				$('#remessage-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;

			default:

				$('#remessage-send-user-target-input').focus();
				return false;
				break;
			}
		}
	}// p2

	console.log('무전번호 체크');
}

// message-send-user-textarea
$('#remessage-send-user-textarea').bind('input keyup paste', function() {
	if (messageListRole == "svc") {
		setTimeout(contentReSendLengthCheck, 0);
	} else {
		return false;
	}
});

function contentReSendLengthCheck() {

	var input_messageContent = $('#remessage-send-user-textarea').val();
	input_messageContent = input_messageContent.trim();
	console.log(input_messageContent.Length());
	var strongLength = input_messageContent.Length();
	if (strongLength > 140) {
		$('#remessage-send-length-strong').text(strongLength);

		alert('140자 이내로 입력하세요!');
		$('#remessage-send-user-textarea').val(
				input_messageContent.substring(0,
						input_messageContent.length - 1));
		return false;
	} else {
		$('#remessage-send-length-strong').text(strongLength);
	}

}

// formCheck
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

// exportCsv
function messageListCsvExport() {

	var messageCount = $('#hidden-messageListCnt').val();
	messageCount = messageCount * 1;

	if (messageCount == 0) {
		alert('다운로드할 데이터가 없습니다.');
		return false;
	}

	if (messageCount <= 10000) {
		if (confirm("총 " + messageCount + "건에 대해서 csv 파일로 다운로드 하시겠습니까?") == true) {
			var searchSelectValue = $('#messagelist-search-select').val();
			var searchSelectText = $(
					'#messagelist-search-select option:selected').text();
			var searchInputValue = $('#messagelist-input').val();
			var searchDateStart = $('#messagelist-search-date-start-input')
					.val();
			var searchDateEnd = $('#messagelist-search-date-end-input').val();
			var messageMonth = $('#messagelist-date-input').val();

			var requestUrl = '?';
			var csvCSearchStatus = "";
			if (messageMonth == null || messageMonth == "") {
				var nowDate = new Date();
				var year = nowDate.getFullYear();
				var month = nowDate.getMonth() + 1;
				if (month < 10) {
					month = '0' + month;
				}

				messageMonth = year + "/" + month;
			}

			messageMonth = messageMonth.replace("/", "");

			requestUrl = requestUrl + 'cSearchDate=' + messageMonth;

			if (searchDateStart != "") {
				searchDateStart = dateFormating(searchDateStart);
				if (searchDateStart) {
					searchDateStart = searchDateStart.toISOString();
					requestUrl = requestUrl + '&cSearchDateStart='
							+ searchDateStart;
				}
			}

			if (searchDateEnd != "") {
				searchDateEnd = dateFormating(searchDateEnd);

				if (searchDateEnd) {
					searchDateEnd = searchDateEnd.toISOString();
					requestUrl = requestUrl + '&cSearchDateEnd='
							+ searchDateEnd;
				}
			}

			searchSelectValue = searchSelectValue * 1;

			switch (searchSelectValue) {
			case 0:
				csvCSearchStatus = 'ALL';
				requestUrl = requestUrl + '&cSearchStatus=' + csvCSearchStatus;
				break;
			// status
			case 1:
				var statusValue = $(
						'#messagelist-search-status-select option:selected')
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
						'#messagelist-search-ack-select option:selected').val();
				searchSelectText = "ack";
				csvCSearchStatus = "ALL";
				requestUrl = requestUrl + '&cSearchFilter=' + searchSelectText;
				requestUrl = requestUrl + '&cSearchContent=' + ackValue;
				requestUrl = requestUrl + '&cSearchStatus=' + csvCSearchStatus;
				break;

			default:

				break;
			}

			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {

				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (navigator.userAgent.indexOf('MSIE') !== -1
							|| navigator.appVersion.indexOf('Trident/') > 0) {

						var a = document.createElement('a');
						if (window.navigator.msSaveOrOpenBlob) {
							blobObject = new Blob([ xmlhttp.responseText ]);
							a.onclick = function() {
								window.navigator.msSaveOrOpenBlob(blobObject,
										'message.csv');
							};
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

			xmlhttp.open("GET", '/v1/pms/adm/' + messageListRole
					+ '/messages/csv' + requestUrl, true);
			xmlhttp.setRequestHeader("X-Application-Token", messageListToken);
			xmlhttp.send();

		}

	} else {
		alert('다운로드는 10000개의 목록 까지만 가능합니다.');
		return false;
	}

}

// formCheck
function checkSearch() {

	var selectOptionValue = $('#messagelist-search-select').val();
	var inputSearchValue = $('#messagelist-input').val();
	var searchDateStart = $('#messagelist-search-date-start-input').val();
	var defaultMonth = $('#messagelist-date-input').val();

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

	var searchDateEnd = $('#messagelist-search-date-end-input').val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		searchDateEnd = "";
	}

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

}
