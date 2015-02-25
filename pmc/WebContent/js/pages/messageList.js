var messageListToken = sessionStorage.getItem("token");
var messageListRole = sessionStorage.getItem("role");

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
							} else{
								searchSelectText="";
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

						console.log("메시지 리스트  aoData");
						console.log(aoData);
						console.log("메시지 리스트  aoData");
					}

				});

$('#messagelist-search-btn').click(function() {


});

function messageListSearch(){
	var formCheck = checkSearch();

	if (formCheck) {
		messageTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}
}


$('#messagelist-input').keypress(function(e) {
	 if(event.keyCode == 13){
	    	var formCheck = checkSearch();

	    	if (formCheck) {
	    		messageTable.fnFilter();
	    	} else {
	    		console.log('검색항목 선택 안함!!');
	    	}

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
