/*!
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
      Todo: 事件冒泡
      Todo: 泛光效果
      Todo: image
      Todo: clip
      Todo: pattern
      Todo: group 将多个图形设置成组
      Todo: drag方法不触发click
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
        if(func){
          eves[event].delete(el, func);
        }else{
          eves[event].delete(el);
        }
      };
    });
    els.push(el);
    self.refresh();
    return el;
  },
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
   - 实例对象
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
   @Name: path
   @Info: 路径方法
   @Type: Method
   @Params:
   - {JSON or String} 描述路径的json或者string，如果是string，会由内置的parse转换成json
   @return: path实例
   @Usage:

   pathString = "Mx,yLx,y..."

   Todo: 小写 相对位置

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
    el.shapeType = 'path';
    return self.initShape(el);
  },
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
        break
      default: break;
    }
    tem.attr(cf.cfg);
    self.initShape(tem);
    tem.zIndex = cf.zIndex;
    return tem;
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
    return this;
  },
  transform: function(a, b, c, d, e, f){
    this.update(a, b, c, d, e, f);
    this.paper.refresh();
    return this;
  },
  scale: function(sx, sy, x, y){
    sy = sy || sx;
    (x || y) && this.update(1, 0, 0, 1, x, y);
    this.update(sx, 0, 0, sy, 0, 0);
    (x || y) && this.update(1, 0, 0, 1, -x, -y);
    this.paper.refresh();
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
    this.paper.refresh();
    return this;
  }
});

/*!
    Todo: text绘制方法
    @Tip: matrix属性和attr属性必须区分开，避免matrix属性直接污染context
 */
Celement = new Class(Matrix);
Celement.include({
  init: function(){
    var self = this;
    self._super();
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
    return sanimator.add(this, arguments);
  },
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
