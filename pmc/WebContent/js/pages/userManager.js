//get adm/sys/users
var userToken = sessionStorage.getItem("token");
$.ajax({
	url : '/adm/sys/users',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : userToken
	},
	dataType : 'json',
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
	async : false,
	success : function(data) {
		console.log("ajax data!!!!!");
		console.log(data);
		console.log("ajax data!!!!!");

		console.log('login in ajax call success');
		var loginResult = data.result.data;

		if (loginResult) {
			if (!data.result.errors) {
				var tableData = [];

				for ( var i in data.result.data) {
					var successData = data.result.data[i];
					console.log(successData);
					if (successData.role == "svc") {
						successData.role = "서비스";
					} else if (successData.role == "inf") {
						successData.role = "서비스(내부)";
					} else if (successData.role = "sys") {
						successData.role = "관리자";
					}
					tableData.push({
						"userId" : successData.userId,
						"Name" : successData.userName,
						"role" : successData.role,
						"msgCnt" : successData.msgCntLimitDay
					});

				}

				$('#dataTables-usermanager').dataTable({
					bJQueryUI : true,
					bDestroy : true,
					aaData : tableData,
					aoColumns : [ {
						mData : 'userId'
					}, {
						mData : 'Name'
					}, {
						mData : 'role'
					}, {
						mData : 'msgCnt'
					} ]
				});

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

$("#user-id-input").prop('disabled', true);
// 한글체크
// /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
// var num_check = /^[0-9]*$/;숫자 체크
$('#user-role-select').change(function() {
	var selectValue = $("#user-role-select option:selected").val();
	if (selectValue == 2) {
		$('#user-messagecount-div').show();
	} else {
		$('#user-messagecount-div').hide();
	}
});

$('#dataTables-usermanager tbody').on('click', 'tr', function() {

	var tableData = $(this).children("td").map(function() {
		return $(this).text();
	}).get();

	console.log(tableData[0]);
	console.log(tableData[1]);
	console.log(tableData[2]);
	$('#user-id-input').val(tableData[0]);
	$('#user-name-input').val(tableData[1]);

	if (tableData[2] == "관리자") {
		$("#user-role-select option:eq(1)").attr("selected", "selected");
		$('#user-messagecount-div').hide();
	} else if (tableData[2] == "서비스") {
		$("#user-role-select option:eq(2)").attr("selected", "selected");
		$('#user-messagecount-div').show();
		$('#user-message-input').val(tableData[3]);
	} else if (tableData[2] == "서비스(내부)") {
		$("#user-role-select option:eq(3)").attr("selected", "selected");
		$('#user-messagecount-div').hide();
	}

});

function userUpdateFunction() {
	console.log("delelte...admin");
	var checkForm = individualFormCheck();
	if (checkForm) {
		var tokenID = sessionStorage.getItem("tokenID");

		if (tokenID) {
			loginUserId = sessionStorage.getItem("userID");
			console.log(loginUserId);
			var input_adminID = $('#input_adminID').val();

			$.ajax({
				url : '/v1/users/' + input_adminID,
				type : 'DELETE',
				headers : {
					'X-ApiKey' : tokenID
				},
				contentType : "application/json",
				dataType : 'json',
				async : false,

				success : function(data) {
					console.log(data);
					console.log(data.result.success);
					if (data.result.info) {

						alert("관리자를 삭제  하였습니다.");
						wrapperFunction('userManager');
					} else {
						alert("관리자를 삭제에 실패  하였습니다.");
						wrapperFunction('userManager');
					}
				},
				error : function(data, textStatus, request) {
					alert("관리자를 삭제에 실패  하였습니다.");
					$('#input_adminID').val("");

					$('#input_adminID').focus();
					console.log(data);
				}
			});
		}
	}
}

function userDeleteFunction() {
	console.log("delelte...admin");
	var checkForm = individualFormCheck();
	if (checkForm) {
		var tokenID = sessionStorage.getItem("tokenID");

		if (tokenID) {
			loginUserId = sessionStorage.getItem("userID");
			console.log(loginUserId);
			var input_adminID = $('#input_adminID').val();

			$.ajax({
				url : '/v1/users/' + input_adminID,
				type : 'DELETE',
				headers : {
					'X-ApiKey' : tokenID
				},
				contentType : "application/json",
				dataType : 'json',
				async : false,

				success : function(data) {
					console.log(data);
					console.log(data.result.success);
					if (data.result.info) {

						alert("관리자를 삭제  하였습니다.");
						wrapperFunction('userManager');
					} else {
						alert("관리자를 삭제에 실패  하였습니다.");
						wrapperFunction('userManager');
					}
				},
				error : function(data, textStatus, request) {
					alert("관리자를 삭제에 실패  하였습니다.");
					$('#input_adminID').val("");

					$('#input_adminID').focus();
					console.log(data);
				}
			});
		}
	}
}

// form null check
function individualFormCheck() {
	var input_userID = $('#input_adminID').val();

	if (input_userID == null || input_userID == "") {
		alert("관리자 아이디를 입력해주세요");
		$('#input_adminID').focus();
		return false;
	}
	return true;

}
