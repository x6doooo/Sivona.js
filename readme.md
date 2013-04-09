# Sivona.js
===

Sivona.js是一个HTML5 Canvas 2D绘制类库，主要包括形状绘制、事件处理、动画控制等功能。

使用Sivona.js进行Canvas绘制的方法非常类似DOM操作，所以更符合Web前端工程师的开发习惯。

===

##Getting Start

===

###初始化画布

####方法：SI( id, width, height )
	
@Params:

 - id {String} 画布插入位置

 - width {Number} 画布宽度（可选）

 - height {Number} 画布高度（可选）

@Return: Paper类的实例

@Usage:

	var paper  = SI('div1', 100, 100);
	paper.rect(10, 10, 20, 20);

