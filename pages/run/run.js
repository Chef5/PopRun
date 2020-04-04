//index.js
//获取应用实例
const app = getApp()
var point = [];
var speedArr=[]
var that2;
var count=0;
Page({
  data: {
    longitude: 116.4965075,
    latitude: 40.006103,
    speed: "--",
    accuracy: 0,
    indicatorDots: false,
    autoplay: true,
    polyLine: [],
    interval: 5000,
    duration: 500,
    showMain: true,
    showRes: false,
    text: ["好好学习，天天向上~", "饭后走一走，活到九十九~", "乔碧萝让你加强锻炼！"],
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
    count: 1,
    secondes: "00",
    minutes: "00",
    hours: "00",
    timer:null,
    pause:"暂停",
    preurl:"",
  },
  //事件处理函数
  bindViewTap: function() {},
  // 定位经纬度
  onLoad: function() {
    var that = this
    wx.showLoading({
      title: "定位中",
      mask: true
    })
    wx.getLocation({
      type: 'gcj02',
      altitude: true, //高精度定位
      //定位成功，更新定位结果
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        that.setData({
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
      },
      //定位失败回调
      fail: function() {
        wx.showToast({
          title: "定位失败",
          icon: "none"
        })
      },

      complete: function() {
        //隐藏定位中信息进度
        wx.hideLoading()
      }

    })
  },
  // 排行榜栏显示隐藏
  toggleRight1: function() {
    this.setData({
      showRight1: !this.data.showRight1
    });
  },
  // 周榜月榜切换
  handleChange: function({
    detail
  }) {
    this.setData({
      current: detail.key
    });
  },
  // 秒表计时器
getTime: function() {
  count++;
  var s = this.showNum(count % 60);
  var m = this.showNum(parseInt(count / 60) % 60);
  var h = this.showNum(parseInt(count / 60 / 60));
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
    console.log(point)
    this.setData({
      polyLine: [{
        points: point,
        color: '#99FF00',
        width: 4,
      }]
    });
    // 平均速度
    console.log(speedArr);
    speedArr.forEach(e=>{
      var sp=0;
      sp+=sp;
      sp=sp/speedArr.length;
      sp=sp.toFixed(2)
      return sp;
    })
  },
// 跑步获取经纬度
getlocation:function () {
  var that=this;
    wx.getLocation({
      type: 'gcj02',
      altitude: true,
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed;
        speed = speed.toFixed(2)
        var accuracy = res.accuracy
        that.setData({
          longitude: longitude,
          latitude: latitude,
          speed: speed,
          accuracy: accuracy
        })
      
        point.push({
          latitude: res.latitude,
          longitude: res.longitude
        });
        speedArr.push(speed);
        // console.log(point);
      }
    });
  },
// 开始运动按钮
startRun: function() {
  let that=this;
  this.setData({
    showMain: false
  })
  this.data.timer = setInterval(that.repeat, 1000);
},
repeat: function () {
    this.getlocation();
    this.getTime();
},
// 暂停运动
pauseRun:function() {
  let that = this;
  console.log(this.data.pause)
  if(this.data.pause=="暂停"){
    clearInterval(this.data.timer);
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
  this.setData({
    showMain: true,
    showRes: true,
  })
  clearInterval(this.data.timer);
  count=0;
  this.setData({
    secondes: "00",
    minutes: "00",
    hours: "00"
  })
  this.drawline();
},
// 返回主页
goBack: function() {
  this.setData({
    showRes: false,
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