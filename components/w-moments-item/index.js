// components/w-moments-item/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        showmore: false,  //显示点赞评论
        imageWidth: "",
        imageHeight: "",
        richNodes: [
            "pre"
        ],
        data: {
            uid: 0,
            img: "/imgs/default/girl.jpg",
            title: "不减十斤不改名不减十斤不改名不减十斤不改名不减十斤不改名",
            info: "包谷子大学",
            content: {
                text: " 这里是文  字\n部分这里是文字部分这里\n是文部分这里是文字部分这里是文字部分这里是文字部分这里是文字部分这里\n是文字部分"
            },
            // 单图
            // images: [
            //     {
            //         url: "/imgs/default/1.jpg",
            //         width: "683",
            //         height: "385"
            //     },
            //     {
            //         url: "/imgs/default/3.jpg",
            //         width: "368",
            //         height: "695"
            //     }
            // ],
            // 多图
            images: [
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
                {
                    url: "/imgs/default/9.jpg",
                    width: "746",
                    height: "746"
                },
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
            ]
        }
    },
    /**
     * 生命周期
     */
    attached: function() {
        let that = this
        that._initData(that.data.data.images,that)
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
        //点击更多：显示点赞和评论
        doShowmore: function(){
            let that = this;
            that.setData({
                showmore: !that.data.showmore
            })
        }
    }
})
