const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if(options.type == 'moment'){  //从动态圈子过来
            app.getNotices(options.rid).then((res)=>{
                let messages = [];
                let count = 0;
                for(let i=0; i<res.length; i++){
                    if(res[i].type !=0){
                        messages.push(res[i]);
                        if( res[i].read==0 ) count++;
                    }
                }
                that.setData({ messages });
                that.setNavTitle(count);
            })
        }else if(options.type == 'userCenter'){  //从个人中心过来
            app.getNotices(options.rid, undefined, 0).then((res)=>{
                let messages = [];
                let count = 0;
                for(let i=0; i<res.length; i++){
                    if(res[i].type ==0){
                        messages.push(res[i]);
                        if( res[i].read==0 ) count++;
                    }
                }
                that.setData({ messages });
                that.setNavTitle(count);
            })
        }
    },

    // 点击滑动块
    onCellClick(e) {
        switch (e.detail) {
            case 'left':
                this.doRead(e.target.dataset.noid);
                break;
            case 'right':
                this.doDelete(e.target.dataset.noid);
                break;
        }
    },

    // 全部已读
    readAll() {
        let that = this;
        let messages = this.data.messages;
        if( messages.length >0 ){
            let noids = [];
            for(let i=0; i<messages.length; i++){
                noids.push(messages[i].noid)
            }
            app.doRead(noids).then(res=>{
                that.setData({ messages: res.data.data });
                that.setNavTitle(0);
            })
        }else{
            return false;
        }
    },

    // 全部删除
    deleteAll() {
        let that = this;
        let messages = this.data.messages;
        if( messages.length >0 ){
            let noids = [];
            for(let i=0; i<messages.length; i++){
                noids.push(messages[i].noid)
            }
            app.doDelete(noids).then(res=>{
                that.setData({ messages: [] });
                that.setNavTitle(0);
            })
        }else{
            return false;
        }
    },

    // 阅读消息
    doRead(noid) {
        let that = this;
        app.doRead(noid).then(res=>{
            let messages = that.data.messages;
            for(let i=0; i<messages.length; i++){
                if(messages[i].noid == noid){
                    messages[i].read = 1;
                    break;
                }
            }
            that.setData({ messages });
            that.setNavTitle();
        })
    },
    // 删除消息
    doDelete(noid) {
        let that = this;
        app.doDelete(noid).then(res=>{
            let messages = that.data.messages;
            messages = messages.filter(item=>{
                return item.noid != noid;
            })
            that.setData({ messages });
            that.setNavTitle();
        })
    },

    // 设置页面标题
    setNavTitle(count) {
        if(count==undefined){
            let messages = this.data.messages;
            count = messages.filter(item=>{
                return item.read == 0;
            }).length;
        }
        if(count>0){
            wx.setNavigationBarTitle({
                title: '消息通知: '+count+'条未读',
            });
        }else{
            wx.setNavigationBarTitle({
                title: '消息通知',
            });
        }
    },

    // 格式化时间
    formatHM(time){
        let date = new Date(time);
        console.log(date);
        return (date.getHours()>10?date.getHours():'0'+date.getHours()) + 
            ':' + (date.getMinutes()>10?date.getMinutes():'0'+date.getMinutes());
    },
})