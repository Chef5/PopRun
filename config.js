/**
 * 配置文件
 */


/**
 * 一下两个配置，根据自身情况选择其中一个
 * 配置1-适合体验预览项目：无需自己搭建后端服务，后端是项目作者启动的，不确定什么时候会停服，且数据都存储在项目作者服务器
 * 配置2-适合自用、二次开发：需要自己搭建后端项目 https://github.com/Chef5/PopRun-b
 */


// 配置1-适合体验预览项目
export const hostUrl = 'https://dev.run.nunet.cn';
export const appInfo = {
  appid: '', // 自己小程序的appid
  secret: '', // 自己小程序的secret
};

// 配置2-适合自用、二次开发
// export const hostUrl = 'http://127.0.0.1:8000';