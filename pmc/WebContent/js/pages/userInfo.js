//getToken
var userInfoToken = sessionStorage.getItem("token");
// getRole
var userInfoRole = sessionStorage.getItem("role");
// getAccount Info
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
		console.log('성공');
		if (!data.result.errors) {
			var dataResult = data.result.data;
			console.log(dataResult);
			$('#userInfo-id-input').val(dataResult.userId);
			$('#userInfo-name-input').val(dataResult.userName);
			if (userInfoRole == "svc") {
				$('#userInfo-name-div').hide();
			}

			// $('#userInfo-token-input').val(dataResult.applicationToken);
			$('#userInfo-phone-input').val(dataResult.ufmi);
		} else {

			alert('계정 목록을 가지고오는데 실패하였습니다.');
		}

	},
	error : function(data, textStatus, request) {

		// alert('계정 목록을 가지고오는데 실패하였습니다.');
	}
});
// confirm
function userInfoConfirm() {
	var daddy = window.self;
	daddy.opener = window.self;
	daddy.close();
}