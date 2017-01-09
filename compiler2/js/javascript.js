/*
 *先根据C语言的命名规则将源码分为五类：声明符、变量、常量、运算符、赋值符
 * 然后将有声明符的句子的第一个和逗号左侧的变量入表
 * 然后进行算符优先的语法分析
 * 最后算值
 */
var codeInput = document.getElementById("codeInput"); //输入源码
var dataContent = new Array(); //用来放内容
var dataType = new Array(); //用来放类型
var dataInput = new Array();//将dataContent和dataType合为一体，方便在规约时计算
var sentence = new Array();//将dataType根据分号切开，方便一句一句分析
var valueTable = new Array();//符号表，里边放的都是对象，包括变量名，变量值，是否合法
var step;
var analyseTable = new Array("w".charCodeAt() - "a".charCodeAt() + 1);
var analyseStack;
var analyseQueue;
var expression = new Array();
var FirstVt = new Array("S".charCodeAt() - "A".charCodeAt() + 1);
var LastVt = new Array("S".charCodeAt() - "A".charCodeAt() + 1);

var showPrecedenceTable = document.getElementById("precedenceTable");//用来展示算符关系表
var showAnalyseStep = document.getElementById("analyseStepShowDiv");//用来展示算符优先分析过程
var showAnalyseStepNav = document.getElementById("showAnalyseStepNav");
var showValueTable = document.getElementById("valueShowTable");//用来展示运算结果的表


var showAnalyseStepBuffer;
window.onload = function(){
	//在页面加载完成后进行算符关系表的构建和展示
	//接下来，求FirstVt和LastVt,要用到递归
	initExpression();
	//开始求FirstVt
	for(var i = 0; i < FirstVt.length; i++) {
		if(!FirstVt[i]) {
			//还没求，则求
			getFirstVt(i);
		}
		//不为空则一定求全了，继续看下一个
	}

	//开始求LastVt
	for(var i = 0; i < LastVt.length; i++) {
		if(!LastVt[i]) {
			//还没求，则求
			getLastVt(i);
		}
		//不为空则一定求全了，继续看下一个		
	}

	//FirstVt和LastVt求完了，接下来开始画
	initAnalyseTable();
	//初始化完成，把表格列出来看看
	var buffer = new String();
	buffer = buffer.concat("<tr><td></td>");
	for(var i=0;i<analyseTable.length;i++){
		buffer = buffer.concat("<td>"+String.fromCharCode("a".charCodeAt()+i)+"</td>");
	}
	buffer = buffer.concat("</tr>");
	for (var i=0;i<analyseTable.length;i++) {
		buffer = buffer.concat("<tr><td>"+String.fromCharCode("a".charCodeAt()+i)+"</td>");
		for (var j=0;j<analyseTable[i].length;j++) {
			if (analyseTable[i][j]) {
				buffer = buffer.concat("<td>",analyseTable[i][j],"</td>");
				continue;
			}
			buffer = buffer.concat("<td></td>");
		}
		buffer = buffer.concat("</tr>");
		
	}
	showPrecedenceTable.innerHTML = buffer;
}

document.getElementById("onOk").onclick = function() {
	dataContent = new Array(); //用来放内容
	dataType = new Array(); //用来放类型
	dataInput = new Array();//将dataContent和dataType合为一体，方便在规约时计算
	sentence = new Array();//将dataType根据分号切开，方便一句一句分析
	valueTable = new Array();//符号表，里边放的都是对象，包括变量名，变量值，是否合法
	expression = new Array();
	FirstVt = new Array("S".charCodeAt() - "A".charCodeAt() + 1);
	LastVt = new Array("S".charCodeAt() - "A".charCodeAt() + 1);
	
	


	inputSplit();
	
/*	for(var i = 0; i < expression.length; i++) {
		console.log(expression[i]);
	}*/
	
	//接下来创建栈和队列，并根据表格进行算符优先的词法分析
	createAnalyseInput();//创建优先分析的对象
	showAnalyseStepBuffer = new String();
	sentence.push(0);	
	for(var i = 0; i < dataType.length; i++) {
		if(dataType[i] == "v") {
			sentence.push(i + 1);
		}
	}
	createAnalyseInput();
	var yyy = new String();
	yyy = yyy.concat("<a class='dropdown-toggle' data-toggle='dropdown' href='#'>算符优先分析过程<span id='ifMore'></span></a><ul class='dropdown-menu'>");
	/*
	 * 做到这里了。明天扫尾
	 * 
	 */
	for(var i = 1; i < sentence.length; i++) {
		showAnalyseStepBuffer = showAnalyseStepBuffer.concat("<h2 id='t"+i+"'>&nbsp;</h2><h2>第"+i+"条语句的分析</h2><table class='table'>");
		yyy = yyy.concat("<li><a href='#t"+i+"'>第"+i+"条语句的分析</a></li>");
		if(analyseSentence(sentence[i - 1], sentence[i]) == false){
			alert("第"+i+"句话存在错误");
			return ;
		}
		showAnalyseStepBuffer = showAnalyseStepBuffer.concat("</table>");
				
	}
	showAnalyseStep.innerHTML = showAnalyseStepBuffer;
	yyy.concat("</ul>");
	showAnalyseStepNav.innerHTML = yyy; 

	//测试阶段先注释掉这个，方便一步一步跑
	

	var showValueTableBuffer = new String();
	showValueTableBuffer = showValueTableBuffer.concat("<tr><td>编号</td><td>变量名称</td><td>变量属性</td><td>变量值</td></tr>");
	for (var i=0;i<valueTable.length;i++) {
		showValueTableBuffer = showValueTableBuffer.concat("<tr><td>"+i+"</td><td>"+valueTable[i].valueName+"</td><td>");
		if (valueTable[i].ifArray) {
			showValueTableBuffer = showValueTableBuffer.concat("数组，长度为"+valueTable[i].arrayMember.length+"<\td><td>"+valueTable[i].arrayMember.join(" ")+"</td></tr>");
		}
		else{
			showValueTableBuffer = showValueTableBuffer.concat("int</td><td>"+valueTable[i].valueValue+"</td></tr>");
		}
	}
	showValueTable.innerHTML = showValueTableBuffer;
	
	
}
document.getElementById("onClear").onclick = function(){
	codeInput.value = "";
	showAnalyseStep.innerHTML="";//用来展示算符优先分析过程
	showAnalyseStepNav.innerHTML="<a class='dropdown-toggle' data-toggle='dropdown' href='#'>算符优先分析过程<span id='ifMore'></span></a><ul class='dropdown-menu'>";
	showValueTable.innerHTML="";//用来展示运算结果的表
	valueTable = new Array();
}
