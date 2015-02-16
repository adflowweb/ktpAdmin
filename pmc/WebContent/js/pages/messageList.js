var messageListToken = sessionStorage.getItem("token");
var messageListRole = sessionStorage.getItem("role");

$.ajax({
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
				console.log( '/v1/pms/adm/' + messageListRole + '/account(GET)');
				console.log(dataResult);
				$('#messageCnt_div').text(dataResult.msgCntLimit);
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
					'sAjaxSource' : '/v1/pms/adm/' + messageListRole + '/messages',
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
									
										var dataResult = data.result.data;
										if (dataResult) {
											console.log('/v1/pms/adm/' + messageListRole + '/messages(GET)');
											console.log(dataResult);
											$('#messageListCnt_div')
													.text(
															data.result.data.recordsTotal);
											dataResult = data.result.data.data;
											for ( var i in dataResult) {
												if (dataResult[i].pmaAckType == null) {
													dataResult[i].pmaAckType = "응답없음";
												} else {
													if (dataResult[i].appAckType != null) {
														dataResult[i].pmaAckType = "사용자응답";
														var dateTime = dataResult[i].appAckTime;
														dataResult[i].pmaAckTime = new Date(dateTime).toLocaleString();
													} else {
														dataResult[i].pmaAckType = "기기응답";
														var dateTime = dataResult[i].pmaAckTime;
														dataResult[i].pmaAckTime = new Date(dateTime).toLocaleString();
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
													dataResult[i].status = "메시지제한";
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
											alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');

										}

									},
									error : function(e) {
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
						var searchSelect = $(
								'#messagelist-search-select option:selected')
								.text();
						var searchInputValue = $('#messagelist-input').val();
						var messageMonth = $('#messagelist-date-input').val();
						searchSelectValue = searchSelectValue * 1;

						switch (searchSelectValue) {
						case 0:
							searchSelect = "";
							break;
						case 1:
							break;
						searchSelect = "msgId";
					case 2:
						searchSelect = "updateId";
						break;
					case 3:
						searchSelect = "receiver";
						break;
					case 4:
						searchSelect = "ack";
						break;
					case 5:
						searchSelect = "status";
						break;

					}

					if (searchInputValue == null || searchInputValue == "") {
						searchInputValue = "";
					} else if (searchInputValue == "응답") {
						searchInputValue = true;

					} else if (searchInputValue == "응답 없음") {
						searchInputValue = false;
					} else if (searchInputValue == "발송된") {
						searchInputValue = 1 * 1;
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
						'name' : 'cSearchFilter',
						'value' : searchSelect
					});
					aoData.push({
						'name' : 'cSearchContent',
						'value' : searchInputValue
					});
					aoData.push({
						'name' : 'cSearchDate',
						'value' : messageMonth
					});

				}

				});

$('#messagelist-search-btn').click(function() {
	var formCheck = checkSearch();

	if (formCheck) {
		messageTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}

});

function checkSearch() {

	var selectOptionValue = $('#messagelist-search-select').val();
	var inputSearchValue = $('#messagelist-input').val();
	console.log("검색 값" + inputSearchValue);
	console.log('검색 항목:' + selectOptionValue);
	inputSearchValue = compactTrim(inputSearchValue);
	console.log(inputSearchValue);
	if (selectOptionValue != 0) {

		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#messagelist-input').focus();
			return false;

		}

	} else if (inputSearchValue != null && inputSearchValue != "") {
		console.log(inputSearchValue);

		if (selectOptionValue == 0) {
			alert('검색 항목을 선택해주세요');

			return false;
		}

	}
	return true;

}


