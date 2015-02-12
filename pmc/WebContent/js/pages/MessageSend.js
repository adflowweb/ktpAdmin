$("#message-send-reservationdate-input").prop('disabled', true);
function MessageSendFunction() {

	console.log('메시지 발송 시작');
	var tokenID = sessionStorage.getItem("tokenID");
	var userID = sessionStorage.getItem("userID");
	if (messageSendFormCheck()) {
		var ackcheck = false;
		if ($("input:checkbox[id='message-send-ackckeck-input']")
				.is(":checked") == true) {

			console.log('ack ckeck true');
			ackcheck = true;
		}

		var input_messageTarget = $('#message-send-target-input').val();
		var input_messageService = $('#message-send-service-input').val();
		var input_messageContent = $('#message-send-textarea').val();
		var input_ackcheck = $('message-send-ackckeck-input').val();
		var input_reservation = $('#message-send-reservationdate-input').val();
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
		messageData.sender = userID;
		messageData.receiver = input_messageTarget;
		messageData.content = input_messageContent;
		messageData.contentType = "application/base64";
		messageData.ackcheck = input_ackcheck;
		messageData.reservation = dateResult;
		if (dateResult == "" || dateResult == null) {
			messageData.reservationCheck = false;
		} else {
			messageData.reservationCheck = true;
		}
		var messageDataResult = JSON.stringify(messageData);
		console.log(messageDataResult);

		// input_messageTarget = input_messageTarget.replace(/,/gi, '","');
		// console.log("고친:" + input_messageTarget);
		//
		// var dataExample = '{"sender":"dsafsdf","receiver":["'
		// + input_messageTarget
		// + '"],"contentType":"application/base64","content":"sdf"}';
		//
		// console.log(dataExample);
		//
		// input_messageContent = utf8_to_b64(input_messageContent);

		$.ajax({
			url : '/pms/v1/devices/fwInfo',
			type : 'PUT',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			dataType : 'json',
			async : false,
			data : messageDataResult,


			success : function(data) {
				console.log(data);
				console.log(data.result.success);
				if (data.result.info) {
					alert('메시지를 발송하였습니다.');
					$('#message-send-target-input').val("");
					$('#message-send-service-input').val("");
					$('#message-send-textarea').val("");
					$('#message-send-target-input').focus();

				} else {
					alert("메세지 전송에 실패 하였습니다");
					$('#message-send-target-input').val("");
					$('#message-send-service-input').val("");
					$('#message-send-textarea').val("");
					$('#message-send-target-input').focus();

				}

			},
			error : function(data, textStatus, request) {
				alert('전송실패');
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

	var input_messageTarget = $('#message-send-target-input').val();

	var input_messageService = $('#message-send-service-input').val();
	// var input_messageType = $('#input_messageType').val();
	var input_messageContent = $('#message-send-textarea').val();
	// var textAreaPlainText = ckGetPlainText();
	input_messageContent = compactTrim(input_messageContent);
	console.log(input_messageContent);

	if (input_messageTarget == null || input_messageTarget == "") {
		alert("메세지 보낼 대상을 입력해주세요");
		$('#input_messageTarget').focus();
		return false;
	}

	// else if (input_messageService == null || input_messageService == "") {
	// alert("메세지를 보낼 앱의 서비스 아이디를 입력하세요!");
	// $('#input_messageService').focus();
	// return false;
	// }

	// else if (input_messageType == null || input_messageType == "") {
	// alert("메세지 타입을 입력하세요!");
	// $('#input_messageType').focus();
	// return false;
	// }

	else if (input_messageContent == null || input_messageContent == "") {
		alert("메세지 내용  입력해주세요");
		$('#input_messageContent').focus();
		return false;
	}

	else {
		return true;
	}

}

// $("#contentSelect").change(function() {
//
// var contentType = $("#contentSelect").val();
//
// if (contentType == 2) {
// $('#input_messageContent').val("{'key':'value'}");
//
// } else {
// $('#input_messageContent').val("");
// }
//
// });

// $("#input_typeFile").change(function() {
// console.log('file.....change...');
// console.log(this.files[0].size);
// var fileName = document.getElementById("input_typeFile").value;
//
// fileName = fileName.replace(/^.*\\/, "");
// console.log("파일이름:" + fileName);
// $('#input_fileName').val(fileName);
// readURL(this);
// });
// file read
// function readURL(input) {
// console.log("in readURL...");
//
// if (input.files && input.files[0]) {
// var reader = new FileReader();
//
// reader.onload = function(e) {
// console.log('컨텐츠 파일 리드');
// console.log(e.target.result);
// $('#input_messageContent').val(e.target.result);
// $('#contentSelect').val(3);
//
// };
//
// reader.readAsDataURL(input.files[0]);
// } else {
//
// }
// }
