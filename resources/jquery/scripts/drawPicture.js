
/*使用人數統計 pie chart */
function drawPieChart(dataset,isZeor){
	if($('#result').css('display')=='block'){
		$("#picbody").empty();
	}
	var svg_width=860;
	var svg_height=430;
	var radius=Math.min(svg_height,svg_width)/2;
	
	var svg = d3.select("#picbody")
			.append("svg:svg")
			.attr("align","center")
			.attr("width",svg_width)
			.attr("height",svg_height);
	
	var legendName = ["有交易","沒交易"];
	
	var pie = d3.layout.pie(); //引入圓餅圖
	
	//var colors = d3.scale.category20c();//引進顏色
	
	var colors = d3.scale.ordinal().range(["#5c5cd6","#99ccff"]);
	var colorsZeor = d3.scale.ordinal().range(["#bdbdbd ","#bdbdbd"]);
	//var colors = d3.scale.ordinal(["#FF0000", "#FFCCCC"]);+
	
	 var explode = function(x,index) {
    	var offset = (index==1) ? 20 : 0;
    	var angle = (x.startAngle + x.endAngle) / 2;
    	var xOff = Math.sin(angle)*offset;
    	var yOff = -Math.cos(angle)*offset;
    	return "translate("+xOff+","+yOff+")";
  	}
	var arc = d3.svg.arc() //引進 arc 物件管理弧形
			.innerRadius(0)
			.outerRadius(radius-20);
    if (isZeor==1){//沒人
        var arcs = svg.selectAll("g",arc)
			.data(pie(dataset))
			.enter()
			.append("g")
			.attr("class","arc")
			.attr("transform","translate("+svg_width/2+","+svg_height/2+")");

			arcs.append("path")
				.attr("fill",function(d,i){ //fill 是添加顏色 給每個data一個顏色
					return colorsZeor(i);
				})
				.attr("transform",explode)
				.attr("d",arc)//設定 d屬性，顏色涵蓋的範圍
			    ;
	}else{
	     var arcs = svg.selectAll("g",arc)
			.data(pie(dataset))
			.enter()
			.append("g")
			.attr("class","arc")
			.attr("transform","translate("+svg_width/2+","+svg_height/2+")");

			arcs.append("path")
				.attr("fill",function(d,i){ //fill 是添加顏色 給每個data一個顏色
					return colors(i);
				})
				.attr("transform",explode)
				.attr("d",arc)//設定 d屬性，顏色涵蓋的範圍
				.attr("data-legend",function(d,i) {
					return legendName[i]});
   
		arcs.append("text")
			.attr("transform",function(d){
				return "translate("+arc.centroid(d)+")";
			})
			.attr("text-anchor","middle")
			.style("opacity", 1)
			.style("fill", '#ffffff')
			.text(function(d){
				return d.value+'%'; //顯示名稱
			});
		
		legend = svg.append("g")
			.attr("class","legend")
			.attr("transform","translate(200,30)")
			.style("font-size","12px")
			.call(d3.legend)
       }
	
}

//plot d3 legend
(function() {
	d3.legend = function(g) {
	  g.each(function() {
	    var g= d3.select(this),
	        items = {},
	        svg = d3.select(g.property("nearestViewportElement")),
	        legendPadding = g.attr("data-style-padding") || 5,
	        lb = g.selectAll(".legend-box").data([true]),
	        li = g.selectAll(".legend-items").data([true])

	    lb.enter().append("rect").classed("legend-box",true)
	    li.enter().append("g").classed("legend-items",true)

	    svg.selectAll("[data-legend]").each(function() {
	        var self = d3.select(this)
	        items[self.attr("data-legend")] = {
	          pos : self.attr("data-legend-pos") || this.getBBox().y,
	          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
	        }
	      })

	    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

	    
	    li.selectAll("text")
	        .data(items,function(d) { return d.key})
	        .call(function(d) { d.enter().append("text")})
	        .call(function(d) { d.exit().remove()})
	        .attr("y",function(d,i) { return i+"em"})
	        .attr("x","1em")
	        .text(function(d) { ;return d.key})
	    
	    li.selectAll("circle")
	        .data(items,function(d) { return d.key})
	        .call(function(d) { d.enter().append("circle")})
	        .call(function(d) { d.exit().remove()})
	        .attr("cy",function(d,i) { return i-0.25+"em"})
	        .attr("cx",0)
	        .attr("r","0.4em")
	        .style("fill",function(d) { return d.value.color})  
	    
	    // Reposition and resize the box
	    var lbbox = li[0][0].getBBox()  
	    lb.attr("x",(lbbox.x-legendPadding))
	        .attr("y",(lbbox.y-legendPadding))
	        .attr("height",(lbbox.height+2*legendPadding))
	        .attr("width",(lbbox.width+2*legendPadding))
	  })
	  return g
	}
	})()

/*畫 histogram operation_portfolioNum.jsp*/
function drawHistogram(data,interval){

	if($('#result').css('display')=='block'){
		$("#picbody").empty();
	}
	
	 var margin = {top: 40, right: 40, bottom: 80, left: 80},
     width = 800- margin.left - margin.right,
     height = 500 - margin.top - margin.bottom;
	 var gridWidth = width ; // grid寬度
	 var scaleXWidth = gridWidth  // X尺寸長度
 	 var scaleYHeight = height ; // Y尺寸長度-
 	 var barPadding = 1;
 	 // Parse the date / time
 	 var parseDate = d3.time.format("%Y-%m-%d").parse;
 
 	 // var colors = d3.scale.category20c();//引進顏色
 	 var colors = d3.scale.category10();
 	 var sampleNum = data.length;
 	 var xWidth =width;
 	 if (sampleNum<15 )  xWidth = width/15 *(sampleNum) ; 
 	 var x = d3.scale.ordinal().rangeRoundBands([0, xWidth]);
 	 var y = d3.scale.linear().range([height, 0]);

 	if (interval=='monthly') viewDate = d3.time.format("%Y-%m");
 	else viewDate=  d3.time.format("%Y-%m-%d"); //day
  	 
 	var valueline = d3.svg.line()
 	 	.x(function (d) { return x(d.DateIndexes) + x.rangeBand()/2; })
 	 	.y(function (d) { return y(d.TransationNum); });
 
    
 	 var svg = d3.select("#picbody")
 	 	.append("svg")
 	    .attr("width", width + margin.left + margin.right)
 	    .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 	
 	 var yMax=0;
 	
 	  
 	 data.forEach(function(d) {
 	 		d.DateIndexes = parseDate(d.DateIndexes);
 	 		d.Values = +d.Values;
            if (yMax<d.Values) yMax=d.Values;
 	 })
 	 
 	 
 	 var xAxis = d3.svg.axis()
 	 	.scale(x)
 	 	.orient("bottom")
 	 	.tickFormat(viewDate);
 	 
      //yMax = yMax *1.1;
 	if (yMax<10) yMax = 10;
 	 var yAxis;
 	 yAxis = d3.svg.axis()
	 	.scale(y)
	 	.orient("left")
	 	.tickSize(0, 0) // 不要刻度
	 	.ticks(10)
	 	.tickValues(d3.range(0, yMax , (yMax / 10).toFixed(0)))
	    .tickFormat(d3.format("s"));

 	  x.domain(data.map(function(d) { 
 	 		console.log(d.DateIndexes);
 	 		return d.DateIndexes; 
 	  }));
   
 	 y.domain([0, yMax]);
 	 // Add the x Axis
 	  svg.append("g")
 	 		.attr("class", "x axis")
 	 		.attr("transform", "translate(0," + height + ")")
 	 		.call(xAxis)
 	 		.selectAll("text")
 	 		.style("text-anchor", "middle")
 	 		.attr("dx", "-.8em")
 	 		.attr("dy", "-.55em")
 	 		.attr("transform", "translate(5,30) rotate(-60)" );
 	
 	  // Add the y Axis
 	   svg.append("g")
 	 		.attr("class", "y axis")
 	 		.call(yAxis)
 	 		.append("text")
 	 		.attr("transform", "rotate(-90)")
 	 		.attr("y", 6)
 	 		.attr("dy", ".71em")

 	 	svg.selectAll("bar")
 	 		.data(data)
 	 		.enter().append("rect")
 	 		.attr("x", function(d) { return x(d.DateIndexes); })
 	 		.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.Values); })
 	 		.attr("height", function(d) {
 	 			console.log(height - y(d.Values));
 	 			return height - y(d.Values); 
 	 		})
 	 		.attr("fill",function(d,i){ //fill 是添加顏色 給每個data一個顏色
 	 			return colors(i);
 	 		});
			 
			// 新增查詢人次 text
			svg.selectAll("bar")
 	 		.data(data)
 	 		.enter().append("text")
 	 		.attr("x", function(d) { return x(d.DateIndexes); })
 	 		.attr("width", x.rangeBand())
			.attr("y", function(d) { return y(d.Values); })
 	 		.attr("height", function(d) {
 	 			console.log(height - y(d.Values));
 	 			return height - y(d.Values); 
 	 		})
 	 		.attr("fill",function(d,i){ //fill 是添加顏色 給每個data一個顏色
 	 			return colors(i);
 	 		})
			.text(function(d){
				return d.Values + '/' + d.TransationNum}
			)

			// 測試新增文字
			// svg.selectAll("bar")
			// .data(data)
			// .enter().append("text")
			// .attr("x", function(d) { return x(d.DateIndexes); })
			// .attr("width", x.rangeBand())
			// .attr("y", function(d) { return y(d.TransationNum); })
			// .attr("height", function(d) {
			// 	console.log(height - y(d.TransationNum));
			// 	return height - y(d.TransationNum); 
			// })
			// .attr("fill",function(d,i){ //fill 是添加顏色 給每個data一個顏色
			// 	return colors(i);
			// })
			// .text(function(d){
			// 	return d.TransationNum;}
			// )

 	 	 
 	 	//add line    
 	 	svg.append("path")
 	 		.attr("d", valueline(data))
 	 	    .attr('r', 5)
 		    .attr('fill','none')
 		    .attr('stroke-width',2)
			.attr('stroke','yellow')

 	 	svg.selectAll('circle')
 		.data(data)
 		.enter().append('circle')
 		.attr('cx', function(d) {
 			return x(d.DateIndexes)+ x.rangeBand()/2;
 		})
 		.attr('cy', function(d) {
 			return y(d.TransationNum);
		 })
 		.attr('r', 5)
		.attr('fill',"yellow")
		.text(function(d){
			return d.TransationNum;}
		)
		.on("mouseover", function (d) { return tip.text('導向交易人次 : ' + d.TransationNum).style("visibility", "visible") })
		.on("mouseout", function () { return tip.style("visibility", "hidden"); })









 	 	
 	   // grid
 	 	var axisYGrid;
 	 	var axisYGrid1;
 	 	//alert(yMax);
 	 	//alert((yMax / 10).toFixed(0));
 	 	 axisYGrid = d3.svg.axis().scale(y)
			.orient("left")
			.tickSize(-scaleXWidth+20, 0)
			.tickValues(d3.range(0, yMax, (yMax / 10).toFixed(0)))
		    .tickFormat("");  
	 	   
	 	   //add x axis line
	 	 	axisYGrid1 = d3.svg.axis().scale(y)
			.orient("left")
			.tickSize(-scaleXWidth+20, 0)
			.tickValues(d3.range(0,0.1, 1))
		    .tickFormat("");   
	 	 	
 	 	svg.append('g').call(axisYGrid).attr({
 	 		'fill' : 'none',
 	 		'stroke' : 'rgba(0,0,0,.1)'
 	 	  });
 	 	
	 	
	 	svg.append('g').call(axisYGrid1).attr({
	 		'fill' : 'none',
	 		'stroke' : 'black'
	 	});
 	 	
 	 	//legend 1
 	 	svg.append("image")
 	 		.attr("xlink:href",  "../resources/picture/bar.png")
 	 		.attr("width", 20)
 	 		.attr("height", 20)
 	 		.attr("x", width-200)
 	 		.attr("y",-25);
    
 	 	svg.append("text")      // text label for the  legend 1
 	 		.attr("x", width-140 )
 	 		.attr("y", -10 )
 	 		.style("text-anchor", "middle")
				.text("查詢人次");

		var tip = d3.select("#picbody")
			.append("div")
			.attr("class", "tip")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("top", "60px")
			.style("left", "130px")
			.style("border", "1px solid black")
			.style("padding", "5px")
			.style("visibility", "hidden")
			// .style("padding", "5px")


        //legend 2
 	 	svg.append("image")
 	 		.attr("xlink:href",  "../resources/picture/line.png")
 	 		.attr("width", 20)
 	 		.attr("height", 20)
 	 		.attr("x", width-90)
 	 		.attr("y",-25);
   
 	 	svg.append("text")      // text label for the  legend 2
 	 		.attr("x", width-15 )
 	 		.attr("y", -10 )
 	 		.style("text-anchor", "middle")
 	 		.text("導向交易人次");
	
 	 	svg.append("text")      // text label for the x axis
 	 		.attr("x", width+20 )
 	 		.attr("y", height )
 	 		.style("text-anchor", "middle")
 	 		.text("日期"); 

 	 	svg.append("text")      // text label for the y axis
 	 		.attr("x", -63 )
 	 		.attr("y", height/2 )
 	 		.style("text-anchor", "middle")
 	 		.text("人次");

 	 	svg.append("text")      // title
 	 		.attr("x", width/2 )
 	 		.attr("y", -10)
 	 		.style("text-anchor", "middle")
 	 		.style({
 	 			fill: 'red',
 	 			'font-size': '24px'
 	 		})
 	 		.text("查詢投資組合人次");
       
 	 	var svg = d3.select('body').append('svg').attr({
 	 		width: 300,
 	 		height: 300,
 	 		border: '1px solid #ccc'
  
 	 	});
 	 	console.log(top);
}

/*畫 barchart operation_rebalanceNum.jsp*/

function drawBarChart(data,interval){
	if($('#result').css('display')=='block'){
		$("#picbody").empty();
	}
	
	var margin = {top: 40, right: 40, bottom: 60, left: 80},
     width = 800- margin.left - margin.right,
     height = 400 - margin.top - margin.bottom;
  
	 var gridWidth = width ; // grid寬度
	 var scaleXWidth = gridWidth  // X尺寸長度
 	 var scaleYHeight = height ; // Y尺寸長度- 
   
 	// Parse the date / time
 	var parseDate = d3.time.format("%Y-%m-%d").parse;
 
	// var colors = d3.scale.category20c();//引進顏色
 	var colors = d3.scale.category10();
 	var sampleNum = data.length;
	var xWidth =width;
    if (sampleNum<15 )  xWidth = width/15 *(sampleNum) ; //小於15筆,不要占全版面
	var x = d3.scale.ordinal().rangeRoundBands([0, xWidth], .2);
	var y = d3.scale.linear().range([height, 0]); 
 	if (interval=='monthly') viewDate = d3.time.format("%Y-%m");
 	else viewDate=  d3.time.format("%Y-%m-%d"); //day
 	
 	var svg = d3.select("#picbody")
 	 .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 	 var yMax=0;
	 data.forEach(function(d) {
	 		d.DateIndexes = parseDate(d.DateIndexes);
	 		d.Values = +d.Values;
           if (yMax<d.Values) yMax=d.Values;
	 });
   
	 var xAxis = d3.svg.axis()
	 	.scale(x)
	 	.orient("bottom")
	 	.tickFormat(viewDate);
     
	 var yAxis ;
	 if (yMax<10) yMax = 10;
     yAxis = d3.svg.axis()
	 	.scale(y)
	 	.orient("left")
	 	.tickSize(0, 0) // 不要刻度
	 	.ticks(10)
	 	.tickValues(d3.range(0, yMax , (yMax / 10).toFixed(0)))
	    .tickFormat(d3.format("s"));

     x.domain(data.map(function(d) { 
	   console.log(d.DateIndexes);
       return d.DateIndexes; 
     }));
   
     y.domain([0, yMax]);


     svg.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .selectAll("text")
       .style("text-anchor", "middle")
       .attr("dx", "-.3em")
       .attr("dy", "-.55em")
       .attr("transform", "translate(5,30) rotate(-60)" );
       
     svg.append("g")
       .attr("class", "y axis")
       .call(yAxis)
       .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 6)
       .attr("dy", ".6em")
       //.style("text-anchor", "middle")
       //.text("人數");
   
     var bar = svg.selectAll("bar")
       .data(data)
       .enter().append("rect")
       .attr("class", "bar")
       .attr("x", function(d) { return x(d.DateIndexes); })
       .attr("width", x.rangeBand())
       .attr("y", function(d) { return y(d.Values); })
       .attr("height", function(d) {
    	   console.log(height - y(d.Values));
    	   return height - y(d.Values); 
    	  })
   	   .attr("fill","steelblue")
   	   .append("text");
   	   
     // bar value label 
     svg.selectAll(".text")  		
	  	.data(data)
	  	.enter()
	  	.append("text")
	  	.attr("class","label")
	  	.attr("x", (function(d) { return x(d.DateIndexes)+x.rangeBand()/2 ; }  ))
	  	.attr("y", function(d) { return y(d.Values)-5 ; })
	  	.style("text-anchor", "middle")
	  	.text(function(d) { return d.Values; });   	
	
     // grid
        var axisYGrid;
	 	var axisYGrid1;
	 	axisYGrid = d3.svg.axis().scale(y)
		.orient("left")
		.tickSize(-scaleXWidth+20, 0)
		.tickValues(d3.range(0, yMax, (yMax / 10).toFixed(0)))
	    .tickFormat("");  
 	   
	 	//add x axis line
 	 	axisYGrid1 = d3.svg.axis().scale(y)
		.orient("left")
		.tickSize(-scaleXWidth+20, 0)
		.tickValues(d3.range(0,0.1, (yMax / 10).toFixed(0)))
	    .tickFormat("");   
 	 	
 	 	svg.append('g').call(axisYGrid).attr({
 	 		'fill' : 'none',
 	 		'stroke' : 'rgba(0,0,0,.1)'
 	 	  });
 	 	
	 	
	 	svg.append('g').call(axisYGrid1).attr({
	 		'fill' : 'none',
	 		'stroke' : 'black'
	 	});
	
    	   
	 svg.append("text")      // text label for the x axis
       .attr("x", width+20 )
       .attr("y", height )
       .style("text-anchor", "middle")
       .text("日期"); 

	 svg.append("text")      // text label for the y axis
       .attr("x", -50 )
       .attr("y", height/2 )
       .style("text-anchor", "middle")
       .text("人數");

	 svg.append("text")      // title
       .attr("x", width/2 )
       .attr("y", -20)
       .style("text-anchor", "middle")
       .style({
		fill: 'red',
		'font-size': '16px'
		})
       .text("Rebalance 通知人數");    
	 
	 console.log(top);
}



