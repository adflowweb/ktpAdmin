//	var num_check = /^[0-9]*$/;
$('#add-role-select').change(function() {
	var selectValue = $("#add-role-select option:selected").val();
	if (selectValue == 2) {
		$('#add-messagecount-div').show();
	} else {
		$('#add-messagecount-div').hide();
	}
});

function userAddFunction() {
	console.log('계정 들록');

	var formCheck = userAddFormCheck();

	if (formCheck) {
		console.log('폼체크 성공');
	}

}

// form null check
function userAddFormCheck() {
	var id_input = $('#add-id-input').val();
	var password_input = $('#add-password-input').val();
	var name_input = $('#add-name-input').val();
	var role_select = $("#add-role-select option:selected").val();
	var message_count_input = $('#user-message-input').val();
	if (id_input == null || id_input == "") {
		alert('아이디를  입력해 주세요');
		$('#add-id-input').focus();
		return false;
	} else {
		console.log('id');
		console.log(id_input.length);
		if (id_input.length < 4 || id_input.length > 20) {
			alert('아이디는 4자 에서 20자이하로 입력하세요');
			$('#add-id-input').focus();
			return false;
		}

	}

	if (password_input == null || password_input == "") {
		alert('패스워드를  입력해 주세요');
		$('#add-password-input').focus();
		return false;
	} else {
		console.log('pass');
		console.log(password_input.length);
		if (password_input.length < 8 || password_input.length > 20) {
			alert('패스워드는 8자 에서 20자이하로 입력하세요');
			$('#add-password-input').focus();
			return false;
		}

	}

	if (name_input == null || name_input == "") {
		alert('이름를  입력해 주세요');
		$('#add-name-input').focus();
		return false;
	}

	if (role_select == 0) {
		alert('권한을 선택해 주세요');
		return false;
	} else if (role_select == 2) {

		if (message_count_input == null || message_count_input == "") {
			alert('메시지 전송 제한건수를 입력해주세요');
			$('#user-message-input').focus();
			return false;
		} else {
			var num_check = /^[0-9]*$/;
			if (!num_check.test(message_count_input)) {
				alert('숫자를 입력해 주세요');
				$('#user-message-input').focus();
				return false;
			}
		}

	}
	return true;
}