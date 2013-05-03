===

#Sivona v0.0.6

@Link: <https://github.com/x6doooo/Sivona.js>

@Copyright: Copyright 2013 Dx. Yang

@License: Released under the MIT license

===

###SI

@Info: Sivona.js的命名空间，以及新画布的构造函数

@Type: Namespace & Method

@Params:

- id {string} 画布插入位置

- w {number} 画布宽度（可选 默认为浏览器窗口宽度）

- h {number} 画布高度（可选 默认为浏览器窗口高度）

- t {number} 画布位置top值

- l {number} 画布位置left值

@Return:

- {instance} Paper对象的实例

@Usage:

```
  var paper = SI('div1', 100, 200);
  paper.rect(...);
```
===

###Paper

@Type: Class

@Info: 画布类，实例拥有各种绘图方法 一般通过SI方法new出实例

===

###paper.clear([l, t, w, h])

@Info: 清空画布

@Params:

- l {Number} 清空区域的左上角x坐标

- t {Number} 清空区域的左上角y坐标

- w {Number} 清空区域的宽度

- h {Number} 清空区域的高度

- 无参数时清空整个画布

@Usage:

```
 //从（10,10）坐标开始清空100*100的区域
 paper.clear(10, 10, 100, 100)

 //清空整个画布
 paper.clear()
```
===

###paper.group(el, el, el, ...)

@Info: 创建图形组

@Params:

- {Instance} 若干图形实例

@Return:

- group实例对象

===

###paper.text(t, x, y, w)

@Info: 绘制文字的方法

@Params:

- t {String} 文字内容

- x {Number} x轴坐标

- y {Number} y轴坐标

- w {Number} 文字宽度（可选）

@Return:

- 文字实例对象

===

###paper.rect(x, y, w, h)

@Info: 绘制矩形的方法

@Params:

- x {Number} 左上角x轴坐标

- y {Number} 左上角y轴坐标

- w {Number} 宽

- h {Number} 高

@Return:

- 矩形实例对象

===

###paper.arc(x, y, r, sAngle, eAngle, counterclockwise)

@Info: 绘制弧形的方法

@Params:

- x {Number} 弧心x轴坐标

- y {Number} 弧心y轴坐标

- r {Number} 弧半径

- sAngle {Number} 开始角度

- eAngle {Number} 结束角度

- counterclockwise {Boolen} 顺时针画还是逆时针画

@Return:

- 弧形实例对象

===

###paper.circle(x, y, r)

@Info: 绘制圆形的方法

@Params:

- x {Number} 圆心x轴坐标

- y {Number} 圆心y轴坐标

- r {Number} 半径

@Return:

- 圆形实例对象

===

###paper.ellipse(x, y, xr, yr)

@Info: 绘制椭圆形的方法

@Params:

- x {Number} 圆心x轴坐标

- y {Number} 圆心y轴坐标

- xr {Number} x轴半径

- yr {Number} y轴半径

@Return:

- 椭圆实例对象

===

###paper.path(...)

@Info: 路径方法

@Type: Method

@Params:

- {JSON or String} 描述路径的json或者string，如果是string，会由内置的parse转换成json

@return: path实例

@Usage:

```
 
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

```
===

###paper.clone(el)

@Info: 复制一个图形

@Type: Method

@Params:

- el {Instance} 图形实例

@Return: 图形实例

===

###Matrix.p2p(point, matrix)

@Info: Matrix的类方法，计算一个点经过一个矩阵变换后的坐标

@Params:

-point {Array} [x, y] 点坐标

-m {Array} [a,b,c,d,e,f]

@Usage:

```
  p = [10, 10];
  matrix = [1, 0, 0 , 1, 10, 10]
  Matrix.p2p(p, matrix) // => [20, 20]
```
===

###el.translate(x, y)

@Info: 平移

===

###el.data(key[, value])

@Type: Method

@Info: 图形对象绑定、读取数据的方法

@Usage:

```
 rect = paper.rect(10, 10, 100, 80);
 //绑定
 rect.data('key', 'value');
 //读取
 rect.data('key');
```
===

###el.attr(...)

@Type: Method

@Info: 给图形设置样式或读取样式的方法

@Usage:

```
 //给图形对象设置填充色
 el.attr('fillStyle', '#333');
 //设置多个样式字段，可以使用一个hash参数
 el.attr({'fillStyle':'red', 'lineWidth': 10});
 //读取一个样式字段的值
 el.attr('strokeStyle');
```
===

###el.show()

@Info: 显示图形

===

###el.hide()

@Info: 隐藏图形

===

###el.animate(options[, time, callback])

@Info: 给图形设置动画

@Params:

- options {Object} 动画内容

- time {Number} 可选 毫秒数 动画过程时间

- callback {Function} 可选 回调函数

@Usage:

```
  el.animate({
    "fillStyle": "#f00",
    "lineWidth": "#333"
  }, 500, function(){
    alert("done!");  
  });
```
===

###el.remove()

@Type: Method

@Info: 删除图形

===

###SI.parsePath(d)

@Info: 解析SVG路径描述，转为Canvas绘制用的命令和点的数组

@Params:

- d {string} svg路径字符串

@Return:

- {array}

@Usage:

```
 arr = SI.parsePath('M10,10L10,10C-10-10...');
 //arr => [{type:'moveTo',points:[10,10]}, {type:'lineTo',points:[10,10]}...]
```
