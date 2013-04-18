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
    font: '12px Arial',
    textBaseline: 'middle',
    textAlign: 'center',
    globalAlpha: 1
  },
  sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan,
  webColors = {
    aqua: '#0ff',
    black: '#000',
    blue: '#00f',
    fuchsia: '#f0f',
    gray: '#808080',
    green: '#008000',
    lime: '#0f0',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    purple: '#800080',
    red: '#f00',
    silver: '#c0c0c0',
    teal: '#008080',
    white: '#fff',
    yellow: '#ff0'
  };

function getUniqId(){
  return _uniqId++;
}

function deg2rad(d){
  return d * PI / 180;
}

function rad2deg(r){
  return r * 180 / PI;
}

// hex2num('#369') => [51, 102, 153]
function hex2num(v){
  if(v.search('#') == -1) v = webColors[v];
  if(v.length == 4){
    v = v.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
      return [parseInt(r+r, 16), parseInt(g+g, 16), parseInt(b+b, 16)];
    }).split(',');
  }else{
    v = v.replace(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, function(m, r, g, b){
      return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
    }).split(',');
  }
  v[0] = +v[0];
  v[1] = +v[1];
  v[2] = +v[2];
  return v;
}

// rgb2hex(51,102,153); => '#369'
function rgb2hex(r, g, b) {
  return '#' + fix(r) + fix(g) + fix(b);
  function fix(v) {
    if(v <= 16){
      v = '0' + (~~v).toString(16);
    }else{
      v = (~~v).toString(16);
    }
    return v;
  }
}