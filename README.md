# 跑鸭

这是我的毕业设计：“跑鸭”微信小程序-一款基于校园跑步的社交小程序
使用了：Less / Vant-Weapp / Iview-Weapp

后端使用的PHP的Laravel开发

- 后端项目：https://github.com/Patrick-Jun/PopRun-b

## 一、功能设计

“跑鸭”微信小程序的核心功能就是：跑步+社交+活动，详细划分如下：

（1）跑步（首屏）：当前位置地图、排行榜（周榜、月榜）、运动路径、实时数据（里程、配速）、随机一言。

（2）动态圈子：打卡分享、发布分享、热门推荐、点赞评论、消息通知。

（3）活动广场：线上活动（报名、完赛条件、奖励）、跑步教程。

（4）个人中心：运动管理、动态管理、设置（通用设置、隐私设置）、勋章墙、等级称号、个人主页、资料编辑。

- 产品原型：https://orgnext.modao.cc/team/panel/teyfrxdefault
- 开发手册：https://www.yuque.com/hg64tq

**目录结构：**

``` shell
├─.vscode           #VS Code配置，含'EasyLess'插件配置
├─components        #自定义公共组件
├─dist              #iVew-Weapp库
├─imgs              #图标、默认图片
├─pages
│  ├─run            #跑步（首页）
│  │  └─sharePage        #分享到动态圈子页
│  ├─moments        #动态圈子
│  │  ├─messages         #消息盒子
│  │  └─newMoment        #新建动态
│  ├─pub            #活动广场
│  │  ├─blockDetail      #教程详细
│  │  ├─blockMore        #教程列表
│  │  ├─listDetail       #活动详细
│  │  └─listMore         #活动列表
│  └─user           #个人中心
│      ├─edit            #个人资料编辑
│      ├─modals          #勋章墙
│      ├─myMoments       #我的动态
│      ├─myRuns          #我的运动
│      ├─privacy         #隐私设置
│      ├─setting         #通用设置
│      └─userPage        #个人主页
├─theme             #主题定制
├─utils             #公共模块
└─voice             #音频文件
```

## 二、如何使用

### 2.1 克隆代码到本地

``` shell
git clone https://github.com/Patrick-Jun/PopRun.git
```

### 2.2 安装依赖

在项目根目录执行：

``` shell
npm install
```

> 可能会报路径错误：根据报错创建指定目录

### 2.3 构建npm

在微信开发者工具，启用npm：

> 详细-本地设置-使用npm模块

然后：

> 微信开发者工具-工具-构建npm

### 2.4 插件安装

如果我服务器上没有下线后端代码的话（下线了就需要在本地构建后端项目），

完成前面的步骤你已经能够正常运行程序了，如果不需要使用less，直接编辑wxss文件，就不用安装下面插件了

- VS Code：Easy Less
  > 配置文件在 /.vscode/settings.json

## LICENSE

[MIT](LICENSE)
