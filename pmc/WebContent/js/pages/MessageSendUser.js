//messageSend

function repeatCheck() {
	var checkedLength = $('input[id="message-send-user-repeat-check"]:checked').length;
	if (checkedLength == 0) {
		// $("#messagelist-search-date-start-input").prop('disabled', true);
		$('#message-send-user-resendCount-input').prop('disabled', true);
		$('#message-send-user-resendInterval-input').prop('disabled', true);
		return false;
	} else {
		$('#message-send-user-resendCount-input').prop('disabled', false);
		$('#message-send-user-resendInterval-input').prop('disabled', false);

		return false;
	}
}

function MessageSendUserFunction() {

	var tokenID = sessionStorage.getItem("token");
	var role = sessionStorage.getItem("role");

	if (messageSendUserFormCheck()) {
		// var input_messageTarget = $('#message-send-user-target-input').val();
		var input_messageTarget = $('#message-send-user-target-show-input')
				.val();
		input_messageTarget = compactTrim(input_messageTarget);
		var input_messageContent = $('#message-send-user-textarea').val();
		input_messageContent = utf8_to_b64(input_messageContent);
		var input_reservation = $('#message-send-user-reservationdate-input')
				.val();
		var input_resendCount = $('#message-send-user-resendCount-input').val();
		var input_resendInterval = $('#message-send-user-resendInterval-input')
				.val();
		var dateResult = "";

		if (input_reservation != "") {

			dateResult = dateFormating(input_reservation);
			dateResult = dateResult.toISOString();
		}

		input_messageTarget = input_messageTarget.split(",");
		var messageData = new Object();

		messageData.receivers = input_messageTarget;
		messageData.content = input_messageContent;
		messageData.contentType = "application/base64";
		if (dateResult != "") {
			messageData.reservationTime = dateResult;

		}

		if (input_resendCount != "") {
			messageData.resendMaxCount = input_resendCount;
		}
		if (input_resendInterval != "") {
			messageData.resendInterval = input_resendInterval;
		}

		var contentLength = $('#message-send-length-strong').text();
		messageData.contentLength = contentLength;
		console.log('메시지 전송전 길이');
		console.log(messageData.contentLength);
		var messageDataResult = JSON.stringify(messageData);
		console.log(messageDataResult);

		console.log(messageData.receivers.length);

		var sendCount;
		if (messageData.resendMaxCount) {
			console.log('반복 있음');

			messageData.receivers.length = messageData.receivers.length * 1;
			messageData.resendMaxCount = messageData.resendMaxCount * 1;
			sendCount = (messageData.receivers.length * messageData.resendMaxCount)
					+ messageData.receivers.length

		} else {
			sendCount = messageData.receivers.length;

		}

		if (confirm(messageData.receivers + " 해당 무전번호로 총 " + sendCount
				+ "건의 메시지가 전송 됩니다. 전송 하시겠습니까?") == true) {

		} else {
			return false;
		}

		/*
		 * if (utf8ByteLength(messageDataResult) > 512000) {
		 * 
		 * alert('메시지 사이즈가 너무 큽니다.'); return false; }
		 */

		$
				.ajax({
					url : '/v1/pms/adm/' + role + '/messages',
					type : 'POST',
					headers : {
						'X-Application-Token' : tokenID
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : messageDataResult,

					success : function(data) {

						if (!data.result.errors) {
							var dataResult = data.result.data;

							if (messageData.resendMaxCount) {
								console.log('반복 있음');
								var asendCount;
								messageData.receivers.length = messageData.receivers.length * 1;
								messageData.resendMaxCount = messageData.resendMaxCount * 1;
								asendCount = (messageData.receivers.length * messageData.resendMaxCount)
										+ messageData.receivers.length

								alert('총' + asendCount + '건의 메시지를 발송하였습니다.');
							} else {
								alert('총' + messageData.receivers.length
										+ '건의 메시지를 발송하였습니다.');
							}

							wrapperFunction('MessageSendUser');
						} else {
							alert('메시지 전송에 실패 하였습니다.');

							wrapperFunction('MessageSendUser');
						}

					},
					error : function(data, textStatus, request) {
						alert('메시지 전송에 실패 하였습니다.');
						wrapperFunction('MessageSendUser');
					}
				});
	}

}

// message-send-user-textarea
$('#message-send-user-textarea').bind('input keyup paste', function() {
	setTimeout(contentLengthCheck, 0);
});

function contentLengthCheck() {
	var input_messageContent = $('#message-send-user-textarea').val();
	input_messageContent = input_messageContent.trim();
	// console.log(input_messageContent.byteLength());
	console.log(input_messageContent.Length());
	var strongLength = input_messageContent.Length();
	if (strongLength > 140) {
		 $('#message-send-user-textarea').css('color', 'blue');
		$('#message-send-length-max').text("");
		$('#message-send-length-byte').text("MMS");
		$('#message-send-length-strong').text(strongLength);
	}else{
		$('#message-send-user-textarea').css('color', 'black');
		$('#message-send-length-max').text("140");
		$('#message-send-length-byte').text("자");
		$('#message-send-length-strong').text(strongLength);
	}
	

}

$('#message-send-user-resendCount-input').bind('input paste', function(e) {

	resendCountCheck();
});

function resendCountCheck() {
	var num_check = /^[0-9]*$/;
	var input_resendCount = $('#message-send-user-resendCount-input').val();
	if (!num_check.test(input_resendCount)) {
		alert('숫자만 입력 가능합니다!');
		$('#message-send-user-resendCount-input').focus();
		return false;
	}

}

$('#message-send-user-resendInterval-input').bind('input paste', function(e) {

	resendIntervalCheck();
});

function resendIntervalCheck() {
	var num_check = /^[0-9]*$/;
	var input_resendInterval = $('#message-send-user-resendInterval-input')
			.val();
	if (!num_check.test(input_resendInterval)) {
		alert('숫자만 입력 가능합니다!');
		$('#message-send-user-resendInterval-input').focus();
		return false;
	}
}

$('#message-send-user-target-input').bind('input paste', function(e) {

	ufmiCheckTime();
});

function ufmiCheckTime() {
	var input_messageTarget = $('#message-send-user-target-input').val();
	var num_check = /^[0-9|*]*$/;

	if (!num_check.test(input_messageTarget)) {
		console.log('aaa');
		alert('숫자와 * 만 입력 가능합니다!');
		$('#message-send-user-target-input').focus();
		return false;
	}

	if (input_messageTarget == null || input_messageTarget == "") {
		$('#message-send-user-ufmi-span').text("");
		$('#message-send-user-text-span').text("");
		return false;
	}

	var p2Numtemp = p2numArray();
	var svcUfmi = sessionStorage.getItem("ufmi");
	var checkResult = new ufmiVerCheck(svcUfmi);
	var ufmiVer = checkResult.ufmiVer;
	var firstIndex = checkResult.firstIndex;
	var lastIndex = checkResult.lastIndex;

	if (ufmiVer == "p1") {
		console.log('피원');
		$("#message-send-user-target-input").attr('maxlength', '16');
		var inputReceiverNum = input_messageTarget.split('*');
		var inputNumLength = inputReceiverNum.length;
		var num_check = /^[0-9]*$/;
		switch (inputNumLength) {
		case 1:
			$("#message-send-user-target-input").attr('maxlength', '7');
			if (!num_check.test(inputReceiverNum[0])
					|| inputReceiverNum[0].length > 6) {
				console.log(inputReceiverNum[0].length);

				$('#message-send-user-target-input').focus();
				return false;
			}
			input_messageTarget = lastIndex + inputReceiverNum[0];

			console.log(input_messageTarget);
			$('#message-send-user-text-span').text("실제 전송번호: ");
			$('#message-send-user-ufmi-span').text(input_messageTarget);
			break;

		case 2:
			$("#message-send-user-target-input").attr('maxlength', '12');
			if (!num_check.test(inputReceiverNum[0])
					|| inputReceiverNum[0].length > 6
					|| !num_check.test(inputReceiverNum[1])
					|| inputReceiverNum[1].length > 6) {

				$('#message-send-user-target-input').focus();
				return false;
			}

			input_messageTarget = firstIndex + inputReceiverNum[0] + "*"
					+ inputReceiverNum[1];
			console.log(input_messageTarget);
			$('#message-send-user-text-span').text("실제 전송번호: ");
			$('#message-send-user-ufmi-span').text(input_messageTarget);
			break;
		// 별 2개이면 p1 p2 체크
		case 3:
			$("#message-send-user-target-input").attr('maxlength', '16');
			if (inputReceiverNum[0].length > 2) {

				$('#message-send-user-target-input').focus();
				return false;
			}
			var p2Substring = inputReceiverNum[0].substring(0, 2);
			var check = false;
			// 00~41 check
			for (var j = 0; j < p2Numtemp.length; j++) {
				if (p2Substring == p2Numtemp[j]) {
					check = true;
				}
			}

			if (inputReceiverNum[0].substring(0, 2) == "82"
					&& inputReceiverNum[1].length < 7
					&& num_check.test(inputReceiverNum[1])
					&& inputReceiverNum[2].length < 7
					&& num_check.test(inputReceiverNum[2])) {
				console.log('p1 번호 ');
			} else if (check && inputReceiverNum[1].length < 5
					&& num_check.test(inputReceiverNum[1])
					&& inputReceiverNum[2].length < 5
					&& num_check.test(inputReceiverNum[2])) {
				console.log('p2 번호');

			} else {

				$('#message-send-user-target-input').focus();
				return false;
			}
			console.log('발송 무전번호');
			input_messageTarget = inputReceiverNum[0] + "*"
					+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
			$('#message-send-user-text-span').text("실제 전송번호: ");
			$('#message-send-user-ufmi-span').text(input_messageTarget);

			break;

		default:

			$('#message-send-user-target-input').focus();
			return false;
			break;
		}

	}

	// p2
	if (ufmiVer == "p2") {
		console.log('피투');
		// 01~41 push
		$("#message-send-user-target-input").attr('maxlength', '12');
		var inputReceiverNum = input_messageTarget.split('*');
		var inputNumLength = inputReceiverNum.length;
		var num_check = /^[0-9]*$/;
		switch (inputNumLength) {
		case 1:
			console.log('케이스 1');
			$("#message-send-user-target-input").attr('maxlength', '5');
			if (!num_check.test(inputReceiverNum[0])
					|| inputReceiverNum[0].length > 4) {
				console.log(inputReceiverNum[0].length);

				$('#message-send-user-target-input').focus();
				return false;
			}
			input_messageTarget = lastIndex + inputReceiverNum[0];

			console.log("실제 전송번호");
			console.log(input_messageTarget);
			$('#message-send-user-text-span').text("실제 전송번호: ");
			$('#message-send-user-ufmi-span').text(input_messageTarget);
			break;
		case 2:
			console.log('케이스 2');
			$("#message-send-user-target-input").attr('maxlength', '10');
			if (!num_check.test(inputReceiverNum[0])
					|| inputReceiverNum[0].length > 4
					|| !num_check.test(inputReceiverNum[1])
					|| inputReceiverNum[1].length > 4) {
				console.log(inputReceiverNum[0].length);
				console.log(inputReceiverNum[1].length);

				$('#message-send-user-target-input').focus();
				return false;
			}

			input_messageTarget = firstIndex + inputReceiverNum[0] + "*"
					+ inputReceiverNum[1];
			console.log("실제 전송번호");
			console.log(input_messageTarget);
			$('#message-send-user-text-span').text("실제 전송번호: ");
			$('#message-send-user-ufmi-span').text(input_messageTarget);
			break;

		case 3:
			console.log('케이스 3');
			$("#message-send-user-target-input").attr('maxlength', '16');
			if (inputReceiverNum[0].length > 2) {

				$('#message-send-user-target-input').focus();
				return false;
			}
			var p2Substring = inputReceiverNum[0].substring(0, 2);
			var check = false;
			// 00~41 check
			for (var j = 0; j < p2Numtemp.length; j++) {
				if (p2Substring == p2Numtemp[j]) {
					check = true;
				}
			}

			if (inputReceiverNum[0].substring(0, 2) == "82"
					&& inputReceiverNum[1].length < 7
					&& num_check.test(inputReceiverNum[1])
					&& inputReceiverNum[2].length < 7
					&& num_check.test(inputReceiverNum[2])) {
				console.log('p1 번호 ');
			} else if (check && inputReceiverNum[1].length < 5
					&& num_check.test(inputReceiverNum[1])
					&& inputReceiverNum[2].length < 5
					&& num_check.test(inputReceiverNum[2])) {
				console.log('p2 번호');

			} else {

				$('#message-send-user-target-input').focus();
				return false;
			}
			console.log('발송 무전번호');
			input_messageTarget = inputReceiverNum[0] + "*"
					+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
			$('#message-send-user-text-span').text("실제 전송번호: ");
			$('#message-send-user-ufmi-span').text(input_messageTarget);
			break;

		default:

			$('#message-send-user-target-input').focus();
			return false;
			break;
		}

	}// p2

	console.log('무전번호 체크');
}

function plusUfmiCheck() {
	var ufmiNumInput = $('#message-send-user-ufmi-span').text();
	if (ufmiNumInput == null || ufmiNumInput == "") {
		alert('무전번호를 입력해 주세요!');
		$('#message-send-user-target-input').focus();
		return false;
	}

	var inputReceiverNum = ufmiNumInput.split('*');
	var p2Substring = inputReceiverNum[0].substring(0, 2);
	var num_check = /^[0-9|*]*$/;

	var p2Numtemp = p2numArray();
	var check = false;
	// 00~41 check
	for (var j = 0; j < p2Numtemp.length; j++) {
		if (p2Substring == p2Numtemp[j]) {
			check = true;
		}
	}

	if (inputReceiverNum[0].substring(0, 2) == "82"
			&& inputReceiverNum[1].length < 7
			&& num_check.test(inputReceiverNum[1])
			&& inputReceiverNum[2].length < 7
			&& num_check.test(inputReceiverNum[2])) {
		$('#message-send-user-target-show-input').show();
		var showInputVal = $('#message-send-user-target-show-input').val();
		if (showInputVal == "" || showInputVal == null) {
			$('#message-send-user-target-show-input').val(
					showInputVal + ufmiNumInput);
		} else {
			$('#message-send-user-target-show-input').val(
					showInputVal + "," + ufmiNumInput);
		}

		// ufmiNumInput
		console.log('p1 번호 ');
	} else if (check && inputReceiverNum[1].length < 5
			&& num_check.test(inputReceiverNum[1])
			&& inputReceiverNum[2].length < 5
			&& num_check.test(inputReceiverNum[2])) {
		$('#message-send-user-target-show-input').show();
		var showInputVal = $('#message-send-user-target-show-input').val();
		if (showInputVal == "" || showInputVal == null) {
			$('#message-send-user-target-show-input').val(
					showInputVal + ufmiNumInput);
		} else {
			$('#message-send-user-target-show-input').val(
					showInputVal + "," + ufmiNumInput);
		}
		console.log('p2 번호');

	} else {
		alert('올바른 무전 번호를 입력해주세요!');
		$('#message-send-user-target-input').focus();
		return false;
	}
	$('#message-send-user-target-input').val("");
}

// formCheck
function messageSendUserFormCheck() {

	var input_messageTarget = $('#message-send-user-target-show-input').val();
	var input_messageContent = $('#message-send-user-textarea').val();
	var input_resendCount = $('#message-send-user-resendCount-input').val();
	var input_resendInterval = $('#message-send-user-resendInterval-input')
			.val();

	var input_reservation = $('#message-send-user-reservationdate-input').val();
	console.log('폼체크');
	console.log(input_reservation);

	input_messageContent = compactTrim(input_messageContent);

	if (input_messageTarget == null || input_messageTarget == "") {
		alert("메세지 보낼 대상을 입력해주세요");
		$('#message-send-user-target-input').focus();
		return false;
	}

	if (input_resendCount == null || input_resendCount == "") {

	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_resendCount)) {
			input_resendCount = input_resendCount * 1;
			if (input_resendCount > 10) {
				alert('반복 횟수는 최대 10번까지 가능합니다.');
				$('#message-send-user-resendCount-input').focus();
				return false;
			}

			if (input_resendInterval == null || input_resendInterval == "") {
				alert('반복 시간을 입력해주세요!');
				$('#message-send-user-resendInterval-input').focus();
				return false;
			}

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-user-resendCount-input').focus();
			return false;
		}

	}

	if (input_resendInterval == null || input_resendInterval == "") {

	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_resendInterval)) {
			input_resendInterval = input_resendInterval * 1;
			if (input_resendInterval > 1440) {
				alert('반복 시간은 최대 1440분(24시간)까지 입력 가능합니다.');
				$('#message-send-user-resendInterval-input').focus();
				return false;
			}

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-user-resendInterval-input').focus();
			return false;
		}

		if (input_resendCount == null || input_resendCount == "") {
			alert('반복 횟수를 입력해주세요!');
			$('#message-send-user-resendCount-input').focus();
			return false;
		}

	}

	if (input_messageContent == null || input_messageContent == "") {

		alert("메세지 내용  입력해주세요");
		$('#message-send-user-textarea').focus();
		return false;
	} else {
		var strongText = $('#message-send-length-strong').text();
		strongText = strongText.trim();

		if (strongText.Length() > 140) {
			alert('140자 이내로 입력 해 주세요');
			$('#message-send-user-textarea').focus();
			return false;
		}

	}

	if (input_reservation == null || input_reservation == "") {
		console.log('예약 메시지 없음');

		if (confirm("예약 시간이 설정 되지 않아 메시지가 즉시 전송됩니다.") == true) {

		} else {
			return false;
		}
	} else {

		console.log('예약 메시지 있음');
		if (input_reservation) { // 예약 메세지
			var convertDate = input_reservation;

			input_reservation = compactTrim(input_reservation);

			input_reservation = input_reservation.substring(0, 10);

			convertDate = dateFormating(convertDate);
			var nowDateTime = new Date();
			var nowTime = nowDateTime.getTime() + 300000;
			var convertPickerTime = convertDate.getTime();
			if (nowTime > convertPickerTime) {
				alert('예약메세지는 현재 시각기준보다 5분 이상 설정 되어야 합니다.');
				return false;
			}

		}

		if (confirm("예약이 설정된 시간으로 메세지가 전송됩니다. 확인해 주세요") == true) {

		} else {
			return false;
		}

	}

	return true;

}
