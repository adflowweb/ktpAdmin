//getToken
var userToken = sessionStorage.getItem("token");
var userManagertableData = [];
$("#user-id-input").prop('disabled', true);
$("#user-name-input").prop('disabled', true);
$("#user-ipfilter-input").prop('disabled', true);
$("#user-role-select").prop('disabled', true);
$("#user-message-input").prop('disabled', true);
$("#user-option-callback-cntlimit-input").prop('disabled', true);
$("#user-option-callback-method-input").prop('disabled', true);
$("#user-option-callback-url-input").prop('disabled', true);
$("#user-option-qos-select").prop('disabled', true);
$("#user-option-expiry-input").prop('disabled', true);
$('#user-option-msgsizelimit-input').prop('disabled', true);
$("#user-account-div").hide();
$("#user-option-div").hide();
$("#user-account-input").hide();
$("#user-option-input").hide();

// inputChange Check
$('#user-account-input').change(function() {

	if ($(this).is(":checked")) {

		$("#user-name-input").prop('disabled', false);
		$("#user-ipfilter-input").prop('disabled', false);
		$("#user-role-select").prop('disabled', false);
		$("#user-message-input").prop('disabled', false);
		$("#user-account-div").show();
	} else {

		$("#user-name-input").prop('disabled', true);
		$("#user-ipfilter-input").prop('disabled', true);
		$("#user-role-select").prop('disabled', true);
		$("#user-message-input").prop('disabled', true);
		$("#user-account-div").hide();
	}

});

// inputChange Check
$('#user-option-input').change(function() {

	if ($(this).is(":checked")) {

		$("#user-option-callback-cntlimit-input").prop('disabled', false);
		$("#user-option-callback-method-input").prop('disabled', false);
		$("#user-option-callback-url-input").prop('disabled', false);
		$("#user-option-qos-select").prop('disabled', false);
		$("#user-option-expiry-input").prop('disabled', false);
		$('#user-option-msgsizelimit-input').prop('disabled', false);
		$("#user-option-div").show();
	} else {
		$("#user-option-callback-cntlimit-input").prop('disabled', true);
		$("#user-option-callback-method-input").prop('disabled', true);
		$("#user-option-callback-url-input").prop('disabled', true);
		$("#user-option-qos-select").prop('disabled', true);
		$("#user-option-expiry-input").prop('disabled', true);
		$('#user-option-msgsizelimit-input').prop('disabled', true);
		$("#user-option-div").hide();
	}

});
// getAccount Info
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

		if (!data.result.errors) {
			var dataResult = data.result.data;

			for ( var i in data.result.data) {
				var successData = data.result.data[i];

				if (successData.role == "svc") {
					successData.role = "서비스";
				} else if (successData.role == "inf") {
					successData.role = "Interface Open";
				} else if (successData.role == "sys") {
					successData.role = "관리자";
				} else if (successData.role == "svcadm") {
					successData.role = "서비스 어드민";
				}

				if (successData.msgCntLimit == "-1") {
					successData.msgCntLimit = "제한없음";
				}
				userManagertableData.push({
					"userId" : successData.userId,
					"Name" : successData.userName,
					"IPFilter" : successData.ipFilters,
					"role" : successData.role,
					"msgCnt" : successData.msgCntLimit,
					"callbackCntLimit" : successData.callbackCntLimit,
					"callbackMethod" : successData.callbackMethod,
					"callbackUrl" : successData.callbackUrl,
					"defaultExpiry" : successData.defaultExpiry,
					"defaultQos" : successData.defaultQos,
					"msgSizeLimit" : successData.msgSizeLimit,
					"applicationKey" : successData.applicationToken
				});

			}

			$('#dataTables-usermanager').dataTable({
				bJQueryUI : true,
				bDestroy : true,
				aaData : userManagertableData,
				bScrollCollapse : true,
				scrollX : true,
				"pageLength" : 25,
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
				}, {
					mData : 'applicationKey'
				} ]
			});

		} else {

			alert('계정 목록을 가지고오는데 실패하였습니다.');
		}

	},
	error : function(data, textStatus, request) {

		alert('계정 목록을 가지고오는데 실패하였습니다.');
	}
});
// selectChange Check
$('#user-role-select').change(function() {
	var selectValue = $("#user-role-select option:selected").val();
	if (selectValue == 2) {
		$('#user-messagecount-div').show();
	} else {
		$('#user-messagecount-div').hide();
	}
});

// tableClick
$('#dataTables-usermanager tbody')
		.on(
				'click',
				'tr',
				function() {
					$("#user-account-input").show();
					$("#user-option-input").show();

					var tableData = $(this).children("td").map(function() {
						return $(this).text();
					}).get();

					$('#user-id-input').val(tableData[0]);
					$('#user-name-input').val(tableData[1]);
					$('#user-ipfilter-input').val(tableData[2]);

					for ( var i in userManagertableData) {
						if (userManagertableData[i].userId == tableData[0]) {

							$('#user-option-callback-cntlimit-input').val(
									userManagertableData[i].callbackCntLimit);
							$('#user-option-callback-method-input').val(
									userManagertableData[i].callbackMethod);
							$('#user-option-callback-url-input').val(
									userManagertableData[i].callbackUrl);
							$('#user-option-expiry-input').val(
									userManagertableData[i].defaultExpiry);
							// msgSizeLimit
							$('#user-option-msgsizelimit-input')
									.val(
											getBytesWithUnit(userManagertableData[i].msgSizeLimit)
													+ "("
													+ userManagertableData[i].msgSizeLimit
													+ ")");

							userManagertableData[i].defaultQos = userManagertableData[i].defaultQos * 1;
							if (userManagertableData[i].defaultQos == 2) {

								$('#user-option-qos-select  option:eq(0)')
										.attr("selected", "selected");
							} else {
								$('#user-option-qos-select  option:eq(1)')
										.attr("selected", "selected");
							}
						}

					}

					if (tableData[3] == "관리자") {
						$("#user-role-select option:eq(1)").attr("selected",
								"selected");
						$('#user-messagecount-div').hide();
					} else if (tableData[3] == "서비스") {
						$("#user-role-select option:eq(2)").attr("selected",
								"selected");
						$('#user-messagecount-div').show();
						$('#user-message-input').val(tableData[4]);
					} else if (tableData[3] == "Interface Open") {
						$("#user-role-select option:eq(4)").attr("selected",
								"selected");
						$('#user-messagecount-div').hide();
					} else if (tableData[3] == "서비스 어드민") {
						$("#user-role-select option:eq(3)").attr("selected",
								"selected");
						$('#user-messagecount-div').hide();
					}

				});
// userUpdate
function userUpdateFunction() {

	var checkForm = userUpdateFormCheck();
	if (checkForm) {
		if (confirm("계정 정보를 변경 하시겠습니까?") == true) {
			var id_input = $('#user-id-input').val();
			var name_input = $('#user-name-input').val();
			var ip_filter_input = $('#user-ipfilter-input').val();

			var role_select = $("#user-role-select option:selected").val();

			var roleValue = "";
			var message_count_input = $('#user-message-input').val();
			role_select = role_select * 1;
			var userChange = new Object();
			switch (role_select) {
			case 1:

				roleValue = "sys";
				userChange.msgCntLimit = -1 * 1;
				break;
			case 2:

				roleValue = "svc";
				userChange.msgCntLimit = message_count_input;
				break;
			case 3:

				roleValue = "svcadm";
				userChange.msgCntLimit = -1 * 1;
				break;
			case 4:

				roleValue = "inf";
				userChange.msgCntLimit = -1 * 1;
				break;
			}

			userChange.userName = name_input;

			userChange.role = roleValue;
			userChange.ipFilters = ip_filter_input;
			var userChangeReq = JSON.stringify(userChange);

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

					if (!data.result.errors) {
						var dataResult = data.result.data;

						alert('걔정 정보를 변경 하였습니다.');
						wrapperFunction('userManager');
					} else {

						alert('계정 변경에 실패하였습니다.');
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
// userOptionUpdate
function userOptionUpdateFunction() {

	var checkForm = userOptionFormCheck();

	if (checkForm) {

		if (confirm("옵션값을 변경 하시겠습니까?") == true) {
			var id_input = $('#user-id-input').val();
			var option_expiry_input = $('#user-option-expiry-input').val();
			var option_callback_url_input = $('#user-option-callback-url-input')
					.val();
			var option_callback_method_input = $(
					'#user-option-callback-method-input').val();
			var option_callback_cntlimit_input = $(
					'#user-option-callback-cntlimit-input').val();

			var option_qos_select = $("#user-option-qos-select option:selected")
					.val();
			var option_msgSizeLimit_input = $('#user-option-msgsizelimit-input')
					.val();

			// bytesToSize
			option_qos_select = option_qos_select * 1;
			switch (option_qos_select) {
			case 0:
				option_qos_select = 1 * 1;

				break;
			case 1:

				option_qos_select = 2 * 1;
				break;

			}

			var userOption = new Object();

			userOption.defaultQos = option_qos_select;
			userOption.defaultExpiry = option_expiry_input;
			userOption.callbackUrl = option_callback_url_input;
			userOption.callbackMethod = option_callback_method_input;
			userOption.callbackCntLimit = option_callback_cntlimit_input;
			userOption.msgSizeLimit = option_msgSizeLimit_input;
			userOption.options = true;
			var userOptionReq = JSON.stringify(userOption);

			$.ajax({
				url : '/v1/pms/adm/sys/users/' + id_input,
				type : 'PUT',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : userToken
				},
				dataType : 'json',
				data : userOptionReq,

				async : false,
				success : function(data) {

					if (!data.result.errors) {

						var dataResult = data.result.data;

						alert('옵션 정보를 변경 하였습니다.');
						wrapperFunction('userManager');
					} else {
						alert('옵션 변경에 실패하였습니다.');
						wrapperFunction('userManager');
					}

				},
				error : function(data, textStatus, request) {

					alert('옵션 변경에 실패하였습니다.');
					wrapperFunction('userManager');
				}
			});
		} else {
			return;
		}

	}
}
// userDelete
function userDeleteFunction() {

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

					if (!data.result.errors) {
						var dataResult = data.result.data;

						alert('계정 정보를 삭제 하였습니다.');
						wrapperFunction('userManager');
					} else {

						alert('계정 삭제에 실패하였습니다.');
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
// formChekc
function userDeleteFormCheck() {
	var id_input = $('#user-id-input').val();

	if (id_input == null || id_input == "") {
		alert('아이디를  입력해 주세요');
		$('#user-id-input').focus();
		return false;
	}

	return true;

}

// formCheck
function userUpdateFormCheck() {

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
// formCheck
function userOptionFormCheck() {
	var option_expiry_input = $('#user-option-expiry-input').val();
	var option_callback_url_input = $('#user-option-callback-url-input').val();
	var option_callback_method_input = $('#user-option-callback-method-input')
			.val();
	var option_callback_cntlimit_input = $(
			'#user-option-callback-cntlimit-input').val();
	var option_msgSizeLimit_input = $('#user-option-msgsizelimit-input').val();

	if (option_expiry_input == null || option_expiry_input == "") {
		alert('메시지 소멸 시간을 입력해주세요');
		$('#user-option-expiry-input').focus();
		return false;
	} else {
		var num_check = /^[0-9]*$/;
		if (!num_check.test(option_expiry_input)) {
			alert('숫자를 입력해 주세요');
			$('#user-option-expiry-input').focus();
			return false;
		}
	}

	if (option_callback_cntlimit_input == null
			|| option_callback_cntlimit_input == "") {

	} else {
		var num_check = /^[0-9]*$/;
		if (!num_check.test(option_callback_cntlimit_input)) {
			alert('숫자를 입력해 주세요');
			$('#user-option-callback-cntlimit-input').focus();
			return false;
		}
	}

	if (option_msgSizeLimit_input == null || option_msgSizeLimit_input == "") {

	} else {
		var num_check = /^[0-9]*$/;
		if (!num_check.test(option_msgSizeLimit_input)) {
			alert('bytes 단위 숫자를 입력해 주세요');
			$('#user-option-msgsizelimit-input').focus();
			return false;
		} else {

			option_msgSizeLimit_input = option_msgSizeLimit_input * 1;

			if (option_msgSizeLimit_input > 512000) {
				alert('512000bytes 를 넘을수 없습니다.');
				return false;
			}
		}
	}
	// option_msgSizeLimit_input

	return true;

}

// function utf8ByteLength(str) {
// if (!str)
// return 0;
// var escapedStr = encodeURI(str);
// var match = escapedStr.match(/%/g);
// return match ? (escapedStr.length - match.length * 2) : escapedStr.length;
// }

/**
 * @function: getBytesWithUnit()
 * @purpose: Converts bytes to the most simplified unit.
 * @param: (number) bytes, the amount of bytes
 * @returns: (string)
 */
var getBytesWithUnit = function(bytes) {
	if (isNaN(bytes)) {
		return;
	}
	var units = [ ' bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB',
			' YB' ];
	var amountOf2s = Math.floor(Math.log(+bytes) / Math.log(2));
	if (amountOf2s < 1) {
		amountOf2s = 0;
	}
	var i = Math.floor(amountOf2s / 10);
	bytes = +bytes / Math.pow(2, 10 * i);

	// Rounds to 3 decimals places.
	if (bytes.toString().length > bytes.toFixed(3).toString().length) {
		bytes = bytes.toFixed(3);
	}
	return bytes + units[i];
};