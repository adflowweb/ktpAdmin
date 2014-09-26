function MessageSendFunction() {

	var formCheck = messageSendFormCheck();
	var tokenID = sessionStorage.getItem("tokenID");
	var userID = sessionStorage.getItem("userID");

	if (formCheck) {

		var input_messageService = $('#input_messageService').val();
		var input_messageType = $('#input_messageType').val();

		var input_messageTarget = $('#input_messageTarget').val();
		var input_messageContent = $('#input_messageContent').val();

		// var textAreaPlainText = ckGetPlainText();
		// var textAreaContents = GetContents();
		// var htmlEncodeResult = utf8_to_b64(textAreaContents);
		// textAreaPlainText = compactTrim(textAreaPlainText);
		var qos = 0;
		qos = $("#qosSelect").val();

		console.log("대상:" + input_messageTarget + "  대상서비스:"
				+ input_messageService + "  플래인텍스트:" + input_messageContent
				+ "Qos:" + qos + " 타입:" + input_messageType);

		input_messageContent = utf8_to_b64(input_messageContent);


		
		
		var resultData = '{"sender":"' + userID + '","receiver":"'
				+ input_messageTarget + '","qos":' + qos

				+ ', "retained":false,"serviceID":"' + input_messageService
				+ '","type":"' + input_messageType + '","contentType":"text/plain", "content":"'
				+ input_messageContent + '"}';
		console.log('결과 값');
		console.log(resultData);

		$.ajax({
			url : '/v1/messages',
			type : 'POST',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			dataType : 'json',
			async : false,
			data :resultData,

			// "content":"
			// {\\"notification\\":{\\"notificationStyle\\":1,\\"contentTitle\\":\\"'
			// + input_messageTitle + '\\",\\"contentText\\":\\"'
			// + textAreaPlainText + '\\",\\"htmlContent\\":\\"'
			// + htmlEncodeResult + '\\",\\"ticker\\":\\"'
			// + input_messageTitle + '\\"} } "}

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
	// <div class="form-group">
	// <label>메세지 발송 대상 </label><br/>
	// <input type="text" class="form-control"
	// id="input_messageTarget" placeholder="메세지 발송 대상
	// ex)rcs/82/3383/p1234"></input>
	//	
	// </div>
	// <div class="form-group">
	// <label>대상 서비스</label> <input class="form-control"
	// id="input_messageService" placeholder="서비스 아이디 입력">
	// </div>
	//
	// <div class="form-group">
	// <label>메세지 타입</label> <input class="form-control"
	// id="input_messageType" placeholder="메세지 타입 입력">
	// </div>

	var input_messageTarget = $('#input_messageTarget').val();

	var input_messageService = $('#input_messageService').val();
	var input_messageType = $('#input_messageType').val();
	var input_messageContent = $('#input_messageContent').val();
	// var textAreaPlainText = ckGetPlainText();
	input_messageContent = compactTrim(input_messageContent);
	console.log(input_messageContent);

	if (input_messageTarget == null || input_messageTarget == "") {
		alert("메세지 보낼 대상을 입력해주세요");
		$('#input_messageTarget').focus();
		return false;
	}

	else if (input_messageService == null || input_messageService == "") {
		alert("메세지를 보낼 앱의 서비스 아이디를 입력하세요!");
		$('#input_messageService').focus();
		return false;
	}

	else if (input_messageType == null || input_messageType == "") {
		alert("메세지 타입을 입력하세요!");
		$('#input_messageType').focus();
		return false;
	}

	else if (input_messageContent == null || input_messageContent == "") {
		alert("메세지 내용  입력해주세요");
		$('#input_messageContent').focus();
		return false;
	}

	else {
		return true;
	}

}

$("#input_typeFile").change(function() {
	console.log('file.....change...');
	console.log(this.files[0].size);
	var fileName = document.getElementById("input_typeFile").value;

	fileName = fileName.replace(/^.*\\/, "");
	console.log("파일이름:" + fileName);
	readURL(this);
});
// 메세지 서식 이미지 적용
function readURL(input) {
	console.log("in readURL...");

	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			console.log('컨텐츠 파일 리드');
			console.log(e.target.result);

			// var contentBase64=utf8_to_b64(e.target.result);
			// console.log('컨텐츠 base64:'+contentBase64);

		};

		reader.readAsDataURL(input.files[0]);
	} else {

	}
}
