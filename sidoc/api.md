===

#@Title: Sivona v0.01

##@Link: https://github.com/x6doooo/Sivona.js

@Copyright: Copyright 2013 Dx. Yang

@License: Released under the MIT license

===
===

@Name: Class

@Info: OOP封装

@Type: Class

@Params:

- parent {constructor} 父类（可选）

@Return: {Class}

***

@Name: Class.extend

@Info: 给类增加方法

@Type: Method

@Params:

- {object} 对象内部的属性方法都会追加到类上

***

@Name: Class.include

@Info: 给原型增加方法

@Type: Method

@Params:

- {object} 对象内部的属性都会追加到圆形上，供实例使用

***

@Usage:

//创建父类

Dad = new Class;

Dad.extend({

say: function(){...}  //类方法

});

Dad.include({

init: function(){...} //init方法会在创建实例时自动调用

look: function(){...} //原型方法

});

//创建子类，子类继承父类

Son = new Class(Dad);

Son.inlcude({

look: function(){ //覆盖父类的方法

this._super();  //调用父类的同名方法 和其他语言的super功能相似

...

}

});

tom = new Son;  //创建实例

===
===

@Name: SI

@Info: Sivona.js的命名空间，以及新画布的构造函数

@Type: Namespace & Method

@Params:

- id {string} 画布插入位置

- w {number} 画布宽度（可选 默认为浏览器窗口宽度）

- h {number} 画布高度（可选 默认为浏览器窗口高度）

@Return:

- {instance} Paper对象的实例

@Usage:

var paper = SI('div1', 100, 200);

paper.rect(...);

===
===

@Name: Paper

@Type: Class

@Info: 画布类，实例拥有各种绘图方法 一般通过SI方法new出实例

===
===

@Name: paper.rect(x, y, w, h)

@Info: 绘制矩形的方法

@Params:

- x {Number} 左上角x轴坐标

- y {Number} 左上角y轴坐标

- w {Number} 宽

- h {Number} 高

@Return:

- 实例对象

===
===

@Name: paper.arc(x, y, r, sAngle, eAngle, counterclockwise)

@Info: 绘制弧形的方法

@Params:

- x {Number} 弧心x轴坐标

- y {Number} 弧心y轴坐标

- r {Number} 弧半径

- sAngle {Number} 开始角度

- eAngle {Number} 结束角度

- counterclockwise {Boolen} 顺时针画还是逆时针画

@Return:

- 实例对象

===
===

@Name: paper.circle(x, y, r)

@Info: 绘制圆形的方法

@Params:

- x {Number} 圆心x轴坐标

- y {Number} 圆心y轴坐标

- r {Number} 半径

@Return:

- 实例对象

===
===

@Name: paper.ellipse(x, y, xr, yr)

@Info: 绘制椭圆形的方法

@Params:

- x {Number} 圆心x轴坐标

- y {Number} 圆心y轴坐标

- xr {Number} x轴半径

- yr {Number} y轴半径

@Return:

- 实例对象

===
===

@Name: path

@Info: 路径方法

@Type: Method

@Params:

- {JSON or String} 描述路径的json或者string，如果是string，会由内置的parse转换成json

@return: path实例

@Usage:

pathString = "Mx,yLx,y..."

pathJSON = [

{type:'moveTo', points: [x, y]},

{type:'lineTo', points: [x, y]},

{type:'quadraticCurveTo', points: [x1, y1, x2, y2]},

{type:'bezierCurveTo', points: [x1, y1, x2, y2, x3, y3]}

{type:'closePath'},

{type:'moveTo', points: [x, y]},

...

];

paper.path(pathString);

//or

paper.path(pathJSON);

===
===

@Tip: matrix属性和attr属性必须区分开，避免matrix属性直接污染context

===
