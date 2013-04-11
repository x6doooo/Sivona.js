SI.Paper = Paper;
SI.version = Version;
SI.animationController = sanimator;
SI.getEventPosition = getEventPosition;
/*!

  @Name: SI.parsePath(d)
  @Info: 解析SVG路径描述，转为Canvas绘制用的命令和点的数组
  @Params:
  - d {string} svg路径字符串
  @Return:
  - {array}
  @Usage:
  arr = SI.parsePath('M10,10L10,10C-10-10...');
  //arr = [{type:'moveTo',points:[10,10]}, {type:'lineTo',points:[10,10]}...]

*/
SI.parsePath = Cpath.parse;
window.SIVONA = window.SI = SI;
