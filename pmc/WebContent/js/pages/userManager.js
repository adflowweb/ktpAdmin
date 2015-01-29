$("#user-password-input").prop('disabled', true);
$("#user-id-input").prop('disabled', true);
//한글체크
///[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
//	var num_check = /^[0-9]*$/;숫자 체크
$('#user-role-select').change(function() {
	var selectValue = $("#user-role-select option:selected").val();
	if (selectValue == 2) {
		$('#user-messagecount-div').show();
	} else {
		$('#user-messagecount-div').hide();
	}
});

function deleteAdminFunction() {
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
