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
    self.width = cn.width = w;
    self.height = cn.height = h;
    cn.id = 'c1';
    ct.appendChild(cn);
    self.container = ct;
    self.canvasNode = cn;
    self.canvasContext = cn.getContext('2d');
    self.allElements = [];
    self.reset();
  },
  reset: function(){
    var self = this,
      context = self.canvasContext;
    forEach(defaultCfg, function(v, k){
      context[k] = v;
    });
  },
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
      els = self.allElements;
    el.context = self.canvasContext;
    el.display = true;
    el.zIndex = els.length;
    els.push(el);
    return el;
  },
  rect: function(l, t, w, h){
    var self = this,
      el = new Crect({
        left: l,
        top: t,
        width: w,
        height: h
      });
    return self.initShape(el);
  },
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
  render: function(){
    var self = this,
      allElements = self.allElements;
    allElements.sort(function(a, b){
      return a.zIndex - b.zIndex;
    });
    allElements.forEach(function(el, idx, all){
      el.render();
    });
  },
  refresh: function(){
    this.clear();
    this.render();
  }
});

Celement = new Class;
Celement.include({
  init: function(){
    var self = this,
      args = to_a(arguments);
    forEach(arguments[0], function(v, k){
      self[k] = v;
    })
    self.cfg = {};
  },
  attr: function(cfg){
    var self = this;
    extend(true, self.cfg, cfg);
    return self;
  },
  show: function(){
    this.display = true;
  },
  hide: function(){
    this.display = false;
  },
  render: function(){
    var self = this,
      cfg = self.cfg,
      ctx = self.context;
    forEach(cfg, function(v, k){
      ctx[k] = v;
    });
    ctx.beginPath();
    self.draw();
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
    self.context.rect(self.left, self.top, self.width, self.height);
  }
});

Carc = new Class(Celement);
Carc.include({
  draw: function(){
    var self = this;
    self.context.arc(self.x, self.y, self.r, self.sAngle, self.eAngle, self.counterclockwise);
  }
});
