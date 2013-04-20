/*!Private
 TODO:？？？ path  转换path描述？？？
 Todo: 多个canvas同时执行动画 test
 Todo: 中断某个元素的动画
 Todo: 增加一组元素的动画，只设置一个CallBack

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
    time2call,
    id;

  for(x = 0, l = vendors.length; x < l && !window.requestAnimationFrame; ++x) {
    SI.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    SI.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!SI.requestAnimationFrame){
    SI.requestAnimationFrame = function(callback) {
      currTime = Date.now();
      time2call = Math.max(0, 16 - (currTime - lastTime));
      id = window.setTimeout(function() { callback(currTime + time2call); },
        time2call);
      lastTime = currTime + time2call;
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
  add: function(el, arr){
    var self = this,
      amtArr = self.amtArr,
      oldStatus = amtArr.length,
      _id = 'ani_' + getUniqId(),
      hl = arr[1]||500,
      cfg = el.cfg,
      am = extend(true, {}, arr[0]),
      cb = arr[2] || function(){},
      k,
      v;

    for(k in am){
      v = am[k];
      switch(k){
        case 'translate':
          am[k] = {
            st: [v[0]/hl, v[1]/hl],
            src: [0, 0],
            tar: v
          };
          break;
        case 'rotate':
          v[1]= v[1] || 0;
          v[2] = v[2] || 0;
          am[k] = {
            st: [v[0]/hl, 0, 0],
            src: [0, v[1], v[2]],
            tar: v
          };
          break;
        case 'scale':
          v[1] = v[1] || v[0];
          v[2] = v[2] || 0;
          v[3] = v[3] || 0;
          am[k] = {
            st: [ (v[0]-1)/hl, (v[1]-1)/hl, 0, 0 ],
            src: [1, 1, v[2], v[3]],
            tar: v
          };
          break;
        case 'fillStyle':
        case 'strokeStyle':
          cfg[k] = hex2num(cfg[k] || '#fff');
          v = hex2num(v);
          am[k] = {
            src: cfg[k],
            st: [(v[0] - cfg[k][0])/hl, (v[1] - cfg[k][1])/hl, (v[2] - cfg[k][2])/hl],
            tar: v
          };
          break;
        default:
          cfg[k] = cfg[k] || 0;
          am[k] = {
            src: cfg[k],
            st: [(v[0] - cfg[k][0])/hl, (v[1] - cfg[k][1])/hl, (v[2] - cfg[k][2])/hl],
            tar: v
          };
          break;
      }
    }

    amtArr.push([el, am, hl, cb, Date.now(), _id]);
    if(oldStatus == 0){ //不为0则有action在执行
      self.action();
    }
    return _id;
  },
  remove: function(_id){
    var amtArr = this.amtArr,
      len = amtArr.length;
    while(len--){
      if(amtArr[5] == _id) amtArr.splice(len, 1);
    }
  },
  pause: function(){
    this.pauseArr = this.amtArr;
    this.pauseStamp = Date.now();
    this.amtArr = [];
  },
  process: function(){
    var amtAttr = this.pauseArr,
      pauseTime = Date.now() - this.pauseStamp,
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
      paper,
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
      v,
      k,
      sTime,
      val,
      selfStamp;

    selfStamp = self.stamp = Date.now();

    len = amtArr.length;

    while(len--){
      v = amtArr[len];
      el = v[0];
      am = v[1];
      hl = v[2];
      cb = v[3];
      sTime = v[4];
      pt = (selfStamp - sTime);
      done = (hl <= pt);
      el.matrix = [1, 0, 0, 1, 0, 0];
      paper = el.paper;

      for(k in am){
        val = am[k];
        src = val.src;
        st = val.st;
        tar = val.tar;
        if(k.search(/scale|rotate|translate|transform/) != -1){
          if(done){
            el[k].apply(el, tar);
          }else{
            i = src.length;
            while(i--){
              src[i] += (st[i] * td);
            }
            el[k].apply(el, src);
          }
        }else if(k.search(/fillStyle|strokeStyle|shadowColor/) != -1){
          tem = {};
          if(done){
            tem[k] = rgb2hex.apply(this, tar);
            el.attr(tem);
          }else{
            i = src.length;
            while(i--){
              src[i] += (st[i] * td);
            }
            tem[k] = rgb2hex.apply(this, src);
            el.attr(tem);
          }
        }else{
          tem = {};
          if(done){
            tem[k] = tar;
            el.attr(tem);
          }else{
            src += (st * td);
            tem[k] = src;
            el.attr(tem);
            val.src = src;
          }
        }

      }
      paper.render();
      if(done){
        amtArr.splice(len, 1);
        cb.call(el);
      }
    }
    SI.cancelAnimationFrame(self.timer);
    self.timer = SI.requestAnimationFrame(function(){
      self.timeDiff = Date.now() - self.stamp;
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
