var Matrix,
    Cgroup,
    Celement,
    Crect,
    Carc,
    Cellipse,
    Cpath,
    regodr = /[MLQCZHVTS]/gi,
    regodr_lower = /[mlqc]/g,
    order2func = {
      'M': 'moveTo',
      'L': 'lineTo',
      'Q': 'quadraticCurveTo',
      'C': 'bezierCurveTo',
      'Z': 'closePath',
      'T': 'quadraticCurveTo',
      'S': 'bezierCurveTo'
    };
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
      m5 = m[5];
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

/*!Private
  单独给一个成员绑事件，只触发该成员事件，给group绑事件则全员触发???
  点击事件比较好处理 因为group绑定点击后，点击某个组成部分就会触发事件
  不好处理的是drag事件，当拖动一个组成部分时，其他部分应该也一起移动才对！！！
*/
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
      self['un' + event]();
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

Cimage = new Class(Celement);
Cimage.include({
  draw: function(){
    //TODO
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

    for( ;i < l; i++){
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
        points.push(lastY);
        if(type == 'h'){
          points[0] = +points[0] + lastX;
        }
        type = 'L';
      }
      if(type == 'V' || type == 'v'){
        points.unshift(lastX);
        if(type == 'v'){
          points[1] = +points[1] + lastY;
        }
        type = 'L';
      }
      if(type == 'T'){
        if(last_points.length !== 4){
          throw new Error("path parse error: T can not find Q!");
        }
        var tx = 2 * last_points[2] - last_points[0],
          ty = 2 * last_points[3] - last_points[1];
        points.unshift(ty);
        points.unshift(tx);
      }
      if(type == 'S'){
        if(last_points.length !== 6){
          throw new Error('path parse error: S can not find C!');
        }
        var tx = 2 * last_points[4] - last_points[2],
          ty = 2 * last_points[5] - last_points[3];
        points.unshift(ty);
        points.unshift(tx);
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
      ctx[step.type].apply(ctx, step.points);
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
