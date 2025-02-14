// 是否打印日志
let Log = true;

// 存储区
let storage = storages.create("ABC");
// storage.remove("OCR_CACHE")

/** 查找控件
 * 
 * @param {string} str  
 * @returns 
 */
function Find_Control(call, str, timeout) {
    let targetControl = textContains(str).findOne(1); 
    if (targetControl) {
        if (targetControl.visibleToUser()) {
            // console.log(" targetControl.text :",targetControl.text());
            return targetControl
        }
    }
    return null
}

// 日志
function log_z(message) {
    if (Log) {
        let last = storage.get("last_log", 0)
        if (last == undefined) {
            last = Date.now()
            storage.put("last_log", last)
        }
        // console.log("  * ", message);
        console.log(`  * ${message} - ${Date.now() - last}`)
        storage.put("last_log", Date.now())
    }
}

function executeCommand(command) {
    let res = http.get("http://127.0.0.1:8848/execute?cmd= "+ command);    // 查看文件
    if(res.statusCode != 200){
        toast("请求失败: " + res.statusCode + " " + res.statusMessage);
        return ""
    }else{
        // console.log(res.body.string())
        let bodyString = res.body.string(); // 立即读取响应体
        // console.log(`value : ${bodyString}`)
        return bodyString
    }
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
        return false;
    }
    // 获取控件的边界
    let bounds = targetControl.bounds();
    // 检查边界是否有效
    if (!bounds) {
        console.log("未能获取控件的边界");
        return false;
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
    // return httpclick(clickX, clickY);
    return click(clickX, clickY);
}

// 滑动 模拟操作
function randomSwipe() {
    let width = device.width;
    let height = device.height;
    let startX, endX, y, duration;

    y = random(height * 0.4, height * 0.6); // 屏幕中部滑动
    duration = random(200, 400); // 滑动时间随机化

    if (Math.random() > 0.5) {
        // 向右滑（喜欢）
        startX = random(width * 0.2, width * 0.3);
        endX = random(width * 0.7, width * 0.8);
        console.log("向右滑动 👍");
    } else {
        // 向左滑（不喜欢）
        startX = random(width * 0.7, width * 0.8);
        endX = random(width * 0.2, width * 0.3);
        console.log("向左滑动 👎");
    }

    swipe(startX, y, endX, y, duration);
    let waitTime = random(2000, 5000); // 增加随机停顿时间（2s-5s）
    console.log("等待 " + waitTime + "ms");
    sleep(waitTime);

    // **模拟用户行为**
    if (Math.random() > 0.8) {
        let clickX = random(width * 0.4, width * 0.6);
        let clickY = random(height * 0.3, height * 0.7);
        click(clickX, clickY);
        console.log("模拟点击屏幕 (" + clickX + ", " + clickY + ")");
        sleep(random(1000, 3000)); // 点击后短暂停顿
        click(clickX, clickY);
    }

    // **加入模拟停顿**
    if (random(20, 25) % random(10, 15) === 0) {
        let restTime = random(10000, 30000); // 10s~30s
        console.log("模拟休息 " + restTime + "ms");
        sleep(restTime);
    }

    console.log("滑动结束 🎉");
}

//  获取第一个资料卡信息
function account_info() {
    // 获取所有卡片的节点
    var cards = id("com.p1.mobile.putong:id/root").find();

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

    //  获取年龄
    var age = card.findOne(id("com.p1.mobile.putong:id/age"));
    data.age = age ? age.text() : "";

    // 获取交友目的
    var purposeNode = card.findOne(id("com.p1.mobile.putong:id/tv_purpose"));
    data.purpose = purposeNode ? purposeNode.text() : "";

    // 获取星座
    var zodiacNode = card.findOne(id("com.p1.mobile.putong:id/zodiac"));
    data.zodiac = zodiacNode ? zodiacNode.text() : "";

    log(data)
}

// 获取全部资料卡  *
function account_info_all() {
    
    // 获取所有卡片的节点
    var cards = id("com.p1.mobile.putong:id/root").find();

    // 存储解析后的数据
    var results = [];

    cards.forEach(card => {
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

        //  获取年龄
        var age = card.findOne(id("com.p1.mobile.putong:id/age"));
        data.age = age ? age.text() : "";

        // 获取交友目的
        var purposeNode = card.findOne(id("com.p1.mobile.putong:id/tv_purpose"));
        data.purpose = purposeNode ? purposeNode.text() : "";

        // 获取星座
        var zodiacNode = card.findOne(id("com.p1.mobile.putong:id/zodiac"));
        data.zodiac = zodiacNode ? zodiacNode.text() : "";

        // 将数据添加到结果列表
        results.push(data);
    });

    // 输出结果
    log(results);
}

//  返回当前界面的消息记录
function chat_history() {
    var messages = [];
    let allItems = id("com.p1.mobile.putong:id/content_wrapper").find();

    if (allItems.empty()) {
        log_z("没有找到聊天消息！");
        return null;
    }

    allItems.forEach(function(item) {
        let avatar = false
        let err = item.findOne(id("com.p1.mobile.putong:id/error"));        // 对话内容
        if (err) {
            console.log(" 账号不可以发送消息")
            throw new Error("账号不能发送消息")
        }
        let textView = item.findOne(id("com.p1.mobile.putong:id/content"));        // 对话内容
        let header_pic = item.findOne(id("com.p1.mobile.putong:id/header_pic"));   // 头像
        if (header_pic.bounds().left < 100){ // 判断头像是左边还是右边
            avatar = true
        }

        if (textView.className() == "android.widget.FrameLayout") {    // 是图片 / 视频 / 语音 
            // console.log(textView.className())
            var msg = {
                sender: avatar ? "对方" : "自己",
                text: "非文本信息"
            };
        }

        if (textView.className() == "android.widget.TextView") {    // 是文本
            // console.log(text+"",textView.text())
            var msg = {
                sender: avatar ? "对方" : "自己",
                text: textView.text()
            };
        }
        messages.push(msg);
    })
    log(messages);
    return messages
}

// 初始化
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
        console.log("请求无障碍权限失败")
        auto();
        throw new Error("请求无障碍权限失败");
    }

    // 锁屏了就打开
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded() // 唤醒
        swipe(232, 1000, 232, 200, 800);  // 打开
    }

    if (!packageNameEndsWith("mobile.putong")) {
        app.launch('com.p1.mobile.putong')
        log_z("启动探探")
        sleep(3000);
        return false;
    }
    return true;
}

//  具体的分配工作
function works() {
    console.log("弹出窗口")
    // 弹出窗口
    if (Find_Control("上传照片") && Find_Control("上传展示生活的照片")) {
        // 要是我上传照片的弹窗需要关闭
        // com.p1.mobile.putong:id/close   这个是关闭按钮
        let close = id("com.p1.mobile.putong:id/close").findOne(100);
        if (close) {
            clickobj(close)
        }
    }
    if (Find_Control("今日缘分") && Find_Control("快来查看你的")) {
        // 要是我上传照片的弹窗需要关闭
        // com.p1.mobile.putong:id/close   这个是关闭按钮
        let close = id("com.p1.mobile.putong:id/close").findOne(100);
        if (close) {
            clickobj(close)
        }
    }
    if (Find_Control("她专享会员") && Find_Control("立刻获取")) {
        console.log('广告')
        swipe(300, 572, 32, 568, random(200, 400));
    }

    if (Find_Control("青少年模式") && Find_Control("开启青少年模式")) {
        // 取消掉青少年模式
        let title_text= Find_Control("我知道了")
        if (title_text) {
            // 点击取消青少年弹窗
            clickobj(title_text)
        }
    }
    if (Find_Control("打开动态消息通知") && Find_Control("去开启")) {
        let no =  Find_Control("暂不设置");
        if (no) {
            clickobj(no)
        }
    }
    if (Find_Control("分享给好友")) {
        clickobj(Find_Control("取消"))
        return
    }
    console.log("新人广告")
    //  新人广告
    if (Find_Control("恭喜获得限时礼包") && Find_Control("立即查看")) {
        // 取消掉青少年模式
        let title_text= Find_Control("稍后再说")
        if (title_text) {
            // 点击取消广告弹窗
            clickobj(title_text)
            return 
        }
    }
    // 勾引要开会员的 闪聊匹配
    if (Find_Control("闪聊匹配") && Find_Control("立即和")) {
        // 左划掉
        swipe(300, 572, 32, 568, random(200, 400));
    }
    //  点开了资料
    // let menu_top_ab_refactor = id("com.p1.mobile.putong:id/menu_top_ab_refactor").findOne(100)
    let profile_back = id("com.p1.mobile.putong:id/profile_back").findOne(10)
    if (profile_back) {
        console.log("出资料")
        clickobj(profile_back)
        return 
    }

    console.log("检查配对")
    //  首先是配对完成的可以开始聊天了 
    if (Find_Control("配对成功")) {
        log_z("发消息")
        let targetControl = Find_Control("发消息")
        if (targetControl) {
            log_z("发消息2")
            clickobj(targetControl)
            return sleep(1000)
        }
    }
    if (Find_Control("立即认证")) {
        // 随便点击一个地方就行
        httpclick(271, 152);
        // throw new Error("账号进小黑屋了 无法评论无法点赞 无法发送动态");
    }
    if (Find_Control("开通")) {
        let close = id("com.p1.mobile.putong:id/close").findOne(1000); // 关闭按钮
        clickobj(close)
    }
    
    //  当前界面是在 "我" 的界面
    if (Find_Control("认证中心")) {
        // TODO

    }

    let range = Find_Control("扩大范围")
    if (range) {
        clickobj(range)
    }
    //  在滑动界面
    if (Find_Control("查看资料")) {
        //  动态滑动
        log_z("动态滑动")
        randomSwipe();
    }
}

function main() {
    if (init()) {
        log_z("开始干活")
        if (Find_Control("密码登录") || Find_Control("验证码登录") || Find_Control("刷新验证") ) {
            log_z("账号未登录")
            throw new Error("未登录账号");
        }
        works();
    }
}

//  保存寻找信息红点
function name1() {
    // 截图整个屏幕
    if (!requestScreenCapture()) {
        toast("请求截图权限失败");
        exit();
    }

    // 判断区域内是否有红色像素
    function findRedInRegion(image) {
        var width = image.getWidth();
        var height = image.getHeight();
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var color = image.pixel(x, y)
                // 通过颜色值判断是否为红色
                if (color == -39836) {
                    console.log(`当前坐标 x = ${x} , y = ${y}`)
                    // click(x+607 ,y+342)
                    click(x+924 ,y+572)
                    return true; // 找到红色
                }
            }
        }
        return false; // 没有找到红色
    }

    // 截图完成
    var img = captureScreen();  // 截取整个屏幕

    var region = images.clip(img, 607,342,100,569); 
    // var region = images.clip(img, 924,572, 128, 844);

    // 判断该区域内是否有红色
    var isRedFound = findRedInRegion(region);
    if (isRedFound) {
        log("在指定区域找到红色！");
    } else {
        log("在指定区域没有找到红色????");
    }
}

// main()

// 获取未读信息数量
function Find_message() {
    //  获取当前是否信息需要查看
    let nodes = className("android.widget.FrameLayout").find();
    let message = 0
    nodes.forEach(node => {
        let nameView = node.findOne(id("com.p1.mobile.putong:id/name"));
        if (nameView && nameView.text() === "消息") {  // 确保是“消息”这个 tab
            let textView = node.findOne(id("com.p1.mobile.putong:id/badge"));
            if (textView) {
                console.log(textView.id());
                message =  textView.text()
            }
        }
    });
    return message
}
 

// com.p1.mobile.putong:id/all_pairs_entrance   这个是消息界面 右上角的新配对的数量

//  com.p1.mobile.putong:id/message_sort_image  这个是消息界面特有的东西 三个横杠
//  认证中心 是 "我" 界面特有的东西

// resource-id="com.p1.mobile.putong:id/img_live_setting"   // 直播设置
// resource-id="com.p1.mobile.putong:id/start_live"         // 我要开直播

// chat_history()


// if (Find_Control("他喜欢了你")) {
//     console.log(" 他喜欢我")  // 是一个标识  他喜欢我 我再右划就可以配对成功
// }


