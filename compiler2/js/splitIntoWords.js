function inputSplit(){
	var content = codeInput.value;
	content = content.replace(/[\r\n]/g, "");//去掉换行回车
	var register = new String();
	var ifBlank = true;//判断上一个读入的是否是空格
	var type = 0;
	/*
	 * 0表示无
	 * 1表示声明符或者变量
	 * 2表示常量
	 * 3表示符号
	 */
	for (var i=0;i<content.length;i++) {
		if (content[i] == " ") {
			if (ifBlank) {//多个连续的空格，吃掉
				continue;
			}
			ifBlank = true;//已经读入一个空格，开始新的单词
			if (register.length != 0) {//非空则保存
				type = 0;
				if(identifyType(register) == false) {
					console.log("含有不能识别的单词");
					return ;
				}
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
			
			}
				continue;	
		}
		ifBlank = false;//置false表示还没读入过空格
		if (type == 0) {
		//	console.log("进入0状态，判断的是"+content[i]);
			//新单词
			if ((content[i].charCodeAt() >= "a".charCodeAt() && content[i].charCodeAt() <="z".charCodeAt()) || 
				(content[i].charCodeAt() >= "A".charCodeAt() && content[i].charCodeAt() <="Z".charCodeAt()) ||
				content[i].charCodeAt() == "_".charCodeAt()) {
				//字母、下划线开头
				type = 1;
				register = register.concat(content[i]);			
			}
			else if (maybeSymbolPart(content[i])) {
				//是一个符号的开头
				type = 3;
				register = register.concat(content[i]);		
			}
			else if (aSymbol(content[i])) {
				//是一个符号
				type = 0;
				register = register.concat(content[i]);	
				if(identifyType(register) == false) {
					console.log("含有不能识别的单词");
					return ;
				}
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
			}
			else if (content[i].charCodeAt() >= "0".charCodeAt() && content[i].charCodeAt() <="9".charCodeAt()) {
				//是一个数字，则是常量
				type = 2
				register = register.concat(content[i]);		
			} 
			else{
				console.log("有不能识别的符号"+register[i]);
				break;
			}
		}
		else if (type == 1) {
			//console.log("进入1状态，判断的是"+content[i]);
			//一个单词
			if ((content[i].charCodeAt() >= "a".charCodeAt() && content[i].charCodeAt() <="z".charCodeAt()) || 
				(content[i].charCodeAt() >= "A".charCodeAt() && content[i].charCodeAt() <="Z".charCodeAt()) ||
				content[i].charCodeAt() == "_".charCodeAt() ||
				(content[i].charCodeAt() >= "0".charCodeAt() && content[i].charCodeAt() <="9".charCodeAt())) {
				//数字、字母、下划线
				type = 1;
				register = register.concat(content[i]);			
			}
			else if (maybeSymbolPart(content[i])) {
				//是一个符号的开头
				type = 0;
				if(identifyType(register) == false) {
					console.log("含有不能识别的单词");
					return ;
				}
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
				i--;	
					
			}
			else if (aSymbol(content[i])) {
				//是一个符号
				type = 0;
				if(identifyType(register) == false) {
					console.log("含有不能识别的单词");
					return ;
				}
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
				i--;
			}
			else {
				console.log("有不能识别的符号"+register[i]);
				break;
			}
		}
		else if (type == 2) {
		//	console.log("进入2状态，判断的是"+content[i]);
			if (content[i].charCodeAt() >= "0".charCodeAt() && content[i].charCodeAt() <="9".charCodeAt()) {
				//是一个数字
				register = register.concat(content[i]);		
			} 
			else {
				//数字常量结束
				type = 0;				
				if(identifyType(register) == false) {
					console.log("含有不能识别的单词");
					return ;
				}
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
				i--;//回退一步，重新读新的字符				
			}
		}
		else if(type == 3){
		//	console.log("进入3状态，判断的是"+content[i]);
			//表示符号
			//能转到这里说明已经读了一个符号开头了，有因为这里一个符号最多分两部分，所以可以搞起了
			if (identifyType(register.concat(content[i]))) {
				//确定加上是一个正确的
			//	console.log("加上一个是正确的");
				type = 0;	
				register = register.concat(content[i]);
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
			}
			else{
				//加上一个不对，但是它本身就是一个，所以直接入
				type = 0;	
				dataContent.push(register);
				dataType.push(identifyType(register));
				register = new String();//清空字符串准备读入下一个单词
				i--;//重新读这个
			}			
		}	
	}
}


function aSymbol(input){
	//input是一个字节的输入，看是不是一个符号
	switch(input.charCodeAt()){
		case "~".charCodeAt():
		case "^".charCodeAt():
		case "?".charCodeAt():
		case ":".charCodeAt():
		case ",".charCodeAt():
		case ";".charCodeAt():
		case "[".charCodeAt():
		case "]".charCodeAt():
		return true;
	}
	return false;
}
function maybeSymbolPart(input){
	//input是一个字节的输入，是不是有可能是符号的一部分
	switch(input.charCodeAt()){
		case "+".charCodeAt():
		case "-".charCodeAt():
		case "*".charCodeAt():
		case "/".charCodeAt():
		case "%".charCodeAt():
		case "<".charCodeAt():
		case ">".charCodeAt():
		case "|".charCodeAt():
		case "&".charCodeAt():
		case "=".charCodeAt():
		return true;
	}
	return false;
}
function identifyType(register){
	//判断他的类型
	//是否是声明符号
	//console.log("长度是"+register.length);
	if (register == "int") {
		return "s";
	}
	
	//是否是常量
	var flag = true;
	for (var i=0;i<register.length;i++) {
		if (register[i].charCodeAt() >= "0".charCodeAt() &&register[i].charCodeAt() <= "9".charCodeAt() ) {
			continue;
		}
		flag=false;
	}
	if (flag) {
		return "r";
	}
	//是否是变量
	flag = true;
	for (var i=0;i<register.length;i++) {
		if ((register[i].charCodeAt() >= "a".charCodeAt() && register[i].charCodeAt() <="z".charCodeAt()) || 
				(register[i].charCodeAt() >= "A".charCodeAt() && register[i].charCodeAt() <="Z".charCodeAt()) ||
				register[i].charCodeAt() == "_".charCodeAt() ||
				(register[i].charCodeAt() >= "0".charCodeAt() && register[i].charCodeAt() <="9".charCodeAt())) {
				//数字、字母、下划线
					continue;	
		}
		flag = false;		
	}
	if (flag) {
		return "q";
	}
	//是否是符号
	if (register.length == 1 && register.charCodeAt() == "+".charCodeAt()) {
		return "e";
	}
	if (register.length == 1 && register.charCodeAt() == "-".charCodeAt()) {
		return "e";
	}
	if (register.length == 1 && register.charCodeAt() == "*".charCodeAt()) {
		return "d";
	}
	if (register.length == 1 && register.charCodeAt() == "/".charCodeAt()) {
		return "d";
	}
	if (register.length == 1 && register.charCodeAt() == "%".charCodeAt()) {
		return "d";
	}
	if (register.length == 2 && register.charCodeAt() == "+".charCodeAt() && register.charCodeAt(1) == "+".charCodeAt()) {
		if(dataType[dataType.length-1] == "q" || dataType[dataType.length-1] == "t")//前边是变量
			return "b";
		return "c";
	}
	if (register.length == 2 && register.charCodeAt() == "-".charCodeAt() && register.charCodeAt(1) == "-".charCodeAt()) {
		if(dataType[dataType.length-1] == "q")//前边是变量
			return "b";
		return "c";
	}
	if (register.length == 1 && register.charCodeAt() == "<".charCodeAt()) {
		return "g";
	}
	if (register.length == 2 && register.charCodeAt() == "<".charCodeAt() && register.charCodeAt(1) == "=".charCodeAt()) {
		return "g";
	}
	if (register.length == 2 && register.charCodeAt() == "=".charCodeAt() && register.charCodeAt(1) == "=".charCodeAt()) {
		return "g";
	}
	if (register.length == 1 && register.charCodeAt() == ">".charCodeAt()) {
		return "g";
	}
	if (register.length == 2 && register.charCodeAt() == ">".charCodeAt() && register.charCodeAt(1) == "=".charCodeAt()) {
		return "g";
	}
	if (register.length == 2 && register.charCodeAt() == "!".charCodeAt() && register.charCodeAt(1) == "=".charCodeAt()) {
		return "g";
	}
	if (register.length == 1 && register.charCodeAt() == "!".charCodeAt()) {
		return "c";
	}
	if (register.length == 2 && register.charCodeAt() == "&".charCodeAt() && register.charCodeAt(1) == "&".charCodeAt()) {
		return "l";
	}
	if (register.length == 2 && register.charCodeAt() == "|".charCodeAt() && register.charCodeAt(1) == "|".charCodeAt()) {
		return "m";
	}
	if (register.length == 2 && register.charCodeAt() == "<".charCodeAt() && register.charCodeAt(1) == "<".charCodeAt()) {
		return "f";
	}
	if (register.length == 2 && register.charCodeAt() == ">".charCodeAt() && register.charCodeAt(1) == ">".charCodeAt()) {
		return "f";
	}
	if (register.length == 1 && register.charCodeAt() == "~".charCodeAt()) {
		return "c";
	}
	if (register.length == 1 && register.charCodeAt() == "|".charCodeAt()) {
		return "k";
	}
	if (register.length == 1 && register.charCodeAt() == "^".charCodeAt()) {
		return "j";
	}
	if (register.length == 1 && register.charCodeAt() == "&".charCodeAt()) {
		return "i";
	}
	if (register.length == 1 && register.charCodeAt() == "=".charCodeAt()) {
		return "o";
	}
	if (register.length == 2 && register.charCodeAt() == "+".charCodeAt()&& register.charCodeAt(1) == "=".charCodeAt()) {
		return "o";
	}
	if (register.length == 2 && register.charCodeAt() == "-".charCodeAt()&& register.charCodeAt(1) == "=".charCodeAt()) {
		return "o";
	}
	if (register.length == 2 && register.charCodeAt() == "*".charCodeAt()&& register.charCodeAt(1) == "=".charCodeAt()) {
		return "o";
	}
	if (register.length == 2 && register.charCodeAt() == "/".charCodeAt()&& register.charCodeAt(1) == "=".charCodeAt()) {
		return "o";
	}
	if (register.length == 1 && register.charCodeAt() == "?".charCodeAt()) {
		return "n";
	}
	if (register.length == 1 && register.charCodeAt() == ":".charCodeAt()) {
		return "u";
	}
	if (register.length == 1 && register.charCodeAt() == ",".charCodeAt()) {
		return "p";
	}
	if (register.length == 1 && register.charCodeAt() == ";".charCodeAt()) {
		return "v";
	}
	if (register.length == 1 && register.charCodeAt() == "[".charCodeAt()) {
		return "a";
	}
	if (register.length == 1 && register.charCodeAt() == "]".charCodeAt()) {
		return "t";
	}
	return false;
	
}
