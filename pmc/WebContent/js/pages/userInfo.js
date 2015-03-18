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

		if (!data.result.errors) {
			var dataResult = data.result.data;

			$('#userInfo-id-input').val(dataResult.userId);
			$('#userInfo-name-input').val(dataResult.userName);
			$('#userInfo-token-input').val(dataResult.applicationToken);
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