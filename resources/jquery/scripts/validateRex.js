
var validateEngAndNum1_10 = /^[A-Za-z0-9]{1,10}$/;
var validateEngAndNum1_20 = /^[A-Za-z0-9]{1,20}$/;
var validateName50 =  /^[A-Za-z0-9\u4e00-\u9fa5\.\_\-\(\)\{\}\[\]\/\\]{1,50}$/;
var validateName100 =  /^[A-Za-z0-9\u4e00-\u9fa5\.\_\-\(\)\{\}\[\]\/\\]{1,100}$/;

var validateEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

var REBUId = validateEngAndNum1_10;
var RERoleId =  validateEngAndNum1_10;
var REbuid = validateEngAndNum1_10;

var REdbName =  validateEngAndNum1_20;
var REproductID = validateEngAndNum1_20;

var REproductName = validateName50;
var REUserName = validateName50;
var REbuName = validateName100;
var RERoleName = validateName100;

var REEmail = validateEmail;

var REusl = /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;


var REUserID = /^[A-Za-z0-9\.\_\-]{1,50}$/;
var REName = /^[A-Za-z0-9\.\_\-]{1,24}$/;
var REString = /^[A-Za-z0-9\.\_\-]{1,}$/;
var REJdbcUrl = /^jdbc:.*$/;


