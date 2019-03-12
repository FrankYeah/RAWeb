$(function () {
	$(".datepicker").datepicker({
		format: 'yyyy-mm-dd',
	});
	$("#submitBtn").click(function () {
		getStatData();
	});
});

function IsJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

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

function showStatResults(data, response, xhr) {

	if (!IsJsonString(data)) {
		clearChar();
		bootsrapAlert(data);
		return;
	}

	var channelStats = JSON.parse(data);

	if (channelStats.length == 0) {
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
		bottom: 40,
		left: 240
	},
		width = 800,
		height = 400,
		innerWidth = width - margin.left - margin.right,
		innerHeight = height - margin.top - margin.bottom,
		svg = d3.select('#chartsResults').append('svg').attr('width', width).attr('height', height)
	g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);


	const x0 = d3.scale.ordinal().rangeRoundBands([0, innerWidth], .1);

	const x1 = d3.scale.ordinal().rangeRoundBands([0, innerWidth], .1);

	const y = d3.scale.linear().range([innerHeight, 0]);;

	const z = d3.scale.ordinal()
		.range(['blue', 'red']);

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
		.attr('transform', (d, i) => 'translate(0,' + i * 20 + ')');

	legend.append('rect')
		.attr('x', innerWidth - 19)
		.attr('width', 10)
		.attr('height', 10)
		.attr('fill', z);

	legend.append('text')
		.attr('x', innerWidth - 32)
		.attr('y', 6)
		.attr('dy', '0.32em')
		.text(d => d);
}