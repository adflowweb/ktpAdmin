//disableInput
$("#message-send-messageType-input").prop('disabled', true);

// messageSend
function MessageSendFunction() {
	var tokenID = sessionStorage.getItem("token");
	var role = sessionStorage.getItem("role");
	var userId = sessionStorage.getItem("userId");
	var ackcheck = false;
	var messageData = new Object();

	if (messageSendFormCheck()) {
		if ($("input:checkbox[id='message-send-ackckeck-input']")
				.is(":checked") == true) {
			ackcheck = true;
		}

		// file
		var fileName = document
				.getElementById("pms-sysadmin-image-upload-input").value;

		var fileData = document
				.getElementById("pms-sysadmin-image-upload-input").files[0];
		var maxSize = 3 * 1024 * 1024;

		if (fileName != null && fileData != null) {
			if (fileData.size > maxSize) {
				alert('파일 첨부 용량을 초과 하였습니다(3MB 이하)');
				// $('.remove').click();
				return false;
			}

			if (confirm('첨부된 파일이 있습니다 파일을 업로드 하시겠습니까?') == true) {

				var fileFormat = fileName.substr(fileName.lastIndexOf('.') + 1);
				var replaceImageText = fileName.replace(/^.*\\/, "");
				console.log(fileFormat);
				var md5 = $('#pms-sysadmin-md5').val();
				replaceImageText = encodeURIComponent(replaceImageText);
				messageData.mms = true;
				messageData.fileName = md5;
				messageData.fileFormat = fileFormat;

				// /

				// head check
				var xhrHeadReq = new XMLHttpRequest();
				xhrHeadReq.open("HEAD", "/cts/v1/users/" + userId, false);
				xhrHeadReq.setRequestHeader("md5", md5);
				xhrHeadReq.setRequestHeader("token", tokenID);
				xhrHeadReq.setRequestHeader("file", replaceImageText);
				xhrHeadReq.send();

				if (xhrHeadReq.status == 404) {

					console.log('test');

					console.log(xhrHeadReq.status);
					var formdata = new FormData();
					formdata.append("fileData", fileData);
					var xhrFileReq = new XMLHttpRequest();
					xhrFileReq.open("POST", "/cts/v1/users/" + userId, false);
					xhrFileReq.setRequestHeader("md5", md5);
					xhrFileReq.setRequestHeader("token", tokenID);
					xhrFileReq.setRequestHeader("file", replaceImageText);
					xhrFileReq.send(formdata);
					if (xhrFileReq.status == 200) {

						console.log('파일 전송 성공');
						console.log(xhrFileReq.status);

					} else {

						console.log(xhrFileReq.status);

						alert('첨부 파일 전송에 실패 하였습니다!');
						return false;
					}
				} else if (xhrHeadReq.status == 409) {

					console.log(xhrHeadReq.status);
					console.log('파일이 존재함');
				} else {

					console.log(xhrHeadReq.status);

					alert('첨부 파일 전송에 실패 하였습니다!');
					return false;
				}

				// 이미지 파일일 경우 thumbnail 전송
				if (fileFormat == "jpg" || fileFormat == "jpeg"
						|| fileFormat == "png") {
					var xhrHeadThumReq = new XMLHttpRequest();
					xhrHeadThumReq.open("HEAD", "/cts/v1/users/" + userId
							+ "/thumb", false);
					xhrHeadThumReq.setRequestHeader("md5", md5);
					xhrHeadThumReq.setRequestHeader("token", tokenID);
					xhrHeadThumReq.setRequestHeader("file", ".png");
					xhrHeadThumReq.send();
					if (xhrHeadThumReq.status == 404) {
						console.log(xhrHeadThumReq.status);
						var thumbNail = $('#pms-sysadmin-thumbnail').val();
						console.log('썸네일');
						console.log(thumbNail);
						if (thumbNail == null || thumbNail == "") {

							alert('첨부 파일 전송에 실패 하였습니다!');
							return false;
						}
						thumbNail = dataURItoBlob(thumbNail);
						var formDataThumb = new FormData();
						formDataThumb.append("fileData", thumbNail);
						var xhrFileThumReq = new XMLHttpRequest();
						xhrFileThumReq.open("POST", "/cts/v1/users/" + userId
								+ "/thumb", false);
						xhrFileThumReq.setRequestHeader("md5", md5);
						xhrFileThumReq.setRequestHeader("token", tokenID);
						xhrFileThumReq.setRequestHeader("file", ".png");
						xhrFileThumReq.send(formDataThumb);
						if (xhrFileThumReq.status == 200) {

							console.log('썸 파일 전송 성공');
							console.log(xhrFileThumReq.status);

						} else {

							console.log(xhrFileThumReq.status);

							alert('첨부 파일 전송에 실패 하였습니다!');
							return false;
						}
					} else if (xhrHeadThumReq.status == 409) {

						console.log(xhrHeadThumReq.status);
						console.log('파일이 존재함');
					} else {

						console.log(xhrHeadThumReq.status);

						alert('첨부 파일 전송에 실패 하였습니다!');
						return false;
					}

				}
			} else {

			}

		}
		// file end
		var input_messageTarget = $('#message-send-target-input').val();
		var input_messageService = $('#message-send-service-input').val();
		var input_messageContent = $('#message-send-textarea').val();
		var input_messageType = $('#message-send-messageType-input').val();
		input_messageContent = utf8_to_b64(input_messageContent);
		var input_reservation = $('#message-send-reservationdate-input').val();
		var input_resendCount = $('#message-send-resendCount-input').val();
		var input_resendInterval = $('#message-send-resendInterval-input')
				.val();
		var input_messageExpire = $('#message-send-messageExpire-input').val();
		var qos = 0;
		qos = $("#message-send-qos-select").val();
		var contentType = $("#message-send-contentType-select").val();

		if (contentType == 1) {
			contentType = "application/base64";
		}
		var dateResult = "";

		if (input_reservation != "") {
			dateResult = dateFormating(input_reservation);
			dateResult = dateResult.toISOString();
		}

		input_messageTarget = input_messageTarget.split(",");

		messageData.receivers = input_messageTarget;
		messageData.content = input_messageContent;
		messageData.serviceId = input_messageService;
		messageData.contentType = contentType;
		messageData.ack = ackcheck;
		messageData.msgType = input_messageType;
		messageData.qos = qos;
		messageData.expiry = input_messageExpire;
		if (dateResult != "") {
			messageData.reservationTime = dateResult;
		}

		if (input_resendCount != 0) {
			messageData.resendMaxCount = input_resendCount;
		}
		if (input_resendInterval != "") {
			messageData.resendInterval = input_resendInterval;
		}
		var messageDataResult = JSON.stringify(messageData);

		if (utf8ByteLength(messageDataResult) > 512000) {
			alert('메시지 사이즈가 너무 큽니다.');
			return false;
		}

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

				if (!data.result.errors) {
					alert('메시지를 발송하였습니다.');
					wrapperFunction('MessageSendAdm');
				} else {
					alert("메시지 전송에 실패 하였습니다.");
					wrapperFunction('MessageSendAdm');
				}

			},
			error : function(data, textStatus, request) {
				alert('메시지 전송에 실패 하였습니다.');
				wrapperFunction('MessageSendAdm');
			}
		});

	}

}

// "change #excel-image-upload-input" : "changeFile"
$("#pms-sysadmin-image-upload-form")
		.change(
				function(e) {
					console.log(e.target.files[0].size);
					var maxSize = 3 * 1024 * 1024;
					if (e.target.files[0].size > maxSize) {
						alert('파일 첨부 용량을 초과 하였습니다(3MB 이하)');
						// $('.remove').click();
						return false;

					}

					// create md5
					var blobSlice = File.prototype.slice
							|| File.prototype.mozSlice
							|| File.prototype.webkitSlice, file = e.target.files[0], chunkSize = 3 * 1024 * 1024, // read
					chunks = Math.ceil(file.size / chunkSize), currentChunk = 0, spark = new SparkMD5.ArrayBuffer(), frOnload = function(
							e) {
						console.log("read chunk nr", currentChunk + 1, "of",
								chunks);
						spark.append(e.target.result); // append array buffer
						currentChunk++;
						if (currentChunk < chunks) {
							loadNext();
						} else {
							console.log("finished loading");
							var md5Result = spark.end();
							console.info("computed hash", md5Result); // compute

							$('#pms-sysadmin-md5').val(md5Result);

							// hash
						}
					}, frOnerror = function() {
						console.warn('oops, something went wrong.');
					};
					function loadNext() {
						var fileReader = new FileReader();
						fileReader.onload = frOnload;
						fileReader.onerror = frOnerror;
						var start = currentChunk * chunkSize, end = ((start + chunkSize) >= file.size) ? file.size
								: start + chunkSize;
						fileReader.readAsArrayBuffer(blobSlice.call(file,
								start, end));
					}
					;
					loadNext();

					// get thumbnail
					function GetThumbnail(e) {
						var myCan = document.createElement('canvas');
						var img = new Image();
						img.src = e.target.result;
						img.onload = function() {

							myCan.id = "myTempCanvas";
							var tsize = 128;
							myCan.width = Number(tsize);
							myCan.height = Number(tsize);
							if (myCan.getContext) {
								var cntxt = myCan.getContext("2d");
								cntxt.drawImage(img, 0, 0, myCan.width,
										myCan.height);
								var dataURL = myCan.toDataURL("image/png");

								if (dataURL != null && dataURL != undefined) {
									// var nImg = document.createElement('img');
									// nImg.src = dataURL;
									// document.body.appendChild(nImg);
									console.log('썸네일 이미지');
									console.log(dataURL);
									$('#pms-sysadmin-thumbnail').val(dataURL);

								} else
									console.log('unable to get context');

							}

						}

					}
					;

					// create thumbnail
					if (e.target.files == null || e.target.files == undefined) {
						document
								.write("This Browser has no support for HTML5 FileReader yet!");
						return false;
					}

					for (var i = 0; i < e.target.files.length; i++) {
						var file = e.target.files[i];
						var imageType = /image.*/;

						if (!file.type.match(imageType)) {
							console.log('이미지가 아님');
							$('#pms-sysadmin-thumbnail').val("");
							// $('#file-thumbnail')
							// .val(
							// '
							// data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA6klEQVRYR+2W0Q3CMAxErxuwCWwAbASTwEbABmUTRkBGDWrBTs9xkJCafFXtNe/Vqhx34NcVwJaM3wDsmGzHhIZME2gVaBVoFVhGBc4A1kZ33ABYkZ3zAaA3sncAh/TssxULQEptSZB8MyZwOSNE8LW0s+BXEl9wS0Du15ZQ4TmBmhImfE6ghkQWzghEJGbhrECJBAX3CHgkaLhXgJFwwUsEchJueKmAJlEEjwiMJeR60l49/dozlmv7psPp3ds98GgFvCw1H61AWOKvBGTgOIU/idvgmAaWcQXkT75w74dT+2HwmQwkyxR4AlZFRiG75B1tAAAAAElFTkSuQmCC');
							//
							// continue;

						}

						var reader = new FileReader();

						if (reader != null) {

							reader.onload = GetThumbnail;
							reader.readAsDataURL(file);
						}

					}

				});

// formCheck
function messageSendFormCheck() {
	var input_messageTarget = $('#message-send-target-input').val();
	var input_messageService = $('#message-send-service-input').val();
	var input_messageType = $('#message-send-messageType-input').val();
	var input_messageExpire = $('#message-send-messageExpire-input').val();
	var input_messageContent = $('#message-send-textarea').val();
	var input_resendCount = $('#message-send-resendCount-input').val();
	var input_resendInterval = $('#message-send-resendInterval-input').val();
	var input_reservation = $('#message-send-reservationdate-input').val();

	input_messageContent = compactTrim(input_messageContent);

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

	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_resendCount)) {
			input_resendCount = input_resendCount * 1;
			if (input_resendCount > 10) {
				alert('반복 횟수는 최대 10번까지 가능합니다.');
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

	} else {
		var num_check = /^[0-9]*$/;
		if (num_check.test(input_resendInterval)) {

		} else {
			alert("숫자만 입력가능합니다.");
			$('#message-send-resendInterval-input').focus();
			return false;
		}
		
		if(input_resendInterval==0){
			alert('0 은 입력 할수 없습니다!');
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
			return true;
		} else {
			return false;
		}

	}

	return true;

}
