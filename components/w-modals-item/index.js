// components/w-modals-item/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        medal: {
            type: Object,  //数据类型
            value: null    //默认值
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        data: {}  //用于展示
    },

    /**
     * 生命周期
     */
    attached: function() {
        let that = this;
        //整理传入数据
        that.setData({
            data: that.properties.medal
        })
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
