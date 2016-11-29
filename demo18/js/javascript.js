document.getElementsByClassName("show")[0].onclick = function(){
	document.getElementsByClassName("nav-item")[0].style.display = 'block'
	console.log(document.getElementsByClassName("nav-item")[0].style)
	if(document.getElementsByClassName("nav-item")[0].style.display == ""){
		alert("2")
	}
}
