//getToken
var userInfoToken = sessionStorage.getItem("token");
// getRole
var userInfoRole = sessionStorage.getItem("role");
// getAccount Info

$.ajax({
	url : '/v1/pms/adm/' + userInfoRole + '/account',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : userInfoToken
	},
	dataType : 'json',
	async : false,

	success : function(data) {
		console.log('성공');
		if (!data.result.errors) {
			var dataResult = data.result.data;
			console.log(dataResult);
			$('#userInfo-id-input').val(dataResult.userId);
		
			if (userInfoRole == "svc") {
				// $('#userInfo-name-div').hide();
				$('#userInfo-name-svc-div').show();
				$('#userInfo-name-div').hide();
				$('#userInfo-name-svc-input').val(dataResult.userName);
				$('#svc-user-name-update-btn').show();
				$('#userInfo-phone-input').val(dataResult.ufmi);
			} else {
				$('#userInfo-name-svc-div').hide();
				$('#userInfo-name-div').show();
				$('#userInfo-name-input').val(dataResult.userName);
				$('#svc-user-name-update-btn').hide();
				$('#userInfo-phone-div').hide();
			}

			// $('#userInfo-token-input').val(dataResult.applicationToken);

		} else {

			alert('계정 목록을 가지고오는데 실패하였습니다.');
		}

	},
	error : function(data, textStatus, request) {

		// alert('계정 목록을 가지고오는데 실패하였습니다.');
	}
});
// confirm
function userInfoConfirm() {
	if (userInfoRole == "svc") {
		var checkInput = $('#userInfo-name-svc-input').prop('disabled');
		if (checkInput == false) {
			var formCheck = userNameUpdatFormCheck();

			if (formCheck) {
				if (confirm("발송번호를 수정 하시겠습니까?") == true) {
					var userInfo_name_input = $('#userInfo-name-svc-input').val();

					var userNameUpdate = new Object();
					userNameUpdate.userName = userInfo_name_input;
					var userNameUpdateReq = JSON.stringify(userNameUpdate);

					$.ajax({
						url : '/v1/pms/adm/svc/users/name',
						type : 'PUT',
						contentType : "application/json",
						headers : {
							'X-Application-Token' : userInfoToken
						},
						dataType : 'json',
						data : userNameUpdateReq,

						async : false,
						success : function(data) {
							if (!data.result.errors) {
								alert('발송번호를 수정 하였습니다.');
								//console.log('이름 변경 성공');
								sessionStorage.setItem("userName",
										userInfo_name_input);

							} else {
								alert('발송번호 수정에 실패 하였습니다.');
								//console.log('이름 업데이트 실패');
							}

						},
						error : function(data, textStatus, request) {
							alert('발송번호 수정에 실패 하였습니다.');
							//console.log('이름 업데이트 실패');
						}
					});
				} else {
					return;
				}

			}
			var daddy = window.self;
			daddy.opener = window.self;
			daddy.close();
		}
		var daddy = window.self;
		daddy.opener = window.self;
		daddy.close();
	} else {
		var daddy = window.self;
		daddy.opener = window.self;
		daddy.close();
	}

}

function userInfoNameUpdate() {

	var checkInput = $('#userInfo-name-svc-input').prop('disabled');
	if (checkInput == true) {
		$('#userInfo-name-svc-input').prop('disabled', false);
	}else{
		$('#userInfo-name-svc-input').prop('disabled', true);
	}

}

function userNameUpdatFormCheck() {
	var first_info_name_input = $('#userInfo-name-svc-input').val();

	if (first_info_name_input == "" || first_info_name_input == null) {
		alert('발송번호를 입력해주세요');
		$('#userInfo-name-svc-input').focus();
		return false;
	}

	return true;

}
