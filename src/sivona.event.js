var EvArray,
  domEvents = ['click', 'mouseover', 'mouseout', 'mousemove'];

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
  delete: function(el){
    this.els.forEach(el);
  },
  forEach: function(func){
    return this.els.forEach(func);
  },
  handle: function(whichs ,e){
    var self = this,
      els = self.els,
      el = whichs[whichs.length-1];
    els.forEach(function(v, i, a){
      console.log(v);
      console.log(el);
      if(v.target == el){
        v.handle.call(v.target);
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

