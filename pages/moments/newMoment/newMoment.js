// pages/moments/newMoment/newMoment.js
import Notify from '@vant/weapp/notify/notify';
const app = getApp();
let prevPage = {};
const chooseLocation = requirePlugin('chooseLocation');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "",
    fileList: [],
    address: "位置"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let pages = getCurrentPages();
    prevPage = pages[pages.length - 2];
  },
  /**
   * 生命周期函数--监听页面显示
   */
  // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location) {
      this.setData({
        address: location.address
      })
    }
  },
  chooseLocation() {
    let that = this;
    const key = 'SJOBZ-JFFAP-MJDDW-VRRV7-OKAYE-YOBOJ'; //使用在腾讯位置服务申请的key
    const referer = '跑鸭'; //调用插件的app的名称
    wx.getLocation({
      type: 'gcj02',
      //定位成功，更新定位结果
      success: function(res) {
        const location = JSON.stringify({
          latitude: res.latitude,
          longitude: res.longitude
        });
        that.setData({
          tude: res
        })
        const category = '发布位置';
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
        });
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //清空发布页面数据
    this.setData({
      // text: "",
      // fileList: [],
      address: "位置",
      tude: null
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 发布动态
   */
  onPublish: function() {
    let that = this;
    const {
      fileList = []
    } = that.data;
    fileList.forEach(element => {
      delete element.url;
    });
    if (fileList.length == 0 && that.data.text == "") {
      Notify({
        type: 'danger',
        message: "文字或者图片，至少需要一样"
      });
      return;
    }
    let user = app.getUser();
    if (!user) {
      user = wx.getStorageSync('user');
      if (!user) return;
    }
    wx.request({
      url: app.config.getHostUrl() + '/api/moments/doMoment',
      data: {
        rid: user.rid,
        text: that.data.text,
        imgs: fileList,
        location: that.data.address != '位置' ? that.data.address : null,
        latitude: that.data.address != '位置' && that.data.tude != null  ? that.data.tude.latitude : null,
        longitude: that.data.address != '位置' && that.data.tude != null ? that.data.tude.longitude : null,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (result) => {
        if (result.data.isSuccess) {
          Notify({
            type: 'success',
            message: result.data.msg
          });
          //清空发布页面数据
          that.setData({
            text: "",
            img: [],
            address: "位置",
            tude: null
          })
          //刷新上层页面
          let moments = [];
          prevPage.setData({
            moments
          });
          prevPage.refreshMoments();
          setTimeout(function() {
            wx.navigateBack();
          }, 1200);
        } else {
          Notify({
            type: 'danger',
            message: result.data.msg
          });
        }
      },
      fail: (res) => {
        Notify({
          type: 'danger',
          message: "123"
        });
      },
      complete: () => {}
    });
  },

  /**
   * 
   * @param {*} event 
   */
  onInput: function(event) {
    this.setData({
      text: event.detail.value
    });
  },

  /**
   * 添加图片
   * 遗留：不能保证上传完成的顺序
   * @param {*} file 
   */
  onReadfile: function(event) {
    let that = this;
    const {
      file
    } = event.detail;
    if (file.length > 0) {
      file.forEach((item) => {
        wx.uploadFile({
          url: app.config.getHostUrl() + '/api/main/uploadImg',
          filePath: item.path,
          name: 'img',
          success(res) {
            let rd = JSON.parse(res.data);
            const {
              fileList = []
            } = that.data;
            fileList.push({ ...rd.data,
              url: rd.data.thumbnail
            });
            that.setData({
              fileList
            });
          }
        });
      })
    }
  },

  /**
   * 图片删除
   * @param {*} event
   */
  onDeleteImg: function(event) {
    const {
      fileList = []
    } = this.data;
    fileList.splice(event.detail.index, 1);
    this.setData({
      fileList
    });
  }
})