function userAddFunction() {
	console.log('message send click..');
	var checkForm = individualFormCheck();
	if (checkForm) {
		var tokenID = sessionStorage.getItem("tokenID");

		if (tokenID) {
			loginUserId = sessionStorage.getItem("userID");
			console.log(loginUserId);
			var input_userID = $('#input_userID').val();
			var input_userName = $('#input_userName').val();
			var input_userPass = $('#input_userPass').val();
			var input_userDept = $('#input_userDept').val();
			var input_userPhone = $('#input_userPhone').val();
			$.ajax({
				url : '/v1/users/' + input_userID,
				type : 'GET',
				headers : {
					'X-ApiKey' : tokenID
				},
				contentType : "application/json",
				dataType : 'json',
				async : false,

				success : function(data) {
					console.log(data);
					console.log(data.result.success);
					if (data.result.success) {
						if (data.result.data) {
							if (input_userID === data.result.data.userID) {

								alert('이미 등록된 유저 아이디 입니다.');
								return;
							}

						} else {
							var updateJson = '{"userID":"' + input_userID
									+ '","password":"' + input_userPass
									+ '","name":"' + input_userName
									+ '","dept":"' + input_userDept
									+ '","phone":"' + input_userPhone
									+ '","role":"admin"}';

							$.ajax({
								url : '/v1/users?type=admin',
								type : 'POST',
								headers : {
									'X-ApiKey' : tokenID
								},
								contentType : "application/json",
								dataType : 'json',
								async : false,
								data : updateJson,
								success : function(data) {
									console.log('success');
									console.log(data.result);
									if (data.result.info) {
										alert('관리자로 등록 되었습니다.');

									} else {
										alert('관리자 등록에 실패 하였습니다.');
									}
								},
								error : function(data) {
									console.log('fail');
								}
							});
						}
						console.log('get user info');
						$('#input_userID').val("");

						$('#input_userID').focus();
					} else {
						alert("server errors");
						$('#input_userID').val("");

						$('#input_userID').focus();
					}
				},
				error : function(data, textStatus, request) {
					alert("관리자 등록에 실패 하였습니다.");
					$('#input_userID').val("");

					$('#input_userID').focus();
					console.log(data);
				}
			});
		}
	}
}

// form null check
function individualFormCheck() {

	var input_userID = $('#input_userID').val();
	var input_userName = $('#input_userName').val();
	var input_userPass = $('#input_userPass').val();
	var input_userDept = $('#input_userDept').val();
	var input_userPhone = $('#input_userPhone').val();

	if (input_userID == null || input_userID == "") {
		alert("관리자 아이디를 입력해주세요");
		$('#input_userID').focus();
		return false;
	}
	if (input_userName == null || input_userName == "") {
		alert("관리자 이름를 입력해주세요");
		$('#input_userName').focus();
		return false;
	}
	if (input_userPass == null || input_userPass == "") {
		alert("관리자 비밀번호를 입력해주세요");
		$('#input_userPass').focus();
		return false;
	}
	if (input_userDept == null || input_userDept == "") {
		alert("관리자 부서를 입력해주세요");
		$('#input_userDept').focus();
		return false;
	}
	if (input_userPhone == null || input_userPhone == "") {
		alert("관리자 전화번호를 입력해주세요");
		$('#input_userPhone').focus();
		return false;
	}

	return true;

}