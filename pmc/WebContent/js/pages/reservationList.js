var reservationListToken = sessionStorage.getItem("token");
var reservationListRole=sessionStorage.getItem("role");
var reservationListTable = $('#reservation-datatable').dataTable(
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
				"data" : "reservationTime"
			} ],
			'sPaginationType' : 'full_numbers',
			'sAjaxSource' : '/pms/adm/'+reservationListRole+'/messages/reservations',
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
								var dateTime = dataResult[i].reservationTime;
								console.log("dateTime:"+dateTime);
								if(dateTime!=null){
									dataResult[i].reservationTime = new Date(dateTime)
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
			//
			// },
			// custom params
			'fnServerParams' : function(aoData) {
				var searchSelectValue = $('#reservation-search-select').val();
				var searchSelect = $(
						'#reservation-search-select option:selected').text();
				var searchInputValue = $('#reservation-input').val();
				var messageMonth = $('#reservation-date-input').val();
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
				}else if(searchInputValue=="응답"){
					searchInputValue=true;
					
				}else if(searchInputValue=="응답 없음"){
					searchInputValue=false;
				}else if(searchInputValue=="발송된"){
					searchInputValue=1*1;
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

$('#reservation-search-btn').click(function() {

	console.log('reservation search click function..');
	var formCheck = checkSearchReservation();

	if (formCheck) {
		reservationTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}

});

function checkSearchReservation() {

	var selectOptionValue = $('#reservation-search-select').val();
	var inputSearchValue = $('#reservation-search-input').val();
	console.log("서치 벨류" + inputSearchValue);
	console.log('selectOptjionValue:' + selectOptionValue);
	inputSearchValue = compactTrim(inputSearchValue);
	console.log(inputSearchValue);
	if (selectOptionValue != 0) {

		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#reservation-search-inputt').focus();
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

//$('#reservation-datatable tbody').on('click', 'tr', function() {
//
//	var tableDataRow = $(this).children('td').map(function() {
//		return $(this).text();
//	}).get();
//
//	console.log(tableDataRow[0]);
//	$('#reservation-cancel-input').val(tableDataRow[0]);
//
////	for (var i = 0; i < tableData.length; i++) {
////		console.log('in for');
////		console.log(tableData[i].MessageId);
////		if (tableData[i].MessageId == tableDataRow[0]) {
////			console.log(tableData[i].MessageId);
////			$('.reservation-detail-p').html(tableData[i].content);
////			$('.reservation-title-p').html(tableData[i].title);
////		}
////	}
//
//});

// function reservationCancelFunction() {
// console.log('reservationCancelFunction...');
// var checkForm = cancelFormCheck();
// if (checkForm) {
// var tokenID = sessionStorage.getItem('tokenID');
//
// if (tokenID) {
// loginUserId = sessionStorage.getItem('userID');
// console.log(loginUserId);
// var input_reservationCancelID = $('#reservation-cancel-input')
// .val();
//
// $.ajax({
// url : '/v1/messages/' + input_reservationCancelID,
// type : 'DELETE',
// headers : {
// 'X-ApiKey' : tokenID
// },
// contentType : 'application/json',
// dataType : 'json',
// async : false,
// success : function(data) {
// console.log(data);
// console.log(data.result.success);
// if (data.result.success) {
// alert("예약된 메세지를 취소하였습니다.");
// $('#reservation-cancel-input').val("");
// $('#reservation-cancel-input').focus();
// wrapperFunction('reservation');
// } else {
// alert("예약된 메세지를 취소에 실패했습니다.");
// $('#reservation-cancel-input').val("");
// $('#reservation-cancel-input').focus();
//
// }
// },
// error : function(data, textStatus, request) {
// alert("예약된 메세지를 취소에 실패했습니다.");
// $('#reservation-cancel-input').val("");
// $('#reservation-cancel-input').focus();
//
// console.log(data);
// }
// });
// }
// }
// }

// form check..
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