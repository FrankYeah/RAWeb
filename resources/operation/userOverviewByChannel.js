$(function () {
	$(".datepicker").datepicker({
		format: 'yyyy-mm-dd',
	});
	$("#submitBtn").click(function () {
		getStatData();
	});
});

function getStatData() {
	if (dateRangeEqualsValidate()) {
		$.ajax({
			type: "GET",
			contentType: 'application/json',
			url: fubon.contextPath + "operateManagement/UserOverviewByChannel",
			data: {
				"buid":$("#buId option:selected").val(),
				"startDate": $("#datepickerFrom").val(),
				"endDate": $("#datepickerTo").val()
			},
			success: showStatResults,
			error: function (xhr) {
				bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
			}
		});
	}
}

function showStatResults(channelStats, response, xhr) {
	$('#chartsResults').empty();

	if(channelStats.Status === "Error"){
		bootsrapAlert(channelStats.Detail);
		return;
	}

	if (channelStats.Data.data.length == 0) {
		bootsrapAlert("目前無資料!");
		return;
	}

	drawBarChart(channelStats.Data.data);
}

function drawBarChart(data) {

	$('#chartsResults').empty();
	$('#chartsResults').show();

	if (data.length === 0) {
		$('#chartsResults').text("no values");
		return;
	}

	const keys = Object.keys(data[0]).slice(1);

	const margin = {
		top: 40,
		right: 80,
		bottom: 70,
		left: 240
	},
		width = 800,
		height = 450,
		innerWidth = width - margin.left - margin.right,
		innerHeight = height - margin.top - margin.bottom,
		svg = d3.select('#chartsResults').append('svg').attr('width', width).attr('height', height)
	g = svg.append('g').attr('transform', `translate(${margin.left-100}, ${margin.top})`);

	console.log(width)
	console.log(innerWidth)
	console.log(data)
	var xWidth;
	if (data.length<15 )  xWidth = width/15 *(data.length) ; //小於15筆,不要占全版面

	var x0 = d3.scale.ordinal().rangeRoundBands([0, xWidth], .1);

	const x1 = d3.scale.ordinal().rangeRoundBands([0, innerWidth], .1);

	const y = d3.scale.linear().range([innerHeight, 0]);;

	const z = d3.scale.ordinal()
		.range(['#00BFFF', '#7B68EE']);

	x0.domain(data.map(d => d.channelName));
	x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
	y.domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice();

	var tip = d3.select("#chartsResults")
		.append("div")
		.attr("class", "tip")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden");

	g.append('g')
		.selectAll('g')
		.data(data)
		.enter()
		.append('g')
		.attr('transform', d => 'translate(' + x0(d.channelName) + ',0)')
		.selectAll('rect')
		.data(d => keys.map(key => { return { key: key, value: d[key], channelName: d.channelName } }))
		.enter().append('rect')
		.attr('x', d => x1(d.key))
		.attr('y', d => y(d.value))
		.attr('width', x1.rangeBand())
		.attr('height', d => innerHeight - y(d.value))
		.attr('fill', d => z(d.key))
		.on("mouseover", function (d) { return tip.text(d.value).style("visibility", "visible").style("top", y(d.value) + 100 + 'px').style("left", x0(d.channelName) + x1(d.key) + (x1.rangeBand() / 2) + margin.left + 'px') })
		.on("mouseout", function () { return tip.style("visibility", "hidden"); });

	g.append('g')
		.selectAll('g')
		.data(data)
		.enter()
		.append('g')
		.attr('transform', d => 'translate(' + x0(d.channelName) + ',0)')
		.selectAll('rect')
		.data(d => keys.map(key => { return { key: key, value: d[key], channelName: d.channelName } }))
		.enter().append('text')
		.attr('x', d => x1(d.key))
		.attr('y', d => y(d.value) - 5)
		.attr('width', x1.rangeBand())
		.attr('height', d => innerHeight - y(d.value))
		.attr('fill', 'black')			
		.style("font-size", "14px")
		.text(function(d){
			return d.value;}
		)
		
	g.append('g')
		.attr('class', 'axis-bottom')
		.attr('transform', 'translate(0,' + innerHeight + ')')
		.call(d3.svg.axis()
		.scale(x0)
		.orient("bottom"));

	g.append('text')
		.attr('x', -130)
		.attr('y', 180)
		.attr('dy', '0.32em')
		.style("font-size", "20px")
		.text('管道人數');

	g.append('text')
		.attr('x', 170)
		.attr('y', 390)
		.attr('dy', '0.32em')
		.style("font-size", "20px")
		.text('管道類別');


	// 另一個下方線
	x0 = d3.scale.ordinal().rangeRoundBands([0, innerWidth], .1);
	g.append('g')
		.attr('class', 'axis-bottom')
		.attr('transform', 'translate(0,' + innerHeight + ')')
		.call(d3.svg.axis()
		.scale(x0)
		.orient("bottom"));

	g.append('g')
		.attr('class', 'axis-left')
		.call(d3.svg.axis()
			.scale(y)
			.orient("left").ticks(null, 's'))
		.append('text')
		.attr('x', 10)
		.attr('y', y(y.ticks().pop()) + 10)
		.attr('dy', '0.32em')
		.attr('fill', '#000')
		.style('transform', 'rotate(-90deg)');

	var legend = g.append('g')
		.attr('font-family', 'sans-serif')
		.attr('font-size', 10)
		.attr('text-anchor', 'end')
		.selectAll('g')
		.data(["使用人數", "交易人數"])
		.enter().append('g')
		.attr('transform', (d, i) => 'translate(100,' + i * 20 + ')');

	legend.append('rect')
		.attr('x', innerWidth - 0)
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', z);

	legend.append('text')
		.attr('x', innerWidth - 13)
		.attr('y', 6)
		.attr('dy', '0.32em')
		.style("font-size", "18px")
		.text(d => d);

}

$("#downloadBtn").click(function() {
	var buId = $("#buId").find(":selected").val();
	var startDate = $("#datepickerFrom").val();
	var endDate = $("#datepickerTo").val();

	console.log(fubon.contextPath+"operateManagement/downloadUserOverviewByChannel?buId=" + buId +
		"&startDate=" + encodeURIComponent(startDate) + "&endDate=" + encodeURIComponent(endDate));
	location.href = fubon.contextPath+"operateManagement/downloadUserOverviewByChannel?buId=" + buId +
		"&startDate=" + encodeURIComponent(startDate) + "&endDate=" + encodeURIComponent(endDate);
})