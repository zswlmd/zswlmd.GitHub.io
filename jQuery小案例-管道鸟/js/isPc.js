//是否是PC端

var mobileArr = ["iOS","iPhone","iPad","iPod6","Android","iPhoneX"];

function isPc() {
	var isPc = true;
	for (var i=0; i<mobileArr.length; i++) {
		if (navigator.userAgent.indexOf(mobileArr[i]) != -1) {
			isPc = false;
			break;
		}
	}
	return isPc;
}