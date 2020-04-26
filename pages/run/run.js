//index.js
//获取应用实例
const app = getApp();
const format = require("../../utils/util");
import Dialog from '@vant/weapp/dialog/dialog';
import Toast from '@vant/weapp/toast/toast';
let point = [];
let count = 0;
let distanceSum = 0;
let spdMax=0;
let spdMin=0;
let timer = null;
let params = {};

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
  s = s * 6378.137; // EARTH_RADIUS;
  //输出为公里
  s = Math.round(s * 10000) / 10000;
  // s = Number(s.toFixed(2));
  distanceSum += s
  return distanceSum;
}
// 比较最大最小速度
function spdCheck(speed){
    spdMax=speed>spdMax?speed:spdMax;
    spdMin=speed<spdMin?speed:spdMin;
}

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
    active: 0,
    rankArr: [],
    myRank:{},
    secondes: "00",
    minutes: "00",
    hours: "00",
    pause: "暂停",
    distance: "0.00",
    maxSpeed: "--",
    minSpeed: "--",
    avrSpeed: "--",
    heat: "0",
    isShowRankIcon: true,
  
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
    //隐藏定位中信息进度
    wx.hideLoading()
  },
  // 获取随机一言
  getText() {
    let that = this;
    wx.request({
      url: app.config.getHostUrl() + '/api/run/getHitokoto',
      success: (res) => {
        // res.data.data.forEach(e =>  that.data.text.push(e.hitokoto) )
        that.setData({
          text: res.data.data
        })
      },
    })
  },
  // 排行榜栏显示隐藏
  toggleRight1: function() {
    this.setData({
      showRight1: !this.data.showRight1
    });
  },

  // 周榜月榜切换
  onRankChange(event) {
    this.setData({
      active: event.detail.index
    })
    this.getRanking(this.data.active);
  },

  // 获取排行榜并做数据处理
  getRanking(_type) {
    let that = this;
    let user = app.getUser();
    wx.request({
      url: app.config.getHostUrl() + '/api/run/getRanking',
      data: {
        team: user.team,
        type:_type
      },
      success: (res) => {
        this.setData({ rankArr: that.showImg(res.data.data)})
        let rankArr=this.data.rankArr;
        for (let i = 0; i<rankArr.length;i++){
          rankArr[i].avgS = format.formatSpeed(rankArr[i].avgS)
          if (rankArr[i].rid == user.rid) {
            user = rankArr[i]
          }
        }
        this.setData({rankArr, myRank: user})
      },
    })
  },
 
  // 排行榜前三名显示冠亚季图片 
  showImg(rankArr){
    let that=this;
    rankArr.forEach((e,i)=>{
      if(i<=2){
        e.isShowRankIcon=true;
        e.rankImg ="../../imgs/run/"+(i+1)+".png"
      }else{
        e.isShowRankIcon = false;
      }
    })
    return rankArr
  },
  // 秒表计时器
  getTime: function() {
    count++;
    let s = format.formatNumber(count % 60);
    let m = format.formatNumber(parseInt(count / 60) % 60);
    let h = format.formatNumber(parseInt(count / 60 / 60));
    this.setData({
      secondes: s,
      minutes: m,
      hours: h
    })
  },

  // 跑步划线
  drawline: function() {
    this.setData({
      polyLine: [{
        points: point,
        color: '#99FF00',
        width: 4,
      }]
    });
  },

  // 跑步获取经纬度
  getlocation: function() {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位
      //定位成功，更新定位结果
      success: function(res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let speed=res.speed;
        const speedArr_i = speed <= 0 ? 0 : speed;
        spdCheck(speedArr_i);
        // speed=speed*3.6;
        let accuracy = res.accuracy
        that.setData({
          speed: format.formatSpeed(speed),
          latitude: latitude,
          longitude: longitude
        })
        point.push({
          latitude: latitude,
          longitude: longitude,
        });
        // console.log(speedArr)
      },
      //定位失败回调
      fail: function() {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },
    })
  },

  // 显示路程
  getDistance: function() {
    if (point.length <= 1) {
      return "0.00";
    } else {
      return distance(point[point.length - 2].latitude, point[point.length - 2].longitude, point[point.length - 1].latitude, point[point.length - 1].longitude);
    }
  },
  // 倒计时显示
  countDown() {
    this.setData({
      showMain: false
    })
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
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
  startInterface() {
    let user = app.getUser();
    if (!user) {
      user = wx.getStorageSync('user');
      if (!user) return;
    }
    wx.request({
      url: app.config.getHostUrl() + '/api/run/doStart',
      data: {
        rid: user.rid,
        time_start: format.formatTime(new Date()),
        latitude_start: point[0].latitude,
        longitude_start: point[0].longitude
      },
      header: {
        'Content-Type': 'application/json'
      },
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
    let that = this;
    timer = setInterval(that.repeat, 1000);
  },
  repeat: function() {
    let that = this;
    this.getlocation();
    this.getTime();
    this.setData({
      distance: (+that.getDistance()).toFixed(2),
    })
  },
  // 暂停运动
  pauseRun: function() {
    let that = this;
    if (this.data.pause == "暂停") {
      clearInterval(timer);
      timer = null,
        this.setData({
          pause: "继续",
        })
    } else {
      this.startRun();
      this.setData({
        pause: "暂停",
      })
    }

  },
  // 结束运动按钮
  endRun: function() {
    clearInterval(timer);
    timer = null;
    let spdAvr = 0;
    let that = this;
    const endTime = format.formatTime(new Date());
    const runTime = Math.ceil(count / 60);
    const endLat = point[point.length - 1].latitude
    const endLog = point[point.length - 1].longitude
    this.setData({
      showMain: true,
      showRes: true,
    })
    // 判断跑步路程是否大于300m,若小于则不进行保存
    if (this.data.distance <= 0.03) {
      // 获取时间
      Dialog.alert({
        title: '提示',
        message: '当前运动距离太短，不会进行保存哦~'
      }).then(() => {
        // on close
        that.goBack();
      });
    }
    spdAvr = distanceSum ? (distanceSum*1000) / count : 0;
    
    this.setData({
      distance: (+that.getDistance()).toFixed(2),
      avrSpeed: format.formatSpeed(spdAvr),
      maxSpeed: spdMax,
      minSpeed: spdMin,
      // 热量 =体重（kg）* 距离（km）* 运动系数（k） 跑步：k=1.036
      heat: parseInt(55 * that.data.distance * 1.036),
    })
    this.drawline();
    params.distance = that.data.distance
    params.calorie = that.data.heat
    params.speed_top = that.data.maxSpeed
    params.speed_low = that.data.minSpeed
    params.speed = spdAvr
    params.time_end = endTime
    params.time_run = runTime
    params.latitude_end = endLat
    params.longitude_end = endLog
    wx.request({
      url: app.config.getHostUrl() + '/api/run/doEnd',
      data: params,
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        if (result.data.isSuccess) {
          // console.log("success", result.data)
        }
      },
    });
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
    spdMin=0;
    spdMax=0;
    params = {};
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
  shareRes: function() {
    // this.drawCanvas();//调用绘制函数
    // wx.showLoading({
    //   title: '努力生成中...'
    // });
  },

})