var tokenID = sessionStorage.getItem("tokenID");
var token_Table = "";
function tokenSearch() {
	var checkForm = formCheck();
	var input_subscribe = $('#input_subscribe').val();

	if (checkForm) {
		// #statistics-search-select option:selected
		var iDselectOptionV = $("#token-search-select option:selected").val();
		if (iDselectOptionV == 1) {
			$
					.ajax({
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
								
								//데이터 정렬 추가				
								var arrayData = data.result.data;
								for(var j=0; j<arrayData.length-1;j++){
									
									for(var i=0; i<arrayData.length-1;i++){
										if(arrayData[i].issue < arrayData[i+1].issue){
											var temp;
											temp = arrayData[i];
											arrayData[i]=arrayData[i+1];
											arrayData[i+1]=temp;
											
										}
										}
								
								}

								// 데이터 정렬 추가 종료 
								$('#amdin-token-list').show();
//데이터 최신순으로 재배
//								for ( var i in data.result.data) {
//									var item = data.result.data[i];
								for ( var i in arrayData) {
									var item = arrayData[i];
									console.log(item);
									tableData.push({
										"TokenID" : item.tokenID,
										"UserID" : item.userID
									});
								}

								// 기존 data 삭제

								if (token_Table != null && token_Table != "") {
									console.log('testconsole');
									$('#dataTable_Token').children().remove();
								}

								token_Table = $('#dataTable_Token').dataTable({
									aaSorting : [],
									bJQueryUI : true,
									bDestroy : true,
									aaData : tableData,
									aoColumns : [ {
										mData : 'TokenID'
									}, {
										mData : 'UserID'
									} ]
								});

								// 토큰클릭
								$('#dataTable_Token tbody')
										.on(
												'click',
												'tr',
												function() {

													var tableData = $(this)
															.children("td")
															.map(
																	function() {
																		return $(
																				this)
																				.text();
																	}).get();

													var token = tableData[0];
													var hiddenUserID = tableData[1];
													$('#hiddenUserID').val(
															hiddenUserID);
													$('#h3_tokenid')
															.val(
																	token
																			+ "("
																			+ hiddenUserID
																			+ ")");
													console.log(token);
													if (token === 'No data available in table') {

													} else {
														$('#amdin-token-status')
																.show();
													}
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

		} else {
			$
					.ajax({
						url : '/v1/tokens/ufmi/' + input_subscribe,
						type : 'GET',
						headers : {
							'X-ApiKey' : tokenID
						},
						contentType : "application/json",
						async : false,
						success : function(data) {
							var tableData = [];
							if (data.result.data) {
								
								//데이터 정렬 추가				
								var arrayData = data.result.data;
								for(var j=0; j<arrayData.length-1;j++){
									
									for(var i=0; i<arrayData.length-1;i++){
										if(arrayData[i].issue < arrayData[i+1].issue){
											var temp;
											temp = arrayData[i];
											arrayData[i]=arrayData[i+1];
											arrayData[i+1]=temp;
											
										}
										}
								
								}

								// 데이터 정렬 추가 종료 
								
								$('#amdin-token-list').show();

								//데이터 최신순으로 재배
//								for ( var i in data.result.data) {
//									var item = data.result.data[i];
								for ( var i in arrayData) {
									var item = arrayData[i];
									console.log(item);
									tableData.push({
										"TokenID" : item.tokenID,
										"ID" : item.ufmi
									});
								}

								// 기존 data 삭제

								if (token_Table != null && token_Table != "") {
									console.log('testconsole');
									$('#dataTable_Token').children().remove();
								}

								token_Table = $('#dataTable_Token').dataTable({
									aaSorting : [],
									bJQueryUI : true,
									bDestroy : true,
									aaData : tableData,
									aoColumns : [ {
										mData : 'TokenID'
									}, {
										mData : 'ID'
									} ]
								});
								// 토큰클릭
								$('#dataTable_Token tbody')
										.on(
												'click',
												'tr',
												function() {

													var tableData = $(this)
															.children("td")
															.map(
																	function() {
																		return $(
																				this)
																				.text();
																	}).get();

													var token = tableData[0];
													var hiddenUserID = tableData[1];
													$('#hiddenUserID').val(
															hiddenUserID);
													$('#h3_tokenid')
															.val(
																	token
																			+ "("
																			+ hiddenUserID
																			+ ")");
													console.log(token);
													if (token === 'No data available in table') {

													} else {
														$('#amdin-token-status')
																.show();
													}
												});
								// 토큰클릭
								// $('#dataTable_Token tbody')
								// .on(
								// 'click',
								// 'tr',
								// function() {
								//
								// var tableData = $(this)
								// .children("td")
								// .map(
								// function() {
								// return $(
								// this)
								// .text();
								// }).get();
								//
								//										
								// var token = tableData[0];
								// var hiddenUserID = tableData[1];
								// $('#hiddenUserID').val(
								// hiddenUserID);
								// $('#h3_tokenid').val(
								// token + "("
								// + hiddenUserID
								// + ")");
								// $
								// .ajax({
								// url : '/v1/clients/'
								// + token,
								// type : 'GET',
								// headers : {
								// 'X-ApiKey' : tokenID
								// },
								// contentType : "application/json",
								// async : false,
								// success : function(
								// data) {
								// var tableData = [];
								// if (data.result.data) {
								//
								// $(
								// '#h2_tokenstatus')
								// .val(
								// data.result.data.status);
								// } else {
								// alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
								// wrapperFunction('tokenManager');
								// }
								// },
								// error : function(
								// data,
								// textStatus,
								// request) {
								//
								// alert('토큰 정보를 가지고 오는데 실패 하였습니다.');
								// wrapperFunction('tokenManager');
								// }
								// });
								//
								// });

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

}

// 토큰 삭제

function tokenDelete() {
	var formCheck = tokenIDDeleteFormCheck();
	var h3_tokenid = $('#h3_tokenid').val();
	var tokenIdArr = [];
	tokenIdArr = h3_tokenid.split('(');
	var hiddenUserID = $('#hiddenUserID').val();
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
					// ////
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

					// ///

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
	var mq_list = $('#admin-mq-list-select').val();
	var tokenIdArr = [];
	mq_list = mq_list.split(':');

	tokenIdArr = h3_tokenid.split('(');
	if (formCheck) {

		$.ajax({
			url : '/v1/admin/subscriptions/' + tokenIdArr[0] + "?host="
					+ mq_list[0] + "&port=" + mq_list[1],
			type : 'GET',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			async : false,
			success : function(data) {
				var tableData = [];
				console.log(data);
				if (data.result.data) {
					if (data.result.info) {
						alert('subscription 정보가 없습니다.');
						// return;
						// wrapperFunction('tokenManager');
					}

					$('#amdin-token-subscriptions').show();
					for ( var i in data.result.data) {

						var item = data.result.data[i];
						console.log(item);
						tableData.push({
							"Topic" : item,
						});
					}

					console.log(tableData);
					$('#dataTable_Topic').dataTable({
						bJQueryUI : true,
						bDestroy : true,
						aaData : tableData,
						aoColumns : [ {
							mData : 'Topic'
						} ]
					});
				}

				else {
					alert('MQ서버가 동작중이지 않거나 연결 할 수 없습니다. ');

				}
			},
			error : function(data, textStatus, request) {
				console.log(data);
				alert('서버문제 정보를 가지고 오는데 실패 하였습니다.');
				wrapperFunction('tokenManager');
			}
		});

	}
}

function tokenConnectStatus() {
	var formCheck = tokenIDFormCheck();
	var h3_tokenid = $('#h3_tokenid').val();
	var mq_list = $('#admin-mq-list-select').val();
	var tokenIdArr = [];
	mq_list = mq_list.split(':');

	tokenIdArr = h3_tokenid.split('(');
	if (formCheck) {

		$.ajax({
			url : '/v1/admin/clients/' + tokenIdArr[0] + "?host=" + mq_list[0]
					+ "&port=" + mq_list[1],
			type : 'GET',
			headers : {
				'X-ApiKey' : tokenID
			},
			contentType : "application/json",
			async : false,
			success : function(data) {
				var tableData = [];
				console.log(data);
				if (data.result.data) {

					$('#amdin-token-connect-status').show();
					for ( var i in data.result.data) {

						var item = data.result.data[i];
						console.log(item);
						$("#admin-connect-list-ul").append(
								'<li class="list-group-item">' + mq_list[0]
										+ ':' + mq_list[1] + '   ' + item
										+ '</li>');
					}

				}

				else {
					alert('MQ서버가 동작중이지 않거나 연결 할 수 없습니다. ');

				}
			},
			error : function(data, textStatus, request) {
				console.log(data);
				alert('서버문제 정보를 가지고 오는데 실패 하였습니다.');
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
	var mq_list = $('#admin-mq-list-select').val();
	mq_list = mq_list * 1;
	switch (mq_list) {
	case 0:
		alert('조회대상 MQ를 선택해 주세요');
		return false;
		break;
	}
	if (h3_tokenid == "" || h3_tokenid == null) {

		alert('토큰 대상을 입력해 주세요');
		$('#h3_tokenid').focus();
		return false;

	}
	return true;

}

function tokenIDDeleteFormCheck() {
	var h3_tokenid = $('#h3_tokenid').val();

	if (h3_tokenid == "" || h3_tokenid == null) {

		alert('토큰 대상을 입력해 주세요');
		$('#h3_tokenid').focus();
		return false;

	}
	return true;

}
