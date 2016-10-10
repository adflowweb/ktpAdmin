var tokenID = sessionStorage.getItem("tokenID");


function userInfoSearch(){
//	wrapperFunction('provisioning');
	var checkForm = clusterFormCheck();
	if(checkForm){
		var userSelect = $('#input_cluster').val();
		$.ajax({
			url : 'http://14.63.217.141:38083/mqttbroker/'+ userSelect,
			type : 'GET',
			contentType : "application/json",
			data:{
				token:"01234"
			},
			async : false,
			success : function(data){
				
				var tableData = [];
				console.log(data);
				console.log(data.mqttbroker);
				console.log(data.client);
				for(var i =0; i<data.client;i++){
					tableData[i] = data.mqttbroker[i];
				}
				
				console.log(tableData);
				var userList="클러스터 명 : "+userSelect+"\nmqttbroker : "+tableData+"\nclient 수 : "+data.client+"\n생성일자 : "+data.created;
				
				
				console.log(userList);
				$('#amdin-user-list').show();
				 $('#userList').val(userList);
			},
			error : function(err){
				console.log("error"+err);
				console.log("cluster 가 존재하지 않습니다.");
				alert("cluster가 존재하지 않습니다.");
				wrapperFunction('provisioning');
			}
		});
	}
}
function clusterInfoSearch(){
//	wrapperFunction('provisioning');
	var checkForm = userFormCheck();
	if(checkForm){
		var clusterSelect = $('#input_userId').val();
		$.ajax({
			url : 'http://14.63.217.141:38083/user/'+clusterSelect,
			type : "get",
			contentType : "application/json",
			data:{
				token:'012345'
			},
			async : false,
			success : function(data){
				console.log(data);
				console.log(data.phone);
				console.log(data.mqttbroker);
				console.log(data.created);
				var clusterList = "유저 아이디 : " +data.phone+"\ncluster : "+data.mqttbroker+"\n생성일 : "+data.created;
				$('#amdin-cluster-info').show();
				$('#clusterList').val(clusterList);
			},
			error : function(err){
				console.log(err);
				console.log("존재하지 않는 전화번호 입니다.");
				alert("존재하지 않는 전화번호 입니다.");
				wrapperFunction('provisioning');
				
			}
		});
	}
}





function clusterFormCheck(){
	var input_cluster = $('#input_cluster').val();
	if(input_cluster=="" || input_cluster==null){
		alert("대상을 입력해주세요");
		$('#input_cluster').focus();
		return false;
	} 
	return true;
}

function userFormCheck(){
	var input_userId = $('#input_userId').val();
	if(input_userId =="" || input_userId ==null){
		alert("대상을 입력해주세요");
		$('#input_userId').val();
		return false;
	}
	return true;
}