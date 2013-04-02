/*!

  @Tile: Sivona v0.01
  @Link: https://github.com/x6doooo/Sivona.js
  @Copyright: Copyright 2013 Dx. Yang
  @License: Released under the MIT license

*/
(function(window, undefined){
//type
var toString = {}.toString;
function isUndefined(v){return typeof v == 'undefined';}
function isDefined(v){return typeof v !== 'undefined';}
function isString(v){return typeof v == 'string';}
function isNumber(v){return typeof v == 'number';}
function isDate(v){return typeof v === 'true';}
function isObject(v){return v !== null && toString.call(v) == '[object Object]';}
function isArray(v){return toString.call(v) == '[object Array]';}
function isFunction(v){return typeof v == 'function';}
function isBoolean(v){return v === true || v === false || toString.call(v) == '[object Boolean]';}
function isEmptyObject(v){
  var n;
  for(n in v){
    return false;
  }
  return true;
}
function to_i(v){return parseInt(v, 10);}
function to_f(v){return parseFloat(v);}
function to_s(v){return v + ''};
function to_a(obj){return [].slice.call(obj, 0);}
function toFixed(nu, pos){
  return to_f(nu.toFixed(pos));
}

//Object forEach
function forEach(obj, iterator, context) {
  var key;
  if (isFunction(obj)){
    for (key in obj) {
      if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
        iterator.call(context, obj[key], key);
      }
    }
  } else if (obj.forEach && obj.forEach !== forEach) {
    obj.forEach(iterator, context);
  } else if (isObject(obj) && isNumber(obj.length)) {
    for (key = 0; key < obj.length; key++)
      iterator.call(context, obj[key], key);
  } else {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator.call(context, obj[key], key);
      }
    }
  }
  return obj;
}

//extend
function extend(){
  var args = to_a(arguments),
    deep = false,
    target = args[0],
    len = args.length,
    i = 1,
    src, copy, ops, clone, name;
  if(isBoolean(args[0])){
    deep = true;
    target = args[1];
    i = 2;
  }
  for( ;i < len; i++ ){
    ops = args[i];
    for (name in ops) {
      src = target[name];
      copy = ops[name];
      if (target === ops[name]) continue;
      if (deep && copy && src && typeof copy == 'Object'){
        if(isArray(copy)){
          clone = isArray(src) ? src : [];
        }else{
          clone = isEmptyObject(src) ? {} : src;
        }
        console.log(copy);
        target[name] = extend(deep, clone, copy);
      }else{
        target[name] = ops[name];
      }
    }
  }
  return target;
}

/*!
  Class
  @Info: OOP封装
  @Type: Class

  @Params:
  - parent {contructor} 父类（可选）

  @Return: {Class}

  ***

  Class.extend
  @Info: 给类增加方法
  @Type: Method
  @Params:
  - {object} 对象内部的属性方法都会追加到类上

  ***

  Class.include
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
        this.supr();  //调用父类的同名方法 和其他语言的super功能相似
        ...
      }
    });
    tom = new Son;  //创建实例

*/
var Class = function(parent){
  var _class = function(){
      this.init.apply(this,arguments);
    },
    key,
    subclass;
  _class.prototype.init = function(){};
  if(parent){
    subclass = function(){};
    subclass.prototype = parent.prototype;
    _class.uber = parent.prototype;
    _class.prototype = new subclass;
  }
  _class.extend = function(obj){
    for(key in obj){
      _class[key] = obj[key];
    }
  };
  _class.include = function(obj){
    for(key in obj){
      _class.prototype[key] = obj[key];
      if(_class.uber && isFunction(_class.uber[key])){
        obj[key].spfunc = _class.uber[key];
      }
    }
  };
  _class.prototype.get = function(k){
    return this[k];
  };
  _class.prototype.set = function(k, v){
    this[k] = v;
    return this;
  };
  _class.prototype.supr = function(){
    arguments.callee.caller.spfunc.apply(this, arguments);
  };
  return _class;
};


var PI = Math.PI,
  abs = Math.abs,
  random = Math.random,
  mmax = Math.max,
  mmin = Math.min,
  defaultCfg = {
    fillStyle: '#ccc',
    strokeStyle: '#000',
    lineWidth: 1,
    shadowColor: '#fff',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 0,
    font: '12px',
    textBaseline: 'middle',
    textAlign: 'center',
    globalAlpha: 1
  },
  sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan;

function deg2rad(d){
  return d * PI / 180;
}

function rad2deg(r){
  return r * 180 / PI;
}

// hex2num('#369') => [51, 102, 153]
function hex2num(v){
  var arr = v.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }).split(',');
  arr.forEach(function(v, i, a){
    a[i] = to_i(v);
  });
  return arr;
}

// rgb2hex(51,102,153); => '#369'
function rgb2hex(r, g, b) {
  return '#' + fix(r) + fix(g) + fix(b);
  function fix(v) {
    if(v <= 16){
      v = '0' + (~~v).toString(16);
    }else{
      v = (~~v).toString(16);
    }
    return v;
  }
}


var Version = 0.01,
  /*!
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
  */
  SI = function(id, w, h){
    return new SI.Paper(id, w, h);
  };

var EvArray,
  domEvents = ['click', 'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup', 'drag'];

EvArray = new Class;
EvArray.include({
  init: function(paper, event){
    this.els = [];
    this.paper = paper;
    this.node = paper.canvasNode;
    this.event = event;
  },
  push: function(el){
    var self = this,
      els = self.els;
    els.push(el);
  },
  delete: function(el, func){
    this.els.forEach(function(v, i, a){
      if(v.target == el && v.handle == func){
        a.splice(i, 1);
      }
    });
  },
  forEach: function(func){
    return this.els.forEach(func);
  },
  handle: function(whichs, e){
    var self = this,
      els = self.els,
      el = whichs[whichs.length-1];
    els.forEach(function(v, i, a){
      if(v.target == el){
        if(v.type == 'drag'){
          nowPos = getEventPosition(e);
          oldPos = el.oldPos;
          el.translate(nowPos.x - oldPos.x, nowPos.y - oldPos.y);
          el.oldPos = nowPos;
        }
        v.handle.call(v.target, e);
      }
    });
  }
});

function getEventPosition(ev){
  var x, y;
  if (ev.layerX || ev.layerX == 0) {
    x = ev.layerX;
    y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    x = ev.offsetX;
    y = ev.offsetY;
  }
  return {x: x, y: y};
}

/*
 matrix、attributes
 TODO:？？？ path  转换path描述？？？
 Todo: 多个canvas同时执行动画 test
 Todo: 中断动画 test

    animator = new Animator();

    matrix属性: scale, rotate, translate, transform

    attr属性:

    //group
    el.animate(object, number, function);

    el.animate({
      scale: [x, y],
      rotate: [a, x, y],
      opacity: value
    }, step, function(){});

    //callback
    el.animate({}, function(){});

 */
var Animator = new Class;
Animator.include({
  init: function(){
    this.amtArr = [];
    this.step = 10;
    this.timer = null;
  },
  add: function(el, arr){

    //arr = [am, hl, cb]
    var self = this,
      amtArr = self.amtArr,
      oldStatus = amtArr.length,
      st = self.step,
      cfg = el.cfg,
      am = arr[0],
      hl = to_i((arr[1]||500)/st),
      cb = arr[2];

    forEach(am, function(v, k){
      switch(k){
        case 'translate':
          am[k] = {
            st: [v[0]/hl, v[1]/hl],
            src: [0, 0],
            tar: v
          };
          break;
        case 'rotate':
          v[1]= v[1] || 0;
          v[2] = v[2] || 0;
          am[k] = {
            st: [v[0]/hl, 0, 0],
            src: [0, v[1], v[2]],
            tar: v
          };
          break;
        case 'scale':
          v[1] = v[1] || v[0];
          v[2] = v[2] || 0;
          v[3] = v[3] || 0;
          am[k] = {
            st: [ (v[0]-1)/hl, (v[1]-1)/hl, 0, 0 ],
            src: [1, 1, v[2], v[3]],
            tar: v
          };
          break;
        default:
          if(v.indexOf('#') != -1){
            //Todo：如果元素本身没有设置颜色，颜色是从上一级context继承的，那么这里不会获取到颜色
            cfg[k] = hex2num(cfg[k] || '#fff');
            v = hex2num(v);
            am[k] = {
              src: cfg[k],
              st: [(v[0] - cfg[k][0])/hl, (v[1]-cfg[k][1])/hl, (v[2]-cfg[k][2])/hl],
              tar: v
            };
            console.log(am[k]);
          }else{
            cfg[k] = cfg[k] || 0;
            am[k] = {
              src: cfg[k],
              st: (v-cfg[k])/hl,
              tar: v
            };
          }
          break;
      }
    });
    amtArr.push([el, am, hl, cb]);

    if(oldStatus == 0){ //不为0则有action在执行
      self.action();
    }
  },
  abort: function(){
    var self = this;
    clearTimeout(self.timer);
    self.amtArr = [];
  },
  action: function(){
    var self = this,
      amtArr = self.amtArr,
      el,
      am,
      hl,
      cb,
      src,
      st,
      tar,
      tem;

    amtArr.forEach(function(v, i, a){
      el = v[0];
      am = v[1];
      hl = v[2];
      cb = v[3];
      hl -= 1;
      v[2] = hl;
      el.matrix = [1, 0, 0, 1, 0, 0];
      forEach(am, function(val, k){
        src = val.src;
        st = val.st;
        tar = val.tar;
        if(k.search(/scale|rotate|translate|transform/) != -1){
          if(hl == 0){
            el[k].apply(el, tar);
          }else{
            el[k].apply(el, src);
          }
          src.forEach(function(o, n, aa){
            aa[n] += st[n];
          });
        }else if(k.search(/fillStyle|strokeStyle|shadowColor/) != -1){
          tem = {};
          tem[k] = rgb2hex.apply(this, src);
          el.attr(tem);
          src.forEach(function(o, n, aa){
            aa[n] += st[n]
          });
        }else{
          tem = {};
          tem[k] = src;
          el.attr(tem);
          val.src += st;
        }
      });
      if(hl == 0){
        cb();
        amtArr.splice(i, 1);
      }
    });
    self.timer = setTimeout(function(){
      self.checkStatus();
    }, self.step);
  },
  checkStatus: function(){
    var self = this;
    if(self.amtArr.length !== 0){
      self.action();
    }
  }
});

//主动画控制器
var Sanimator = new Animator();/*!
    @Name: Paper
    @Type: Class
    @Info: 画布类，实例拥有各种绘图方法 一般通过SI方法new出实例
 */
var Paper,
  Matrix,
  Celement,
  Crect,
  Carc,
  Cellipse,
  Cpath,
//TODO: T\S\H\V命令
  order2func = {
    'M': 'moveTo',
    'L': 'lineTo',
    'Q': 'quadraticCurveTo',
    'C': 'bezierCurveTo',
    'Z': 'closePath'
  },
  regodr = /[MLQCZ]/g;

Paper = new Class;
Paper.include({
  init: function(container_id, w, h){
    var self = this,
      ct,
      cn;
    if(isUndefined(container_id) || !isString(container_id)){
      throw new Error('container is not defined!');
    }
    if(isUndefined(w)){
      w = window.screen.width;
    }
    if(isUndefined(h)){
      h = window.screen.height;
    }
    ct = document.getElementById(container_id);
    if(ct === null){
      throw new Error('container is not defined!');
    }
    cn = document.createElement('canvas');
    cn.style.position = 'absolute';
    self.width = cn.width = w;
    self.height = cn.height = h;
    cn.id = container_id + '_canvas';
    ct.appendChild(cn);
    self.container = ct;
    self.canvasNode = cn;
    self.canvasContext = cn.getContext('2d');
    self.allElements = [];
    self.initEveHandler();
    self.reset();
  },
  /*
      初始化事件处理对象
      TODO: mousedown mouseup dbclick drag
      Todo: 事件冒泡
   */
  initEveHandler: function(){
    var self = this,
      node = self.canvasNode,
      events = domEvents;
    self.eves = {};
    self.hasIn = [];
    self.isDrag = false;
    events.forEach(function(event){
      self.eves[event] = new EvArray(self, event);
      node.addEventListener(event, function(e){
        var type = e.type,
          p, who, tem,
          pos_now, pos_old,
          tem_over = [],
          tem_out = [],
          tem_move = [];
        if(type == 'mouseover' || type == 'mouseout') return;
        p = getEventPosition(e);
        who = self.whoHasThisPoint(p);
        if(type.search(/click|mousedown|mouseup|dbclick/) != -1){
          if(who.length == 0) return;
          if(type == 'mousedown'){
            self.isDrag = who[who.length - 1];
            self.isDrag.oldPos = getEventPosition(e);
            //self.dragPos = getEventPosition(e)
          }
          if(type == 'mouseup') self.isDrag = false;
          self.eves[type].handle(who, e);
        }else if(type == 'mousemove' && self.isDrag){
          //drag
          self.eves['drag'].handle([self.isDrag], e);
        }else if(type == 'mousemove'){
          if(who.length != 0 && self.hasIn.length == 0){
            //over
            who.forEach(function(v){
              v.setIncome(true);
            });
            self.eves['mouseover'].handle(who, e);
          }else if(who.length != 0){
            //over move out
            tem = [];
            who.forEach(function(v){
              if(v.income){
                //move
                tem_move.push(v);
              }else{
                //over
                v.income = true;
                tem_over.push(v);
              }
            });
            self.hasIn.forEach(function(v){
              if(who.indexOf(v) < 0 ){
                v.income = false;
                tem_out.push(v);
              }
            });
            if(tem_over.length >= 0) self.eves['mouseover'].handle(tem_over, e);
            if(tem_move.length >= 0) self.eves['mousemove'].handle(tem_move, e);
            if(tem_out.length >= 0) self.eves['mouseout'].handle(tem_out, e);
            self.hasIn = who;
          }else if(self.hasIn.length != 0){
            //out
            self.hasIn.forEach(function(v){
              v.income = false;
            });
            who = self.hasIn;
            self.eves['mouseout'].handle(who, e);
            self.hasIn = [];
          }
        }
      }, false);
    });
  },
  /*!Private
      @Name: paper.reset
      @Info: 重置context环境的属性值，恢复到默认值
   */
  reset: function(){
    var self = this,
      context = self.canvasContext;
    forEach(defaultCfg, function(v, k){
      context[k] = v;
    });
  },
  /*!Private
      @Name: paper.clear
      @Info: 清空画布
   */
  clear: function(l, t, w, h){
    var self = this,
      ctxt = self.canvasContext;
    if(arguments.length == 0){
      l = 0;
      t = 0;
      w = self.width;
      h = self.height;
    }
    ctxt.clearRect(l, t, w, h);
  },
  /*!Private
      创建图形时初始化一些属性
   */
  initShape: function(el){
    var self = this,
      els = self.allElements,
      eves = self.eves;
    el.paper = self;
    el.context = self.canvasContext;
    el.zIndex = els.length;
    /*
        绑定事件
        TODO:解除绑定的方法（要在EvArray的实例里删除该元素注册的事件， 只删除一个方法，不多删！）
     */
    domEvents.forEach(function(event){
      el[event] = function(func){
        eves[event].push({
          target: el,
          type: event,
          handle: func
        });
      };
      el['un'+event] = function(func){
        eves[event].delete(el, func);
      };
    });
    els.push(el);
    self.refresh();
    return el;
  },
  /*!
      @Name: paper.rect(x, y, w, h)
      @Info: 绘制矩形的方法
      @Params:
      - x {Number} 左上角x轴坐标
      - y {Number} 左上角y轴坐标
      - w {Number} 宽
      - h {Number} 高
      @Return:
      - 实例对象
   */
  rect: function(x, y, w, h){
    var self = this,
      el = new Crect({
        x: x,
        y: y,
        width: w,
        height: h
      });
    return self.initShape(el);
  },
  /*!
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
   */
  arc: function(x, y, r, sAngle, eAngle, counterclockwise){
    var self = this,
      el = new Carc({
        x: x,
        y: y,
        r: r,
        sAngle: sAngle * PI,
        eAngle: eAngle * PI,
        counterclockwise: counterclockwise
      });
    return self.initShape(el);
  },
  /*!
   @Name: paper.circle(x, y, r)
   @Info: 绘制圆形的方法
   @Params:
   - x {Number} 圆心x轴坐标
   - y {Number} 圆心y轴坐标
   - r {Number} 半径
   @Return:
   - 实例对象
   */
  circle: function(x, y, r){
    var self = this,
      el = new Carc({
        x: x,
        y: y,
        r: r,
        sAngle: 0,
        eAngle: 2 * PI,
        counterclockwise: false
      });
    return self.initShape(el);
  },
  /*!
   @Name: paper.ellipse(x, y, xr, yr)
   @Info: 绘制椭圆形的方法
   @Params:
   - x {Number} 圆心x轴坐标
   - y {Number} 圆心y轴坐标
   - xr {Number} x轴半径
   - yr {Number} y轴半径
   @Return:
   - 实例对象
   */
  ellipse: function(x, y, xr, yr){
    var self = this,
      el = new Cellipse({
        x: x, y: y, xr: xr, yr: yr
      });
    return self.initShape(el);
  },
  /*!
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

   */
  path: function(json){
    var self = this,
      el = new Cpath({});
    if(isString(json)){
      json = Cpath.parse(json);
    }
    el.pathJSON = json;
    return self.initShape(el);
  },
  /*Private

      清空画布 重绘一帧
      whoHasThisPoint方法也通过render实现
      重绘帧的过程中，对每个path使用isPointInPath方法
      检查是否有该点

   */
  render: function(check){
    var self = this,
      allElements = self.allElements,
      ctx = self.canvasContext,
      which = [];
    self.clear();
    allElements.sort(function(a, b){
      return a.zIndex - b.zIndex;
    });
    allElements.forEach(function(el, idx, all){
      if(el.display == false) return;
      el.render();
      if(check && ctx.isPointInPath(check.x, check.y)){
        which.push(el);
      }
    });
    return which;
  },
  refresh: function(){
    this.clear();
    this.render();
  },
  /*!Private

      @Name: whoHasThisPoint
      @Info: 检查一个点在哪些形状的范围内 通过调用render方法实现
      @Type: Method
      @Params:
      - p {Object} 坐标p.x p.y
      @Return:
      - {Array} 包含该点的形状对象的数组

   */
  whoHasThisPoint: function(p){
    return this.render(p);
  }
});

/*!Private

    @Name: Matrix
    @Info: 矩阵变换类，是Celement的父类。
    @Type: Class
    @Params: 无

 */

Matrix = new Class;
Matrix.extend({
  p2p: function(p, m){
    var x = p[0],
      y = p[1];
    return [
      x * m[0] + y * m[2] + m[4],
      x * m[1] + y * m[3] + m[5]
    ];
  }
});
Matrix.include({
  init: function(){
    this.matrix = [1, 0, 0, 1, 0, 0];
  },
  update: function(a, b, c, d, e, f){
    var self = this,
      m = self.matrix,
      ft = [
        [m[0], m[2], m[4]],
        [m[1], m[3], m[5]],
        [0, 0 ,1]
      ],
      bk = [
        [a, c, e],
        [b, d, f],
        [0, 0, 1]
      ],
      rs = [[], [], []],
      tm, x, y, z;
    for(x = 0; x < 3; x++){
      for(y = 0; y < 3; y++){
        tm = 0;
        for(z = 0; z < 3; z++){
          tm += ft[x][z] * bk[z][y];
        }
        rs[x][y] = tm;
      }
    }
    self.matrix = [
      rs[0][0],
      rs[1][0],
      rs[0][1],
      rs[1][1],
      rs[0][2],
      rs[1][2]
    ];
  },
  resetContextMatrix: function(){
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  },
  translate: function(x, y){
    this.update(1, 0, 0, 1, x, y);
    this.paper.refresh();
  },
  transform: function(a, b, c, d, e, f){
    this.update(a, b, c, d, e, f);
    this.paper.refresh();
  },
  scale: function(sx, sy, x, y){
    sy = sy || sx;
    (x || y) && this.update(1, 0, 0, 1, x, y);
    this.update(sx, 0, 0, sy, 0, 0);
    (x || y) && this.update(1, 0, 0, 1, -x, -y);
    this.paper.refresh();
  },
  rotate: function(a, x, y){
    a = deg2rad(a);
    x = x || 0;
    y = y || 0;
    var sina = toFixed(sin(a), 9),
      cosa = toFixed(cos(a), 9);
    this.update(cosa, sina, -sina, cosa, x, y);
    (x || y) && this.update(1, 0, 0, 1, -x, -y);
    this.paper.refresh();
  }
});

/*!
    TODO: 同类元素的集合，通过集合改变属性、增删事件
    @Tip: matrix属性和attr属性必须区分开，避免matrix属性直接污染context
 */
Celement = new Class(Matrix);
Celement.include({
  init: function(){
    var self = this;
    self.supr();
    forEach(arguments[0], function(v, k){
      self[k] = v;
    })
    self.display = true;
    self.income = false;
    self.closeit = true;
    self.cfg = extend(true, {}, defaultCfg);
    self.data = {};
  },
  setIncome: function(b){
    var self = this,
      hasIn = self.paper.hasIn,
      idx;
    if(b === true){
      hasIn.push(self);
    }else{
      idx = hasIn.indexOf(self);
      hasIn.splice(idx, 1);
    }
    self.income = b;
  },
  data: function(k, v){
    var self = this;
    if(isDefined(v)){
      self.data[k] = v;
      return self;
    }
    return self.data[k];
  },
  attr: function(cfg){
    var self = this;
    extend(true, self.cfg, cfg);
    self.paper.refresh();
    return self;
  },
  show: function(){
    this.display = true;
    this.paper.refresh();
  },
  hide: function(){
    var self = this,
      paper = self.paper,
      hasIn = paper.hasIn,
      idx;
    self.display = false;
    idx = hasIn.indexOf(this);
    if(idx >= 0){
      hasIn.splice(idx, 1);
    }
    paper.refresh();
  },
  close: function(){
    this.closeit = true;
    return this;
  },
  render: function(){
    var self = this,
      cfg = self.cfg,
      ctx = self.context,
      mtx = self.matrix;
    if(self.display === false) return;
    forEach(cfg, function(v, k){
      ctx[k] = v;
    });
    ctx.beginPath();
    ctx.setTransform.apply(ctx, mtx);
    self.draw();
    self.resetContextMatrix(ctx);
    if(self.closeit === true){
      ctx.closePath();
    }
    //ctx.lineWidth不能赋予0或其他非数字
    //so 不画边框 就根据cfg来判断
    if(cfg.lineWidth != 0){
      ctx.stroke();
    }
    if(cfg.fillStyle != 'none'){
      ctx.fill();
    }
  },
  animate: function(/* obj, num, func */){
    Sanimator.add(this, arguments);
  }
});

Crect = new Class(Celement);
Crect.include({
  draw: function(){
    var self = this;
    self.context.rect(self.x, self.y, self.width, self.height);
  }
});

Carc = new Class(Celement);
Carc.include({
  draw: function(){
    var self = this;
    self.context.arc(self.x, self.y, self.r, self.sAngle, self.eAngle, self.counterclockwise);
    self.closeit = false;
  }
});

Cellipse = new Class(Celement);
Cellipse.include({
  draw: function(){
    var self = this,
      ctx = self.context,
      kappa = 0.5522848,
      x = self.x - self.xr,
      y = self.y - self.yr,
      xr = self.xr,
      yr = self.yr,
      ox = xr * kappa,
      oy = yr * kappa,
      xe = x + xr * 2,
      ye = y + yr * 2,
      xm = x + xr,
      ym = y + yr;
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  }
});

Cpath = new Class(Celement);
Cpath.extend({
  parse: function(str){
    str = str.replace(/\s/g,'');
    str = str.replace(regodr, '|$&');
    str = str.split('|');
    var arr = [],
      tem = {},
      ps = [];
    str.forEach(function(v, i, a){
      if(v == '') return;
      tem = {
        type: order2func[v.match(regodr)[0]],
        points: v.replace(regodr,'').split(',')
      };
      arr.push(tem)
    });
    return arr;
  }
});
Cpath.include({
  draw: function(){
    var self = this,
      ctx = self.context,
      cfg = self.cfg,
      json = self.pathJSON;
    json.forEach(function(step, idx, all){
      ctx[step.type].apply(ctx, step.points)
      if(step.type == 'closePath'){
        if(cfg.lineWidth != 0){
          ctx.stroke();
        }
        if(cfg.fillStyle != 'none'){
          ctx.fill();
        }
      }
    });
    self.closeit = false;
  }
});
SI.Paper = Paper;
SI.version = Version;
window.SIVONA = window.SI = SI;

}(window));
