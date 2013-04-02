/*
 matrix、attributes
 TODO:？？？ path  转换path描述？？？
 Todo: 多个canvas同时执行动画 test
 Todo: 中断动画 test

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
var Animator = new Class;
Animator.include({
  init: function(){
    this.amtArr = [];
    this.step = 10;
    this.timer = null;
  },
  add: function(el, arr){

    //arr = [am, hl, cb]
    var self = this,
      amtArr = self.amtArr,
      oldStatus = amtArr.length,
      st = self.step,
      cfg = el.cfg,
      am = arr[0],
      hl = to_i((arr[1]||500)/st),
      cb = arr[2];

    forEach(am, function(v, k){
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
        default:
          if(v.indexOf('#') != -1){
            //Todo： 颜色处理 本来有颜色 貌似没获取到
            cfg[k] = hex2num(cfg[k] || '#fff');
            v = hex2num(v);
            am[k] = {
              src: cfg[k],
              st: [(v[0] - cfg[k][0])/hl, (v[1]-cfg[k][1])/hl, (v[2]-cfg[k][2])/hl],
              tar: v
            };
            console.log(am[k]);
          }else{
            cfg[k] = cfg[k] || 0;
            am[k] = {
              src: cfg[k],
              st: (v-cfg[k])/hl,
              tar: v
            };
          }
          break;
      }
    });
    amtArr.push([el, am, hl, cb]);

    if(oldStatus == 0){ //不为0则有action在执行
      self.action();
    }
  },
  abort: function(){
    var self = this;
    clearTimeout(self.timer);
    self.amtArr = [];
  },
  action: function(){
    var self = this,
      amtArr = self.amtArr,
      el,
      am,
      hl,
      cb,
      src,
      st,
      tar,
      tem;

    amtArr.forEach(function(v, i, a){
      el = v[0];
      am = v[1];
      hl = v[2];
      cb = v[3];
      hl -= 1;
      v[2] = hl;
      el.matrix = [1, 0, 0, 1, 0, 0];
      forEach(am, function(val, k){
        src = val.src;
        st = val.st;
        tar = val.tar;
        if(k.search(/scale|rotate|translate|transform/) != -1){
          if(hl == 0){
            el[k].apply(el, tar);
          }else{
            el[k].apply(el, src);
          }
          src.forEach(function(o, n, aa){
            aa[n] += st[n];
          });
        }else if(k.search(/fillStyle|strokeStyle|shadowColor/) != -1){
          tem = {};
          tem[k] = rgb2hex.apply(this, src);
          el.attr(tem);
          src.forEach(function(o, n, aa){
            aa[n] += st[n]
          });
        }else{
          tem = {};
          tem[k] = src;
          el.attr(tem);
          val.src += st;
        }
      });
      if(hl == 0){
        cb();
        amtArr.splice(i, 1);
      }
    });
    self.timer = setTimeout(function(){
      self.checkStatus();
    }, self.step);
  },
  checkStatus: function(){
    var self = this;
    if(self.amtArr.length !== 0){
      self.action();
    }
  }
});

//主动画控制器
var Sanimator = new Animator();