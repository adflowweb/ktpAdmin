function changePassword() {
	console.log('비밀번호 병경');

	var checkForm = changePassFormCheck();
	if (checkForm) {
		var tokenID = sessionStorage.getItem("tokenID");

		if (tokenID) {
			loginUserId = sessionStorage.getItem("userID");
			console.log(loginUserId);
			var input_changePassword = $('#change-currentpass-input').val();
			var input_newPassWord = $('#change-newpass-input').val();

			$
					.ajax({
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
										data.result.data.password = input_newPassWord;
										console.log(data.result.data.password);
										$
												.ajax({
													url : '/v1/changePassword',
													type : 'PUT',
													headers : {
														'X-ApiKey' : tokenID
													},
													contentType : "application/json",
													dataType : 'json',
													async : false,
													data : JSON
															.stringify(data.result.data),
													success : function(data) {
														console.log(data);
														console
																.log(data.result.success);
														if (data.result.success) {
															if (data.result.info) {
																alert('비밀변호를 변경하였습니다.');
																window.open('', '_self').close();
															} else {
																alert('비밀변호 변경에 실패하였습니다.');

															}

														} else {
															alert('비밀변호 변경에 실패하였습니다.');

														}
													},
													error : function(data,
															textStatus, request) {
														alert("관리자 등록에 실패 하였습니다.");
														wrapperFunction('changePass');
														console.log(data);
													}
												});

									} else {

										alert('기존 아이디와 비밀번호가 일지 하지 않습니다.');
									}

								} else {
									alert('비밀변호 변경에 실패하였습니다.');
								}

							} else {
								alert('비밀변호 변경에 실패하였습니다.');

							}
						},
						error : function(data, textStatus, request) {
							alert('비밀변호 변경에 실패하였습니다.');

						}
					});

		}
	}

	
}

// form null check
function changePassFormCheck() {

	var input_changePassword = $('#change-currentpass-input').val();
	var input_newPassWord = $('#change-newpass-input').val();
	var input_confirmPassWord = $('#change-confirmpass-input').val();

	if (input_changePassword == null || input_changePassword == "") {
		alert("기존  비밀번호를 입력해주세요");
		$('#change-currentpass-input').focus();
		return false;
	} else if (input_newPassWord == null || input_newPassWord == "") {
		alert("새로운  비밀번호를 입력해주세요");
		$('#change-newpass-input').focus();
		return false;
	} else if (input_confirmPassWord == null || input_confirmPassWord == "") {
		alert("새로운  비밀번호를 재 입력해주세요");
		$('#change-confirmpass-input').focus();
		return false;
	} else if (input_newPassWord !== input_confirmPassWord) {
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
