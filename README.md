# 跑鸭

这是我的毕业设计：“跑鸭”微信小程序-一款基于校园跑步的社交小程序
使用了：Less / Vant-Weapp / Iview-Weapp

后端使用的PHP的Laravel框架开发

- 后端项目：https://github.com/Patrick-Jun/PopRun-b

**如果觉得有参考价值，请给个star支持一下吧**

首页、动态圈子（仿微信朋友圈）、活动广场、个人中心：

<img src="http://img.cdn.1zdz.cn/github/readme/poprun/1.jpg" alt="首页" style="zoom: 25%;" /> <img src="http://img.cdn.1zdz.cn/github/readme/poprun/2.jpg" alt="动态圈子" style="zoom: 25%;" /> <img src="http://img.cdn.1zdz.cn/github/readme/poprun/3.jpg" alt="活动广场" style="zoom: 25%;" /> <img src="http://img.cdn.1zdz.cn/github/readme/poprun/4.jpg" alt="个人中心" style="zoom: 25%;" />

设置：

<img src="http://img.cdn.1zdz.cn/github/readme/poprun/5.png" alt="设置" style="zoom: 33%;" /> <img src="http://img.cdn.1zdz.cn/github/readme/poprun/6.png" alt="设置-通用设置" style="zoom: 33%;" /> <img src="http://img.cdn.1zdz.cn/github/readme/poprun/7.png" alt="设置-隐私设置" style="zoom: 33%;" />

## 一、功能设计

“跑鸭”微信小程序的核心功能就是：跑步+社交+活动，详细划分如下：

（1）跑步（首屏）：当前位置地图、排行榜（周榜、月榜）、运动路径、实时数据（里程、配速）、随机一言。

（2）动态圈子：打卡分享、发布分享、热门推荐、点赞评论、消息通知。

（3）活动广场：线上活动（报名、完赛条件、奖励）、跑步教程。

（4）个人中心：运动管理、动态管理、设置（通用设置、隐私设置）、勋章墙、等级称号、个人主页、资料编辑。

- <del>产品原型：https://orgnext.modao.cc/team/panel/teyfrxdefault</del>（已失效）
- <del>开发手册：https://www.yuque.com/hg64tq</del>（已失效）
- 
**E-R图：**

根据功能分析，一共规划出11个实体，形成E-R图：
![20200618185938.jpeg](http://img.cdn.1zdz.cn/github/readme/poprun/20200618185938.jpeg)

**数据模型图：**

由E-R图，共转换成16张表，数据模型图由Navicat导出
![20200618191037.jpeg](http://img.cdn.1zdz.cn/github/readme/poprun/20200618191037.jpeg)

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

（1）在微信开发者工具，启用npm：

​	点击详细-本地设置-使用npm模块

（2）构建

​	点击工具-构建npm

### 2.4 完成

恭喜！完成前面的步骤你已经能够正常运行程序了，前提是我服务器上没有下线后端程序，如果发现接口不能用，就说明时下线了，你就需要在本地构建后端项目，具体后端项目见：https://github.com/Patrick-Jun/PopRun-b

### 2.5 创建活动和教程

如果我没有下线后端程序，以下创建接口可在线使用：

- 创建活动：https://dev.run.nunet.cn/addActivity

- 创建课程：https://dev.run.nunet.cn/addCourse

### 2.6 如果需要使用less

如果不需要使用less，直接编辑wxss文件，以下内容请忽略

- VS Code：Easy Less 插件-可以将less编译为wxss
  
  > 配置文件在 /.vscode/settings.json

## LICENSE

[MIT](LICENSE)
