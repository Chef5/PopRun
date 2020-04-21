const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowloading: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        that.requestData(options.rid).then((res)=>{
            that.setData({
                medals: that.parseMedals(res),
                isShowloading: false
            })
        })
        if(options.ta){  //他人查看时
            wx.setNavigationBarTitle({
                title: options.ta+'的勋章墙',
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    //获取个人勋章数据
    requestData(rid) {
        return new Promise((resolve, reject)=>{
            wx.request({
                url: app.config.getHostUrl()+'/api/user/getMedal',
                data: { rid },
                method: 'POST',
                success: (result)=>{
                    if(result.data.isSuccess){
                        resolve(result.data.data);
                    }else{
                        reject(result.data.msg);
                    }
                },
                fail: ()=>{},
                complete: ()=>{}
            });
        })
    },

    // 处理勋章数据
    parseMedals(medals) {
        if(medals == []) return medals;
        let nmedals = [];
        for (let i = 0; i < medals.length; i++) {
            // if (medals[i] == undefined) continue;
            let outer = medals[i];
            let item = [outer]; //内循收集
            // for (let n = i + 1; n < medals.length; n++) {
            //     if (outer.type == 0) break;
            //     if (medals[n] == undefined) continue;
            //     let inner = medals[n];
            //     if (outer.meid == inner.meid) {
            //     item.push(inner);
            //     delete medals[n];  //用splice不行，因为n的最大值在循环开始就确定了
            //     }
            // }
            nmedals.push(item);
        }
        return nmedals;
    },
})