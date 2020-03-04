// components/w-moments-item/index.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        moment: {
            type: Object,  //数据类型
            value: null    //默认值
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showmore: false,  //显示点赞评论
        showcomment: false,  //显示评论输入框
        placeholder: "",  //评论框placeholder
        input: "",  //输入框内容
        showsingleimg: false, //查看单张图片
        singleimgurl: "", //单张图片地址
        imageWidth: "", //单图时，计算出的长宽比例
        imageHeight: "",
        //动态数据
        data: {
            rid: 0,
            img: "/imgs/default/girl.jpg",
            nickname: "不减十斤不改名不减十斤不改名不减十斤不改名不减十斤不改名",
            info: "包谷子大学",
            pubtime: 1578823269806,
            text: " 这里是文  字\n部分这里是文字部分这里\n是文部分这里是文字部分这里是文字部分这里是文字部分这里是文字部分这里\n是文字部分",
            imgs: [
                {
                    url: "/imgs/default/1.jpg",
                    width: "683",
                    height: "385"
                },
                {
                    url: "/imgs/default/2.jpg",
                    width: "682",
                    height: "378"
                },
                {
                    url: "/imgs/default/3.jpg",
                    width: "368",
                    height: "695"
                },
                {
                    url: "/imgs/default/4.jpg",
                    width: "415",
                    height: "766"
                },
                {
                    url: "/imgs/default/5.jpg",
                    width: "475",
                    height: "765"
                },
                {
                    url: "/imgs/default/6.jpg",
                    width: "608",
                    height: "767"
                },
                {
                    url: "/imgs/default/7.jpg",
                    width: "882",
                    height: "656"
                },
                {
                    url: "/imgs/default/8.jpg",
                    width: "752",
                    height: "753"
                },
                // {
                //     url: "/imgs/default/9.jpg",
                //     width: "746",
                //     height: "746"
                // },
            ],
            likes: [
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/girl.jpg"
                },
                {
                    uid: 1,
                    img: "/imgs/default/boy.jpg"
                },
            ],
            comments: [
                {
                    uid: 1,
                    nickname: "狗叔",
                    comment: "加油！奥利给",
                    pubtime: 1578823279806
                },
                {
                    uid: 1,
                    nickname: "我超速违章我骄傲了吗",
                    comment: "这段评论文字较多这段评论文字较多这段评论文字较多这段评论文字较多这段评论文字较多",
                    pubtime: 1578823289806
                },
                {
                    uid: 1,
                    nickname: "奇怪的人",
                    comment: "我带换行了吗、\n嗯哼？！",
                    pubtime: 1578823299806
                }
            ]
        },
        user: JSON.parse(wx.getStorageSync('user')),  //获取当前用户信息
    },
    /**
     * 生命周期
     */
    attached: function() {
        let that = this;
        // console.log(that.properties.moment);
        that.setData({
            data: that.properties.moment
        });
        that._initData(that.data.data.imgs.thumbnail,that)
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //初始化数据
        _initData: (d,e)=>{
            if(d.length == 1){
                e.setData({
                    imageWidth: Math.floor(d[0].width*420/d[0].height),
                    imageHeight: 420
                })
            }
        },
        // 点击容器
        cancelAll: function(){
            this.setData({
                showmore: false,
                showcomment: false
            })
        },
        // 点击图片，查看大图
        showBigimg: function(e){
            wx.previewImage({
                current: e.currentTarget.dataset.url, // 当前显示图片的http链接
                urls: [e.currentTarget.dataset.url] // 需要预览的图片http链接列表
            })
            // this.setData({
            //     singleimgurl: e.currentTarget.dataset.url,
            //     showsingleimg: true
            // })
        },
        // 关闭大图
        onClose: function(){
            this.setData({
                showsingleimg: false,
                singleimgurl: ""
            })
        },
        // 点击更多：显示点赞和评论
        doShowmore: function(){
            let that = this;
            that.setData({
                showmore: !that.data.showmore
            })
        },
        // 点赞
        doLike: function(){
            let that = this;
            wx.request({
              url: app.config.getHostUrl()+'/api/moments/doLike',
              method: 'post',
              data: {
                 "rid": that.data.user.rid,
                 "moid":that.data.data.moid
              },
              success: (res)=>{
                // console.log(res);
                that.refreshThis(that.data.data.moid, "likes");                                                                                       
              },
              fail: (res)=>{
                console.log(res);
              }
            })
            that.setData({
                showmore: false
            })
        },
        // 打开评论
        doComment: function(e){
            let that = this;
            that.setData({
                showmore: false,
                showcomment: true,
                placeholder: e.currentTarget.dataset.nickname ? "re:" + e.currentTarget.dataset.nickname : "期待神评"
            })
        },
        // 获取输入框的值
        handleInput: function(e){
            this.setData({
                input: e.detail.value
            })
        },
        // 确认评论
        commentConfirm: function(e){
            let that = this;
            if(e.detail.value=="" || that.data.input=="") return;
            let data = that.data.data;
            let placeholder = that.data.placeholder;
            // data.comments.push({
            //     uid: 1,
            //     nickname: "测试号",
            //     comment: placeholder != "期待神评" ? placeholder+": "+that.data.input : that.data.input,
            //     pubtime: 1578823299806
            // });
            wx.request({
                url: app.config.getHostUrl()+'/api/moments/doComment',
                method: 'post',
                data: {
                   "rid": that.data.user.rid,
                   "moid": that.data.data.moid,
                   "comment": placeholder != "期待神评" ? placeholder+": "+that.data.input : that.data.input,
                },
                success: (res)=>{
                    // console.log(res);
                    that.refreshThis(that.data.data.moid, "comments");                                                                                 
                },
                fail: (res)=>{
                  console.log(res);
                }
            })
            that.setData({
                data: data,
                input: "",
                showcomment: false,
            })
        },
        /**
         * 更新数据
         * @param {*} moid 动态id
         * @param {*} type 更新位置
         */
        refreshThis: function(moid, type){
            if(!moid) return;
            let that = this;
            wx.request({
                url: app.config.getHostUrl()+'/api/moments/getMomentById',
                data: {
                    moid: moid
                },
                header: {'content-type':'application/json'},
                method: 'GET',
                dataType: 'json',
                success: (result)=>{
                    let localData = that.data.data;
                    switch(type){
                        case "likes": {
                            localData.likes = result.data.data.likes;
                            break;
                        }
                        case "comments": {
                            localData.comments = result.data.data.comments;
                            break;
                        }
                    }
                    that.setData({
                        data: localData
                    });
                },
                fail: ()=>{},
                complete: ()=>{}
            });
        }
    }
})
