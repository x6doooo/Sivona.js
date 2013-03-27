Canvas = function(container_id, w, h){
  var self = this,
    ct,
    cn;
  if(isUndefined(container_id) || !isString(container_id)){
    throw new Error(ERROR_STR.container);
  }
  if(isUndefined(w)){
    w = window.screen.width;
  }
  if(isUndefined(h)){
    h = window.screen.height;
  }
  ct = document.getElementById(container_id);
  if(ct === null){
    throw new Error(ERROR_STR.container);
  }
  cn = document.createElement('canvas');
  cn.width = w;
  cn.height = h;
  ct.appendChild(cn);
  self.container = ct;
  self.canvasNode = cn;
  self.canvasContext = cn.getContext('2d');
};

