var monthToken = sessionStorage.getItem("token");
var monthRole = sessionStorage.getItem("role");

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

		var dataResult = data.result.data;
		console.log(data);
		if (dataResult) {
			console.log('/v1/pms/adm/' + monthRole + '/users');
			console.log(dataResult);
			if (!data.result.errors) {

				for ( var i in data.result.data) {
					var successData = dataResult[i];
					console.log(successData.role);
					if (successData.role == "sys") {

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

				alert(data.result.errors[0]);
			}
		} else {

		}

	},
	error : function(data, textStatus, request) {

	}
});

function monthSvcSearch() {

	if (monthFormCheck()) {

		$
				.ajax({
					url : '/v1/pms/adm/sys/users',
					type : 'GET',
					contentType : "application/json",
					headers : {
						'X-Application-Token' : userToken
					},
					dataType : 'json',

					async : false,
					success : function(data) {
						var dataResult = data.result.data;
						console.log(data);

						if (dataResult) {

							console.log(dataResult);
							console.log('/v1/pms/adm/sys/users(GET)');
							if (!data.result.errors) {
								var monthtableData="";
								for ( var i in data.result.data) {
									var successData = data.result.data[i];
									console.log(successData);
									if (successData.role == "svc") {
										successData.role = "서비스";
									} else if (successData.role == "inf") {
										successData.role = "Interface Open";
									} else if (successData.role == "sys") {
										successData.role = "관리자";
									} else if (successData.role == "svcadm") {
										successData.role = "서비스 어드민";
									}

									if (successData.msgCntLimit == "-1") {
										successData.msgCntLimit = "제한없음";
									}
									monthtableData
											.push({
												"userId" : successData.userId,
												"Name" : successData.userName,
												"IPFilter" : successData.ipFilters,
												"role" : successData.role,
												"msgCnt" : successData.msgCntLimit,
												"callbackCntLimit" : successData.callbackCntLimit,
												"callbackMethod" : successData.callbackMethod,
												"callbackUrl" : successData.callbackUrl,
												"defaultExpiry" : successData.defaultExpiry,
												"defaultQos" : successData.defaultQos,
												"msgSizeLimit" : successData.msgSizeLimit
											});

								}

								$('#dataTables-month-svc').dataTable({
									aaData : monthtableData,
									'bSort' : false,
									bJQueryUI : true,
									bDestroy : true,
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
										mData : 'userId'
									}, {
										mData : 'Name'
									}, {
										mData : 'IPFilter'
									}, {
										mData : 'role'
									} ]
								});
								$('#month-svc-msgcnt-panel-head').show();
								$('#month-svc-msgcnt-panel-body').show();

							} else {

								alert(data.result.errors[0]);
							}
						} else {

							alert('계정 목록을 가지고오는데 실패하였습니다.');
						}

					},
					error : function(data, textStatus, request) {

						alert('계정 목록을 가지고오는데 실패하였습니다.');
					}
				});
		
	////////////////////////////////////////
		$
				.ajax({
					url : '/v1/pms/adm/sys/users',
					type : 'GET',
					contentType : "application/json",
					headers : {
						'X-Application-Token' : userToken
					},
					dataType : 'json',

					async : false,
					success : function(data) {
						var dataResult = data.result.data;
						console.log(data);

						if (dataResult) {

							console.log(dataResult);
							console.log('/v1/pms/adm/sys/users(GET)');
							if (!data.result.errors) {
								var monthAckTableData="";
								for ( var i in data.result.data) {
									var successData = data.result.data[i];
									console.log(successData);
									if (successData.role == "svc") {
										successData.role = "서비스";
									} else if (successData.role == "inf") {
										successData.role = "Interface Open";
									} else if (successData.role == "sys") {
										successData.role = "관리자";
									} else if (successData.role == "svcadm") {
										successData.role = "서비스 어드민";
									}

									if (successData.msgCntLimit == "-1") {
										successData.msgCntLimit = "제한없음";
									}
									monthAckTableData
											.push({
												"userId" : successData.userId,
												"Name" : successData.userName,
												"IPFilter" : successData.ipFilters,
												"role" : successData.role,
												"msgCnt" : successData.msgCntLimit,
												"callbackCntLimit" : successData.callbackCntLimit,
												"callbackMethod" : successData.callbackMethod,
												"callbackUrl" : successData.callbackUrl,
												"defaultExpiry" : successData.defaultExpiry,
												"defaultQos" : successData.defaultQos,
												"msgSizeLimit" : successData.msgSizeLimit
											});

								}

								$('#dataTables-month-sys-ack').dataTable({
									aaData : monthAckTableData,
									'bSort' : false,
									bJQueryUI : true,
									bDestroy : true,
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
										mData : 'userId'
									}, {
										mData : 'Name'
									}, {
										mData : 'IPFilter'
									}, {
										mData : 'role'
									} ]
								});
								$('#month-svc-ack-panel-head').show();
								$('#month-svc-ack-panel-body').show();

							} else {

								alert(data.result.errors[0]);
							}
						} else {

							alert('계정 목록을 가지고오는데 실패하였습니다.');
						}

					},
					error : function(data, textStatus, request) {

						alert('계정 목록을 가지고오는데 실패하였습니다.');
					}
				});

	}

}

function monthFormCheck() {

	
	var inputMonthValue = $('#month-svc-date-input').val();

	if (inputMonthValue == null | inputMonthValue == "") {
		alert('검색할 기간 입력해 주세요');
		return false;
	}

	return true;

}