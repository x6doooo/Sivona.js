// TODO: Animation
// TODO: Instance的位置

/*
    增加第一个动画，即启动动画计时器
    setTimeout，执行一次后，看是否还有，
    动画控制器
    增加动画项目：元素、状态目标、当前状态
    删除动画项目
    动画执行控制器

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

    =>

    el.animate({
      scale:{
        src: [x, y],
        target: [x, y],
        step: [x, y]
      },
      opacity: {
        src: []
      }
    });


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
      hl = to_i(arr[1]/st),
      cb = arr[2];
    forEach(am, function(v, k){
      switch(k){
        case 'translate':
          am[k] = {
            st: [v[0]/hl, v[1]/hl],
            src: [0, 0]
          };
          break;
        case 'rotate':
          v[1]= v[1] || 0;
          v[2] = v[2] || 0;
          am[k] = {
            st: [v[0]/hl, 0, 0],
            src: [0, v[1], v[2]]
          };
          break;
        case 'scale':
          v[1] = v[1] || v[0];
          v[2] = v[2] || 0;
          v[3] = v[3] || 0;
          am[k] = {
            st: [ v[0]/hl, v[1]/hl, 0, 0 ],
            src: [0, 0, v[2], v[3]]
          };
          break;
        case 'fillStyle':
          break;
        default:
          cfg[k] = cfg[k] || 0;
          am[k] = {
            src: cfg[k],
            st: (v - cfg[k])/hl
          };
          break;
      }
    });
    amtArr.push([el, am, hl, cb]);

    /*!Private

      Types:

        matrix、attributes

        TODO:？？？ path  转换path描述？？？

     */

    if(oldStatus == 0){ //不为0则有action在执行

      self.action();

    }

  },
  update: function(){


  },
  abort: function(){

    var self = this;

    clearTimeout(self.timer);

    self.amtArr = [];

  },
  action: function(){
    var self = this,
      amtArr = self.amtArr;

    amtArr.forEach(function(v, i, a){

      forEach(am, function(val, k){
        if(k.search(/scale|rotate|translate|transform/) != -1){

          el[k].apply(el, val);

        }else{

          //el[k]

        }
      });

      v[2] -= 1;

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