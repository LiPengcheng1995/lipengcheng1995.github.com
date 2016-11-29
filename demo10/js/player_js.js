var music = document.getElementById('player');
var playWhat = 0;
//music.play();
//申请及初始化音量调节的操作
var musicSound = 1;
var ifChangingSound = false;
var soundProgressAll = document.getElementById("soundProgressAll");
var soundProgressAllData = soundProgressAll.getClientRects()[0];

//申请及初始化音乐进度调节的操作
var musicProgress = 0;
var ifChangingMusic = false;
var musicProgressAll = document.getElementById("musicProgressAll");
var musicProgressAllData = musicProgressAll.getClientRects()[0];

//设置音量调整
soundProgressAll.onmousedown = function(event) {
	//console.log(soundProgressAllLeft);
	document.getElementById("soundProgressNow").style.width = (event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left) * 100 + "%";
	console.log((event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left))
	musicSound = (event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left);
	music.volume = musicSound;
	ifChangingSound = true;
}

soundProgressAll.onmouseup = function() {
	if(ifChangingSound == true) {
		ifChangingSound = false;
	}

}

document.getElementById("soundProgress").onmousemove = function(event) {
	if(ifChangingSound) {
		//console.log(soundProgressAllLeft);
		document.getElementById("soundProgressNow").style.width = (event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left) * 100 + "%";
		//console.log((event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left) + "%")
		musicSound = (event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left);
		music.volume = musicSound;
		ifChangingSound = true;
	}
}

document.getElementById("soundProgress").onmouseup = function() {
	if(ifChangingSound == true) {
		ifChangingSound = false;
	}
}

//设置音乐进度调整

musicProgressAll.onmousedown = function(event) {
	//console.log(soundProgressAllLeft);
	document.getElementById("musicProgressNow").style.width = (event.clientX - musicProgressAllData.left) / (musicProgressAllData.right - musicProgressAllData.left) * 100 + "%";
	//console.log(document.getElementById("musicProgressNow").style.width )
	//	console.log((event.clientX - musicProgressAllData.left) / (musicProgressAllData.right - musicProgressAllData.left) * 100 + "%");
	musicProgress = (event.clientX - musicProgressAllData.left) / (musicProgressAllData.right - musicProgressAllData.left);
	ifChangingMusic = true;
}

musicProgressAll.onmouseup = function() {
	if(ifChangingMusic == true) {
		ifChangingMusic = false;
		music.currentTime = parseInt(music.duration * musicProgress);
	}

}

document.getElementById("progress").onmousemove = function(event) {
	if(ifChangingMusic) {
		//console.log(soundProgressAllLeft);
		document.getElementById("musicProgressNow").style.width = (event.clientX - musicProgressAllData.left) / (musicProgressAllData.right - musicProgressAllData.left) * 100 + "%";
		//console.log((event.clientX - soundProgressAllData.left) / (soundProgressAllData.right - soundProgressAllData.left) + "%")
		musicProgress = (event.clientX - musicProgressAllData.left) / (musicProgressAllData.right - musicProgressAllData.left);
		ifChangingMusic = true;
	}
}

document.getElementById("progress").onmouseup = function() {
	if(ifChangingMusic == true) {
		ifChangingMusic = false;
		music.currentTime = parseInt(music.duration * musicProgress);
	}

}

//基本的ui界面完成了，接下来进行音乐播放的事件的绑定
//设置music的时间监听
//music.currentTime = '20s';
//music.play();

//设置时间的转换函数，直接写入timeNow和timeAll
var arrayOfPassedWord;
var Index = 0;

function writeIntoTimeText(id, seconds) {
	var min, sec;
	if((seconds / 60) < 10) {
		min = "0" + parseInt(seconds / 60);
	} else {
		min = seconds / 60;
	}

	if((seconds % 60) < 10) {
		sec = "0" + (seconds % 60);
	} else {
		sec = seconds % 60;
	}
	//	console.log("min= "+min+" sec= "+sec);
	document.getElementById(id).innerHTML = min + ":" + sec;
	//接下来进行歌词的滚动
	if(id == "timeNowText") {
		var name = "time" + seconds;
		if(document.getElementById(name) != null) {
			//	console.log(seconds);		
			//	console.log(name);
			for(var i = 0; i < arrayOfPassedWord.length; i++) {
				document.getElementById(arrayOfPassedWord[i]).style.color = "gray";
				if(arrayOfPassedWord[i] == name) {
					Index = i;
				}
			}
			for(var i = 0; i < Index - 5; i++) {
				document.getElementById(arrayOfPassedWord[i]).style.display = "none";
			}
			for(var i = Index - 5; i < arrayOfPassedWord.length; i++) {
				if(i >= 0) {
					document.getElementById(arrayOfPassedWord[i]).style.display = "block";
				}
			}
			document.getElementById(name).style.color = "blue";
			//	console.log(name);
			//	console.log(name + "   " + Index + "   " + arrayOfPassedWord[Index]);

		}
		document.getElementById("cover").style.webkitTransform = "rotate(" + (seconds * 3) + "deg)";
		//	console.log(seconds);
		//	console.log("rotate("+(seconds*10)+"deg)");
	}
}

//var last = 0;
music.addEventListener("timeupdate", function() {
	var currentTime = parseInt(this.currentTime);
	//console.log(this.currentTime - last);
	//last = this.currentTime;
	writeIntoTimeText("timeNowText", currentTime);
	if(music.readyState == 4) {
		writeIntoTimeText("timeAllText", parseInt(music.duration));
		musicProgress = currentTime / music.duration;
		document.getElementById("musicProgressNow").style.width = musicProgress * 100 + "%";
	}

})

document.getElementById("pouse").onclick = function() {
	if(music.paused) {
		music.play();
		document.getElementById("pouse").style.backgroundPositionX = '-98px';
	} else {
		music.pause();
		document.getElementById("pouse").style.backgroundPositionX = '-3px';
	}
}

document.getElementById("soundIcon").onclick = function() {
	if(music.muted) {
		//现在是静音状态
		music.muted = false;
		document.getElementById("soundIcon").style.backgroundPositionX = '-70px';

	} else {
		//现在不是静音状态
		music.muted = true;
		document.getElementById("soundIcon").style.backgroundPositionX = '-105.5px';

	}
}

//接下来进行歌词的加载及同步滚动
//由于本地文件的访问有很大的限制，所以用一个大大大大大大大变量来存放吧

loadAll();

function loadAll() {
	switch(playWhat) {
		case 0:
			music.pause();
			music.src = "music/徐良 - 那时雨.mp3";
			document.getElementById("cover").style.backgroundImage = "URL('music/徐良 - 那时雨.jpg')";
			music.play();
			document.getElementById("pouse").style.backgroundPositionX = '-98px';
			break;
		case 1:
			music.pause();
			music.src = "music/Adele - Rolling In The Deep.mp3";
			document.getElementById("cover").style.backgroundImage = "URL('music/Adele - Rolling In The Deep.jpg')";
			music.play();
			document.getElementById("pouse").style.backgroundPositionX = '-98px';
			break;
		case 2:
			music.pause();
			music.src = "music/DJ OKAWARI - Flower Dance.mp3";
			document.getElementById("cover").style.backgroundImage = "URL('music/DJ OKAWARI - Flower Dance.jpg')";
			music.play();
			document.getElementById("pouse").style.backgroundPositionX = '-98px';
			break;
		case 3:
			music.pause();
			music.src = "music/Eminem,Rihanna - Love the Way You Lie [Clean].mp3";
			document.getElementById("cover").style.backgroundImage = "URL('music/Eminem,Rihanna - Love the Way You Lie [Clean].jpg')";
			music.play();
			document.getElementById("pouse").style.backgroundPositionX = '-98px';
			break;
		case 4:
			music.pause();
			music.src = "music/Groove Coverage - She.mp3";
			document.getElementById("cover").style.backgroundImage = "URL('music/Groove Coverage - She.jpg')";
			music.play();
			document.getElementById("pouse").style.backgroundPositionX = '-98px';
			break;
		default:
			break;
	}
	if (words[playWhat] == "本歌曲尚无歌词") {
		document.getElementById("right").innerHTML = "<p>本歌曲尚无歌词</p>";
		return;
	}
	document.getElementById("right").innerHTML = null;
	arrayOfPassedWord = new Array();
	var word = words[playWhat].split('[');
	var line;
	
	for(var i = 1; i < word.length; i++) {
		//	console.log(word[i]);
		line = word[i].split(']');
		//	console.log(line.length);
		var lineTime = line[0].split(':');
		var p = document.createElement("p");
		p.id = "time" + (parseInt(lineTime[0] * 60 + parseInt(lineTime[1])));
		p.innerHTML = line[1];
		if(i == 1) {
			document.getElementById("playedName").innerHTML = line[1];
		} else if(i == 2) {
			document.getElementById("playedPlayerName").innerHTML = line[1];
		}
		document.getElementById("right").appendChild(p);
		arrayOfPassedWord.push("time" + (parseInt(lineTime[0] * 60 + parseInt(lineTime[1]))));
	}
		
	

}

document.getElementById("lastOne").onclick = function() {
	playWhat = (playWhat - 1 + 5) % 5;
	loadAll();
}
document.getElementById("nextOne").onclick = function() {
	playWhat = (playWhat + 1 + 5) % 5;
	loadAll();
}
var aa = document.getElementsByClassName("item");
console.log(aa[0])
aa[0].onclick = function(){
	playWhat = 0;
	loadAll();
}
aa[1].onclick = function(){
	playWhat = 1;
	loadAll();
}
aa[2].onclick = function(){
	playWhat = 2;
	loadAll();
}
aa[3].onclick = function(){
	playWhat = 3;
	loadAll();
}
aa[4].onclick = function(){
	playWhat = 4;
	loadAll();
}
