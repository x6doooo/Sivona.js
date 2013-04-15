/*
 TODO:？？？ path  转换path描述？？？
 Todo: 多个canvas同时执行动画 test
 Todo: 中断某个元素的动画

    animator = new Animator();

    matrix属性: scale, rotate, translate, transform

    attr属性:

    //group
    el.animate(object, number, function);

    el.animate({
      scale: [x, y],
      rotate: [a, x, y],
      opacity: value
    }, step, function(){});

    //callback
    el.animate({}, function(){});

 */
(function() {
  var lastTime = 0,
    vendors = ['webkit', 'moz', 'o', 'ms'],
    x,
    l,
    currTime,
    timeToCall,
    id;
  for(x = 0, l = vendors.length; x < l && !window.requestAnimationFrame; ++x) {
    SI.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    SI.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!SI.requestAnimationFrame){
    SI.requestAnimationFrame = function(callback, element) {
      currTime = new Date().getTime();
      timeToCall = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!SI.cancelAnimationFrame){
    SI.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

var Animator = new Class;
Animator.include({
  init: function(){
    this.amtArr = [];
    this.stamp = null;
    this.timer = null;
    this.timeDiff = 1;
  },
  // Todo: 增加一组元素的动画，只设置一个CallBack
  add: function(el, arr){
    //arr = [am, hl, cb]
    var self = this,
      amtArr = self.amtArr,
      oldStatus = amtArr.length,
      _id = 'ani_' + getUniqId(),
      hl = arr[1]||500,
      cfg = el.cfg,
      am = extend(true, {}, arr[0]),
      cb = arr[2] || function(){};
    forEach(am, function(v, k){
      if(k == 'translate'){
        am[k] = {
          st: [v[0]/hl, v[1]/hl],
          src: [0, 0],
          tar: v
        };
      }else if(k == 'rotate'){
        v[1]= v[1] || 0;
        v[2] = v[2] || 0;
        am[k] = {
          st: [v[0]/hl, 0, 0],
          src: [0, v[1], v[2]],
          tar: v
        };
      }else if(k == 'scale'){
        v[1] = v[1] || v[0];
        v[2] = v[2] || 0;
        v[3] = v[3] || 0;
        am[k] = {
          st: [ (v[0]-1)/hl, (v[1]-1)/hl, 0, 0 ],
          src: [1, 1, v[2], v[3]],
          tar: v
        };
      }else if(k == 'fillStyle' || k == 'strokeStyle'){
        cfg[k] = hex2num(cfg[k] || '#fff');
        v = hex2num(v);
        am[k] = {
          src: cfg[k],
          st: [(v[0] - cfg[k][0])/hl, (v[1] - cfg[k][1])/hl, (v[2] - cfg[k][2])/hl],
          tar: v
        };
      }else{
        cfg[k] = cfg[k] || 0;
        am[k] = {
          src: cfg[k],
          st: [(v[0] - cfg[k][0])/hl, (v[1] - cfg[k][1])/hl, (v[2] - cfg[k][2])/hl],
          tar: v
        };
      }
    });
    amtArr.push([el, am, hl, cb, +new Date(), _id]);
    if(oldStatus == 0){ //不为0则有action在执行
      self.action();
    }
    return _id;
  },
  remove: function(_id){
    var amtArr = this.amtArr,
      len = amtArr.length;
    while(len--){
      if(amtArr[5] == _id) amtArr.splice(i, 1);
    }
  },
  pause: function(){
    this.pauseArr = this.amtArr;
    this.pauseStamp = +new Date();
    this.amtArr = [];
  },
  process: function(){
    var amtAttr = this.pauseArr,
      pauseTime = new Date() - this.pauseStamp,
      len = amtAttr.length;
    while(len--){
      amtAttr[len][4] += pauseTime;
    }
    this.amtArr = amtAttr;
    this.pauseArr = [];
    this.timeDiff = 1;
    this.checkStatus();
  },
  abort: function(){
    this.init();
  },
  action: function(){
    var self = this,
      amtArr = self.amtArr,
      td = self.timeDiff,
      el,
      am,
      hl,
      cb,
      src,
      st,
      tar,
      tem,
      pt,
      done,
      len,
      i,
      v;
    self.stamp = +new Date();

    len = amtArr.length;
    while(len--){
      v = amtArr[len];
      el = v[0];
      am = v[1];
      hl = v[2];
      cb = v[3];
      stime = v[4];
      pt = (self.stamp - stime);
      done = (hl <= pt);
      el.matrix = [1, 0, 0, 1, 0, 0];
      forEach(am, function(val, k){
        src = val.src;
        st = val.st;
        tar = val.tar;
        if(k.search(/scale|rotate|translate|transform/) != -1){
          if(done){
            el[k].apply(el, tar);
          }else{
            el[k].apply(el, src);
          }
          i = src.length;
          while(i--){
            src[i] += (st[i] * td);
          }
        }else if(k.search(/fillStyle|strokeStyle|shadowColor/) != -1){
          //Todo: if(done) ....
          tem = {};
          tem[k] = rgb2hex.apply(this, src);
          el.attr(tem);
          i = src.length;
          while(i--){
            src[i] += (st[i] * td);
          }
        }else{
          tem = {};
          tem[k] = src;
          el.attr(tem);
          val.src += (st * td);
        }
        el.paper.render();
      });
      if(done){
        amtArr.splice(len, 1);
        cb.call(el);
      }
    }

    SI.cancelAnimationFrame(self.timer);
    self.timer = SI.requestAnimationFrame(function(){
      self.timeDiff = (+new Date() - self.stamp);
      self.checkStatus();
    });
  },
  checkStatus: function(){
    var self = this;
    if(self.amtArr.length !== 0){
      self.action();
    }else{
      self.init();
    }
  }
});

//主动画控制器
var sanimator = new Animator();
