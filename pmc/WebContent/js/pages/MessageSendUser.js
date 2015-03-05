
function MessageSendUserFunction() {

	console.log('메시지 발송 시작');
	var tokenID = sessionStorage.getItem("token");
	var role = sessionStorage.getItem("role");

	if (messageSendUserFormCheck()) {
		var input_messageTarget = $('#message-send-user-target-input').val();
		var input_messageContent = $('#message-send-user-textarea').val();
		input_messageContent = utf8_to_b64(input_messageContent);
		var input_reservation = $('#message-send-user-reservationdate-input').val();
		var input_resendCount = $('#message-send-user-resendCount-input').val();
		var input_resendInterval = $('#message-send-user-resendInterval-input')
				.val();
	
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
		messageData.contentType = "application/base64";
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
		var messageDataResult = JSON.stringify(messageData);
		if(utf8ByteLength(messageDataResult)>512000){
			console.log(utf8ByteLength(messageDataResult));
			alert('메시지 사이즈가 너무 큽니다.');
			return false;
		}
		console.log(utf8ByteLength(messageDataResult));
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
				
				var dataResult=data.result.data;
				if (dataResult) {
					console.log('/v1/pms/adm/' + role + '/messages(POST)');
					console.log(dataResult);
//					if(messageData.resendMaxCount){
//						messageData.resendMaxCount=messageData.resendMaxCount*1+1;
//						alert('반복 메시지를 포함하여 총 '+messageData.resendMaxCount+'건을 발송하였습니다.');
//					}else{
//						alert('메시지 1건을 발송하였습니다.');	
//					}
					alert('메시지를 발송하였습니다.');	
					wrapperFunction('MessageSendUser');
				} else {
					alert(data.result.errors[0]);
				
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

// form null check
function messageSendUserFormCheck() {

	var input_messageTarget = $('#message-send-user-target-input').val();
	var input_messageContent = $('#message-send-user-textarea').val();
	var input_resendCount = $('#message-send-user-resendCount-input').val();
	var input_resendInterval = $('#message-send-user-resendInterval-input').val();

	var input_reservation = $('#message-send-user-reservationdate-input').val();
	console.log("메세지 내용");
	input_messageContent = compactTrim(input_messageContent);
	console.log("여기");
	console.log(input_messageContent);
	console.log(input_reservation);

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

	}

	if (input_messageContent == null || input_messageContent == "") {
		alert("메세지 내용  입력해주세요");
		$('#message-send-user-textarea').focus();
		return false;
	}

	if (input_reservation == null || input_reservation == "") {

		if (confirm("예약 시간이 설정 되지 않아 메시지가 즉시 전송됩니다.") == true) {
			return true;
		} else {
			return false;
		}
	} else {
		
		if (input_reservation) { // 예약 메세지
			var convertDate = input_reservation;
			console.log('여가');
			input_reservation = compactTrim(input_reservation);
			console.log('여가');
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
				
			}
		
		}
		
		if (confirm("예약이 설정된 시간으로 메세지가 전송됩니다. 확인해 주세요") == true) {
			return true;
		} else {
			return false;
		}

	}

	return true;

}
