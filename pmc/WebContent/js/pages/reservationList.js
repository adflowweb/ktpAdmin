var reservationListToken = sessionStorage.getItem("token");
var reservationListRole=sessionStorage.getItem("role");
var reservationListTable = $('#reservation-datatable').dataTable(
		{
			'bSort' : false,
			'bServerSide' : true,
			'dom' : 'T<"clear">lrtip',
			'columns' : [ {
				"data" : "msgId"
			}, {
				"data" : "updateId"
			}, {
				"data" : "receiver"
			}, {
				"data" : "reservationTime"
			} ],
			'sPaginationType' : 'full_numbers',
			'sAjaxSource' : '/v1/pms/adm/'+reservationListRole+'/messages/reservations',
			'fnServerData' : function(sSource, aoData, fnCallback) {
				$.ajax({
					dataType : 'json',
					contentType : 'application/json;charset=UTF-8',
					type : 'GET',
					url : sSource,
					headers : {
						'X-Application-Token' : messageListToken
					},
					data : aoData,

					success : function(data) {
						var dataResult = data.result.data.data;
						if (dataResult) {
							console.log('/v1/pms/adm/'+reservationListRole+'/messages/reservations(GET)');
							console.log(dataResult);
							if(dataResult.length==0){
								$("#reservaton-checkbox-id").hide();
							}
							$('#reservationListCnt_div')
							.text(
									data.result.data.recordsTotal);
							for ( var i in dataResult) {						
								var dateTime = dataResult[i].reservationTime;
								dataResult[i].msgId='<input name="reservatoin-checkbox" type="checkbox" value="'+dataResult[i].msgId+'"/>&nbsp;'+dataResult[i].msgId;
								console.log("dateTime:"+dateTime);
								if(dateTime!=null){
									dataResult[i].reservationTime = new Date(dateTime)
									.toLocaleString();
								}

							}

							data.result.data.data = dataResult;
							fnCallback(data.result.data);

						} else {
							alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');

						}

					},
					error : function(e) {
						alert('발송 메시지 목록을 가지고 오는데 실패 하였습니다.');
					}
				});
			},

			'fnServerParams' : function(aoData) {
				var searchSelectValue = $('#reservation-search-select').val();
				var searchSelectText = $(
						'#reservation-search-select option:selected').text();
				var searchInputValue = $('#reservation-search-input').val();
				var messageMonth = $('#reservation-date-input').val();
				searchSelectValue = searchSelectValue * 1;

				switch (searchSelectValue) {
				case 0:
					aoData.push({
						'name' : 'cSearchStatus',
						'value' : 'ALL'
					});
					break;
				// msgid
				case 1:
					searchSelectText = "msgId";
					aoData.push({
						'name' : 'cSearchFilter',
						'value' : searchSelectText
					});
					aoData.push({
						'name' : 'cSearchContent',
						'value' : searchInputValue
					});
					aoData.push({
						'name' : 'cSearchStatus',
						'value' : 'ALL'
					});

					break;
				// receiver
				case 2:
					searchSelectText = "receiver";

					aoData.push({
						'name' : 'cSearchFilter',
						'value' : searchSelectText
					});
					aoData.push({
						'name' : 'cSearchContent',
						'value' : searchInputValue
					});
					aoData.push({
						'name' : 'cSearchStatus',
						'value' : 'ALL'
					});

					break;
				
				default:

					break;
				}

				if (messageMonth == null || messageMonth == "") {
					var nowDate = new Date();
					var year = nowDate.getFullYear();
					var month = nowDate.getMonth() + 1;
					console.log(month);
					if (month < 10) {
						month = '0' + month;
					}
					console.log(year + "/" + month);
					messageMonth = year + "/" + month;

					$('#reservation-date-input').val(messageMonth);
				}

				messageMonth = messageMonth.replace("/", "");

				aoData.push({
					'name' : 'cSearchDate',
					'value' : messageMonth
				});

				console.log("메시지 리스트  aoData");
				console.log(aoData);
				console.log("메시지 리스트  aoData");

			}

		});

$('#reservation-search-btn').click(function() {



});

function reservationSearch(){
	console.log('reservation search click function..');
	var formCheck = checkSearchReservation();

	if (formCheck) {
		reservationListTable.fnFilter();
	} else {
		console.log('검색항목 선택 안함!!');
	}
}


function reservationCheck(source) {
	  checkboxes = document.getElementsByName('reservatoin-checkbox');
	  for(var i=0, n=checkboxes.length;i<n;i++) {
	    checkboxes[i].checked = source.checked;
	  }
	}




function reservationCancelFunction() {
	
	var checkedLength=$('input[name="reservatoin-checkbox"]:checked').length;
	if(checkedLength==0){
		alert('취소할 메시지를 선택해주세요');
		return false;
	}else{
		$('input[name="reservatoin-checkbox"]:checked').each(function() {
			
			   if(this.value!="on"){
				   console.log(this.value);
			   }
			});

	}
	
	
}

function checkSearchReservation() {

	var selectOptionValue = $('#reservation-search-select').val();
	var inputSearchValue = $('#reservation-search-input').val();
	console.log("서치 벨류" + inputSearchValue);
	console.log('selectOptjionValue:' + selectOptionValue);
	inputSearchValue = compactTrim(inputSearchValue);
	console.log(inputSearchValue);
	if (selectOptionValue != 0) {

		if (inputSearchValue == null || inputSearchValue == "") {
			alert('검색할 내용을 입력해 주세요');
			$('#reservation-search-inputt').focus();
			return false;

		}

	} else if (inputSearchValue != null && inputSearchValue != "") {
		console.log(inputSearchValue);

		if (selectOptionValue == 0) {
			alert('검색 항목을 선택해주세요');

			return false;
		}

	}
	return true;

}

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