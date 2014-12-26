$(document).ready(function() {

	$('.navbar-static-side').hide();
	var localTokenId = sessionStorage.getItem("tokenID");
	// local storage token ID Check
	if (localTokenId) {
		$('.navbar-static-side').show();
		$('#ul_userInfo').show();
		sessionStorage.setItem("monitoringStatus", "disable");
		$("#page-wrapper").load("pages/keepAlivePageWrapper.html", function() {

		});
		// tokenId..null
	} else {

		$("#page-wrapper").load("pages/login.html", function() {
			$('#ul_userInfo').hide();
			console.log("logind..html..");
			console.log("test branch ktpmsgAmdi");
		});

	}

});

function resetFunction() {
	wrapperFunction('tokenManager');
}

// page wrapperfunction
function wrapperFunction(data) {

	$("#page-wrapper")
			.load(
					"pages/" + data + "PageWrapper.html",
					function() {

						console.log(data);
						var tokenID = sessionStorage.getItem("tokenID");
						var userID = sessionStorage.getItem("userID");
						console.log(tokenID);
						console.log(userID);

						if (data === "keepAlive") {
							sessionStorage.setItem("monitoringStatus",
									"disable");
						}

						if (data === "userManager") {
							sessionStorage.setItem("monitoringStatus",
									"disable");

							$
									.ajax({
										url : '/v1/users?type=admin',
										type : 'GET',
										headers : {
											'X-ApiKey' : tokenID
										},
										contentType : "application/json",
										async : false,
										success : function(data) {
											var tableData = [];
											if (data.result.data) {

												for ( var i in data.result.data) {

													var item = data.result.data[i];
													console.log(item);

													// /////////
													$
															.ajax({
																url : '/v1/tokenMulti/'
																		+ item.userID,
																type : 'GET',
																headers : {
																	'X-ApiKey' : tokenID
																},
																contentType : "application/json",
																async : false,
																success : function(
																		data) {

																	if (data.result.data) {

																		for ( var i in data.result.data) {

																			var itemTokenInfo = data.result.data[i];
																			console
																					.log(itemTokenInfo);
																			tableData
																					.push({
																						"Id" : item.userID,
																						"Name" : item.name,
																						"Dept" : item.dept,
																						"Phone" : item.phone,
																						"TokenID" : itemTokenInfo.tokenID
																					});

																		}

																	} else {
																		alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
																	}
																},
																error : function(
																		data,
																		textStatus,
																		request) {
																	console
																			.log(data);
																	alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
																}
															});

												}

												console.log(tableData);
												$('#dataTables-example')
														.dataTable(
																{
																	bJQueryUI : true,
																	bDestroy : true,
																	aaData : tableData,
																	aoColumns : [
																			{
																				mData : 'Id'
																			},
																			{
																				mData : 'Name'
																			},
																			{
																				mData : 'Dept'
																			},
																			{
																				mData : 'Phone'
																			},
																			{
																				mData : 'TokenID'
																			} ]
																});
											} else {
												alert('유저 정보를 가지고 오는데 실패 하였습니다.');
											}
										},
										error : function(data, textStatus,
												request) {
											console.log(data);
											alert('유저 정보를 가지고 오는데 실패 하였습니다.');
										}
									});

							$('#dataTables-example tbody').on(
									'click',
									'tr',
									function() {

										var tableData = $(this).children("td")
												.map(function() {
													return $(this).text();
												}).get();

										console.log(tableData[0]);
										$('#input_adminID').val(tableData[0]);
									});

						}

						if (data === "token") {

							sessionStorage.setItem("monitoringStatus",
									"disable");

						}

						if (data === "changePass") {
							sessionStorage.setItem("monitoringStatus",
									"disable");

						}

						if (data === "MessageSend") {
							// 기능삭제
							// sessionStorage.setItem("monitoringStatus",
							// "disable");
							// ckeditor create
							// CKEDITOR.replace('input_messageContent',{
							// startupFocus : true
							// });
						}

						if (data === "monitoring") {

							var element = document.createElement("script");
							element.src = "js/pages/monitoring.js";
							document.body.appendChild(element);
							sessionStorage
									.setItem("monitoringStatus", "enable");

						}

						if (data === "messageList") {
							// 기능삭제
							// sessionStorage.setItem("monitoringStatus",
							// "disable");
							// var tableData = [];
							// $.ajax({
							// url : '/v1/messages?type=sent',
							// type : 'GET',
							// headers : {
							// 'X-ApiKey' : tokenID
							// },
							// contentType : "application/json",
							// async : false,
							// success : function(data) {
							//				
							// if (data.result.data) {
							//
							// for ( var i in data.result.data) {
							//
							// var item = data.result.data[i];
							// console.log(item);
							// var status="";
							// if(item.status==0){
							// status="발송 준비중";
							// }else if(item.status==1){
							// status="push 발송됨";
							// }
							// else{
							// status=item.status;
							// }
							//							
							// var dateTime=item.issue;
							//							
							// var time=new Date(dateTime).toISOString();
							//							
							// tableData.push({
							// "MessageId" :item.id,
							// "Sender" : item.sender,
							// "Receiver" : item.receiver,
							// "qos" : item.qos,
							// "status":status,
							// "time":time
							//						
							// });
							// }
							//
							// console.log(tableData);
							//						
							// //테이블 생성
							// $('#dataTables-example').dataTable({
							// bJQueryUI : true,
							// aaData : tableData,
							// bDestroy: true,
							// aoColumns : [ {
							// mData : 'MessageId'
							// }, {
							// mData : 'Sender'
							// }, {
							// mData : 'Receiver'
							// }, {
							// mData : 'qos'
							// },{
							// mData : 'status'
							// },{
							// mData : 'time'
							// } ],
							// aaSorting: [[0,'desc']]
							// });
							// } else {
							// alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
							// }
							// },
							// error : function(data, textStatus, request) {
							// console.log(data);
							// alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
							// }
							// });

						}

					});
}

// login function
function loginFunction() {

	var loginId = $('#loginId').val();
	var loginPass = $('#loginPass').val();
	// form null check
	if (loginId == null || loginId == "") {
		alert("아이디 입력해주세요");
		return false;
	}

	if (loginPass == null || loginPass == "") {
		alert("비밀번호를  입력해주세요");
		return false;
	}
	var deviceID = utf8_to_b64(loginId);
	// login ajax call
	$.ajax({
		url : '/v1/adminAuth',
		type : 'POST',
		contentType : "application/json",
		dataType : 'json',
		async : false,
		data : '{"userID":"' + loginId + '","password":"' + loginPass
				+ '","deviceID":"' + deviceID + '"}',
		success : function(data) {
			console.log("ajax data!!!!!");
			console.log(data);
			console.log("ajax data!!!!!");

			console.log('login in ajax call success');
			var loginResult = data.result.data;

			if (loginResult) {
				if (!data.result.errors) {

					var tokenID = data.result.data.tokenID;
					console.log("토큰아이디:" + tokenID);
					var userID = data.result.data.userID;

					sessionStorage.setItem("tokenID", tokenID);
					sessionStorage.setItem("userID", userID);

					$.ajax({
						url : '/v1/users/' + loginId,
						type : 'GET',
						headers : {
							'X-ApiKey' : tokenID
						},
						contentType : "application/json",
						async : false,
						success : function(data) {

							if (data.result.data) {

							} else {
								alert('유정 정보를 가지고 오는데 실패하였습니다.');
							}
						},
						error : function(data, textStatus, request) {
							console.log(data);
							alert('유저 정보를 가지고 오는데 실패 하였습니다.');
						}
					});

					// mainPage load
					$("#page-wrapper").load("pages/keepAlivePageWrapper.html",
							function() {

								$('#ul_userInfo').show();
								$('.navbar-static-side').show();

							});
					// user not found or invalid password
				} else {
					alert(data.result.errors[0]);
				}
			} else {
				alert('로그인에 실패 하였습니다.');
			}

		},
		error : function(data, textStatus, request) {
			console.log('fail start...........');
			console.log(data);
			console.log(textStatus);
			console.log('fail end.............');
		}
	});

}

// logoutFunction
function userInfo() {
	var userID = sessionStorage.getItem("userID");
	alert(userID + "으로 로그인 중입니다.");
}

function logoutFunction() {
	if (confirm("로그아웃 하시 겠습니까??") == true) { // 확인
		sessionStorage.removeItem("tokenID");
		sessionStorage.removeItem("userID");
		sessionStorage.removeItem("userRole");
		sessionStorage.removeItem("userPhone");

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
