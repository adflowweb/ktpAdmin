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

var messageTable = $('#dataTables-messageList').dataTable(
		{
			// "bProcessing" : true,
			'bSort' : false,
			'bServerSide' : true,
			'dom' : 'T<"clear">lrtip',
			'columns' : [ {
				"data" : "msg_id"
			}, {
				"data" : "sender"
			}, {
				"data" : "receiver"
			}, {
				"data" : "time"
			}, {
				"data" : "ackcheck"
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
			'sAjaxSource' : '/adflow/v1',
			// custom ajax
			'fnServerData' : function(sSource, aoData, fnCallback) {
				$.ajax({
					dataType : 'json',
					contentType : 'application/json;charset=UTF-8',
					type : 'GET',
					url : sSource,
					headers : {
						'X-ApiKey' : 'chanho'
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
						console.log(data.data);
						var dataResult = data.data;
						console.log(dataResult);
						for ( var i in dataResult) {
							if (dataResult[i].ackcheck == 5) {
								var addObj = dataResult[i].ackcheck;
								dataResult[i].ackcheck = addObj + "3";
							}
						}
						data.data = dataResult;
						fnCallback(data);
					},
					error : function(e) {
						console.log('error');
						$('#error').html(e.responseText);
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
				if (searchSelectValue == 0) {
					searchSelect = "";
				}

				if (searchInputValue == null || searchInputValue == "") {
					searchInputValue = "";
				}

				aoData.push({
					'name' : 'searchSelect',
					'value' : searchSelect
				});
				aoData.push({
					'name' : 'searchValue',
					'value' : searchInputValue
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
	console.log('selectOptjionValue:' + selectOptionValue);

	if (selectOptionValue == 0) {
		alert('검색할 항목을 선택해 주세요');
		return false;
	} else if (inputSearchValue == null || inputSearchValue == "") {
		alert('검색할 내용을 입력해 주세요');
		return false;
	} else {
		return true;
	}

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

$('#dataTables-messageList tbody').on('click', 'tr', function() {
	console.log('message list id click');

	var tableDataRow = $(this).children('td').map(function() {
		return $(this).text();
	}).get();

	console.log(tableDataRow[0]);
	var messageID = tableDataRow[0];
	var tokenID = sessionStorage.getItem('tokenID');
	console.log('메세지 아이디');
	console.log(messageID);

	$.ajax({
		url : '/v1/messages/' + messageID,
		type : 'GET',
		headers : {
			'X-ApiKey' : tokenID
		},
		contentType : 'application/json',
		async : false,
		success : function(data) {

			if (data.result.data) {

				var item = data.result.data;
				console.log('메세지 아이디로 조히ㅣ ');
				console.log(item);
				console.log(item.content);
				var item_Content = item.content;
				if (item.type == "104" || item.type == 104) {
					item_Content = b64_to_utf8(item_Content);
				}
				$('.message-detail-p').html(item_Content);

			} else {
				alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
			}
		},
		error : function(data, textStatus, request) {
			console.log(data);
			alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
		}
	});

	// $.ajax({
	// url : '/v1/acks/'+ messageID,
	// type : 'GET',
	// headers : {
	// 'X-ApiKey' : tokenID
	// },
	// contentType : "application/json",
	// async : false,
	// success : function(data) {
	//
	// if (data.result.data) {
	// var tableData=[];
	// for ( var i in data.result.data) {
	//
	// var item = data.result.data[i];
	//		
	//
	// tableData.push({
	// "UserId" : item.userID,
	//						
	//
	// });
	// }
	//
	// console.log(tableData);
	//
	// // 테이블 생성
	// $('#dataTables-example-ack').dataTable({
	// bJQueryUI : true,
	// aaData : tableData,
	// bDestroy : true,
	// aoColumns : [ {
	// mData : 'UserId'
	// } ],
	// aaSorting : [ [ 0, 'desc' ] ]
	// });
	// } else {
	// alert('수신 리스트를 가지고 오는데 실패 하였습니다.');
	// }
	// },
	// error : function(data, textStatus, request) {
	// console.log(data);
	// alert('수신 리스트를 가지고 오는데 실패 하였습니다.');
	// }
	// });

});
