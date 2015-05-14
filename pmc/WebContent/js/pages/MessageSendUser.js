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
		var input_messageTarget = $('#message-send-user-target-input').val();

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

		var p2Numtemp = p2numArray();
		var svcUfmi = sessionStorage.getItem("ufmi");
		var checkResult = new ufmiVerCheck(svcUfmi);
		var ufmiVer = checkResult.ufmiVer;
		var firstIndex = checkResult.firstIndex;
		var lastIndex = checkResult.lastIndex;

		if (ufmiVer == "p1") {
			console.log('피원');
			for ( var i in messageData.receivers) {
				if (messageData.receivers[i].length == 0) {
					console.log('리시버 길이 0');
					alert('올바른 무전 번호를 입력하세요');
					$('#message-send-user-target-input').focus();
					return false;
				}
				var inputReceiverNum = messageData.receivers[i].split('*');
				var inputNumLength = inputReceiverNum.length;
				var num_check = /^[0-9]*$/;
				switch (inputNumLength) {
				case 1:
					if (!num_check.test(inputReceiverNum[0])
							|| inputReceiverNum[0].length > 6) {
						console.log(inputReceiverNum[0].length);
						alert('개인번호만 입력시 1~6자리 숫자만 입력. ex)1234');
						$('#message-send-user-target-input').focus();
						return false;
					}
					messageData.receivers[i] = lastIndex + inputReceiverNum[0];

					console.log(messageData.receivers[i]);

					break;

				case 2:
					if (!num_check.test(inputReceiverNum[0])
							|| inputReceiverNum[0].length > 6
							|| !num_check.test(inputReceiverNum[1])
							|| inputReceiverNum[1].length > 6) {

						alert('82번호 생략시 1~6자리*1~6자리 형태로 입력! ex)100*1234');
						$('#message-send-user-target-input').focus();
						return false;
					}

					messageData.receivers[i] = firstIndex + inputReceiverNum[0]
							+ "*" + inputReceiverNum[1];
					console.log(messageData.receivers[i]);

					break;
				// 별 2개이면 p1 p2 체크
				case 3:
					if (inputReceiverNum[0].length > 2) {
						alert('무전번호의 첫자리는 2자리숫자로 입력!');
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
						alert('올바른 무전 번호를 입력해주세요!');
						$('#message-send-user-target-input').focus();
						return false;
					}
					console.log('발송 무전번호');
					messageData.receivers[i] = inputReceiverNum[0] + "*"
							+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
					console.log(messageData);

					break;

				default:
					alert('올바른 무전 번호를 입력해주세요!');
					$('#message-send-user-target-input').focus();
					return false;
					break;
				}
			}

		}

		// p2
		if (ufmiVer == "p2") {
			console.log('피투');
			// 01~41 push

			console.log(messageData.receivers);

			for ( var i in messageData.receivers) {
				if (messageData.receivers[i].length == 0) {
					console.log('리시버 길이 0');
					alert('올바른 무전 번호를 입력하세요');
					$('#message-send-user-target-input').focus();
					return false;
				}
				var inputReceiverNum = messageData.receivers[i].split('*');
				var inputNumLength = inputReceiverNum.length;
				var num_check = /^[0-9]*$/;
				switch (inputNumLength) {
				case 1:
					console.log('케이스 1');
					if (!num_check.test(inputReceiverNum[0])
							|| inputReceiverNum[0].length > 4) {
						console.log(inputReceiverNum[0].length);
						alert('개인번호만 입력시 1자리에서~4자리 숫자만 입력. ex)1234');
						$('#message-send-user-target-input').focus();
						return false;
					}
					messageData.receivers[i] = lastIndex + inputReceiverNum[0];

					console.log("실제 전송번호");
					console.log(messageData.receivers[i]);

					break;
				case 2:
					console.log('케이스 2');
					if (!num_check.test(inputReceiverNum[0])
							|| inputReceiverNum[0].length > 4
							|| !num_check.test(inputReceiverNum[1])
							|| inputReceiverNum[1].length > 4) {
						console.log(inputReceiverNum[0].length);
						console.log(inputReceiverNum[1].length);
						alert('첫번째 무전 번호 생략시 1~4자리*1~4자리 형태로 입력! ex)100*1234');
						$('#message-send-user-target-input').focus();
						return false;
					}

					messageData.receivers[i] = firstIndex + inputReceiverNum[0]
							+ "*" + inputReceiverNum[1];
					console.log("실제 전송번호");
					console.log(messageData.receivers[i]);

					break;

				case 3:
					console.log('케이스 3');
					if (inputReceiverNum[0].length > 2) {
						alert('무전번호의 첫자리는 2자리숫자로 입력!');
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
						alert('올바른 무전 번호를 입력해주세요!');
						$('#message-send-user-target-input').focus();
						return false;
					}
					console.log('발송 무전번호');
					messageData.receivers[i] = inputReceiverNum[0] + "*"
							+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
					console.log(messageData);
					break;

				default:
					alert('올바른 무전 번호를 입력해주세요!');
					$('#message-send-user-target-input').focus();
					return false;
					break;
				}
			}
		}// p2

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
		$('#message-send-length-strong').text(strongLength);

		alert('140자 이내로 입력하세요!');
		$('#message-send-user-textarea').val(
				input_messageContent.substring(0,
						input_messageContent.length - 1));
		return false;
	} else {
		$('#message-send-length-strong').text(strongLength);
	}

}

$('#message-send-user-target-input').bind('input keyup paste', function() {
	setTimeout(ufmiCheckTime, 0);
});

function ufmiCheckTime() {
	// $('#message-send-user-ufmi-span').text("실제 전송번호:" +
	// input_messageTarget[i]);
	console.log('무전번호 체크');
	var input_messageTarget = $('#message-send-user-target-input').val();
	if (input_messageTarget == null || input_messageTarget == "") {
		$('#message-send-user-ufmi-span').text("");
		return false;
	}
	input_messageTarget = input_messageTarget.split(",");
	var p2Numtemp = p2numArray();
	var svcUfmi = sessionStorage.getItem("ufmi");
	var checkResult = new ufmiVerCheck(svcUfmi);
	var ufmiVer = checkResult.ufmiVer;
	var firstIndex = checkResult.firstIndex;
	var lastIndex = checkResult.lastIndex;

	if (ufmiVer == "p1") {
		console.log('피원');
		for ( var i in input_messageTarget) {
	
			var inputReceiverNum = input_messageTarget[i].split('*');
			var inputNumLength = inputReceiverNum.length;
			var num_check = /^[0-9]*$/;
			switch (inputNumLength) {
			case 1:
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 6) {
					console.log(inputReceiverNum[0].length);
					
					$('#message-send-user-target-input').focus();
					return false;
				}
				input_messageTarget[i] = lastIndex + inputReceiverNum[0];

				console.log(input_messageTarget[i]);
				$('#message-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;

			case 2:
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 6
						|| !num_check.test(inputReceiverNum[1])
						|| inputReceiverNum[1].length > 6) {

					$('#message-send-user-target-input').focus();
					return false;
				}

				input_messageTarget[i] = firstIndex + inputReceiverNum[0] + "*"
						+ inputReceiverNum[1];
				console.log(input_messageTarget[i]);
				$('#message-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;
			// 별 2개이면 p1 p2 체크
			case 3:
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
				input_messageTarget[i] = inputReceiverNum[0] + "*"
						+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
				$('#message-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);

				break;

			default:

				$('#message-send-user-target-input').focus();
				return false;
				break;
			}
		}

	}

	// p2
	if (ufmiVer == "p2") {
		console.log('피투');
		// 01~41 push

		for ( var i in input_messageTarget) {

			var inputReceiverNum = input_messageTarget[i].split('*');
			var inputNumLength = inputReceiverNum.length;
			var num_check = /^[0-9]*$/;
			switch (inputNumLength) {
			case 1:
				console.log('케이스 1');
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 4) {
					console.log(inputReceiverNum[0].length);

					$('#message-send-user-target-input').focus();
					return false;
				}
				input_messageTarget[i] = lastIndex + inputReceiverNum[0];

				console.log("실제 전송번호");
				console.log(input_messageTarget[i]);
				$('#message-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;
			case 2:
				console.log('케이스 2');
				if (!num_check.test(inputReceiverNum[0])
						|| inputReceiverNum[0].length > 4
						|| !num_check.test(inputReceiverNum[1])
						|| inputReceiverNum[1].length > 4) {
					console.log(inputReceiverNum[0].length);
					console.log(inputReceiverNum[1].length);

					$('#message-send-user-target-input').focus();
					return false;
				}

				input_messageTarget[i] = firstIndex + inputReceiverNum[0] + "*"
						+ inputReceiverNum[1];
				console.log("실제 전송번호");
				console.log(input_messageTarget[i]);
				$('#message-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;

			case 3:
				console.log('케이스 3');
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
				input_messageTarget[i] = inputReceiverNum[0] + "*"
						+ inputReceiverNum[1] + "*" + inputReceiverNum[2];
				$('#message-send-user-ufmi-span').text(
						"실제 전송번호:" + input_messageTarget[i]);
				break;

			default:

				$('#message-send-user-target-input').focus();
				return false;
				break;
			}
		}
	}// p2

	console.log('무전번호 체크');
}

// formCheck
function messageSendUserFormCheck() {

	var input_messageTarget = $('#message-send-user-target-input').val();
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
