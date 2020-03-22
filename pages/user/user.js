// pages/user/user.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},  //用户数据
        medals: [
            {
                "linkid": 1,
                "rid": 7,
                "meid": 1,
                "created_at": "2020-03-21 17:22:52",
                "updated_at": "2020-03-21 17:22:55",
                "mkey": "star_1_act",
                "type": 0,
                "name": "1星跑者",
                "desc": "单次运动里程达5km",
                "img": "http://127.0.0.1:8000/resources/medals/star_1_act.png"
              },
              {
                "linkid": 3,
                "rid": 7,
                "meid": 10,
                "created_at": "2020-03-21 17:23:54",
                "updated_at": "2020-03-21 17:23:58",
                "mkey": "2020_02",
                "type": 0,
                "name": "2020.02",
                "desc": "您2020.02累计跑步7次，授予您2020.02月活跃勋章",
                "img": "http://127.0.0.1:8000/resources/medals/2020_02.png"
              },
              {
                "linkid": 4,
                "rid": 7,
                "meid": 11,
                "created_at": "2020-03-21 17:24:04",
                "updated_at": "2020-03-21 17:24:06",
                "mkey": "2020_03",
                "type": 0,
                "name": "2020.03",
                "desc": "您2020.03累计跑步7次，授予您2020.03月活跃勋章",
                "img": "http://127.0.0.1:8000/resources/medals/2020_03.png"
              },
              {
                "linkid": 5,
                "rid": 7,
                "meid": 21,
                "created_at": "2020-03-21 17:24:41",
                "updated_at": "2020-03-21 17:24:45",
                "mkey": "2020_a",
                "type": 0,
                "name": "Spring2020",
                "desc": "您2020年春季累计跑步45次，授予您Spring2020活跃勋章",
                "img": "http://127.0.0.1:8000/resources/medals/2020_a.png"
              },
              {
                "linkid": 6,
                "rid": 7,
                "meid": 25,
                "created_at": "2020-03-21 17:24:53",
                "updated_at": "2020-03-21 17:24:56",
                "mkey": "rank_a",
                "type": 1,
                "name": "青铜",
                "desc": "您在上月累计里程在校区前100名，授予您一枚青铜勋章",
                "img": "http://127.0.0.1:8000/resources/medals/rank_a.png"
              },
              {
                "linkid": 7,
                "rid": 7,
                "meid": 25,
                "created_at": "2020-03-21 17:27:51",
                "updated_at": "2020-03-21 17:27:53",
                "mkey": "rank_a",
                "type": 1,
                "name": "青铜",
                "desc": "您在上月累计里程在校区前100名，授予您一枚青铜勋章",
                "img": "http://127.0.0.1:8000/resources/medals/rank_a.png"
              }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        // 初始化用户数据
        let user = that.getUserInfoFromLocal();
        if(user){
            that.updateCurrentUser(user);//本地有数据
        }else{
            //从服务器获取：判断是否注册、本地缓存
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 注册并获取用户信息
     */
    userReg: function(){
        app.getUserInfo();
        this.setData({
            userinfo: wx.getStorageSync('user')
        })
    },
    /**
     * 获取用户信息：在线获取，不依赖本地
     */
    getUserInfoOnline: function(){
        let that = this;
        app.getOpenid().then(
            (openid)=>{
                wx.request({
                    url: app.config.getHostUrl()+'/api/user/getUser',
                    method: 'post',
                    data: {
                        openid: openid
                    },
                    success: (res)=>{
                        that.setData({
                            userinfo: JSON.stringify(res.data)
                        });
                        wx.setStorageSync('user', JSON.stringify(res.data.data))
                    }
                })
            }
        ).catch(
            (err)=>{
                console.log(err)
            }
        )
    },

    // 从本地获取用户数据
    getUserInfoFromLocal: function () {
        let user = wx.getStorageSync('user');
        if(user){
            return JSON.parse(user);
        }else return false;
    },

    // 更新用户显示数据
    updateCurrentUser: function(data){
        if(data){
            this.setData({user: data});
        }
    }

})