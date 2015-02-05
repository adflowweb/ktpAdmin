var morrisDataMessage = Morris.Donut({
	element : 'morris-donut-chart-message',
	data : [ {
		label : "사용량",
		value : 14000
	}, {
		label : "남은 사용량",
		value : 10000
	} ],

	// colors: [
	// 'red',
	// 'rgb(11, 98, 164)',
	// ],
	resize : true
});
var messageListToken = sessionStorage.getItem("token");
var messageTable = $('#dataTables-messageList').dataTable(
		{
			// "bProcessing" : true,
			'bSort' : false,
			'bServerSide' : true,
			'dom' : 'T<"clear">lrtip',
			
//			<result property="msgId" column="msg_id" />
//			<result property="msgType" column="msg_type" />
//			<result property="receiver" column="receiver" />
//			<result property="receiverTopic" column="receiver_topic" />
//			<result property="serviceId" column="service_id" />

			'columns' : [ {
				"data" : "msgId"
			}, {
				"data" : "msgType"
			}, {
				"data" : "receiver"
			}, {
				"data" : "receiverTopic"
			}, {
				"data" : "serviceId"
			} ],
			// "tableTools" : {
			// "sSwfPath" : "swf/copycsvxlspdf.swf"

			// "aButtons" : [ {
			// "sExtends" : "xls",
			// "sButtonText" : "excel",
			// "sFileName" : "*.xls"
			// }, "copy", "pdf" ]
			// },

			'sPaginationType' : 'full_numbers',
			'sAjaxSource' : '/adm/svc/messages',
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
					statusCode : {
						200 : function(data) {
							console.log("200..");
						},
						401 : function(data) {
							alert("토큰이 만료 되어 로그인 화면으로 이동합니다.");
							$("#page-wrapper").load("pages/login.html",
									function() {
										$('#ul_userInfo').hide();
										$('.navbar-static-side').hide();
										$('#loginId').keypress(function(e) {
											if (e.keyCode != 13)
												return;
											$('#loginPass').focus();
										});
										$('#loginPass').keypress(function(e) {
											if (e.keyCode != 13)
												return;
											$("#login_ahref").click();

										});

									});
						}
					},
					success : function(data) {

						console.log('success');
						console.log(data.result);
						console.log('success');

						var dataResult = data.result.data;
						if (dataResult) {
							dataResult = data.result.data.data;
							for ( var i in dataResult) {
								if (dataResult[i].msgId) {
									console.log("성공");
								//	dataResult[i].msgId="1234l";

								}
							}
							
							data.result.data.data=dataResult;
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
					searchSelect = "sender";
					break;
				case 2:
					searchSelect = "receiver";
					break;
				case 3:
					searchSelect = "time";
					break;
				case 4:
					searchSelect = "ack";
					break;

				}

				if (searchInputValue == null || searchInputValue == "") {
					searchInputValue = "";
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
				// if (messageMonth == null || messageMonth == "") {
				// var nowDate = new Date();
				// var year = nowDate.getFullYear();
				// var month = nowDate.getMonth();
				// if (month < 10) {
				// month = '0' + month;
				// }
				// console.log(year + "/" + month);
				// messageMonth = year + "/" + month;
				//
				// }

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
