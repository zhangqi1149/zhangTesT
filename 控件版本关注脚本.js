let Num = 260      // 关注人数
let Age = 21       // 年龄
let Lv = 5        // 财富等级


let storage = storages.create("ABC");  // 创建存储对象
// 获取今日日期，格式为 YYYY-MM-DD
let today = new Date().toISOString().split('T')[0];

//  管理存储值
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    var keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);
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

/** 初始化 
 *  无障碍服务  启动抖音
 * @returns 
 */
function init(){
    // 权限检查
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
        return false
    }
    let currentPkg = currentPackage();
    if (currentPkg == "com.ss.android.ugc.aweme"){   // 是否在抖音
        return true
    } else {
        console.log("目前不在抖音,当前界面: ",currentPkg);
        app.launch('com.ss.android.ugc.aweme')
        sleep(3000);
    }
    return false
}

/** 点击屏幕中心点
 * 
 */
function clickCenter() {
    // 获取屏幕宽度和高度
    let width = device.width;
    let height = device.height;

    // 计算屏幕中心点的坐标
    let centerX = width / 2;
    let centerY = height / 3;

    // 输出中心点坐标
    // console.log("屏幕中心点: X = " + centerX + ", Y = " + centerY);
    console.log("-.-!");

    // 点击屏幕中心点
    click(centerX, centerY);
    sleep(2000);
}

/** 查找控件 (textContains)
 * 
 * @param {string} str  
 * @returns 
 */
function Find_Control(str) {
    let targetControl = textContains(str).findOne(1800); 
    if (targetControl) {
        return targetControl
    } else {
        // console.log("未找到控件",str);
        return null
    }
}

/** 点击坐标 适配偏移
 * 
 * @param {*} targetControl 
 * @param {number} offsetx 
 * @param {number} offsety 
 */
function clickobj(targetControl, offsetx, offsety) {
    if (offsetx == null) {offsetx = 0}
    if (offsety == null) {offsety = 0}
    // 检查控件是否有效
    if (!targetControl) {
        console.log("目标控件无效");
        return;
    }
    // 获取控件的边界
    let bounds = targetControl.bounds();
    // 检查边界是否有效
    if (!bounds) {
        console.log("未能获取控件的边界");
        return;
    }

    // 计算控件的中心坐标
    let centerX = bounds.centerX();
    let centerY = bounds.centerY();

    // 输出原始中心点坐标
    // console.log("原始控件: X = " + centerX + ", Y = " + centerY);

    // 计算点击位置，考虑偏移
    let clickX = centerX + offsetx;
    let clickY = centerY + offsety;

    // 输出调整后的点击位置
    // console.log("调整后点击: X = " + clickX + ", Y = " + clickY);

    // 执行点击操作
    click(clickX, clickY);
}

/** 性别和年龄
 * 
 * @param {str} contentDesc 
 * @returns 
 */
function Name_Age(contentDesc) {
    // 提取性别
    let gender = contentDesc.split(",")[0]; // "男"
    // 使用正则提取年龄数字
    let ageMatch = contentDesc.match(/\d+/); // 匹配数字
    let age = ageMatch ? parseInt(ageMatch[0], 10) : 0; // 如果匹配到数字，取第一个匹配项
    
    return  { gender, age };
}
 
// 显示一个长期存在的Toast
function longToast(message, duration) {
    let toastDuration = 0;  // 用来记录显示时间
    let interval = setInterval(function() {
        toast(message);  // 显示Toast消息
        toastDuration++ ;  // 每次调用，累加显示时间
        if (toastDuration >= duration) {
            clearInterval(interval);  // 达到指定时长后停止显示
        }
    }, 2000);  // 每2秒钟显示一次Toast
}

// 分割财富等级
function extractLevel(content) {
    // 使用正则表达式匹配数字部分
    let match = content.match(/\d+/); // \d+ 匹配连续的数字
    return match ? match[0] : 0; // 返回第一个匹配到的数字
}


//  筛选账号
function sieving() {
    // 获取控件对象
    let targetControl2 = descContains("男,,").findOne(1800);
    // 检查控件是否存在
    if (targetControl2) {
        let result = Name_Age(targetControl2.desc())
        // let targetControl2 = descContains("荣誉等级").findOne(1800); // 荣誉等级18级勋章  com.ss.android.ugc.aweme:id/jfc
        let targetControl3 = id("com.ss.android.ugc.aweme:id/jfc").findOne(1000); // 荣誉等级18级勋章
        let lvl = extractLevel(targetControl3.desc())
        if (result.gender == "男" && result.age > Age && lvl >= Lv) {
            //  点击
            toast(`${result.gender} 性账号 ${result.age}岁, 财富等级 :${lvl} 级`);
            return true
        }else{
            console.log("不符合标准 ! ")
        }
    }
    return false
}

// 处理小资料卡
function Small_Data_Card() {
    // 判断是否关注过了
    let targetControl = desc("关注 按钮").findOne(1800);
    if (targetControl) { // 未关注
        clickobj(targetControl);
        sleep(2000);
        storage.put(today, storage.get(today)+1);
        console.log("Small_Data_Card 点击屏幕中间1")
        clickCenter();
    }else{
        console.log("Small_Data_Card 点击屏幕中间")
        // 点击屏幕中间
        return clickCenter();
    }
}

function main() {
    // 检查关注上限
    if (storage.get(today, 0) >= Num ) {
        console.log("当前账号使用上限",today);
        throw new Error("当前账号使用上限");
    }

    // 初始化  App是否打开了   当前账号是否关注人数够了
    if (!init()) {throw new Error(" 初始化失败")}
    // 随机关注方式
    let randomInt = Math.floor(Math.random() * 10) + 1;
    // 当前界面 -> 直播间小资料卡界面
    let AT = descContains("艾特 按钮").findOne(1800)
    if (AT) {
        if (AT.desc() == "艾特 按钮") {
            let target_button = desc("关注 按钮").findOne(1800);
            if (target_button) { // 可以点关注
                // 判断是否关注
                if (sieving()) {
                    // 是否进主页点击 随机
                    if (randomInt % 2 === 0 ) {
                        let targetControl = id("com.ss.android.ugc.aweme:id/q=4").findOne(3000);  // 说点什么
                        clickobj(targetControl,-350)  // 点击头像
                        sleep(2000);
                    }else{
                        Small_Data_Card();  // 点击关注
                    }
                }else{  // 不符合条件
                    // 点击屏幕中间
                    return clickCenter();
                }
            }
        }
    }

    let mysterious = id("com.ss.android.ugc.aweme:id/q2z").findOne(1000);  // 神秘人隐身特权
    if (mysterious) {
        return clickCenter();
    }
    
    // 当前界面 -> 用户资料界面
    if (Find_Control("已关注") == null) {
        let targetControl = id("com.ss.android.ugc.aweme:id/ind").findOne(1800);  // 关注按钮
        if (targetControl) {
            clickobj(targetControl);
            storage.put(today, storage.get(today)+1);
            sleep(2000);
        }
    }

    //  回到直播间
    let targetControl = desc("返回").findOne(1800);
    if (targetControl) {
        clickobj(targetControl);
        return sleep(5000);
    }

    // 判断是否在直播界面   点击用户操作
    let Contr = Find_Control("更多直播");
    if (Contr) { // 在直播间
        // 执行点击操作
        let targetControl = id("com.ss.android.ugc.aweme:id/gth").findOne(1800);
        clickobj(targetControl,-25,-80);
        sleep(3000);
    }

    if (Find_Control("直播已结束")) {
        console.log("直播已结束")
        longToast("直播已结束",10)  // let targetControl = id("com.ss.android.ugc.aweme:id/n-n").findOne(3000); // 关闭
        throw new Error(" 直播已经结束:")
    }
}

// for (let i = 0; i < 12; i++) {
    main()
    console.log("-----------------------end")
// }

