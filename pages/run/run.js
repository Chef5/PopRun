//index.js
//获取应用实例
const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';

let point = [];
let count=0;
let distanceSum = 0;
let speedArr=[];
let timer=null;
let params ={};

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
//   let sum = 0, min = 0, max = 0, n = 1, avrSpeed=0;
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
//   avrSpeed=sum/n;
//   return { avrSpeed: avrSpeed, min:min, max:max};
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
    // showWeek:true,
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
    avrSpeed:"--",
    heat:"0",
    isShowImg:true,
  },
  //事件处理函数
  bindViewTap: function() {},
  onLoad: function() {
    let that = this
    wx.showLoading({
      title: "定位中",
      mask: true
    });
  // 定位经纬度

    this.getlocation();
    this.getText();
    this.getWeekRank();
    //隐藏定位中信息进度
    wx.hideLoading()
  },
  // 获取随机一言
  getText(){
    let that=this;
    wx.request({
      url: app.config.getHostUrl() + '/api/run/getHitokoto',
      success: (res) => {
        // res.data.data.forEach(e =>  that.data.text.push(e.hitokoto) )
        that.setData({
          text:res.data.data
        })
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
      current: detail.key,
      // showWeek: detail.key
    });
  },
  // 获取周榜
  getWeekRank(){
    let that = this;
    let user=app.getUser();
    wx.request({
      url: app.config.getHostUrl() + '/api/run/getWeekrank',
      data:{team:user.team},
      success: (res) => {
        // res.data.data.forEach(e =>  that.data.text.push(e.hitokoto) )
        console.log(res.data)
      },
    })
  },
  // 获取月榜
  getMonthRank(){
    let that = this;
    let user=app.getUser();

    wx.request({
      url: app.config.getHostUrl() + '/api/run/getMonthrank',
      data: { team: user.team },
      success: (res) => {
        // res.data.data.forEach(e =>  that.data.text.push(e.hitokoto) )
        console.log(res.data)
      },
    })
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
      let speed = res.speed;
      // 换算为km/h
      // speed=speed*3.6;
      let accuracy = res.accuracy
      that.setData({
        speed: speed<=0?"--":that.speedNum(speed),
        latitude:latitude,
        longitude:longitude
      })
      point.push({
        latitude: latitude,
        longitude: longitude,
      });
      const speedArr_i=speed<=0?0:speed;
      speedArr.push(speedArr_i)
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
// 速度单位换算m/s=>min s/km
speedNum(speed){
  //s/km
  speed=1000/speed;
  let s = this.showNum(parseInt(speed % 60));
  let m = this.showNum(parseInt(speed / 60) % 60);
  return m+"′"+s+"″";
},
// 显示路程
getDistance:function(){
  if(point.length<=1){
    return "0.00";
  }else{
    return distance(point[point.length - 2].latitude, point[point.length - 2].longitude, point[point.length - 1].latitude, point[point.length - 1].longitude);
  }
},
// 倒计时显示
countDown(){
  this.setData({
    showMain: false
  })
  const toast = Toast.loading({
    duration: 0,       // 持续展示 toast
    forbidClick: true, // 禁用背景点击
    message: '倒计时 3 秒',
    loadingType: 'spinner',
    selector: '#custom-selector'
  });

  let second = 3;
  const timer = setInterval(() => {
    second--;
    if (second) {
      toast.setData({
        message: `倒计时 ${second} 秒`
      });
    } else {
      clearInterval(timer);
      Toast.clear();
      this.startInterface();
      this.startRun();
    }
  }, 1000);
},
// 调用开始接口
startInterface(){
  let user = app.getUser();
  if (!user) {
    user = wx.getStorageSync('user');
    if (!user) return;
  }
  wx.request({
    url: app.config.getHostUrl() + '/api/run/doStart',
    data: {
      rid: user.rid,
      time_start: this.formatDate(new Date()),
      latitude_start: point[0].latitude,
      longitude_start: point[0].longitude
    },
    header: { 'Content-Type': 'application/json' },
    method: 'POST',
    success: (result) => {
      if (result.data.isSuccess) {
        params = result.data.data
      }
    },
  });
},
// 开始运动
startRun: function() {
  let that=this;
 
  timer = setInterval(that.repeat, 1000);
},
repeat: function () {
  let that=this;
  this.getlocation();
  this.getTime();
  this.setData({
    distance: (+that.getDistance()).toFixed(2),
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
  let spdSum=0;
  let spdAvr=0;
  let that=this;
  const endTime =this.formatDate(new Date());
  const runTime = Math.ceil(count/60);
  const endLat = point[point.length - 1].latitude
  const endLog = point[point.length - 1].longitude
  this.setData({
    showMain: true,
    showRes: true,
  })
  // 判断跑步路程是否大于300m,若小于则不进行保存
  if(this.data.distance<=0.03){
    // 获取时间
    Dialog.alert({
      title: '提示',
      message: '当前运动距离太短，不会进行保存哦~'
    }).then(() => {
      // on close
      that.goBack();
    });
  } 
    speedArr.forEach(e=>{
        spdSum += e;
    })
    // spdSum?spdSum:1;
    spdAvr = spdSum ? this.speedNum((spdSum / speedArr.length)):"--"
    this.setData({
      distance: (+that.getDistance()).toFixed(2),
      avrSpeed: spdAvr,
      maxSpeed: Math.max(...speedArr)?that.speedNum(Math.max(...speedArr)):"--",
      minSpeed: Math.min(...speedArr)?that.speedNum(Math.min(...speedArr)):"--",
  // 热量 =体重（kg）* 距离（km）* 运动系数（k） 跑步：k=1.036
      heat: parseInt(55 * that.data.distance * 1.036),
    })
    this.drawline();
    params.distance= that.data.distance
    params.calorie= that.data.heat
    params.speed_top= that.data.maxSpeed
    params.speed_low= that.data.minSpeed
    params.speed= that.data.avrSpeed
    params.time_end= endTime
    params.time_run= runTime
    params.latitude_end= endLat
    params.longitude_end= endLog
    wx.request({
      url: app.config.getHostUrl() + '/api/run/doEnd',
      data:params,
      header: { 'Content-Type': 'application/json' },
      method: 'POST',
      success: (result) => {
        if (result.data.isSuccess) {
          // console.log("success" , result.data)
        }
      },
    });
},
//获取当前日期，以“-”连接
formatDate (date) {
  const that =this;
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(that.showNum).join('-') + ' ' + [hour, minute, second].map(that.showNum).join(':')
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
  params={};
  this.getlocation();
  this.setData({
    showRes: false,
    secondes: "00",
    minutes: "00",
    hours: "00",
    distance: "0.00",
    maxSpeed: "--",
    minSpeed: "--",
    avrSpeed: "--",
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