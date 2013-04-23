/*!

  @Title: Sivona v0.0.6
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
function to_i(v){return ~~v;}
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
        target[name] = extend(deep, clone, copy);
      }else{
        target[name] = ops[name];
      }
    }
  }
  return target;
}

/*!Private
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
  |  //创建父类
  |  Dad = new Class;
  |
  |  Dad.extend({
  |    say: function(){...}  //类方法
  |  });
  |
  |  Dad.include({
  |    init: function(){...} //init方法会在创建实例时自动调用
  |    look: function(){...} //原型方法
  |  });
  |
  |  //创建子类，子类继承父类
  |  Son = new Class(Dad);
  |
  |  Son.inlcude({
  |    look: function(){ //覆盖父类的方法
  |      this._super();  //调用父类的同名方法 和其他语言的super功能相似
  |      ...
  |    }
  |  });
  |
  |  tom = new Son;  //创建实例

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
  _class.prototype._super = function(){
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
    font: '12px Arial',
    textBaseline: 'middle',
    textAlign: 'center',
    globalAlpha: 1
  },
  sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan,
  webColors = {
    aqua: '#0ff',
    black: '#000',
    blue: '#00f',
    fuchsia: '#f0f',
    gray: '#808080',
    green: '#008000',
    lime: '#0f0',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    purple: '#800080',
    red: '#f00',
    silver: '#c0c0c0',
    teal: '#008080',
    white: '#fff',
    yellow: '#ff0'
  };

function getUniqId(){
  return _uniqId++;
}

function deg2rad(d){
  return d * PI / 180;
}

function rad2deg(r){
  return r * 180 / PI;
}

// hex2num('#369') => [51, 102, 153]
function hex2num(v){
  if(v.search('#') == -1) v = webColors[v];
  if(v.length == 4){
    v = v.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
      return [parseInt(r+r, 16), parseInt(g+g, 16), parseInt(b+b, 16)];
    }).split(',');
  }else{
    v = v.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, function(m, r, g, b){
      return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
    }).split(',');
  }
  v[0] = +v[0];
  v[1] = +v[1];
  v[2] = +v[2];
  return v;
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
}var Version = "0.0.6",
  /*!
    @Name: SI
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
    |  var paper = SI('div1', 100, 200);
    |  paper.rect(...);
  */
  SI = function(id, w, h, t, l){
    return new SI.Paper(id, w, h, t, l);
  },
  _uniqId = 0;




var EvArray = new Class,
  domEvents = ['click', 'dbclick', 'mouseout', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'drag'];

SI.onEvent = true;

EvArray.include({
  init: function(paper){
    this.els = [];
    this.paper = paper;
  },
  push: function(el){
    this.els.push(el);
  },
  delete: function(el, func){
    var els = this.els;
    els.forEach(function(v, i, a){
      if(v.target == el && (func ? v.handle == func : true)){
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
      el = whichs[whichs.length-1],
      nowPos,
      oldPos;
    els.forEach(function(v, i, a){
      if(v.target == el){
        if(v.type == 'drag'){
          nowPos = getEventPosition(e);
          oldPos = el.oldPos;
          el.translate(nowPos.x - oldPos.x, nowPos.y - oldPos.y);
          el.oldPos = nowPos;
        }
        if(v.handle) v.handle.call(v.target, e);
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
/*!Private
 TODO:？？？ path  转换path描述？？？
 Todo: 多个canvas同时执行动画 test
 Todo: 中断某个元素的动画
 Todo: 增加一组元素的动画，只设置一个CallBack

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
(function() {
  var lastTime = 0,
    vendors = ['webkit', 'moz', 'o', 'ms'],
    x,
    l,
    currTime,
    time2call,
    id;

  for(x = 0, l = vendors.length; x < l && !window.requestAnimationFrame; ++x) {
    SI.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    SI.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!SI.requestAnimationFrame){
    SI.requestAnimationFrame = function(callback) {
      currTime = Date.now();
      time2call = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() { callback(currTime + time2call); },
        time2call);
      lastTime = currTime + time2call;
      return id;
    };
  }

  if (!SI.cancelAnimationFrame){
    SI.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();

/*!Private

  @Name: Animator
  @Type: Class
  @Info: 动画控制器。SI.animationController是它的一个实例，该实例可以控制由shape.animate()生成的动画。

 */

var Animator = new Class;
Animator.include({
  init: function() {
    this.amtArr = [];
    this.stamp = null;
    this.timer = null;
    this.timeDiff = 1;
  },
  add: function(el, arr) {
    var self = this,
      amtArr = self.amtArr,
      oldStatus = amtArr.length,
      _id = 'ani_' + getUniqId(),
      hl = arr[1]||500,
      cfg = el.cfg,
      am = extend(true, {}, arr[0]),
      cb = arr[2] || function() {},
      k,
      v;

    for(k in am){
      v = am[k];
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
        case 'fillStyle':
        case 'strokeStyle':
          cfg[k] = hex2num(cfg[k] || '#fff');
          v = hex2num(v);
          am[k] = {
            src: cfg[k],
            st: [(v[0] - cfg[k][0])/hl, (v[1] - cfg[k][1])/hl, (v[2] - cfg[k][2])/hl],
            tar: v
          };
          break;
        default:
          cfg[k] = cfg[k] || 0;
          am[k] = {
            src: cfg[k],
            st: [(v[0] - cfg[k][0])/hl, (v[1] - cfg[k][1])/hl, (v[2] - cfg[k][2])/hl],
            tar: v
          };
          break;
      }
    }

    amtArr.push([el, am, hl, cb, Date.now(), _id]);
    if(oldStatus == 0){ //不为0则有action在执行
      self.action();
    }
    return _id;
  },
  remove: function(_id){
    var amtArr = this.amtArr,
      len = amtArr.length;
    while(len--){
      if(amtArr[5] == _id) amtArr.splice(len, 1);
    }
  },
  pause: function(){
    this.pauseArr = this.amtArr;
    this.pauseStamp = Date.now();
    this.amtArr = [];
  },
  process: function(){
    var amtAttr = this.pauseArr,
      pauseTime = Date.now() - this.pauseStamp,
      len = amtAttr.length;
    while(len--){
      amtAttr[len][4] += pauseTime;
    }
    this.amtArr = amtAttr;
    this.pauseArr = [];
    this.timeDiff = 1;
    this.checkStatus();
  },
  abort: function(){
    this.init();
  },
  action: function(){
    var self = this,
      amtArr = self.amtArr,
      td = self.timeDiff,
      el,
      paper,
      am,
      hl,
      cb,
      src,
      st,
      tar,
      tem,
      pt,
      done,
      len,
      i,
      v,
      k,
      sTime,
      val,
      selfStamp;

    selfStamp = self.stamp = Date.now();

    len = amtArr.length;

    while(len--){
      v = amtArr[len];
      el = v[0];
      am = v[1];
      hl = v[2];
      cb = v[3];
      sTime = v[4];
      pt = (selfStamp - sTime);
      done = (hl <= pt);
      el.matrix = [1, 0, 0, 1, 0, 0];
      paper = el.paper;

      for(k in am){
        val = am[k];
        src = val.src;
        st = val.st;
        tar = val.tar;
        if(k.search(/scale|rotate|translate|transform/) != -1){
          if(done){
            el[k].apply(el, tar);
          }else{
            i = src.length;
            while(i--){
              src[i] += (st[i] * td);
            }
            el[k].apply(el, src);
          }
        }else if(k.search(/fillStyle|strokeStyle|shadowColor/) != -1){
          tem = {};
          if(done){
            tem[k] = rgb2hex.apply(this, tar);
            el.attr(tem);
          }else{
            i = src.length;
            while(i--){
              src[i] += (st[i] * td);
            }
            tem[k] = rgb2hex.apply(this, src);
            el.attr(tem);
          }
        }else{
          tem = {};
          if(done){
            tem[k] = tar;
            el.attr(tem);
          }else{
            src += (st * td);
            tem[k] = src;
            el.attr(tem);
            val.src = src;
          }
        }

      }
      paper.render();
      if(done){
        amtArr.splice(len, 1);
        cb.call(el);
      }
    }
    SI.cancelAnimationFrame(self.timer);
    self.timer = SI.requestAnimationFrame(function(){
      self.timeDiff = Date.now() - self.stamp;
      self.checkStatus();
    });
  },
  checkStatus: function(){
    var self = this;
    if(self.amtArr.length !== 0){
      self.action();
    }else{
      self.init();
    }
  }
});

//主动画控制器
var sanimator = new Animator();
/*!
    @Name: Paper
    @Type: Class
    @Info: 画布类，实例拥有各种绘图方法 一般通过SI方法new出实例
 */
var Paper,
//TODO: T\S命令
  order2func = {
    'M': 'moveTo',
    'L': 'lineTo',
    'Q': 'quadraticCurveTo',
    'C': 'bezierCurveTo',
    'Z': 'closePath'
  };

Paper = new Class;
Paper.include({
  init: function(container_id, w, h, t, l){
    var self = this,
      ct,
      cn;
    if(isUndefined(container_id) || !isString(container_id)){
      throw new Error('container is not defined!');
    }
    if(isUndefined(w)){
      w = window.innerWidth;
      h = window.innerHeight;
    }
    ct = document.getElementById(container_id);
    if(ct === null){
      throw new Error('container is not defined!');
    }
    cn = document.createElement('canvas');
    cn.style.position = 'absolute';
    self.width = cn.width = w;
    self.height = cn.height = h;

    if(isDefined(t)){
      cn.style.top = t + 'px';
      cn.style.left = l + 'px';
    }
    cn.id = container_id + '_canvas_' + getUniqId();
    ct.appendChild(cn);
    self.container = ct;
    self.canvasNode = cn;
    self.canvasContext = cn.getContext('2d');
    self.allElements = [];
    if(SI.onEvent) self.initEveHandler();
    self.reset();
  },
  /*
      初始化事件处理对象
      Todo: 事件冒泡
      Todo: 泛光(shadow)
      Todo: 渐变
      Todo: image
      Todo: clip
      Todo: pattern
      Todo: drag方法不触发click
      Todo: 解除绑定 & 全部解除
   */
  initEveHandler: function(){
    var self = this,
      node = self.canvasNode,
      events = domEvents,
      len = events.length,
      event;

    self.eves = {};
    self.hasIn = [];
    self.isDrag = false;

    while(len--){
      event = events[len];
      self.eves[event] = new EvArray(self);
      node.addEventListener(event, function(e){
        var type = e.type,
          p,
          who,
          tem_over = [],
          tem_out = [],
          tem_move = [],
          isDrag = self.isDrag,
          hasIn = self.hasIn,
          eves = self.eves;
        p = getEventPosition(e);
        who = self.whoHasThisPoint(p);
        if(type.search(/click|mousedown|mouseup|dbclick/) != -1){
          if(who.length == 0) return;
          if(type == 'mousedown'){
            isDrag = who[who.length - 1];
            isDrag.oldPos = getEventPosition(e);
          }
          if(type == 'mouseup') isDrag = false;
          eves[type].handle(who, e);
        }else if(type == 'mousemove' && isDrag){
          //drag
          eves['drag'].handle([isDrag], e);
        }else if(type == 'mousemove'){
          if(who.length != 0 && hasIn.length == 0){
            //over
            who.forEach(function(v){
              v.setIncome(true);
            });
            eves['mouseover'].handle(who, e);
          }else if(who.length != 0){
            //over move out
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
            hasIn.forEach(function(v){
              if(who.indexOf(v) < 0 ){
                v.income = false;
                tem_out.push(v);
              }
            });
            if(tem_over.length >= 0) eves['mouseover'].handle(tem_over, e);
            if(tem_move.length >= 0) eves['mousemove'].handle(tem_move, e);
            if(tem_out.length >= 0) eves['mouseout'].handle(tem_out, e);
            hasIn = who;
          }else if(hasIn.length != 0){
            //out
            hasIn.forEach(function(v){
              v.income = false;
            });
            who = hasIn;
            eves['mouseout'].handle(who, e);
            hasIn = [];
          }
        }
        self.isDrag = isDrag;
        self.hasIn = hasIn;
      }, false);
    }
  },
  /*!Private
      @Name: paper.reset
      @Info: 重置context环境的属性值，恢复到默认值
   */
  reset: function(){
    var self = this,
      ctx = self.canvasContext;
    forEach(defaultCfg, function(v, k){
      ctx[k] = v;
    });
  },
  /*!
      @Name: paper.clear([l, t, w, h])
      @Info: 清空画布
      @Params:
      - l {Number} 清空区域的左上角x坐标
      - t {Number} 清空区域的左上角y坐标
      - w {Number} 清空区域的宽度
      - h {Number} 清空区域的高度
      @Usage:
      | //从（10,10）坐标开始清空100*100的区域
      | paper.clear(10, 10, 100, 100)
      |
      | //清空整个画布
      | paper.clear()
   */
  clear: function(l, t, w, h){
    var self = this,
      ctx = self.canvasContext;
    if(arguments.length == 0){
      l = 0;
      t = 0;
      w = self.width;
      h = self.height;
    }
    ctx.clearRect(l, t, w, h);
  },
  /*!Private
      创建图形时初始化一些属性
   */
  initShape: function(el){
    var self = this,
      els = self.allElements,
      eves = self.eves,
      len = domEvents.length,
      event;

    el.paper = self;
    el.context = self.canvasContext;
    el.zIndex = els.length;
    /*!Private
        绑定事件
     */
    while(len--){
      event = domEvents[len];
      (function(event){
        el[event] = function(func){
          eves[event].push({
            target: el,
            type: event,
            handle: func
          });
        };
        el['un'+event] = function(func){
          if(func){
            eves[event].delete(el, func);
          }else{
            eves[event].delete(el);
          }
        };
      })(event);
    }
    els.push(el);
    //self.render();
    return el;
  },
  /*!
      @Name: paper.group(el, el, el, ...)
      @Info: 创建图形组
      @Params:
      - {Instance} 若干图形实例
      @Return:
      - group实例对象
   */
  group: function(){
    var self = this,
      arr = to_a(arguments),
      g = new Cgroup(arr);
    g.paper = self;
    g.context = self.canvasContext;
    return g;
  },
  /*!
      @Name: paper.text(t, x, y, w)
      @Info: 绘制文字的方法
      @Params:
      - t {String} 文字内容
      - x {Number} x轴坐标
      - y {Number} y轴坐标
      - w {Number} 文字宽度（可选）
      @Return:
      - 文字实例对象
   */
  text: function(t, x, y, w){
    var self = this,
      el = new Ctext({
        text: t,
        x: x,
        y: y,
        textWidth: w
      });
    el.shapeType = 'text';
    return self.initShape(el);
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
      - 矩形实例对象
   */
  rect: function(x, y, w, h){
    var self = this,
      el = new Crect({
        x: x,
        y: y,
        width: w,
        height: h
      });
    el.shapeType = 'rect';
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
   - 弧形实例对象
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
    el.shapeType = 'arc';
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
   - 圆形实例对象
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
    el.shapeType = 'circle';
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
   - 椭圆实例对象
   */
  ellipse: function(x, y, xr, yr){
    var self = this,
      el = new Cellipse({
        x: x, y: y, xr: xr, yr: yr
      });
    el.shapeType = 'ellipse';
    return self.initShape(el);
  },
  /*!
   @Name: paper.path(...)
   @Info: 路径方法
   @Type: Method
   @Params:
   - {JSON or String} 描述路径的json或者string，如果是string，会由内置的parse转换成json
   @return: path实例
   @Usage:
   | 
   |  pathString = "Mx,yLx,y..."
   |
   |  pathJSON = [
   |    {type:'moveTo', points: [x, y]},
   |    {type:'lineTo', points: [x, y]},
   |    {type:'quadraticCurveTo', points: [x1, y1, x2, y2]},
   |    {type:'bezierCurveTo', points: [x1, y1, x2, y2, x3, y3]}
   |    {type:'closePath'},
   |    {type:'moveTo', points: [x, y]},
   |    ...
   |  ];
   |
   |  paper.path(pathString);
   |
   |  //or
   |
   |  paper.path(pathJSON);
   |
   */
  path: function(json){
    var self = this,
      el = new Cpath({});
    if(isString(json)){
      json = Cpath.parse(json);
    }
    el.pathJSON = json;
    el.shapeType = 'path';
    return self.initShape(el);
  },
  /*!
   @Name: paper.clone(el)
   @Info: 复制一个图形
   @Type: Method
   @Params:
   - el {Instance} 图形实例
   @Return: 图形实例
   */
  clone: function(el){
    var self = this,
      tem = null,
      cf = extend(true, {}, el);
    switch(cf.shapeType){
      case 'rect':
        tem = new Crect(cf);
        break;
      case 'circle':
      case 'arc':
        tem = new Carc(cf);
        break;
      case 'ellipse':
        tem = new Cellipse(cf);
        break;
      case 'path':
        tem = new Cpath(cf);
        break;
      default: break;
    }
    tem.attr(cf.cfg);
    self.initShape(tem);
    tem.zIndex = cf.zIndex;
    return tem;
  },
  refresh: function(){
    this.render();
  },
  /*!Private

      清空画布 重绘一帧
      whoHasThisPoint方法也通过render实现
      重绘帧的过程中，对每个path使用isPointInPath方法
      检查是否有该点

   */
  render: function(check){
    var self = this,
      allElements = self.allElements,
      len = allElements.length,
      ctx = self.canvasContext,
      which = [],
      el;
    if(!check) self.clear();
    allElements.sort(function(a, b){
      return b.zIndex - a.zIndex;
    });
    while(len--){
      el = allElements[len];
      if(el.display !== false){
        el.render(check);
        if(check && ctx.isPointInPath(check.x, check.y)){
          which.push(el);
        }
      }
    }
    return which;
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
    var self = this,
      ctx = self.canvasContext,
      which;
    ctx.save();
    which = self.render(p);
    ctx.restore();
    return which;
  }
});

var Matrix,
    Cgroup,
    Celement,
    Crect,
    Carc,
    Cellipse,
    Cpath,
    regodr = /[MLQCZHV]/gi,
    regodr_lower = /[mlqc]/g;

/*!Private

 @Name: Matrix
 @Info: 矩阵变换类，是Celement的父类。
 @Type: Class
 @Params: 无

 */

Matrix = new Class;

Matrix.extend({
  /*!
   @Name: Matrix.p2p(point, matrix)
   @Info: Matrix的类方法，计算一个点经过一个矩阵变换后的坐标
   @Params:
   -point {Array} [x, y] 点坐标
   -m {Array} [a,b,c,d,e,f]
   @Usage:
   |  p = [10, 10];
   |  matrix = [1, 0, 0 , 1, 10, 10]
   |  Matrix.p2p(p, matrix) // => [20, 20]
   */
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
  /*!Private
   @Name: el.update()
   @Info: 根据参数更新矩阵
   */
  update: function(a, b, c, d, e, f){
    var self = this,
      m = self.matrix,
      m0 = m[0],
      m1 = m[1],
      m2 = m[2],
      m3 = m[3],
      m4 = m[4],
      m5 = m[5],
      m6 = m[6];
    self.matrix = [
      m0 * a + m2 * b,
      m1 * a + m3 * b,
      m0 * c + m2 * d,
      m1 * c + m3 * d,
      m0 * e + m2 * f + m4,
      m1 * e + m3 * f + m5
    ];
  },
  resetContextMatrix: function(){
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  },
  /*!
    @Name: el.translate(x, y)
    @Info: 平移
   */
  translate: function(x, y){
    this.update(1, 0, 0, 1, x, y);
    return this;
  },
  transform: function(a, b, c, d, e, f){
    this.update(a, b, c, d, e, f);
    return this;
  },
  scale: function(sx, sy, x, y){
    sy = sy || sx;
    (x || y) && this.update(1, 0, 0, 1, x, y);
    this.update(sx, 0, 0, sy, 0, 0);
    (x || y) && this.update(1, 0, 0, 1, -x, -y);
    return this;
  },
  rotate: function(a, x, y){
    a = deg2rad(a);
    x = x || 0;
    y = y || 0;
    var sina = toFixed(sin(a), 9),
      cosa = toFixed(cos(a), 9);
    this.update(cosa, sina, -sina, cosa, x, y);
    (x || y) && this.update(1, 0, 0, 1, -x, -y);
    return this;
  }
});

//Todo: 单独给一个成员绑事件，只触发该成员事件，给group绑事件则全员触发???
//TODO：点击事件比较好处理 因为group绑定点击后，点击某个组成部分就会触发事件
//TODO：不好处理的是drag事件，当拖动一个组成部分时，其他部分应该也一起移动才对！！！
Cgroup = new Class;
Cgroup.include({
  init: function(arr){
    var self = this,
      methods = ['show', 'hide', 'attr'];
    self.els = arr;
    methods.forEach(function(v){
      self[v] = function(){
        var els = self.els,
          l = els.length,
          el;

        while(l--){
          el = els[l];
          el[v].apply(el, arguments);
        }
      };
    });
    return this;
  },
  push: function(a){
    this.els.push(a);
  }
});

/*!Private
 @Tip: matrix属性和attr属性必须区分开，避免matrix属性直接污染context
 */
Celement = new Class(Matrix);
Celement.include({
  init: function(){
    var self = this;
    self._super();
    forEach(arguments[0], function(v, k){
      self[k] = v;
    });
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

  /*!
    @Name: el.data(key[, value])
    @Type: Method
    @Info: 图形对象绑定、读取数据的方法
    @Usage:
    | rect = paper.rect(10, 10, 100, 80);
    | //绑定
    | rect.data('key', 'value');
    | //读取
    | rect.data('key');
   */
  data: function(k, v){
    var self = this;
    if(isDefined(v)){
      self.data[k] = v;
      return self;
    }
    return self.data[k];
  },

  /*!
    @Name: el.attr(...)
    @Type: Method
    @Info: 给图形设置样式或读取样式的方法
    @Usage:
    | //给图形对象设置填充色
    | el.attr('fillStyle', '#333');
    | //设置多个样式字段，可以使用一个hash参数
    | el.attr({'fillStyle':'red', 'lineWidth': 10});
    | //读取一个样式字段的值
    | el.attr('strokeStyle');
   */
  attr: function(){
    var self = this,
      args = to_a(arguments),
      l = args.length,
      a0;
    if(l == 0){
      return self;
    }
    a0 = args[0];
    if(isString(a0) && l == 1){
      return self.cfg[a0];
    }
    if(l == 2){
      self.cfg[a0] = args[1];
    }else if(isObject(a0)){
      extend(true, self.cfg, a0);
    }else{
      return self;
    }
    return self;
  },
  /*!
    @Name: el.show()
    @Info: 显示图形
   */
  show: function(){
    this.display = true;
  },
  /*!
    @Name: el.hide()
    @Info: 隐藏图形
   */
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
  },
  close: function(){
    this.closeit = true;
    return this;
  },
  render: function(check){
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

    //如果是由whoHasThisPoint方法触发的render，不需要进行实际绘制
    if(check) return;
    //ctx.lineWidth不能赋予0或其他非数字
    //so 不画边框 就根据cfg来判断
    if(cfg.lineWidth != 0){
      ctx.stroke();
    }
    if(cfg.fillStyle != 'none'){
      ctx.fill();
    }
  },
  /*!
   @Name: el.animate(options[, time, callback])
   @Info: 给图形设置动画
   @Params:
   - options {Object} 动画内容
   - time {Number} 可选 毫秒数 动画过程时间
   - callback {Function} 可选 回调函数
   @Usage:
   |  el.animate({
   |    "fillStyle": "#f00",
   |    "lineWidth": "#333"
   |  }, 500, function(){
   |    alert("done!");  
   |  });
   */
  animate: function(){
    return sanimator.add(this, arguments);
  },
  /*!
   @Name: el.remove()
   @Type: Method
   @Info: 删除图形
   */
  remove: function(){
    var self = this;
    self.hide();
    self.paper.allElements.forEach(function(v, i, a){
      if(v == self) a.splice(i, 1);
    });
    sanimator.amtArr.forEach(function(v, i, a){
      if(v[0] == self) a.splice(i, 1);
    });
    domEvents.forEach(function(event){
      self['un'+event]();
    });
  }
});

Ctext = new Class(Celement);
Ctext.include({
  draw: function(){
    var self = this,
      ctx = self.context,
      txt = self.text,
      w = self.textWidth || ctx.measureText(txt).width;
    ctx.fillText(txt, self.x, self.y, w);
    if(self.cfg.lineWidth != 0){
      ctx.strokeText(txt, self.x, self.y, w);
    }
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
      xr = self.xr,
      yr = self.yr,
      x = self.x - xr,
      y = self.y - yr,
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
      type,
      points,
      last_points,
      len,
      lastX,
      lastY,
      i = 0,
      l = str.length,
      v;

    for(;i < l; i++){
      v = str[i];
      if(v == '') continue;
      type = v.match(regodr)[0];
      if(type == 'z' || type == 'Z'){
        type = type.toUpperCase();
        continue;
      }
      points = v.replace(regodr, '').replace(/\b\-/g, ',-').split(',');
      if(arr.length !== 0){
        last_points = arr[arr.length-1].points;
        len = last_points.length;
        lastX = +last_points[len-2];
        lastY = +last_points[len-1];
      }
      if(type.search(regodr_lower) !== -1){
        points[0] = +points[0] + lastX;
        points[1] = +points[1] + lastY;
        if(points.length > 2){
          points[2] = +points[2] + lastX;
          points[3] = +points[3] + lastY;
        }
        if(points.length > 4){
          points[4] = +points[4] + lastX;
          points[5] = +points[5] + lastY;
        }
        type = type.toUpperCase();
      }
      if(type == 'H' || type == 'h'){
        points[1] = lastY;
        if(type == 'h'){
          points[0] = +points[0] + lastX;
        }
        type = 'L';
      }
      if(type == 'V' || type == 'v'){
        points[1] = points[0];
        if(type == 'v'){
          points[1] = +points[1] + lastY;
        }
        points[0] = lastX;
        type = 'L';
      }
      tem = {
        type: order2func[type],
        points: points
      };
      arr.push(tem)
    }
    return arr;
  }
});
Cpath.include({
  draw: function(){
    var self = this,
      ctx = self.context,
      cfg = self.cfg,
      json = self.pathJSON,
      len = json.length,
      i = 0,
      step;

    for(;i<len;i++){
      step = json[i];
      ctx[step.type].apply(ctx, step.points)
      if(step.type == 'closePath'){
        if(cfg.lineWidth != 0){
          ctx.stroke();
        }
        if(cfg.fillStyle != 'none'){
          ctx.fill();
        }
      }
    }
    self.closeit = false;
  }
});
SI.Paper = Paper;
SI.version = Version;
SI.animationController = sanimator;
SI.getEventPosition = getEventPosition;
/*!

  @Name: SI.parsePath(d)
  @Info: 解析SVG路径描述，转为Canvas绘制用的命令和点的数组
  @Params:
  - d {string} svg路径字符串
  @Return:
  - {array}
  @Usage:
  | arr = SI.parsePath('M10,10L10,10C-10-10...');
  | //arr => [{type:'moveTo',points:[10,10]}, {type:'lineTo',points:[10,10]}...]

*/
SI.parsePath = Cpath.parse;
window.SIVONA = window.SI = SI;

}(window));
