<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	request.setCharacterEncoding("utf-8");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Push Configuration Center</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Push Configuration Center</title>

<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="font-awesome/css/font-awesome.css" rel="stylesheet">
<link href="css/plugins/morris/morris-0.4.3.min.css" rel="stylesheet">
<link href="css/plugins/timeline/timeline.css" rel="stylesheet">
<link href="css/plugins/dataTables/dataTables.bootstrap.css"
	rel="stylesheet">
<link href="css/bootstrap-datetimepicker.css" rel="stylesheet">
<link href="css/sb-admin.css" rel="stylesheet">
<!-- ladda -->
<link href="css/ladda.min.css" rel="stylesheet">


<!-- 	<link rel="stylesheet" href="css/TableBarChart.css" /> -->



<script src="js/jquery-1.10.2.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/plugins/metisMenu/jquery.metisMenu.js"></script>
<script src="js/sb-admin.js"></script>
<script src="js/pages/main.js"></script>
<script type="text/javascript" src="js/smoothie.js"></script>
<script src="js/plugins/dataTables/jquery.dataTables.js"></script>
<script src="js/plugins/dataTables/dataTables.bootstrap.js"></script>
<script src="ckeditor/ckeditor.js"></script>
<script src="js/plugins/morris/raphael-2.1.0.min.js"></script>
<script src="js/plugins/morris/morris.js"></script>
<script src="js/ladda.js"></script>
<script src="js/jquery.flot.js"></script>
<script src="js/spin.js"></script>
<!-- ladda -->


</head>

<body>
	<div id="wrapper">
		<nav class="navbar navbar-default navbar-fixed-top" role="navigation"
			style="margin-bottom: 0">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse"
				data-target=".sidebar-collapse">
				<span class="sr-only">Toggle navigation</span> <span
					class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="index.jsp">Push Configuration Center </a>

		</div>

		<ul id="ul_userInfo" class="nav navbar-top-links navbar-right">
			<li class="dropdown"><a class="dropdown-toggle"
				data-toggle="dropdown" href="#"> <i class="fa fa-user fa-fw"></i>
					<i class="fa fa-caret-down"></i>
			</a>
				<ul class="dropdown-menu dropdown-user">
					<li><a href="#" onclick="javascript:userInfo();"><i
							class="fa fa-user fa-fw"></i> User Profile</a></li>
					<li><a href="#" onclick="javascript:logoutFunction();"><i
							class="fa fa-sign-out fa-fw"></i> Logout</a></li>
				</ul> <!-- /.dropdown-user --></li>
			<!-- /.dropdown -->
		</ul>
		<div class="navbar-default navbar-static-side" role="navigation">

			<div class="sidebar-collapse">
				<ul class="nav" id="side-menu">
				
				        <li>
                            <a href="#"><i class="fa fa-dashboard fa-fw"></i> Dashboard <span class="fa arrow"></a>
                            
                               <ul class="nav nav-second-level">
                                <li>
                                    <a href="#" onclick="javascript:wrapperFunction('monitoring');">푸시서버 모니터링</a>
                                </li>
                                <!-- 기능식제 -->
                                  <li>
                                    <a href="#" onclick="javascript:wrapperFunction('messageList');">메세지 발송 현황</a>
                                </li>
                           	<li><a href="#"
								onclick="javascript:wrapperFunction('tokenManager');">토큰 관리</a>
							</li>
							<li><a href="#"
								onclick="javascript:wrapperFunction('provisioning');">프로비저닝 정보</a>
							</li>
                            </ul>
                            
                        </li>

					<li><a href="#"><i class="fa fa-envelope fa-fw"></i> Push
							Message <span class="fa arrow"></a>

						<ul class="nav nav-second-level">
						<!-- 기능삭제 -->
<!-- 							<li><a href="#" -->
<!-- 								onclick="javascript:wrapperFunction('MessageSend');">메세지 전송</a></li> -->
						

							<li><a href="#"
								onclick="javascript:wrapperFunction('keepAlive');">keepAlive
									설정</a></li>
									
							<li><a href="#"
								onclick="javascript:wrapperFunction('firmware');">F/W upgrade 공지</a></li>
						

						</ul></li>
					<li id="adminRole_li"><a href="#"><i
							class="fa fa-user fa-fw"></i> Admin<span class="fa arrow"></span></a>
						<ul class="nav nav-second-level">
							<li><a href="#"
								onclick="javascript:wrapperFunction('userManager');">관리자 목록</a>
							</li>

							<li><a href="#"
								onclick="javascript:wrapperFunction('userAdd');">관리자 등록</a></li>

							<li><a href="#"
								onclick="javascript:wrapperFunction('changePass');">비밀번호 변경</a>
							</li>



						</ul></li>
				</ul>
				<!-- /#side-menu -->
			</div>
			<!-- /.sidebar-collapse -->
		</div>
		<!-- /.navbar-static-side --> </nav>

		<div id="page-wrapper"></div>
	</div>
	<!-- /#wrapper -->

	<!-- Core Scripts - Include with every page -->


</body>
</html>