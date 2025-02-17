// 盘盘罐罐打碎就再置办
let Log =  false  // 是否打日志

//  初始化今日养号份额
let maxLikes = 20;       // 点赞上限
let minLikes = 1;       // 点赞下限

let maxPosts  = 1;       // 发动态上限
// let minPosts  = 1;       // 发动态下限

let maxComments = 1;     // 评论上限
let minComments = 1;     // 评论下限

//  首先是滑动过快或者频率过快会触发喜欢上限限制 就要会员无法右划喜欢了  目前我测试的是97个   网传是120个
let maxFavorites = 90;   // 喜欢上限 就是右滑动 / 点击喜欢按钮
let minFavorites = 20;   // 喜欢下限 

let today = new Date().toISOString().split('T')[0];  // 获取今日日期，格式为 YYYY-MM-DD


// 未来时间区间     心情保持时间
let maxTimeInFuture = 23
let minTimeInFuture = 14


let moodList = ['心情愉悦', '心情一般', '心情较差', '心情低落'];   // // 定义情绪列表
// 存储区
let storage = storages.create("ABC");

manage_value()
//  -----------------------------------------------------

/** 管理存储值
 * 
 */
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    var keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);
        //  随机     今日    情绪描述                           喜欢上限                        点赞上限                                          评论上限                               发动态上限                      执行时间 
        storage.put(today,{Mood:"心情愉悦",Favorites:getRandomInt(minFavorites,maxFavorites), Likes:getRandomInt(minLikes,maxLikes), Comments:getRandomInt(minComments,maxComments), Posts:getRandomInt(0,maxPosts), Time:0})
        storage.put("num",0) // 重置今日喜欢数量
        storage.put("keysList", keys);  // 更新键列表
    }
    
    // 遍历之前保存的所有键，并删除不符合条件的键
    keys.forEach(function(key) {
        // log_z(key)
        if (key !== today) {
            storage.remove(key);  // 删除不是今天的数据
        }
    });
}

// 遍历控件
function getnodes() {
    let node = className("android.widget.FrameLayout").findOne(5000);
    if (node) {
        // 递归遍历子控件
        function getAllChildren(node, depth) {
            depth = depth || 0; // 如果 depth 未传入，则默认为 0

            // 打印当前控件的信息
            console.log(" ".repeat(depth * 2) + "控件: " + node.className() + " | 文本: " + node.text());

            // 遍历子控件
            let children = node.children();
            for (let i = 0; i < children.size(); i++) {
                getAllChildren(children.get(i), depth + 1);
            }
        }

        // 开始递归遍历，从深度 0 开始
        getAllChildren(node, 0);
    } else {
        console.log("未找到指定控件！");
    }
}


/** 打印日志
 * 
 * @param {字符消息} message 
 */
function log_z(message) {
    if (Log) {
        console.log(`  * ${message} `)
    }
}

/** 点击坐标 适配偏移
 * 
 * @param {控件} targetControl 
 * @param {X偏移量} offsetx 
 * @param {Y偏移量} offsety 
 */
function clickobj(targetControl, offsetx, offsety) {
    if (offsetx == null) {offsetx = 0}
    if (offsety == null) {offsety = 0}
    // 检查控件是否有效
    if (!targetControl) {
        log_z("目标控件无效");
        return false;
    }
    // 获取控件的边界
    let bounds = targetControl.bounds();
    // 检查边界是否有效
    if (!bounds) {
        log_z("未能获取控件的边界");
        return false;
    }

    // 计算控件的中心坐标
    let centerX = bounds.centerX();
    let centerY = bounds.centerY();

    // 计算点击位置，考虑偏移
    let clickX = centerX + offsetx;
    let clickY = centerY + offsety;

    return click(clickX, clickY);
}

/** 随机一个参数
 * 
 * @param {最小值} min 
 * @param {最大值} max 
 * @returns 
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 不定延迟
 * 
 * @param {最大延迟数} max 
 * @param {最小延迟数} min 
 */
function varyWait(max ,min) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    sleep(delay);  // 阻塞延迟
    log_z(`延迟：${delay} 毫秒`);
}

/** 查找控件     
 * @param {要查找的内容} str     
 * @param {指令} call    
 * @param {查找时间} timeout 
 * @returns 
 */
function Find_Control(str,call,timeout) {
    call = (call !== undefined) ? call : textContains;
    timeout = (timeout !== undefined) ? timeout : 10;
    let targetControl = call(str).findOne(timeout)
    // if (targetControl) {
    //     if (targetControl.visibleToUser()) {
    //         return targetControl
    //     }
    // }
    return targetControl && targetControl.visibleToUser() ? targetControl : null;
}

/** 初始化
 * 
 * @returns 
 */
function init() {
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
        nodes = null
        return false;  // 没有找到匹配的控件，返回 false
    }

    // //  锁屏属性
    // if (executeCommand("settings get secure lockscreen.disabled") == 0 ) {
    //     log_z("禁用锁屏:")
    //     executeCommand("settings put secure lockscreen.disabled 1")  // lockscreen.disabled 1表示禁用 0表示启用锁屏。        
    // }

    // //  强制设置为竖屏
    // if (executeCommand("settings get secure lockscreen.disabled") != 0 ) {
    //     log_z("设置竖屏:")
    //     //  强制设置为竖屏
    //     executeCommand("settings put system user_rotation 0")  // lockscreen.disabled 1表示禁用 0表示启用锁屏。        
    // }
    
    // if (executeCommand("settings get system screen_off_timeout") != 2147483647) {
    //     // 设置当前息屏时间为 2147483647
    //     log_z("设置息屏:")
    //     executeCommand("settings put system screen_off_timeout 2147483647")
    // }


    //当时是否是锁定界面
    if (id("com.android.systemui:id/lock_icon_view").findOne(500) != null) {
        log_z("在锁定的界面")
        device.wakeUpIfNeeded() // 唤醒
        sleep(1000);
        swipe(232, 1000, 232, 200, 800);  // 打开
        return false
    }

    // 首先检查手机的状态 如果是锁屏了
    if (!device.isScreenOn()) {
        log_z("在黑屏")
        device.wakeUpIfNeeded() // 唤醒
        sleep(1000);
        swipe(232, 1000, 232, 200, 800);  // 打开
        return false
    }

    // 检查权限 无障碍
    if (!auto.service) {
        log_z("请求无障碍权限失败")
        auto();
        throw new Error("请求无障碍权限失败");
    }

    // 锁屏了就打开
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded() // 唤醒
        swipe(232, 1000, 232, 200, 800);  // 打开
    }

    let Data = storage.get(today)
    if (Data.Mood == "心情不好" && !compareTime(Data)) {
        return
    }

    //  启动探探
    if (!packageNameEndsWith("mobile.putong")) {
        app.launch('com.p1.mobile.putong')
        log_z("启动探探")
        sleep(4000);
        return false;
    }
    return true;
}

/** 接入ai TODO
 * 
 * @param {*} params 
 */
function AIbot() {
    //  配置AI config
    
}

// 随机区间秒
function randomDelay(minSeconds, maxSeconds) {
    return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 1000; // 秒
}

// 随机区间分钟
function randomDelayInMinutes(minSeconds, maxSeconds) {
    return Math.floor(Math.random() * (maxSeconds - minSeconds + 1) + minSeconds) * 60 * 1000; // 分钟
}

//  生成未来时间 
function addRandomMinutes(min, max) {
    let now = new Date();  // 获取当前时间
    let randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min; // 生成 min 到 max 之间的随机分钟数
    now.setMinutes(now.getMinutes() + randomMinutes); // 当前时间加上随机分钟数，自动处理进位
    return now;
}

//  对比时间
function compareTime(a) {
    let now = new Date();  // 获取当前时间
    let futureTime = new Date(a.Time)
    // 比较时间戳
    if (futureTime > now) {
        // log_z('未来时间大于当前时间');
        return false
    } else {
        // log_z('未来时间小于当前时间');
        return true
    }
}

//  -------------------------------- 探探


// // 示例 config 对象
// var config = {
//     id: "bottombar",                        // bottombar 控件的 ID
//     type: "TextView",                       // 要查找的控件的类名
//     conditionFunc: function(node) {         // 控件文本为 "消息" 的条件函数
//         return node.text() === "消息";  
//     },
//     bid : "badge",                          // badge 控件的 ID
//     hasGrandparent: 2,                      // 是否有祖父控件，适应不同结构的需求 层级
// };

// console.log("当前数量 ",getUnread(config))

//  * 获取消息的未读数量 
function getUnread(config) {
    // 获取 bottombar 控件的边界
    var bo = id(config.id).findOne(1000); 
    var bound ;
    if (bo) {
        bound = bo.bounds()
    }else{
        return 0
    }

    // 获取左上角 (left, top) 和右下角 (right, bottom) 的坐标
    var num = 0;  // 当前的未读信息数
    var left = bound.left;
    var top = bound.top;
    var right = bound.right;
    var bottom = bound.bottom;

    var w = className(config.type).boundsInside(left, top, right, bottom).find();

    // 遍历所有找到的控件
    w.forEach((node) => {
        if (node != null && config.conditionFunc(node)) {  // 只处理文本为 "消息" 的控件
            // 获取当前消息节点的祖父控件
            var parentNode = node;
            if (config.hasGrandparent == 1 ) {
                parentNode = node.parent();
            }
            if (config.hasGrandparent == 2 ) {
                parentNode = node.parent().parent();
            }
            // 查找 id 为 "fl_badge" 的控件
            var badge = parentNode.findOne(id(config.bid));
            if (badge != null) {
                // 获取 badge 控件的文本作为未读信息数
                var badgeText = badge.text();
                if (badgeText) {
                    num = badgeText;  // 将文本转换为整数
                }
            }
        }
    });
    return num;
}

/** 更自然的滑动模拟操作
 * 
 */
function randomSwipe2() {
    let width = device.width;
    let height = device.height;
    let startX, endX, startY, endY, duration;

    startY = random(height * 0.4, height * 0.6); // 起始y坐标
    endY = random(height * 0.4, height * 0.6); // 终点y坐标

    duration = random(300, 600); // 滑动时间稍微更长一些，显得更自然

    // 随机选择滑动方向，避免完全一致的行为
    if (Math.random() > 0.5) {
        // 向右滑动
        console.log(" ****  🎉 向右滑动")
        startX = random(width * 0.1, width * 0.3);
        endX = random(width * 0.6, width * 0.9);
    } else {
        // 向左滑动
        // console.log("向左滑动 ---  ")
        startX = random(width * 0.7, width * 0.9);
        endX = random(width * 0.1, width * 0.3);
    }

    // 模拟非直线滑动，增加小幅度颤动
    let curveX = random(-50, 50);
    let curveY = random(-30, 30);
    let middleX = (startX + endX) / 2 + curveX;
    let middleY = (startY + endY) / 2 + curveY;

    // swipe(startX, startY, middleX, middleY, duration / 2); // 第一阶段
    swipe(middleX, middleY, endX, endY, duration / 2); // 第二阶段

    // console.log("滑动完成，等待一会...");

    let waitTime = random(2000, 3000); // 随机等待时间（2s-5s）
    // console.log("等待 " + waitTime + "ms");
    sleep(waitTime);

    // **模拟点击行为** 检查数据做权重   TODO
    // if (Math.random() > 0.7) {
    //     let clickX = random(width * 0.4, width * 0.6);
    //     let clickY = random(height * 0.3, height * 0.7);
    //     click(clickX, clickY);
    //     console.log("模拟点击屏幕 (" + clickX + ", " + clickY + ")");
    //     sleep(random(1000, 3000)); // 点击后短暂停顿
    //     click(clickX, clickY);
    // }

    // **增加休息模拟**
    if (random(20, 30) % random(10, 20) === 0) {
        let restTime = random(1000, 2000); // 模拟更长时间的停顿（10s-30s）
        // console.log("模拟休息 " + restTime + "ms");
        sleep(restTime);
    }

    // console.log("滑动结束 🎉");
}

//  特殊处理滑动
function randomSwipe() {
    //  获取信息内容  
    let wergh = calculateAccountWeight(account_info());
    if (wergh > 0.51) {
        console.log(" *** 优质账号:",wergh);
        // **增加休息模拟**
        if (random(20, 30) % random(10, 20) === 0) {
            let restTime = random(1000, 2000); // 模拟更长时间的停顿（1s-2s）
            sleep(restTime);
        }
        //  点击资料片
        if (Math.random() > 0) {
            let clickX = random(device.width * 0.4, device.width * 0.6);
            let clickY = random(device.height * 0.3, device.height * 0.7);
            click(clickX, clickY);
            console.log("模拟点击屏幕 (" + clickX + ", " + clickY + ")");
            sleep(random(1000, 3000)); // 点击后短暂停顿
            return
        }
    } else {
        console.log("差账号:",wergh);
    }


    let width = device.width;
    let height = device.height;
    let startX, endX, startY, endY, duration;

    startY = random(height * 0.4, height * 0.6); // 起始y坐标
    endY = random(height * 0.4, height * 0.6); // 终点y坐标

    duration = random(300, 600); // 滑动时间稍微更长一些，显得更自然

    // 判断是否需要切换方向，避免连续右滑 4 次
    let swipeDirection = Math.random() > 0.5 ? 'right' : 'left';

    // 如果已经连续右划4次，就强制向左滑动
    if (storage.get("count",0) >= 4) {
        swipeDirection = 'left';
    }

    if (swipeDirection === 'right') {
        console.log(" ****  🎉 向右滑动")
        startX = random(width * 0.1, width * 0.3);
        endX = random(width * 0.6, width * 0.9);
        storage.put("count", storage.get("count",0))
    } else {
        console.log("向左滑动 ---  ")
        startX = random(width * 0.7, width * 0.9);
        endX = random(width * 0.1, width * 0.3);
        storage.put("count", 0)
    }

    // 模拟非直线滑动，增加小幅度颤动
    let curveX = random(-50, 50);
    let curveY = random(-30, 30);
    let middleX = (startX + endX) / 2 + curveX;
    let middleY = (startY + endY) / 2 + curveY;

    swipe(middleX, middleY, endX, endY, duration / 2); 

    // let waitTime = random(2000, 3000); // 随机等待时间（2s-5s）
    // sleep(waitTime);

    console.log("滑动结束 🎉");
}

//  获取第一个资料卡信息
function account_info() {
    // 获取所有卡片的节点
    var cards = id("com.p1.mobile.putong:id/root").find();
    // 如果没有找到任何卡片，直接返回
    if (!cards || cards.length === 0) {
        console.log("没有内容");
        return {};
    }

    // 取最后一个卡片
    var card = cards[cards.length - 1];
    var data = {};

    // 获取用户名
    var nameNode = card.findOne(id("com.p1.mobile.putong:id/name"));
    data.name = nameNode ? nameNode.text() : "";

    // 获取位置
    var detailsNode = card.findOne(id("com.p1.mobile.putong:id/details"));
    data.details = detailsNode ? detailsNode.text() : "";

    // // 获取性别   默认是男的   自己是女号 刷到的就是男号
    // // var sexAgeNode = card.findOne(id("com.p1.mobile.putong:id/sex_age_content"));
    // var sex = card.findOne(id("com.p1.mobile.putong:id/sex"));
    // data.sex = sex ? sex.text() : "";

    
    //  他喜欢我
    var me_was_liked = card.findOne(id("com.p1.mobile.putong:id/me_was_liked"));
    data.me_was_liked = me_was_liked ? me_was_liked.text() : "";


    //  获取年龄
    var age = card.findOne(id("com.p1.mobile.putong:id/age"));
    data.age = age ? age.text() : "";

    var vip_icon = card.findOne(id("com.p1.mobile.putong:id/vip_icon"));
    data.vip_icon = vip_icon ? "vip" : "";

    // 获取交友目的
    var purposeNode = card.findOne(id("com.p1.mobile.putong:id/tv_purpose"));
    data.purpose = purposeNode ? purposeNode.text() : "";

    // 动态标签 做了性格测试的
    var dynamic_tag =  card.findOne(id("com.p1.mobile.putong:id/dynamic_tag"))
    data.dynamic_tag = dynamic_tag ? dynamic_tag.text() : "";

    // 获取星座
    var zodiacNode = card.findOne(id("com.p1.mobile.putong:id/zodiac"));
    data.zodiac = zodiacNode ? zodiacNode.text() : "";

    //  实名认证   certification_normal 子控件  text   头像本人
    var certification_normal = card.findOne(id("com.p1.mobile.putong:id/certification_normal"));
    if (certification_normal) {
        var normal = certification_normal.findOne(id("com.p1.mobile.putong:id/text"))
        data.normal = normal ? normal.text() : "";
    }

    // log(data)
    return data
}

//  根据信息获取账号权重
function calculateAccountWeight(account) {
    let weight = 0;

    if (account.length == 0) {
        return weight
    }
    // // 根据名字加权，权重占比 0.2
    // if (account.name && account.name.trim() !== '') {
    //     console.log("名字 0.2 ");
    //     weight += 0.2;  // 给有名字的账号较高权重
    // }

    // 根据年龄加权，权重占比 0.2
    let age = parseInt(account.age, 10);
    if (age >= 23 && age <= 32) {
        log_z("年龄 0.2");
        weight += 0.2;
    } else if (age >= 32 && age <= 40) {
        log_z("年龄 0.15");
        weight += 0.15;
    } else {
        log_z("年龄 0.1");
        weight += 0.1;  // 其他年龄段的账号权重较低
    }

    // 根据目的加权，权重占比 0.2
    if (account.purpose && account.purpose.trim() !== '') {
        log_z("目的 0.2");
        weight += 0.2;  // 目的明确的账号加权
    }

    // 根据动态标签加权，权重占比 0.1
    if (account.dynamic_tag && account.dynamic_tag.trim() !== '') {
        log_z("动态标签 0.1");
        weight += 0.1;  // 有动态标签的账号加权
    }

    // 根据星座加权，权重占比 0.1
    if (account.zodiac != "天秤座") {
        log_z("星座 0.1");
        weight += 0.1;  // 非天秤座加分
    }

    //  有会员
    if (account.vip_icon != "") {
        log_z("会员加分 0.1");
        weight += 0.1;  // 会员加分
    }
    
    //  喜欢我的 
    if (account.me_was_liked != "") {
        log_z("喜欢我的 0.1");
        weight += 0.1;  // 喜欢我的加分
    }

    // 根据头像情况加权，权重占比 0.2
    if (account.normal && account.normal != "") {
        log_z("头像本人 0.2");
        weight += 0.1;  // 头像本人加权
    }

    // 确保总权重不超过 1
    if (weight > 1) {
        weight = 1;  // 最大权重为 1
    }

    weight = weight.toFixed(2); // 保留两位数

    return weight;
}

/** 消息界面是否有需要查看的的信息
 * 
 * @returns 
 */
function Find_message() {
    //  获取当前是否信息需要查看
    let nodes = className("android.widget.FrameLayout").find();
    let message = 0
    nodes.forEach(node => {
        let nameView = node.findOne(id("name"));
        if (nameView && nameView.text() === "消息") {  // 确保是“消息”这个 tab
            let textView = node.findOne(id("badge"));
            if (textView) {
                // log_z(textView.id());
                // log_z("textView.text()",textView.text())
                message =  textView.text()
            }
        }
    });
    log_z("未读信息 : ",message)
    return message
}

/** 返回当前界面的消息记录
 * 
 * @returns 
 */
function chat_history() {
    var messages = [];
    let allItems = id("content_wrapper").find();

    if (allItems.empty()) {
        log_z("没有找到聊天消息！");
        return null;
    }

    allItems.forEach(function(item) {
        let avatar = false
        let err = item.findOne(id("error"));        // 对话内容
        if (err) {
            console.log(" 账号不可以发送消息")
            throw new Error("账号不能发送消息")
        }
        let textView = item.findOne(id("content"));        // 对话内容
        let header_pic = item.findOne(id("header_pic"));   // 头像
        if (header_pic.bounds().left < 100){ // 判断头像是左边还是右边
            avatar = true
        }

        if (textView.className() == "android.widget.FrameLayout") {    // 是图片 / 视频 / 语音 
            var msg = {
                sender: avatar ? "对方" : "自己",
                text: "非文本信息"
            };
        }

        if (textView.text().length <= 0 && textView.className() == "android.widget.LinearLayout") {
            // console.log("过滤掉");
            return 
        }
        //  && textView.visibleToUser() TODO 加上数据就拿不全面了 
        if (textView.className() == "android.widget.TextView" ) {    // 是文本
            // console.log(text+"",textView.text())
            var msg = {
                sender: avatar ? "对方" : "自己",
                text: textView.text()
            };
        }
        messages.push(msg);
    })
    // log(messages)
    return messages
}

/** 获取当前是那个业务界面
 * 
 * @returns 
 */
function getCurrentPage() {
    // 判断是否在滑动界面
    if (Find_Control("com.p1.mobile.putong:id/card",id)) {
        // 在滑动界面
        
        return 
    }

    //  判断是否是根界面
    if (Find_Control("bottombar",id)) {
        //  "探探" 界面
        if (Find_Control("tab_content",id)) {
            log_z("在 探探 界面 ")
            return "探探"
        }
        //  "消息" 界面
        if (Find_Control("menu_search_conv",id)) {
            log_z("在 消息 界面 ")
            return "消息"
        }
        //  "发现" 界面
        if (Find_Control("附近") && Find_Control("官宣")) {
            log_z("在 发现 界面 ");
            return "发现"
        }
        //  "我" 界面
        if (Find_Control("tab_right_icon",id)) {
            log_z("在 我 界面 ");
            return "我"
        }
        //  "娱乐" 界面
        if (Find_Control("title_bar",id)) {
            //  直播界面
            // if (Find_Control("img_live_setting",id) || Find_Control("视频聊天")) {
            //     log_z("直播界面")
            //     return "直播界面"
            // }
            log_z("在 娱乐 界面 ")
            return "娱乐"
        }
    }

    //  聊天界面
    if (Find_Control("com.p1.mobile.putong:id/input_emoji",id)) {   // log(Find_Control("input_text",id))  表情按钮
        log_z("在聊天界面");
        return "聊天界面"
    }

    log_z("界面未知")
    return "界面未知"
}


/** 切换情绪
 * 
 * @param {心情描述} Mood 
 * @param {指定情绪} emotion  可选
 */
function changeMood(Mood, emotion) {
    let currentMood ;
    // 选择情绪
    if (emotion) {
        currentMood = emotion;
        log_z(`情绪已被指定为：${currentMood}`);
    }else{
        // 否则确保情绪变化不会回到当前的情绪状态
        let availableMoods = moodList.filter(mood => mood !== Mood);

        // 随机从剩余的情绪状态中选择一个
        let randomIndex = Math.floor(Math.random() * availableMoods.length);
        currentMood = availableMoods[randomIndex];
    }

    log_z(`更新后的人物情绪描述 : ${currentMood}`);

    // 获取保存数据
    let d = storage.get(today);
    // 生成未来时间
    let wtime = addRandomMinutes(minTimeInFuture,maxTimeInFuture)
    storage.put(today,{Mood:currentMood,Favorites:d.Favorites,Likes:d.Likes,Comments:d.Comments,Posts:d.Posts,Time:wtime})
}

/** 处理弹窗和广告
 * 
 * @returns      一套执行完成需要花费 4秒 左右
 */
function wrong() {
    //  APP更新弹窗
    if (Find_Control("发现新版本")) {
        let col = Find_Control("取消")
        if (col) {
            clickobj(col);
        }
        log_z("取消更新App")
        return
    }

    let try_btn =  Find_Control("com.p1.mobile.putong:id/try_btn",id)
    if (try_btn) {
        return clickobj(try_btn);
    }

    //  检查账号
    if (Find_Control("密码登录") || Find_Control("验证码登录") || Find_Control("刷新验证") ) {
        log_z("账号未登录")
        throw new Error("未登录账号");
    }

    log_z("检查账号完成");
    // 账号违规提示
    if (Find_Control("头像未通过审核")) {
        log_z("头像违规被限制,请手动更换头像")
        throw new Error("头像违规被限制");
    }
    log_z("头像审核");
    // 温馨提示
    if (Find_Control("温馨提示") && Find_Control("立即认证")) {
        click(489,270)
        return
    }

    //  可能误触 有直播弹窗
    let iv_close = Find_Control("iv_close",id)
    if (iv_close) {
        iv_close.click();
        return false
    }
    log_z("头像认证和直播弹窗")

    //  周围没有可以刷到的人了
    let range = Find_Control("扩大范围")
    if (range) {
        clickobj(range)
        sleep(3000);
        return false
    }

    let zs = Find_Control("稍后再说")
    if (zs) {
        clickobj(zs)
        return false
    }

    //  APP 出现了卡住 无响应的的情况
    if (Find_Control("探探没有响应")) {
        let aerr_close =  Find_Control("aerr_close",id);
        if (aerr_close.click()) {
            return false
        }
    }

    if (Find_Control("更多直播")|| Find_Control("更多推荐")) {
        back();
        sleep(500);
        return false
    }

    // 主动弹出的隐藏选项   有二次选择 不考虑
    // if (Find_Control("取消") && Find_Control("删除")) {
    //     log_z(" 关闭探探小助手");
    //     let nox = Find_Control("不显示");
    //     if (nox) {
    //         log_z("不显示 探探小助手");
    //         clickobj(nox);
    //     }
    //     return
    // }

    //  右划跳出了会员  无法继续喜欢了
    let node = id("description").findOne(500);
    if (node) {
        let text = node.text();
        if (text === "尽情右滑、突破右滑上限、不错过\u000A任何你喜欢的她") {
            let num = storage.get("num",0)
            log_z(`滑动要会员了 无法继续喜欢了 今日滑动次数 ${{ num }} `);
             //  获取内存数据
            let data = storage.get(today)
            // 重置喜欢数量为0  并生成新的TODO 
            storage.put(today,{Mood:data.Mood,Favorites:0, Likes:data.Likes, Comments:data.Comments, Posts:data.Posts, Time:data.Time})
            //  关闭窗口
            back();
            throw new Error(" 无法喜欢了 ")
        }  
    }


    // 在资料片界面   
    // let profile_back = Find_Control("com.p1.mobile.putong:id/match_remaining_switch",id,100);
    // if (profile_back) {
    //     log_z("出资料");
    //     back();
    //     return 
    // }

    log_z("检查广告")
    //  资料详情界面
    if (Find_Control("button_container",id)) {
        // 子界面 -> 资料片详情    返回按钮是动态的 读取混乱
        back();
    }

    // 弹出窗口   广告
    if (Find_Control("以结婚为目的”的恋爱") && Find_Control("我要参加")) {
        //  划走
        swipe(300, 572, 32, 568, random(200, 400));
    }

    // 弹出窗口   广告
    if ((Find_Control("上传照片") && Find_Control("上传展示生活的照片")) || (Find_Control("今日缘分") && Find_Control("快来查看你的")) || (Find_Control("找个聊天搭子") && Find_Control("向好友发射信号"))) {
        // 要是我上传照片的弹窗需要关闭
        let close = id("close").findOne(100);
        if (close) {
            clickobj(close)
            return false
        }
    }

    // 弹出窗口 新人广告
    if (Find_Control("恭喜获得限时礼包") && Find_Control("立即查看")) {
        let title_text= Find_Control("稍后再说")  // 取消掉青少年模式
        if (title_text) {
            clickobj(title_text) // 点击取消广告弹窗
            return false
        }
    }

      // 弹出窗口   广告
    if (Find_Control("ignore_btn",id)) {
        let title_text= Find_Control("稍后再说")  
        if (title_text) {
            clickobj(title_text);
            return false
        }
    }

    // 弹出框 索要通知    
    // if (Find_Control("打开动态消息通知") && Find_Control("去开启")) {
    if ( Find_Control("去开启") ||  Find_Control("打开通知") ) {
        let no =  Find_Control("暂不设置");
        if (no) {
            clickobj(no)
            return false
        }
    }

    // 取消掉青少年模式
    if (Find_Control("青少年模式") && Find_Control("开启青少年模式")) {
        let title_text= Find_Control("我知道了")
        if (title_text) {
            clickobj(title_text)  // 点击取消青少年弹窗
            return false
        }
    }

    log_z("广告 和 弹出框检查完成")
    // 消息界面处理
    if (Find_Control("闪聊广场")) {
        let back =  Find_Control("back_btn",id,10);
        if (back) {
            back.click();
            return false
        }
    }
    
    // // 误触了分享按钮
    // if (Find_Control("分享给好友")) {
    //     clickobj(Find_Control("取消"))
    //     return false
    // }
    return true
}

// 喜欢 TODO 
function like() {
    log_z('心情愉悦  - 喜欢');
    //  检查当前界面
    let con = ""
    var cards = id("com.p1.mobile.putong:id/root").find();
    // 如果没有找到任何卡片，直接返回
    if (cards.length > 0) {
        return randomSwipe();  // 开始滑动
    }
}

// 预览 TODO
function preview() {
    log_z('心情一般  - 预览');
}

// 动态 TODO
function dynamic() {
    log_z('心情较差  - 动态');
}

// 互动 TODO
function interaction() {
    log_z('心情低落  - 互动');

    // 心情不好 静默模式
}

//  工作
function works() {
    //  获取当前界面
    let Page = getCurrentPage()
    if (Page == "聊天界面") {
        // 如果是未读的的情况下应该退出去联系其他的用户
        if (Find_Control("read_state_text",id)) {
            let left_icon_container = Find_Control("left_icon_container",id)
            if (left_icon_container) {
                left_icon_container.click();
                return back();
            }
        }
        
        // 是否是才打开聊天窗口
        if (Find_Control("帮你准备了2句开场白，点击发送")) {
            //  选择一个开场白   TODO 是AI 还是用系统给你的推荐开场白
            log_z("率先开团 ")
            return Find_Control("break_ice_message2_content",id).parent().click();
        }
        
        // 如果在探探小助手聊天界面
        if (Find_Control("探探小助手")) {
            log_z(" 退出 小助手聊天信息!!! ")
            // return id("left_icon_container").findOne(100).click()
            return  back();
        }

        // 在回信息界面 获取聊天内容
        let chat_data = chat_history()
        if (chat_data) {
            log_z("找到聊天记录了")
            log(chat_data);
            // TODO 找AI发送对话
        }
        return 
    }

    let Data = storage.get(today);
    let Moodr = Data.Mood
    // log_z(Data)
    //  执行情绪行为
    if (compareTime(Data)) {
        log_z(`当前人物情绪描述 : ${Moodr} `);
        //  生成新的人物情绪
        changeMood(Moodr)
    }else{
        //  有事情做
        if (Moodr) {
            // console.log("有事情做")
            // 判断情绪值 获取行为
            if (Moodr == "心情愉悦") {   
                like();     // 喜欢
            } else if (Moodr == "心情一般") {   
                preview();     // 预览
            } else if (Moodr == "心情较差") {   
                dynamic();     // 动态
            } else if (Moodr == "心情低落") {  // 可以触发 心情低落 静默模式   log_z('心情不好  - 静默');   
                interaction();     // 互动
            }
        }
    }
}

// 入口
function main() {
    // 初始化先
    if (init()) {
        //  处理异常情况  弹窗广告
        if (wrong()) {
            log_z("无异常界面 开始工作")
            works();
        }
    }
}


for (let i = 0; i < 10; i++) {
    // console.time("main")
    main()
    // console.timeEnd("main")
}
 

// log(storage.get(today))
// let wtime = addRandomMinutes(2000,3000)
// let data = storage.get(today)
// storage.put(today,{Mood:"心情愉悦",Favorites:0, Likes:data.Likes, Comments:data.Comments, Posts:data.Posts, Time:wtime})

//  ---------------------------------------------------------------------------------------


