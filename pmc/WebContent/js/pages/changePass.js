//changePassword
function changePassword() {
	var checkForm = changePassFormCheck();
	if (checkForm) {
		if (confirm("비밀 번호를 변경 하시겠습니까?") == true) {
			var tokenId = sessionStorage.getItem("token");
			var role = sessionStorage.getItem("role");
			var input_changePassword = $('#change-currentpass-input').val();
			var input_newPassWord = $('#change-newpass-input').val();
			var input_newPassWordConfirm = $('#change-confirmpass-input').val();
			var urlReq = "";
			if (role == "sys") {
				urlReq = "/v1/pms/adm/sys";
			} else if (role == "svcadm") {
				urlReq = "/v1/pms/adm/svcadm";
			} else if (role == "svc") {
				urlReq = "/v1/pms/adm/svc";
			}

			var changePass = new Object();
			changePass.oldPassword = input_changePassword;
			changePass.newPassword = input_newPassWord;
			changePass.rePassword = input_newPassWordConfirm;

			var changePassReq = JSON.stringify(changePass);

			$.ajax({
				url : urlReq + '/account/sec',
				type : 'PUT',
				headers : {
					'X-Application-Token' : tokenId
				},
				contentType : "application/json",
				dataType : 'json',
				data : changePassReq,
				async : false,


				success : function(data) {
					dataInfo=data.result.info;
					if (dataInfo) {
						alert('비밀 번호를 변경하였습니다');
						var daddy = window.self;
						daddy.opener = window.self;
						daddy.close();

					} else {
						if (data.result.errors[0] == "패스워드 변경 실패2") {
							alert('기존 비밀 번호가 맞지 않습니다');
						} else if (data.result.errors[0] == "패스워드 변경 실패1") {
							alert('새로운 비밀번호와 재입력한 번호가 일치 하지 안습니다');
						}

					}
				},
				error : function(data, textStatus, request) {
					alert('비밀변호 변경에 실패하였습니다.');

				}
			});
			
		}else{
			return
		}


	}

}

//formCheck
function changePassFormCheck() {

	var input_changePassword = $('#change-currentpass-input').val();
	var input_newPassWord = $('#change-newpass-input').val();
	var input_confirmPassWord = $('#change-confirmpass-input').val();

	if (input_changePassword == null || input_changePassword == "") {
		alert("기존  비밀번호를 입력해주세요");
		$('#change-currentpass-input').focus();
		return false;
	}
	if (input_newPassWord == null || input_newPassWord == "") {
		alert("새로운  비밀번호를 입력해주세요");
		$('#change-newpass-input').focus();
		return false;
	} else {
		if (input_newPassWord.length < 8 || input_newPassWord.length > 20) {
			alert('패스워드는 8자 에서 20자이하로 입력하세요');
			$('#change-newpass-input').focus();
			return false;
		}

	}

	if (input_confirmPassWord == null || input_confirmPassWord == "") {
		alert("새로운  비밀번호를 재 입력해주세요");
		$('#change-confirmpass-input').focus();
		return false;
	}

	if (input_newPassWord !== input_confirmPassWord) {
		alert("입력하신 비밀번호와 재입력한 비밀번호가 같지 않습니다");
		$('#change-newpass-input').val("");
		$('#change-confirmpass-input').val("");
		$('#change-newpass-input').focus();
		return false;
	}

	else {
		return true;
	}

}
