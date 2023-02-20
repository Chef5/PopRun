# 跑鸭

这是我的毕业设计：“跑鸭”微信小程序-一款基于校园跑步的社交小程序
使用了：Less / Vant-Weapp / Iview-Weapp

后端使用的PHP的Laravel框架开发

- 后端项目：https://github.com/Chef5/PopRun-b

**如果觉得有参考价值，请给个star支持一下吧**

首页、动态圈子（仿微信朋友圈）、活动广场、个人中心：

<table>
  <tr>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/1.jpg" alt="首页" /></td>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/2.jpg" alt="动态圈子" /></td>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/3.jpg" alt="活动广场" /></td>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/4.jpg" alt="个人中心" /></td>
  </tr>
</table>

设置：

<table>
  <tr>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/5.png" alt="设置" /></td>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/6.png" alt="设置-通用设置" /></td>
    <td><img src="http://img.cdn.1zdz.cn/github/readme/poprun/7.png" alt="设置-隐私设置" /></td>
  </tr>
</table>

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

重要：本小程序需要开通`wx.getLocation`接口权限，请先提前申请该权限，可以拿本文档中的截图去申请。
测试号无法申请，因此不能用测试号。

重要：本小程序需要开通`wx.getLocation`接口权限，请先提前申请该权限，可以拿本文档中的截图去申请。
测试号无法申请，因此不能用测试号。

重要：本小程序需要开通`wx.getLocation`接口权限，请先提前申请该权限，可以拿本文档中的截图去申请。
测试号无法申请，因此不能用测试号。

**以下步骤一步一步弄，顺序不能乱，通常是能一次性运行起来的！**
### 2.1 克隆代码到本地

``` shell
git clone https://github.com/Chef5/PopRun.git
```

### 2.2 安装依赖

在项目根目录执行：

``` shell
npm install
```

> 可能会报路径错误：根据报错创建指定目录


### 2.3 导入项目

微信开发者工具导入项目，填写自己的AppID（不能用测试号，后面需要申请插件，测试号无法申请）
不使用云服务

<img src="http://img.cdn.1zdz.cn/github/readme/poprun/WX20230220-161057@2x.png" alt="导入项目" style="zoom: 25%;" />

### 2.4 构建npm

在微信开发者工具（必须npm install后才能构建npm）

​	点击「工具」-「构建npm」

### 2.5 搭建后端项目

完成以上步骤，小程序基本是没有什么问题了，但用户注册生成openid需要通过自己的小程序appid和secret，因此你还需要在本地构建后端项目，具体后端项目见：https://github.com/Chef5/PopRun-b

本地搭建好后端项目之后，就可以在开发者工具中点击编译运行了（信任并运行）

### 2.7 常见报错

Q: 首次运行，通常控制台会报插件问题

``` sh
VM23:2 wx76a9a06e5b4e693e 插件未授权使用 添加插件(env: macOS,mp,1.06.2301160; lib: 2.10.4)
(anonymous) @ VM23:2
VM23:3 插件文档: https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx76a9a06e5b4e693e&token=&lang=zh_CN(env: macOS,mp,1.06.2301160; lib: 2.10.4)
```

A: 点击报错中的蓝色文字`添加插件`，就可以便捷添加。

<img src="http://img.cdn.1zdz.cn/github/readme/poprun/WX20230220-170429@2x.png" alt="导入项目" style="zoom: 25%;" />
<img src="http://img.cdn.1zdz.cn/github/readme/poprun/WX20230220-170230@2x.png" alt="导入项目" style="zoom: 25%;" />

可能因为你的小程序没有开通相关类目，无法开通，可以根据这个文档：https://developers.weixin.qq.com/miniprogram/dev/api/location/wx.getLocation.html

我开通的是：
体育  >  在线健身
工具  >  信息查询
工具  >  预约/报名

然后在「开发」-「开发管理」-「接口设置」中自助开通「获取当前的地理位置、速度」权限

注意：测试号因为无法配置目录，所以无法开通插件

### 2.8 其他注意事项

注意，本项目是20年我那会大四做的，当时技术有限，或多或少都留下了不少的坑，如果需要自用，请不要喷我哈。

本人于2023年2月，根据本文档重新跑了一遍，纠正了一些坑，项目能顺利跑起来，并备注了一些注意事项，可以全局搜索：`// TODO:` 查看。

### 2.9 如果需要使用less

如果不需要使用less，直接编辑wxss文件，以下内容请忽略

- VS Code：Easy Less 插件-可以将less编译为wxss
  
  > 配置文件在 /.vscode/settings.json

## LICENSE

[MIT](LICENSE)
