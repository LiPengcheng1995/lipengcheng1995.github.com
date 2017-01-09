/*
 * 传入的是一个数组，数组的所有元素都是一个个的对象：
 * 			对象的属性有：
 */
/*
 * 赋值运算要获得对象指向的表格中的变量名
 * 其他的运算要获得对象代表的数值
 * 在规约变量时如何判断变量是
 * 		表中存在、重复声明？
 * 		表中没有、使用未声明变量？
 * 		正确使用？
 * 	三个状态，用两个分支区分
 * 
 * 	表中新加一条属性，是否合法
 * 		遇到变量，先在表中看是否存在，存在则查值
 * 									不存在则加进去，置默认值0，“是否合法”为false，
 * 		遇到赋值，左侧属性因为经过规约，一定在表中有，计算完值后在表中的
 * 		在计算 int N ;时，检查表格，对N指向的可能声明变量链表中的所有变量都判断，
 * 							遇到true表示重复声明，报错挂掉
 * 							遇到false表示新声明的变量，赋值true
 * 						如果没有可能声明变量链，就检查指向变量
 * 		在计算N;时，不干活
 *		接受规约后，检查表格，表格中的所有变量都判断，
 * 							遇到true表示使用正确
 * 							遇到false表示使用了未声明的变量，报错挂掉
 * 		在赋值规约时，传出的结果的变量指向为赋值号前边的变量
 * 		在使用逗号时，传出的结果加一个属性：可能声明的变量链，由表达式规约成的非终结符指向的变量
 */
function checkForValuableNotRight(){
	//检查 变量表，如果有
	for (var i=0;i<valueTable.length;i++) {
		if (valueTable[i].ifRight == false) {
			return false;
		}
	}
	return true;
}
function createToPutIntoValueTable(){
	//默认的是否合法都是false。因为新加的嘛
	var result = {};
	result.valueName = arguments[0];
	result.valueValue = 0;
	result.ifRight = false;
	result.ifArray = false;//默认不是
	if (arguments.length == 2) {
		//传入了两个参数，说明这个变量是数组，第二个参数是数组长度
		result.ifArray = true;
		result.arrayMember = new Array(arguments[1]);
		for (var i=0;i<arguments[1];i++) {
			result.arrayMember[i] = 0;//默认初值是0
		}
		
	}
	
	valueTable.push(result);
}
function positionInValueTable(valueName){
	//返回该名字的变量在表中的下标，不存在则返回-1
	for (var i=0;i<valueTable.length;i++) {
		if (valueTable[i].valueName == valueName) {
			return i;
		}		
	}
	return -1;
}
function ifValueTableContains(valueName){
	//调用上一个函数，返回的如果是-1就表示不包含，返回false,否则返回true
	if (positionInValueTable(valueName) == -1) {
		return false;
	}
	return true;
}

//算值和返回的函数
function calculateValue(inputArray){
	console.log("规约的长度是"+inputArray.length);
	if (inputArray.length == 1) {
		//长度为1，变量查值或者常量过度运算
		if (inputArray[0].dataType == "q") {
			//是变量
		//	console.log("进入p的规约计算");
			if (ifValueTableContains(inputArray[0].dataContent) == false) {
				//变量表中没有
				console.log("进入添加新变量的条件分支");
				createToPutIntoValueTable(inputArray[0].dataContent);
			}
			//创建返回的非终结符号,dataContent是链接到的变量的名字，dataType是"N"非终结符，再加一个dataValue
			var xxx = createAnalyseInputElement(inputArray[0].dataContent,"N");
			//dataValue从valueTable中直接读
			xxx.dataValue = valueTable[positionInValueTable(inputArray[0].dataContent)].valueValue;
			return xxx;			
		}
		if (inputArray[0].dataType == "r") {
			//是常量
			var xxx = createAnalyseInputElement(undefined,"N");
			xxx.dataValue = parseInt(inputArray[0].dataContent);
			return xxx;
		}
	}
	//console.log("经过了length=1的作用范围");
	
	if (inputArray.length == 2) {
		//长度为2，是后加加减减，前加加减减非反，完整语句
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "b") {
			//后加加减减
			var x = positionInValueTable(inputArray[0].dataContent);
			var xxx = createAnalyseInputElement(inputArray[0].dataContent,"N");
			xxx.dataValue = valueTable[x].valueValue;
			
			if (inputArray[0].ifArray) {
				//是数组的
				xxx.ifArray = true;
				xxx.positionInArray = inputArray[0].positionInArray;
				if (inputArray[1].dataContent == "++") {
					//后加加
					valueTable[x].arrayMember[inputArray[0].positionInArray]++;
					console.log("asdfa");
				}
				else if(inputArray[1].dataContent == "--"){
					//后减减
					valueTable[x].arrayMember[inputArray[0].positionInArray]--;
				}
			} 
			else{
				if (inputArray[1].dataContent == "++") {
					//后加加
					console.log("进入后加加");
					valueTable[x].valueValue++;
					console.log("完");
				}
				else if(inputArray[1].dataContent == "--"){
					//后减减
					valueTable[x].valueValue--; 
				}	
			}
						
			return xxx;	
			
		}
		if(inputArray[0].dataType == "c" && inputArray[1].dataType == "N") {
			//前加加减减非反
			var x = positionInValueTable(inputArray[1].dataContent);
			var xxx = createAnalyseInputElement(inputArray[1].dataContent,"N");
			
			if (inputArray[0].dataContent == "++") {
				//前加加
				
				if (inputArray[1].ifArray) {
					//是数组中的
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[1].positionInArray;
					valueTable[x].arrayMember[inputArray[1].positionInArray]++;
					xxx.dataValue = valueTable[x].arrayMember[inputArray[1].positionInArray];
				} else{
					valueTable[x].valueValue++;
					xxx.dataValue = valueTable[x].valueValue;	
				}
				
				return xxx;	
			}
			else if(inputArray[0].dataContent == "--"){
				//前减减
				if (inputArray[1].ifArray) {
					//是数组中的
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[1].positionInArray;
					valueTable[x].arrayMember[inputArray[1].positionInArray]--;
					xxx.dataValue = valueTable[x].arrayMember[inputArray[1].positionInArray];
				} else{
					valueTable[x].valueValue--;
					xxx.dataValue = valueTable[x].valueValue;	
				}
				return xxx;	
			}
			else if(inputArray[0].dataContent == "!"){
				//逻辑非
				/*
				 * 
				 * 
				 * 搞到这里了明天继续
				 */
				if (valueTable[x].ifArray == true) {
					//是数组
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[1].positionInArray;
					if (valueTable[x].arrayMember[inputArray[1].positionInArray] == 0) {
						xxx.dataValue = 1;
						return xxx;
					}
					xxx.dataValue = 0;
					return xxx;
				}
				//不是数组
				if(valueTable[x].valueValue == 0){
					xxx.dataValue = 1;
					return xxx;
				}
				xxx.dataValue = 0;
				return xxx;				
			}
			else if(inputArray[0].dataContent == "~"){
				//位取反	
				if (valueTable[x].ifArray == true) {
					//是数组
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[1].positionInArray;
					xxx.dataValue = ~valueTable[x].arrayMember[inputArray[1].positionInArray];
					return xxx;
				}
				xxx.dataValue = ~valueTable[x].valueValue;
				return xxx;
			}
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "v") {
			//完整语句，赋值语句
			var xxx = createAnalyseInputElement(inputArray[0].dataContent,"N");
			if(inputArray[0].dataContent == undefined){
				//如果是undefined
				
			}
			else if (valueTable[positionInValueTable(inputArray[0].dataContent)].ifArray) {
				//如果是数组
				xxx.ifArray = true;
				xxx.positionInArray = inputArray[0].positionInArray;
			}
			xxx.dataValue = inputArray[0].dataValue;
			return xxx;
		}
	}
	if (inputArray.length == 3) {
		//长度为3
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "d" && inputArray[2].dataType =="N") {
			//乘除，求余
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[1].dataContent == "*") {
				xxx.dataValue = inputArray[0].dataValue * inputArray[2].dataValue;
			}
			if (inputArray[1].dataContent == "/") {
				xxx.dataValue = inputArray[0].dataValue / inputArray[2].dataValue;
			}
			if (inputArray[1].dataContent == "%") {
				xxx.dataValue = inputArray[0].dataValue % inputArray[2].dataValue;
			}
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "e" && inputArray[2].dataType =="N") {
			//加减
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[1].dataContent == "+") {
				xxx.dataValue = inputArray[0].dataValue + inputArray[2].dataValue;
			}
			if (inputArray[1].dataContent == "-") {
				xxx.dataValue = inputArray[0].dataValue - inputArray[2].dataValue;
			}
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "f" && inputArray[2].dataType =="N") {
			//移位运算
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[1].dataContent == "<<") {
				xxx.dataValue = inputArray[0].dataValue << inputArray[2].dataValue;
			}
			else if (inputArray[1].dataContent == ">>") {
				xxx.dataValue = inputArray[0].dataValue >> inputArray[2].dataValue;
			}
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "g" && inputArray[2].dataType =="N") {
			//逻辑比较运算，大于小于，大于等于，小于等于
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[1].dataContent == ">") {
				if (inputArray[0].dataValue > inputArray[2].dataValue) {
					xxx.dataValue = 1;
				}
				else {
					xxx.dataValue = 0;
				}
			}
			else if (inputArray[1].dataContent == "<") {
				if (inputArray[0].dataValue < inputArray[2].dataValue) {
					xxx.dataValue = 1;
				}
				else {
					xxx.dataValue = 0;
				}
			}
			else if (inputArray[1].dataContent == ">=") {
				if (inputArray[0].dataValue >= inputArray[2].dataValue) {
					xxx.dataValue = 1;
				}
				else {
					xxx.dataValue = 0;
				}
			}
			else if (inputArray[1].dataContent == "<=") {
				if (inputArray[0].dataValue <= inputArray[2].dataValue) {
					xxx.dataValue = 1;
				}
				else {
					xxx.dataValue = 0;
				}
			}
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "h" && inputArray[2].dataType =="N") {
			//逻辑比较运算，等于等于，不等于
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[1].dataContent == "==") {
				if (inputArray[0].dataValue == inputArray[2].dataValue) {
					xxx.dataValue = 1;
				}
				else {
					xxx.dataValue = 0;
				}
			}
			else if (inputArray[1].dataContent == "!=") {
				if (inputArray[0].dataValue != inputArray[2].dataValue) {
					xxx.dataValue = 1;
				}
				else {
					xxx.dataValue = 0;
				}
			}
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "i" && inputArray[2].dataType =="N") {
			//位运算，与
			var xxx = createAnalyseInputElement(undefined,"N");
			xxx.dataValue = inputArray[0].dataValue & inputArray[2].dataValue;
			return xxx;
			
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "j" && inputArray[2].dataType =="N") {
			//位运算，亦或
			var xxx = createAnalyseInputElement(undefined,"N");
			xxx.dataValue = inputArray[0].dataValue ^ inputArray[2].dataValue;
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "k" && inputArray[2].dataType =="N") {
			//位运算，或
			var xxx = createAnalyseInputElement(undefined,"N");
			xxx.dataValue = inputArray[0].dataValue | inputArray[2].dataValue;
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "l" && inputArray[2].dataType =="N") {
			//逻辑运算，与
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[0].dataValue != 0 && inputArray[2].dataValue != 0) {
				//全真则为真
				xxx.dataValue = 1;
			}
			else{
				xxx.dataValue = 0;
			}
			return xxx;
			
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "m" && inputArray[2].dataType =="N") {
			//逻辑运算，或
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[0].dataValue != 0 || inputArray[2].dataValue != 0) {
				//有一真则为真
				xxx.dataValue = 1;
			}
			else{
				xxx.dataValue = 0;
			}
			return xxx;
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "o" && inputArray[2].dataType =="N") {
			//赋值运算=,+=,-=,*=,/=
			var xxx = createAnalyseInputElement(inputArray[0].dataContent,"N");
			
			if (inputArray[1].dataContent == "=") {
				xxx.dataValue =  inputArray[2].dataValue;
				if (inputArray[0].ifArray) {
					//如果是数组中的话
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[0].positionInArray;
					valueTable[positionInValueTable(xxx.dataContent)].arrayMember[inputArray[0].positionInArray] = xxx.dataValue;
					
				}
				else{
					valueTable[positionInValueTable(xxx.dataContent)].valueValue = xxx.dataValue;	
				}
				
				 
			}
			else if (inputArray[1].dataContent == "+=") {
				xxx.dataValue =  inputArray[0].dataValue + inputArray[2].dataValue;				
				if (inputArray[0].ifArray) {
					//如果是数组中的话
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[0].positionInArray;
					valueTable[positionInValueTable(xxx.dataContent)].arrayMember[inputArray[0].positionInArray] = xxx.dataValue;
					
				}
				else{
					valueTable[positionInValueTable(xxx.dataContent)].valueValue = xxx.dataValue; 	
				}
				
			}
			else if (inputArray[1].dataContent == "-=") {
				xxx.dataValue =  inputArray[0].dataValue - inputArray[2].dataValue;
				if (inputArray[0].ifArray) {
					//如果是数组中的话
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[0].positionInArray;
					valueTable[positionInValueTable(xxx.dataContent)].arrayMember[inputArray[0].positionInArray] = xxx.dataValue;
					
				}
				else{
					valueTable[positionInValueTable(xxx.dataContent)].valueValue = xxx.dataValue;	
				}
				 
			}
			else if (inputArray[1].dataContent == "*=") {
				xxx.dataValue =  inputArray[0].dataValue * inputArray[2].dataValue;
				if (inputArray[0].ifArray) {
					//如果是数组中的话
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[0].positionInArray;
					valueTable[positionInValueTable(xxx.dataContent)].arrayMember[inputArray[0].positionInArray] = xxx.dataValue;
					
				}
				else{
					valueTable[positionInValueTable(xxx.dataContent)].valueValue = xxx.dataValue;	
				}
			}
			else if (inputArray[1].dataContent == "/=") {
				xxx.dataValue =  inputArray[0].dataValue / inputArray[2].dataValue;
				if (inputArray[0].ifArray) {
					//如果是数组中的话
					xxx.ifArray = true;
					xxx.positionInArray = inputArray[0].positionInArray;
					valueTable[positionInValueTable(xxx.dataContent)].arrayMember[inputArray[0].positionInArray] = xxx.dataValue;
					
				}
				else{
					valueTable[positionInValueTable(xxx.dataContent)].valueValue = xxx.dataValue;	
				}
			}
			return xxx;
			
		}
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "p" && inputArray[2].dataType =="N") {
			//逗号运算
			//这里有变化，要加入一些东西，
			//先创建一个新的属性someValuableMaybeNew，
			//然后检查两个N是否有指向的变量，有的话放进去，
			//再然后检查后一个是不是有someValuableMaybeNew属性，有的话一起放进去
			//注意，以上往里加的时候不用查重，有一个算一个
			var xxx = createAnalyseInputElement(undefined,"N");
			xxx.dataValue = inputArray[2].dataValue;
			xxx.someValuableMaybeNew = new Array();
			console.log("进入逗号的规约计算");
			xxx.someValuableMaybeNew.push(inputArray[0]);
			console.log("前一个的变量加进去了");
			if (inputArray[2].dataContent) {
				xxx.someValuableMaybeNew.push(inputArray[2]);	
			}
			console.log("后一个的变量加进去了");
			if (inputArray[2].someValuableMaybeNew) {
				for (var i=0;i<inputArray[2].someValuableMaybeNew.length;i++) {
					xxx.someValuableMaybeNew.push(inputArray[2].someValuableMaybeNew[i]);
				}
			}
			console.log("后一个的链加进去了");
			return xxx;
			
		}
		if (inputArray[0].dataType == "s" && inputArray[1].dataType == "N" && inputArray[2].dataType =="v") {
			//完整语句，声明语句
			//声明语句要对变量表进行检查了，N中可能会有一个someValuableMaybeNew的链表，
			//注意啦，开始一个一个的检查这些变量在表中的情况，
			//如果ifRight是false则说明它是新加入的，把它改为true【转正了】
			//如果ifRight是true则说明它已经存在了，重复声明了
			var xxx = createAnalyseInputElement(undefined,"N");
			xxx.dataValue = 0;//反正也不用，赋值成0吧
			if (inputArray[1].dataContent) {
				if (valueTable[positionInValueTable(inputArray[1].dataContent)].ifRight == false) {
					valueTable[positionInValueTable(inputArray[1].dataContent)].ifRight = true;
				}
				else return false;
			}
			if (inputArray[1].someValuableMaybeNew) {
				for (var i=0;i<inputArray[1].someValuableMaybeNew.length;i++) {
					console.log("inputArray[1].someValuableMaybeNew[i].dataContent="+inputArray[1].someValuableMaybeNew[i].dataContent);
					if (valueTable[positionInValueTable(inputArray[1].someValuableMaybeNew[i].dataContent)].ifRight == false) {
					valueTable[positionInValueTable(inputArray[1].someValuableMaybeNew[i].dataContent)].ifRight = true;
					}
					else return false;
				}
			}			
			return xxx;
		}
		
	}
	if (inputArray.length == 4) {
		//变量[常量]
		if (inputArray[0].dataType == "q" && inputArray[1].dataType == "a" && inputArray[2].dataType =="r" && inputArray[3].dataType == "t") {
			//中括号运算，变量[常量]
			var xxx = createAnalyseInputElement(inputArray[0].dataContent,"N");
			if (ifValueTableContains(inputArray[0].dataContent) == false) {
				//不存在，申请一个
				createToPutIntoValueTable(inputArray[0].dataContent,parseInt(inputArray[2].dataContent));
			}
			else if(valueTable[positionInValueTable(inputArray[0].dataContent)].arrayMember.length <= parseInt(inputArray[2].dataContent)){
				return false;//数组越界
			}
			xxx.dataValue = valueTable[positionInValueTable(inputArray[0].dataContent)].arrayMember[parseInt(inputArray[2].dataContent)];
			xxx.ifArray = true;
			xxx.positionInArray = parseInt(inputArray[2].dataContent);		
			console.log("这里数组添加完成");
			return xxx;
			
		}		
	}
	if (inputArray.length == 5) {
		//条件判断运算
		
		if (inputArray[0].dataType == "N" && inputArray[1].dataType == "n" && inputArray[2].dataType == "N" && inputArray[3].dataType == "u" && inputArray[4].dataType == "N") {
			//条件判断运算
			var xxx = createAnalyseInputElement(undefined,"N");
			if (inputArray[0].dataValue != 0) {
				xxx.dataValue = inputArray[2].dataValue;
			}
			else{
				xxx.dataValue = inputArray[4].dataValue;
			}
			return xxx;
		}
		
	}
	return false;
}






