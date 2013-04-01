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
  return v.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
}
function num2hex(v){

}

