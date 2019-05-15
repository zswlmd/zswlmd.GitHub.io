//先进行资源的预加载以及设备类型的判断

//预加载

var imgArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "bg", "bird0", "bird1", "down_bird0", "down_bird1", "up_bird0", "up_bird1", "down_mod", "down_pipe", "game_over", "head", "message", "ok", "score", "slider", "start", "up_mod", "up_pipe"];
var sourceCount = 0;

$(function() {
	loading();
})

function loading() {
	for(var i = 0; i < imgArr.length; i++) {
		var img = document.createElement("img");
		img.onload = function() {
			sourceCount++;

			$("p").html(sourceCount / imgArr.length * 100 + "%");

			if(sourceCount == imgArr.length) {
				//资源加载完毕
				//				适配屏幕
				setView();
			}
		}
		img.src = "images/" + imgArr[i] + ".png";
	}
}

//屏幕适配
function setView() {
	if(isPc()) {
		//PC
		//给ok按钮添加点击事件
		$("#begin").click(function(e) {
			$("#start").hide();
			beginGame();
			return false;
		})
		//wrap添加点击事件
		$("#wrap").click(clickWrap);
	} else {
		//mobile
		$("#wrap").css({
			width: $(window).width(),
			height: $(window).height()
		})
		$("#begin")[0].ontouchstart = function(e) {
			e.stopPropagation();
			$("#start").hide();
			beginGame();
		}
		$("#wrap")[0].ontouchstart = clickWrap;
	}
}

var timer = null; //用于控制游戏的进展
var speed = 0; //小鸟的初始速度
var isDown = true; //小鸟是否向下飞

//游戏开始
function beginGame() {
	//显示小鸟
	$("#bird").show();
	timer = setInterval(function() {
		//1. 小鸟的移动
		birdMove();
		//2. 管道的移动
		pipeMove();
		//3. 碰撞检测
		checkCrash();
	}, 30);
}

//小鸟的移动
function birdMove() {
	if(isDown) {
		speed += 0.4;
		if(speed >= 8) {
			speed = 8;
		}
	} else {
		speed += 0.7;
		if(speed >= 0) {
			//小鸟飞到最高点时时速为0，并且向下降落
			speed = 0;
			isDown = true;

			$("#bird").css({
				animationName: "birdDown"
			})
		}
	}

	$("#bird").css({
		top: $("#bird").position().top + speed
	})
}

function clickWrap() {
	$("#bird").css({
		animationName: "birdUp"
	})
	isDown = false;
	speed = -8; //给小鸟一个向上的初速度
}

//随机函数：随机让钢管出现的高度
function rand(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}

var pipeNum = 0;
var score = 10; //得分
var isThrough = false; //判断小鸟是否通过了管道，并且保证每个管道只能通过一次

//管道的移动
function pipeMove() {
	pipeNum++;
	if(pipeNum == 120) {
		pipeNum = 0;
		createPipe();
	}
	//获取所有的管道，并且进行移动
	//如果管道移除屏幕那么就删掉
	if($("#pipe li")[0] == null) {
		return;
	}
	//判断小鸟是否飞过了管道，飞过了则+1
	if (!isThrough && ($("#pipe li").eq(0).position().left + $("#pipe li").eq(0).width() < $("#bird").position().left)) {
		score ++;
		isThrough = true;
		$("#score").html("");
		var str = score + "";
		var arr = str.split("");
		for(var i = 0; i < arr.length; i++) {
			$("<img />").css({
				width:"28px",
				height:"39px"
			}).attr({
				src: "images/" + arr[i] + ".png"
			}).appendTo($("#score"))
		}
	}
	if($("#pipe li").eq(0).position().left <= -62) {
		$("#pipe li").eq(0).remove();
		$("#pipe li").eq(0).remove();
		isThrough = false;
	}
	$("#pipe li").css({
		left: "-=2px"
	})

	//创建管道
	function createPipe() {
		var h = rand(0, $("#wrap").height() - 240);
		$("<li class='top'></li>").html("<div></div><div></div>").appendTo($("#pipe")).find("div:eq(0)").height(h);
		$("<li class='bottom'></li>").html("<div></div><div></div>").appendTo($("#pipe")).find("div:eq(1)").height($("#wrap").height() - 240 - h);
	}

}

//碰撞检测
	function isCrash(a, b) {
		var l1 = a.offsetLeft;
		var t1 = a.offsetTop;
		var r1 = a.offsetLeft + a.offsetWidth;
		var b1 = a.offsetTop + a.offsetHeight;
		var l2 = b.offsetLeft;
		var t2 = b.offsetTop;
		var r2 = b.offsetLeft + b.offsetWidth;
		var b2 = b.offsetTop + b.offsetHeight;

		if(r1 < l2 || r2 < l1 || b1 < t2 || b2 < t1) {
			//不碰撞
			return false;
		} else {
			return true;
		}
	}
function checkCrash() {
	//小鸟与天花板或地面是否碰撞
	if($("#bird").position().top < 0 || $("#bird").position().top > $("#wrap").height() - $("#bird").height()) {
		clearInterval(timer);
		return;
	}
	//	2. 小鸟与管道是否碰撞
	if($("#pipe li")[0] == null) {
		return;
	}
	if (isCrash($("#bird")[0],$("li")[0]) || isCrash($("#bird")[0],$("li")[1])) {
		console.log("gameover");
		clearInterval(timer);
	}
}
