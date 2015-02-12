var messageListToken = sessionStorage.getItem("token");
var messageListRole = sessionStorage.getItem("role");

$.ajax({
	url : '/pms/adm/'+ messageListRole +'/account',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : messageListToken
	},
	dataType : 'json',
	async : false,

	success : function(data) {
		console.log("ajax data!!!!!");
		console.log(data);
		console.log("ajax data!!!!!");

		console.log('login in ajax call success');
		var ajaxResult = data.result.data;

		if (ajaxResult) {
			if (!data.result.errors) {

				console.log("맥스 리밋:"+ajaxResult.msgCntLimit);
				$('#messageCnt_div').text(ajaxResult.msgCntLimit);
			} else {

				alert(data.result.errors[0]);
			}
		} else {

			//alert('계정 목록을 가지고오는데 실패하였습니다.');
		}

	},
	error : function(data, textStatus, request) {

		//alert('계정 목록을 가지고오는데 실패하였습니다.');
	}
});

//var morrisDataMessage = Morris.Donut({
//	element : 'morris-donut-chart-message',
//	data : [ {
//		label : "사용량",
//		value : 14000
//	}, {
//		label : "남은 사용량",
//		value : 10000
//	} ],
//
//	// colors: [
//	// 'red',
//	// 'rgb(11, 98, 164)',
//	// ],
//	resize : true
//});

var messageTable = $('#dataTables-messageList').dataTable(
		{
			// "bProcessing" : true,
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
				"data" : "resendCount"
			}, {
				"data" : "resendInterval"
			} ],
			'sPaginationType' : 'full_numbers',
			'sAjaxSource' : '/pms/adm/' + messageListRole + '/messages',
			// custom ajax
			'fnServerData' : function(sSource, aoData, fnCallback) {
				$.ajax({
					dataType : 'json',
					contentType : 'application/json;charset=UTF-8',
					type : 'GET',
					url : sSource,
					headers : {
						'X-Application-Token' : messageListToken
					},
					data : aoData,
		
					success : function(data) {

						console.log('success');
						console.log(data.result);
						console.log('success');

						var dataResult = data.result.data;
						if (dataResult) {
							dataResult = data.result.data.data;
							for ( var i in dataResult) {
								if (dataResult[i].pmaAckType == null
										&& dataResult[i].appAckType == null) {
									dataResult[i].pmaAckType = "응답없음";
								} else {
									dataResult[i].pmaAckType = "응답";
									if (dataResult[i].appAckTime != null) {
										dataResult[i].pmaAckTime=dataResult[i].appAckTime;
										 var dateTime = dataResult[i].pmaAckTime;
										 dataResult[i].pmaAckTime = new Date(dateTime)
										 .toLocaleString();
									}else if(dataResult[i].pmaAckTime != null){
										 var dateTime = dataResult[i].pmaAckTime;
										 dataResult[i].pmaAckTime = new Date(dateTime)
										 .toLocaleString();
									}

								}
							 switch (dataResult[i].status) {
								 case 1:
									 dataResult[i].status = "발송됨";
								 break;
							
								 }
								 if (dataResult[i].ack) {
									 
									 dataResult[i].ack = "응답";
								 } else {
									 dataResult[i].ack = "응답 없음";
								 }
																
								 dataResult[i].resendInterval=dataResult[i].resendInterval+"초";							
								 var dateTime = dataResult[i].updateTime;
								 dataResult[i].updateTime = new Date(dateTime)
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
				var searchSelectValue = $('#messagelist-search-select').val();
				var searchSelect = $(
						'#messagelist-search-select option:selected').text();
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

	console.log('target click function..');
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
	console.log("서치 벨류" + inputSearchValue);
	console.log('selectOptjionValue:' + selectOptionValue);
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

// .columnFilter();

// $('#dataTables-example_filter input').unbind();
// $('#dataTables-example_filter input').bind('keyup', function(e) {
// if (e.keyCode == 13) {
// oTable.fnFilter(this.value);
// }
//
// });

// $('tfoot input').unbind();
//
// $('#messagelist-search-btn').bind('click', function(e) {
//
// oTable.fnFilter();
//
// });
// $('tfoot input').bind('keyup', function(e) {
// if (e.keyCode == 13) {
// oTable.fnFilter(this.value, $("tfoot input").index(this));
// }
//
// });

// message content get
// $('#dataTables-messageList tbody').on('click', 'tr', function() {
// console.log('message list id click');
//
// var tableDataRow = $(this).children('td').map(function() {
// return $(this).text();
// }).get();
//
// console.log(tableDataRow[0]);
// var messageID = tableDataRow[0];
// var tokenID = sessionStorage.getItem('tokenID');
// console.log('메세지 아이디');
// console.log(messageID);
//
// $.ajax({
// url : '/v1/messages/' + messageID,
// type : 'GET',
// headers : {
// 'X-ApiKey' : tokenID
// },
// contentType : 'application/json',
// async : false,
// success : function(data) {
//
// if (data.result.data) {
//
// var item = data.result.data;
// console.log('메세지 아이디로 조히ㅣ ');
// console.log(item);
// console.log(item.content);
// var item_Content = item.content;
// if (item.type == "104" || item.type == 104) {
// item_Content = b64_to_utf8(item_Content);
// }
// $('.message-detail-p').html(item_Content);
//
// } else {
// alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
// }
// },
// error : function(data, textStatus, request) {
// console.log(data);
// alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
// }
// });
//
// // $.ajax({
// // url : '/v1/acks/'+ messageID,
// // type : 'GET',
// // headers : {
// // 'X-ApiKey' : tokenID
// // },
// // contentType : "application/json",
// // async : false,
// // success : function(data) {
// //
// // if (data.result.data) {
// // var tableData=[];
// // for ( var i in data.result.data) {
// //
// // var item = data.result.data[i];
// //
// //
// // tableData.push({
// // "UserId" : item.userID,
// //
// //
// // });
// // }
// //
// // console.log(tableData);
// //
// // // 테이블 생성
// // $('#dataTables-example-ack').dataTable({
// // bJQueryUI : true,
// // aaData : tableData,
// // bDestroy : true,
// // aoColumns : [ {
// // mData : 'UserId'
// // } ],
// // aaSorting : [ [ 0, 'desc' ] ]
// // });
// // } else {
// // alert('수신 리스트를 가지고 오는데 실패 하였습니다.');
// // }
// // },
// // error : function(data, textStatus, request) {
// // console.log(data);
// // alert('수신 리스트를 가지고 오는데 실패 하였습니다.');
// // }
// // });
//
// });
