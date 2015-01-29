var reservationTable = $('#reservation-datatable').dataTable(
		{
			// "bProcessing" : true,
			'bSort' : false,
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
					success : fnCallback,
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
				var searchSelectValue = $('#reservation-search-select').val();
				var searchSelect = $(
						'#reservation-search-select option:selected').text();
				var searchInputValue = $('#reservation-search-input').val();
				if (searchSelectValue == 0) {
					searchSelect = "";
				}

				if (searchInputValue == null || searchInputValue == "") {
					searchInputValue = "";
				}

				aoData.push({
					'name' : 'searchSelect',
					'value' : searchSelect
				});
				aoData.push({
					'name' : 'searchValue',
					'value' : searchInputValue
				});

			}

		});

$('#reservation-search-btn').click(function() {

	console.log('reservation search click function..');
	var formCheck = checkSearchReservation();

	if (formCheck) {
		reservationTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}

});

function checkSearchReservation() {

	var selectOptionValue = $('#reservation-search-select').val();
	var inputSearchValue = $('#reservation-search-input').val();
	console.log("selectOptjionValue:" + selectOptionValue);

	if (selectOptionValue == 0) {
		alert('검색할 항목을 선택해 주세요');
		return false;
	} else if (inputSearchValue == null || inputSearchValue == "") {
		alert('검색할 내용을 입력해 주세요');
		return false;
	} else {
		return true;
	}

}

$('#reservation-datatable tbody').on('click', 'tr', function() {

	var tableDataRow = $(this).children('td').map(function() {
		return $(this).text();
	}).get();

	console.log(tableDataRow[0]);
	$('#reservation-cancel-input').val(tableDataRow[0]);

	for (var i = 0; i < tableData.length; i++) {
		console.log('in for');
		console.log(tableData[i].MessageId);
		if (tableData[i].MessageId == tableDataRow[0]) {
			console.log(tableData[i].MessageId);
			$('.reservation-detail-p').html(tableData[i].content);
			$('.reservation-title-p').html(tableData[i].title);
		}
	}

});

function reservationCancelFunction() {
	console.log('reservationCancelFunction...');
	var checkForm = cancelFormCheck();
	if (checkForm) {
		var tokenID = sessionStorage.getItem('tokenID');

		if (tokenID) {
			loginUserId = sessionStorage.getItem('userID');
			console.log(loginUserId);
			var input_reservationCancelID = $('#reservation-cancel-input')
					.val();

			$.ajax({
				url : '/v1/messages/' + input_reservationCancelID,
				type : 'DELETE',
				headers : {
					'X-ApiKey' : tokenID
				},
				contentType : 'application/json',
				dataType : 'json',
				async : false,
				success : function(data) {
					console.log(data);
					console.log(data.result.success);
					if (data.result.success) {
						alert("예약된 메세지를 취소하였습니다.");
						$('#reservation-cancel-input').val("");
						$('#reservation-cancel-input').focus();
						wrapperFunction('reservation');
					} else {
						alert("예약된 메세지를 취소에 실패했습니다.");
						$('#reservation-cancel-input').val("");
						$('#reservation-cancel-input').focus();

					}
				},
				error : function(data, textStatus, request) {
					alert("예약된 메세지를 취소에 실패했습니다.");
					$('#reservation-cancel-input').val("");
					$('#reservation-cancel-input').focus();

					console.log(data);
				}
			});
		}
	}
}

// form check..
function cancelFormCheck() {
	var input_reservationCancelID = $('#reservation-cancel-input').val();
	if (input_reservationCancelID == null || input_reservationCancelID == "") {
		alert('예약을 취소할 대상을 선택해 주세요.');
		$('#reservation-cancel-input').focus();
		return false;
	}

	else {
		return true;
	}

}