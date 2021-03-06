function firmwareFunc() {
	console.log('F/W upgrade 공지 발송 시작');
	var tokenID = sessionStorage.getItem("tokenID");
	var userID = sessionStorage.getItem("userID");
	if (formCheck()) {
		var input_receiver = $('#input_receiver').val();
		var input_fwcontent = $('#input_fwcontent').val();
		input_fwcontent=utf8_to_b64(input_fwcontent);

		$
				.ajax({
					url : '/v1/devices/fwInfo',
					type : 'PUT',
					headers : {
						'X-ApiKey' : tokenID
					},
					contentType : "application/json",
					dataType : 'json',
					async : false,
					data : '{"sender":"'
							+ userID
							+ '","receiver":"'
							+ input_receiver
							+ '","contentType":"application/base64","content":"'+ input_fwcontent+'"}',

					success : function(data) {
						console.log(data);
						console.log(data.result.success);
						if (data.result.info) {
							alert('F/W 공지를 발송하였습니다.');
							$('#input_receiver').val("");
							$('#input_fwcontent').val("");
							$('#input_receiver').focus();

						} else {
							alert("메세지 전송에 실패 하였습니다");
							$('#input_receiver').val("");
							$('#input_fwcontent').val("");
							$('#input_receiver').focus();

						}

					},
					error : function(data, textStatus, request) {
						alert('전송실패');
					}
				});

	}

}

function resetFunc() {
	$('#input_receiver').val("");
	$('#input_fwcontent').val("");
	$('#input_receiver').focus();

}

function formCheck() {

	var input_receiver = $('#input_receiver').val();
	var input_fwcontent = $('#input_fwcontent').val();
	input_fwcontent = compactTrim(input_fwcontent);
	if (input_receiver == "" || input_receiver == null) {

		alert('메시지 발송 대상을 입력해 주세요');
		$('#input_receiver').focus();
		return false;

	} else if (input_fwcontent == "" || input_fwcontent == null) {
		alert('메시지 발송 내용을 입력해 주세요');
		$('#input_fwcontent').focus();
		return false;

	}

	return true;

}
