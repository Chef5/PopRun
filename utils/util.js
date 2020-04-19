const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 速度单位换算m/s=>min s/km
const formatSpeed = speed=>{
  //s/km
  if (speed <= 0) {
    return "--"
  } else {
    speed = 1000 / speed;
    let s = formatNumber(parseInt(speed % 60));
    let m = formatNumber(parseInt(speed / 60) % 60);
    return m + "′" + s + "″";
  }
}
module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatSpeed: formatSpeed
}
