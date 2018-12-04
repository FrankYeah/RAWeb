

function ready() {
	var lastMonth = new Date();

	lastMonth.setMonth(lastMonth.getMonth() - 1);
	if ( $('#form1 [name="StartDate"]').val() == "" ) {
		$('#form1 [name="StartDate"]').val(formatDate(lastMonth));
	}
	if ( $('#form1 [name="EndDate"]').val() == "" ) {
		$('#form1 [name="EndDate"]').val(formatDate(new Date()));
	}

	$('#form1 [name="StartDate"], #form1 [name="EndDate"]').datepicker({
		format : 'yyyy-mm-dd',
		autoclose : true
	});
	
	// validation
	$('#form1').validate({
		rules : {
			StartDate: {
				required: true,
				dateISO: true
			},
			EndDate: {
				required: true,
				greaterThanStartDate: '[name="StartDate"]',
				dateISO: true
			}
		}
	})
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function chgPage(page) {
	var formPage = $('#form1 [name="Page"]').val();
	
	if ( formPage == page ) {
		return;
	}
	
	if (page < 1) {
		return;
	}
	
	if (page > $('[name="totalPage"]').val()) {
		return;
	}
	
	$('#form1 [name="Page"]').val(page);
	$('#form1').submit();
}

$.validator.addMethod('greaterThanStartDate', function (value) { 
    return value >= $('#form1 [name="StartDate"]').val();
}, '起始日期不可大於結束日期');

function setInitialPageData(){
	
	$('#form1 [name="Page"]').val(1);
	$('#form1 [name="PageSize"]').val(50);
	$('#form1').submit();
}