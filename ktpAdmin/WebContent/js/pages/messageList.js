$('#dataTables-example tbody').on('click', 'tr', function() {
	console.log('message list id click');

	var tableDataRow = $(this).children("td").map(function() {
		return $(this).text();
	}).get();

	console.log(tableDataRow[0]);
	var messageID = tableDataRow[0];
	var tokenID = sessionStorage.getItem("tokenID");
	console.log('메세지 아이디');
	console.log(messageID);
	$('#pcc-message-detail-div').show();
	$.ajax({
		url : '/v1/messages/' + messageID,
		type : 'GET',
		headers : {
			'X-ApiKey' : tokenID
		},
		contentType : "application/json",
		async : false,
		success : function(data) {

			if (data.result.data) {

				var item = data.result.data;
				console.log('메세지 아이디로 조히ㅣ ');
				console.log(item);
				console.log(item.content);
				var item_Content = item.content;

				if (item.contentType == "application/base64") {
					item_Content = b64_to_utf8(item_Content);
				}

				$("#pcc-resend-sender-input").val(item.sender);
				$("#pcc-resend-receiver-input").val(item.receiver);
				$('#pcc-resend-realtype-input').val(item.type);
				
				item.type=item.type*1;
				if (item.type == 102) {
					item.type = "KeepAlive";
				} else if (item.type == 104) {
					item.type = "FirmwareUpdate";
				} else if (item.type == 105) {
					item.type = "DIGAccountInfo";
				} else {
					itme.type = "일반메시지";
				}

				$("#pcc-resend-type-input").val(item.type);
				$("#pcc-resend-content-textarea").val(item_Content);

			} else {
				alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
			}
		},
		error : function(data, textStatus, request) {
			console.log(data);
			alert('메세지 발송 정보를 가지고 오는데 실패 하였습니다.');
		}
	});

});

function pccResend() {

	if (pccReSendFormCheck()) {
		var sender_input = $("#pcc-resend-sender-input").val();
		var receiver_input = $("#pcc-resend-receiver-input").val();
		var type_input = $('#pcc-resend-realtype-input').val();
		var content_input = $("#pcc-resend-content-textarea").val();
		var tokenID = sessionStorage.getItem("tokenID");
		
		if (confirm("같은 내용으로 메시지를 재전송 하시겠습니까?.") == true){
			if (type_input == "102") {
				content_input = content_input * 1;
				$.ajax({
					url : '/v1/devices/keepAliveTime',
					type : 'PUT',
					headers : {
						'X-ApiKey' : tokenID
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : '{"sender":"' + sender_input + '","receiver":"'
							+ receiver_input + '","content":"{\\"keepAlive\\":'
							+ content_input + '}"}',

					success : function(data) {
						console.log(data);
						console.log(data.result.success);
						if (data.result.info) {
							alert('keep Alive Time 을 전송 하였습니다.');
							wrapperFunction('messageList');

						} else {
							alert("메세지 전송에 실패 하였습니다");
							wrapperFunction('messageList');

						}

					},
					error : function(data, textStatus, request) {
						alert('전송실패');
						wrapperFunction('messageList');
					}
				});

			} else if (type_input == "104") {
				content_input=utf8_to_b64(content_input);
				$.ajax({
					url : '/v1/devices/fwInfo',
					type : 'PUT',
					headers : {
						'X-ApiKey' : tokenID
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : '{"sender":"' + sender_input + '","receiver":"'
							+ receiver_input
							+ '","contentType":"application/base64","content":"'
							+ content_input + '"}',

					success : function(data) {
						console.log(data);
						console.log(data.result.success);
						if (data.result.info) {
							alert('F/W 공지를 발송하였습니다.');
							wrapperFunction('messageList');

						} else {
							alert("메세지 전송에 실패 하였습니다");
							wrapperFunction('messageList');

						}

					},
					error : function(data, textStatus, request) {
						alert('전송실패');
						wrapperFunction('messageList');
					}
				});
			} else if (type_input == "105") {
				content_input=utf8_to_b64(content_input);
				$.ajax({
					url : '/v1/users/digAccountInfo',
					type : 'PUT',
					headers : {
						'X-ApiKey' : tokenID
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : '{"sender":"' + sender_input + '","receiver":"'
							+ receiver_input
							+ '","contentType":"application/base64","content":"'
							+ content_input + '"}',

					success : function(data) {
						console.log(data);
						console.log(data.result.success);
						if (data.result.info) {
							alert('DIGAccount Info를 발송하였습니다.');
							wrapperFunction('messageList');
						

						} else {
							alert("메세지 전송에 실패 하였습니다");
							wrapperFunction('messageList');
			

						}

					},
					error : function(data, textStatus, request) {
						alert('전송실패');
						wrapperFunction('messageList');
					}
				});
			
			}
		}else{
			
		}
		

	}

}
function pccReSendFormCheck() {

	var sender_input = $("#pcc-resend-sender-input").val();
	var receiver_input = $("#pcc-resend-receiver-input").val();
	var type_input = $('#pcc-resend-realtype-input').val();
	var content_input = $("#pcc-resend-content-textarea").val();

	if (sender_input == null || sender_input == "") {
		alert("송신자를 입력하세요");
		return false;
	}

	if (receiver_input == null || receiver_input == "") {
		alert("메세지를 보낼 대상을 입력해 주세요");
		return false;
	}

	if (type_input == null || type_input == "") {
		alert("메세지 타입을 입력하세요!");
		return false;
	}

	if (content_input == null || content_input == "") {
		alert("메세지 내용  입력해주세요");
		return false;
	}

	return true;

}
