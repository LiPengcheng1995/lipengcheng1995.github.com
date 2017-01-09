function createAnalyseInput(){
	for (var i=0;i<dataContent.length;i++) {
		dataInput.push(createAnalyseInputElement(i));
	}
}
function createAnalyseInputElement(){
	var result = {};
	if (arguments.length == 1) {
		result.dataContent = dataContent[arguments[0]];
		result.dataType = dataType[arguments[0]];
		return result;
	} 
	else if (arguments.length == 2) {
		result.dataContent = arguments[0];
		result.dataType = arguments[1];
		return result;
	}
	
}
function analyseSentence(from, to) {
	//from,to是句子的开始点和结束点，包括开始，不包括结束
	console.log("from=" + from + "to=" + to);
	analyseStack = createAnalyseStack();
	analyseQueue = createAnalyseQueue();
	for (var i=from;i<to;i++) {
		analyseQueue.push(dataInput[i]);		
	}
	analyseStack.push(createAnalyseInputElement("#","w"));//#入栈
	analyseQueue.push(createAnalyseInputElement("#","w"));//#入队
	var buffer = new Array();//用一个队列去放规约所得
	step = 0;
	
	showAnalyseStepBuffer = showAnalyseStepBuffer.concat("<tr><td>步骤</td><td>分析栈</td><td>输入流</td><td>关系</td><td>动作</td></tr>");
	
	while(true){
		//先看栈首的第0个终结符
		step++;
		//开始错误检测
		if (analyseTable[analyseStack.getVtFromTop().dataType.charCodeAt() - "a".charCodeAt()][analyseQueue.getFirst().dataType.charCodeAt() - "a".charCodeAt()] == undefined) {
			//出现了未定义的关系，报错
			return false;
		}
	
		if (analyseTable[analyseStack.getVtFromTop().dataType.charCodeAt() - "a".charCodeAt()][analyseQueue.getFirst().dataType.charCodeAt() - "a".charCodeAt()] == "=") {
			//移动，或者两个#【w】结束
			if(analyseStack.getVtFromTop().dataType == "w" && analyseQueue.getFirst().dataType == "w"){
				//结束，接受表达式
				console.log(step+"			"+analyseStack.typeToString()+"			"+analyseQueue.typeToString()+"			=			接受");
				showAnalyseStepBuffer = showAnalyseStepBuffer.concat("<tr><td>"+step+"</td><td>"+analyseStack.typeToString()+"</td><td>"+analyseQueue.typeToString()+"</td><td>=</td><td>接受</td></tr>");
				return checkForValuableNotRight(); 
			}
			//移动
			console.log(step+"			"+analyseStack.typeToString()+"			"+analyseQueue.typeToString()+"			=			移动");
				showAnalyseStepBuffer = showAnalyseStepBuffer.concat("<tr><td>"+step+"</td><td>"+analyseStack.typeToString()+"</td><td>"+analyseQueue.typeToString()+"</td><td>=</td><td>移动</td></tr>");
			analyseStack.push(analyseQueue.getFirst());
			analyseQueue.shift();
			continue;
		}
		
		if (analyseTable[analyseStack.getVtFromTop().dataType.charCodeAt() - "a".charCodeAt()][analyseQueue.getFirst().dataType.charCodeAt() - "a".charCodeAt()] == "<") {
			//移动
			console.log(step+"			"+analyseStack.typeToString()+"			"+analyseQueue.typeToString()+"			<			移动");
				showAnalyseStepBuffer = showAnalyseStepBuffer.concat("<tr><td>"+step+"</td><td>"+analyseStack.typeToString()+"</td><td>"+analyseQueue.typeToString()+"</td><td><</td><td>移动</td></tr>");
			analyseStack.push(analyseQueue.getFirst());
			analyseQueue.shift();	
			continue;
		}
		if (analyseTable[analyseStack.getVtFromTop().dataType.charCodeAt() - "a".charCodeAt()][analyseQueue.getFirst().dataType.charCodeAt() - "a".charCodeAt()] == ">") {
			//规约
			
			
			console.log(step+"			"+analyseStack.typeToString()+"			"+analyseQueue.typeToString()+"			>			规约");
			showAnalyseStepBuffer = showAnalyseStepBuffer.concat("<tr><td>"+step+"</td><td>"+analyseStack.typeToString()+"</td><td>"+analyseQueue.typeToString()+"</td><td>></td><td>规约</td></tr>");
			//提取规约的部分
			var newAddValue = analyseStack.getVtFromTop().dataType.charCodeAt() - "a".charCodeAt();//记录第一个vt的标号，以后的都和它比，相等就继续规约，知道把这一层规约完
			buffer = analyseStack.popVtFromTop();
			while (analyseTable[analyseStack.getVtFromTop().dataType.charCodeAt() - "a".charCodeAt()][newAddValue] == "="){
				var xxx = analyseStack.popVtFromTop();
				for(var i=0;i<xxx.length;i++)
				buffer.push(xxx[i]);
			}
			buffer = buffer.reverse();
			//console.log("buffer="+buffer);
			var resultBuffer = calculateValue(buffer);
			if (resultBuffer == false) {
				return false;
			}
			analyseStack.push(resultBuffer);
	//		console.log("stop");
	//		console.log("  ");
			continue;
		}		
	}
}

function createAnalyseStack() {
	var result = {};
	result.dataContent = new Array();
	//获得从上往下数第1个vt
	result.getVtFromTop = function(){
		for (var i=this.dataContent.length-1;i>=0;i--) {
			if (this.dataContent[i].dataType.charCodeAt() >= "a".charCodeAt() && this.dataContent[i].dataType.charCodeAt() <= "z".charCodeAt()) {
				
					return this.dataContent[i];
				
			}			
		}
		return false;
	};
	//将从上往下数第1个vt和上边的所有东西出栈,将出栈结果return
	result.popVtFromTop = function(){
		
		var xxx = new Array();
		var flag = true;
	
		while(true){
			var x = this.dataContent.pop();
			if (x.dataType.charCodeAt()>="a".charCodeAt() && x.dataType.charCodeAt()<="z".charCodeAt()) {
				if(flag == true){
					flag = false;			
					xxx.push(x);
					continue;	
				}
				this.dataContent.push(x);				
				return xxx;
			}
			xxx.push(x);
		}
		
	};
	result.push = function(input){
		//压栈一个字符
		this.dataContent.push(input);
	//	console.log("刚刚push了一个"+input);
	}
	result.contentToString = function(){
		var x = new Array();
		for (var i=0;i<this.dataContent.length;i++) {
			x.push(this.dataContent[i].dataContent);
		}
		return x.join(" ");
	}
	result.typeToString = function(){
		var x = new Array();
		for (var i=0;i<this.dataContent.length;i++) {
			x.push(this.dataContent[i].dataType);
		}
		return x.join(" ");
	}
	
	return result;
}

function createAnalyseQueue() {
	var result = {};
	result.dataContent = new Array();
	result.getFirst = function(){
		return this.dataContent[0];
	};
	//去掉队头
	result.shift = function(){
		return this.dataContent.shift();
	};
	//在队尾添加
	result.push = function(input){
		this.dataContent.push(input);
	};
	result.contentToString = function(){
		var x = new Array();
		for (var i=0;i<this.dataContent.length;i++) {
			x.push(this.dataContent[i].dataContent);
		}
		return x.join(" ");
	}
	result.typeToString = function(){
		var x = new Array();
		for (var i=0;i<this.dataContent.length;i++) {
			x.push(this.dataContent[i].dataType);
		}
		return x.join(" ");
	}
	return result;
}


function initAnalyseTable() {
	for(var i = 0; i < analyseTable.length; i++) {
		analyseTable[i] = new Array(analyseTable.length);
	}
	for(var i = 0; i < expression.length; i++) {
		//开始一个句子一个句子的找关系
		var allVt = getAllVt(i);
		for(var j = 0; j < allVt.length; j++) {
			//对第j个allVt中存储的位置进行关系添加
			if(allVt[j] > 3 && expression[i].charCodeAt(allVt[j] - 1) >= "A".charCodeAt() && expression[i].charCodeAt(allVt[j] - 1) <= "Z".charCodeAt()) {
				//如果它的左侧有非终结符
				var getIt = expression[i].charCodeAt(allVt[j] - 1) - "A".charCodeAt(); //获得左侧的非终结符的所在
				for(var k = 0; k < LastVt[getIt].length; k++) {
					//把这个非终结符的LastVt一个一个的搞进去
					analyseTable[LastVt[getIt].charCodeAt(k) - "a".charCodeAt()][expression[i].charCodeAt(allVt[j]) - "a".charCodeAt()] = ">";
				}

			}
			if(allVt[j] < expression[i].length-1 && expression[i].charCodeAt(allVt[j] + 1) >= "A".charCodeAt() && expression[i].charCodeAt(allVt[j] + 1) <= "Z".charCodeAt()) {
				//如果它的右侧有非终结符
				var getIt = expression[i].charCodeAt(allVt[j] + 1) - "A".charCodeAt(); //获得右侧的非终结符的所在
				for(var k = 0; k < FirstVt[getIt].length; k++) {
					//把这个非终结符的FirstVt一个一个的搞进去
				//	console.log(expression[i].charAt(allVt[j]));
					analyseTable[expression[i].charCodeAt(allVt[j]) - "a".charCodeAt()][FirstVt[getIt].charCodeAt(k) - "a".charCodeAt()] = "<";
				}
			}
			if (allVt.length>1) {
				//如果它的长度大于1，就要加入等号
				for (var k=0;k<allVt.length;k++) {
					if (k == j) {
						continue;
					}
					analyseTable[expression[i].charCodeAt(allVt[j]) - "a".charCodeAt()][expression[i].charCodeAt(allVt[k]) - "a".charCodeAt()] = "=";
				}
			}
		}
		
	}
}

function getAllVt(index) {
	//获得编号为index的推导式的所有vt下标,返回一个下标组成的数组
	var result = new Array()
	for(var i = 3; i < expression[index].length; i++) {
		if(expression[index].charCodeAt(i) >= "a".charCodeAt() && expression[index].charCodeAt(i) <= "z".charCodeAt()) {
			//找到一个终结符
			result.push(i);
		}
	}
	return result;
}


function getLastVt(index) {
	//求index位置的LastVt
//	console.log("进入一次getLastVt,求下标" + index + "是" + String.fromCharCode(index + "A".charCodeAt()));
	var usedExpression = getExpressionUsedThis(String.fromCharCode(index + "A".charCodeAt()));

//	for(var i = 0; i < usedExpression.length; i++) {
	//	console.log(expression[usedExpression[i]]);
//	}
//	console.log("停");
	var buffer = new String();
	for(var i = 0; i < usedExpression.length; i++) {
		var k = getLastVtIndex(usedExpression[i]);
	//	console.log("长度" + usedExpression.length + "判断的表达式的下标" + usedExpression[i] + "最后一个终结符的位置" + k);
		if(k == expression[usedExpression[i]].length - 1) {
			//最后一个是终结符
			if(buffer.indexOf(expression[usedExpression[i]][k]) == -1) {
				//不含有这个终结符
				buffer = buffer.concat(expression[usedExpression[i]][k]);
			}
		} else if(k == expression[usedExpression[i]].length - 2) {
			//倒数第二个是终结符
			if(buffer.indexOf(expression[usedExpression[i]][k]) == -1) {
				//不含有这个终结符
				buffer = buffer.concat(expression[usedExpression[i]][k]);
			}
			if(expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt() == index) {
				continue; //自己循环没意思
			}
			if(LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()] == undefined) {
				//不存在,就先求
				getLastVt(expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt());
			}
			for(var j = 0; j < LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()].length; j++) {
				if(buffer.indexOf(LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()].charAt(j)) == -1) {
					//不含有这个终结符
					buffer = buffer.concat(LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()].charAt(j));
					//这里改了
				}
			}
		} else if(k == -1) {
			//推出的只有一个非终结符
			if(LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()] == undefined) {
				//不存在,就先求
				getLastVt(expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt());
			}
			for(var j = 0; j < LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()].length; j++) {
				if(buffer.indexOf(LastVt[expression[usedExpression[i]].charCodeAt(expression[usedExpression[i]].length - 1) - "A".charCodeAt()].charAt(j)) == -1) {
					//不含有这个终结符
					buffer = buffer.concat(LastVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].charAt(j));
				}
			}
		}
	}
	LastVt[index] = buffer;
}

function getLastVtIndex(index) {
	//获得编号为index的推导式的第一个vt,如果没有则返回-1
	for(var i = expression[index].length - 1; i >= 3; i--) {
		if(expression[index].charCodeAt(i) >= "a".charCodeAt() && expression[index].charCodeAt(i) <= "z".charCodeAt()) {
			//找到一个终结符，返回
			return i;
		}
	}
	return -1; //没找到，return -1;

}

function getFirstVt(index) {
	//求index位置的FirstVt
	//console.log("进入一次getFirstVt,求下标" + index + "是" + String.fromCharCode(index + "A".charCodeAt()));
	var usedExpression = getExpressionUsedThis(String.fromCharCode(index + "A".charCodeAt()));
	var buffer = new String();
	for(var i = 0; i < usedExpression.length; i++) {
		var k = getFirstVtIndex(usedExpression[i]);

		if(k == 3) {
			//第一个是终结符
			if(buffer.indexOf(expression[usedExpression[i]][3]) == -1) {
				//不含有这个终结符
				buffer = buffer.concat(expression[usedExpression[i]][3]);
			}

		} else if(k == 4) {
			//第一个是非终结符，第二个是终结符
			if(buffer.indexOf(expression[usedExpression[i]][4]) == -1) {
				//不含有这个终结符
				buffer = buffer.concat(expression[usedExpression[i]][4]);
			}
			if(expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt() == index) {
				continue; //自己循环没意思
			}
			if(FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()] == undefined) {
				//不存在,就先求
				getFirstVt(expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt());
			}
			for(var j = 0; j < FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].length; j++) {
				if(buffer.indexOf(FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].charAt(j)) == -1) {
					//不含有这个终结符
					buffer = buffer.concat(FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].charAt(j));
				}
			}

		} else if(k == -1) {
			//没有终结符，只有一个非终结符
			if(FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()] == undefined) {
				//不存在,就先求
				getFirstVt(expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt());
			}
			for(var j = 0; j < FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].length; j++) {
				if(buffer.indexOf(FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].charAt(j)) == -1) {
					//不含有这个终结符
					buffer = buffer.concat(FirstVt[expression[usedExpression[i]].charCodeAt(3) - "A".charCodeAt()].charAt(j));
				}
			}
		}
	}
	FirstVt[index] = buffer;
}

function getFirstVtIndex(index) {
	//获得编号为index的推导式的第一个vt,如果没有则返回-1
	for(var i = 3; i < expression[index].length; i++) {
		if(expression[index].charCodeAt(i) >= "a".charCodeAt() && expression[index].charCodeAt(i) <= "z".charCodeAt()) {
			//找到一个终结符，返回
			return i;
		}
	}
	return -1; //没找到，return -1;

}

function getExpressionUsedThis(x) {
	//返回一个数组，数组中是x推出式的表达式下标
	var y = new Array();
	//console.log(x);
	for(var i = 0; i < expression.length; i++) {
		if(x == expression[i].charAt(0)) {
			y.push(i);
		}
	}
	return y;
}



function initExpression() {
	expression.push("S->wRw");
	expression.push("R->sAv");
	expression.push("R->Av");
	expression.push("T->Av");
	expression.push("A->ApA");
	expression.push("A->B");
	expression.push("B->QoC");
	expression.push("B->C");
	expression.push("C->CnCuC");
	expression.push("C->D");
	expression.push("D->DmD");
	expression.push("D->E");
	expression.push("E->ElE");
	expression.push("E->F");
	expression.push("F->FkF");
	expression.push("F->G");
	expression.push("G->GjG");
	expression.push("G->H");
	expression.push("H->HiH");
	expression.push("H->I");
	expression.push("I->IhI");
	expression.push("I->J");
	expression.push("J->JgJ");
	expression.push("J->K");
	expression.push("K->KfK");
	expression.push("K->L");
	expression.push("L->LeL");
	expression.push("L->M");
	expression.push("M->MdM");
	expression.push("M->N");
	expression.push("N->cN");
	expression.push("N->O");
	expression.push("O->Ob");
	expression.push("O->P");
	expression.push("P->Q");
	expression.push("P->r");
	expression.push("Q->q");
	expression.push("Q->qart");

}

/*
 * 使用算符优先文法吧，算符优先，不报错，专心计算
 * 
 * 算符优先文法，先将所有的式子都录入进去吧，用一个大大大的Array()数组
 */
