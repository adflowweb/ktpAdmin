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

	$("#page-wrapper").load(
			"pages/" + data + "PageWrapper.html",
			function() {

				if (data === "userManager") {
					sessionStorage.setItem("monitoringStatus", "disable");
				}

				if (data === "MessageSendAdm") {

					sessionStorage.setItem("monitoringStatus", "disable");
					var nowDate = new Date();
					var today = new Date(nowDate.getFullYear(), nowDate
							.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
					var today_30 = new Date(nowDate.getFullYear(), nowDate
							.getMonth(), nowDate.getDate() + 30, 0, 0, 0, 0);
					$('#message-send-reservation-div').datetimepicker().data(
							"DateTimePicker").setMinDate(today);

					$('#message-send-reservation-div').datetimepicker().data(
							"DateTimePicker").setMaxDate(today_30);
					$("#message-send-reservationdate-input").prop('disabled', true);
				}
				
				if (data === "MessageSendUser") {

					sessionStorage.setItem("monitoringStatus", "disable");
					var nowDate = new Date();
					var today = new Date(nowDate.getFullYear(), nowDate
							.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
					var today_30 = new Date(nowDate.getFullYear(), nowDate
							.getMonth(), nowDate.getDate() + 30, 0, 0, 0, 0);
					$('#message-send-user-reservation-div').datetimepicker().data(
							"DateTimePicker").setMinDate(today);

					$('#message-send-user-reservation-div').datetimepicker().data(
							"DateTimePicker").setMaxDate(today_30);
					$("#message-send-user-reservationdate-input").prop('disabled', true);
				}

				if (data === "monitoring") {

					var element = document.createElement("script");
					element.src = "js/pages/monitoring.js";
					document.body.appendChild(element);
					sessionStorage.setItem("monitoringStatus", "enable");

				}

				if (data === "messageList") {
					sessionStorage.setItem("monitoringStatus", "disable");
					$('#messagelist-date-div').datetimepicker({
						viewMode : 'years',
						format : 'YYYY/MM',
						minViewMode : "months"
					});
					$('#messagelist-date-input').prop('disabled', true);

				}

				if (data === "reservationList") {
					sessionStorage.setItem("monitoringStatus", "disable");

					$('#reservation-date-div').datetimepicker({
						viewMode : 'years',
						format : 'YYYY/MM',
						minViewMode : 'months'
					});
					$('#reservation-date-input').prop('disabled', true);
				}

				if (data === "userAdd") {
					sessionStorage.setItem("monitoringStatus", "disable");
				}
				if (data === "userManager") {
					sessionStorage.setItem("monitoringStatus", "disable");
				}

				if (data === "statistics") {

					sessionStorage.setItem("monitoringStatus", "disable");
					$("#statistics-search-date-start-input").prop('disabled', true);
					$("#statistics-search-date-end-input").prop('disabled', true);
					$("#statistics-reservation-search-date-start-input").prop('disabled', true);
					$("#statistics-reservation-search-date-end-input").prop('disabled', true);
					var nowDate = new Date();
					var today = new Date(nowDate.getFullYear(), nowDate
							.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

					$('#statistics-search-date-start-div').datetimepicker()
							.data("DateTimePicker").setMaxDate(today);

					$('#statistics-search-date-end-div').datetimepicker().data(
							"DateTimePicker").setMaxDate(today);

					$('#statistics-reservation-search-date-start-div')
							.datetimepicker().data("DateTimePicker")
							.setMaxDate(today);

					$('#statistics-reservation-search-date-end-div')
							.datetimepicker().data("DateTimePicker")
							.setMaxDate(today);
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
	$('#svcadm_message_send_li_second').hide();
	sessionStorage.setItem("monitoringStatus", "disable");
	$('#messagelist-date-div').datetimepicker({
		viewMode : 'years',
		format : 'YYYY/MM',
		minViewMode : "months"
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
	$('#sys_admin_li').hide();
	sessionStorage.setItem("monitoringStatus", "disable");
	$('#messagelist-date-div').datetimepicker({
		viewMode : 'years',
		format : 'YYYY/MM',
		minViewMode : "months"
	});

	$('#messagelist-date-input').prop('disabled', true);

}

/*
 * DateFormating 06/12/20146:27PM
 */
function dateFormating(value) {
	console.log('dateFor');
	console.log(value);
	var result = compactTrim(value);
	if (result.length == 16) {
		var month = result.substring(0, 2);
		console.log('달', month);
		console.log(month);
		var day = result.substring(3, 5);
		console.log(day);
		var year = result.substring(6, 10);

		var hour = result.substring(10, 11);
		console.log(hour);
		var minute = result.substring(12, 14);
		var amPm = result.substring(14, 16);
		if (amPm === 'PM') {
			hour *= 1;
			hour = hour + 12;
		}
		console.log(hour);
		value = new Date(year, month - 1, day, hour, minute);
		console.log(value);
		return value;
	}

	if (result.length == 17) {
		// 06/12/2014 06:27PM
		var month = result.substring(0, 2);
		var day = result.substring(3, 5);
		var year = result.substring(6, 10);
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

//Date Formating
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
