var userInfoToken = sessionStorage.getItem("token");
var userInfoRole = sessionStorage.getItem("role");

$.ajax({
	url : '/v1/pms/adm/' + userInfoRole + '/account',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : userInfoToken
	},
	dataType : 'json',
	async : false,

	success : function(data) {
		
		var dataResult = data.result.data;
		if (dataResult) {
			if (!data.result.errors) {
				console.log( '/v1/pms/adm/' + userInfoRole + '/account(GET)');
				console.log(dataResult);
				$('#userInfo-id-input').val(dataResult.userId);
				$('#userInfo-name-input').val(dataResult.userName);
				$('#userInfo-token-input').val(dataResult.applicationToken);
			} else {

				alert(data.result.errors[0]);
			}
		} else {

			// alert('계정 목록을 가지고오는데 실패하였습니다.');
		}

	},
	error : function(data, textStatus, request) {

		// alert('계정 목록을 가지고오는데 실패하였습니다.');
	}
});

function userInfoConfirm() {
	var daddy = window.self;
	daddy.opener = window.self;
	daddy.close();
}