var monthSvcToken = sessionStorage.getItem("token");
var monthSvcRole = sessionStorage.getItem("role");

function monthSvcSearch() {

	if (monthSvcFormCheck()) {
		var input_month_value = $('#month-svc-date-input').val();
		input_month_value = input_month_value.replace("/", "");

		var searchDateStart = $('#monthsvc-search-date-start-input').val();
		var searchDateEnd = $('#monthsvc-search-date-end-input').val();
		var ajaxUrl = "";
		searchDateStart = dateFormating(searchDateStart);
		searchDateEnd = dateFormating(searchDateEnd);
		if (searchDateStart) {
			searchDateStart = searchDateStart.toISOString();
			searchDateEnd = searchDateEnd.toISOString();
			ajaxUrl = '/v1/pms/adm/' + monthSvcRole + '/messages/summary/'
					+ input_month_value + "?cSearchDateStart="
					+ searchDateStart + "&cSearchDateEnd=" + searchDateEnd;
		} else {
			console.log('상세검색데이터 없음');
			ajaxUrl = '/v1/pms/adm/' + monthSvcRole + '/messages/summary/'
					+ input_month_value;
		}

		//
		// 선택 일반테이블
		$.ajax({
			url : ajaxUrl,
			type : 'GET',
			contentType : "application/json",
			headers : {
				'X-Application-Token' : monthSvcToken
			},
			dataType : 'json',

			async : false,
			success : function(data) {
				var dataResult = data.result.data;
				console.log(data);
				if (dataResult) {
					if (!data.result.errors) {
						var monthTableData = new Array();
						var monthTableDataRes = new Array();
						var statusD99Cnt = 0;
						var statusD2Cnt = 0;
						var statusD1Cnt = 0;
						var statusP0Cnt = 0;
						var statusP1Cnt = 0;
						var statusP2Cnt = 0;
						var totalMsgCnt = 0;
						var appAck = 0;
						var pmaAck = 0;
						var statusRD99Cnt = 0;
						var statusRD2Cnt = 0;
						var statusRD1Cnt = 0;
						var statusRP0Cnt = 0;
						var statusRP1Cnt = 0;
						var statusRP2Cnt = 0;
						var totalMsgCntR = 0;
						var appAckR = 0;
						var pmaAckR = 0;
						for ( var i in data.result.data) {
							var successData = data.result.data[i];
							console.log(successData);
							if (successData.isReservation == false) {
								switch (dataResult[i].status) {
								case -99:
									// dataResult[i].status = "발송오류";
									statusD99Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case -2:
									// dataResult[i].status = "수신자없음";
									statusD2Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case -1:
									// dataResult[i].status = "허용갯수초과";
									statusD1Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case 0:
									// dataResult[i].status = "발송중";
									statusP0Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";
									console.log('발송됨');
									statusP1Cnt = successData.msgCnt;
									appAck = successData.appAckCnt;
									pmaAck = successData.pmaAckCnt;
									totalMsgCnt += successData.msgCnt;
									console.log(statusP1Cnt);
									break;
								case 2:
									// dataResult[i].status = "예약취소됨";
									statusP2Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;

								}

							} else {
								switch (dataResult[i].status) {
								case -99:
									// dataResult[i].status = "발송오류";
									statusRD99Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case -2:
									// dataResult[i].status = "수신자없음";
									statusRD2Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case -1:
									// dataResult[i].status = "허용갯수초과";
									statusRD1Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case 0:
									// dataResult[i].status = "발송중";
									statusRP0Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";
									console.log('발송됨');
									statusRP1Cnt = successData.msgCnt;
									appAckR = successData.appAckCnt;
									pmaAckR = successData.pmaAckCnt;
									totalMsgCntR += successData.msgCnt;
									console.log(statusP1Cnt);
									break;
								case 2:
									// dataResult[i].status = "예약취소됨";
									statusRP2Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;

								}

							}

						}

						monthTableData.push({
							"totalMsgCnt" : totalMsgCnt,
							"msgCnt" : statusP1Cnt,

							"sending" : statusP0Cnt,
							"limitOver" : statusD1Cnt,
							"userNotFound" : statusD2Cnt,
							"serverError" : statusD99Cnt,
							"pmaAck" : pmaAck,
							"appAck" : appAck
						});

						monthTableDataRes.push({
							"totalMsgCnt" : totalMsgCntR,
							"msgCnt" : statusRP1Cnt,
							"resCancel" : statusRP2Cnt,
							"sending" : statusRP0Cnt,
							"limitOver" : statusRD1Cnt,
							"userNotFound" : statusRD2Cnt,
							"serverError" : statusRD99Cnt,
							"pmaAck" : pmaAckR,
							"appAck" : appAckR
						});

						$('#dataTables-month-svc').dataTable({
							aaData : monthTableData,
							'bSort' : false,
							bJQueryUI : true,
							"pageLength" : 25,
							bDestroy : true,
							"bPaginate" : false,
							"bInfo" : false,
							"bLengthChange" : false,
							"dom" : 'T<"clear">lrtip',
							"tableTools" : {
								"sSwfPath" : "swf/csvxlspdf.swf",
								"aButtons" : [ {
									"sExtends" : "xls",
									"sButtonText" : "csv",
									"sFileName" : "*.csv"
								}, "copy" ]
							},
							aoColumns : [ {
								mData : 'totalMsgCnt'
							}, {
								mData : 'msgCnt'
							}, {
								mData : 'sending'
							}, {
								mData : 'limitOver'
							}, {
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});
						$('#dataTables-month-svc-res').dataTable({
							aaData : monthTableDataRes,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"bPaginate" : false,
							"pageLength": 25,
							"bInfo" : false,
							"bLengthChange" : false,
							"dom" : 'T<"clear">lrtip',
							"tableTools" : {
								"sSwfPath" : "swf/csvxlspdf.swf",
								"aButtons" : [ {
									"sExtends" : "xls",
									"sButtonText" : "csv",
									"sFileName" : "*.csv"
								}, "copy" ]
							},
							aoColumns : [ {
								mData : 'totalMsgCnt'
							}, {
								mData : 'msgCnt'
							}, {
								mData : 'resCancel'
							}, {
								mData : 'sending'
							}, {
								mData : 'limitOver'
							}, {
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});
						console.log('생성됨');
						$('#month_svc_msgsend_div').text(totalMsgCnt);
						$('#month_svc_msgres_div').text(totalMsgCntR);
						$('#month-svc-msgcnt-panel-head').show();
						$('#month-svc-msgcnt-panel-body').show();
						$('#month-svc-res-panel-body').show();
						$('#month-svc-res-panel-head').show();
					} else {

						alert(data.result.errors[0]);
					}
				} else {

					alert('통계 목록을 가지고오는데 실패하였습니다.');
				}

			},
			error : function(data, textStatus, request) {

				alert('통계 목록을 가지고오는데 실패하였습니다.');
			}
		});
	}

}

$("#month-svc-date-div").on("dp.change", function(e) {
	setTimeout(changeDateInputMonthSv, 500);

});

function changeDateInputMonthSv() {
	var messagelist_Picker = $("#month-svc-date-input").val();
	var messageList_Result = [];
	messageList_Result = messagelist_Picker.split("/");
	$('#monthsvc-search-date-start-div').datetimepicker()
			.data("DateTimePicker").setDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#monthsvc-search-date-end-div').datetimepicker().data("DateTimePicker")
			.setDate(chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#monthsvc-search-date-start-div').datetimepicker()
			.data("DateTimePicker").setMinDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#monthsvc-search-date-start-div').datetimepicker()
			.data("DateTimePicker").setMaxDate(
					chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#monthsvc-search-date-end-div').datetimepicker().data("DateTimePicker")
			.setMinDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#monthsvc-search-date-end-div').datetimepicker().data("DateTimePicker")
			.setMaxDate(
					chageDateL(messageList_Result[0], messageList_Result[1]));

}

function monthSvcFormCheck() {

	var inputMonthValue = $('#month-svc-date-input').val();
	var searchDateStart = $('#monthsvc-search-date-start-input').val();
	var searchDateEnd = $('#monthsvc-search-date-end-input').val();
	inputMonthValue = compactTrim(inputMonthValue);
	console.log(inputMonthValue);

	if (inputMonthValue == null | inputMonthValue == "") {
		alert('검색할 기간 입력해 주세요');
		return false;
	}
	if (inputMonthValue.substring(5, 6) == 0) {
		inputMonthValue = inputMonthValue.substring(6);
		inputMonthValue = inputMonthValue - 1;
		console.log('기본달');
		console.log(inputMonthValue - 1);
	} else {
		inputMonthValue = inputMonthValue.substring(5);
		inputMonthValue = inputMonthValue - 1;
	}
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		console.log("dsearchDateEnd.....");
		searchDateEnd = "";
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
					&& inputMonthValue === searchDateEnd.getMonth()
					&& inputMonthValue === searchDateStart.getMonth()) {
				console.log(searchDateStart.getMonth());
				console.log('같은월');
				return true;
			} else if (searchDateStart.getMonth() !== searchDateEnd.getMonth()
					|| inputMonthValue !== searchDateEnd.getMonth()
					|| inputMonthValue !== searchDateStart.getMonth()) {
				console.log('다른월');
				alert('같은 달에서만 검색이 가능합니다');
				return false;
			} else {
				return true;
			}

		}

	}

	return true;

}