//hangePassword
//=====
// - ** 암호 변경 **
//> **request : ** 
//*method : PUT
//header : X-ApiKey:{tokenID}
//uri : /v1/changePassword
//body : {"userID":"testuser", "password":"passwd"}*
//>
//> **response : **
//*{"result":{"success":true,"info":["updates=1"]}}*

function changePassFunction() {

	console.log('message send click..');
	var checkForm = individualFormCheck();
	if (checkForm) {
		var tokenID = sessionStorage.getItem("tokenID");

		if (tokenID) {
			loginUserId = sessionStorage.getItem("userID");
			console.log(loginUserId);
			var input_changeUserId = $('#input_changeUserId').val();
			var input_changePassword = $('#input_changePassword').val();
			var input_changePasswordR = $('#input_changePasswordR').val();
			var input_changePasswordRR = $('#input_changePasswordRR').val();
			
			$.ajax({
				url : '/v1/users/' + input_changeUserId,
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
							if (input_changePassword === data.result.data.password) {
								console.log(data.result.data.password);
								data.result.data.password=input_changePasswordR;
								console.log(data.result.data.password);
								$.ajax({
									url : '/v1/changePassword',
									type : 'PUT',
									headers : {
										'X-ApiKey' : tokenID
									},
									contentType : "application/json",
									dataType : 'json',
									async : false,
									data:JSON.stringify(data.result.data),
									success : function(data) {
										console.log(data);
										console.log(data.result.success);
										if (data.result.success) {
											if (data.result.info) {
												alert('비밀변호를 변경하였습니다.');
												wrapperFunction('changePass');

											}else{
												alert('비밀변호 변경에 실패하였습니다.');
												wrapperFunction('changePass');
											} 
										
										} else {
											alert('비밀변호 변경에 실패하였습니다.');
											wrapperFunction('changePass');
											
										}
									},
									error : function(data, textStatus, request) {
										alert("관리자 등록에 실패 하였습니다.");
										wrapperFunction('changePass');
										console.log(data);
									}
								});
								
							}else{
								
								alert('기존 아이디와 비밀번호가 일지 하지 않습니다.');
							}

						}else{
							alert('비밀변호 변경에 실패하였습니다.');
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
	var input_changeUserId = $('#input_changeUserId').val();
	var input_changePassword = $('#input_changePassword').val();
	var input_changePasswordR = $('#input_changePasswordR').val();
	var input_changePasswordRR = $('#input_changePasswordRR').val();

	if (input_changeUserId == null || input_changeUserId == "") {
		alert("기존 관리자 아이디를 입력해주세요");
		$('#input_changeUserId').focus();
		return false;
	} else if (input_changePassword == null || input_changePassword == "") {
		alert("기존 관리자 비밀번호를 입력해주세요");
		$('#input_changePassword').focus();
		return false;
	} else if (input_changePasswordR == null || input_changePasswordR == "") {
		alert("새로운 관리자 비밀번호를 입력해주세요");
		$('#input_changePasswordR').focus();
		return false;
	} else if (input_changePasswordRR == null || input_changePasswordRR == "") {
		alert("새로운 관리자 비밀번호를 재 입력해주세요");
		$('#input_changePasswordRR').focus();
		return false;
	} else if (input_changePasswordR !== input_changePasswordRR) {
		alert("입력하신 비밀번호와 재입력한 비밀번호가 같지 않습니다");
		$('#input_changePasswordR').val("");
		$('#input_changePasswordRR').val("");
		$('#input_changePasswordR').focus();
		return false;
	}

	else {
		return true;
	}

}