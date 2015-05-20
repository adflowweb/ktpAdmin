//ready Function
$(document).ready(
		function() {

			$('.navbar-static-side').hide();
			var localTokenId = sessionStorage.getItem("token");

			sessionStorage.setItem("monitoringStatus", "disable");
			if (localTokenId) {
				var userRole = sessionStorage.getItem("role");
				if (userRole == "sys") {

//					 logOutRole();

					$("#page-wrapper").load(
							"pages/userManagerPageWrapper.html", function() {
								sysLogin();
							});
				} else if (userRole == "svc") {

					 logOutRole();

//					var userName = sessionStorage.getItem("userName");
//					console.log('서비스 계정 새로고침');
//					console.log(userName);
//					if (userName == null || userName == ""
//							|| userName == "null") {
//						console.log('유저네임 널');
//						$("#page-wrapper")
//								.load(
//										"pages/userNameUpdatePageWrapper.html",
//										function() {
//											var userUpdteUfmi = sessionStorage
//													.getItem("ufmi");
//											var userUpdateId = sessionStorage
//													.getItem("userId");
//											$('#first-info-id-input').val(
//													userUpdateId);
//											$('#first-info-ufmi-input').val(
//													userUpdteUfmi);
//											$('#change_pw_li').hide();
//										});
//
//					} else {
//						console.log('유저네임 널이아님');
//						$("#page-wrapper").load(
//								"pages/messageListPageWrapper.html",
//								function() {
//									svcLogin();
//								});
//
//					}

				} else if (userRole == "svcadm") {

//					 logOutRole();

					$("#page-wrapper").load(
							"pages/messageListPageWrapper.html", function() {
								svcAdmLogin();

							});

				}

			} else {
				$('#ul_userInfo').hide();
				$('.navbar-static-side').hide();

				$("#page-wrapper").load("pages/login.html", function() {

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

// page wrapperFunction
function wrapperFunction(data) {

	$("#page-wrapper")
			.load(
					"pages/" + data + "PageWrapper.html",
					function() {

						if (data === "userManager") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						if (data === "userNameUpdate") {

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

							$('#message-send-reservation-div').datetimepicker({
								format : "YYYY/MM/DD hh:mm a",
								minDate : today,
								maxDate : today_30
							});
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
									.datetimepicker({
										format : "YYYY/MM/DD hh:mm a",
										minDate : today,
										maxDate : today_30
									});
							$("#message-send-user-reservationdate-input").prop(
									'disabled', true);

						}

						if (data === "monitoring") {

							var element = document.createElement("script");
							element.src = "js/pages/pmsmonitoring.js";
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

							// $('#reservation-search-date-start-div')
							// .datetimepicker({
							// format : "YYYY/MM/DD hh:mm a",
							// defaultDate : getCurrentDayF(),
							// minDate : getCurrentDayF(),
							// maxDate : getCurrentDayL()
							//
							// });
							//
							// $('#reservation-search-date-end-div')
							// .datetimepicker({
							// format : "YYYY/MM/DD hh:mm a",
							// defaultDate : getCurrentDayL(),
							// minDate : getCurrentDayF(),
							// maxDate : getCurrentDayL()
							// });

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

						}

						if (data === "statistics") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
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

							// $('#statistics-reservation-search-date-start-div')
							// .datetimepicker({
							// format : "YYYY/MM/DD hh:mm a",
							// defaultDate : getCurrentDayF(),
							// minDate : getCurrentDayF(),
							// maxDate : getCurrentDayL()
							// });
							//
							// $('#statistics-reservation-search-date-end-div')
							// .datetimepicker({
							// format : "YYYY/MM/DD hh:mm a",
							// defaultDate : getCurrentDayL(),
							// minDate : getCurrentDayF(),
							// maxDate : getCurrentDayL()
							// });
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

// login
var ladda_object = "";
function loginFunction(atag) {
	ladda_object = Ladda.create(atag);
	var loginId = $('#loginId').val();
	var loginPass = $('#loginPass').val();
	// formCheck
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
			if (!data.result.errors) {
				console.log('로그인 데이터');
				console.log(data);
				var dataResult = data.result.data;
				var role = data.result.data.role;
				var token = data.result.data.token;
				var userId = data.result.data.userId;
				var ufmi = data.result.data.ufmi;
				var groupTopic = data.result.data.groupTopic;
				var userName = data.result.data.userName;
				if (ufmi != null) {
					sessionStorage.setItem("ufmi", ufmi);

				}
				if (groupTopic != null) {
					sessionStorage.setItem("groupTopic", groupTopic);
				}
				sessionStorage.setItem("role", role);
				sessionStorage.setItem("token", token);
				sessionStorage.setItem("userId", userId);
				sessionStorage.setItem("userName", userName);
				var userRole = sessionStorage.getItem("role");
				if (userRole == "sys") {
//					logOutRole();

					 $("#page-wrapper").load(
							"pages/userManagerPageWrapper.html", function() {
								sysLogin();
							});

				} else if (userRole == "svc") {
					 logOutRole();
//					if (userName == null || userName == ""
//							|| userName == "null") {
//						$("#page-wrapper")
//								.load(
//										"pages/userNameUpdatePageWrapper.html",
//										function() {
//											$('#ul_userInfo').show();
//											$('#change_pw_li').hide();
//											var userUpdteUfmi = sessionStorage
//													.getItem("ufmi");
//											var userUpdateId = sessionStorage
//													.getItem("userId");
//											$('#first-info-id-input').val(
//													userUpdateId);
//											$('#first-info-ufmi-input').val(
//													userUpdteUfmi);
//										});
//
//					} else {
//
//						$("#page-wrapper").load(
//								"pages/messageListPageWrapper.html",
//								function() {
//									svcLogin();
//								});
//
//					}

				} else if (userRole == "inf") {

					infLogin();

				} else if (userRole = "svcadm") {
//					 logOutRole();

					$("#page-wrapper").load(
							"pages/messageListPageWrapper.html", function() {
								svcAdmLogin();

							});

				}

			} else {

				alert('로그인에 실패 하였습니다.');
			}

		},
		error : function(data, textStatus, request) {

			alert('로그인에 실패 하였습니다.');

		}
	});

}

// userInfo
function userInfo() {
	var userID = sessionStorage.getItem("userId");
	alert(userID + "으로 로그인 중입니다.");
}
// logOut
function logoutFunction() {
	if (confirm("로그아웃 하시 겠습니까??") == true) { // 확인
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("role");
		sessionStorage.removeItem("monitoringStatus");
		sessionStorage.removeItem("groupTopic");
		sessionStorage.removeItem("ufmi");
		sessionStorage.removeItem("userName");
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

// compactTrim
function compactTrim(value) {
	return value.replace(/(\s*)/g, "");
}
// sysLogin
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
	$('#phone_span').hide();
}
// svcLogin
function svcLogin() {
	$('#ul_userInfo').show();
	$('#change_pw_li').hide();
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
	var loginUfmiNum = $('#phone_span').text();
	if (loginUfmiNum == null || loginUfmiNum == "" || loginUfmiNum == "null") {
		$('#phone_span').hide();
	} else {
		$('#phone_span').text(sessionStorage.getItem('ufmi'));
	}

}
// inf Login
function infLogin() {
	sessionStorage.removeItem("token");
	alert('해당 계정은 page를 제공 하지 않습니다. 다른 아이디로 로그인하세요!');

}
// svcAdmin Login
function svcAdmLogin() {

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
	$('#phone_span').hide();

}

// dateFormating
function dateFormating(value) {
	var result = compactTrim(value);
	var year = result.substring(0, 4);
	var month = result.substring(5, 7);
	var day = result.substring(8, 10);
	var hour = result.substring(10, 12);

	var minute = result.substring(13, 15);
	var amPm = result.substring(15, 17);
	if (amPm === 'pm') {
		hour *= 1;
		hour = hour + 12;
	}
	value = new Date(year, month - 1, day, hour, minute);
	return value;

}

// setFirstDay
function chageDateF(year, month) {
	var defaultFirstDay = new Date(year, month, 1);
	var nowYear = defaultFirstDay.getFullYear();
	var nowMonth = defaultFirstDay.getMonth();
	var firstDay = defaultFirstDay.getDate();
	return nowYear + "/" + nowMonth + "/" + firstDay;
}

// lastDay for ie
// function chageDateLIE(year, month) {
// var defaultLastDay = new Date(year, month, 0);
// var nowYear = defaultLastDay.getFullYear();
// var nowMonth = defaultLastDay.getMonth();
// nowMonth = nowMonth * 1 + 1;
// var lastDay = defaultLastDay.getDate();
// console.log('날짜 테스');
// //02/28/2015 23:59
// return nowMonth + "/" + lastDay + "/" + nowYear + " 23:59";
// }

// setLastDay
function chageDateL(year, month) {
	var defaultLastDay = new Date(year, month, 0);
	var nowYear = defaultLastDay.getFullYear();
	var nowMonth = defaultLastDay.getMonth();
	nowMonth = nowMonth * 1 + 1;
	var lastDay = defaultLastDay.getDate();
	console.log('날짜 테스');
	// return nowYear + "/" + nowMonth + "/" + lastDay + "/23:59";
	return moment(nowMonth + "/" + lastDay + "/" + nowYear + " 23:59");

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
	// return nowYear + "/" + nowMonth + "/" + lastDay + "/23:59";
	return moment(nowYear + "/" + nowMonth + "/" + lastDay + " 23:59");
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

var p2numArray = function() {
	var p2Numtemp = [];
	for (var i = 0; i <= 4; i++) {
		for (var j = 0; j <= 9; j++) {
			if (i == 4) {
				if (j < 2) {
					p2Numtemp.push("" + i + j);
				}
			} else {
				p2Numtemp.push("" + i + j);
			}

		}
	}
	return p2Numtemp;
};

var ufmiVerCheck = function(ufmi) {
	this.ufmi = ufmi;
	console.log('ufmiVer체크 펑션');
	console.log(ufmi);
	var ufmiVer = "";
	var firstIndex = "";
	var lastIndex = "";

	var ufmiFirstIndex = ufmi.indexOf('*') * 1;
	var ufmiLastIndex = ufmi.lastIndexOf('*') * 1;
	var ufmiTotalLength = ufmi.length * 1;

	// // p1check
	if (ufmi.substring(0, 2) == "82" && ufmiFirstIndex + 1 < ufmiLastIndex
			&& ufmiLastIndex - ufmiFirstIndex < 8
			&& ufmiLastIndex + 1 < ufmiTotalLength
			&& ufmiTotalLength - ufmiLastIndex < 8) {
		ufmiVer = "p1";
		firstIndex = ufmi.substring(0, ufmiFirstIndex + 1);
		lastIndex = ufmi.substring(0, ufmiLastIndex + 1);
		console.log('p1 자른 무전번호');
		console.log(firstIndex);
		console.log(lastIndex);
	} else if (!ufmi.substring(0, 2) !== "82"
			&& ufmiFirstIndex + 1 < ufmiLastIndex
			&& ufmiLastIndex - ufmiFirstIndex < 6
			&& ufmiLastIndex + 1 < ufmiTotalLength
			&& ufmiTotalLength - ufmiLastIndex < 6) {
		ufmiVer = "p2";
		firstIndex = ufmi.substring(0, ufmiFirstIndex + 1);
		lastIndex = ufmi.substring(0, ufmiLastIndex + 1);
		console.log('p2 자른 무전번호');
		console.log(firstIndex);
		console.log(lastIndex);
	}

	return {
		ufmiVer : ufmiVer,
		firstIndex : firstIndex,
		lastIndex : lastIndex
	};

};

// // CKEDITOR Get Contents
// function GetContents() {
// var editor = CKEDITOR.instances.input_messageContent;
// return editor.getData();
//
// }
//
// // CKEDITOR Plain Text
// function ckGetPlainText() {
// var html = CKEDITOR.instances.input_messageContent.getSnapshot();
// var dom = document.createElement("DIV");
// dom.innerHTML = html;
// var plain_text = (dom.textContent || dom.innerText);
// console.log(plain_text);
// return plain_text;
// }

// utf8 to base64
function utf8ByteLength(str) {
	if (!str)
		return 0;
	var escapedStr = encodeURI(str);
	var match = escapedStr.match(/%/g);
	return match ? (escapedStr.length - match.length * 2) : escapedStr.length;
}

String.prototype.Length = function() {
	var len = 0;
	var arg = arguments[0] == undefined ? this.toString() : arguments[0];
	for (var i = 0; i < arg.length; i++) {
		var _ch = arg[i].charCodeAt();
		if (_ch >= 0x0080 && _ch <= 0xFFFF) {
			len += 2;
		} else {
			len++;
		}

	}
	return len;
};

String.Length = function(arg) {
	if (arg == undefined || arg == null) {
		throw "Property or Arguments was Nerver Null"
	} else {
		if (typeof (arg) != "string") {
			throw "Property or Arguments was not 'String' Types.";
		} else {
			return arg.Length();
		}
	}
};

// function getUTF8Length(s) {
// var len = 0;
// for (var i = 0; i < s.length; i++) {
// var code = s.charCodeAt(i);
// if (code <= 0x7f) {
// len += 1;
// } else if (code <= 0x7ff) {
// len += 2;
// } else if (code >= 0xd800 && code <= 0xdfff) {
// // Surrogate pair: These take 4 bytes in UTF-8 and 2 chars in UCS-2
// // (Assume next char is the other [valid] half and just skip it)
// len += 4;
// i++;
// } else if (code < 0xffff) {
// len += 3;
// } else {
// len += 4;
// }
// }
// return len;
// }

function logOutRole() {
	alert("해당 계정으로 로그인 할 수 없습니다.");
	$("#page-wrapper").load("pages/login.html", function() {
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("role");
		sessionStorage.removeItem("monitoringStatus");
		sessionStorage.removeItem("groupTopic");
		sessionStorage.removeItem("ufmi");
		sessionStorage.removeItem("userName");
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
// ajax status code
$.ajaxSetup({
	statusCode : {
		200 : function() {

		},
		401 : function(data) {
			alert("사용시간이 경과되어 자동 로그아웃 됩니다.");
			$("#page-wrapper").load("pages/login.html", function() {
				sessionStorage.removeItem("token");
				sessionStorage.removeItem("userId");
				sessionStorage.removeItem("role");
				sessionStorage.removeItem("monitoringStatus");
				sessionStorage.removeItem("groupTopic");
				sessionStorage.removeItem("ufmi");
				sessionStorage.removeItem("userName");
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
				sessionStorage.removeItem("groupTopic");
				sessionStorage.removeItem("ufmi");
				sessionStorage.removeItem("userName");
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
