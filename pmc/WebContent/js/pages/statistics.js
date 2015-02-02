$("#statistics-search-date-start-input").prop('disabled', true);
$("#statistics-search-date-end-input").prop('disabled', true);

// get adm/sys/users
var statisticsToken = sessionStorage.getItem("token");
$.ajax({
	url : '/adm/sys/users',
	type : 'GET',
	contentType : "application/json",
	headers : {
		'X-Application-Token' : statisticsToken
	},
	dataType : 'json',
	async : false,
	statusCode : {
		200 : function(data) {
			console.log("200..");
		},
		401 : function(data) {
			alert("토큰이 만료 되어 로그인 화면으로 이동합니다.");
			$("#page-wrapper").load("pages/login.html", function() {
				$('#ul_userInfo').hide();
				$('.navbar-static-side').hide();
				$('#loginId').keypress(function(e) {
					if (e.keyCode != 13)
						return;
					$('#loginPass').focus();
				});
				$('#loginPass').keypress(function(e) {
					if (e.keyCode != 13)
						return;
					$("#login_ahref").click();

				});

			});
		}
	},
	success : function(data) {
		console.log("ajax data!!!!!");
		console.log(data);
		console.log("ajax data!!!!!");

		console.log('login in ajax call success');
		var loginResult = data.result.data;

		if (loginResult) {
			if (!data.result.errors) {

				for ( var i in data.result.data) {
					var successData = data.result.data[i];
					console.log(successData.role);
					if (successData.role == "sys") {

					} else {
						$("#statistics-account-select").append(
								"<option value='" + (i * 1 + 1) + "'>"
										+ successData.userId + "</option>");
					}

				}

			} else {

				alert(data.result.errors[0]);
			}
		} else {

			alert('계정 목록을 가지고오는데 실패하였습니다.');
		}

	},
	error : function(data, textStatus, request) {

		alert('계정 목록을 가지고오는데 실패하였습니다.');
	}
});

var statisticsTable = $('#statistics-datatable').dataTable(
		{
			// "bProcessing" : true,
			'bServerSide' : true,
			'dom' : 'T<"clear">lrtip',
			'columns' : [ {
				"data" : "msg_id"
			}, {
				"data" : "sender"
			}, {
				"data" : "receiver"
			}, {
				"data" : "time"
			}, {
				"data" : "ackcheck"
			} ],
			// "tableTools" : {
			// "sSwfPath" : "swf/copycsvxlspdf.swf"

			// "aButtons" : [ {
			// "sExtends" : "xls",
			// "sButtonText" : "excel",
			// "sFileName" : "*.xls"
			// }, "copy", "pdf" ]
			// },

			'sPaginationType' : 'full_numbers',
			'sAjaxSource' : '/adflow/v1',
			// custom ajax
			'fnServerData' : function(sSource, aoData, fnCallback) {
				$.ajax({
					dataType : 'json',
					contentType : 'application/json;charset=UTF-8',
					type : 'GET',
					url : sSource,
					headers : {
						'X-ApiKey' : 'chanho'
					},
					data : aoData,
					success : function(data) {
						console.log(data.data);
						var dataResult = data.data;
						console.log(dataResult);
						for ( var i in dataResult) {
							if (dataResult[i].ackcheck == 5) {
								var addObj = dataResult[i].ackcheck;
								dataResult[i].ackcheck = addObj + "3";
							}
						}
						data.data = dataResult;
						fnCallback(data);
					},
					error : function(e) {
						console.log('error');
						$('#error').html(e.responseText);
					}
				});
			},
			//
			// },
			// custom params
			'fnServerParams' : function(aoData) {
				var accountSelectValue = $('#statistics-account-select').val();
				var searchSelectValue = $('#statistics-search-select').val();
				var searchSelectText = $(
						'#statistics-search-select option:selected').text();
				var accountSelectText = $(
						'#statistics-account-select option:selected').text();
				var searchInputValue = $('#statistics-search-input').val();

				var searchDateStart = $('#statistics-search-date-start-input')
						.val();
				var searchDateEnd = $('#statistics-search-date-end-input')
						.val();

				searchDateStart = dateFormating(searchDateStart);
				if (searchDateStart) {
					searchDateStart = searchDateStart.toISOString();
				}

				searchDateEnd = dateFormating(searchDateEnd);
				if (searchDateEnd) {
					searchDateEnd = searchDateEnd.toISOString();
				}

				if (searchSelectValue == 0) {
					searchSelectText = "";
				}

				if (accountSelectValue == 0) {
					accountSelectText = "";
				}

				if (searchInputValue == null || searchInputValue == "") {
					searchInputValue = "";
				}

				aoData.push({
					'name' : 'accountSelect',
					'value' : accountSelectText
				});

				aoData.push({
					'name' : 'searchSelect',
					'value' : searchSelectText
				});
				aoData.push({
					'name' : 'searchValue',
					'value' : searchInputValue
				});
				aoData.push({
					'name' : 'searchDateStart',
					'value' : searchDateStart
				});
				aoData.push({
					'name' : 'searchDateEnd',
					'value' : searchDateEnd
				});

			}

		});

$('#statistics-search-btn').click(function() {

	console.log('target click function..');
	var formCheck = checkSearchStatistics();

	if (formCheck) {
		statisticsTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}

});

$("#statistics-account-select").change(function() {

	var accountSelectValue = $('#statistics-account-select').val();
	$('#statistics-search-date-start-input').val("");
	$('#statistics-search-date-end-input').val("");
	$('#statistics-search-input').val("");
	$("#statistics-search-select option:eq(0)").attr("selected", "selected");

	if (accountSelectValue === 0) {

	} else {
		statisticsTable.fnFilter();
	}

});

function checkSearchStatistics() {

	var selectOptionValue = $('#statistics-search-select').val();
	var inputSearchValue = $('#statistics-search-input').val();
	var searchDateStart = $('#statistics-search-date-start-input').val();
	searchDateStart = dateFormating(searchDateStart);

	if (typeof searchDateStart === undefined
			|| typeof searchDateStart === 'undefined') {
		console.log("dsearchDateStart id undefined ");
		searchDateStart = "";
	}

	var searchDateEnd = $('#statistics-search-date-end-input').val();

	searchDateEnd = dateFormating(searchDateEnd);
	if (typeof searchDateEnd === undefined
			|| typeof searchDateEnd === 'undefined') {
		console.log("dsearchDateEnd.....");
		searchDateEnd = "";
	}

	console.log('selectOptjionValue:' + selectOptionValue);

	if (selectOptionValue == 0) {
		alert('검색할 항목을 선택해 주세요');
		return false;
	} else if (inputSearchValue == null || inputSearchValue == "") {
		alert('검색할 내용을 입력해 주세요');
		return false;
	} else if (searchDateStart != null && searchDateStart != "") {
		console.log(searchDateStart);
		if (searchDateEnd == null || searchDateEnd == "") {
			alert('검색 종료일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}

		}

	} else if (searchDateEnd != null && searchDateEnd != "") {

		if (searchDateStart == null || searchDateStart == "") {
			alert('검색 시작일을 입력해 주세요');
			return false;
		} else {
			if (searchDateStart >= searchDateEnd) {
				alert('검색 시작일이 종료일보다 클 수 없습니다');
				return false;
			} else {
				return true;
			}
		}
	} else {
		return true;
	}

}

// .columnFilter();

// $('#dataTables-example_filter input').unbind();
// $('#dataTables-example_filter input').bind('keyup', function(e) {
// if (e.keyCode == 13) {
// oTable.fnFilter(this.value);
// }
//
// });

// $('tfoot input').unbind();
//
// $('#send_dateButton').bind('click', function(e) {
//  
// oTable.fnFilter();
//
// });
// $('tfoot input').bind('keyup', function(e) {
// if (e.keyCode == 13) {
// oTable.fnFilter(this.value, $("tfoot input").index(this));
// }
//
// });

function excelExportFunction() {

}