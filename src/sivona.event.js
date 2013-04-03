var EvArray,
  domEvents = ['click', 'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup', 'drag'];

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
      els = self.els;
    els.push(el);
  },
  delete: function(el, func){
    this.els.forEach(function(v, i, a){
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
      el = whichs[whichs.length-1];
    els.forEach(function(v, i, a){
      if(v.target == el){
        if(v.type == 'drag'){
          nowPos = getEventPosition(e);
          oldPos = el.oldPos;
          el.translate(nowPos.x - oldPos.x, nowPos.y - oldPos.y);
          el.oldPos = nowPos;
        }
        v.handle.call(v.target, e);
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

