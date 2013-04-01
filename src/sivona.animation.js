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

    //translate
    el.animate('scale', x, y);
    el.animate('rotate', a, x, y);
    el.animate('translate', x, y);
    el.animate('transform', a, b, c, d, e, f);

    //attr
    el.animate('opacity', value);

    //group
    el.animate({
      scale: [x, y],
      rotate: [a, x, y],
      opacity: value
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
  add: function(arr){

    var self = this,
      amtArr = self.amtArr,
      oldStatus = amtArr.length;

    /*!Private

      constructor

      Types:

        matrix、attributes

        TODO: pass value \ step value \ target value

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
    var self = this;

    /*!Private

       update all els status

     */

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
