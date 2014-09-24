var tokenID = sessionStorage.getItem("tokenID");
function tokenSearch() {
	var checkForm = formCheck();
	var input_subscribe = $('#input_subscribe').val();

	if (checkForm) {

		$.ajax({
			url : '/v1/tokenMulti/' + input_subscribe,
			type : 'GET',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			async : false,
			success : function(data) {
				var tableData = [];
				if (data.result.data) {

					for ( var i in data.result.data) {

						var item = data.result.data[i];
						console.log(item);
						tableData.push({
							"TokenID" : item.tokenID,
							"UserID" : item.userID
						});
					}

					console.log(tableData);
					$('#dataTable_Token').dataTable({
						bJQueryUI : true,
						bDestroy: true,
						aaData : tableData,
						aoColumns : [ {
							mData : 'TokenID'
						}, {
							mData : 'UserID'
						} ]
					});
					
					// 토큰클릭
					$('#dataTable_Token tbody').on('click', 'tr', function() {
						
						var tableData = $(this).children("td").map(function() {
							return $(this).text();
						}).get();

						console.log(tableData[0]);
						// - ** MQTT Clinet Status 가져오기 **
						// > **request : **
						// *method : GET
						// header : X-ApiKey:{tokenID}
						// uri : /v1/mQTTClinetStatus/{tokenID}*
						// >
						// > **response : **
						// *{"result":{"success":true,"data":{"status":"MQTT Connetted"}}}*
						// v1/token/tokenID delete info
						var token = tableData[0];
						var hiddenUserID = tableData[1];
						$('#hiddenUserID').val(hiddenUserID);
						$('#h3_tokenid').val(token+"("+hiddenUserID+")");
						$.ajax({
							url : '/v1/clients/' + token,
							type : 'GET',
							headers : {
								'X-ApiKey' : tokenID
							},
							contentType : "application/json",
							async : false,
							success : function(data) {
								var tableData = [];
								if (data.result.data) {
								
									console.log(data.result.data.status);
									$('#h2_tokenstatus').val(data.result.data.status);
								} else {
									alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
									wrapperFunction('tokenManager');
								}
							},
							error : function(data, textStatus, request) {
								console.log(data);
								alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
								wrapperFunction('tokenManager');
							}
						});

					});
					
					
				} else {
					alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
				}
			},
			error : function(data, textStatus, request) {
				console.log(data);
				alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
			}
		});

	}

}



// 토큰 삭제

function tokenDelete() {
	var formCheck = tokenIDFormCheck();
	var h3_tokenid = $('#h3_tokenid').val();
	var tokenIdArr=[];
	tokenIdArr=h3_tokenid.split('(');
	var hiddenUserID=$('#hiddenUserID').val();
	if (formCheck) {
		$.ajax({
			url : '/v1/token/' + tokenIdArr[0],
			type : 'DELETE',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			async : false,
			success : function(data) {

				if (data.result.info) {
					//////
					$.ajax({
						url : '/v1/users/' + hiddenUserID,
						type : 'DELETE',
						headers : {
							'X-ApiKey' : tokenID
						},
						contentType : "application/json",
						dataType : 'json',
						async : false,

						success : function(data) {
							console.log(data);
							console.log(data.result.success);
							if (data.result.info) {
								
								alert('토큰(유저)을 삭제 하였습니다.');
								wrapperFunction('tokenManager');
							} else {
								alert('토큰(유저)을 삭제하는데 실패 하였습니다.');
								wrapperFunction('tokenManager');
							}
						},
						error : function(data, textStatus, request) {
							alert('토큰(유저)을 삭제하는데 실패 하였습니다.');
							wrapperFunction('tokenManager');
							console.log(data);
						}
					});
					
					/////
					
				
				} else {
					alert('토큰(유저)을 삭제 하는데 실패 하였습니다.');
					wrapperFunction('tokenManager');
				}
			},
			error : function(data, textStatus, request) {
				console.log(data);
				alert('토큰(유저)을 삭제 하는데 실패 하였습니다.');
				wrapperFunction('tokenManager');
			}
		});

	}

}

function tokenSubscribe() {
	var formCheck = tokenIDFormCheck();
	var h3_tokenid = $('#h3_tokenid').val();
	var tokenIdArr=[];
	tokenIdArr=h3_tokenid.split('(');
	if (formCheck) {

		$.ajax({
			url : '/v1/subscriptions/' + tokenIdArr[0],
			type : 'GET',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			async : false,
			success : function(data) {
				var tableData = [];
				if (data.result.data) {

					for ( var i in data.result.data) {

						var item = data.result.data[i];
						console.log(item);
						tableData.push({
							"Topic" : item.topic,
						});
					}

					console.log(tableData);
					$('#dataTable_Topic').dataTable({
						bJQueryUI : true,
						bDestroy: true,
						aaData : tableData,
						aoColumns : [ {
							mData : 'Topic'
						} ]
					});
				}

				else if (data.result.info) {
					alert('subscription 정보가 없습니다.');
//					wrapperFunction('tokenManager');
					tableData.push({
						"Topic" : "subscription 정보가 없습니다.",
					});
					$('#dataTable_Topic').dataTable({
						bJQueryUI : true,
						bDestroy: true,
						aaData : tableData,
						aoColumns : [ {
							mData : 'Topic'
						} ]
					});
				} else {
					alert('subscription 정보를 가지고 오는데 실패 하였습니다.');
					wrapperFunction('tokenManager');
				}
			},
			error : function(data, textStatus, request) {
				console.log(data);
				alert('subscription 정보를 가지고 오는데 실패 하였습니다.');
				wrapperFunction('tokenManager');
			}
		});

	}
}

function formCheck() {

	var input_subscribe = $('#input_subscribe').val();

	if (input_subscribe == "" || input_subscribe == null) {

		alert('대상을 입력해 주세요');
		$('#input_subscribe').focus();
		return false;

	}
	return true;

}

function tokenIDFormCheck() {
	var h3_tokenid = $('#h3_tokenid').val();

	if (h3_tokenid == "" || h3_tokenid == null) {

		alert('토큰 대상을 입력해 주세요');
		$('#h3_tokenid').focus();
		return false;

	}
	return true;

}
