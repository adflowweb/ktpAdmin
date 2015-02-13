$("#statistics-search-date-start-input").prop('disabled', true);
$("#statistics-search-date-end-input").prop('disabled', true);
$("#statistics-reservation-search-date-start-input").prop('disabled', true);
$("#statistics-reservation-search-date-end-input").prop('disabled', true);
var statisticsToken = sessionStorage.getItem("token");
var statisticsRole = sessionStorage.getItem("role");

//setAccount
$.ajax({
	url : '/v1/pms/adm/'+statisticsRole+'/users',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : statisticsToken
	},
	dataType : 'json',
	async : false,

	success : function(data) {
		console.log("ajax data!!!!!");
		console.log(data);
		console.log("ajax data!!!!!");

		console.log('login in ajax call success');
		var loginResult = data.result.data;

		if (loginResult) {
			if (!data.result.errors) {

				for ( var i in data.result.data) {
					var successData = data.result.data[i];
					console.log(successData.role);
					if (successData.role == "sys") {

					} else if(successData.role == "svc") {
						$("#statistics-account-select").append(
								"<option value='" + (i * 1 + 1) + "'>"
										+ successData.userId + "</option>");
						$("#statistics-reservation-account-select").append(
								"<option value='" + (i * 1 + 1) + "'>"
										+ successData.userId + "</option>");
					}else if(successData.role=="svcadm"){
						$("#statistics-account-select").append(
								"<option value='" + (i * 1 + 1) + "'>"
										+ successData.userId + "</option>");
						$("#statistics-reservation-account-select").append(
								"<option value='" + (i * 1 + 1) + "'>"
										+ successData.userId + "</option>");
					}

				}

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


//create messageList
var statisticsTable = $('#statistics-datatable').dataTable(
		{
			// "bProcessing" : true,
			'bServerSide' : true,
			'bSort' : false,
			'dom' : 'T<"clear">lrtip',
			'columns' :[{
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
			},  {
				"data" : "resendMaxCount"
			}, {
				"data" : "resendInterval"
			}] ,
			'sPaginationType' : 'full_numbers',
			'sAjaxSource' : '/v1/pms/adm/'+statisticsRole+'/messages',
			// custom ajax
			'fnServerData' : function(sSource, aoData, fnCallback) {
				$.ajax({
					dataType : 'json',
					contentType : 'application/json;charset=UTF-8',
					type : 'GET',
					url : sSource,
					headers : {
						'X-Application-Token' : statisticsToken
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
								
																
								 dataResult[i].resendInterval=dataResult[i].resendInterval+"분";							
								 var dateTime = dataResult[i].updateTime;
								 dataResult[i].updateTime = new Date(dateTime)
								 .toLocaleString();

							}

							data.result.data.data = dataResult;
							fnCallback(data.result.data);

						} else {
							//alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');

						}

					},
					error : function(e) {
						//alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');
					}
				});
			},
			//
			// },
			// custom params
			'fnServerParams' : function(aoData) {
				//계정select
				var accountSelectValue = $('#statistics-account-select').val();
				var searchSelectValue = $('#statistics-search-select').val();
				var searchSelectText = $(
						'#statistics-search-select option:selected').text();
				var accountSelectText = $(
						'#statistics-account-select option:selected').text();
				var searchInputValue = $('#statistics-search-input').val();

				var searchDateStart = $('#statistics-search-date-start-input')
						.val();
				var searchDateEnd = $('#statistics-search-date-end-input')
						.val();

				var nowDate = new Date();
				var year = nowDate.getFullYear();
				var month = nowDate.getMonth() + 1;
				console.log(month);
				if (month < 10) {
					month = '0' + month;
				}
				console.log(year + "/" + month);
				var defaultMonth = year + month;
				
				searchDateStart = dateFormating(searchDateStart);
				if (searchDateStart) {
					searchDateStart = searchDateStart.toISOString();
				}

				searchDateEnd = dateFormating(searchDateEnd);
				if (searchDateEnd) {
					searchDateEnd = searchDateEnd.toISOString();
				}

				if (searchSelectValue == 0) {
					searchSelectText = "";
				}

				if (accountSelectValue == 0) {
					accountSelectText = "";
				}

				if (searchInputValue == null || searchInputValue == "") {
					searchInputValue = "";
				}

				aoData.push({
					'name' : 'accountSelect',
					'value' : accountSelectText
				});

				aoData.push({
					'name' : 'cSearchFilter',
					'value' : searchSelectText
				});
				aoData.push({
					'name' : 'cSearchContent',
					'value' : searchInputValue
				});
				aoData.push({
					'name' : 'cSearchDate',
					'value' : defaultMonth
				});
				aoData.push({
					'name' : 'cSearchDateStart',
					'value' : searchDateEnd
				});
				aoData.push({
					'name' : 'cSearchDateEnd',
					'value' : searchDateEnd
				});


				
				
			}

		});


//create reservationMessageList      
var statisticsReservationTable = $('#statistics-reservation-datatable').dataTable(
		{
			// "bProcessing" : true,
			'bServerSide' : true,
			'bSort' : false,
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
			'sAjaxSource' : '/v1/pms/adm/'+statisticsRole+'/messages/reservations',
			// custom ajax
			'fnServerData' : function(sSource, aoData, fnCallback) {
				$.ajax({
					dataType : 'json',
					contentType : 'application/json;charset=UTF-8',
					type : 'GET',
					url : sSource,
					headers : {
						'X-Application-Token' : statisticsToken
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
							//alert('예약 메시지 목록을 가지고 오는데 실패 하였습니다.');

						}

					},
					error : function(e) {
						//alert('예약 메시지 목록을 가지고 오는데 실패 하였습니다.');
					}
				});
			},
			//
			// },
			// custom params
			'fnServerParams' : function(aoData) {
				//계정select
				var accountSelectValue = $('#statistics-account-select').val();
				var searchSelectValue = $('#statistics-search-select').val();
				var searchSelectText = $(
						'#statistics-search-select option:selected').text();
				var accountSelectText = $(
						'#statistics-account-select option:selected').text();
				var searchInputValue = $('#statistics-search-input').val();

				var searchDateStart = $('#statistics-search-date-start-input')
						.val();
				var searchDateEnd = $('#statistics-search-date-end-input')
						.val();

				var nowDate = new Date();
				var year = nowDate.getFullYear();
				var month = nowDate.getMonth() + 1;
				console.log(month);
				if (month < 10) {
					month = '0' + month;
				}
				console.log(year + "/" + month);
				var defaultMonth = year + month;
				
				searchDateStart = dateFormating(searchDateStart);
				if (searchDateStart) {
					searchDateStart = searchDateStart.toISOString();
				}

				searchDateEnd = dateFormating(searchDateEnd);
				if (searchDateEnd) {
					searchDateEnd = searchDateEnd.toISOString();
				}

				if (searchSelectValue == 0) {
					searchSelectText = "";
				}

				if (accountSelectValue == 0) {
					accountSelectText = "";
				}

				if (searchInputValue == null || searchInputValue == "") {
					searchInputValue = "";
				}

				aoData.push({
					'name' : 'accountSelect',
					'value' : accountSelectText
				});

				aoData.push({
					'name' : 'cSearchFilter',
					'value' : searchSelectText
				});
				aoData.push({
					'name' : 'cSearchContent',
					'value' : searchInputValue
				});
				aoData.push({
					'name' : 'cSearchDate',
					'value' : defaultMonth
				});
				aoData.push({
					'name' : 'cSearchDateStart',
					'value' : searchDateEnd
				});
				aoData.push({
					'name' : 'cSearchDateEnd',
					'value' : searchDateEnd
				});

			}

		});




//message list serach click
$('#statistics-search-btn').click(function() {

	console.log('target click function..');
	var formCheck = checkSearchStatistics();

	if (formCheck) {
		statisticsTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}

});

//reservation list search click
$('#statistics-reservation-search-btn').click(function() {

	console.log('target click function..');
	var formCheck = checkReservationSearch();

	if (formCheck) {
		statisticsReservationTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}

});


$("#statistics-account-select").change(function() {

	var accountSelectValue = $('#statistics-account-select').val();
	$('#statistics-search-date-start-input').val("");
	$('#statistics-search-date-end-input').val("");
	$('#statistics-search-input').val("");
	$("#statistics-search-select option:eq(0)").attr("selected", "selected");

	if (accountSelectValue === 0) {

	} else {
		statisticsTable.fnFilter();
	}

});

$("#statistics-reservation-account-select").change(function() {

	var accountSelectValue = $('#statistics-reservation-account-select').val();
	$('#statistics-reservation-search-date-start-input').val("");
	$('#statistics-reservation-search-date-end-input').val("");
	$('#statistics-reservation-search-input').val("");
	$("#statistics-reservation-search-select option:eq(0)").attr("selected", "selected");

	if (accountSelectValue === 0) {

	} else {
		statisticsReservationTable.fnFilter();
	}

});



//messageList CheckForm
function checkSearchStatistics() {

	var selectOptionValue = $('#statistics-search-select').val();
	var inputSearchValue = $('#statistics-search-input').val();
	var searchDateStart = $('#statistics-search-date-start-input').val();
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	var searchDateEnd = $('#statistics-search-date-end-input').val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		console.log("dsearchDateEnd.....");
		searchDateEnd = "";
	}

	console.log('selectOptjionValue:' + selectOptionValue);

	if (selectOptionValue == 0) {
		alert('검색할 항목을 선택해 주세요');
		return false;
	} else if (inputSearchValue == null || inputSearchValue == "") {
		alert('검색할 내용을 입력해 주세요');
		$('#statistics-search-input').focus();
		return false;
	} else if (searchDateStart != null && searchDateStart != "") {
		console.log(searchDateStart);
		if (searchDateEnd == null || searchDateEnd == "") {
			alert('검색 종료일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}

		}

	} else if (searchDateEnd != null && searchDateEnd != "") {

		if (searchDateStart == null || searchDateStart == "") {
			alert('검색 시작일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}
		}
	} else {
		return true;
	}

}


//reservationList Check Form
function checkReservationSearch() {

	var selectOptionValue = $('#statistics-reservation-search-select').val();
	var inputSearchValue = $('#statistics-reservation-search-input').val();
	var searchDateStart = $('#statistics-reservation-search-date-start-input').val();
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	var searchDateEnd = $('#statistics-reservation-search-date-end-input').val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		console.log("dsearchDateEnd.....");
		searchDateEnd = "";
	}

	console.log('selectOptjionValue:' + selectOptionValue);

	if (selectOptionValue == 0) {
		alert('검색할 항목을 선택해 주세요');
		return false;
	} else if (inputSearchValue == null || inputSearchValue == "") {		
		alert('검색할 내용을 입력해 주세요');
		$('#statistics-reservation-search-input').focus();
		return false;
	} else if (searchDateStart != null && searchDateStart != "") {
		console.log(searchDateStart);
		if (searchDateEnd == null || searchDateEnd == "") {
			alert('검색 종료일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}

		}

	} else if (searchDateEnd != null && searchDateEnd != "") {

		if (searchDateStart == null || searchDateStart == "") {
			alert('검색 시작일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}
		}
	} else {
		return true;
	}

}

