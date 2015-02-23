var userToken = sessionStorage.getItem("token");
$.ajax({
	url : '/v1/pms/adm/sys/users',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : userToken
	},
	dataType : 'json',

	async : false,
	success : function(data) {
		var dataResult = data.result.data;
		if (dataResult) {
			console.log(dataResult);
			console.log('/v1/pms/adm/sys/users(GET)');
			if (!data.result.errors) {
				var tableData = [];

				for ( var i in data.result.data) {
					var successData = data.result.data[i];
					console.log(successData);
					if (successData.role == "svc") {
						successData.role = "서비스";
					} else if (successData.role == "inf") {
						successData.role = "Interface Open";
					} else if (successData.role == "sys") {
						successData.role = "관리자";
					} else if (successData.role == "svcadm") {
						successData.role = "서비스 어드민";
					}
					tableData.push({
						"userId" : successData.userId,
						"Name" : successData.userName,
						"IPFilter" : successData.ipFilters,
						"role" : successData.role,
						"msgCnt" : successData.msgCntLimit
					});

				}

				$('#dataTables-usermanager').dataTable({
					bJQueryUI : true,
					bDestroy : true,
					aaData : tableData,
					bScrollCollapse :true,
					scrollX: true,
					autoWidth : false,
					'bSort' : false,
					aoColumns : [ {
						mData : 'userId'
					}, {
						mData : 'Name'
					}, {
						mData : 'IPFilter'
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

	$('#user-id-input').val(tableData[0]);
	$('#user-name-input').val(tableData[1]);
	$('#user-ipfilter-input').val(tableData[2]);

	if (tableData[3] == "관리자") {
		$("#user-role-select option:eq(1)").attr("selected", "selected");
		$('#user-messagecount-div').hide();
	} else if (tableData[3] == "서비스") {
		$("#user-role-select option:eq(2)").attr("selected", "selected");
		$('#user-messagecount-div').show();
		$('#user-message-input').val(tableData[4]);
	} else if (tableData[3] == "Interface Open") {
		$("#user-role-select option:eq(4)").attr("selected", "selected");
		$('#user-messagecount-div').hide();
	} else if (tableData[3] == "서비스 어드민") {
		$("#user-role-select option:eq(3)").attr("selected", "selected");
		$('#user-messagecount-div').hide();
	}

});

function userUpdateFunction() {
	console.log("update...admin");
	var checkForm = userUpdataFormCheck();
	if (checkForm) {
		if (confirm("계정 정보를 변경 하시겠습니까?") == true) {
			var id_input = $('#user-id-input').val();
			var name_input = $('#user-name-input').val();
			var ip_filter_input = $('#user-ipfilter-input').val();

			var role_select = $("#user-role-select option:selected").val();

			var roleValue = "";
			var message_count_input = $('#user-message-input').val();
			role_select = role_select * 1;
			switch (role_select) {
			case 1:
				console.log("sys");
				roleValue = "sys";
				break;
			case 2:
				console.log("svc");
				roleValue = "svc";
				break;
			case 3:
				console.log("svcadm");
				roleValue = "svcadm";
				break;
			case 4:
				console.log("inf");
				roleValue = "inf";
				break;
			}

			var userChange = new Object();
			userChange.userName = name_input;
			userChange.msgCntLimit = message_count_input;
			userChange.role = roleValue;
			userChange.ipFilters = ip_filter_input;
			var userChangeReq = JSON.stringify(userChange);
			console.log(userChangeReq);

			$.ajax({
				url : '/v1/pms/adm/sys/users/' + id_input,
				type : 'PUT',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : userToken
				},
				dataType : 'json',
				data : userChangeReq,

				async : false,
				success : function(data) {
					console.log("Ajax Data:" + data.result);
					var dataResult = data.result.data;

					if (dataResult) {
						if (!data.result.errors) {
							console.log('/v1/pms/adm/sys/users/' + id_input
									+ '(PUT)');
							console.log(dataResult);
							alert('걔정 정보를 변경 하였습니다.');
							wrapperFunction('userManager');
						} else {

							alert(data.result.errors[0]);
							wrapperFunction('userManager');
						}
					} else {

						alert('계정 변경에  실패하였습니다.');
						wrapperFunction('userManager');
					}

				},
				error : function(data, textStatus, request) {

					alert('계정 변경에 실패하였습니다.');
					wrapperFunction('userManager');
				}
			});
		} else {
			return;
		}

	}
}

function userDeleteFunction() {
	console.log("update...admin");
	var checkForm = userDeleteFormCheck();
	if (checkForm) {
		var id_input = $('#user-id-input').val();
		if (confirm("계정 정보를 삭제 하시겠습니까?") == true) { // 확인
			$.ajax({
				url : '/v1/pms/adm/sys/users/' + id_input,
				type : 'DELETE',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : userToken
				},
				dataType : 'json',

				async : false,
				success : function(data) {
					var dataResult = data.result.data;

					if (dataResult) {
						if (!data.result.errors) {
							console.log('/v1/pms/adm/sys/users/' + id_input
									+ '(DELETE)');
							console.log(dataResult);
							alert('계정 정보를 삭제 하였습니다.');
							wrapperFunction('userManager');
						} else {

							alert(data.result.errors[0]);
							wrapperFunction('userManager');
						}
					} else {

						alert('계정 삭제에  실패하였습니다.');
						wrapperFunction('userManager');
					}

				},
				error : function(data, textStatus, request) {

					alert('계정 삭제에 실패하였습니다.');
					wrapperFunction('userManager');
				}
			});

		} else {
			return;
		}

	}
}

function userDeleteFormCheck() {
	var id_input = $('#user-id-input').val();

	if (id_input == null || id_input == "") {
		alert('아이디를  입력해 주세요');
		$('#user-id-input').focus();
		return false;
	}

	return true;

}

// form null check
function userUpdataFormCheck() {

	var id_input = $('#user-id-input').val();
	var name_input = $('#user-name-input').val();
	var role_select = $("#user-role-select option:selected").val();
	var message_count_input = $('#user-message-input').val();
	var ip_filter_input = $('#user-ipfilter-input').val();
	if (id_input == null || id_input == "") {
		alert('아이디를  입력해 주세요');
		$('#user-id-input').focus();
		return false;
	} else {
		console.log('id');
		console.log(id_input.length);
		if (id_input.length < 4 || id_input.length > 20) {
			alert('아이디는 4자 에서 20자이하로 입력하세요');
			$('#user-id-input').focus();
			return false;
		}

	}

	if (name_input == null || name_input == "") {
		alert('이름를  입력해 주세요');
		$('#user-name-input').focus();
		return false;
	}

	if (ip_filter_input == null || ip_filter_input == "") {
		alert('IP 를 입력해 주세요');
		$('#user-ipfilter-input').focus();
		return false;
	} else {
		ip_filter_input = ip_filter_input.split('/');

		var ipCheck = /^([1]\d\d|[2][0-5][0-5]|[1-9][0-9]|[0-9]|[\*]){1}(\.([1]\d\d|[2][0-5][0-5]|[1-9][0-9]|[0-9]|[\*])){3}$/;
		var ipCheckAlert = false;
		for ( var i in ip_filter_input) {
			if (!ipCheck.test(ip_filter_input[i])) {
				ipCheckAlert = true;
			}
		}
		if (ipCheckAlert) {
			alert('올바른 IP 형식이 아닙니다.');
			$('#user-ipfilter-input').focus();
			return false;
		}
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
