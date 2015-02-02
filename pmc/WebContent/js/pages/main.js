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

				} else if (userRole == "inf") {
					$("#page-wrapper").load(
							"pages/messageListPageWrapper.html", function() {
								infLogin();
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

// page wrapperfunction
function wrapperFunction(data) {

	$("#page-wrapper")
			.load(
					"pages/" + data + "PageWrapper.html",
					function() {

						if (data === "userManager") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						// 메시지 전송 기능삭제
						if (data === "MessageSend") {

							sessionStorage.setItem("monitoringStatus",
									"disable");

							// CKEDITOR.replace('input_messageContent', {
							// startupFocus : true
							// });

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
						}

						if (data === "monitoring") {

							var element = document.createElement("script");
							element.src = "js/pages/monitoring.js";
							document.body.appendChild(element);
							sessionStorage
									.setItem("monitoringStatus", "enable");

						}
						// 메시지 발송 현황 기능 삭제
						if (data === "messageList") {

							var elementDataTable = document
									.createElement("script");
							elementDataTable.src = "js/plugins/dataTables/jquery.dataTables.js";
							var elementDataTableBT = document
									.createElement("script");
							elementDataTableBT.src = "js/plugins/dataTables/dataTables.bootstrap.js";

							document.body.appendChild(elementDataTable);
							document.body.appendChild(elementDataTableBT);

							sessionStorage.setItem("monitoringStatus",
									"disable");

						}

						if (data === "reservationList") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						if (data === "userAdd") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}
						if (data === "userManager") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						if (data === "statistics") {

							sessionStorage.setItem("monitoringStatus",
									"disable");

							// CKEDITOR.replace('input_messageContent', {
							// startupFocus : true
							// });

							var nowDate = new Date();
							var today = new Date(nowDate.getFullYear(), nowDate
									.getMonth(), nowDate.getDate(), 0, 0, 0, 0);

							$('#statistics-search-date-start-div')
									.datetimepicker().data("DateTimePicker")
									.setMaxDate(today);

							$('#statistics-search-date-end-div')
									.datetimepicker().data("DateTimePicker")
									.setMaxDate(today);
						}

					});
}

// login function
var ladda_object = "";
function loginFunction(atag) {
	console.log("atag:" + atag);
	ladda_object = Ladda.create(atag);

	var loginId = $('#loginId').val();
	var loginPass = $('#loginPass').val();
	// form null check
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
	console.log("로그인 정보:" + loginReq);

	// // login ajax call
	$.ajax({
		url : '/adm/cmm/auth',
		type : 'POST',
		contentType : "application/json",
		headers : {
			'X-Application-Token' : ""
		},
		dataType : 'json',
		async : false,
		data : loginReq,
		statusCode : {
			200 : function(data) {
				console.log("200..");
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
			}
		},
		success : function(data) {
			console.log("ajax data!!!!!");
			console.log(data);
			console.log("ajax data!!!!!");

			console.log('login in ajax call success');
			var loginResult = data.result.data;

			if (loginResult) {
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
						$("#page-wrapper").load(
								"pages/messageListPageWrapper.html",
								function() {
									console.log('testpcbs');
									infLogin();
									console.log('testpcbs');
								});
					}

				} else {

					alert(data.result.errors[0]);
				}
			} else {

				alert('로그인에 실패 하였습니다.');
			}

		},
		error : function(data, textStatus, request) {

			alert('로그인에 실패 하였습니다.');
			console.log('fail start...........');
			console.log(data);
			console.log(textStatus);
			console.log('fail end.............');
		}
	});

}

// logoutFunction
function userInfo() {
	var userID = sessionStorage.getItem("userId");
	alert(userID + "으로 로그인 중입니다.");
}

function logoutFunction() {
	if (confirm("로그아웃 하시 겠습니까??") == true) { // 확인
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("role");
		sessionStorage.removeItem("monitoringStatus");

		// window.location = "/BootStrapTest/index.jsp";
		window.location.reload();
	} else { // 취소
		return;
	}

}

// //////////////UTIL/////////////////////////////////
// date validateDate Check
function validateDate(input_reservation) {
	var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
	return date_regex.test(input_reservation);
}

// compactTrim function
function compactTrim(value) {
	return value.replace(/(\s*)/g, "");
}

function sysLogin() {
	$('#ul_userInfo').show();
	$('.navbar-static-side').show();
	$('#sys_monitoring_li').show();
	$('#sys_admin_li').show();
	$('#svc_message_list_li').hide();
	$('#svc_message_reservation_li').hide();
	$('#inf_message_send_li').hide();

}

function svcLogin() {
	$('#ul_userInfo').show();
	$('.navbar-static-side').show();
	$('#sys_monitoring_li').hide();
	$('#sys_admin_li').hide();
	$('#svc_message_list_li').show();
	$('#svc_message_reservation_li').show();
	$('#inf_message_send_li').hide();

}

function infLogin() {
	console.log('pcbs start');
	$('#ul_userInfo').show();
	$('.navbar-static-side').show();
	$('#inf_message_send_li').show();
	$('#svc_message_list_li').show();
	$('#svc_message_reservation_li').show();
	$('#sys_monitoring_li').hide();
	$('#sys_admin_li').hide();

}

// dateFormating
function dateFormating(value) {
	// 06/12/20146:27PM

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

// ///////////////////////////////////////////////////////////////
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
	// Get the editor instance that you want to interact with.
	var editor = CKEDITOR.instances.input_messageContent;
	return editor.getData();

}

function ckGetPlainText() {
	var html = CKEDITOR.instances.input_messageContent.getSnapshot();
	var dom = document.createElement("DIV");
	dom.innerHTML = html;
	var plain_text = (dom.textContent || dom.innerText);
	console.log(plain_text);
	return plain_text;
}

Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
	var dd = this.getDate().toString();
	var hour = this.getHours().toString();
	var minute = this.getMinutes().toString();
	return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/"
			+ (dd[1] ? dd : "0" + dd[0]) + " "
			+ (hour[1] ? hour : "0" + hour[0]) + ":"
			+ (minute[1] ? minute : "0" + minute[0]); // padding
};

$.ajaxSetup({
	beforeSend : function() {
		// show gif here, eg:
		console.log('ajax before');
		if (ladda_object != null && ladda_object != "") {
			ladda_object.start();
		}

	},
	complete : function() {
		// hide gif here, eg:
		console.log('ajax complate');
		if (ladda_object != null && ladda_object != "") {
			ladda_object.stop();
		}

	}
});
