var monthSvcToken = sessionStorage.getItem("token");
var monthSvcRole = sessionStorage.getItem("role");

function monthSvcSearch() {

	if (monthSvcFormCheck()) {
		var input_month_value = $('#month-svc-date-input').val();
		input_month_value = input_month_value.replace("/", "");

		// 선택 일반테이블
		$.ajax({
			url : '/v1/pms/adm/svc/messages/summary/' + input_month_value,
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
							bDestroy : true,
							"bPaginate" : false,
							"bInfo" : false,
							"bLengthChange" : false,
							"dom" : 'T<"clear">lrtip',
							"tableTools" : {
								"sSwfPath" : "swf/csvxlspdf.swf",
								"aButtons" : [ {
									"sExtends" : "xls",
									"sButtonText" : "excel",
									"sFileName" : "*.xls"
								}, "copy", "pdf" ]
							},
							aoColumns : [ {
								mData : 'totalMsgCnt'
							}, {
								mData : 'msgCnt'
							},  {
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
							"bInfo" : false,
							"bLengthChange" : false,
							"dom" : 'T<"clear">lrtip',
							"tableTools" : {
								"sSwfPath" : "swf/csvxlspdf.swf",
								"aButtons" : [ {
									"sExtends" : "xls",
									"sButtonText" : "excel",
									"sFileName" : "*.xls"
								}, "copy", "pdf" ]
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

function monthSvcFormCheck() {

	var inputMonthValue = $('#month-svc-date-input').val();

	inputMonthValue = compactTrim(inputMonthValue);

	if (inputMonthValue == null | inputMonthValue == "") {
		alert('검색할 기간 입력해 주세요');
		return false;
	}

	return true;

}