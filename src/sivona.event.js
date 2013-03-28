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
  init: function(node, event){
    this.els = [];
    this.node = node;
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
    node.addEventListener(event, handle, false);
  },
  unbind: function(){
    var self = this,
      node = self.node,
      event = self.evetn,
      handle = self.handle;
    node.removeEventListener(event, handle, false);
  },
  handle: function(e){
    console.log(e);
  }
});

