$('#dataTables-example tbody').on('click', 'tr', function() {
	console.log('message list id click');

	var tableDataRow = $(this).children("td").map(function() {
		return $(this).text();
	}).get();

	console.log(tableDataRow[0]);
	var messageID=tableDataRow[0];
	var tokenID = sessionStorage.getItem("tokenID");
	console.log('메세지 아이디');
	console.log(messageID);


	$.ajax({
		url : '/v1/messages/'+messageID,
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
					var jsonContent=JSON.parse(item.content);

					$(".message_title").html(jsonContent.notification.contentTitle);
					$(".message_detail").html(jsonContent.notification.contentText);
			
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


