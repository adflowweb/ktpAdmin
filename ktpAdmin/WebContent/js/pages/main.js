function pingsettingFunc() {
	console.log('핑주기 설정 펑션');

	if (formCheck()) {

		var input_pingsetting = $('#input_pingsetting').val();
		var input_receiver = $('#input_receiver').val();
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_pingsetting)) {

			console.log('정상입력');

			$.ajax({
				url : '/v1/messages',
				type : 'POST',
				headers : {
					'X-ApiKey' : '9c208db3ac3f44aa8e82423'
				},
				contentType : "application/json",
				dataType : 'json',
				async : false,
				data : '{"receiver":"' + input_receiver
						+ '","qos":2,"type":102, "content":" {\\"keepAlive\\":'
						+ input_pingsetting + '} "}',

				success : function(data) {
					console.log(data);
					console.log(data.result.success);
					alert('keep Alive Time 을 전송 하였습니다.');
					$('#input_receiver').val("");
					$('#input_pingsetting').val("");
					$('#input_receiver').focus();

				},
				error : function(data, textStatus, request) {
					alert('전송실패');
				}
			});

			

		} else {

			alert('숫자만 입력할수 있습니다.');
			$('#input_pingsetting').val("");
			$('#input_pingsetting').focus();
			return false;
		}

	}

}

function resetFunc() {
	$('#input_pingsetting').val("");
	$('#input_receiver').val("");
	$('#input_receiver').focus();

}

function formCheck() {

	var input_pingsetting = $('#input_pingsetting').val();
	var input_receiver = $('#input_receiver').val();
	if (input_receiver == "" || input_receiver == null) {

		alert('대상을 입력해 주세요');
		$('#input_receiver').focus();
		return false;

	}
	if (input_pingsetting == "" || input_pingsetting == null) {

		alert('초를 입력해주세요!');

		$('#input_pingsetting').focus();
		return false;

	}

	return true;

}
