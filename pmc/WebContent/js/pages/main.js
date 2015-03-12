//ready Function
$(document).ready(
		function() {

			$('.navbar-static-side').hide();
			var localTokenId = sessionStorage.getItem("token");
			sessionStorage.setItem("monitoringStatus", "disable");
			if (localTokenId) {
				var userRole = sessionStorage.getItem("role");
				if (userRole == "sys") {

					$("#page-wrapper").load(
							"pages/userManagerPageWrapper.html", function() {
								sysLogin();
							});
				} else if (userRole == "svc") {
					$("#page-wrapper").load(
							"pages/messageListPageWrapper.html", function() {
								svcLogin();

							});

				} else if (userRole == "svcadm") {
					$("#page-wrapper").load(
							"pages/messageListPageWrapper.html", function() {
								svcAdmLogin();

							});

				}

			} else {

				$("#page-wrapper").load("pages/login.html", function() {
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

		});

// Page wrapperfunction
function wrapperFunction(data) {

	$("#page-wrapper")
			.load(
					"pages/" + data + "PageWrapper.html",
					function() {

						if (data === "userManager") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						if (data === "MessageSendAdm") {

							sessionStorage.setItem("monitoringStatus",
									"disable");
							var nowDate = new Date();
							var today = new Date(nowDate.getFullYear(), nowDate
									.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
							var today_30 = new Date(nowDate.getFullYear(),
									nowDate.getMonth(), nowDate.getDate() + 30,
									0, 0, 0, 0);
							$('#message-send-reservation-div').datetimepicker()
									.data("DateTimePicker").setMinDate(today);

							$('#message-send-reservation-div').datetimepicker()
									.data("DateTimePicker")
									.setMaxDate(today_30);
							$("#message-send-reservationdate-input").prop(
									'disabled', true);
							$("#message-send-contentType-select").prop(
									'disabled', true);
						}

						if (data === "MessageSendUser") {

							sessionStorage.setItem("monitoringStatus",
									"disable");
							var nowDate = new Date();
							var today = new Date(nowDate.getFullYear(), nowDate
									.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
							var today_30 = new Date(nowDate.getFullYear(),
									nowDate.getMonth(), nowDate.getDate() + 30,
									0, 0, 0, 0);
							$('#message-send-user-reservation-div')
									.datetimepicker().data("DateTimePicker")
									.setMinDate(today);

							$('#message-send-user-reservation-div')
									.datetimepicker().data("DateTimePicker")
									.setMaxDate(today_30);
							$("#message-send-user-reservationdate-input").prop(
									'disabled', true);
						}

						if (data === "monitoring") {

							var element = document.createElement("script");
							element.src = "js/pages/monitoring.js";
							document.body.appendChild(element);
							sessionStorage
									.setItem("monitoringStatus", "enable");

						}

						if (data === "messageList") {
							sessionStorage.setItem("monitoringStatus",
									"disable");

							$('#messagelist-search-date-start-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayF(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()

									});

							$('#messagelist-search-date-end-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayL(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()
									});

							$('#messagelist-date-div').datetimepicker({
								viewMode : 'years',
								format : 'YYYY/MM',
								minViewMode : "months",
								pickTime : false
							});
							$('#messagelist-date-input').prop('disabled', true);

						}

						if (data === "reservationList") {
							sessionStorage.setItem("monitoringStatus",
									"disable");

							$('#reservation-search-date-start-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayF(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()

									});

							$('#reservation-search-date-end-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayL(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()
									});

							$('#reservation-date-div').datetimepicker({
								viewMode : 'years',
								format : 'YYYY/MM',
								minViewMode : "months",
								pickTime : false
							});

							$('#reservation-date-input').prop('disabled', true);
						}

						if (data === "userAdd") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}
						if (data === "userManager") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						if (data === "monthSys") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
							$('#month-msgcnt-panel-head').hide();
							$('#month-msgcnt-panel-body').hide();
							$('#month-res-panel-head').hide();
							$('#month-res-panel-body').hide();
							$('#month-all-msgcnt-panel-body').hide();
							$('#month-res-all-panel-body').hide();
							$('#month-sys-date-input').prop('disabled', true);
							$('#monthsys-search-date-start-input').prop(
									'disabled', true);
							$('#monthsys-search-date-end-input').prop(
									'disabled', true);

							$('#monthsys-search-date-start-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayF(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()

									});

							$('#monthsys-search-date-end-div').datetimepicker({
								format : "YYYY/MM/DD hh:mm a",
								defaultDate : getCurrentDayL(),
								minDate : getCurrentDayF(),
								maxDate : getCurrentDayL()
							});

							$('#month-sys-date-div').datetimepicker({
								viewMode : 'years',
								format : 'YYYY/MM',
								minViewMode : "months",
								pickTime : false,
								defaultDate : getCurrentDayF(),
							});
							// month-sys-date-div
						}

						if (data === "monthSvc") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
							$('#month-svc-msgcnt-panel-head').hide();
							$('#month-svc-msgcnt-panel-body').hide();
							$('#month-svc-res-panel-head').hide();
							$('#month-svc-res-panel-body').hide();
							$('#month-svc-date-input').prop('disabled', true);
							$('#monthsvc-search-date-start-input').prop(
									'disabled', true);
							$('#monthsvc-search-date-end-input').prop(
									'disabled', true);
							// ////////////////////////
							$('#monthsvc-search-date-start-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayF(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()

									});

							$('#monthsvc-search-date-end-div').datetimepicker({
								format : "YYYY/MM/DD hh:mm a",
								defaultDate : getCurrentDayL(),
								minDate : getCurrentDayF(),
								maxDate : getCurrentDayL()
							});

							$('#month-svc-date-div').datetimepicker({
								viewMode : 'years',
								format : 'YYYY/MM',
								minViewMode : "months",
								pickTime : false,
								defaultDate : getCurrentDayF()
							});
							// month-sys-date-div
						}

						if (data === "statistics") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
							var nowDate = new Date();
							var today_1 = new Date(nowDate.getFullYear(),
									nowDate.getMonth(), nowDate.getDate() + 1,
									0, 0, 0, 0);

							$('#statistics-search-date-start-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayF(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()
									});

							$('#statistics-search-date-end-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayL(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()
									});

							$('#statistics-reservation-search-date-start-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayF(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()
									});

							$('#statistics-reservation-search-date-end-div')
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										defaultDate : getCurrentDayL(),
										minDate : getCurrentDayF(),
										maxDate : getCurrentDayL()
									});
							$('#statistics-search-date-month-div')
									.datetimepicker({
										viewMode : 'years',
										format : 'YYYY/MM',
										minViewMode : "months",
										pickTime : false,
										defaultDate : getCurrentDayF()
									});
							$('#statistics-reservation-search-date-month-div')
									.datetimepicker({
										viewMode : 'years',
										format : 'YYYY/MM',
										minViewMode : "months",
										pickTime : false,
										defaultDate : getCurrentDayF()
									});

						}

					});
}

// Login
var ladda_object = "";
function loginFunction(atag) {

	ladda_object = Ladda.create(atag);
	var loginId = $('#loginId').val();
	var loginPass = $('#loginPass').val();

	if (loginId == null || loginId == "") {
		alert("아이디 입력해주세요");
		$('#loginId').focus();
		l.stop();
		return false;
	}

	if (loginPass == null || loginPass == "") {
		alert("비밀번호를  입력해주세요");
		$('#loginPass').focus();

		return false;
	}

	var loginInfo = new Object();
	loginInfo.userId = loginId;
	loginInfo.password = loginPass;
	var loginReq = JSON.stringify(loginInfo);

	$.ajax({
		url : '/v1/pms/adm/cmm/auth',
		type : 'POST',
		contentType : "application/json",
		headers : {
			'X-Application-Token' : 'admauth'
		},
		dataType : 'json',
		async : false,
		data : loginReq,
		success : function(data) {

			var dataResult = data.result.data;
			if (dataResult) {
				console.log('/v1/pms/adm/cmm/auth(POST)');
				console.log(dataResult);
				if (!data.result.errors) {
					var role = data.result.data.role;
					var token = data.result.data.token;
					var userId = data.result.data.userId;

					sessionStorage.setItem("role", role);
					sessionStorage.setItem("token", token);
					sessionStorage.setItem("userId", userId);

					var userRole = sessionStorage.getItem("role");
					console.log("userRole:" + userRole);
					if (userRole == "sys") {

						$("#page-wrapper").load(
								"pages/userManagerPageWrapper.html",
								function() {
									sysLogin();
								});
					} else if (userRole == "svc") {
						$("#page-wrapper").load(
								"pages/messageListPageWrapper.html",
								function() {
									svcLogin();
								});

					} else if (userRole == "inf") {

						infLogin();

					} else if (userRole = "svcadm") {
						$("#page-wrapper").load(
								"pages/messageListPageWrapper.html",
								function() {
									svcAdmLogin();

								});

					}

				} else {

					alert(data.result.errors[0]);
				}
			} else {
				console.log(data.result.errors[0]);
				alert('로그인에 실패 하였습니다.');
			}

		},
		error : function(data, textStatus, request) {

			alert('로그인에 실패 하였습니다.');
			console.log(data);
			console.log(textStatus);
		}
	});

}

// User Info
function userInfo() {
	var userID = sessionStorage.getItem("userId");
	alert(userID + "으로 로그인 중입니다.");
}
// Log out
function logoutFunction() {
	if (confirm("로그아웃 하시 겠습니까??") == true) { // 확인
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("role");
		sessionStorage.removeItem("monitoringStatus");
		window.location.reload();
	} else {
		return;
	}

}

// Date ValidateDate Check
function validateDate(input_reservation) {
	// car la pi alba
	var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
	return date_regex.test(input_reservation);
}

// CompactTrim
function compactTrim(value) {
	return value.replace(/(\s*)/g, "");
}
// Sys Login
function sysLogin() {
	$('#ul_userInfo').show();
	$('.navbar-static-side').show();
	$('#sys_monitoring_li').show();
	$('#sys_admin_li').show();
	$('#svc_message_list_li').hide();
	$('#svc_message_reservation_li').hide();
	$('#message_send_li').hide();
	$('#sys_message_list_li').show();
	$('#svcadm_message_send_li_second').hide();
	$('#svc_message_send_li_second').hide();
	$('#svc_message_list_month_li').hide();
	$('#sys_message_list_month_li').show();
	sessionStorage.setItem("monitoringStatus", "disable");
}
// Svc Login
function svcLogin() {
	$('#ul_userInfo').show();
	$('.navbar-static-side').show();
	$('#sys_monitoring_li').hide();
	$('#sys_admin_li').hide();
	$('#svc_message_list_li').show();
	$('#svc_message_reservation_li').show();
	$('#message_send_li').show();
	$('#sys_message_list_li').hide();
	$('#svcadm_message_send_li_second').hide();
	$('#svc_message_list_month_li').show();
	$('#sys_message_list_month_li').hide();
	sessionStorage.setItem("monitoringStatus", "disable");
	$('#messagelist-search-date-start-div').datetimepicker({
		format : "YYYY/MM/DD hh:mm a",
		defaultDate : getCurrentDayF(),
		minDate : getCurrentDayF(),
		maxDate : getCurrentDayL()

	});

	$('#messagelist-search-date-end-div').datetimepicker({
		format : "YYYY/MM/DD hh:mm a",
		defaultDate : getCurrentDayL(),
		minDate : getCurrentDayF(),
		maxDate : getCurrentDayL()
	});

	$('#messagelist-date-div').datetimepicker({
		viewMode : 'years',
		format : 'YYYY/MM',
		minViewMode : "months",
		pickTime : false
	});

	$('#messagelist-date-input').prop('disabled', true);

}
// Inf Login
function infLogin() {
	sessionStorage.removeItem("token");
	alert('해당 계정은 page를 제공 하지 않습니다. 다른 아이디로 로그인하세요!');

}
// Svc Admin Login
function svcAdmLogin() {
	console.log('pcbs start');
	$('#ul_userInfo').show();
	$('.navbar-static-side').show();
	$('#message_send_li').show();
	$('#svc_message_send_li_second').hide();
	$('#svc_message_list_li').show();
	$('#svc_message_reservation_li').show();
	$('#sys_monitoring_li').hide();
	$('#sys_message_list_li').hide();
	$('#sys_admin_li').hide();
	$('#svc_message_list_month_li').show();
	$('#sys_message_list_month_li').hide();
	sessionStorage.setItem("monitoringStatus", "disable");
	$('#messagelist-search-date-start-div').datetimepicker({
		format : "YYYY/MM/DD hh:mm a",
		defaultDate : getCurrentDayF(),
		minDate : getCurrentDayF(),
		maxDate : getCurrentDayL()

	});

	$('#messagelist-search-date-end-div').datetimepicker({
		format : "YYYY/MM/DD hh:mm a",
		defaultDate : getCurrentDayL(),
		minDate : getCurrentDayF(),
		maxDate : getCurrentDayL()
	});

	$('#messagelist-date-div').datetimepicker({
		viewMode : 'years',
		format : 'YYYY/MM',
		minViewMode : "months",
		pickTime : false
	});

	$('#messagelist-date-input').prop('disabled', true);

}

/*
 * DateFormating 06/12/20146:27PM
 */
function dateFormating(value) {
	console.log('dateFor');
	// 2014/02/0112:00am
	console.log(value);
	var result = compactTrim(value);
	// 06/12/2014 06:27PM
	var year = result.substring(0, 4);
	var month = result.substring(5, 7);
	var day = result.substring(8, 10);
	var hour = result.substring(10, 12);
	console.log(hour);
	var minute = result.substring(13, 15);
	var amPm = result.substring(15, 17);
	if (amPm === 'PM') {
		hour *= 1;
		hour = hour + 12;
	}
	console.log(hour);
	value = new Date(year, month - 1, day, hour, minute);
	console.log(value);
	return value;

}

function chageDateF(year, month) {
	console.log(year);
	var defaultFirstDay = new Date(year, month, 1);
	var nowYear = defaultFirstDay.getFullYear();
	var nowMonth = defaultFirstDay.getMonth();
	var firstDay = defaultFirstDay.getDate();
	console.log('changeDateF');
	console.log(nowYear + "/" + nowMonth + "/" + firstDay);
	return nowYear + "/" + nowMonth + "/" + firstDay;
}

function chageDateL(year, month) {

	var defaultLastDay = new Date(year, month, 0);
	var nowYear = defaultLastDay.getFullYear();
	var nowMonth = defaultLastDay.getMonth();
	console.log('마지막날');
	console.log(nowMonth);
	nowMonth = nowMonth * 1 + 1;
	var lastDay = defaultLastDay.getDate();
	return nowYear + "/" + nowMonth + "/" + lastDay+"/23:59";
}

// getCurrent First Day
function getCurrentDayF() {
	var nowDate = new Date();
	var defaultFirstDay = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
	var nowYear = defaultFirstDay.getFullYear();
	var nowMonth = defaultFirstDay.getMonth();
	nowMonth = nowMonth * 1 + 1;
	var firstDay = defaultFirstDay.getDate();

	return nowYear + "/" + nowMonth + "/" + firstDay;

}

// getCurrent Last Day
function getCurrentDayL() {
	var nowDate = new Date();
	var defaultLastDay = new Date(nowDate.getFullYear(),
			nowDate.getMonth() + 1, 0);
	var nowYear = defaultLastDay.getFullYear();
	var nowMonth = defaultLastDay.getMonth() + 1;
	var lastDay = defaultLastDay.getDate();
	return nowYear + "/" + nowMonth + "/" + lastDay+"/23:59";

}

// utf8_to_b64(str)
function utf8_to_b64(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
}
// b64_to_utf8(str)
function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}

// UUID generate
var guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16)
				.substring(1);
	}
	return function() {
		return s4() + s4();
	};
})();

// CKEDITOR Get Contents
function GetContents() {
	var editor = CKEDITOR.instances.input_messageContent;
	return editor.getData();

}

// CKEDITOR Plain Text
function ckGetPlainText() {
	var html = CKEDITOR.instances.input_messageContent.getSnapshot();
	var dom = document.createElement("DIV");
	dom.innerHTML = html;
	var plain_text = (dom.textContent || dom.innerText);
	console.log(plain_text);
	return plain_text;
}

//
function utf8ByteLength(str) {
	if (!str)
		return 0;
	var escapedStr = encodeURI(str);
	var match = escapedStr.match(/%/g);
	return match ? (escapedStr.length - match.length * 2) : escapedStr.length;
}

// Date Formating
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString();
	var dd = this.getDate().toString();
	var hour = this.getHours().toString();
	var minute = this.getMinutes().toString();
	return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/"
			+ (dd[1] ? dd : "0" + dd[0]) + " "
			+ (hour[1] ? hour : "0" + hour[0]) + ":"
			+ (minute[1] ? minute : "0" + minute[0]);
};

$.ajaxSetup({
	statusCode : {
		200 : function() {

		},
		401 : function(data) {
			alert("토큰이 만료 되어 로그인 화면으로 이동합니다.");
			$("#page-wrapper").load("pages/login.html", function() {
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("userId");
				sessionStorage.removeItem("role");
				sessionStorage.removeItem("monitoringStatus");
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
		},
		404 : function(data) {
			alert("페이지를 찾을수 없어 로그인 화면으로 이동합니다.");
			$("#page-wrapper").load("pages/login.html", function() {
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("userId");
				sessionStorage.removeItem("role");
				sessionStorage.removeItem("monitoringStatus");
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

	beforeSend : function() {
		if (ladda_object != null && ladda_object != "") {
			ladda_object.start();
		}

	},
	complete : function() {
		if (ladda_object != null && ladda_object != "") {
			ladda_object.stop();
		}

	}
});
