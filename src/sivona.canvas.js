/*!
    @Name: Paper
    @Type: Class
    @Info: 画布类，实例拥有各种绘图方法 一般通过SI方法new出实例
 */
var Paper,
  Celement,
  Crect,
  Carc,
  Cellipse,
  Cpath,
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
    //TODO: id自更新
    cn.id = 'c1';
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
      TODO：鼠标进入canvas元素之后，只有mousemove事件。需要根据经过的元素，判断在各元素之间的over和out。
      TODO: mousedown mouseup dbclick
   */
  initEveHandler: function(){
    var self = this,
      node = self.canvasNode,
      events = domEvents;
    self.eves = {};
    self.hasIn = [];
    events.forEach(function(event){
      self.eves[event] = new EvArray(self, event);
      node.addEventListener(event, function(e){
        var type = e.type,
          p, who, tem,
          tem_over = [],
          tem_out = [],
          tem_move = [];
        p = getEventPosition(e);
        who = self.whoHasThisPoint(p);
        if(type == 'click'){
          if(who.length == 0) return;
          self.eves['click'].handle(who, e);
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
  /*!
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
  /*!
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
  initShape: function(el){
    var self = this,
      els = self.allElements,
      eves = self.eves;
    el.income = false;
    el.paper = self;
    el.context = self.canvasContext;
    el.display = true;
    el.zIndex = els.length;
    el.closeit = true;
    /*
        绑定事件
        TODO:解除绑定的方法（要在EvArray的实例里删除该元素注册的事件， 只删除一个方法，不多删！）
     */
    domEvents.forEach(function(event){
      el[event] = function(func){
        eves[event].push({
          target: el,
          handle: func
        });
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

   or

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
  whoHasThisPoint: function(p){
    return this.render(p);
  }
});

/*!
    TODO: Matrix类
 */

/*!
    TODO: scale、rotate、tanslate
    TODO: 数据绑定
 */
Celement = new Class;
Celement.include({
  init: function(){
    var self = this;
    forEach(arguments[0], function(v, k){
      self[k] = v;
    })
    self.cfg = {};
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
      ctx = self.context;
    if(self.display === false) return;
    forEach(cfg, function(v, k){
      ctx[k] = v;
    });
    ctx.beginPath();
    self.draw();
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
      x = self.x,
      y = self.y,
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
