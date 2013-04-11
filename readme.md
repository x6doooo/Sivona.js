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

```js
var paper  = SI('div1', 100, 100);
paper.rect(10, 10, 20, 20);
```

---

###SVG转Canvas

由于eps、ai等矢量图形文件可以转成SVG，所以相对而言，SVG可用的图形资源更多。Sivona.js可以对SVG路径进行解析，转换为Canvas绘制。

```js
paepr = SI('div1');

//直接使用描述路径的字符串进行绘制
path = paper.path('M10,10 L100,100 V200 H200')
```

上面的例子直接调用path方法，该方法的参数可以是一个命令数组，也可以是一个SVG风格的描述路径的字符串。当参数是字符串时，内置的解析方法会被触发，将字符串解析成命令数组。

有些时候，为了保证效率，需要将路径字符串提前解析，比如要绘制很多路径的时候：

```js
strArr = [
  'M10,10 L100,100 V200 H200',
  'M10,20 L-100-100 V-200 H-200',
  ...
]

strArr.forEach(function(v, i, a){
  //SI.parsePath就是解析方法，它会将解析结果返回出来，等到需要的时候再进行绘制
  a[i] = SI.parsePath(v);
});

```


