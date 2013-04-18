var Version = "0.0.6",
  /*!
    @Name: SI
    @Info: Sivona.js的命名空间，以及新画布的构造函数
    @Type: Namespace & Method
    @Params:
    - id {string} 画布插入位置
    - w {number} 画布宽度（可选 默认为浏览器窗口宽度）
    - h {number} 画布高度（可选 默认为浏览器窗口高度）
    - t {number} 画布位置top值
    - l {number} 画布位置left值
    @Return:
    - {instance} Paper对象的实例
    @Usage:
      var paper = SI('div1', 100, 200);
      paper.rect(...);
  */
  SI = function(id, w, h, t, l){
    return new SI.Paper(id, w, h, t, l);
  },
  _uniqId = 0;




