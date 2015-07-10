//getToken
var monthToken = sessionStorage.getItem("token");
// getRole
var monthRole = sessionStorage.getItem("role");
// getAccountInfo
$.ajax({
	url : '/v1/pms/adm/' + monthRole + '/users',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : monthToken
	},
	dataType : 'json',
	async : false,

	success : function(data) {

		if (!data.result.errors) {

			var dataResult = data.result.data;

			for ( var i in data.result.data) {
				var successData = dataResult[i];

				if (successData.role == "sys") {
					$("#month-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>전체</option>");

				} else if (successData.role == "svc") {
					$("#month-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>"
									+ successData.userId + "</option>");

				} else if (successData.role == "svcadm") {
					$("#month-account-select").append(
							"<option value='" + (i * 1 + 1) + "'>"
									+ successData.userId + "</option>");

				}

			}

		} else {

		}

	},
	error : function(data, textStatus, request) {

	}
});

// getStatistics(System Admin)
function monthSearch() {
	if (monthFormCheck()) {
		var input_month_value = $('#month-sys-date-input').val();
		input_month_value = input_month_value.replace("/", "");
		var accountSelectText = $('#month-account-select option:selected')
				.text();
		var searchDateStart = $('#monthsys-search-date-start-input').val();
		var searchDateEnd = $('#monthsys-search-date-end-input').val();
		var ajaxUrl = "";

		if (searchDateStart != "") {

			searchDateStart = dateFormatingStart(searchDateStart);
			searchDateEnd = dateFormatingEnd(searchDateEnd);
			searchDateStart = searchDateStart.toISOString();
			searchDateEnd = searchDateEnd.toISOString();
			ajaxUrl = '/v1/pms/adm/sys/messages/summary/' + input_month_value
					+ "?cSearchDateStart=" + searchDateStart
					+ "&cSearchDateEnd=" + searchDateEnd;
		} else {

			ajaxUrl = '/v1/pms/adm/sys/messages/summary/' + input_month_value;
		}

		if (accountSelectText == "전체") {

			$.ajax({
				url : ajaxUrl,
				type : 'GET',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : monthToken
				},
				dataType : 'json',

				async : false,
				success : function(data) {

					if (!data.result.errors) {
						var dataResult = data.result.data;

						var monthTableData = new Array();
						var monthTableDataRes = new Array();

						for ( var i in data.result.data) {
							var successData = data.result.data[i];
							if (successData.isReservation == false) {
								var statusD99Cnt = 0;
								var statusD2Cnt = 0;
								var statusD1Cnt = 0;
								var statusP0Cnt = 0;
								var statusP1Cnt = 0;
								var statusP2Cnt = 0;
								var totalMsgCnt = 0;
								var userId = "";
								var appAck = 0;
								var pmaAck = 0;
								userId = successData.userId;
								switch (dataResult[i].status) {
								case -99:
									// dataResult[i].status =
									// "발송오류";
									statusD99Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case -2:
									// dataResult[i].status =
									// "수신자없음";
									statusD2Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
						/*		case -1:
									// dataResult[i].status =
									// "허용갯수초과";
									statusD1Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;*/
								case 0:
									// dataResult[i].status = "발송중";
									statusP0Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";

									statusP1Cnt = successData.msgCnt;
									appAck = successData.appAckCnt;
									pmaAck = successData.pmaAckCnt;
									totalMsgCnt += successData.msgCnt;

									break;
								case 2:
									// dataResult[i].status =
									// "예약취소됨";
									statusP2Cnt = successData.msgCnt;
									totalMsgCnt = successData.msgCnt;
									break;

								}

								monthTableData.push({
									"userId" : userId,
									"totalMsgCnt" : totalMsgCnt,
									"msgCnt" : statusP1Cnt,
									"sending" : statusP0Cnt,
									/*"limitOver" : statusD1Cnt,*/
									"userNotFound" : statusD2Cnt,
									"serverError" : statusD99Cnt,
									"pmaAck" : pmaAck,
									"appAck" : appAck
								});

							} else {
								var statusD99Cnt = 0;
								var statusD2Cnt = 0;
								var statusD1Cnt = 0;
								var statusP0Cnt = 0;
								var statusP1Cnt = 0;
								var statusP2Cnt = 0;
								var totalMsgCnt = 0;
								var userId = "";
								var appAck = 0;
								var pmaAck = 0;
								userId = successData.userId;
								switch (dataResult[i].status) {
								case -99:
									// dataResult[i].status =
									// "발송오류";
									statusD99Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case -2:
									// dataResult[i].status =
									// "수신자없음";
									statusD2Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
					/*			case -1:
									// dataResult[i].status =
									// "허용갯수초과";
									statusD1Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;*/
								case 0:
									// dataResult[i].status = "발송중";
									statusP0Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";

									statusP1Cnt = successData.msgCnt;
									appAck = successData.appAckCnt;
									pmaAck = successData.pmaAckCnt;
									totalMsgCnt += successData.msgCnt;

									break;
								case 2:
									// dataResult[i].status =
									// "예약취소됨";
									statusP2Cnt = successData.msgCnt;
									totalMsgCnt = successData.msgCnt;
									break;

								}

								monthTableDataRes.push({
									"userId" : userId,
									"totalMsgCnt" : totalMsgCnt,
									"msgCnt" : statusP1Cnt,
									"resCancel" : statusP2Cnt,
									"sending" : statusP0Cnt,
								/*	"limitOver" : statusD1Cnt,*/
									"userNotFound" : statusD2Cnt,
									"serverError" : statusD99Cnt,
									"pmaAck" : pmaAck,
									"appAck" : appAck
								});

							}

						}

						$('#dataTables-month-all-sys').dataTable({
							aaData : monthTableData,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"pageLength" : 25,
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
								mData : 'userId'
							}, {
								mData : 'msgCnt'
							}, {
								mData : 'sending'
							}, 
					/*		{
								mData : 'limitOver'
							},*/
							{
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});

						$('#dataTables-month-sys-res-all').dataTable({
							aaData : monthTableDataRes,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"pageLength" : 25,
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
								mData : 'userId'
							}, {
								mData : 'msgCnt'
							}, {
								mData : 'resCancel'
							}, {
								mData : 'sending'
							},
						/*	{
								mData : 'limitOver'
							},*/
							{
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});

						$('#month-msgcnt-panel-head').show();
						$('#month-msgcnt-panel-body').show();
						$('#month-all-msgcnt-panel-body').show();
						$('#month-res-all-panel-body').show();

					} else {

						alert('통계 목록을 가지고오는데 실패하였습니다.');
					}

				},
				error : function(data, textStatus, request) {

					alert('통계 목록을 가지고오는데 실패하였습니다.');
				}
			});
			// 전체 합계 테이블 일반 예약
			$.ajax({
				url : ajaxUrl,
				type : 'GET',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : monthToken
				},
				dataType : 'json',

				async : false,
				success : function(data) {

					if (!data.result.errors) {
						var dataResult = data.result.data;

						var monthTableData = new Array();
						var monthResTableData = new Array();
						var statusD99Cnt = 0;
						var statusD2Cnt = 0;
						var statusD1Cnt = 0;
						var statusP0Cnt = 0;
						var statusP1Cnt = 0;
						var statusP2Cnt = 0;
						var totalMsgCnt = 0;
						var userId = "";
						var appAck = 0;
						var pmaAck = 0;
						var statusRD99Cnt = 0;
						var statusRD2Cnt = 0;
						var statusRD1Cnt = 0;
						var statusRP0Cnt = 0;
						var statusRP1Cnt = 0;
						var statusRP2Cnt = 0;
						var totalMsgCntR = 0;
						var userIdR = "";
						var appAckR = 0;
						var pmaAckR = 0;
						for ( var i in data.result.data) {
							var successData = data.result.data[i];

							if (successData.isReservation == false) {

								userId = successData.userId;

								switch (dataResult[i].status) {
								case -99:
									// dataResult[i].status = "발송오류";
									statusD99Cnt += successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case -2:
									// dataResult[i].status = "수신자없음";
									statusD2Cnt += successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
				/*				case -1:
									// dataResult[i].status = "허용갯수초과";
									statusD1Cnt += successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;*/
								case 0:
									// dataResult[i].status = "발송중";
									statusP0Cnt += successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";

									statusP1Cnt += successData.msgCnt;
									appAck += successData.appAckCnt;
									pmaAck += successData.pmaAckCnt;
									totalMsgCnt += successData.msgCnt;

									break;
								case 2:
									// dataResult[i].status = "예약취소됨";
									statusP2Cnt += successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;

								}

							} else {

								userIdR = successData.userId;

								switch (dataResult[i].status) {
								case -99:
									// dataResult[i].status = "발송오류";
									statusRD99Cnt += successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case -2:
									// dataResult[i].status = "수신자없음";
									statusRD2Cnt += successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
						/*		case -1:
									// dataResult[i].status = "허용갯수초과";
									statusRD1Cnt += successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;*/
								case 0:
									// dataResult[i].status = "발송중";
									statusRP0Cnt += successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";

									statusRP1Cnt += successData.msgCnt;
									appAckR += successData.appAckCnt;
									pmaAckR += successData.pmaAckCnt;
									totalMsgCntR += successData.msgCnt;

									break;
								case 2:
									// dataResult[i].status = "예약취소됨";
									statusRP2Cnt += successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;

								}

							}

						}

						monthTableData.push({
							"totalMsgCnt" : totalMsgCnt,
							"msgCnt" : statusP1Cnt,
							"sending" : statusP0Cnt,
						/*	"limitOver" : statusD1Cnt,*/
							"userNotFound" : statusD2Cnt,
							"serverError" : statusD99Cnt,
							"pmaAck" : pmaAck,
							"appAck" : appAck
						});

						monthResTableData.push({
							"totalMsgCnt" : totalMsgCntR,
							"msgCnt" : statusRP1Cnt,
							"resCancel" : statusRP2Cnt,
							"sending" : statusRP0Cnt,
						/*	"limitOver" : statusRD1Cnt,*/
							"userNotFound" : statusRD2Cnt,
							"serverError" : statusRD99Cnt,
							"pmaAck" : pmaAckR,
							"appAck" : appAckR
						});

						$('#dataTables-month-sys').dataTable({
							aaData : monthTableData,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"bInfo" : false,
							"pageLength" : 25,
							"bPaginate" : false,
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
							}, 
					/*		{
								mData : 'limitOver'
							},*/
							{
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});

						$('#dataTables-month-sys-res').dataTable({
							aaData : monthResTableData,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"bInfo" : false,
							"pageLength" : 25,
							"bPaginate" : false,
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
							},
						/*	{
								mData : 'limitOver'
							},*/
							{
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});

						$('#month_msgres_div').text(totalMsgCntR);
						$('#month_msgsend_div').text(totalMsgCnt);
						$('#month-msgcnt-panel-head').show();
						$('#month-msgcnt-panel-body').show();
						$('#month-res-panel-body').show();
						$('#month-res-panel-head').show();
					} else {

						alert('통계 목록을 가지고오는데 실패하였습니다.');
					}

				},
				error : function(data, textStatus, request) {

					alert('통계 목록을 가지고오는데 실패하였습니다.');
				}
			});
		} else {

			ajaxUrl = '/v1/pms/adm/sys/messages/summary/' + input_month_value
					+ '/' + accountSelectText + "?cSearchDateStart="
					+ searchDateStart + "&cSearchDateEnd=" + searchDateEnd;

			$.ajax({
				url : ajaxUrl,
				type : 'GET',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : monthToken
				},
				dataType : 'json',

				async : false,
				success : function(data) {

					if (!data.result.errors) {
						var dataResult = data.result.data;

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
			/*					case -1:
									// dataResult[i].status = "허용갯수초과";
									statusD1Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;*/
								case 0:
									// dataResult[i].status = "발송중";
									statusP0Cnt = successData.msgCnt;
									totalMsgCnt += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";

									statusP1Cnt = successData.msgCnt;
									appAck = successData.appAckCnt;
									pmaAck = successData.pmaAckCnt;
									totalMsgCnt += successData.msgCnt;

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
						/*		case -1:
									// dataResult[i].status = "허용갯수초과";
									statusRD1Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;*/
								case 0:
									// dataResult[i].status = "발송중";
									statusRP0Cnt = successData.msgCnt;
									totalMsgCntR += successData.msgCnt;
									break;
								case 1:
									// dataResult[i].status = "발송됨";

									statusRP1Cnt = successData.msgCnt;
									appAckR = successData.appAckCnt;
									pmaAckR = successData.pmaAckCnt;
									totalMsgCntR += successData.msgCnt;

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
					/*		"limitOver" : statusD1Cnt,*/
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
					/*		"limitOver" : statusRD1Cnt,*/
							"userNotFound" : statusRD2Cnt,
							"serverError" : statusRD99Cnt,
							"pmaAck" : pmaAckR,
							"appAck" : appAckR
						});

						$('#dataTables-month-sys').dataTable({
							aaData : monthTableData,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"pageLength" : 25,
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
							},
						/*	{
								mData : 'limitOver'
							},*/
							{
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});
						$('#dataTables-month-sys-res').dataTable({
							aaData : monthTableDataRes,
							'bSort' : false,
							bJQueryUI : true,
							bDestroy : true,
							"bPaginate" : false,
							"pageLength" : 25,
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
							}, 
						/*	{
								mData : 'limitOver'
							}, */
							{
								mData : 'userNotFound'
							}, {
								mData : 'serverError'
							}, {
								mData : 'pmaAck'
							}, {
								mData : 'appAck'
							} ]
						});

						$('#month_msgsend_div').text(totalMsgCnt);
						$('#month_msgres_div').text(totalMsgCntR);
						$('#month-all-msgcnt-panel-body').hide();
						$('#month-res-all-panel-body').hide();
						$('#month-msgcnt-panel-head').show();
						$('#month-msgcnt-panel-body').show();
						$('#month-res-panel-body').show();
						$('#month-res-panel-head').show();

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

}

// dp.change check
$("#month-sys-date-div").on("dp.change", function(e) {
	setTimeout(changeDateInputMonthSv, 500);

});

// changeDate
function changeDateInputMonthSv() {
	var messagelist_Picker = $("#month-sys-date-input").val();
	var messageList_Result = [];
	messageList_Result = messagelist_Picker.split("/");
	$('#monthsys-search-date-start-div').datetimepicker()
			.data("DateTimePicker").setDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#monthsys-search-date-end-div').datetimepicker().data("DateTimePicker")
			.setDate(chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#monthsys-search-date-start-div').datetimepicker()
			.data("DateTimePicker").setMinDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#monthsys-search-date-start-div').datetimepicker()
			.data("DateTimePicker").setMaxDate(
					chageDateL(messageList_Result[0], messageList_Result[1]));
	$('#monthsys-search-date-end-div').datetimepicker().data("DateTimePicker")
			.setMinDate(
					chageDateF(messageList_Result[0], messageList_Result[1]));
	$('#monthsys-search-date-end-div').datetimepicker().data("DateTimePicker")
			.setMaxDate(
					chageDateL(messageList_Result[0], messageList_Result[1]));

}

// formCheck
function monthFormCheck() {
	var selectOptionValue = $('#month-account-select').val();
	var inputMonthValue = $('#month-sys-date-input').val();
	var searchDateStart = $('#monthsys-search-date-start-input').val();
	var searchDateEnd = $('#monthsys-search-date-end-input').val();
	inputMonthValue = compactTrim(inputMonthValue);

	if (selectOptionValue != 0) {

		if (inputMonthValue == null || inputMonthValue == "") {
			alert('검색할 기간 입력해 주세요');
			return false;

		}

	} else if (inputMonthValue != null && inputMonthValue != "") {

		if (selectOptionValue == 0) {
			alert('검색 계정 선택해주세요');

			return false;
		}

	}

	if (selectOptionValue == 0) {
		alert('검색 계정 선택해주세요');
		return false;
	}
	if (inputMonthValue == null | inputMonthValue == "") {
		alert('검색할 기간 입력해 주세요');
		return false;
	}
	if (inputMonthValue.substring(5, 6) == 0) {
		inputMonthValue = inputMonthValue.substring(6);
		inputMonthValue = inputMonthValue - 1;

	} else {
		inputMonthValue = inputMonthValue.substring(5);
		inputMonthValue = inputMonthValue - 1;
	}
	searchDateStart = dateFormatingStart(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {

		searchDateStart = "";
	}

	searchDateEnd = dateFormatingEnd(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {

		searchDateEnd = "";
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
					&& inputMonthValue === searchDateEnd.getMonth()
					&& inputMonthValue === searchDateStart.getMonth()) {

				return true;
			} else if (searchDateStart.getMonth() !== searchDateEnd.getMonth()
					|| inputMonthValue !== searchDateEnd.getMonth()
					|| inputMonthValue !== searchDateStart.getMonth()) {

				alert('같은 달에서만 검색이 가능합니다');
				return false;
			} else {
				return true;
			}

		}

	}

	return true;

}