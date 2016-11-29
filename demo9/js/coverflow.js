//过去当前容器的dom对象
var containerObj = document.querySelector("#container");
//获取所有的卡片
var covers = document.querySelectorAll(".cover");

//得到卡片长度
var coverLength = covers.length;
//中间卡片下标位置
var middleIndex = (coverLength - 1) / 2;
//中间卡牌你的dom对象
var middleCover = covers[middleIndex];
//设置当前的卡片，默认中间的
var currentIndex = middleIndex;
var containerWidth = containerObj.clientWidth;
//3Dy轴最大旋转角度
var maxRotate = 42;
var maxZIndex = middleIndex + 1;
//计算得出每一个卡片的累加旋转角度
var stepper = maxRotate / middleIndex;
//便利所有的卡片

for(var i = 0; i < coverLength; i++) {
	var cover = covers[i];
	//默认所有水平平移0
	cover.style.transform = "translateX(0px) rotateY(" + (maxRotate - stepper * i) + "deg)";
	//设置zIndex
	if(i < currentIndex) {
		cover.style.zIndex = i + 1;

	} else if(i === currentIndex) {
		//当前的卡片显示更加宽
		cover.style.flexGrow = 2;
		cover.style.zIndex = i + 1;
	} else {
		cover.style.zIndex = maxZIndex - i;
	}
}
//监听键盘事件响应


var translateReg = /translateX\((\-?\d+\.?\d*)px\)/;
var rotateReg = /rotateY\((\-?\d+\.?\d*)deg\)/;

var currentTranslate, currentRotate;

//设置随时间轮播部分，此部分为新加
var t = setTimeout(time,2000);
function time(){
	clearTimeout(t);//清除定时器
	dt = new Date(t);
	var distination = (currentIndex + 1)%7;
	moves(distination);
	t = setTimeout(time,2000);
}

function moves(distination){
	var times = currentIndex - distination;
	if(times < 0){
		//中心位置右移
		move("left");
	}
	else{
		//右边到头了，应该迅速回来
		for (var i=0;i<6;i++) {
			move("right");
		}
	}
}
//移动卡片
function move(direction) {
	//判断方向，更新当前卡片下标
	direction == "right"?currentIndex--:currentIndex++;
	//遍历数组
	for(var i = 0; i < coverLength; i++) {
		var cover = covers[i];
		//为了获得卡片改变前的位移偏移值和旋转值
		var prevTransate = parseInt(cover.style.transform.match(translateReg)[1]);
		var prevRotate = parseInt(cover.style.transform.match(rotateReg)[1]);
		//console.log(prevRotate);

		//更具左右分别更改那个旋转量和偏移量
		if(direction === "right") {
			currentTranslate = prevTransate + (containerWidth / (coverLength + 1));
			currentRotate = prevRotate - stepper;
			//console.log(currentTranslate);
		} else {
			currentTranslate = prevTransate - (containerWidth / (coverLength + 1));
			currentRotate = prevRotate + stepper;

		}
		cover.style.transform = "translateX(" + currentTranslate + "px) rotateY(" + currentRotate + "deg)";
		if(i === currentIndex) {
			cover.style.flexGrow = 2;
			cover.style.zIndex = maxZIndex;

		} else {
			cover.style.flexGrow = 1;
			if(i < currentIndex) {
				cover.style.zIndex = i;
			} else {
				cover.style.zIndex = maxZIndex - i;
			}

		}

	}
}
//console.log(middleIndex);
