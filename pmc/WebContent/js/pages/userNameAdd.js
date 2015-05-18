function userAddNameFunction() {
	var formCheck = userNameAddFormCheck();
	var userToken = sessionStorage.getItem("token");
	if (formCheck) {
		if (confirm("발송번호를 등록 하시겠습니까?") == true) {
			var first_info_name_input = $('#first-info-name-input').val();

			var userNameAdd = new Object();
			userNameAdd.userName = first_info_name_input;
			var userNameAddReq = JSON.stringify(userNameAdd);

			$.ajax({
				url : '/v1/pms/adm/svc/users/name',
				type : 'PUT',
				contentType : "application/json",
				headers : {
					'X-Application-Token' : userToken
				},
				dataType : 'json',
				data : userNameAddReq,

				async : false,
				success : function(data) {
					if (!data.result.errors) {
						alert('발송번호를 등록하였습니다.');
						// console.log('이름 변경 성공');
						sessionStorage.setItem("userName",
								first_info_name_input);

						$("#page-wrapper").load(
								"pages/messageListPageWrapper.html",
								function() {
									svcLogin();

								});

					} else {
						alert('발송번호 등록에 실패 하였습니다.');
						// console.log('이름 업데이트 실패');
					}

				},
				error : function(data, textStatus, request) {
					alert('발송번호 등록에 실패 하였습니다.');
					// console.log('이름 업데이트 실패');
				}
			});
		} else {
			return;
		}

	}

}

function userNameAddFormCheck() {
	var first_info_name_input = $('#first-info-name-input').val();

	if (first_info_name_input == "" || first_info_name_input == null) {
		alert('발송번호를 입력해주세요');
		$('#first-info-name-input').focus();
		return false;
	}

	return true;

}