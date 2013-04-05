# Sivona.js
===

Sivona.js是一个HTML5 Canvas 2D绘制类库，包括形状绘制、事件处理、动画控制等功能。Sivona.js将HTML5 Canvas的接口进行了一系列封装，让Canvas绘图变得像操作DOM元素一样简单、便捷，更符合Web前端人员的开发习惯。

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

