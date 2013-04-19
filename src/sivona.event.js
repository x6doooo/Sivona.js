var EvArray = new Class,
  domEvents = ['click', 'dbclick', 'mouseout', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'drag'];

SI.onEvent = true;

EvArray.include({
  init: function(paper){
    this.els = [];
    this.paper = paper;
  },
  push: function(el){
    this.els.push(el);
  },
  delete: function(el, func){
    var els = this.els;
    els.forEach(function(v, i, a){
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
      el = whichs[whichs.length-1],
      nowPos,
      oldPos;
    els.forEach(function(v, i, a){
      if(v.target == el){
        if(v.type == 'drag'){
          nowPos = getEventPosition(e);
          oldPos = el.oldPos;
          el.translate(nowPos.x - oldPos.x, nowPos.y - oldPos.y);
          el.oldPos = nowPos;
        }
        if(v.handle) v.handle.call(v.target, e);
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
