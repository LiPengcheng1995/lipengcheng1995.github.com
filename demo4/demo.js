window.onload = function  () {
	// body...
	var obox = document.getElementById('box');
	var distX,distY,degX=0,degY=0;
	obox.onmousedown=function(e){
		var sX = e.clientX;
		var sY = e.clientY;

		document.body.style.cursor = 'move';
		
		document.onmousemove = function(e){
			distX = e.clientX - sX;
			distY = e.clientY - sY;

			sX = e.clientX;
			sY = e.clientY;

			degX += distX*0.3;
			degY -= distY*0.3;

			obox.style.transform = 'rotateY('+degX+'deg) rotateX('+degY+'deg)';

		}
	}
	document.onmouseup = function(e){
		document.onmousemove = null;
	}
}