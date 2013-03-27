Canvas = function(container_id, w, h){
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
  cn.width = w;
  cn.height = h;
  cn.id = 'c1';
  ct.appendChild(cn);
  self.container = ct;
  self.canvasNode = cn;
  self.canvasContext = cn.getContext('2d');
};

Canvas.fn = Canvas.prototype;
Canvas.fn.rect = function(left, top, w, h){
  var self = this,
    canvasContext = self.canvasContext,
    el = new Crect().attr({
      context: canvasContext,
      left: left,
      top: top,
      width: w,
      height: h
    });
  return el;
};

Celement = new Class;
Celement.include({
  init: function(){
    this.cfg = {
      fillStyle: fillStyle,
      strokeStyle: strokeStyle
    };
    return self;
  },
  attr: function(cfg){
    var self = this;
    extend(true, self, cfg);
    return self;
  },
  render: function(){}
});

Crect = new Class(Celement);
Crect.include({
  render: function(){
    var self = this,
      cfg = self.cfg,
      context = self.context;
    context.rect(self.left, self.top, self.width, self.height);
    context.fillStyle = cfg.fillStyle;
    context.fill();
    context.strokeStyle = cfg.strokeStyle;
    context.stroke();
    return self;
  }
});
