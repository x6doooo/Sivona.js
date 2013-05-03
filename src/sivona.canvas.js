/*!
    @Name: Paper
    @Type: Class
    @Info: 画布类，实例拥有各种绘图方法 一般通过SI方法new出实例
 */
var Paper = new Class;
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
      - 无参数时清空整个画布
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
