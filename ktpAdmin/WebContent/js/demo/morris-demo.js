$(function() {
	// Add a random value to each line every second
	var cpuData ;
	var tokenID = sessionStorage.getItem("tokenID");
	var userID = sessionStorage.getItem("userID");
	
//	setInterval(function() {
//		
//		
//		$.ajax({
//		url : '/v1/server',
//		type : 'GET',
//		headers : {
//			'X-ApiKey' : tokenID
//		},
//		contentType : "application/json",
//		async : false,
//		success : function(data) {
//			var tableData = [];
//				
//				if(data.result.success){
//				
//					var item = data.result.data;
//					console.log(item);
//					cpuData=item.cpu.combined;
//					cpuData=cpuData*100;
//					console.log(cpuData);
//				}else{
//					alert('server errors');
//				}
//
//		
//		},
//		error : function(data, textStatus, request) {
//			console.log(data);
//			
//		}
//	});
//		
//	
//	}, 1000);

	Morris.Area({
		element : 'morris-area-chart',
		data : [ {
			period : '2010 Q1',
			iphone : 2666,
			ipad : null,
			itouch : 2647
		}, {
			period : '2010 Q2',
			iphone : 2778,
			ipad : 2294,
			itouch : 2441
		}, {
			period : '2010 Q3',
			iphone : 4912,
			ipad : 1969,
			itouch : 2501
		}, {
			period : '2010 Q4',
			iphone : 3767,
			ipad : 3597,
			itouch : 5689
		}, {
			period : '2011 Q1',
			iphone : 6810,
			ipad : 1914,
			itouch : 2293
		}, {
			period : '2011 Q2',
			iphone : 5670,
			ipad : 4293,
			itouch : 1881
		}, {
			period : '2011 Q3',
			iphone : 4820,
			ipad : 3795,
			itouch : 1588
		}, {
			period : '2011 Q4',
			iphone : 15073,
			ipad : 5967,
			itouch : 5175
		}, {
			period : '2012 Q1',
			iphone : 10687,
			ipad : 4460,
			itouch : 2028
		}, {
			period : '2012 Q2',
			iphone : 8432,
			ipad : 5713,
			itouch : 1791
		} ],
		xkey : 'period',
		ykeys : [ 'iphone', 'ipad', 'itouch' ],
		labels : [ 'iPhone', 'iPad', 'iPod Touch' ],
		pointSize : 2,
		hideHover : 'auto',
		resize : true
	});

	Morris.Donut({
		element : 'morris-donut-chart',
		data : [ {
			label : "Download Sales",
			value : 12
		}, {
			label : "In-Store Sales",
			value : 30
		}, {
			label : "Mail-Order Sales",
			value : 20
		} ],
		resize : true
	});

	Morris.Bar({
		element : 'morris-bar-chart',
		data : [ {
			y : 'cpu',
			a : 15
		}],
		xkey : '100',
		ykeys : [ 'a' ],
		labels : [ 'Series A' ],
		hideHover : 'auto',
		resize : true
	});

	Morris.Line({
		element : 'morris-line-chart',
		data : [ {
			y : '2006',
			a : 100,
			b : 90
		}, {
			y : '2007',
			a : 75,
			b : 65
		}, {
			y : '2008',
			a : 50,
			b : 40
		}, {
			y : '2009',
			a : 75,
			b : 65
		}, {
			y : '2010',
			a : 50,
			b : 40
		}, {
			y : '2011',
			a : 75,
			b : 65
		}, {
			y : '2012',
			a : 100,
			b : 90
		} ],
		xkey : 'y',
		ykeys : [ 'a', 'b' ],
		labels : [ 'Series A', 'Series B' ],
		hideHover : 'auto',
		resize : true
	});

});
