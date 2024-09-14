// 设置服务器地址
var SERVER_URL = "http://192.168.0.119:5000/ocr";

var Shout = "加我QQ 有好东西"

var  Save = false  // true   false 

var width_screenshot = 1285
var height_screenshot = 720

var storage = storages.create("ABC");


// OCR请求
function getOcr(img, lang) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            lang: lang  ,// 动态设置语言
            save: Save // true   false 
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson(SERVER_URL, jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // 设置超时时间为10秒
        });
        
        if (response.statusCode == 200) {
            return JSON.parse(response.body.string());
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
    }
    return null;
}

// 请求颜色
function getCl(img, x1,y1) {
    // var grayscaleImage = images.grayscale(img);  // 灰度处理
    // var binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");     // 二级化
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            x: x1  , 
            y: y1  
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson("http://192.168.0.119:5000/color", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // 设置超时时间为10秒
        });
        
        if (response.statusCode == 200) {
            return JSON.parse(response.body.string());
        } else {
            console.error(" getCl 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        toast("请求失败: ",e)
        console.error("请求失败: ", e);
    }
    return null;
}

// 请求是否是蓝色
function isblue(img) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            save: Save // true   false 
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson("http://192.168.0.119:5000/is_blue", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
            timeout: 10000 // 设置超时时间为10秒
        });
        
        if (response.statusCode == 200) {
            return JSON.parse(response.body.string()).mostly_blue;
        } else {
            console.error(" isblue 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        toast("请求失败: ",e)
        console.error("请求失败: ", e);
    }
    return null;
}

// 初始化
function init(){
    // 权限检查
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
        return false
    }
    let currentPkg = currentPackage();
    // 是否在游戏
    if (currentPkg == "com.wemade.mir4global" || currentPkg =="android"){
        return true
    } else {
        toast("目前不在游戏")
        app.launch('com.wemade.mir4global')
        sleep(1000);
        app.launch('com.wemade.mir4global')
        sleep(3000);
    }
    return false
   
}

/** 在一定时间等待指定文字出现
 * 
 * @param {string} str 
 * @param {number} time 
 * @returns 
 */
function wait(str, time) {
    let startTime = Date.now();  // 获取当前时间（毫秒）
    
    while (Date.now() - startTime < time) {
        // 尝试找到指定的内容
        let img = captureScreen();
        var reData = getOcr(img,"ch");
        imgRecycle(img)
        if (reData) {
            let top = select(reData,str)
            if (top) {
                return true
            }
        }

        sleep(3000);  // 等待 3000 毫秒再继续查找
    }
    // 超时返回
    return false
}

/** 执行点击操作并等待指定时间。
 *
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} text - 要查找的文本。
 * @param {number} waitTime - 点击后等待的时间，单位为毫秒。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function handleClickAndWait(reData, text, waitTime, exactMatch) {
    waitTime = (waitTime !== undefined) ? waitTime : 5000;
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    let found = selclick(reData, text, exactMatch);
    if (found) {
        console.log(`点击"${text}"，等待 ${waitTime / 1000} 秒`);
        sleep(waitTime);
        return true;
    }
    return false;
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
        console.error("OCR 结果不是数组");
        return null;
    }

    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            if (exactMatch) {
                if (item.text === targetText) {
                    console.log("找到目标文本:", item);
                    return item;
                }
            }else{
                if (item.text.includes(targetText)) {
                    console.log("模糊查找目标文本:", item.text);
                    return item;
                }
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
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
        let centerX = (target.box[0][0] + target.box[2][0]) / 2;
        let centerY = (target.box[0][1] + target.box[2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        let x_phone = (centerX / width_screenshot) * device.height;
        let y_phone = (centerY / height_screenshot) * device.width;

        console.log(`点击${src}: x=${x_phone}, y=${y_phone}`);

        // 点击坐标
        code = click(x_phone,y_phone);
        if (!code) {
            console.log(`selclick ${src} 点击失败`)
        }
        return true
    }else{
        return false
    }
}

/** 点击偏移文本
 * 
 * @param {Array} target  数据
 * @param {number} x 偏移量
 * @param {number} y 偏移量
 */
function textClick(target,x,y){
    // 计算文本区域的中心点
    let centerX = (target.box[0][0] + target.box[2][0]) / 2;
    let centerY = (target.box[0][1] + target.box[2][1]) / 2;

    // 将坐标从截图转换到设备屏幕坐标
    let x_phone = (centerX / width_screenshot) * device.height;
    let y_phone = (centerY / height_screenshot) * device.width;

    console.log(`点击${target.text}: x=${x_phone}, y=${y_phone}`);

    // 点击坐标
    click(x_phone+x,y_phone+y);
}

/** 通用裁剪函数
 * 
 * @param {*} img 
 * @param {Array} box 
 * @returns 
 */
function cropImage(img, box) {
    var x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    var x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    var y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    var y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    return images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);
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

//  释放资源
function imgRecycle(params) {
    if (params) {
        // 释放图片资源
        params.recycle();
        // 将参数设为null，帮助垃圾回收
        params = null;
    }
}

//  获取等级
function getlv(lvData){
    if (!Array.isArray(lvData)) {
        // console.error("111 OCR 结果不是数组");
        return null;
    }

    for (let i = 0; i < lvData.length; i++) {
        let item = lvData[i];
        if (item && item.text !== undefined) {
            if (item.text.includes("级")) {
                let index = item.text.indexOf('级');
                let numberBeforeLevel = item.text.slice(0, index).trim();
                storage.put("lv", numberBeforeLevel);
                return numberBeforeLevel;
            }
        }
    }
    return null ;
}

//  ************************处理游戏内容*****************************************


// 处理弹窗函数
function wrong(reData) {
    // 服务器连接断开 -> 前往登录
    if (select(reData, "服务器连接断开")) {
        return handleClickAndWait(reData, '前往登录');
    }

    // 网络问题 -> 重新尝试   TODO 这里要杀掉整个游戏才行 需要root权限
    if (select(reData, "网络套")) {
        return handleClickAndWait(reData, '重新尝试', 5000, true);
    }

    // 重新尝试
    if (select(reData, "重新尝试")) {
        return handleClickAndWait(reData, '重新尝试');
    }

    // 据点复活
    if (selclick(reData, "据点复活")) {
        console.log("点击据点复活，等待5秒");
        sleep(5000);
        return true;
    }

    // 说明 -> 确认 或 结束
    if (select(reData, "说明")) {
        if (handleClickAndWait(reData, '确认') || handleClickAndWait(reData, '结束', 2000)) {
            return true;
        }
    }

    // 警告 -> 确认
    if (select(reData, "警告")) {
        return handleClickAndWait(reData, '确认');
    }

    // 错误 -> 确认 或 游戏结束
    if (select(reData, "错误")) {
        if (handleClickAndWait(reData, '确认', 5000, true) || handleClickAndWait(reData, '游戏结束', 5000, true)) {
            return true;
        }
    }

    // 关闭广告 -> 今日不
    if (selclick(reData, '今日不')) {
        // textClick(reData, 920, 0);
        click(1137,608)
        console.log("点击关闭广告");
        sleep(3000);
        return true;
    }

    // Loading 界面
    if (select(reData, "Loading")) {
        // toast("Load 界面，等待5秒");
        sleep(5000);
        return true;
    }

    return false;
}

// 关闭窗口
function closeX(reData){
    if (checkAndClick(reData, '伪像切换', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '大地图', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '闭关修炼', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '可佩戴', 948, 200, 2000)) {
        click(1150, 675); // 购买
        sleep(2000);
        click(1150, 675); // 乘骑设置
        sleep(2000);
        click(1230, 29); // 乘骑设置
        sleep(2000);
        return true;
    }
    
    if (checkAndClick(reData, '龙神器', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '切换频道', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '一键删除', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '合成魔', 1230, 29, 2000)) return true;
    
    // 利用活力
    if (checkAndClick(reData, '利用活力', 223, 560, 1200)) return true;
    if (checkAndClick(reData, '战斗设置', 1235, 41, 2000)) return true;
    if (checkAndClick(reData, '快捷栏设置', 1235, 41, 2000)) return true;
    if (checkAndClick(reData, '特殊强化', 1230, 29, 2000)) return true;
    if (checkAndClick(reData, '精灵合成', 1230, 29, 2000)) return true;

    // 活力补充
    if (checkAndClick(reData, '活力补充', 950, 164, 2000)) return true;

    if (checkAndClick(reData, '角色', 1196, 52, 2000)) return true;
    if (select(reData,"输入数字") &&  selclick(reData,"取消") ) {
        sleep(2000);
        return true
    }
    if (checkAndClick(reData, '中型生命', 1219, 94, 2000)) return true;

    // 滑动
    if (!select(reData, "前往狭窄的通道")) {
        if (select(reData, "请拖拽虚拟摇杆进行移动")) {
            swipe(232, 455, 232, 200, 3000);
            return true;
        }
    }

    return false
}

//  关闭通知
function closeNote(reData,src) {
    var target = select(reData, src)
    // console.log(target)
    if (target) {
        let centerY = (target.box[0][1] + target.box[2][1]) / 2;
        let y_phone = (centerY / height_screenshot) * device.width;
        // console.log(`点击${src}: x= 1166, y=${y_phone}`);
        let code = click(1166,y_phone);
        return code
    }
    return false
}

//  处理轻功的部分
function handleQingGong(reData) {
    let qinggongSteps = [
        {text: "看到轻功按键了吗", x: 1221, y: 400},
        {text: "触发2段跳跃", x: 1221, y: 400},
        {text: "对墙壁点击", x: 1221, y: 400},
        {text: "瞬间快速地", x: 1060, y: 531, extraClick: [1204, 400]}
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

// 小青龙浩龙剧情提示
function Loong(reData){
    if (!select(reData, "小青龙浩")) return false;

    if (select(reData, '同伴就在附近') && selclick(reData, '前往京一')) {
        sleep(2000);
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
    // if (checkAndClick(reData, '带回千年', 1230, 29, 3000)) return true;
    if (select(reData,"带回千年") && selclick(reData,"跳过")){
        sleep(1000);
        return true
    }
    if (select(reData,"发现了个好") && selclick(reData,"跳过")){
        sleep(1000);
        return true
    }

    //  -------- 轻功
    if (handleQingGong(reData)) return true;
    
    if (select(reData,"还要再跳一次")){  // 跳跃2次
        click(1221,400);
        sleep(2000);
        click(1221,400);
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

    // ----   操作类的
    //  设置药剂 和 技能频率
    if (select(reData,"尝试上下" && selclick(reData,"跳过"))) return true;
    if (select(reData,"各种自动")){
        click(668,659);
        sleep(3000);

        click(1195,595);  // 技能释放频率
        click(1195,595);  // 技能释放频率
        sleep(700);
        // click(1195,441);  // 战斗自动锁定
        // click(1195,367);  // 复活时自动返回
        sleep(700);
        click(1195,297);  // 队伍共享目标
        sleep(700);
        click(642,443);  // 结束 说明弹窗
        click(1195,224);  // 围绕队长战斗
        sleep(1500);
        click(642,443);  // 结束 说明弹窗
        sleep(700);
        click(1235,41) // 关闭窗口

        return true
    }
    if (select(reData,"使用频率")){
        sleep(4000);
        click(1195,595);  // 技能释放频率
        click(1195,595);  // 技能释放频率
        sleep(700);
        // click(1195,441);  // 战斗自动锁定
        // click(1195,367);  // 复活时自动返回
        sleep(700);
        click(1195,297);  // 队伍共享目标
        sleep(700);
        click(671,660);  // 结束 说明弹窗
        click(1195,224);  // 围绕队长战斗
        sleep(1500);
        click(671,660);  // 结束 说明弹窗
        sleep(700);
        click(1235,41) // 关闭窗口
        return true
    }
    
    //  制作武器
    if (selclick(reData,"需要新的武器")){
        sleep(2000);
        return true
    }
    if (selclick(reData,"在这里选择想要")){
        sleep(2000);
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
        click(1230,29); // 关闭窗口
        sleep(1200)
        return true
    }

    //  精灵
    if (selclick(reData,"最佳帅气帮手")){
        sleep(3000);
        return true
    }
    if (selclick(reData,"才能召唤精")){
        sleep(1000);
        return true
    }
    if (select(reData,"快来召唤我")){
        click(1149,674);
        sleep(500);
        click(1149,674);
        sleep(1000);
        return true
    }
    if (selclick(reData,"不同的技能")){
        sleep(1000);
        return true
    }
    if (select(reData,"未出战的")){
        click(1149,674);
        sleep(500);
        click(1149,674);
        sleep(1000);
        return true
    }
    if (checkAndClick(reData, '一直跟随', 820,110, 1000)) return true;
    if (checkAndClick(reData, '展示精灵', 1230,29, 2000)) return true;
    if (select(reData, '追踪痕迹')  &&  select(reData, '技能强化') && selclick(reData,"跳过") ) {
        sleep(1000);
        return true    
    }
    if (select(reData, '一下委托')  && selclick(reData,"跳过") ) {
        sleep(1000);
        return true    
    }

    // 技能强化
    if (select(reData,"学习有关") && selclick(reData,"跳过")){
        sleep(1000);
        return true
    }
    if (select(reData,"可以比他强") && selclick(reData,"跳过")){
        sleep(1000);
        return true
    }

    // 魔石
    if (selclick(reData,"如何使用魔")){
        sleep(3000);
        return true
    }
    if (checkAndClick(reData, '为你准备的', 814,183, 1000)) return true;
    if (selclick(reData,"魔石也有")){
        sleep(1000);
        return true
    }
    if (checkAndClick(reData, '选择魔石栏', 1150,666, 1000)) return true;
    if (select(reData,"点击这里的装备") && selclick(reData,"跳过") ){ 
        sleep(1000);
        return true
    }
    if (select(reData,"成功镶嵌") && selclick(reData,"跳过") ){
        sleep(1000);
        return true
    }

    // 内功
    if (select(reData,"如何修炼") &&  selclick(reData,"跳过")){
        sleep(3000);
        return true
    }

    //  强化体质
    if (select(reData,"有强化体质")&& selclick(reData,"跳过")){
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

    // 
    if (select(reData,"设置药水") && selclick(reData,"跳过")){ 
        sleep(1000);
        return true
    }

    //  坐骑
    if (selclick(reData,"有关坐骑的")){ 
        sleep(1000);
        return true
    }
    if (select(reData,"各种各样的坐骑") && selclick(reData,"跳过")){ 
        sleep(1000);
        return true
    }
    if (selclick(reData,"每个坐骑都有") && selclick(reData,"跳过")){ 
        sleep(1000);
        return true
    }
    return false
}

// 制造 强化 合成 魔石 坐骑
function Console(reData) { 
    // 检查并点击菜单按键
    if (select(reData, '请点击全部菜单按键')) {
        clickWithDelay(1228, 28, 2000);
        return true;
    }

    // 检查并点击菜单项
    let menuItem = select(reData, '请点击菜单按键');
    if (menuItem) {
        var item = menuItem.box[0][0]
        var item2 = menuItem.box[1][1]
        console.log(`请点击菜单按键: ${item}`);

        if (item === 816.0) {
            clickWithDelay(1028, 216, 2000); // 制造工坊
            return true;
        }
        if (item === 900.0) {
            clickWithDelay(1120, 105, 2000); // 精灵
            return true;
        }
        if ((item > 727.0 && item < 731.0) || item2 === 156.0) {
            clickWithDelay(945, 109, 2000); // 角色
            clickWithDelay(939, 222, 0);
            return true;
        }
        if (item2 > 380.0) {
            selclick(reData, '跳过');
            return true;
        }
        if (selclick(reData, '跳过')) {
            console.log("$$$$$$$$$$$$ 请点击菜单按键 跳过");
            sleep(3000);
            return true;
        }
    }

    // 检查并点击按键
    let buttonItem = select(reData, '请点击按键');
    if (buttonItem) {
        var item = buttonItem.box[0][0]
        var item2 = buttonItem.box[1][1]
        console.log(`请点击按键: ${item}`);

        if (item === 754.0 || item === 752.0) {
            clickWithDelay(935, 310, 1000); // 制造
            return true;
        }
        if ((item > 203.0 && item < 207.0) && select(reData, '可佩戴')) {
            clickWithDelay(444, 30, 2000); // 坐骑
            return true;
        }
        if (item <= 213.0 && item >= 167.0) {
            clickWithDelay(71, 367, 1000); // 高级
            return true;
        }
        if (item === 750.0 || item === 751.0) {
            clickWithDelay(940, 200, 1000); // 精灵
            return true;
        }
        if (item >= 842.0 && item <= 845.0) {
            clickWithDelay(1025, 195, 2000); // 辅助装备
            return true;
        }
        if ((item > 935.0 && item <= 938.0) && item2 < 240.0) {
            clickWithDelay(1123, 200, 2000); // 辅助装备
            return true;
        }
        if (selclick(reData, '跳过')) {
            console.log("############## 请点击按键 跳过");
            sleep(4000);
            return true;
        }
    }

    // 传承装备
    if (select(reData, '传承装备') && select(reData, '请点击。')) {
        let item = select(reData, '请点击。').box[0][0];
        console.log(`请点击.: ${item}`);
        if (item === 754.0 || item === 396.0) {
            clickWithDelay(290, 200, 1000); // 制造
            return true;
        }
    }

    // 推荐佩戴
    if (select(reData, '推荐佩戴')) {
        clickWithDelay(723, 600, 1000); // 穿戴
        return true;
    }

    // 点击画面
    if (selclick(reData, '点击画面')) {
        sleep(2000);
        return true;
    }

    // 完成
    let finishItem = select(reData, '完成', true);
    if (finishItem && finishItem.box[0][0] < 1037) {
        clickWithDelay(1020, 227, 2000);
        return true;
    }

    // 选择武器
    if (select(reData, '来挑选一下')) {
        clickWithDelay(809, 200, 2000);
        return true;
    }

    // 中型生命值
    if (select(reData, "中型生命值")) {
        if (selclick(reData, "中型生命值")) {
            sleep(2000);
            clickWithDelay(778, 393, 1000);
            clickWithDelay(778, 393, 1000);
            clickWithDelay(778, 393, 1000);
            clickWithDelay(778, 393, 1000);
            clickWithDelay(778, 393, 1000);
            clickWithDelay(778, 393, 1000);
            clickWithDelay(800, 495, 2000);
        }
        if (selclick(reData, "中型魔力恢复")) {
            sleep(2000);
            clickWithDelay(853, 390, 4000);
            clickWithDelay(775, 489, 1000);
            clickWithDelay(775, 633, 2000);
            clickWithDelay(800, 495, 2000);
        }
        clickWithDelay(1219, 94, 2000);
        return true;
    }

    return false;
}

//  领取奖励
function reward(reData) {
    // 领取邮箱
    if (select(reData, '一键删除')) {
        var img = captureScreen();
        // 账号
        if (images.pixel(img, 163, 75) == -1935584) {
            click( 163, 75);
            sleep(2000);
        }

        // 系统
        if (images.pixel(img, 163, 151) == -1935584) {
            click( 163, 151);
            sleep(2000);
        }


        // 报告
        if (images.pixel(img, 163, 443) == -1935584) {
            click( 163, 443);
            sleep(2000);
        }
            
        imgRecycle(img);
        // 全部领取
        click(1151,105);
        sleep(4000);
        click(1151,105);
        click(1230,29);
        sleep(1000);

        return true
    }

    //  领取成就  
    if (selclick(reData, '可领取成就奖励')) {
        sleep(2000);
        return true
    }
    if ( selclick(reData, '一键领取')) {
        click(1206,103);
        sleep(3000);
        click(1206,103);  // 点击画面
        sleep(1000);
        click(1230,29);  // 退出
        sleep(2000);
        return true
    }

    if (selclick(reData, '请领取每日课题奖励')) {
        sleep(2000);
        return true
    }
    if (select(reData, '每日课题现状')) {
        click(1140,179); // 点击领取
        sleep(4000);
        click(1140,179);
        
        click(647,179); // 点击领取

        click(1140,179);  // 点击画面
        sleep(1000)

        click(1230,29);  // 退出
        sleep(2000);
        return true
    }

    //  接触封印   
    // if (selclick(reData, '可解除道具封印。')) {
    //     sleep(2000);
    //     return true
    // }
    // if (select(reData, '正在解除封印')) {
    //     sleep(3000)
    //     click(813,198); // 先获取 
    //     sleep(2000)
    //     click(613,100); // 先获取 
        
    //     click(813,198); // 上架盒子解密 
    //     sleep(200)
    //     click(813,198); // 上架盒子解密 
    //     sleep(200)
    //     click(813,198); // 上架盒子解密 
    //     sleep(200)
    //     click(813,198); // 上架盒子解密 
    //     sleep(200)

    //     sleep(400)
    //     click(1230,29);  // 退出
    //     sleep(2000);
    //     return true
    // }

    // 存在可召唤的精灵
    if (selclick(reData, '存在可召唤的精灵')) {
        sleep(2000);
        return true
    }
    if (select(reData, '出战效果')) {
        //  重新截图拿到最新的
        var img = captureScreen();
        if (images.pixel(img, 939, 247) == -1935584 ) {
            click(939, 247);
            // 点击召唤  
            sleep(2000);
            click(1130,666);
            sleep(1000)
            click(1130,666);
            sleep(1000)
            // 点击上面的位置
            click(916,121);
            sleep(2000);
        }
        if (images.pixel(img, 1034, 247) == -1935584 ) {
            sleep(1000);
            click(1034, 247);
            // 点击召唤  
            sleep(2000);
            click(1130,666);
            sleep(1000)
            click(1130,666);
            sleep(1000)
            // 点击上面的位置
            click(1011,121);
            sleep(1000);
        }
        if (images.pixel(img, 1130, 247) == -1935584 ) {
            sleep(1000);
            click(1130,247);
            // 点击召唤  
            sleep(2000);
            click(1130,666);
        }

        if (images.pixel(img, 1237, 247) == -1935584 ) {
            sleep(1000);
            click(1207,247);
            // 点击召唤  
            sleep(2000);
            click(1130,666);
        }

        imgRecycle(img)
        click(1230,29);
        sleep(2000);
        return true
    }

    // 存在可获得的坐骑。
    if (selclick(reData, '存在可获得的坐骑')) {
        sleep(2000);
        return true
    }


    // 存在可镶嵌的魔石。
    if (selclick(reData, '存在可镶嵌的魔石')) {
        sleep(2000);
        return true
    }
    if (select(reData, '合成魔石')) {
        sleep(3000)
        //  重新截图拿到最新的
        var img = captureScreen();
        if (images.pixel(img, 242, 259) == -1935584 ) {
            //  点击石头  908, 191
            click(908,191);
            sleep(1000);
            //  装备 1150,674
            click(1150,674);
            sleep(1000);
            //  槽 224, 284
            click(224,284);
            sleep(500)
        }

        if (images.pixel(img, 217, 357) == -1935584 ) {
            sleep(2000);
            //  点击石头  1000, 191
            click(1000,191);
            sleep(1000);

            //  装备 1150,674
            click(1150,674);
            sleep(1000);

            //  槽 193, 382
            click(193,382);
        }
        imgRecycle(img)
        click(1230,29);
        sleep(2000);
        return true
    }

    //  可学技能
    if (selclick(reData, '可学习新技能')) {
        sleep(2000);
        return true
    }
    // 升级技能
    if ( selclick(reData, '存在可升阶的技能')) {
        sleep(2000);
        return true
    }
    if (select(reData, '效果信息')) {
        sleep(3000)
        //  重新截图拿到最新的   TODO 多学几个技能  找蓝色的地方
        var img = captureScreen();
        //  拿到最新的数据
        if (getOcr(img,"ch")) {
            if (selclick(reData, '学习',true) ) {
                sleep(1000);
                click(961,669);
                sleep(1000);
            }
            if (selclick(reData, '腐败') ) {
                click(961,669);
                sleep(1000);
            }
            if (selclick(reData, '暴血') ) {
                click(961,669);
                sleep(1000);
                click(961,669);
                sleep(1000);
            }
        }

        click(1230,29);
        sleep(2000);
        imgRecycle(img)

        return true
    }

    // 可修炼内功
    if (selclick(reData, '可修炼内功')) {
        sleep(2000);
        return true
    }
    if (selclick(reData, '可升阶内功易筋经')) {
        sleep(2000);
        return true
    }

    if (selclick(reData, '升阶所需等级')) {
        click(1039,671); // 点击修炼
        sleep(4000);
        click(1039,671); // 点击修炼
        return true
    }
    if (select(reData, '太定')) {
        var img = captureScreen();
        var color = images.pixel(img, 43, 146);  
        if (color == -1935584 ) {
            //  有需要升级的地方
            var img = captureScreen();
            //  天宫  color == -8108002
            // images.pixel(img, 330, 605) 
            //  持律 
            // images.pixel(img, 454, 605) 
            //  脉天
            // images.pixel(img, 578, 605) 
            //  太定
            // images.pixel(img, 711, 605) 
            if (images.pixel(img, 330, 605) == -1935584 ) {
                click( 300,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 454, 605) == -1935584 ) {
                click( 424 ,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 578, 605) == -1935584 ) {
                click( 547  ,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 711, 605) == -1935584 ) {
                click( 672  ,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            imgRecycle(img)
            return true
        } 
        return false
    }

    // 存在可提升的体质
    if (selclick(reData, '存在可提升的体质')) {
        sleep(2000);
        return true
    }
    if (select(reData, '法术攻击')) {
        var img = captureScreen();
        if (images.pixel(img, 290, 34) == -1935584 ) {
            //  有需要升级的地方
            var img = captureScreen();
            //  法术   
            // var color = images.pixel(img, 434, 557); 
            //  命中 
            // var color1 = images.pixel(img, 600, 489); 
            //  回避
            // var color2 = images.pixel(img, 271, 489); 
            //  魔力
            // var color3 = images.pixel(img, 666, 326); 
            //  生命
            // var color4 = images.pixel(img, 203, 326); 
            //  法术防御
            // var color5 = images.pixel(img, 589, 177); 
            //  物理防御
            // var color6 = images.pixel(img, 260, 177); 
            if (images.pixel(img, 434, 557) == -1935584 ) {
                click(400,600);  // 点击法伤
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 600, 489) == -1935584 ) {
                click(564,524);  // 点击命中
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 271, 489) == -1935584 ) {
                click(234,524);  // 点击回避
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 666, 326) == -1935584 ) {
                click(629,357);  // 点击魔力
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 203, 326) == -1935584 ) {
                click(166,357);  // 点击生命
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 589, 177) == -1935584 ) {
                click(562,200);  // 点击法术防御
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (images.pixel(img, 260, 177) == -1935584 ) {
                click(234,200);  // 点击物理防御
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            imgRecycle(img)
            return true
        } 
        return false
    }
    if (closeNote(reData,"背包里存在推荐装备")) {return} // todo
    if (closeNote(reData,"可学习新内功")) {return}  // todo

    if (closeNote(reData,"可加入门派")) {return}
    if (closeNote(reData,"可执行奇缘")) {return}
    if (closeNote(reData,"可解除道具封印")) {return}
    if (closeNote(reData,"已扩充精灵出战")) {return}
    if (closeNote(reData,"可以在村庄里使用私人仓库")) {return}

    return false
}

//  升级
function upLevel(){
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }
    // 截图
    var img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }

    // 裁剪图像
    var attImg = images.clip(img, 522,41,6,3); 
    //  是否是在打怪
    var clors = getCl(attImg,1,2)
    imgRecycle(attImg)

    // 是否在自动寻路
    var imgtext = cropImage(img,[[1180 ,145],[1263 ,145],[1263 ,148 ],[1180 ,148]])
    //  获取颜色
    var code = isblue(imgtext)
    imgRecycle(imgtext)

    // 裁剪等级
    var croppedImage = images.clip(img, 25, 0, 55, 32);
    var lvData = getOcr(croppedImage,"ch");
    imgRecycle(croppedImage);
    // 获取等级
    getlv(lvData)

    // 通知区域 橙色
    var color = images.pixel(img, 1184, 17);

    // 邮箱
    var emil = images.pixel(img, 66, 94); 

    var hp =  images.pixel(img, 459, 666); 
    var mp =  images.pixel(img, 532, 667); 
    var color1 = images.pixel(img, 459, 666);   // 判断是否是中红药
    var color2 = images.pixel(img, 529, 666);   // 判断是否是中蓝药

    var reData = getOcr(img,"ch");
    imgRecycle(img)
    if (reData) {
        // console.log("处理异常弹窗")
        //  处理异常弹窗
        if (wrong(reData)) {return }

        // 进入游戏界面以前
        if(select(reData, 'REA') ){
            // 进入游戏
            if (selclick(reData, '点击')) {
                console.log("点击界面进入游戏")
                sleep(5000);
                return
            }

            if (select(reData, '退出登录') && !select(reData, '选项') ) {
                // 返回
                // home()  // 感觉 app.launch('com.wemade.mir4global') 也可 
                app.launch('com.wemade.mir4global') 
                sleep(5000)
            }

            // 加载补丁中
            if (selclick(reData, '加载补丁中')) {
                console.log("加载补丁中 等待5秒")
                sleep(5000);
                return
            }
            if(select(reData, '资格的证明') && selclick(reData, '登录游戏',true)){
                // 进入游戏
                console.log("登录游戏")
                sleep(5000);
            } 
            return
        }else{
            //  选择角色界面
            if(select(reData, '选择角色') ){
                // 开始游戏
                if (selclick(reData, '开始游戏')) {
                    console.log("点击界面进入游戏")
                    sleep(5000);
                    return
                }
            }
        }
        // console.log("处理小青龙")
        // 处理小青龙
        if (Loong(reData)) {return }
        
        // console.log("处理强化")
        //  处理强化 制造 加点
        if (Console(reData)) {return }

        var lv = storage.get("lv",0)
        console.log(`人物当前等级: ${lv} `); // 当前等级  

        // 领取奖励
        if (lv > 11 ) {
            // 根据气泡领取
            if (reward(reData)) {return }
            //  通知气泡
            if (color == -1935584) {
                click(1184,17)
                return
            }
            // 领取邮箱
            if (emil == -2133216) {
                //  可以领取
                click(55,105);
                sleep(3000);
                return
            }
        }
        // console.log("关闭所有的弹窗")
        // 关闭所有的弹窗
        if (closeX(reData)) {return }

        // console.log("切换药剂")
        //  切换药剂   在城镇的时候 
        if (lv >= 16) {
            //  检查城镇
            reai = select(reData,"比奇城",true)
            if (reai) {
                // 判断人在不在比奇城
                if (reai.box[0][0] > 1058 && reai.box[0][1] < 112 ) {
                    // 判断药剂是否还有
                    // var hp =  images.pixel(img, 459, 666); 
                    // var mp =  images.pixel(img, 532, 667); 
                    if (hp == -13093322 || mp == -11776688) {
                        console.log("没药剂了")
                        let buy = select(reData,"购买")
                        if (buy) {
                            textClick(buy,-45,0)
                            return
                        } 
                        // 找恢复 向上
                        let OUT = select(reData,"恢复药")
                        if (OUT) {
                            if (OUT.box[0][1] > 20){
                                textClick(OUT,0,-45)
                                return
                            }
                        }
                        //  点击地图 去买药的位置
                        reai = selclick(reData,"比奇城")
                        if (reai) {
                            // 进入地图
                            sleep(4000);
                            console.log("前往庆济")
                            // 前往庆济
                            click(1128,572);
                            sleep(2000);
                            click(1128,572);
                            console.log("点击传送")
                            //  点击寻路
                            sleep(1000);
                            click(1202,678);
                            sleep(10000);
                            if (wait("购买",200000)) {
                                console.log("找到了")
                                return
                            }
                        }
                    }
                    // 判断是否是大药 切换药
                    // var color1 = images.pixel(img, 459, 666);   // 红药
                    // var color2 = images.pixel(img, 529, 666);   // 蓝药
                    if ((color1 != -11661539 && color1 != -13093322) || (color2 != -15912110 && color2 != -13158343) ) {
                        console.log(" 没有大药 ")
                        //  点击第三个药设置 
                        click(610,661);
                        sleep(2000);
        
                        // 两个药都去掉
                        click(471,606);
                        sleep(1000);
                        click(541,606);
                        sleep(1000);
        
                        //  点击第1个药剂 红
                        click(891,415); 
                        sleep(2000);
                        click(891,415); 
                        sleep(1000);
                        click(476, 666); 
                        sleep(3000);
                        //  点击第2个药剂 蓝
                        click(955,415); 
                        sleep(2000);
                        click(955,415); 
                        sleep(1000);
                        click(539, 666); 
                        sleep(2000);

                        click(1235,41) // 关闭
                        sleep(2000);
                        return  
                    }
                }
            }
        }

        // console.log("是否在打怪")
        // 是否在打怪
        if (clors.hex == '#2e2f34') {
            console.log("在打怪");
            // 处理取消打怪升级
            if (lv == 14) {
                OUT = select(reData,"芊菲的下落")
                if (OUT) {
                    OUT = select(reData,"1.")
                    if (OUT) {
                        //  停止打怪
                        click(395,662); 
                        sleep(5000);  
                    }
                }
            }
            // 使用觉醒
            if (lv > 16 ) {
                click(1133,560);   // 觉醒键 
                sleep(10000);  
            }
            //  检查药回城 TODO
            if (lv > 20 ) {
                if (hp == -13093322 || mp == -11776688) {
                    // 回城
                    sleep(1000);
                    click(1133,95); //点击大地图
                    sleep(1000);
                    click(200,25); //点比奇地区
                    sleep(2000);
                    click(582,412); //点比奇城
                    sleep(2000);
                    reai = select(reData,"半兽古墓1")
                    if (reai) {
                        console.log("半兽古墓一 前往庆济")
                        // 前往庆济
                        click(1128,572);
                        sleep(1000);
                        click(1128,572);
                        console.log("点击传送1")
                        sleep(1000);
                        click(1058,678);
                        sleep(13000);
                    }else{
                        console.log("前往庆济")
                        // 前往庆济
                        click(1128,572);
                        sleep(2000);
                        click(1128,572);
                        console.log("点击传送")
                        //  点击寻路
                        sleep(1000);
                        click(1202,678);
                        sleep(38000);
                    }
                }
            }
            reai = select(reData,"【精英】比奇城后巷")
            if (reai) {
                if (reai.box[0][1] < 114 ) {
                    reai = select(reData,"12.救出可疑的")
                    if (reai) {
                        sleep(50000);
                    }
                }
            }
            click(1197,625);  // 普攻一下

            sleep(5000);
            return 
        }    

        // console.log("去挂机打怪")
        // 去挂机打怪
        if (lv >= 9 && lv < 14) {
            reai = select(reData,"芊菲的下落")
            if (reai) {
                // 去银杏谷练级
                reai = selclick(reData,"银")
                if (reai) {
                    sleep(2000);
                    click(330,445);
                    sleep(500)
                    click(330,445);
                    click(330,445);
                    sleep(7000);
                    click(395,662);  // 点击打怪
                    click(1195,630);
                    sleep(27000);
                }
                return    
            }
        }
        //  TODO  升级到40 
        if (lv < 40 ) {
            //  查找 找救出可疑的女人
            if (select(reData,"12.救出可疑的女人")) {
                reai = select(reData,"【精英】比奇城后巷")
                if (reai) {
                    if (reai.box[0][1] < 114 ) {
                        click(395,662);
                        sleep(2000);
                        return
                    }
                }else{
                    console.log("练级到40")
                    click(1133,95); //点击大地图
                    sleep(3000);
                    click(200,25); //点比奇地区
                    sleep(2000);
                    click(582,412); //点比奇城
                    sleep(2000);
                    click(456,84); // 比奇后巷
                    sleep(2000);
                    click(1214,156); // 更改难度
                    sleep(2000);
                    click(313,526); // 双击去 click(476,407);
                    sleep(500);
                    click(313,526); // 双击去
                    sleep(45000);
                    // click(395,662);  // 打怪
                }
                return
            }
        }

        if (select(reData,"击败双门帮") || select(reData,"击败老二")) {
            img = captureScreen();
            var imgtext2 = images.clip(img, 1188, 218, 20, 2); //第二个任务
            var code2 = isblue(imgtext2)
            imgRecycle(imgtext2)
            imgRecycle(img)
            if (code2) {
                sleep(7000);
                return 
            }else{
                click(1187,218);
                sleep(15000);
                return
            }
        }

        //  是否在自动做任务
        console.log(`是否在自动做任务: ${code}`)
        if (code) {
            click(945,574); // 奔跑
            //  切换视角
            reai = select(reData,"小传子")
            if (reai) {
                if (reai.box[0][0] < 600) {
                    swipe(721, 360, 10, 0, 1000);
                    return
                }
            }
            sleep(5000);
        }else{
            reai = select(reData,"12.找救出可疑的女人")
            if (!reai) {
                // 加入限定的条件 
                reai3 = select(reData,"近距",true)
                reai4 = select(reData,"安全",true)
                reai5 = select(reData,"普通",true)
                if (reai3||reai4||reai5) {
                    console.log(" . ");
                    code = click(1122.5,187);    
                    sleep(2000)
                }    
            }
        }

        //  剧情任务
        // 漆黑的密道
        if (select(reData, '漆黑的')) {
            if (select(reData, '开采岩窟花树液')) {
                sleep(3000);
                click(644.5,274.5);
                sleep(6000);
                return
            }
            
            if (select(reData,"同伴就在")) {
                selclick(reData, '前往')
                return
            }

            if (select(reData,"与剑啸")) {
                sleep(1000);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(1000);
                return
            }

            if (selclick(reData,"3.与京")) {
                sleep(5000);
                return
            }
            return
        }

        // 危险的救援计划
        if (select(reData, '危险的救')) {
            if (select(reData, '与芊菲对话')) {
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }
            if (select(reData, '开启牢门')) {
                click(644.5,274.5)
                sleep(8000)
                return
            }
            if (select(reData, '救出芊')) {
                sleep(3000);
                click(644.5,274.5)
                sleep(8000)
                return
            }
        }

        //  武功修炼
        if (select(reData, '武功修炼')) {
            if (select(reData, '摧毁木')) {
                selclick(reData, '跳过')
                // 点击攻击按钮
                click(1197,625);  // 攻击键
                sleep(1000);
                return
            }
        }

        // 岁月静好
        if (select(reData, '岁月静好')) {
            if (select(reData, '跳过')) {
                if (select(reData, '12.与京')) {
                    //  制作武器的节点
                    if (select(reData, '制造武器')) {
                        sleep(3000);
                    
                        click(1225,26); // 菜单
                        sleep(2000);

                        click(1028,216);  // 制作工坊
                        sleep(2000);
                        
                        click(935,310);  // 制作工坊
                        sleep(3000);
                        
                        click(71,367);  //   点击高级
                        sleep(2000);
                        
                        click(575,300); // 说明 点击武器
                        sleep(1000);

                        click(575,300); // 点击武器
                        sleep(2000);

                        click(1125,676);
                        sleep(3000);
        
                        click(723,600) //  穿戴
        
                        click(1230,29); // 关闭窗口
                        sleep(1200)
                    }
                    return
                }
                if (select(reData, '5.击败')) {
                    if (selclick(reData, '跳过')) {
                        sleep(1200)
                    }
                }
                return
            }else{
                if (selclick(reData, '跳过')) {
                    sleep(1200)
                    return
                }
            }
            return
        }

        // 追踪痕迹
        if (select(reData, '追踪痕迹')) {
            if (select(reData, '寻找芊')) {
                sleep(2000);
                if (select(reData, '请点击全部')) {
                    click(1225,26)
                    sleep(2000)
                    click(1120,102) // 点击精灵
                    sleep(3000)

                    click(937,197)  // 点击精灵
                    sleep(4000)

                    click(820,266)  // 点青龙
                    sleep(3000)

                    click(1150,667)  // 召唤
                    sleep(4000)

                    click(1150,667)  // 召唤
                    sleep(4000)

                    click(1150,667)  // 出战
                    sleep(4000)

                    click(826,122)   // 点卡槽
                    sleep(1000)
                    // 点出去
                    click(1230,29);
                    sleep(1000)
                    click(1230,29);
                    return
                }

                if (select(reData, '请点击按键')) {
                    click(1120,102) // 点击精灵
                    sleep(3000)

                    click(937,197)  // 点击精灵
                    sleep(4000)

                    click(820,266)  // 点青龙
                    sleep(3000)

                    click(1150,667)  // 召唤
                    sleep(4000)

                    click(1150,667)  // 召唤
                    sleep(4000)

                    click(1150,667)  // 出战
                    sleep(4000)

                    click(826,122)   // 点卡槽
                    sleep(1000)
                    // 点出去
                    click(1230,29);
                    sleep(1000)
                    click(1230,29);

                }
                return
            }

            if (selclick(reData, '寻得蛊')) {
                sleep(2000);
                click(326,638);
                sleep(3000);
                click(326,638);
                return
            }

            if (selclick(reData, '强化技能')) {
                sleep(2000);
                swipe(273, 100, 273, 700, 1000); 
                img = captureScreen();
                reData = getOcr(img,"ch");
                imgRecycle(img)
                if (reData) {
                    if (selclick(reData, '暴血花')) {
                        sleep(4000);
                    }
                    if (selclick(reData, '学习',true)) {
                        sleep(3000);
                    }
                
                    img = captureScreen();
                    reData = getOcr(img,"ch");
                    img.recycle(); // 手动释放内存
                    img = null;
                    if ( selclick(reData, '饿鬼')) {
                        sleep(2000);
                        if (selclick(reData, '强化')) {
                            sleep(3000);
                            click(1230,25);
                        }
                    }
                }
                return
            }
        }

        // 黑暗之影      委托
        if (select(reData, '黑暗之影')) {
            if (select(reData, '请点击活')) {
                click(168,100); // 点击活力
                sleep(2000);
                click(402,533);
                sleep(500);
                click(402,533);
                sleep(500);
                click(402,533) ;
                sleep(2000);
                click(725,536);
                sleep(500);
                click(725,536);
                sleep(500);
                click(718,441); // max 未起效
                sleep(500);
                click(718,441); // max
                click(718,441);// max
                click(718,441);// max
                click(718,441);// max
                sleep(500);
                click(725,536) ;// 点击使用
            }

            if (select(reData, '强化体质')) {
                sleep(2000);
                for (let index = 0; index < 6; index++) {
                    // 法伤
                    if (index == 0) {
                        click(885,334)
                    }
                    //  命中
                    if (index == 1) {
                        click(1087,278)
                    }
                    // 生命
                    if (index == 3|index == 4|index == 5) {
                        click(860,221)
                    }
                    // // 魔力
                    // if (index == 6) {
                    //     click(1111,221)
                    // }
                    sleep(1500)
                    click(1040,672)
                    sleep(3000);
                }
                click(1230,25) // 关闭
                return
            }

            if (select(reData, '采集森')) {
                sleep(8000)
                click(326,638);
                sleep(8000)
                click(326,638);
                return
            }

            //  这个背景是蓝色的 导致识别不正确
            if (select(reData, '击败跑来')) {
                if (clors.hex != '#2e2f34') {
                    selclick(reData, '击败跑来')
                    sleep(3000);
                    return 
                }  
            }

            return
        }
        // 芊菲的下落

        // 寻求灵药
        if (select(reData,"寻求灵药")) {
            if (selclick(reData, '7.与')) {
                sleep(4000);
                return
            }
            if (selclick(reData, '8.制')) {
                sleep(4000);

                click(1125,676);
                sleep(3000);

                //  穿戴
                click(723,600)
                sleep(3000);

                click(1230,29);
                sleep(1000);
                return
            }
            //  这个不可以自动
            if (select(reData, '22.带')) {
                if (selclick(reData, '跳过')) {
                    sleep(1200)
                }
                swipe(208, 543, 208, 400, 5000); 
                selclick(reData, '22.带')
                sleep(13000);
                return
            }
            
            if (select(reData, '21.获')) {
                sleep(20000);
                click(326,638);
                sleep(4000)
                click(326,638);
                return
            }

            if (selclick(reData, '3.采')) {
                sleep(3000);
                click(326,638);
                sleep(8000)
                click(326,638);
            }

            if (selclick(reData, '6.修炼')) {
                selclick(reData, '跳过')
                sleep(2000)
                img = captureScreen();
                ocrResults = getOcr(img,"ch");
                imgRecycle(img)
                if(ocrResults){
                    sleep(2000) ;
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

        // 比奇城风云    6.离开龙会楼  可以升级技能什么的 
        if (select(reData,"比奇城风")) {
            if (select(reData, '请点击全部') && selclick(reData, '跳过')) {
                sleep(600)
                return 
            }
            if (select(reData, '21.强化装备')) {
                sleep(3000)
                //  选武器  
                click(809,200);
                sleep(1000);

                // 强化
                click(1100,667);
                sleep(3000);
                click(1100,667);
                sleep(2000);

                // click(1100,667);
                // sleep(3000);
                // click(1100,667);
                // sleep(2000);

                //  确认点击
                click(610,383);
                sleep(1000);
                click(732,472);
                sleep(2000);
                return
            }
            return
        }

        // 逃离银杏谷 
        if(select(reData,"逃离银杏谷")){
            if (select(reData, '请点击全部') && selclick(reData, '跳过')) return ;
        }

        // 绑架的背后   精英任务  
        if (select(reData,"绑架的背后")) {
            if (select(reData, '银杏谷采')) {
                sleep(8000);
                click(326,638);
                sleep(128000);
            }
            if (selclick(reData, '4.与')) {
                sleep(2000);
                return 
            }
            if (selclick(reData, '品质2武器')) {
                reai = selclick(reData, '跳过')
                sleep(3000);
                click(1125,676);
                sleep(3000);

                //  穿戴
                click(723,600)
                sleep(3000);

                click(1230,29);
                sleep(1000);
            }
            if (select(reData, '18.完成丹')) {
                if (!select(reData,"击败双")) {
                    // 
                    img = captureScreen(); // 重新获取截图
                    reData = getOcr(img,"ch"); // 重新OCR
                    imgRecycle(img);
                    if (reData) {
                        if (select(reData, '奇缘') ) {
                            // 丹鹰的护卫
                            sleep(3000);
                            click(1094,597); // 点击领取
                            sleep(2000);
        
                            click(1230,29); // 退出
                            sleep(6000);
        
                            click(1194,234);  // 点击领取的任务
                            sleep(18000);
                            
                            // todo 未测试
                            return
                        }
                    }
                }
                return
            }
            if (select(reData, '20.完成朱千')) {
                if (!select(reData,"击败双")) {
                    selclick(reData, '20.完成朱千')
                    sleep(4000);
                    img = captureScreen(); // 重新获取截图
                    reData = getOcr(img,"ch"); // 重新OCR
                    imgRecycle(img);
                    if (reData) {
                        if (select(reData, '奇缘')  ) {
                            // 丹鹰的护卫
                            sleep(3000);
                            click(1094,597); // 点击领取
                            sleep(2000);
        
                            click(1230,29); // 退出
                            sleep(6000);
        
                            click(1194,234);  // 点击领取的任务
                            sleep(18000);
                            return
                        }
                    }
                }
                return
            }
            if (select(reData, '22.完成击败')  ) {  // 陈秋风
                if (!select(reData,"击败老二")) {
                    selclick(reData, '22.完成击败')
                    sleep(4000);
                    img = captureScreen(); // 重新获取截图
                    reData = getOcr(img,"ch"); // 重新OCR
                    imgRecycle(img);
                    if (reData) {
                        if (select(reData, '奇缘')   ) {
                            // 丹鹰的护卫
                            sleep(3000);
                            click(1158,426); // 点击领取
                            sleep(2000);
        
                            click(1230,29); // 退出
                            sleep(6000);
        
                            click(1194,234);  // 点击领取的任务
                            sleep(18000);
                            return
                        }
                    }
                }
                return
            }

            return
        }

        //  跳过
        var reai= select(reData,"跳过")
        if (reai) {
            item = reai.box[0][0]
            if (item > 1100) {
                selclick(reData,"跳过")
                sleep(2000);
                return
            } 
            
        }
        if (selclick(reData,"《器")) {
            sleep(3000);
            return
        }

        click(223 , 560) ; // 点击画面
    }
}

// 主函数
function main(){
    // 初始化
    if (init()) {
        upLevel()
    }
}

console.log("开始执行1!")
main()

//  测试区域
if (false) {
    // console.log("开始请求截图")
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }

    
    // console.log("截图")
    var img = captureScreen();

    // console.log("开始请求")
    var reData = getOcr(img,"ch");
    
}



console.log("操作结束")