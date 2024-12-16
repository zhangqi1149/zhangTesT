// 设置服务器地址
var SERVER_URL = "http://192.168.1.128:5000";
// var SERVER_URL = "http://192.168.1.142:5000"; // 本地

// var text = "40级了 打不过怪该怎么玩啊" ;
// var text1 = "All servers sell gold at a low price.   trading platform: w-w-w.igokay.com" ;
var text1 = "The lowest price gold transactions in the world. Use PlayPal guaranteed payment. Welcome to igokay.com." ;
var interval = 60000 ;    // 12分钟 720000毫秒  *60000

var  Save = false  // true   false 

// SetCom('wm size | grep "Override size"')         // 获取当前的屏幕物理尺寸
// SetCom('wm density | grep "Override density"')   // 获取当前的密度

// var width_screenshot = 1285
// var height_screenshot = 720
var storage = storages.create("ABC");
let today = new Date().toISOString().split('T')[0];  // 获取今日日期，格式为 YYYY-MM-DD

// let careers = [
//     "战士",
//     "法师",
//     "道士",
//     "弩手",
//     "武士",
//     "黑道士"
// ];

let careers = [
    "战士",
    "法师",
    "道士",
    "弩手",
    "武士",
    "黑道士"
];

manage_value()
//  管理存储值
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    var keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);                 // 当前职业 : e_career  喊了话的战斗力 : e_war  当前职业喊的数量 : e_count  停止时间 : e_time
        storage.put(today,{e_career:'战士', e_war:0, e_count:0 ,e_time:0})  // 职业  战力值  喊话的数量  休息时间
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

// OCR请求
function getOcr(img, lang) {
    try {
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        let jsonData = {
            image: imgData,
            lang: lang,
            save: Save
        };
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = http.postJson(SERVER_URL+"/ocr", jsonData, {
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
        console.error("getOcr 请求失败: ", e);
    }
    return null;
}

// 请求是否是蓝色
function isblue(img) {
    try {
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");

        let jsonData = {
            image: imgData,
            save: Save // true   false 
        };

        // 发送 POST 请求
        let response = http.postJson(SERVER_URL+"/is_blue", jsonData, {
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
        // toast("isblue 请求失败: ",e)
        console.error(" isblue 请求失败: ", e);
    }
    return null;
}

function SetCom(str) {
    let res = http.get("http://127.0.0.1:8848/execute?cmd="+str);    // 查看文件
    if(res.statusCode != 200){
        toast("请求失败: " + res.statusCode + " " + res.statusMessage);
    }else{
        console.log(res.body.string())
    }
}

// 查看控件
function npackageName() {
    // 查找屏幕上的所有控件
    let nodes = className("android.widget.FrameLayout").find();
    // 遍历找到满足条件的控件
    for (let i = 0; i < nodes.size(); i++) {
        let node = nodes.get(i);
        if (node.packageName() === "com.wemade.mir4global") {

            sleep(100);
            return true
        }
    }
    nodes = null;
    return false
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
    // nodes.recycle();  // 返回的是个集合 没有recycle方法  置为null 取消引用让GC去清理
    nodes = null;
    
    return false;  // 没有找到匹配的控件，返回 false
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
    console.log(execute)
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

// 初始化
function init(){
    // 权限检查
    if (!auto.service) {
        // toastLog("请开启无障碍服务");
        if (!requestScreenCapture(true)) {
            throw new Error("请求屏幕捕获权限失败");
        }
        auto();
        return false
    }
    if (packageNameEndsWith("mir4global")) {
        return true
    }else{
        app.launch('com.wemade.mir4global')
        sleep(3000);
    }
    return false
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
        let grayscaleImage = images.grayscale(img);
        imgRecycle(img)
        let reData = getOcr(grayscaleImage,"ch");
        imgRecycle(grayscaleImage)
        if (reData) {
            let top = select(reData,str)
            if (top) {
                return true
            }
        }
        sleep(500);  // 等待 3000 毫秒再继续查找
    }
    // 超时返回
    return false
}

/** 生成随机英文名  名字要求6-12 
 * 
 * @returns string
 */
function getRandomName() {
    // 随机生成 2 到 5 之间的长度
    let length = random(1, 2);
    
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

// 区域裁剪
function clip(img, box) {
    // 获取裁剪区域的坐标
    let x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    let x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    let y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    let y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    let croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    return croppedImage
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
    waitTime = (waitTime !== undefined) ? waitTime : 5000;
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (selclick(reData, text, exactMatch)) {
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
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        // console.log("item.text:",item.text)
        if (item && item.text !== undefined) {
            if (exactMatch) {
                if (item.text === targetText) {
                    // console.log("找到目标文本:", item);
                    return item;
                }
            }else{
                if (item.text.includes(targetText)) {
                    // console.log("模糊查找目标文本:", item.text);
                    return item;
                }
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
        }
    }
    // console.log("没找到 :",targetText);
    return null;
}

/** 发包点击
 * 
 * @param {string} key 属性
 */
function httpclick(x,y) {
    // let res = http.get("http://127.0.0.1:8848/execute?cmd=input tap 500 1000");    // 查看文件
    let res = http.get("http://127.0.0.1:8848/execute?cmd=input tap "+`${x} ${y}`);    // 查看文件
    if(res.statusCode != 200){
        toast("请求失败: " + res.statusCode + " " + res.statusMessage);
        return false
    }else{
        // console.log(res.body.string())
        // let bodyString = res.body.string(); // 立即读取响应体
        // console.log(`value : ${bodyString}`)
        return true
    }
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
        // let x_phone = (centerX / 1285) * device.height;
        // let y_phone = (centerY / 720) * device.width;

        // console.log(`selclick-点击${src}: x=${x_phone}, y=${y_phone}`);
        console.log(`selclick-点击 ${src}: x=${centerX}, y=${centerY}`);

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
    let centerX = (target.box[0][0] + target.box[2][0]) / 2;
    let centerY = (target.box[0][1] + target.box[2][1]) / 2;
    // 将坐标从截图转换到设备屏幕坐标
    // let x_phone = (centerX / 1285) * device.height;
    // let y_phone = (centerY / 720) * device.width;
    // console.log(`点击${target.text}: x=${x_phone}, y=${y_phone}`);


    console.log(`点击 : ${target.text} 偏移: x=${centerX}, y=${centerY}`);

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

//  获取等级
function getlv(lvData){
    if (!Array.isArray(lvData)) {
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

//  关闭通知
function closeNote(reData,src) {
    var target = select(reData, src)
    // console.log(target)
    if (target) {
        let centerY = (target.box[0][1] + target.box[2][1]) / 2;
        let y_phone = (centerY / 720) * device.width;
        // console.log(`点击${src}: x= 1166, y=${y_phone}`);
        let code = click(1166,y_phone);
        return code
    }
    return false
}

//  查找第二个指示字符
function selectTow(ocrResults, targetText) {
    if (!Array.isArray(ocrResults)) {
        console.error(`第二个指示字符 OCR 结果不是数组: ${targetText}`);
        return null;
    }
    let num = 0
    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            if (item.text === targetText) {
                num += 1;
                if (num == 2) {
                    return item;
                }
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
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
        let centerX = (target.box[0][0] + target.box[2][0]) / 2;
        let centerY = (target.box[0][1] + target.box[2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        // let x_phone = (centerX / 1285) * device.height;
        // let y_phone = (centerY / 720) * device.width;

        console.log(`点击坐标2: x=${centerX}, y=${centerY}`);

        // 点击坐标
        click(centerX,centerY);

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
        if (long.box[0][0] > 700) {
            click(1219,94); //  X
            sleep(2000);
            return true
        }
    }

    if (!select(reData,"前往狭窄的通道") &&  select(reData,"请拖拽虚拟摇杆进行移动") ) {
        swipe(232, 455, 232, 200, 4000);
        return true
    }
    return false
}

// 处理弹窗函数
function wrong(reData) {
    // 临时维护
    if (select(reData,"Temporary")|| select(reData,"Maintenance")||select(reData,"更新维护公告")) {
        console.log("游戏临时维护");
        // 杀掉游戏
        // SetCom("pm clear com.wemade.mir4global")
        throw new Error("游戏临时维护")
    }
    if (selclick(reData,"前往登录")||selclick(reData,"重新连接")||selclick(reData,"重新登录")) {
        selclick(reData,"确认")
        sleep(2000);
        return true
    }
    // 更新维护
    // if (select(reData,"更新维护公告")) { 
    //     // SetCom("pm clear com.wemade.mir4global")
    //     throw new Error("更新维护公告");
    // }
    if (select(reData,"存在最新版本")||select(reData,"无法确认版本")) { 
        selclick(reData,"确定",true);
        // SetCom("pm clear com.wemade.mir4global")
        // throw new Error("游戏更新");
        return true
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
        // SetCom("pm clear com.wemade.mir4global")
        back()
        throw new Error("游戏网络连接断开");
        // return true;
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
        if (ClickSleep(reData, '确认') || ClickSleep(reData, '结束', 2000)) {
            return true;
        }
    }
    // 警告 -> 确认
    if (select(reData, "警告")) {
        return ClickSleep(reData, '确认');
    }
    // 错误 -> 确认 或 游戏结束
    if (select(reData, "错误")) {
        if (ClickSleep(reData, '确认', 5000, true) || ClickSleep(reData, '游戏结束', 5000, true)) {
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
        let item = menuItem.box[0][0]
        let item2 = menuItem.box[1][1]
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
        let item = buttonItem.box[0][0]
        let item2 = buttonItem.box[0][1]
        console.log(`请点击按键: ${item}`)
        // [[754.0, 349.0], [843.0, 349.0], [843.0, 368.0], [754.0, 368.0]] 制造按钮提示位置
        // if (item == 754.0 || item == 752.0 || item == 751.0) {
        //     click(935,310);  // 制造
        //     sleep(1000);
        //     return true
        // }

        // [[899.0, 74.0], [991.0, 74.0], [991.0, 97.0], [899.0, 97.0]]  任务提示
        if (item2 <= 74) {
            selclick(reData,"跳过")
            return true;
        }


        // [[936.0, 348.0], [1029.0, 348.0], [1029.0, 371.0], [936.0, 371.0]] 解除封印
        // // 未匹配的全跳过
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
        // [[213.0, 422.0], [306.0, 421.0], [307.0, 441.0], [213.0, 442.0]] 装备的高级选项提示位置
        // [[167.0, 420.0], [262.0, 420.0], [262.0, 442.0], [167.0, 442.0]]
        // if (item == 213.0 ||item == 167.0) {
        // if (item <= 213.0 && item >= 167.0) {
        //     click(71,367); // 高级
        //     sleep(1000);
        //     return true
        // }


        // [[843.0, 236.0], [938.0, 236.0], [938.0, 258.0], [843.0, 258.0]] 辅助装备提示位置
        // [[842.0, 234.0], [937.0, 234.0], [937.0, 257.0], [842.0, 257.0]
        // if (item == 843.0 || item == 842.0 || item == 845.0) {
        // if (item >= 842.0 && item <= 845.0) {
        //     click(1025,195); // 辅助装备
        //     sleep(2000);
        //     return true
        // }

        // 936  服饰提示位置
        // [[937.0, 236.0], [1031.0, 236.0], [1031.0, 258.0], [937.0, 258.0]]
        // if ((item > 935.0 && item <= 938.0) && item2 < 240.0) {
        //     click(1123,200); // 服饰
        //     sleep(2000);
        //     return true
        // }

        if (selclick(reData,"辅助装备") || selclick(reData,"服饰")) {
            click(1025,195); // 辅助装备
            click(1123,200); // 服饰
            sleep(2000);
            return true
        }

        // [[750.0, 234.0], [845.0, 234.0], [845.0, 257.0], [750.0, 257.0]]  精灵提示位置
        // [[751.0, 236.0], [846.0, 236.0], [846.0, 258.0], [751.0, 258.0]]  精灵提示位置 
        // if (item == 750.0 || item == 751.0 || item == 752.0) {
        //     click(940,200); // 精灵
        //     sleep(1000);
        //     return true
        // }
        // console.log("精灵")
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
            let item = der.box[0][0];
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
    if (finishItem && finishItem.box[0][0] < 1037) {
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
       if (long.box[0][0] > 700) {
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
                // for (let i = 0; i < 2; i++) {
                //     if (i == 1) {
                //         selclick(reData,"中型魔力恢复")
                //     }
                    sleep(2000);
                    clickWithDelay(853, 390, 4000); // 点击 输入框
                    clickWithDelay(775, 489, 1000); //  上限
                    clickWithDelay(775, 633, 2000); //  输入完毕
                    clickWithDelay(800, 495, 2000); //  购买键
                // }
            }
            clickWithDelay(1219,94,2000); //  X
            return true
       }
    }
    return false
}

//  领取奖励
function reward(reData) {
    // 领取邮箱
    // if (select(reData, '一键删除')) {
    //     let img = captureScreen();
    //     // 账号
    //     if (images.pixel(img, 163, 75) == -1935584) {
    //         click( 163, 75);
    //         sleep(2000);
    //     }

    //     // 系统
    //     if (images.pixel(img, 163, 151) == -1935584) {
    //         click( 163, 151);
    //         sleep(2000);
    //     }


    //     // 报告
    //     if (images.pixel(img, 163, 443) == -1935584) {
    //         click( 163, 443);
    //         sleep(2000);
    //     }
            
    //     imgRecycle(img);
    //     // 全部领取
    //     click(1151,105);
    //     sleep(4000);
    //     click(1151,105);
    //     click(1230,29);
    //     sleep(1000);

    //     return true
    // }

    //  背包空间不足
    reai = selclick(reData, '背包空间不足')
    if (reai) {
        // 处理物品    先售卖一件装备  然后去制造
        sleep(2000);
        click(808,83);   // 点击装备
        //  点击出售
        clickWithDelay(994,669,2000);   // 点击出售

        clickWithDelay(813,478,1500); //  选择一件装备
        clickWithDelay(920,478,1500); //  选择2件装备
        clickWithDelay(999,478,1500); //  选择2件装备
        clickWithDelay(1097,478,1500); //  选择2件装备
        clickWithDelay(1189,478,1500); //  选择2件装备

        clickWithDelay(813,564,1500); //  选择一件装备
        clickWithDelay(920,564,1500); //  选择2件装备
        clickWithDelay(999,564,1500); //  选择2件装备
        clickWithDelay(1097,564,1500); //  选择2件装备
        clickWithDelay(1189,564,1500); //  选择2件装备

        click(1161,667); //  点击确定出售
        sleep(1000);
        click(754,471);    // 点击警告
        click(732,455); //  点击确定出售弹窗
        sleep(1000);

        // 装备制造
        // click(697,672);   // 点击去制造
        sleep(2000);
        return true
    }

    //  领取成就  
    if (selclick(reData, '可领取成就奖励')) {
        sleep(1000);
        return true
    }
    if ( select(reData, '完成成就获')) {
        clickWithDelay(1206,103,3000);
        clickWithDelay(1206,103,2000);  // 点击画面
        clickWithDelay(1230,29,1000);  // 退出
        return true
    }

    if (selclick(reData, '请领取每日课题奖励')) {
        return true
    }
    if (select(reData, '每日课题现状')) {
        clickWithDelay(1140,179,3000); // 点击领取
        click(1140,179);
        clickWithDelay(647,179,500); // 点击领取
        clickWithDelay(1140,179,1000);  // 点击画面
        clickWithDelay(1230,29,1000);  // 退出
        return true
    }

    // 存在可召唤的精灵
    if (selclick(reData, '存在可召唤的精灵')) {
        return true
    }
    if (select(reData, '出战效果')) {
        //  重新截图拿到最新的
        let img = captureScreen();
        if (images.pixel(img, 939, 247) == -1935584 || images.pixel(img, 945, 255) == -1935584) {
            clickWithDelay(939, 247,2000);
            // 点击召唤  
            clickWithDelay(1130,666,1000);
            clickWithDelay(1130,666,1000);
            // 点击上面的位置
            clickWithDelay(916,121,2000);
        }
        if (images.pixel(img, 1034, 247) == -1935584 || images.pixel(img, 1043, 255) == -1935584) {
            sleep(1000);
            clickWithDelay(1034,247,2000);
            // 点击召唤  
            clickWithDelay(1130,666,1000);
            clickWithDelay(1130,666,1000);
            // 点击上面的位置
            clickWithDelay(1011,121,1000);
        }
        if (images.pixel(img, 1130, 247) == -1935584 || images.pixel(img, 1143, 255) == -1935584) {
            sleep(1000);
            clickWithDelay(1130,247,2000);
            // 点击召唤  
            clickWithDelay(1130,666,1000);
        }

        if (images.pixel(img, 1237, 247) == -1935584 || images.pixel(img, 1239, 255) == -1935584) {
            sleep(1000);
            clickWithDelay(1207,247,2000);
            // 点击召唤  
            clickWithDelay(1130,666,1000);
        }

        imgRecycle(img)
        clickWithDelay(1230,29,10000);
        return true
    }

    // 存在可获得的坐骑。
    if (selclick(reData, '存在可获得的坐骑')) {
        return true
    }
    // 存在可镶嵌的魔石。
    if (selclick(reData, '存在可镶嵌的魔石')) {
        sleep(2000);
        return true
    }
    if (select(reData, '合成魔石')) {
        sleep(1000);
        //  重新截图拿到最新的
        let img = captureScreen();
        if (images.pixel(img, 242, 259) == -1935584 || images.pixel(img, 228, 253) == -1935584 ) {
            sleep(1000);
            //  点击石头  908, 191
            clickWithDelay(911,191,1000);
            //  装备 1150,674
            clickWithDelay(1150,674,500);
            //  槽 224, 284
            clickWithDelay(224,284,1000);
        }

        if (images.pixel(img, 217, 357) == -1935584 || images.pixel(img, 212, 356) == -1935584 ) {
            //  点击石头  1000, 191
            clickWithDelay(1000,191,1000);
            //  装备 1150,674
            clickWithDelay(1150,674,500);
            //  槽 193, 382
            clickWithDelay(193,382,1000);
        }
        imgRecycle(img)
        clickWithDelay(1230,29,1000);
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
        let img = captureScreen();
        //  拿到最新的数据
        reData = getOcr(img,"ch")
        if (reData) {
            if (selclick(reData, '学习',true) ) {
                sleep(1000);
                // clickWithDelay(961,669,1000);
            }
            if (selclick(reData, '腐败') ) {
                sleep(1000);
            }
            if (selclick(reData, '鬼火') ) {
                clickWithDelay(961,669,1000);
            }
            if (selclick(reData, '深渊') ) {
                clickWithDelay(961,669,1000);
            }
            if (selclick(reData, '暴血') ) {
                clickWithDelay(961,669,1000);
            }
        }
        clickWithDelay(1230,29,1000);
        imgRecycle(img)
        return true
    }

    // 可修炼内功
    if (selclick(reData, '可修炼内功')) {
        return true
    }
    if (selclick(reData, '可升阶内功易筋经')) {
        return true
    }

    if (selclick(reData, '升阶所需等级')) {
        clickWithDelay(1039,671,3000); // 点击修炼
        clickWithDelay(1039,671,500); // 点击修炼
        clickWithDelay(1230,29,1000);
        return true
    }

    if (select(reData, '太定')) {
        let img = captureScreen();
        // if (images.pixel(img, 43, 146) == -1935584 ) {
        if (images.pixel(img, 33, 151) == -1935584 ) {
            //  有需要升级的地方
            let img2 = captureScreen();
            //  天宫  color == -8108002
            // images.pixel(img, 330, 605) 
            //  持律 
            // images.pixel(img, 454, 605) 
            //  脉天
            // images.pixel(img, 578, 605) 
            //  太定
            // images.pixel(img, 711, 605) 
            if (images.pixel(img2, 330, 605) == -1935584 ) {
                clickWithDelay(300,645,1000);
                clickWithDelay(1039,671,4000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img2, 459, 604) == -1935584 ) {
                clickWithDelay(424,645,1000);
                clickWithDelay(1039,671,4000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img2, 583, 604) == -1935584 ) {
                clickWithDelay(547,645,1000);
                clickWithDelay(1039,671,4000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img2, 710, 604) == -1935584 ) {
                clickWithDelay(672,645,1000);
                clickWithDelay(1039,671,4000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            imgRecycle(img2)
            return true
        } 
        imgRecycle(img)
        return false
    }

    // 背包里存在推荐装备
    if (selclick(reData, '背包里存在推荐装备')) {
        return true
    }
    if (selclick(reData, '自动镶嵌')) {
        sleep(2000);
        click(730,540);
        return false
    }

    // 存在可提升的体质
    if (selclick(reData, '存在可提升的体质')) {
        sleep(2000);
        return true
    }
    if (select(reData, '法术攻击')) {
        let img = captureScreen();
        if (images.pixel(img, 290, 34) == -1935584 ) {
            if (images.pixel(img, 434, 557) == -1935584 || images.pixel(img, 425, 561) == -1935584 ) {  //  法术 
                clickWithDelay(400,600,1000);  // 点击法伤
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img, 600, 489) == -1935584 || images.pixel(img, 595, 492) == -1935584 ) {  //  命中 
                clickWithDelay(564,524,1000);  // 点击命中
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img, 203, 326) == -1935584 || images.pixel(img, 189, 326) == -1935584 ) {  //  生命
                clickWithDelay(166,357,1000);  // 点击生命
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img, 666, 326) == -1935584 || images.pixel(img, 663, 326) == -1935584 ) {  //  魔力
                clickWithDelay(629,357,1000);  // 点击魔力
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img, 271, 489) == -1935584 || images.pixel(img, 257, 498) == -1935584) {  //  回避
                clickWithDelay(234,524,1000);  // 点击回避
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img, 589, 177) == -1935584 || images.pixel(img, 1054, 155) == -1935584) {  //  法术防御
                clickWithDelay(562,200,1000);  // 点击法术防御
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            if (images.pixel(img, 260, 177) == -1935584 || images.pixel(img, 258, 160) == -1935584) {  //  物理防御
                clickWithDelay(234,200,1000);  // 点击物理防御
                clickWithDelay(1039,671,3000); // 点击修炼
                clickWithDelay(1039,671,1000); // 点击修炼
            }
            imgRecycle(img)
            return true
        } 
        imgRecycle(img)
        return false
    }

    closeNote(reData,"已扩充精灵出战")
    closeNote(reData,"可解除道具封印")
    closeNote(reData,"可以在村庄里使用私人仓库")
    closeNote(reData,"可执行奇缘")
    closeNote(reData,"可学习新内功")
    closeNote(reData,"可加入门派")
    return false
}

//  创建角色
function create(reData) {
    if ((!select(reData,"请输入名称") && select(reData,"创建角色") && select(reData, '确定',true))) {
        selclick(reData, '确定',true)
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
            sleep(1000);
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
            sleep(1000);
            return true
        }
        if (!selclick(reData, '创建角色')) {
            selclick(reData,"确定");   // 键盘不一样
        }
        sleep(2000);
        // return true
    }
    if (selclick(reData,"创建角色")) {
        return true
    }
    return false
}

// 查找后面的文本
function getNextText(ocrResult,targetText) {
    if (!Array.isArray(ocrResult)) {
        console.error(`getNextText 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResult.length; i++) {
      if (ocrResult[i].text.trim().replace(/[.,]/g, '') === targetText.replace(/[.,]/g, '')) {
        // 如果目标文本不是最后一个，返回下一个文本
        if (i + 1 < ocrResult.length) {
          return ocrResult[i + 1].text;
        } else {
          return null; // 如果目标文本是最后一个，返回 null
        }
      }
    }
    return null; // 如果没有找到目标文本，返回 null
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
    }
    return false
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
    console.log(" 排行榜喊话")
    let care = storage.get(today)
    //  输入法是打开的情况
    let ts = className("android.widget.EditText").findOne(1000)
    if (ts) {
        console.log("输入法打开了")
        // 输入文字
        ts.setText(text1)
        sleep(500);
        // 点击发送
        click(1187,683)
        clickWithDelay(633,105,2000); // 关闭对话
        clickWithDelay(633,40,1000);  // 关闭对话框
        return true
    }

    //  对话框
    if (select(reData,"聊天") && select(reData,"门派")) {
        // 请输入内容
        if (selclick(reData,"请输入内容")) {
            return true;
        }
        return true
    }

    //  进入对话界面
    if (select(reData,"其他玩家信息")) {
        if (selclick(reData,"确认",true)) {
            sleep(1000);
            clickWithDelay(48,33,1000);
            return true
        }
        let dh = select(reData,"对话")
        if (dh) {
            textClick(dh,0,-30)
            sleep(2000);
            // 等待切换显示
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
    console.log(`排行榜进度 :${care.e_career},`,)
    if (select(reData,"每日服务器")) {
        // 选择职业 下拉框
        if (select(reData,"战士") && select(reData,"法师")) {
            return selclick(reData, care.e_career.trim());
        }
        // 没有选择分组
        if (select(reData,"全部") || select(reData, care.e_career.trim()) == null) { // 才打开不是当前分组
            if (selclick(reData,"全部") || selclick(reData,"战斗力（")) {
                return 
            }
        }
    }

    // 记录战斗力
    if (select(reData,care.e_career.trim())) {
        // 开始挑选
        console.log("开始挑选",care.e_war)
        // 重新截图
        let img = captureScreen(); 
        let croppedImage = images.clip(img, 1097, 305, 91, 402); // 战斗力
        let croppedImage2 = images.clip(img, 200, 645, 48, 38); // 100 排名    
        imgRecycle(img);
        let crop = getOcr(croppedImage,"ch");
        let crop2 = getOcr(croppedImage2,"ch");
        imgRecycle(croppedImage);
        imgRecycle(croppedImage2);

        if (care.e_war == 0) {
            //  未点击过
            if (crop) {
                console.log(crop[0].text)
                storage.put(today,{e_career:care.e_career, e_war:crop[0].text, e_count:1 ,e_time:0})
                if (selclick(reData,crop[0].text)) {
                    return true;
                }
            }
        }else{
            let nt = getNextText(crop,care.e_war)
            if ( nt == null) {
                console.log("向上滑动")
                swipe(600, 400, 600, 345, 500); 
                sleep(2000);
                if (crop2) {
                    if (crop2[0].text.trim() == 100 ) {
                        console.log("到头了",crop2);
                        // 点击右上角退出
                        clickWithDelay(1235,41,2000); // 关闭窗口
                    }
                }
                return true;
            }else{
                selclick(reData,nt);
                storage.put(today,{e_career:care.e_career, e_war:nt, e_count:care.e_count + 1 , e_time:0})
                sleep(1500);
                return true;
            }
        }
        return
    }

    // 在游戏界面
    if (select(reData,"和平",true) || select(reData,"近距",true) || select(reData,"卡组变更",true)||select(reData,"安全",true) ) {
        console.log("在游戏界面")
        clickWithDelay(1230,29,1200);
        return 
    }
    // console.log("快速设置")
    // 打开了 设置
    if (select(reData,"快速设置")) {
        if (selclick(reData,"排位",true)) {
            return true
        }
    }
}

//  升级
function upLevel(){
    //  是否休息
    if (compareTime()) {
        sleep(10000); // 休息
        return false
    }

    if (!requestScreenCapture(true)) {
        return new Error("请求屏幕捕获权限失败");
    }
    // console.log("开始截图")
    let img = captureScreen();      // 截图
    // console.log("完成截图")
    if (!img) {
        console.log("截图失败");
        return ;
    }
    let grayscaleImage = images.grayscale(img);      // 二级化

    // let imgWidth = img.width; // 获取图像宽度
    // let imgHeight = img.height; // 获取图像宽度
    // console.log(`imgWidth : ${imgWidth} imgHeight : ${imgHeight}`)

    // 是否在自动寻路
    let imgtext = clip(img,[[1180 ,145],[1263 ,145],[1263 ,148 ],[1180 ,148]])
    // let imgtext = clip(img,[[145 ,1180],[145 ,1263],[148 ,1263 ],[148 ,1180]])
    let code = isblue(imgtext)  //  获取颜色
    imgRecycle(imgtext)
    // console.log(code);

    // 裁剪等级
    let croppedImage = images.clip(img, 11, 0, 60, 32);
    sleep(5);
    let clors =  images.pixel(img, 522,41);   // 判断是否在打怪  
    sleep(5);

    // 获取OCR
    let reData = getOcr(grayscaleImage,"ch");
    imgRecycle(img)
    if (reData) {
        //  在主界面的时候去截取等级
        if (select(reData,"和平",true) || select(reData,"近距",true) || select(reData,"卡组变更",true)) {
            let lvData = getOcr(croppedImage,"ch");
            imgRecycle(croppedImage);
            getlv(lvData) // 获取等级
        }

        if (wrong(reData)) {return } //  处理异常弹窗
        // 进入游戏界面以前
        if(select(reData, 'REA') ){
            // 进入游戏
            if (select(reData,"资格的证明")) {
                selclick(reData,"登录游戏",true)
                sleep(2000);
                return true
            }
            if (selclick(reData, '点击')) {
                // console.log("点击界面进入游戏");
                sleep(5000);
                return
            }
            if (selclick(reData, '确定')) {
                // console.log("点击界面进入游戏");
                sleep(5000);
                return
            }
            if (selclick(reData,"Google登录")) {
                sleep(5000);
                return 
            }
            if (select(reData, '退出登录') ) {
                if (!select(reData, '选项')) {
                    // home()  // 返回
                    app.launch('com.wemade.mir4global');
                    sleep(5000);
                }
            }
            if (selclick(reData, '加载补丁中')) {   // 加载补丁中
                // console.log("加载补丁中 等待5秒")
                sleep(5000);
                return
            }
            if(select(reData, '资格的证明')){
                // 进入游戏   TODO待测
                if (selclick(reData, '登录游戏',true)) {
                    // console.log("登录游戏");
                sleep(5000);
                }
            }
            return
        }else{
            //  选择角色界面
            if(select(reData, '选择角色')){
                // 开始游戏
                if (selclick(reData, '开始游戏')) {
                    // console.log("点击界面进入游戏");
                    return sleep(5000);
                }
            }
            // 弹窗
            if (selclick(reData,"前往登录")) {
                sleep(2000);
                return
            }
            if (selclick(reData,"登录游戏")) {
                sleep(2000);
                return
            }
        }

        // console.log("创建角色")
        if (create(reData)) {return } //  创建角色
        // console.log("处理小青龙")
        if (Loong(reData)) {return }  // 处理小青龙
        // console.log("处理强化")
        if (Console(reData)) {return } //  处理强化 制造 加点
        let lv = storage.get("lv",0)
        console.log(`人物当前等级: ${lv} `); // 当前等级


        // console.log("关闭所有的弹窗")
        if (closeX(reData)) {return } // 关闭所有的弹窗

        // TODO 排行榜 是否是第一个账号
        if (lv >= 10 ) {
            return Ranking(reData)
        }
        if (lv < 10) {
            if (checkAndClick(reData, '指南', 1226, 38, 2000)) return true;
        }
        //  是否在自动做任务
        console.log(`是否在自动做任务: ${code}`)
        if (code) {
            click(945,574); // 奔跑
            sleep(2000);
        }else{
            // 加入限定的条件 
            if (select(reData,"和平",true) || select(reData,"近距",true) || select(reData,"卡组变更",true) || select(reData,"安全",true) || select(reData,"普通",true)) {
                console.log(" . ");
                clickWithDelay(1122.5,187,2000);    
            }
        }

        // console.log(`剧情任务1`)
        //  ********   剧情任务
        // 漆黑的密道
        if (select(reData, '漆黑的')) {
            if (select(reData, '开采岩窟花树液')) {
                sleep(2000);
                clickWithDelay(644.5,274.5,6000);
                return
            }
            if (select(reData,"同伴就在") && selclick(reData, '前往')) {
                return
            }
            if (select(reData,"与剑啸")) {
                sleep(1000);
                clickWithDelay(223, 560,50) ;
                clickWithDelay(223, 560,1000) ;
                return
            }

            if (selclick(reData,"3.与京")) {
                return sleep(5000);
            }
            return
        }      
        // console.log(`剧情任务2`)
        // 危险的救援计划
        if (select(reData, '危险的救')) {
            if (select(reData, '与芊菲对话')) {
                clickWithDelay(223, 560,50) ;
                clickWithDelay(223, 560,50) ;
                clickWithDelay(223, 560,50) ;
                return
            }
            if (select(reData, '开启牢门')||select(reData, '救出芊')) {
                sleep(1000);
                return clickWithDelay(644.5,274.5,8000);
            }
            return
        }
        // console.log(`剧情任务3`)
        // 武功修炼
        if (select(reData, '武功修炼')) {
            if (select(reData, '摧毁木') && selclick(reData, '跳过')) {
                // 点击攻击按钮
                clickWithDelay(1197,625,500);  // 攻击键
                clickWithDelay(1197,625,500);  // 攻击键
            }
            return
        }
        // console.log(`剧情任务4`)
        // 岁月静好
        if (select(reData, '岁月静好')) {
            if (select(reData, '跳过')) {
                if (select(reData, '12.与京')) {
                    //  制作武器的节点
                    if (select(reData, '制造武器')) {
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
                if (select(reData, '5.击败') && selclick(reData, '跳过')) {
                    sleep(1200);
                }
                return
            }else{
                if (selclick(reData, '跳过')) {
                    return
                }
            }
            return
        }
        // console.log(`剧情任务5`)
        // 追踪痕迹
        if (select(reData, '追踪痕迹')) {
            if (select(reData, '寻找芊')) {  // 精灵
                sleep(2000);
                if (select(reData, '请点击全部')) {
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
                if (select(reData, '请点击按键')) {
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
            if (selclick(reData, '寻得蛊')) {
                sleep(1500);
                clickWithDelay(326,638,3000);
                return click(326,638);
            }
            if (selclick(reData, '强化技能')) {
                sleep(4000);
                swipe(273, 100, 273, 700, 1000); 
                let img = captureScreen();
                let reData = getOcr(img,"ch");
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
                    imgRecycle(img)
                    if (selclick(reData, '饿鬼')) {
                        sleep(2000);
                        if (selclick(reData, '强化')) {
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
        if (select(reData, '黑暗之影')) {
            if (select(reData, '请点击活')) {
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
            if (select(reData, '强化体质')) {
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
            if (select(reData, '采集森')) {
                sleep(8000)
                clickWithDelay(326,638,8000);
                return click(326,638,2000);
            }
            //  这个背景是蓝色的 导致识别不正确
            if (select(reData, '击败跑来')) {
                if (clors != -13553096) { 
                    // selclick(reData, '击败跑来')
                    clickWithDelay(1197,625,3000);
                    return
                }  
            }
            if (selclick(reData,"与陈生")){
                sleep(2000);
            }
            if (selclick(reData,"拜见师父")){
                sleep(3000);
            }
            return
        }

        // 寻求灵药
        if (select(reData,"寻求灵药")) {
            if (selclick(reData, '7.与')) {
                return sleep(4000);
            }
            if (selclick(reData, '8.制')) {
                sleep(4000);
                clickWithDelay(1125,676,3000);
                clickWithDelay(723,600,3000); //  穿戴
                return clickWithDelay(1230,29,1000);
            }

            //  这个不可以自动
            if (select(reData, '22.带') || selclick(reData, '跳过')) {
                sleep(1200);
                swipe(208, 543, 208, 400, 5000); 
                selclick(reData, '22.带')
                return sleep(21000);
            }
            if (select(reData, '21.获')) {
                sleep(20000);
                clickWithDelay(326,638,4000);
                return click(326,638);
            }
            if (selclick(reData, '3.采')) {
                sleep(3000);
                clickWithDelay(326,638,8000);
                return click(326,638);
            }
            if (selclick(reData, '6.修炼')) {
                selclick(reData, '跳过')
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
        reai = select(reData,"跳过")
        if (reai) {
            item = reai.box[0][0]
            if (item > 1100) {
                selclick(reData,"跳过")
                return sleep(2000);
            }
        }
        if (selclick(reData,"《器")) {
            return sleep(3000);
        }
        if (lv < 10 ) {
            // console.log("点击画面")
            clickWithDelay(223,560,50) ; // 点击画面
            clickWithDelay(223,560,50) ; // 点击画面
            clickWithDelay(223,560,50) ; // 点击画面
        }
    }
}

// 主函数
function main(){
    // 锁屏
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded() // 唤醒
        swipe(232, 1000, 232, 200, 800);  // 打开
    }
    // 初始化
    if (init()) {
        upLevel()
    }
}

// for (let i = 0; i < 30; i++) {
    // console.log("$$$$$$$$$$$$$$  执行开始!")
    main()
    // console.log("##############  执行完成")
    // sleep(1000);
    // console.log(storage.get(today))
// }


// for (let i = 0; i < 10; i++) {
    if (false) {
        // console.log("开始请求截图")
        if (!requestScreenCapture(true)) {
            throw new Error("请求屏幕捕获权限失败");
        }
        let img = captureScreen();
        // let grayscaleImage = images.grayscale(img);
    
        // console.log("开始请求")
        // let reData = getOcr(grayscaleImage,"ch");
        let reData = getOcr(img,"ch");
    
        // let hp =  images.pixel(img, 522,41);   // -13553096
        // console.log(hp)
        // Ranking(reData)
        
    
        // let croppedImage = images.clip(img, 365, 307, 219, 391); //所有的名字
        // let croppedImage = images.clip(img, 200, 305, 42, 402); // 前面的排名数字
        // let croppedImage = images.clip(img, 54, 79, 127, 42); // 战斗力
        // console.log(lvData)
        
    }
// }
// input(getRandomName())

// for (let i = 0; i < 10; i++) {
//     console.time("ocrExecutionTime");  // 开始计时
//     let img = captureScreen();
//     let reData = getOcr(img,"ch");
//     console.timeEnd("ocrExecutionTime");  // 输出执行时间
// }


// storage.put(today,{e_career:"战士", e_war:"237,118", e_count:23 ,e_time:0})

// storage.put(today,{e_career:'战士', e_war:0, e_count:0 ,e_time:0}) 

// recents() //最近任务


// if (!requestScreenCapture(true)) {
//     throw new Error("请求屏幕捕获权限失败");
// }
// for (let i = 0; i < 10; i++) {
//     let img = captureScreen();
//     console.time("ocrExecutionTime");  // 开始计时
//     let reData = getOcr(img,"ch");
//     // let croppedImage = images.clip(img, 365, 307, 219, 391)
//     // let lvData = getOcr(croppedImage,"ch");
//     console.timeEnd("ocrExecutionTime");  // 输出执行时间
// }

// storage.put(today,{e_career:'法师', e_war:0, e_count:0 ,e_time:0})

// console.log(storage.get(today))


// close_app("com.wemade.mir4global")

 