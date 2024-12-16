
// 设置服务器地址
// var SERVER_URL = "http://192.168.1.142:5000";   // 本地调试
// var SERVER_URL = "http://192.168.1.128:5000";  // 服务器1
// var SERVER_URL = "http://192.168.1.94:5000";  // 服务器2
var SERVER_URL = "http://192.168.1.94:8001";  // 服务器2
// 喊话内容
var text = "全球最低金币 PlayPal担保交易。欢迎来到 igokay.com。 The lowest price gold transactions in the world. Use PlayPal guaranteed payment. Welcome to igokay.com." ;
// 截图图片是否保存
var  Save =  false // true   false 

let careers = ["法师","弩手","武士","黑道士","战士","道士"];
var storage = storages.create("ABC");
var today = new Date().toISOString().split('T')[0];  // 获取今日日期，格式为 YYYY-MM-DD

// ---------------------------------------------- 网络请求

function getOcr(img) {
    try {
        
        console.time("********&&& getOCR");  // 开始计时

        console.time("tobase64");  // 开始计时
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");
        console.timeEnd("tobase64");  // 输出执行时间

        // 构造请求的 JSON 数据，添加 lang 字段
        let jsonData = {
            "base64_str": imgData,
        };
        
        console.time("httppost");  // 开始计时
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = http.postJson(SERVER_URL+"/ocr/predict-by-base64", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // 设置超时时间为10秒
        });
        // let response = http.postJson("http://192.168.1.94:9080/ocr", jsonData, {
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     timeout: 10000 // 设置超时时间为10秒
        // });

        console.timeEnd("httppost");  // 输出执行时间

        if (response.statusCode == 200) {
            console.time("JSON.parse");  // 开始计时
            let result = JSON.parse(response.body.string());
            console.time("JSON.parse");  // 开始计时
            console.log("****************** OCR  time : ", result.time)
            return result.data;
            // return JSON.parse(response.body.string());
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
    } finally {
        console.timeEnd("********&&& getOCR");  // 输出执行时间
    }
    
    return null;
}

// 请求是否是蓝色
function isblue(img) {
    try {
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");

        let jsonData = {
            "base64_str": imgData,
        };

        // 发送 POST 请求
        let response = http.postJson(SERVER_URL+"/ocr/predict-is-blue", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // 设置超时时间为10秒
        });
        
        if (response.statusCode == 200) {
            return JSON.parse(response.body.string());
        } else {
            console.error(" isblue 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        toast("请求失败: ",e)
        console.error("请求失败: ", e);
    }
    return null;
}

// ---------------------------------------------- 基础函数
//  管理存储值
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    let keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);                 // 当前职业 : e_career  喊了话的战斗力 : e_war  当前职业喊的数量 : e_count  停止时间 : e_time
        storage.put(today,{e_career:'法师', e_war:0, e_count:0 ,e_time:0})  // 职业  战力值  喊话的数量  休息时间
        storage.put("keysList", keys);  // 更新键列表
    }
    
    // 遍历之前保存的所有键，并删除不符合条件的键
    keys.forEach(function(key) {
        // console.log(key)
        if (key !== today) {
            storage.remove(key);  // 删除不是今天的数据
        }
    });
}
manage_value()
//  生成未来时间 
function addRandomMinutes(min, max) {
    let now = new Date();  // 获取当前时间
    let randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min; // 生成 min 到 max 之间的随机分钟数
    now.setMinutes(now.getMinutes() + randomMinutes); // 当前时间加上随机分钟数，自动处理进位
    return now;
}

//  对比时间
function compareTime() {
    let now = new Date();  // 获取当前时间
    let a = storage.get(today)
    let futureTime = new Date(a.e_time)
    // 比较时间戳
    if (futureTime > now) {
        // console.log('未来时间大于当前时间');
        return true
    } else {
        // console.log('未来时间小于当前时间');
        return false
    }
}

// 查看控件 "com.wemade.mir4global"
function opackageName(str) {
    // 查找屏幕上的所有控件
    let nodes = className("android.widget.FrameLayout").find();
    // 遍历找到满足条件的控件
    for (let i = 0; i < nodes.size(); i++) {
        let node = nodes.get(i);
        if (node.packageName() === str) {
            nodes.recycle();  // 释放控件资源
            sleep(100);
            return true
        }
    }
    nodes.recycle();
    return false
}

/**强行关闭游戏 控件本版
 * 
 * let currentPkg = currentPackage();  可以获取 com.wemade.mir4global  这个表示传奇4 
 * @param {string} str  APP包的名字   
 * @param {boolean} execute  是否启动
 */
function close_app(str,execute) {
    if (execute == null) {
        execute = false
    }
    // 打开详情  
    app.openAppSetting(str)
    let btn = text("强行停止").findOne(4000);
    if (btn) {
        btn.click();
        console.log("点击强行停止按钮成功");
    }
    let qd = text("确定").findOne(3000)
    if (qd) {
        console.log("首都迁往")
        qd.click();
        console.log("点击确定按钮成功");
    }
    // 再一次执行App
    if (execute) {
        app.launch(str)
    }
}

/** 生成随机英文名  名字要求6-12 
 * 
 * @returns string
 */
function getRandomName() {
    // 随机生成 2 到 5 之间的长度
    let length = random(2, 4);
    
    // 定义字符集，可以根据需要修改
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let name = "";

    // 循环生成随机字符组成名字
    for (let i = 0; i < length; i++) {
        var randomIndex = random(0, characters.length - 1);
        name += characters.charAt(randomIndex);
    }
    
    // 加上前缀
    let prefix = "igokay ";  
    let fullName = prefix + name;
    return fullName;
}

// 区域裁剪
function clip(img, box) {
    // 获取裁剪区域的坐标
    let x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    let x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    let y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    let y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);
    // 裁剪图像
    return images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min)
}

//  释放图片资源
function imgRecycle(params) {
    if (params) {
        // 释放图片资源
        params.recycle();
        // 将参数设为null，帮助垃圾回收
        params = null;
    }
}

// 查找后面的文本
function getNextText(ocrResult,targetText) {
    if (!Array.isArray(ocrResult)) {
        console.error(`getNextText 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResult.length; i++) {
        // console.log("----------------")
        // console.log("D1 :",ocrResult[i][1][0])
        // console.log("D2 :",ocrResult[i][1])
        // console.log(ocrResult[0][0][i][1][0])
        // console.log(targetText)


      if (ocrResult[i][1][0].replace(/[.,]/g, '') === targetText.replace(/[.,]/g, '')) {
        // 如果目标文本不是最后一个，返回下一个文本
        if (i + 1 < ocrResult.length) {
        //   return ocrResult[0][i + 1][0];
          return ocrResult[i+1][1][0];
        } else {
          return null; // 如果目标文本是最后一个，返回 null
        }
      }
    }
    return null; // 如果没有找到目标文本，返回 null
}

/** 查找内容并返回。
 *  
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} targetText - 要查找的文本。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function select(ocrResults, targetText,exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        // console.log(item)
        if (exactMatch) {
            // console.log("进行精准查询 :",item[1][0])
            if (item[1][0] === targetText) {
                // console.log("找到目标文本:", item);
                return item;
            }
        }else{
            // console.log("   * 进行模糊查询 :",item[1][0])
            if (item[1][0].includes(targetText)) {
                // console.log("模糊查找目标文本:", item.text);
                return item;
            }
        }
    }
    return null;
}

/** 查找文本并点击
 * 
 * @param {Array} reData 
 * @param {string} src   要查找的字
 * @param {boolean} exactMatch  是否精准查询
 * @returns 
 */
function selclick(reData,src,exactMatch){
    var target = select(reData, src,exactMatch)
    if(target != null){
        // 计算文本区域的中心点
        let centerX = (target[0][0][0] + target[0][2][0]) / 2;
        let centerY = (target[0][0][1] + target[0][2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        // let x_phone = (centerX / 1285) * device.height;
        // let y_phone = (centerY / 720) * device.width;

        // console.log(`selclick-点击${src}: x=${x_phone}, y=${y_phone}`);
        // console.log(`selclick-点击 ${src}: x=${centerX}, y=${centerY}`);

        // 点击坐标
        // code = httpclick(centerX,centerY);
        code = click(centerX,centerY);
        // console.log("code",code)
        // code = click(x_phone,y_phone);
        if (!code) {
            console.log(`selclick ${src} 点击失败`)
            return false
        }
        return true
    }
    return false
}

/** 点击偏移文本
 * 
 * @param {Array} target  数据
 * @param {number} x 偏移量
 * @param {number} y 偏移量
 */
function textClick(target,x,y){
    // 计算文本区域的中心点
    let centerX = (target[0][0][0] + target[0][2][0]) / 2;
    let centerY = (target[0][0][1] + target[0][2][1]) / 2;
    // 将坐标从截图转换到设备屏幕坐标
    // let x_phone = (centerX / 1285) * device.height;
    // let y_phone = (centerY / 720) * device.width;
    // console.log(`点击${target.text}: x=${x_phone}, y=${y_phone}`);
    console.log(` textClick 点击 : ${target.text} 偏移: x=${centerX}, y=${centerY}`);
    // 点击坐标
    // click(x_phone+x,y_phone+y);
    click(centerX+x,centerY+y);
}

/** 点击等待
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} delay 
 */
function clickWithDelay(x, y, delay) {
    delay = (delay !== undefined) ? delay : 500;
    click(x, y);
    sleep(delay);
}

/** 查找并点击
 * 
 * @param {*} reData 
 * @param {*} text 
 * @param {*} x 
 * @param {*} y 
 * @param {*} delay 
 * @returns 
 */
function checkAndClick(reData, text, x, y, delay) {
    delay = (delay !== undefined) ? delay : 500;
    if (select(reData, text)) {
        clickWithDelay(x, y, delay);
        return true;
    }
    return false;
}

//  查找第二个指示字符
function selectTow(ocrResults, targetText) {
    let num = 0
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[i];
        if (item[1][0] === targetText) {
            num += 1;
            if (num == 2) {
                return item;
            }
        }
    }
    return null;
}

// 查找文本并点击
function clickTow(reData,src){
    var target = selectTow(reData, src)
    if(target != null){
        // 存在 点击
        // console.log("开始点击",src);

        // 计算文本区域的中心点
        let centerX = (target[0][0][0] + target[0][2][0]) / 2;
        let centerY = (target[0][0][1] + target[0][2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        // let x_phone = (centerX / 1285) * device.height;
        // let y_phone = (centerY / 720) * device.width;

        console.log(` clickTow 点击坐标: x=${centerX}, y=${centerY}`);

        // 点击坐标
        click(centerX,centerY);

        return true
    }
    return false
}

/** 查找后执行点击操作并等待指定时间。
 *
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} text - 要查找的文本。
 * @param {number} waitTime - 点击后等待的时间，单位为毫秒。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function ClickSleep(reData, text, waitTime, exactMatch) {
    waitTime = (waitTime !== undefined) ? waitTime : 4000;
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (selclick(reData, text, exactMatch)) {
        console.log(`点击"${text}"，等待 ${waitTime / 1000} 秒`);
        sleep(waitTime);
        return true;
    }
    return false;
}

/** OCR识别 非数组检查
 * 
 * @returns OCR识别后的数据
 */
function imgOcrData(img) {
    //  拿到图片想发送给服务器进行OCR处理
    let Data = getOcr(img,"ch");
    if (Data) {
        if (!Array.isArray(Data)) {
            return null;
        }
        return Data;
    }
    return null    
}

//  识别5次
function text3(str) {
    for (let i = 0; i < 3 ; i++) {
        // 截取图片
        let img = captureScreen(); 
        let grayscaleImage = images.grayscale(img);
        // OCR识别一下 
        imgRecycle(img)
        // 找对应的内容
        let reData4 = getOcr(grayscaleImage,"ch");
        imgRecycle(grayscaleImage)
        if (reData4) {
            // 开始查找内容
            if (select(reData4,str)) {
                return true
            }
        }
        sleep(1000);
    }
    return false
}
 

// -------------------------------- 游戏处理
//  获取等级
function getlv(lvData){
    if (!Array.isArray(lvData)) {
        return null;
    }
    for (let i = 0; i < lvData[0].length; i++) {
        let item = lvData[0][i];
        if (item[1][0].includes("级")) {
            let index = item[1][0].indexOf('级');
            let numberBeforeLevel = item[1][0].slice(0, index).trim();
            storage.put("lv", numberBeforeLevel);
            return numberBeforeLevel;
        }
    }
    return null ;
}

// 处理弹窗函数
function wrong(reData) {
    if (selclick(reData,"Google登录")) {
        sleep(5000);
        return 
    }
     // 网络异常波动
     if (selclick(reData,"前往登录")) {
        sleep(2000);
        return
    }
    if (select(reData,"存在最新版本")||select(reData,"无法确认版本")) { 
        selclick(reData,"确定",true);
        // SetCom("pm clear com.wemade.mir4global")
        // throw new Error("游戏更新");
        return true;
    }

    //  去认证界面
    if (select(reData,"资格的证明")) {
        selclick(reData,"登录游戏",true)
        sleep(2000);
        return 
    }
    // 临时维护
    if (select(reData,"Temporary")|| select(reData,"Maintenance")||select(reData,"更新维护公告")) {
        console.log("游戏临时维护");
        // 杀掉游戏
        close_app("com.wemade.mir4global")
        throw new Error("游戏临时维护")
    }
    if (selclick(reData,"前往登录")) {
        sleep(2000);
        return true
    }
    // 更新维护
    if (select(reData,"更新维护公告")) { 
        // SetCom("pm clear com.wemade.mir4global")
        close_app("com.wemade.mir4global")
        throw new Error("更新维护公告");
    }
    

    if (select(reData,"提示") && select(reData,"更新信息")) {
        selclick(reData,"游戏结束");
        return true
        
    }
    if (selclick(reData,"重新连接")) {
        return true
    }
    // 服务器连接断开 -> 前往登录
    if (select(reData, "服务器连接断开")) {
        return ClickSleep(reData, '前往登录');
    }
    if (select(reData,"服务器断开连接")) {
        return ClickSleep(reData,"确认")
    }
    // 网络问题 -> 重新尝试 
    if (select(reData, "网络套")) {
        close_app("com.wemade.mir4global")
        console.log("需要关闭游戏重新登录")
        return true;
    }
    // 重新尝试
    if (select(reData, "重新尝试")) {
        return ClickSleep(reData, '重新尝试');
    }
    // 据点复活
    if (selclick(reData, "据点复活")) {
        console.log("点击据点复活，等待5秒");
        sleep(5000);
        return true;
    }
    // 说明 -> 确认 或 结束
    if (select(reData, "说明")) {
        if (ClickSleep(reData, '确认') || ClickSleep(reData, '结束', 2000) || ClickSleep(reData, '确定')) {
            return true;
        }
    }
    // 警告 -> 确认
    if (select(reData, "警告")) {
        return ClickSleep(reData, '确认');
    }
    // 错误 -> 确认 或 游戏结束
    if (select(reData, "错误")) {
        if (ClickSleep(reData, '确认', 5000, true) || ClickSleep(reData, '游戏结束', 5000, true) || ClickSleep(reData, '确定', 5000, true)) {
            return true;
        }
    }
    // 关闭广告 -> 今日不
    let reai = select(reData, '今日不')
    if (reai) {
        selclick(reData, '今日不')
        console.log("点击关闭广告")
        textClick(reai,920,0)
        sleep(2000);
        return true
    }
    // Loading 界面
    if (select(reData, "Loading")) {
        sleep(5000);
        return true;
    }
    // Loading 界面
    if (select(reData, "购买",true)) {
        click(1219,93);
        return true;
    }

    if (select(reData,"关闭节电模式")){
        swipe(468, 491, 1000, 0, 500);
        sleep(5000);
        return true
    }
    if (select(reData,"节电模式中")){
        click(644, 614);
        sleep(5000);
        return true
    }
    return false;
}

//  创建角色
function create(reData) {
    if ((!select(reData,"请输入名称") && select(reData,"创建角色") && selclick(reData, '确定',true))) {
        return true
    }
    // 选择角色界面
    if (select(reData, '选择职业')) {
        if (selclick(reData, '黑道士')) {  // 选黑道士
            sleep(1000);
            selclick(reData, '选择',true)
        }
        return true
    }
    // 捏脸界面
    if (select(reData,"自定义")) {
        //  禁用语或者低俗
        if (select(reData,"禁用语")) {
            selclick(reData,"确定");
            sleep(2000);
            return true
        }

        //  输入法是打开的情况
        let ts = className("android.widget.EditText").findOne(1000)
        if (ts) {
            console.log("输入法打开了")
            // 输入文字
            ts.setText(getRandomName())
            sleep(500);
            // 点击发送
            click(1187,683)
            sleep(500);
            click(723,438)//确定
            return true
        }

        //  请输入名称
        if (select(reData,"请输入名称")) {
            selclick(reData, '请输入名称');
            return true
        }
        if (!selclick(reData, '创建角色')) {
            selclick(reData,"确定");
            sleep(2000);
            return true
        }
    }
    if (selclick(reData,"创建角色")) {
        return true
    }
    return false
}

//  处理轻功的部分
function handleQingGong(reData) {
    let qinggongSteps = [
        {text: "看到轻功按键了吗", x: 1221, y: 400},
        {text: "触发2段跳跃", x: 1221, y: 400},
        {text: "对墙壁点击", x: 1221, y: 400},
        {text: "瞬间快速地", x: 1060, y: 531, extraClick: [1106, 512]}  //  [1204, 400]
    ];

    for (let step of qinggongSteps) {
        if (checkAndClick(reData, step.text, step.x, step.y)) {
            if (step.extraClick) click(step.extraClick[0], step.extraClick[1]);
            sleep(3000);
            return true;
        }
    }
    return false;
}

//  制造 强化 合成 魔石  坐骑
function Console(reData) { 
    // 检查并点击菜单按键
    if (select(reData, '请点击全部菜单按键')) {
        if (select(reData,"7.强化体质")) {
            selclick(reData,"跳过")
        }else{
            click(1228,28);
        }
        sleep(2000);
        return true
    }
    let menuItem = select(reData, '请点击菜单按键')
    if (menuItem) {
        let item = menuItem[0][0][0]
        let item2 = menuItem[0][1][1]
        console.log(`请点击菜单按键: ${item}`)
        console.log(`请点击菜单按键: ${item2}`)

        if (item == 820.0 && item2 <= 157) {
            selclick(reData, '跳过')
            return true
        }

        // [816.0, 269.0], [943.0, 267.0], [944.0, 291.0], [817.0, 293.0] 制造菜单提示位置
        // [[821.0, 277.0], [984.0, 270.0], [986.0, 297.0], [822.0, 305.0]]
        // if (item == 816.0 || item == 815.0 || item == 814.0 || item == 821.0) {
        if (item >= 814.0 && item <= 823.0) {
            click(1028,216);  // 制造工坊
            sleep(2000);
            return true
        }
        // [[900.0, 155.0], [1049.0, 149.0], [1050.0, 177.0], [902.0, 183.0]] 精灵菜单提示位置
        // [[910.0, 159.0], [1058.0, 155.0], [1059.0, 182.0], [911.0, 187.0]]
        if (item == 900.0 || item == 901.0 || item == 910.0) {
            click(1120,105);  // 精灵
            sleep(2000);
            return true
        }

        //  铁匠铺
        if (item == 725 ) {
            selclick(reData, '跳过')
            return true
        }

        // [[725.0, 381.0], [855.0, 380.0], [855.0, 404.0], [726.0, 405.0]]  //任务提示按键
        // [[732.0, 394.0], [857.0, 394.0], [857.0, 413.0], [732.0, 413.0]]  任务
        if (item2 > 380.0) {  // TODO 任务提示需要item2
            selclick(reData, '跳过')
            return true
        }
        
        // [[727.0, 156.0], [854.0, 156.0], [854.0, 179.0], [727.0, 179.0]]  角色菜单提示位置
        // [[728.0, 156.0], [855.0, 156.0], [855.0, 179.0], [728.0, 179.0]]
        // [[730.0, 159.0], [853.0, 159.0], [853.0, 177.0], [730.0, 177.0]]
        // [[733.0, 164.0], [857.0, 164.0], [857.0, 183.0], [733.0, 183.0]]
        if ( (item > 727.0 && item < 734.0 )|| item2 == 156.0) {
            click(945,109);  // 角色
            sleep(2000);
            click(939,222);  // 铁匠
            return true 
        }
        // if (selclick(reData, '跳过')) {
        //     console.log("$$$$$$$$$$$$ 请点击菜单按键 跳过");
        //     sleep(1000);
        //     return true
        // }
        return false
    }
    let buttonItem = select(reData, '请点击按键')
    if (buttonItem) {
        let item = buttonItem[0][0][0]
        let item2 = buttonItem[0][0][1]
        console.log(`请点击按键: ${item}`)
        // [[899.0, 74.0], [991.0, 74.0], [991.0, 97.0], [899.0, 97.0]]  任务提示
        if (item2 <= 74) {
            selclick(reData,"跳过")
            return true;
        }


        // [[936.0, 348.0], [1029.0, 348.0], [1029.0, 371.0], [936.0, 371.0]] 解除封印
        if (item == 936.0 || item == 890.0 ) {
            selclick(reData, '跳过')
            sleep(2000);
            return true
        }
        if (selclick(reData, '高级',true)) {
            sleep(1000);
            return true
        }
        if (select(reData,"强化")) {
            selclick(reData, '跳过')
            sleep(2000);
            return true
        }

        if (select(reData,"解除封印")) {
            selclick(reData, '跳过')
            sleep(2000);
            return true
        }


        if (select(reData,"制造工坊")) {
            if (selclick(reData, '制造',true)) {
                sleep(1000);
                return true
            }
        }
        // [[205.0, 70.0], [300.0, 70.0], [300.0, 93.0], [205.0, 93.0]] 坐骑
        if (select(reData, '可佩戴') && (item > 203.0 && item < 207.0)) {
            sleep(1000);
            clickWithDelay(444,30,2000); // 坐骑
            return true
        }
        if (selclick(reData,"辅助装备") || selclick(reData,"服饰")) {
            click(1025,195); // 辅助装备
            click(1123,200); // 服饰
            sleep(2000);
            return true
        }
        if (clickTow(reData, '精灵')) {
            // clickWithDelay(940,200,1000);
            sleep(1000);
            return true
        }
        return true
    }
    if (select(reData, '传承装备')) {
        if (select(reData,"活力魔石")) {
            return checkAndClick(reData, '请点击。', 278,200, 1000);
        }
        let der = select(reData, '请点击。')
        if (der) {
            let item = der[0][0][0];
            // [[754.0, 349.0], [843.0, 349.0], [843.0, 368.0], [754.0, 368.0]] 制造按钮提示位置
            if (item == 754.0 || item == 396.0 ) {
                clickWithDelay(290,200,1000);  // 制造
            }
            return true
        }
    }
    // 推荐佩戴
    if (select(reData, '推荐佩戴')) {
        clickWithDelay(723, 600, 1000); // 穿戴
        return true;
    }

    // 点击画面
    if (selclick(reData, '点击画面')) {
        sleep(1000);
        return true;
    }
    // 完成
    let finishItem = select(reData, '完成', true);
    if (finishItem && finishItem[0][0][0] < 1037) {
        clickWithDelay(1020, 227, 2000);
        return true;
    }
    // 选择武器
    if (select(reData, '来挑选一下')) {
        clickWithDelay(809, 200, 2000);
        return true;
    }

    if (select(reData,"服饰",true) && select(reData,"灯") && select(reData,"跳过")) {
        return clickWithDelay(1230,29,2000);
    }

    let long = select(reData,"中型生命值")
    if (long) {
       if (long[0][0][0] > 700) {
            if (selclick(reData,"中型生命值")) {
                // 点击 输入框
                sleep(2000);
                clickWithDelay(778, 393, 1000);
                clickWithDelay(778, 393, 1000);
                clickWithDelay(778, 393, 1000);
                clickWithDelay(778, 393, 1000);
                clickWithDelay(778, 393, 1000);
                //  多买一点药
                clickWithDelay(778, 393, 1000);
                clickWithDelay(778, 393, 1000);
                clickWithDelay(778, 393, 1000);
                let lv = storage.get("lv",0)
                if (lv < 30 &&  lv > 21 ) {
                    clickWithDelay(778, 393, 1000);
                    clickWithDelay(778, 393, 1000);
                    clickWithDelay(778, 393, 1000);
                    clickWithDelay(778, 393, 1000);
                }

                clickWithDelay(800, 495, 2000); // 购买
            }
            if (selclick(reData,"中型魔力恢复")) {
                sleep(2000);
                clickWithDelay(853, 390, 4000); // 点击 输入框
                clickWithDelay(775, 489, 1000); //  上限
                clickWithDelay(775, 633, 2000); //  输入完毕
                clickWithDelay(800, 495, 2000); //  购买键
            }
            clickWithDelay(1219,94,2000); //  X
            return true
       }
    }
    return false
}

// 小青龙浩龙剧情提示
function Loong(reData){
    if (!select(reData, "小青龙浩")) return false;

    if (select(reData, '同伴就在附近') && selclick(reData, '前往京一')) {
        sleep(4000);
        return true
    } 
    if (select(reData, '点击头顶的标记') && selclick(reData, '与京一')) {
        for (let i = 0; i < 3; i++) {
            clickWithDelay(223, 560, 30);
        }
        sleep(1000);
        return true;
    }

    if (checkAndClick(reData, '利用活力', 223, 560, 1200)) return true;

    //  -------- 轻功
    if (handleQingGong(reData)) return true;


    if (select(reData,"还要再跳一次")){  // 跳跃2次
        click(1221,400);
        sleep(2000);
        click(1221,400);
        sleep(1000);
        return true
    }
    if (select(reData,"带回千年")){
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    //  ----- 滑动
    if (select(reData,"请拖拽虚拟摇杆进行移动") && select(reData, '前往狭窄的')){
        //  滑动
        swipe(232, 455, 0, 455, 7000);    
        sleep(1000)
        return true
    }
    if (select(reData,"紧贴墙壁") && select(reData, '前往狭窄的')){
        //  滑动
        swipe(232, 455, 0, 455, 7000);    
        sleep(2000)
        return true
    }
    if (select(reData,"发现了个好")){
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    // ----   操作类的
    //  设置药剂 和 技能频率
    if (selclick(reData,"尝试上下" )){
        // selclick(reData,"跳过")
        return true;
    }
    if (select(reData,"各种自动")){
        clickWithDelay(668,659,3000);

        clickWithDelay(1195,595,500);  // 技能释放频率
        clickWithDelay(1195,595,500);  // 技能释放频率
        clickWithDelay(1195,595,500);  // 技能释放频率
        clickWithDelay(1195,595,700);  // 技能释放频率
        clickWithDelay(1195,595,700);  // 技能释放频率
        // click(1195,441);  // 战斗自动锁定
        // click(1195,367);  // 复活时自动返回
        clickWithDelay(1195,297,700);  // 队伍共享目标
        clickWithDelay(642,443,50);  // 结束 说明弹窗
        clickWithDelay(1195,224,1500);  // 围绕队长战斗
        clickWithDelay(642,443,70);  // 结束 说明弹窗
        clickWithDelay(1235,41,2000); // 关闭窗口
        return true
    }
    if (select(reData,"使用频率")){
        clickWithDelay(668,659,3000);

        clickWithDelay(1195,595,500);  // 技能释放频率
        clickWithDelay(1195,595,500);  // 技能释放频率
        clickWithDelay(1195,595,500);  // 技能释放频率
        clickWithDelay(1195,595,700);  // 技能释放频率
        // click(1195,441);  // 战斗自动锁定
        // click(1195,367);  // 复活时自动返回
        clickWithDelay(1195,297,700);  // 队伍共享目标
        clickWithDelay(642,443,50);  // 结束 说明弹窗
        clickWithDelay(1195,224,1500);  // 围绕队长战斗
        clickWithDelay(642,443,70);  // 结束 说明弹窗
        clickWithDelay(1235,41,2000); // 关闭窗口
        return true
    }
    //  制作武器
    if (selclick(reData,"需要新的武器")){
        return true
    }
    if (selclick(reData,"在这里选择想要")){
        return true
    }
    if (checkAndClick(reData, '请选择要制', 575,300, 800)) return true;
    if (select(reData,"装备制造") && select(reData,"确认需要的材料")) {
        click(575,300); //点击武器
        sleep(2000);
        click(575,300); // 点击武器
        sleep(3000);
        // 制作
        click(1125,676);
        sleep(2000);
        click(723,600); //  穿戴
        clickWithDelay(1230,29,1200); // 关闭窗口
        return true
    }
    //  精灵
    if (selclick(reData,"最佳帅气帮手")){
        return true
    }
    if (selclick(reData,"才能召唤精")){
        return true
    }
    if (select(reData,"快来召唤我")){
        clickWithDelay(1149,674,500);
        clickWithDelay(1149,674,1000);
        return true
    }
    if (selclick(reData,"不同的技能")){
        return true
    }
    if (select(reData,"未出战的")){
        clickWithDelay(1149,674,500);
        clickWithDelay(1149,674,1000);
        return true
    }
    if (checkAndClick(reData, '一直跟随', 820,110, 1000)) return true;
    if (checkAndClick(reData, '展示精灵', 1230,29, 1000)) return true;
    if (select(reData, '追踪痕迹')  &&  select(reData, '技能强化') ) {
        selclick(reData,"跳过")
        sleep(1000);
        return true    
    }
    if (select(reData, '一下委托')) {
        selclick(reData,"跳过")
        sleep(1000);
        return true    
    }
    // 技能强化
    if (select(reData,"学习有关")){
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    if (select(reData,"可以比他强")){
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    // 魔石
    if (selclick(reData,"如何使用魔")){
        return true
    }
    if (checkAndClick(reData, '为你准备的', 814,183, 1000)) return true;
    if (selclick(reData,"魔石也有")){
        return true
    }
    if (checkAndClick(reData, '选择魔石栏', 1150,666, 1000)) return true;
    if (select(reData,"点击这里的装备")){ 
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    if (select(reData,"成功镶嵌")){
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    // 内功
    if (select(reData,"如何修炼")){
        selclick(reData,"跳过")
        sleep(3000);
        return true
    }

    //  强化体质
    if (select(reData,"有强化体质")){
        selclick(reData,"跳过")
        sleep(3000);
        return true
    }


    // 委托任务
    if (select(reData,"做好事就一定会有好报") && selclick(reData,"跳过")) {
        sleep(3000);
        return true
    }
    if (select(reData,"与任务不同") && selclick(reData,"跳过")) {
        sleep(3000);
        return true
    }
    if (select(reData,"设置药水")){ 
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    //  坐骑
    if (selclick(reData,"有关坐骑的")){ 
        return true
    }
    if (select(reData,"各种各样的坐骑")){ 
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    if (selclick(reData,"每个坐骑都有")){ 
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    if (select(reData,"心仪的服饰")){ 
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    if (select(reData,"最近流行什么")){ 
        selclick(reData,"跳过")
        sleep(1000);
        return true
    }
    return false
}

// 关闭窗口
function closeX(reData){
    if (checkAndClick(reData, '已付款的商品将发放至商店保管箱', 1130, 66, 2000)) return true;
    if (checkAndClick(reData, '伪像切换', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '大地图', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '奇缘', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '闭关修炼', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '画面位置重置', 1230, 88, 2000)) return true;
    if (select(reData, '可佩戴')) {
        clickWithDelay(948,200,1000);// 选中
        clickWithDelay(1150,675,2000); // 购买
        clickWithDelay(1150,675,1000); // 乘骑设置
        clickWithDelay(1230,29,1000);
        return true
    }

    if (checkAndClick(reData, '龙神器', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '远征队', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '接受委托', 795, 149, 2000)) return true;
    if (checkAndClick(reData, '切换频道', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '一键删除', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '合成魔', 1241, 29, 2000)) return true;
    
    // 利用活力
    if (checkAndClick(reData, '利用活力', 223, 560, 1200)) return true;
    if (checkAndClick(reData, '战斗设置', 1235, 41, 2000)) return true;
    if (checkAndClick(reData, '快捷栏设置', 1235, 41, 2000)) return true;
    if (checkAndClick(reData, '特殊强化', 1241, 29, 2000)) return true;
    if (checkAndClick(reData, '精灵合成', 1241, 29, 2000)) return true;

    // 活力补充
    if (checkAndClick(reData, '活力补充', 950, 164, 2000)) return true;
    // if (checkAndClick(reData, '指南', 1226, 38, 2000)) return true;

    if (select(reData,"输入数字") &&  selclick(reData,"取消") ) {
        sleep(2000);
        return true
    }
    if (checkAndClick(reData, '自动装备', 732,538, 2000)) return true;
    
    if (select(reData,"选择购买数量") && selclick(reData,"取消")) {
        sleep(1000);
    }

    let long = select(reData,"中型生命")
    if (long) {
        if (long[0][0][0] > 700) {
            click(1219,94); //  X
            sleep(2000);
            return true
        }
    }

    if (!select(reData,"前往狭窄的通道") && select(reData,"请拖拽虚拟摇杆进行移动") ) {
        swipe(232, 455, 232, 200, 4000);
        return true
    }
    return false
}

function getData(v, x, y, width, height) {
    // 结果数组
    let result = [];

    // 遍历每个识别到的区域
    v.forEach(item => {
        item.forEach(innerItem => {
            // 获取区域的四个点
            let points = innerItem[0];
            //console.log(points)
            let text = innerItem[1][0];
            //console.log(text)
            let score = innerItem[1][1];
            //console.log(score)

            // 获取坐标范围
            let [x1, y1] = points[0];
            let [x2, y2] = points[2];

            // 检查指定区域与当前区域是否重叠
            if (x1 >= x && y1 >= y && x2 <= x + width && y2 <= y + height) {
                result.push([points, [text, score]]);
            }
        });
    });

    return result;
}


// 排行榜喊话
function Ranking(reData) {
/**
 * 打开排行榜界面
 * 1.获取当前排行榜角色的战斗力
 * 2.记录战斗力点击进入个人界面
 * 3.点击对话
 * 4.开始输入广告文本
 * 5.输入完毕就对话列表
 *          需要存的值为  喊了话的战斗力 e_war  当前职业  e_career     当前职业喊的数量  e_count
 *                     storage.put(today,{e_career:'战斗力 (战士)', e_war:"", e_count:0 ,e_time:0})
 */
    console.log("- 排行榜喊话")

    //  输入法是打开的情况
    let ts = className("android.widget.EditText").findOne(1000)
    if (ts) {
        console.log("输入法打开了")
        // 输入文字
        ts.setText(text1)
        sleep(500);
        // 点击发送
        click(1187,683)
        sleep(500);
        clickWithDelay(633,105,2000); // 关闭对话
        clickWithDelay(633,40,1000);  // 关闭对话框
        return true
    }
    let care = storage.get(today)
    console.log("  * 记录的数据 :", care)
    if (select(reData,"聊天") && select(reData,"门派")) {
        // 请输入内容
        selclick(reData,"请输入内容")
        return true
    }

    console.log("  * 其他玩家信息")
    //  进入对话界面前
    if (select(reData,"其他玩家信息")) {
        if (selclick(reData,"确认",true)) {
            sleep(500);
            clickWithDelay(48,33,1000); // 屏蔽了退出去
            return true
        }
        let dh = select(reData,"对话")
        if (dh) {
            textClick(dh,0,-30)
            return true
        }
        // 等待切换界面
        if (!text3("请输入")) {
            console.log("该角色不存在")
            toast("未等到要点的界面")
            // clickWithDelay(45,33,1000);
            back();
        } 
        return true
    }

    console.log("  * 更换职业")
    // 检查当前喊话进度  更换职业
    if (care.e_count == 100) {
        let index = careers.indexOf(care.e_career); // 当前职业的index
        if (index == careers.length -1) {
            // 一轮喊完了  休息一小时
            console.log("一轮喊完了")
            storage.put(today,{e_career:"战士", e_war:"", e_count:0 ,e_time:addRandomMinutes(1,2)})
        }else{
            console.log("更换职业")
            storage.put(today,{e_career:careers[index+1], e_war:"", e_count:0 ,e_time:0})
        }
        return false
    }

    // 在排行榜界面
    console.log(`  * 是否在这个界面 :${care.e_career},`,)
    if (select(reData,"每日服务器")) {
        // 点击战斗力按钮
        console.log("  * 选择职业 下拉框")
        // 选择职业 下拉框
        if (select(reData,"战士") && select(reData,"法师")) {
            return selclick(reData, care.e_career.trim());
        }
        
        // 没有选择分组
        console.log("  * 全部",care.e_career.trim())
        if (select(reData,"全部")) { // 才打开不是当前分组
            if (selclick(reData,"全部")) {
                return 
            }
        }
        if (select(reData, care.e_career.trim()) == null){
            console.log("select(reData, care.e_career.trim())",select(reData, care.e_career.trim()))
            if (selclick(reData,"战斗力（".trim()) || selclick(reData,"战斗力 (".trim())) {
                return
            } 
        }
        console.log("  * 记录战斗力")
        // 记录战斗力
        if (select(reData,care.e_career.trim())) {
            // 开始挑选
            console.log("  * 开始挑选",care.e_war)
            toast(care.e_count)
            // 重新截图
            let img = captureScreen(); 
            let croppedImage = images.clip(img, 1097, 305, 91, 402); // 战斗力
            imgRecycle(img);
            let crop = getOcr(croppedImage);
            imgRecycle(croppedImage);
            if (care.e_war == 0) {
                //  未点击过
                if (crop) {
                    // console.log(crop[0][1])
                    storage.put(today,{e_career:care.e_career, e_war:crop[0][0][1][0], e_count:1 ,e_time:0})
                    if (selclick(reData,crop[0][1][0])) {
                        return true;
                    }
                }
            }else{
                let startTime = Date.now();  // 获取当前时间（毫秒）
                while (Date.now() - startTime < 5*1000*60) {  // 等待5分钟
                    let img = captureScreen();
                    let grayscaleImage = images.grayscale(img); 
                    // let croppedImage = images.clip(img, 1097, 305, 91, 402); // 战斗力
                    // let croppedImage2 = images.clip(img, 200, 645, 48, 38); // 100 排名
                    let care = storage.get(today)  
                    imgRecycle(img);

                    let reData = getOcr(grayscaleImage);
                    // let crop = getOcr(croppedImage,"ch");
                    // let crop2 = getOcr(croppedImage2,"ch");
                    if (reData) {
                        let crop = getData(reData, 1097, 305, 91, 402);
                        let crop2 = getData(reData,  200, 645, 48, 38);

                        if (select(reData,"其他玩家")) {
                            break
                        }
                        // console.log("Data ",crop2[0][1][0])
                        // console.log("Data ",crop2.length)
                        // imgRecycle(croppedImage);
                        // imgRecycle(croppedImage2);
                        // console.log("获取排名 :")
                        if (crop2) {
                            // console.log(crop2)
                            if (crop2.length > 0) {
                                if (crop2[0][1][0].trim() == 100 ) {
                                    console.log("到头了",crop2);
                                    // 点击右上角退出
                                    clickWithDelay(1235,41,2000); // 关闭窗口
                                    return true
                                }
                            }
                        }
                        // console.log("获取排名结束 :",care.e_war)
                        //  截图获得战力是否匹配我要的
                        // console.log("内置数据 ",care)
                        if (crop) {
                            let nt = getNextText(crop,care.e_war)
                            // console.log("获取的nt :",nt)
                            if (nt != null) {
                                console.log("  * 点击这个 :")
                                selclick(reData,nt);
                                storage.put(today,{e_career:care.e_career, e_war:nt, e_count:care.e_count + 1 , e_time:0})
                                // sleep(1500);
                                return true;
                                // break
                            }
                            console.log("  @ 滑动一下")
                            swipe(1128, 657, 1128, 375, 200)
                        }
                    }else{
                        break
                    }
                }
            }
            return
        }
    }
 
    // 打开了 设置
    if (select(reData,"快速设置")) {
        if (selclick(reData,"排位",true)) {
            return true
        }
    }

    // 在游戏界面
    if (select(reData,"近距",true) || select(reData,"卡组变更",true)||select(reData,"安全",true) ) {
        console.log("在游戏界面")
        clickWithDelay(1230,29,1200);
        return 
    }
}

function packageNameEndsWith(suffix) {
    // 查找所有的控件
    let nodes = className("android.widget.FrameLayout").find();
    // 遍历控件列表
    for (let i = 0; i < nodes.size(); i++) {
        let node = nodes.get(i);
        // 使用 endsWith 检查包名是否以指定的后缀结尾
        if (node.packageName().endsWith(suffix)) {
            return true;  // 找到匹配的控件，返回 true
        }
    }
    
    // nodes.recycle();  // 如果没有找到匹配的控件，释放资源
    return false;  // 没有找到匹配的控件，返回 false
}

function init() {
    // 检查权限 无障碍
    if (!auto.service) {
        auto();
        throw new Error("请求无障碍权限失败");
    }
    // 锁屏了就打开
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded() // 唤醒
        swipe(232, 1000, 232, 200, 800);  // 打开
    }
    if (!requestScreenCapture(true)) {
        // throw new Error("请求屏幕捕获权限失败");
        console.log("请求屏幕捕获权限失败")
    }
    if (!packageNameEndsWith("mir4global")) {
        app.launch('com.wemade.mir4global')
        sleep(3000);
        return true
    } 
    return false
}

/**
 * 首先脚本工作是需要截图和OCR支持的没有就无法工作
 * 那么我先去检查权限再去请求截图和识别内容才能开始工作
 */
function main(){
    //  无障碍和截图权限
    if (init()) {
        return
    }
    // 进行截图
    // 裁剪等级
    let img = captureScreen(); 
    if (!img) {
        console.log("截图失败");
        return ;
    }
    // 对图片二级化处理 
    let grayscaleImage = images.grayscale(img);

    //  裁剪等级
    let croppedImage = images.clip(img, 11, 0, 60, 32);

    // 判断是否选择了怪
    let clors =  images.pixel(img, 522,41);   

    //  是否在寻路
    let imgtext = clip(img,[[1180 ,145],[1263 ,145],[1263 ,148 ],[1180 ,148]])  
    let blue = isblue(imgtext)  //  获取任务区域的颜色
    imgRecycle(imgtext)


    let Data = imgOcrData(grayscaleImage);
    imgRecycle(grayscaleImage);
    if (Data) {
        //  处理弹窗
        if (wrong(Data)) {return } //  处理异常弹窗

        //  要是在登陆界面
        if(select(Data, 'WEMADE.ALL') ){
            // 进入游戏
            if (selclick(Data, '点击')) {
                // console.log("点击界面进入游戏");
                sleep(5000);
                return
            }
            if (selclick(Data, '确定')) {
                // console.log("点击界面进入游戏");
                sleep(5000);
                return
            }
            if (select(Data, '退出登录') ) {
                if (!select(Data, '选项')) {
                    app.launch('com.wemade.mir4global');
                    sleep(5000);
                }
            }
            if (selclick(Data, '加载补丁中')) {   // 加载补丁中
                console.log("加载补丁中 等待5秒")
                sleep(5000);
                return
            }
            return
        }else{
            // console.log("选择角色  ")
            //  选择角色界面
            if(select(Data, '选择角色')){
                // 开始游戏
                if (selclick(Data, '开始游戏')) {
                    sleep(5000);
                    return 
                }
            }
        }

        if (select(Data,"和平",true) || select(Data,"近距",true) || select(Data,"卡组变更",true)) {
            let lvData = getOcr(croppedImage);
            imgRecycle(croppedImage);
            getlv(lvData) // 获取等级
        }

        //  创建角色
        if (create(Data)) {return } 
        // 处理小青龙教程
        if (Loong(Data)) {return }
        //  处理强化 制造 加点
        if (Console(Data)) {return } 

        let lv = storage.get("lv",0)
        console.log(`人物当前等级: ${lv} `); // 当前等级

        // 关闭所有的窗口
        if (closeX(Data)) {return } 

        // TODO 排行榜 是否是第一个账号
        if (lv >= 10 ) {
            return Ranking(Data)
        }
        if (lv < 10) {
            if (checkAndClick(Data, '指南', 1226, 38, 2000)) return true;
        }

        //  是否在自动做任务
        console.log(`是否在自动做任务: ${blue.blue}`)
        if (blue.blue) {
            click(945,574); // 奔跑
            sleep(2000);
        }else{
            // 加入限定的条件 
            if (select(Data,"和平",true) || select(Data,"近距",true) || select(Data,"卡组变更",true) || select(Data,"安全",true) || select(Data,"普通",true)) {
                console.log(" . ");
                clickWithDelay(1122.5,187,2000);    
            }
        }

        // console.log(`剧情任务1`)
        //  ********   剧情任务
        // 漆黑的密道
        if (select(Data, '漆黑的')) {
            if (select(Data, '开采岩窟花树液')) {
                sleep(2000);
                clickWithDelay(644.5,274.5,6000); 
                // clickWithDelay(644.5,274.5,6000);  备选
                return
            }
            if (select(Data,"同伴就在") && selclick(Data, '前往')) {
                return
            }
            if (select(Data,"与剑啸")) {
                sleep(1000);
                clickWithDelay(223, 560,50) ;
                clickWithDelay(223, 560,1000) ;
                return
            }

            if (selclick(Data,"3.与京")) {
                return sleep(5000);
            }
            return
        }    

        // console.log(`剧情任务2`)
        // 危险的救援计划
        if (select(Data, '危险的救')) {
            if (select(Data, '与芊菲对话')) {
                clickWithDelay(223, 560,50) ;
                clickWithDelay(223, 560,50) ;
                clickWithDelay(223, 560,50) ;
                return
            }
            if (select(Data, '开启牢门')||select(Data, '救出芊')) {
                sleep(1000);
                return clickWithDelay(644.5,274.5,8000);
            }
            return
        }
        // console.log(`剧情任务3`)
        // 武功修炼
        if (select(Data, '武功修炼')) {
            if (select(Data, '摧毁木') && selclick(Data, '跳过')) {
                // 点击攻击按钮
                clickWithDelay(1197,625,500);  // 攻击键
                clickWithDelay(1197,625,500);  // 攻击键
            }
            return
        }
        // console.log(`剧情任务4`)
        // 岁月静好
        if (select(Data, '岁月静好')) {
            if (select(Data, '跳过')) {
                if (select(Data, '12.与京')) {
                    //  制作武器的节点
                    if (select(Data, '制造武器')) {
                        sleep(3000);
                        clickWithDelay(1225,26,2000); // 菜单
                        clickWithDelay(1028,216,2000);  // 制作工坊
                        clickWithDelay(935,310,3000);  // 制作工坊
                        clickWithDelay(71,367,2000);  //   点击高级
                        clickWithDelay(575,300,1000); // 说明 点击武器
                        clickWithDelay(575,300,2000); // 点击武器
                        clickWithDelay(1125,676,3000);
                        click(723,600); //  穿戴
                        clickWithDelay(1230,29,1200); // 关闭窗口
                    }
                }
                if (select(Data, '5.击败') && selclick(Data, '跳过')) {
                    sleep(1200);
                }
                return
            }else{
                if (selclick(Data, '跳过')) {
                    return
                }
            }
            return
        }
        // console.log(`剧情任务5`)
        // 追踪痕迹
        if (select(Data, '追踪痕迹')) {
            if (select(Data, '寻找芊')) {  // 精灵
                sleep(2000);
                if (select(Data, '请点击全部')) {
                    clickWithDelay(1225,26,2000);
                    clickWithDelay(1120,102,3000); // 点击精灵
                    clickWithDelay(937,197,4000);  // 点击精灵
                    clickWithDelay(820,266,3000);  // 点青龙
                    clickWithDelay(1150,667,4000);  // 召唤
                    clickWithDelay(1150,667,4000);  // 召唤
                    clickWithDelay(1150,667,4000);  // 出战
                    clickWithDelay(826,122,2000);   // 点卡槽
                    return clickWithDelay(1230,29,1000); // 点出去
                }
                if (select(Data, '请点击按键')) {
                    clickWithDelay(1120,102,3000); // 点击精灵
                    clickWithDelay(937,197,4000);  // 点击精灵
                    clickWithDelay(820,266,3000);  // 点青龙
                    clickWithDelay(1150,667,4000);  // 召唤
                    clickWithDelay(1150,667,4000);  // 召唤
                    clickWithDelay(1150,667,4000);  // 出战
                    clickWithDelay(826,122,2000);   // 点卡槽
                    return clickWithDelay(1230,29,1000); // 点出去
                }
                return
            }
            if (selclick(Data, '寻得蛊')) {
                sleep(1500);
                clickWithDelay(326,638,3000);
                return click(326,638);
            }
            if (selclick(Data, '强化技能')) {
                sleep(4000);
                swipe(273, 100, 273, 700, 1000); 
                let img = captureScreen();
                let Data = getOcr(img,"ch");
                imgRecycle(img)
                if (Data) {
                    if (selclick(Data, '暴血花')) {
                        sleep(4000);
                    }
                    if (selclick(Data, '学习',true)) {
                        sleep(3000);
                    }
                
                    img = captureScreen();
                    Data = getOcr(img,"ch");
                    imgRecycle(img)
                    if (selclick(Data, '饿鬼')) {
                        sleep(2000);
                        if (selclick(Data, '强化')) {
                            sleep(3000);
                            click(1230,25);
                        }
                    }
                }
                return
            }
            return
        }
        // console.log(`剧情任务6`)
        // 黑暗之影      委托
        if (select(Data, '黑暗之影')) {
            if (select(Data, '请点击活')) {
                clickWithDelay(168,100,2000); // 点击活力
                clickWithDelay(402,533,500);  
                clickWithDelay(402,533,500);
                clickWithDelay(402,533,2000); // 活力补充按钮

                clickWithDelay(778,441,500);  // max 未起效
                clickWithDelay(778,441,500);  // max
                clickWithDelay(778,441,500);  // max
                clickWithDelay(778,441,800);  // max
                clickWithDelay(725,536,500);// 点击使用
                return
            }
            if (select(Data, '强化体质')) {
                sleep(2000);
                for (let index = 0; index < 6; index++) {
                    // 法伤
                    if (index == 0) {
                        click(885,334);
                    }
                    //  命中
                    if (index == 1) {
                        click(1087,278);
                    }
                    // 生命
                    if (index == 3|index == 4|index == 5) {
                        click(860,221);
                    }
                    // // 魔力
                    // if (index == 6) {
                    //     click(1111,221);
                    // }
                    sleep(700);
                    clickWithDelay(1040,672,3000);
                }
                return clickWithDelay(1230,25,1000); // 关闭
            }
            if (select(Data, '采集森')) {
                sleep(8000)
                clickWithDelay(326,638,8000);
                return click(326,638,2000);
            }
            //  这个背景是蓝色的 导致识别不正确
            if (select(Data, '击败跑来')) {
                if (clors != -13553096) { 
                    // selclick(Data, '击败跑来')
                    clickWithDelay(1197,625,3000);
                    return
                }  
            }
            if (selclick(Data,"与陈生")){
                sleep(2000);
            }
            if (selclick(Data,"拜见师父")){
                sleep(3000);
            }
            return
        }

        // 寻求灵药
        if (select(Data,"寻求灵药")) {
            if (selclick(Data, '7.与')) {
                return sleep(4000);
            }
            if (selclick(Data, '8.制')) {
                sleep(4000);
                clickWithDelay(1125,676,3000);
                clickWithDelay(723,600,3000); //  穿戴
                return clickWithDelay(1230,29,1000);
            }

            //  这个不可以自动
            if (select(Data, '22.带') || selclick(Data, '跳过')) {
                sleep(1200);
                swipe(208, 543, 208, 400, 5000); 
                selclick(Data, '22.带')
                return sleep(21000);
            }
            if (select(Data, '21.获')) {
                sleep(20000);
                clickWithDelay(326,638,4000);
                return click(326,638);
            }
            if (selclick(Data, '3.采')) {
                sleep(3000);
                clickWithDelay(326,638,8000);
                return click(326,638);
            }
            if (selclick(Data, '6.修炼')) {
                selclick(Data, '跳过')
                sleep(2000)
                let img = captureScreen();
                let ocrResults = getOcr(img,"ch");
                imgRecycle(img)
                if(ocrResults){
                    for (let i = 0; i < 7; i++) {
                        sleep(2000);
                        // 天宫   1070,162   
                        if (i==0||i==1||i==2) {
                            click(1070,162);
                        }

                        // 持律   1070,219 
                        if (i==3||i==4||i==5) {
                            click(1070,219);
                        }

                        if (i==6) {
                            click(1070,278);
                        }

                        click(1070,666); // 点击修炼
                        sleep(4000);
                        click(1070,666); // 点击修炼
                        click(1070,666); // 点击修炼
                        // 脉天   1070,278

                        // 太定   1070,340
                    }
        
                    // 关闭
                    click(1230,29);
                    sleep(2000) ;
                }
                return
            }
            return
        }
        //  跳过
        reai = select(Data,"跳过")
        if (reai) {
            item = reai[0][0][0]
            if (item > 1100) {
                selclick(Data,"跳过")
                return sleep(2000);
            }
        }
        if (selclick(Data,"《器")) {
            return sleep(3000);
        }
        if (lv < 10 ) {
            console.log("点击画面")
            clickWithDelay(223,560,50) ; // 点击画面
            clickWithDelay(223,560,50) ; // 点击画面
            clickWithDelay(223,560,50) ; // 点击画面
        }
    }
}

// storage.put(today,{e_career:'弩手', e_war:0, e_count:0 ,e_time:0}) 
// for (let i = 0; i < 10; i++) {
    main()
// }

// console.log(storage.get(today))




// let img = captureScreen();
// let grayscaleImage = images.grayscale(img); 

// let croppedImage = images.clip(img, 1097, 305, 91, 402); // 战斗力
// let croppedImage2 = images.clip(img, 200, 645, 48, 38); // 100 排名

// let reData = getOcr(croppedImage2);
// console.log("data",reData)
// selclick(reData,"排位")



// console.log(storage.get(today))

// swipe(1128, 657, 1128, 475, 333)

// shell("adb shell am force-stop org.mutou.mutou.v6");
// powerDialog()

