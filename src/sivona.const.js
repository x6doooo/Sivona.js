var PI = Math.PI,
  abs = Math.abs,
  random = Math.random,
  mmax = Math.max,
  mmin = Math.min,
  defaultCfg = {
    fillStyle: '#ccc',
    strokeStyle: '#000',
    lineWidth: 1,
    shadowColor: '#fff',
    shadowBlur: 0,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 0,
    font: '12px',
    textBaseline: 'middle',
    textAlign: 'center'
  },
  sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan;

function deg2rad(d){
  return d * PI / 180;
}

function rad2deg(r){
  return r * 180 / PI;
}

// Todo 颜色转换
function rgba2hex(){}

// Todo Hex to number
function hex2num(v){
  var arr = v.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }).split(',');
  arr.forEach(function(v, i, a){
    a[i] = to_i(v);
  });
  return arr;
}
function num2hex(v){}

//hex1 = rgb2hex('188,120,119');
function rgb2hex(r, g, b) {
  return '#' + rgb2hex_fix(r) + rgb2hex_fix(g) + rgb2hex_fix(b);
}

function rgb2hex_fix(v) {
  if(v <= 16){
    v = '0' + (~~v).toString(16);
  }else{
    v = (~~v).toString(16);
  }
  return v;
}

