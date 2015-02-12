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
	var userToken = sessionStorage.getItem("token");
	if (formCheck) {

		console.log('폼체크 성공');

		var id_input = $('#add-id-input').val();
		var password_input = $('#add-password-input').val();
		var name_input = $('#add-name-input').val();
		var role_select = $("#add-role-select option:selected").val();
		var roleValue = "";
		var message_count_input = $('#add-user-message-input').val();
		var ip_filter_input = $('#add-ipfilter-input').val();
		role_select = role_select * 1;
		switch (role_select) {
		case 1:
			roleValue = "sys";
			break;
		case 2:
			roleValue = "svc";
			break;
		case 3:
			roleValue = "svcadm";
			break;
		case 4:
			roleValue = "inf";
			break;
		}

		var userAdd = new Object();
		userAdd.userId = id_input;
		userAdd.password = password_input;
		userAdd.userName = name_input;
		userAdd.msgCntLimit = message_count_input;
		userAdd.role = roleValue;
		userAdd.ipFilters = ip_filter_input;
		var userAddReq = JSON.stringify(userAdd);
		console.log(userAddReq);

		$.ajax({
			url : '/pms/adm/sys/users/',
			type : 'POST',
			contentType : "application/json",
			headers : {
				'X-Application-Token' : userToken
			},
			dataType : 'json',
			data : userAddReq,

			async : false,
			success : function(data) {
				console.log("ajax data!!!!!");
				console.log(data);
				console.log("ajax data!!!!!");

				console.log('login in ajax call success');
				var loginResult = data.result.data;

				if (loginResult) {
					if (!data.result.errors) {
						console.log(loginResult);
						alert(data.result.data.userId + "를 생성 하였습니다.");
						wrapperFunction('userAdd');
					} else {

						alert(data.result.errors[0]);
						wrapperFunction('userAdd');
					}
				} else {

					alert('계정 등록에  실패하였습니다.');
					wrapperFunction('userAdd');
				}

			},
			error : function(data, textStatus, request) {

				alert('계정 등록에 실패하였습니다.');
				wrapperFunction('userAdd');
			}
		});
	}

}

// form null check
function userAddFormCheck() {
	var id_input = $('#add-id-input').val();
	var password_input = $('#add-password-input').val();
	var name_input = $('#add-name-input').val();
	var role_select = $("#add-role-select option:selected").val();
	var message_count_input = $('#add-user-message-input').val();
	var ip_filter_input = $('#add-ipfilter-input').val();
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

	if (ip_filter_input == null || ip_filter_input == "") {
		alert('IP 를 입력해 주세요');
		$('#add-ipfilter-input').focus();
		return false;
	}

	if (role_select == 0) {
		alert('권한을 선택해 주세요');
		return false;
	} else if (role_select == 2) {

		if (message_count_input == null || message_count_input == "") {
			alert('메시지 전송 제한건수를 입력해주세요');
			$('#add-user-message-input').focus();
			return false;
		} else {
			var num_check = /^[0-9]*$/;
			if (!num_check.test(message_count_input)) {
				alert('숫자를 입력해 주세요');
				$('#add-user-message-input').focus();
				return false;
			}
		}

	}
	return true;
}