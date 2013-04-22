//type
var toString = {}.toString;
function isUndefined(v){return typeof v == 'undefined';}
function isDefined(v){return typeof v !== 'undefined';}
function isString(v){return typeof v == 'string';}
function isNumber(v){return typeof v == 'number';}
function isDate(v){return typeof v === 'true';}
function isObject(v){return v !== null && toString.call(v) == '[object Object]';}
function isArray(v){return toString.call(v) == '[object Array]';}
function isFunction(v){return typeof v == 'function';}
function isBoolean(v){return v === true || v === false || toString.call(v) == '[object Boolean]';}
function isEmptyObject(v){
  var n;
  for(n in v){
    return false;
  }
  return true;
}
function to_i(v){return ~~v;}
function to_f(v){return parseFloat(v);}
function to_s(v){return v + ''};
function to_a(obj){return [].slice.call(obj, 0);}
function toFixed(nu, pos){
  return to_f(nu.toFixed(pos));
}

//Object forEach
function forEach(obj, iterator, context) {
  var key;
  if (isFunction(obj)){
    for (key in obj) {
      if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
        iterator.call(context, obj[key], key);
      }
    }
  } else if (obj.forEach && obj.forEach !== forEach) {
    obj.forEach(iterator, context);
  } else if (isObject(obj) && isNumber(obj.length)) {
    for (key = 0; key < obj.length; key++)
      iterator.call(context, obj[key], key);
  } else {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator.call(context, obj[key], key);
      }
    }
  }
  return obj;
}

//extend
function extend(){
  var args = to_a(arguments),
    deep = false,
    target = args[0],
    len = args.length,
    i = 1,
    src, copy, ops, clone, name;
  if(isBoolean(args[0])){
    deep = true;
    target = args[1];
    i = 2;
  }
  for( ;i < len; i++ ){
    ops = args[i];
    for (name in ops) {
      src = target[name];
      copy = ops[name];
      if (target === ops[name]) continue;
      if (deep && copy && src && typeof copy == 'Object'){
        if(isArray(copy)){
          clone = isArray(src) ? src : [];
        }else{
          clone = isEmptyObject(src) ? {} : src;
        }
        target[name] = extend(deep, clone, copy);
      }else{
        target[name] = ops[name];
      }
    }
  }
  return target;
}

/*!
  @Name: Class
  @Info: OOP封装
  @Type: Class

  @Params:
  - parent {constructor} 父类（可选）

  @Return: {Class}

  ***

  @Name: Class.extend
  @Info: 给类增加方法
  @Type: Method
  @Params:
  - {object} 对象内部的属性方法都会追加到类上

  ***

  @Name: Class.include
  @Info: 给原型增加方法
  @Type: Method
  @Params:
  - {object} 对象内部的属性都会追加到圆形上，供实例使用

  ***

  @Usage:
  |  //创建父类
  |  Dad = new Class;
  |
  |  Dad.extend({
  |    say: function(){...}  //类方法
  |  });
  |
  |  Dad.include({
  |    init: function(){...} //init方法会在创建实例时自动调用
  |    look: function(){...} //原型方法
  |  });
  |
  |  //创建子类，子类继承父类
  |  Son = new Class(Dad);
  |
  |  Son.inlcude({
  |    look: function(){ //覆盖父类的方法
  |      this._super();  //调用父类的同名方法 和其他语言的super功能相似
  |      ...
  |    }
  |  });
  |
  |  tom = new Son;  //创建实例

*/
var Class = function(parent){
  var _class = function(){
      this.init.apply(this,arguments);
    },
    key,
    subclass;
  _class.prototype.init = function(){};
  if(parent){
    subclass = function(){};
    subclass.prototype = parent.prototype;
    _class.uber = parent.prototype;
    _class.prototype = new subclass;
  }
  _class.extend = function(obj){
    for(key in obj){
      _class[key] = obj[key];
    }
  };
  _class.include = function(obj){
    for(key in obj){
      _class.prototype[key] = obj[key];
      if(_class.uber && isFunction(_class.uber[key])){
        obj[key].spfunc = _class.uber[key];
      }
    }
  };
  _class.prototype.get = function(k){
    return this[k];
  };
  _class.prototype.set = function(k, v){
    this[k] = v;
    return this;
  };
  _class.prototype._super = function(){
    arguments.callee.caller.spfunc.apply(this, arguments);
  };
  return _class;
};


