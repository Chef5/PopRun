
const format = require('./util');

const defaultColorStart = '#83B582';
const defaultColorEnd = 'orange';
const defaultColorDirection = 2; //右上

/**
 * 获取canvas节点
 * nodeID: canvas选择符，如 '#myCanvas'
 */
const getCanvas = nodeID => {
    return new Promise((resolved, rejected)=>{
        const query = wx.createSelectorQuery()
        query.select(nodeID)
          .fields({ node: true, size: true })
          .exec((res) => {
            resolved(res[0].node)
        })
    })
}

/** 
 * 绘制分享图 ：动态圈子&右上角 500*400  朋友圈 500*600（加了200显示小程序码）
 * canvas: canvas对象
 * run: 运动数据  
 *      自定义背景：run.bg=Image或者run.color={from, to, direction:0-7左上角顺时针（）}
 * iswx: 是否分享到朋友圈[可选]，默认false
 * user: 用户数据[可选](分享到朋友圈时需要)：小程序码 user.ercode=Image
 */
const makeShareImg = (canvas, run, iswx, user) => {
    if(!run) return false; //运动数据不可缺少
    if(iswx && (!user || !user.ercode)) {   //分享到朋友圈时，需要用户数据
        return false;
    }
    if(!iswx){
        let Width = 500;
        let Height = 400;
        return canvasNormal(canvas, Width, Height, formatData(run));
    }else{
        let Width = 500;
        let Height = 555;
        return canvasMoments(canvas, Width, Height, formatData(run), user);
    }

}


/**
 * 获取图片路径
 * nodeID：canvas选择符，如 '#myCanvas'
 * iswx: 是否是朋友圈格式，默认false
 */
const getFile = (nodeID, iswx) => {
    let Width = 500;
    let Height = 400;
    if(iswx){
        Width = 500;
        Height = 555;
    }
    return new Promise((resolved, rejected)=>{
        getCanvas(nodeID).then(canvas => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: Width,
                height: Height,
                destWidth: Width,  //*2是为了让图片分辨率更大，显得更清晰
                destHeight: Height,
                canvas: canvas,
                success: function (res) {
                    console.log("生成图片", res)
                    resolved(res.tempFilePath);
                },
                fail: res => {
                    console.log("生成图片报错", res)
                    rejected(err);
                }
            })
          })
    })
}

/**
 * 保存图像到相册
 * nodeID：canvas选择符，如 '#myCanvas'
 * iswx: 是否是朋友圈格式，默认false
 */
const save = (nodeID, iswx) => {
    let Width = 500;
    let Height = 400;
    if(iswx){
        Width = 500;
        Height = 555;
    }
    return new Promise((resolved, rejected)=>{
        getCanvas(nodeID).then(canvas => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: Width,
                height: Height,
                destWidth: Width,  //*2是为了让图片分辨率更大，显得更清晰
                destHeight: Height,
                canvas: canvas,
                success: function (res) {
                    console.log("生成图片", res)
                    wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                        resolved(res);
                    },
                    fail: (err) => {
                        rejected(err);
                    }
                    })
                },
                fail: res => {
                    console.log("生成图片报错", res)
                    rejected(err);
                }
            })
          })
    })
}






/**
 * 绘制动态圈子分享、右上角分享图（500*400，不带头像和小程序码）
 */
const canvasNormal = (canvas, Width, Height, run) => {
    // 必须给canvas设置长宽
    canvas.width = Width;
    canvas.height = Height;
    const ctx = canvas.getContext('2d');
    drawNormalPart(ctx, run, Width, Height);
    return canvas;
}

/**
 * 绘制分享到朋友圈的图片（500*555）user中必须要有小程序码Image对象 user.ercode=[Image]
 */
const canvasMoments = (canvas, Width, Height, run, user) => {
    let oriHeight = Height-155;
    // 必须给canvas设置长宽
    canvas.width = Width;
    canvas.height = Height;
    const ctx = canvas.getContext('2d');

    //绘制公共部分
    drawNormalPart(ctx, run, Width, oriHeight);

    //绘制头像
    let img = canvas.createImage();
    img.src = user.img;
    const avatorWidth  = 70;
    const avatorHeigt  = 70;
    const avatorLx  = 30;
    const avatorLy  = 30;
    img.onload = ()=>{ //必须要监听图片加载完成，不然绘制不出来
        ctx.beginPath(); //开始绘制
        ctx.arc( avatorWidth/2+avatorLx, avatorHeigt/2+avatorLy, avatorWidth/2, 0, Math.PI*2, false); //圆心 x,y  半径 起始点 结束点 False顺时针
        ctx.clip();
        ctx.drawImage(img, avatorLx, avatorLy, avatorWidth, avatorHeigt);
        ctx.restore();
    }
    //绘制昵称
    ctx.fillStyle = "#fff"
    ctx.font = "12px '宋体'"; 
    ctx.textAlign = "center";  
    ctx.fillText(user.nickname, avatorWidth/2+avatorLx, avatorHeigt+avatorLy+20)
    
    //绘制底部白色背景
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, oriHeight, Width, 155);
    //绘制边框：暂时去掉
    // ctx.beginPath();
    // ctx.moveTo(0, oriHeight);
    // ctx.lineTo(0, Height);
    // ctx.lineTo(Width, Height);
    // ctx.lineTo(Width, oriHeight);
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = 'black'; 
    // ctx.stroke();

    //绘制文字描述
    ctx.fillStyle = "#000";
    ctx.font = "24px '宋体'"; 
    ctx.textAlign = "left";  
    ctx.fillText('长按图片识别小程序码', 20, Height-90);
    ctx.font = "30px '宋体'"; 
    ctx.fillText('来和我一起跑步吧！', 20, Height-50);

    //绘制小程序码
    const rcodeWidth  = 120;
    const rcodeHeigt  = 120;
    const rcodeLx  = Width-rcodeWidth-17.5;
    const rcodeLy  = Height-rcodeHeigt-17.5;
    user.ercode.onload = ()=>{
        ctx.drawImage(user.ercode, rcodeLx, rcodeLy, rcodeWidth, rcodeHeigt);
        ctx.restore();
    }

    return canvas;
}

/**
 * 绘制公共部分
 */
const drawNormalPart = (ctx, run, Width, Height) => {
    //绘制背景：优先级  图片 > 自定义颜色 > 默认
    if(run.bg){
        //绘制图片背景
        run.bg.onload = ()=>{ //必须要监听图片加载完成，不然绘制不出来
            ctx.drawImage(run.bg, 0, 0, Width, Height, 0, 0, Width, Height);
            ctx.restore();
            //绘制数据
            drawData(ctx, run, Width, Height);
        }
    }else if(run.color){
        //绘制渐变背景
        const grd = getGrd(ctx, Height, Width, run.color.direction);
        grd.addColorStop(0, run.color.from);
        grd.addColorStop(1, run.color.to);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, Width, Height);
        //绘制数据
        drawData(ctx, run, Width, Height);
    }else{
        //绘制渐变背景
        const grd = getGrd(ctx, Height, Width, defaultColorDirection);
        grd.addColorStop(0, defaultColorStart);
        grd.addColorStop(1, defaultColorEnd);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, Width, Height);
        //绘制数据
        drawData(ctx, run, Width, Height);
    }
    
    // return ctx;  //ctx是只读的，所以不用返回
}

/**
 * 绘制数据单独拿出来：必须放在图片背景之后执行，不然会被图片覆盖
 */
const drawData = (ctx, run, Width, Height) =>{
    //绘制底部运动时间 
    ctx.fillStyle = "#fff" ;
    ctx.font = "14px Arial"; 
    ctx.textAlign = "center";  
    ctx.fillText(run.time_start, Width/2,Height-10);

    //绘制三条数据
    ctx.fillStyle = "#000" ;
    ctx.font = "bold 24px '宋体'"; 
    ctx.fillText("时长", Width/6,Height-50);
    ctx.fillText("配速", Width/2,Height-50);
    ctx.fillText("热量(千卡)", Width*5/6,Height-50);
    
    ctx.fillStyle = "#fff" ;
    ctx.font = "28px 'Arial'"; 
    ctx.fillText(run.period, Width/6,Height-90);
    ctx.fillText(run.speed, Width/2+4,Height-90);
    ctx.fillText(run.calorie, Width*5/6,Height-90);
    
    //绘制线条 - 中间线
    ctx.beginPath();
    ctx.moveTo(50, Height/2+50);
    ctx.lineTo(Width-50, Height/2+50);
    ctx.strokeStyle = "#fff" ;
    ctx.closePath();
    ctx.stroke();

    //绘制里程
    ctx.fillStyle = "#fff";
    ctx.font = "bold 70px '宋体'"; 
    ctx.fillText(run.distance, Width/2, Height/2);
    //里程单位
    ctx.fillStyle = "#000";
    ctx.font = "30px '宋体'"; 
    ctx.fillText("km", Width*5/7+10, Height/2+10);
    
    //绘制打卡日期
    ctx.fillStyle = "#000";
    ctx.font = "bold 35px '宋体'"; 
    ctx.fillText(run.day, Width*7/8-18, Height/8+10-18);
    ctx.fillText(run.month, Width*7/8+18, Height/8+10+18);

    //绘制线条 - 日期线
    ctx.beginPath();
    ctx.moveTo(Width*7/8+30-10, Height/8-22-6);
    ctx.lineTo(Width*7/8-30+6, Height/8+38-6);
    ctx.strokeStyle = "#fff" ;
    ctx.lineWidth = 2;
    ctx.closePath();
    ctx.stroke();
}

/**
 * 根据渐变色方向，获取grd
 */
const getGrd = (ctx, Height, Width, direction) => {
    switch(direction) {
        case 0: //左上
            return ctx.createLinearGradient(Width, Height,0, 0);
            break;
        case 1: //向上
            return ctx.createLinearGradient(Width/2, Height, Width/2, 0);
            break;
        case 2: //右上
            return ctx.createLinearGradient(0, Height, Width, 0);
            break;
        case 3: //向右
            return ctx.createLinearGradient(0, Height/2, Width, Height/2);
            break;
        case 4: //右下
            return ctx.createLinearGradient(0, 0, Width, Height);
            break;
        case 5: //向下
            return ctx.createLinearGradient(Width/2, 0, Width/2, Height);
            break;
        case 6: //左下
            return ctx.createLinearGradient(Width, 0, 0, Height);
            break;
        case 7: //向左
            return ctx.createLinearGradient(Width, Height/2, 0, Height/2);
            break;
        default:
            return ctx.createLinearGradient(0, Height, Width, 0);
            break;
    }
}

/**
 * 处理运动数据，便于绘制分享图
 * return { ...run, period:'00:00:00', speed:'00′00″', month:'04', day:'21' }
 */
const formatData = run => {
    run.period = format.formatPeriod2time(run.time_run);
    run.speed = format.formatSpeed(run.speed);
    run.month = format.formatNumber(format.string2date(run.time_start).getMonth()+1);
    run.day = format.formatNumber(format.string2date(run.time_start).getDate());
    return run;
}



module.exports = {
    getCanvas,
    makeShareImg,
    getFile,
    save
}