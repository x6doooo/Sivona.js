SI.domEvents = ['click', 'mouseover', 'mouseout', 'mousemove'];

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
      els = self.els,
      len = els.length;
    els.push(el);
    if(len == 0 && els.length != 0){
      self.bind();
    }
  },
  delete: function(el){
    this.els.forEach(el);
  },
  forEach: function(func){
    return this.els.forEach(func);
  },
  bind: function(){
    var self = this,
      node = self.node,
      event = self.event,
      handle = self.handle;
    node.addEventListener(event, function(e){
      handle.call(self, e);
    }, false);
  },
  /*
  unbind: function(){
    var self = this,
      node = self.node,
      event = self.evetn,
      handle = self.handle;
    node.removeEventListener(event, handle, false);
  },
  */
  handle: function(e){
    var self = this,
      paper = self.paper,
      p = getEventPosition(e),
      els = self.els,
      el,
      len;
    p = paper.whichHasThisPoint(p);
    len = p.length;
    if(len == 0){
      return;
    }
    el = p[len-1];
    els.forEach(function(v, i, a){
      if(v.target == el){
        v.handle.call(v.target);
      }
    });

  }
});

