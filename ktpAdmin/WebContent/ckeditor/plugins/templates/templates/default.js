/*
 Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR
		.addTemplates(
				"default",
				{
					imagesPath : CKEDITOR.getUrl(CKEDITOR.plugins
							.getPath("templates")
							+ "templates/images/"),
					templates : [ {
						title : "날씨템플릿 예제",
						image : "testimage.jpg",
						description : "날씨 템플릿 예제 입니다.",
						html : '<img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSTwYHb6B2C_31TcDuBM78WyEdqR14ouW0Mp-G_kwEnvkN04rqpxQ" alt="" style="margin-right: 10px" height="100" width="100" align="left" /><p>맑음</p>'
					} ]
				});