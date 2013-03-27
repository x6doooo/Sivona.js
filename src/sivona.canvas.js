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
    self.allNodes = [];
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
  rect: function(l, t, w, h){
    var self = this,
      canvasContext = self.canvasContext,
      el = new Crect({
        context: canvasContext,
        left: l,
        top: t,
        width: w,
        height: h
      });
    return el;
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
    self.display = false;
  },
  attr: function(cfg){
    var self = this;
    extend(true, self.cfg, cfg);
    return self;
  },
  render: function(){
    var self = this,
      cfg = self.cfg,
      ctxt = self.context;
    forEach(cfg, function(v, k){
      ctxt[k] = v;
    });
  }
});

Crect = new Class(Celement);
Crect.include({
  render: function(){
    this.supr();
    var self = this,
      cfg = self.cfg,
      context = self.context;
    console.log(context);
    context.rect(self.left, self.top, self.width, self.height);
    context.fill();
    context.stroke();
  }
});
