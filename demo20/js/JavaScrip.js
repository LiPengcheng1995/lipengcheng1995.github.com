"use strict";
function calculate(){
	var amount = document.getElementById("amount");
	var apr = document.getElementById("apr");
	var years = document.getElementById("years");
	var zipcode = document.getElementById("zipcode");
	var payment = document.getElementById("payment");
	var total = document.getElementById("total");
	var totalinterest = document.getElementById("totalinterest");
	//从input中获取输入数据
	//将百分比格式转化为小树格式，并从年利率转化为月利率
	//将年度赔付转化为月度赔付
	var principal = parseFloat(amount.value);
	var interest = parseFloat(apr.value);
	var payments = parseFloat(years.value);
	
	//计算月度赔付的数据
	var x = Math.pow(1 + interest,payments);
	var monthly = (principal * x * interest) / (x - 1);
	//如果结果没有超过javascrip能表示的数字范围，且用户输入也正确
	//这里展示的结果是合法的
	
	if(isFinite(monthly)){
		//将数据填充至输出字段的位置，四舍五入到小数点后两位数字
		payment.innerHTML = monthly.toFixed(2);
		total.innerHTML = (monthly * payments).toFixed(2);
		totalinterest.innerHTML = ((monthly * payments) - principal).toFixed(2);
		//将用户的数据保存下来，这样在下次访问时也能取到数据
		save(amount.value,apr.value,years.value,zipcode.value);
		//找到并展示本地放贷人，但忽略网络错误
		try{//捕获这段代码抛出的所有异常
			getLenders(amount.value,apr.value,years.value,zipcode.value);
		}
		catch(e){
			//忽略这些异常
		}
		//最后用图标展示贷款余额，利息和资产收益
		chart(principal,interest,monthly,payments);
		
	}
	else{
		//计算结果不是数字或者时无穷大，意味着输入的数据时非法或者不完整的
		//清空之前输出的数据
		payment.innerHTML = "";
		total.innerHTML = "";
		totalinterest.innerHTML = "";
		chart();		
	}	
}
//将用户的输入保存至localStorage对象的属性中
//这些属性在再次访问时还会继续保持在原位置
//如果你在浏览器中以file://url的方式直接打开本地文件
//则无法在某些浏览器中使用存储功能
//而通过HTTP打开文件时可行的
function save(amount,apr,years,zipcode){
	if(window.localStorage){
		//只有在浏览器支持时才运行这里的代码
		localStorage.loan_amount = amount;
		localStorage.loan_apr = apr;
		localStorage.loan_years = years;
		localStorage.loan_zipcode = zipcode;
	}
}

//在文档首次加载时，尝试还原输入字段
window.onload = function(){
	//如果浏览器支持本地存储且上次保存的值时存在的
	if(window.localStorage && localStorage.loan_amount){
		document.getElementById("amount").value = localStorage.loan_amount;
		document.getElementById("apr").value = localStorage.loan_apr;
		document.getElementById("years").value = localStorage.loan_years;
		document.getElementById("zipcode").value = localStorage.loan_zipcode;
	}
};

//将用户的输入发送至服务器端脚本（理论上）将
//返回一个本地贷人的链接列表，在这个例子中并没有实现这种查找放贷人的服务
//如果该函数存在，该函数会使用它
function getLenders(amount,appr,years,zipcode){
	//如果该浏览器不支持XMLHttpRequest对象，则推出
	if(!window.XMLHttpRequest) return ;
	//找到显示放贷人列表的元素
	var ad = document.getElementById("lenders");
	if(!ad) return ;//如果返回为空则推出
	
	//将用户的输入数据进行url编码，并作为查询参数附加在url中
	var url = "getLenders.php"+"?amt"+encodeURIComponent(amount)+
								"?yrs"+encodeURIComponent(years)+
								"?zip"+encodeURIComponent(zipcode);
	//通过XMLHttpRequest对象来提取返回数据
	var req = new XMLHttpRequest();
	req.open("GET",url);
	req.send(null);
	
	//在返回数据之前，注册了一个数据处理函数，这个处理函数
	//将会在服务器的相应返回客户端的时候调用
	//这种异步编程模型在客户端javascript中时非常常见的
	req.onreadystatechange = function(){
		if(req.readyState == 4 && req.status == 200){
			//如果代码运行至这里，说明我们得到了一个合法且完整的http响应
			var response = req.responseText;//http响应时以字符串的形式呈现的
			var lenders = JSON.parse(response);//将其解析为JS数组
			
			//将数组的放贷人对象转换为html字符串形式
			var list = "";
			for(var i=0;i<lenders.length;i++){
				list += "<li><a href='"+lenders[i].url+"'>"+lenders[i].name+"</a>"
			}
			ad.innerHTML = "<ul>"+list+"</ul>";
		}
	}
}


//在html<canvas>元素中用图标展示月度贷款余额、利息、资产收益
//如果步传入参数的话，则清空之前的图标数据

function chart(principal,interest,monthly,payments){
	var graph = document.getElementById("graph");//得到<canvas>标签
	graph.width = graph.width;//用一种巧妙的手法清楚并重置画布
	
	//如果不传入参数，或者浏览器不支持画布，则直接返回
	if(arguments.length == 0 || !graph.getContext) return ;
	
	//获得画布元素的"context"对象，这个对象定义了一组重画API
	var g = graph.getContext("2d");
	var width = graph.width;
	var height = graph.height;//获得画布大小
	
	//这里的函数作用时将付款数字和美元数据转换为像素
	function paymentToX(n){
		return n * width / payments;
	}
	function amountToY(a){
		return height - (a * height / (monthly * payments * 1.05));
	}
	
	//付款数据是一条从(0,0)到(payments,monthly*payments)的直线
	g.moveTo(paymentToX(0),amountToY(0));//从左下方开始
	g.lineTo(paymentToX(payments),amountToY(monthly*payments));//绘至右上方
	g.lineTo(paymentToX(payments),amountToY(0));//再绘至右下方
	g.closePath();//从结尾链接至开头
	g.fillStyle = "#f88";//亮红色
	g.fill();//填充矩形
	g.font = "bold 12px sans-serif";//定义一种字体
	g.fillText("Total Interest Payments",20,20);//将文字绘制到图例中
	
	//很多资产数据并不是线形的，很难将其反应至图标中
	var equity = 0;
	g.beginPath();//开始绘制新图形
	g.moveTo(paymentToX(0),amountToY(0));//从左下方开始
	for(var p = 1;p <= payments;p++){
		//计算出每一笔赔付的利息
		var thisMonthsInterest = (principal - equity) * interest;
		equity += (monthly - thisMonthsInterest);//得到资产额
		g.lineTo(paymentToX(p),amountToY(equity));//将数据绘制到画布上
	}
	g.lineTo(paymentToX(payments),amountToY(0));//将数据线绘至x轴
	g.closePath();//将线条结尾链接至线条开头
	g.fillStyle = "green";//使用绿色绘制图形
	g.fill();//曲线之下的部分均填充
	g.fillText("Total Equity",20,35);//文本颜色设置为绿色
	
	//再次循环，余额数据显示为黑色线条
	var bal = principal;
	g.beginPath();
	g.moveTo(paymentToX(0),amountToY(bal));
	for(var p = 1;p <= payments;p++){
		var thisMonthsInterest = bal * interest;
		bal -= (monthly - thisMonthsInterest);//得到资产额
		g.lineTo(paymentToX(p),amountToY(bal));//将直线链接至某点
	}
	g.lineWidth = 3;//加粗直线
	g.stroke();//绘制余额的曲线
	g.fillStyle = "black";//使用黑色字体
	g.fillText("Loan Balance",20,50);//图例文字
	
	//将年度数据在x轴做标记
	g.textAlign = "center";
	var y = amountToY(0);
	for (var year = 1;year*12 <= payments;year++) {
		var x = paymentToX(year*12);
		g.fillRect(x-0.5,y-3,1,3);
		if(year == 1) g.fillRect("year",x,y-5);
		if(year % 5 == 0 && year * 12 != payments)
			g.fillText(String(year),x,y-5);
	
	}
	//将赔付数额标记在右边界
	g.textAlign = "right";
	g.textBaseline = "middle";
	var ticks = [monthly*payments,principal];
	var rightEdge = paymentToX(payments);
	for(var i=0;i<ticks.length;i++){
		var y = amountToY(ticks[i]);
		g.fillRect(rightEdge-3,y-0.5,3,1);
		g.fillText(String(ticks[i].toFixed(0)),rightEdge-5,y);
	}
}
