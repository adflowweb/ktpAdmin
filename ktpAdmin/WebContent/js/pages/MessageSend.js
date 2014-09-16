function MessageSendFunction() {

	var formCheck = messageSendFormCheck();
	var tokenID = sessionStorage.getItem("tokenID");
	var userID = sessionStorage.getItem("userID");

	if (formCheck) {
		var input_messageTarget = $('#input_messageTarget').val();
		var input_messageTitle = $('#input_messageTitle').val();
		var textAreaPlainText = ckGetPlainText();
		var textAreaContents = GetContents();
		var htmlEncodeResult = utf8_to_b64(textAreaContents);
		textAreaPlainText = compactTrim(textAreaPlainText);
		var qos = 0;
		qos = $("#qosSelect").val();

		console.log("대상:" + input_messageTarget + "  제목:" + input_messageTitle
				+ "  플래인텍스트:" + textAreaPlainText + "  html내용:"
				+ htmlEncodeResult + "Qos:" + qos);

		$
				.ajax({
					url : '/v1/messages',
					type : 'POST',
					headers : {
						'X-ApiKey' : tokenID
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : '{"sender":"'
							+ userID
							+ '","receiver":"'
							+ input_messageTarget
							+ '","qos":'
							+ qos
							+ ', "retained":false, "content":" {\\"notification\\":{\\"notificationStyle\\":1,\\"contentTitle\\":\\"'
							+ input_messageTitle + '\\",\\"contentText\\":\\"'
							+ textAreaPlainText + '\\",\\"htmlContent\\":\\"'
							+ htmlEncodeResult + '\\",\\"ticker\\":\\"'
							+ input_messageTitle + '\\"} } "}',

					success : function(data) {
						console.log(data);
						console.log(data.result.success);
						if (data.result.info) {
							alert('메세지를 전송하였습니다.');
							wrapperFunction('MessageSend');
							$('#input_messageTarget').focus();

						} else {
							alert("메세지 전송에 실패 하였습니다");
							wrapperFunction('MessageSend');
							$('#input_messageTarget').focus();
						}
					},
					error : function(data, textStatus, request) {
						alert("메세지 전송에 실패 하였습니다");
						wrapperFunction('MessageSend');
						$('#input_messageTarget').focus();
					}
				});

	}

}

// form null check
function messageSendFormCheck() {
	var input_messageTarget = $('#input_messageTarget').val();
	var input_messageTitle = $('#input_messageTitle').val();
	var textAreaPlainText = ckGetPlainText();
	textAreaPlainText = compactTrim(textAreaPlainText);
	console.log('nullcheck..start');
	console.log(textAreaPlainText);

	if (input_messageTarget == null || input_messageTarget == "") {
		alert("메세지 보낼 대상을 입력해주세요");
		$('#input_messageTarget').focus();
		return false;
	}

	else if (input_messageTitle == null || input_messageTitle == "") {
		alert("메세지 제목  입력해주세요");
		$('#input_messageTitle').focus();
		return false;
	}

	else if (textAreaPlainText == null || textAreaPlainText == "") {
		alert("메세지 내용  입력해주세요");
		$('#input_messageContent').focus();
		return false;
	}

	else {
		return true;
	}

}