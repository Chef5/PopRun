//index.js
//获取应用实例
const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
let point = [];
let count=0;
let distanceSum = 0;
let speedArr=[];
let timer=null;
//进行经纬度转换为距离的计算
function Rad(d) {
  //经纬度转换成三角函数中度分表形式。
  return d * Math.PI / 180.0;
}
//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function distance(lat1, lng1, lat2, lng2) {
  let radLat1 = Rad(lat1);
  let radLat2 = Rad(lat2);
  let a = radLat1 - radLat2;
  let b = Rad(lng1) - Rad(lng2);
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  //输出为公里
  s = Math.round(s * 10000) / 10000; 
  // s = Number(s.toFixed(2));
  distanceSum+=s
  return distanceSum;
}
//最大最小速度，平均速度
// function speed (speed) {
//   let sum = 0, min = 0, max = 0, n = 1, varSpeed=0;
//   speed=Number(speed);
//   if (speed<temp){
//     max=temp;
//     temp=speed;
//     min = temp;
//   }else{
//     min=temp;
//     temp=speed
//     max=temp;
//   }
//   sum+=speed;
//   n++;
//   varSpeed=sum/n;
//   return { varSpeed: varSpeed, min:min, max:max};
// }
Page({
  data: {
    longitude: "",
    latitude: "",
    speed: "--",
    polyLine: [],
    showMain: true,
    showRes: false,
    text: [],
    showRight1: false,
    current: 'week',
    rankArr: [{
        id: 1,
        name: "lym",
        rankPho: "../../imgs/run/one.png",
        pho: "../../imgs/run/photo.png",
        route: "跑步总程",
        time: "跑步总时长",
        avrSpeed: "平均速度"
      },
      {
        id: 3,
        name: "lym",
        rankPho: "../../imgs/run/two.png",
        pho: "../../imgs/run/photo.png",
        route: "跑步总程",
        time: "跑步总时长",
        avrSpeed: "平均速度"
      },
      {
        id: 2,
        name: "lym",
        rankPho: "../../imgs/run/three.png",
        pho: "../../imgs/run/photo.png",
        route: "跑步总程",
        time: "跑步总时长",
        avrSpeed: "平均速度"
      },
      {
        id: 4,
        name: "lym",
        rankPho: "../../imgs/run/one.png",
        pho: "../../imgs/run/photo.png",
        route: "跑步总程",
        time: "跑步总时长",
        avrSpeed: "平均速度"
      },
      {
        id: 5,
        name: "lym",
        rankPho: "../../imgs/run/one.png",
        pho: "../../imgs/run/photo.png",
        route: "跑步总程",
        time: "跑步总时长",
        avrSpeed: "平均速度"
      },
      {
        id: 6,
        name: "lym",
        rankPho: "../../imgs/run/one.png",
        pho: "../../imgs/run/photo.png",
        route: "跑步总程",
        time: "跑步总时长",
        avrSpeed: "平均速度"
      },
    ],
    secondes: "00",
    minutes: "00",
    hours: "00",
    pause:"暂停",
    distance:"0.00",
    maxSpeed:"--",
    minSpeed:"--",
    varSpeed:"--",
    heat:"0",
    isShowImg:true,
  },
  //事件处理函数
  bindViewTap: function() {},
  // 定位经纬度
  onLoad: function() {
    let that = this
    wx.showLoading({
      title: "定位中",
      mask: true
    });
    this.getlocation();
    this.getText();
    //隐藏定位中信息进度
    wx.hideLoading()
  },
  // 获取随机一言
  getText(){
    let that=this;
    wx.request({
      url: app.config.getHostUrl() + '/api/run/getHitokoto',
      success: (res) => {
          that.setData({
            text: res.data.hitokoto
          });
          console.log(res.data)
      },
    })
  },
  // 排行榜栏显示隐藏
  toggleRight1: function() {
    this.setData({
      showRight1: !this.data.showRight1
    });
    // this.showImg();
  },

  // 周榜月榜切换
  handleChange: function({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  // 排行榜前三名显示冠亚季图片 
  // showImg(){
  //   let that=this;
  //   this.data.rankArr.forEach((e,i)=>{
  //     console.log(e,i)
  //     if(i<=2){
  //       that.setData({
  //         isShowImg:true
  //       })
  //     }else{
  //       that.setData({
  //         isShowImg:false
  //       })
  //     }
  //   })
  // },
  // 秒表计时器
getTime: function() {
  count++;
  let s = this.showNum(count % 60);
  let m = this.showNum(parseInt(count / 60) % 60);
  let h = this.showNum(parseInt(count / 60 / 60));
    this.setData({
      secondes: s,
      minutes: m,
      hours: h
    })
  },
  //封装一个处理单位数字的函数
showNum: function(num) {    
    if (num < 10) {     
      return '0' + num    
    }    
    return num   
}, 
  // 跑步划线
  drawline:function () {
    this.setData({
      polyLine: [{
        points: point,
        color: '#99FF00',
        width: 4,
      }]
    });
  },
  
// 跑步获取经纬度
getlocation:function () {
  let that=this;
  wx.getLocation({
    type: 'gcj02',
    altitude: true, //高精度定位
    //定位成功，更新定位结果
    success: function (res) {
      let latitude = res.latitude
      let longitude = res.longitude
      let speed = res.speed<0?0:res.speed;
      let accuracy = res.accuracy
      that.setData({
        speed: Number(speed.toFixed(2)),
        latitude:latitude,
        longitude:longitude
      })
      point.push({
        latitude: latitude,
        longitude: longitude,
      });
      speedArr.push({speed})
    },
    //定位失败回调
    fail: function () {
      wx.showToast({
        title: "定位失败",
        icon: "none"
      })
    },
  })
},
// 显示路程
getDistance:function(){
  if(point.length<=1){
    return "0.00";
  }else{
    return distance(point[point.length - 2].latitude, point[point.length - 2].longitude, point[point.length - 1].latitude, point[point.length - 1].longitude);
  }
},
//最大最小速度，平均速度

// 开始运动按钮
startRun: function() {
  let that=this;
  this.setData({
    showMain: false
  })
  timer = setInterval(that.repeat, 1000);
},
repeat: function () {
  let that=this;
  this.getlocation();
  this.getTime();
  this.setData({
    distance: (+that.getDistance()).toFixed(2),
    // varSpeed: speed(that.speed),
  })
},
// 暂停运动
pauseRun:function() {
  let that = this;
  if(this.data.pause=="暂停"){
    clearInterval(timer);
    timer=null,
    this.setData({
      pause: "继续",
    })
  }else {
    this.startRun();
    this.setData({
      pause: "暂停",
    })
  }
 
},
// 结束运动按钮
endRun: function() {
  clearInterval(timer);
  timer=null;
  count = 0;
  let spdSum=0;
  let that=this 
  this.setData({
    showMain: true,
    showRes: true,
  })
  // 判断跑步路程是否大于100m,若小于则不进行保存
  if(this.data.distance<=0.1){
    Dialog.alert({
      title: '提示',
      message: '当前运动距离太短，不会进行保存哦~'
    }).then(() => {
      // on close
      that.goBack();
    });
  } else{
    speedArr.forEach(e=>{
      spdSum+=e;
      return spdSum
    })
    this.setData({
      distance: (+that.getDistance()).toFixed(2),
      varSpeed: parseInt(spdSum / avrSpeed.length),
      maxSpeed: Math.max(...speedArr),
      minSpeed: Math.min(...speedArr),
  // 热量 =体重（kg）* 距离（km）* 运动系数（k） 跑步：k=1.036
      heat: (55 * that.data.distance * 1.036).toFixed(2),
    })
    this.drawline();
  }
},
// 返回主页
goBack: function() {
this.initData();
  
 
},
  // 初始化数据
initData() {
  point = [];
  count = 0;
  distanceSum = 0;
  speedArr = [];
  this.getlocation();
  this.setData({
    showRes: false,
    secondes: "00",
    minutes: "00",
    hours: "00",
    distance: "0.00",
    maxSpeed: "--",
    minSpeed: "--",
    varSpeed: "--",
    heat: "0",
    polyLine: [],
  })
},
// 分享结果
shareRes:function() {
  // this.drawCanvas();//调用绘制函数
  // wx.showLoading({
  //   title: '努力生成中...'
  // });
},

})