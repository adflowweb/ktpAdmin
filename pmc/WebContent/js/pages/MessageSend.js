$("#message-send-reservationdate-input").prop('disabled', true);
function MessageSendFunction() {

	console.log('메시지 발송 시작');
	var tokenID = sessionStorage.getItem("token");
	//var userID = sessionStorage.getItem("userId");
	var role = sessionStorage.getItem("role");
	var ackcheck = false;
	if (messageSendFormCheck()) {

		if ($("input:checkbox[id='message-send-ackckeck-input']")
				.is(":checked") == true) {

			console.log('ack ckeck true');
			ackcheck = true;
		}

		var input_messageTarget = $('#message-send-target-input').val();
		var input_messageService = $('#message-send-service-input').val();
		var input_messageContent = $('#message-send-textarea').val();
		input_messageContent = utf8_to_b64(input_messageContent);
		// var input_ackcheck = $('message-send-ackckeck-input').val();
		var input_reservation = $('#message-send-reservationdate-input').val();
		var input_resendCount = $('#message-send-resendCount-input').val();
		var input_resendInterval = $('#message-send-resendInterval-input')
				.val();
		var qos = 0;
		qos = $("#message-send-qos-select").val();
		var contentType = $("#message-send-contentType-select").val();

		if (contentType == 1) {

			contentType = "text/plain";
		} else if (contentType == 2) {
			contentType = "application/json";
		} else {
			contentType = "application/base64";
		}

		var dateResult = dateFormating(input_reservation);

		if (input_reservation) {
			dateResult = dateResult.toISOString();
		}
		if (typeof dateResult === undefined
				|| typeof dateResult === 'undefined') {
			console.log("date Result is..undefined.....");
			dateResult = "";
		}
		input_messageTarget = input_messageTarget.split(",");
		var messageData = new Object();

		messageData.receivers = input_messageTarget;
		messageData.content = input_messageContent;
		messageData.serviceId = input_messageService;
		messageData.contentType = contentType;
		messageData.ack = ackcheck;
		messageData.qos = qos;
		if (dateResult != "") {
			messageData.reservationTime = dateResult;
			console.log("테스트:" + messageData.reservationTime);
		}

		if (input_resendCount != "") {
			messageData.resendMaxCount = input_resendCount;
		}
		if (input_resendInterval != "") {
			messageData.resendInterval = input_resendInterval;
		}

		// if (dateResult == "" || dateResult == null) {
		// messageData.reservation = false;
		// } else {
		// messageData.reservation = true;
		// }
		var messageDataResult = JSON.stringify(messageData);
		console.log(messageDataResult);

		$.ajax({
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
				console.log(data);
				console.log(data.result.success);
				if (data.result.data) {
					alert('메시지를 발송하였습니다.');
					wrapperFunction('MessageSend');
				} else {
					alert("메세지 전송에 실패 하였습니다.");
					wrapperFunction('MessageSend');
				}

			},
			error : function(data, textStatus, request) {
				alert('메세지 전송에 실패 하였습니다.');
				wrapperFunction('MessageSend');
			}
		});

	}

}

// form null check
function messageSendFormCheck() {

	var input_messageTarget = $('#message-send-target-input').val();
	// var
	// input_ho,input_ba,input_ka,input_ka,input_je,input_to,input_z,input_ho2;
	var input_messageService = $('#message-send-service-input').val();
	var input_messageType = $('#message-send-messageType-input').val();
	var input_messageExpire = $('#message-send-messageExpire-input').val();
	var input_messageContent = $('#message-send-textarea').val();
	var input_resendCount = $('#message-send-resendCount-input').val();
	var input_resendInterval = $('#message-send-resendInterval-input').val();
	var input_reservation = $('#message-send-reservationdate-input').val();

	// var textAreaPlainText = ckGetPlainText();
	input_messageContent = compactTrim(input_messageContent);
	console.log(input_messageContent);

	if (input_messageTarget == null || input_messageTarget == "") {
		alert("메세지 보낼 대상을 입력해주세요");
		$('#message-send-target-input').focus();
		return false;
	}

	if (input_messageService == null || input_messageService == "") {
		alert("메세지를 보낼 앱의 서비스 아이디를 입력하세요!");
		$('#message-send-service-input').focus();
		return false;
	}

	if (input_messageType == null || input_messageType == "") {
		alert("메세지 타입을 입력하세요!");
		$('#message-send-messageType-input').focus();
		return false;
	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_messageType)) {

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-messageType-input').focus();
			return false;
		}

	}
	if (input_messageExpire == null || input_messageExpire == "") {
		// alert("메세지 소멸 시간을 입력하세요!");
		// $('#message-send-messageExpire-input').focus();
		// return false;
	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_messageExpire)) {

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-messageExpire-input').focus();
			return false;
		}

	}

	if (input_resendCount == null || input_resendCount == "") {
		// alert("메세지 재전송 횟수를 입력하세요!");
		// $('#message-send-resendCount-input').focus();
		// return false;
	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_resendCount)) {
			input_resendCount = input_resendCount * 1;
			if (input_resendCount > 10) {
				alert('재전송 횟수는 최대 10번까지 가능합니다.');
				$('#message-send-resendCount-input').focus();
				return false;
			}

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-resendCount-input').focus();
			return false;
		}

	}

	if (input_resendInterval == null || input_resendInterval == "") {
		// alert("메세지 전송 시간을 입력하세요!");
		// $('#message-send-resendInterval-input').focus();
		// return false;
	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_messageExpire)) {

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-resendInterval-input').focus();
			return false;
		}

	}

	if (input_messageContent == null || input_messageContent == "") {
		alert("메세지 내용  입력해주세요");
		$('#message-send-textarea').focus();
		return false;
	}

	if (input_reservation == null || input_reservation == "") {

		if (confirm("예약 시간이 설정 되지 않아 메세지가 즉시 전송됩니다.") == true) {
			return true;
		} else {
			return false;
		}
	} else {
		if (input_reservation) { // 예약 메세지
			var convertDate = input_reservation;
			input_reservation = compactTrim(input_reservation);
			input_reservation = input_reservation.substring(0, 10);
			var validateDateResult = validateDate(input_reservation);

			if (!validateDateResult) {
				alert('입렵하신 예약 날짜가 형식에 맞지 않습니다.');
				return false;
			} else {

				convertDate = dateFormating(convertDate);
				var nowDateTime = new Date();
				var nowTime = nowDateTime.getTime() + 300000;
				var convertPickerTime = convertDate.getTime();
				if (nowTime > convertPickerTime) {
					alert('예약메세지는 현재 시각기준보다 5분 이상 설정 되어야 합니다.');
					return false;
				}
				return true;
			}
			if (confirm("예약이 설정된 시간으로 메세지가 전송됩니다. 확인해 주세요") == true) {
				return true;
			} else {
				return false;
			}

		}

	}

	return true;

}
