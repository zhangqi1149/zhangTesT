let Log =  true

//  初始化今日养号份额
let maxLikes = 20;       // 点赞上限
let minLikes = 1;       // 点赞下限

let maxPosts  = 1;       // 发动态上限
// let minPosts  = 1;       // 发动态下限

let maxComments = 1;     // 评论上限
let minComments = 1;     // 评论下限

let Favorites = 10;   // 喜欢上限 就是右滑动 最少7个 
let today = new Date().toISOString().split('T')[0];  // 获取今日日期，格式为 YYYY-MM-DD

// 存储区
let storage = storages.create("ABC");

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


// 随机一个参数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


manage_value() // 初始化数据
//  管理存储值
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    var keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);
        //  随机     今日        喜欢上限                 点赞上限                                          评论上限                           发动态上限           行为      执行时间  次数
        storage.put(today,{Favorites:Favorites, Likes:getRandomInt(minLikes,maxLikes), Comments:getRandomInt(minComments,maxComments), Posts:getRandomInt(0,maxPosts), Event:"", Time:0, Count:0})
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


/** 查找控件     字符版本 eval
 * @param {string} str     要查找的内容
 * @param {string} call    指令
 * @param {number} timeout 查找时间
 * @returns 
 */
function Find_Control2(str,call,timeout) {
    call = (call !== undefined) ? call : "textContains";
    timeout = (timeout !== undefined) ? timeout : 100;
    let targetControl = eval(call + '("' + str + '")').findOne(timeout)
    if (targetControl) {
        if (targetControl.visibleToUser()) {
            return targetControl
        }
    }
    return null
}

/** 查找控件     
 * @param {string} str     要查找的内容
 * @param {string} call    指令
 * @param {number} timeout 查找时间
 * @returns 
 */
function Find_Control(str,call,timeout) {
    call = (call !== undefined) ? call : textContains;
    timeout = (timeout !== undefined) ? timeout : 100;
    let targetControl = call(str).findOne(timeout)
    // if (targetControl) {
    //     if (targetControl.visibleToUser()) {
    //         return targetControl
    //     }
    // }
    return targetControl && targetControl.visibleToUser() ? targetControl : null;
}

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
                // console.log(textView.id());
                // console.log("textView.text()",textView.text())
                message =  textView.text()
            }
        }
    });
    console.log("未读信息 : ",message)
    return message
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

        // console.log(textView.className())
        // console.log(textView.id())
        // console.log(textView.text())
        if (textView.className() == "android.widget.FrameLayout") {    // 是图片 / 视频 / 语音 
            var msg = {
                sender: avatar ? "对方" : "自己",
                text: "非文本信息"
            };
        }

        if (textView.text().length <= 0 && textView.className() == "android.widget.LinearLayout") {
            console.log("过滤掉");
            return 
        }
        //  && textView.visibleToUser() 加上数据就拿不全面了 
        if (textView.className() == "android.widget.TextView" ) {    // 是文本
            // console.log(text+"",textView.text())
            var msg = {
                sender: avatar ? "对方" : "自己",
                text: textView.text()
            };
        }
        messages.push(msg);
    })
    log(messages)
    return messages
}

// 模式分发 随机出数据
function dispatchMode() {
    let data = storage.get(today);  // 获取上限数据
    // 随机一个数值
    let num = getRandomInt(0, 7)
    console.log("这个是个随机的数值 : ",num)
    console.log("喜欢的数量   : ",data.Favorites)
    //  首先是检查是否达到上限 到上限后才去
    if (data.Favorites > 0) {
        // 是否可以命中模式
        if (num == 2) {
            // 启动喜欢模式  滑动喜欢或者不喜欢
            // 生成一个未来时间来保存  event_time
            console.log(" 命中喜欢模式")
        }
    }
    
    if (num == 1) {
        // 启动预览模式  看直播
        console.log("启动预览模式  看直播")
        
        
    }
    
    if (num == 3) {
        // 启动互动模式  点赞或者是评论
        console.log("启动互动模式  点赞或者是评论")
    }

    if (num == 4) {
        // 启动动态模式  发文字动态
        console.log("启动动态模式  发文字动态")
        
    }
    
    //  静默状态  在当前界面等待
    console.log("静默状态  在当前界面等待 去回信息  !!!!! ")
    return 0
    
}

//  获取当前是那个业务界面
function getCurrentPage() {
    //  判断是否是根界面
    if (Find_Control("com.p1.mobile.putong:id/bottombar",id,10)) {
        //  "探探" 界面
        if (Find_Control("com.p1.mobile.putong:id/tab_content",id,10)) {
            console.log("在 探探 界面 ")
            return "探探"
        }
        //  "消息" 界面
        if (Find_Control("com.p1.mobile.putong:id/menu_search_conv",id,10)) {
            console.log("在 消息 界面 ")
            return "消息"
        }
        //  "发现" 界面
        if (Find_Control("附近") && Find_Control("官宣")) {
            console.log("在 发现 界面 ");
            return "发现"
        }
        //  "我" 界面
        if (Find_Control("com.p1.mobile.putong:id/tab_right_icon",id,10)) {
            console.log("在 我 界面 ");
            return "我"
        }
        //  "娱乐" 界面
        if (Find_Control("com.p1.mobile.putong:id/title_bar",id,10)) {
            //  直播界面
            // if (Find_Control("com.p1.mobile.putong:id/img_live_setting",id) || Find_Control("视频聊天")) {
            //     console.log("直播界面")
            //     return "直播界面"
            // }
            console.log("在 娱乐 界面 ")
            return "娱乐"
        }
    }

    //  聊天界面
    if (Find_Control("com.p1.mobile.putong:id/right_icon_container",id)) {   // log(Find_Control("com.p1.mobile.putong:id/input_text",id)) 
        console.log("在聊天界面");
        return "聊天界面"
    }

    console.log("界面未知")
    return "界面未知"
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

// 处理异常
function wrong1() {
    // 探探界面处理
    if (Find_Control("com.p1.mobile.putong:id/button_container",id)) {
        // 子界面 -> 资料片详情    返回按钮是动态的 读取混乱
        back();
        return false
    }
    
    // 娱乐界面处理
    if (Find_Control("更多直播")) {
        back();
        sleep(500);
        return false
    }

    //  有直播弹窗
    let iv_close = Find_Control("com.p1.mobile.putong:id/iv_close",id)
    if (iv_close) {
        iv_close.click();
        return false
    }

    // 消息界面处理
    if (Find_Control("闪聊广场")) {
        let back =  Find_Control("com.p1.mobile.putong:id/back_btn",id,10);
        if (back) {
            back.click();
            return false
        }
    }


    // 发现界面处理   
    // if (condition) {  // 在别人的动态评论界面
        
    // }

    //   我界面处理

    return true
}

//  处理弹窗和广告
function wrong() {
    // 主动弹出的隐藏选项   有二次选择 不考虑
    // if (Find_Control("取消") && Find_Control("删除")) {
    //     console.log(" 关闭探探小助手");
    //     let nox = Find_Control("不显示");
    //     if (nox) {
    //         console.log("不显示 探探小助手");
    //         clickobj(nox);
    //     }
    //     return
    // }

    //  右划跳出了会员  无法继续喜欢了
    let node = id("com.p1.mobile.putong:id/description").findOne(500);
    if (node) {
        let text = node.text();
        if (text === "尽情右滑、突破右滑上限、不错过\u000A任何你喜欢的她") {
            log("文本匹配成功！");
            // 重置喜欢数量为0 
            let data = storage.get(today)
            storage.put(today,{Favorites:0, Likes:data.Likes, Comments:data.Comments, Posts:data.Posts, Event:data.Event, Time:data.Time,Count:data.Count})
            //  关闭窗口
        }  
    }
    let data1 = storage.get(today)
    // log(data1)

    //  检查账号
    if (Find_Control("密码登录") || Find_Control("验证码登录") || Find_Control("刷新验证") ) {
        log_z("账号未登录")
        throw new Error("未登录账号");
    }

    // 跳出 探探小助手对话框
    let assi = Find_Control("探探小助手")
    if (assi) {
        console.log("可以点击进入")
        click(assi)
        // id("com.p1.mobile.putong:id/left_icon_container").findOne(100).click()
    }

    // 弹出窗口   广告
    if (Find_Control("以结婚为目的”的恋爱") && Find_Control("我要参加")) {
        //  划走
        swipe(300, 572, 32, 568, random(200, 400));
    }

    // 弹出窗口   广告
    if ((Find_Control("上传照片") && Find_Control("上传展示生活的照片")) || (Find_Control("今日缘分") && Find_Control("快来查看你的")) || (Find_Control("找个聊天搭子") && Find_Control("向好友发射信号"))) {
        // 要是我上传照片的弹窗需要关闭
        let close = id("com.p1.mobile.putong:id/close").findOne(100);
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
    // 误触了分享按钮
    if (Find_Control("分享给好友")) {
        clickobj(Find_Control("取消"))
        return false
    }
    // 弹出框 索要通知
    if (Find_Control("打开动态消息通知") && Find_Control("去开启")) {
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

    //  周围没有可以刷到的人了
    let range = Find_Control("扩大范围")
    if (range) {
        clickobj(range)
        return false
    }


    return true
}

//  处理工作
function works() {
    // 要是遇到在通知界面的话
    if (Find_Control("通知")&& Find_Control("全部已读")) {
        //  找到 可以回礼的
        let item = id("com.p1.mobile.putong:id/reply_tv").find() //  通知   全部已读  可以点击    (com.p1.mobile.putong:id/reply_tv) 礼貌回礼   / 聊聊 兑取是失败的
        item.forEach(node =>{
            if (node.text() == "礼貌回礼") {
                node.click();
                sleep(getRandomInt(300, 1200));
            }
        });
        // 出去
        let left_icon_container= id("com.p1.mobile.putong:id/left_icon_container").findOne(100)
        if (left_icon_container) {
            left_icon_container.click();
        }
    }

    console.log("开始工作")
    console.log("获取模式")
    console.log("模式初始化")
    console.log("随机行为")
    console.log("行为执行")
}


function main() {
    // 初始化
    if (init()) {
        if (wrong()) {
            // 获取当前界面
            let Current = getCurrentPage()
            if (Current == "聊天界面") {
                // 如果是未读的的情况下应该退出去联系其他的用户
                if (Find_Control("com.p1.mobile.putong:id/read_state_text",id)) {
                    let left_icon_container = Find_Control("com.p1.mobile.putong:id/left_icon_container",id)
                    if (left_icon_container) {
                        return left_icon_container.click();
                    }
                }
                // 是否是才打开聊天窗口
                if (Find_Control("帮你准备了2句开场白，点击发送")) {
                    //  选择一个开场白   TODO 是AI 还是用系统给你的推荐开场白
                    console.log("率先开团 ")
                    return Find_Control("com.p1.mobile.putong:id/break_ice_message2_content",id).parent().click();
                }

                // 在回信息界面 获取聊天内容 
                let chat_data = chat_history()
                if (chat_data) {
                    console.log("找到聊天记录了")
                    log(chat_data);
                    return 
                }
                return 
            }

            // 检查是否有消息要回
            if (Find_message() > 0 ) {
                // 出现了 
                let Tt = Find_Control("探探小助手")
                if (Tt) {
                    //  这个消息是没用的 还提示消息
                    // 长按
                    console.log(" 找到小助手了")
                    // let bound = Tt.bounds();
                    // press(bound.centerX(), bound.centerY(), 1000)
                    clickobj(Tt)
                    return 
                }

                // 查找探探小助手
                Tt = Find_Control("你有1个新配对")
                if (Tt) {
                    clickobj(Tt)
                    return 
                }

                // 前往对话点击

                // 点击可以对话的

                return 
            }

            // 处理工作
            // 读取配置
            let data = storage.get(today);
            if (data.Event) {
                if (data.Event == "喜欢") {
                    console.log("喜欢")
                }
                if (data.Event == "预览") {
                    console.log("预览")
                }
                if (data.Event == "动态") {
                    console.log("动态")
                }
                if (data.Event == "互动") {
                    console.log("互动")
                }                
            }

            // 无异常可以工作
            works();  // 分配工作
        }
    }
}

// main()



//  发送内容
// setText("泥嚎")
// Find_Control("发送").click()


// log(Find_Control("探探小助手").text())




//  信息界面  有信息提示 可能是有信息没看  或者有新配对   


// com.p1.mobile.putong:id/all_pairs_entrance  这个是会变动的 新配对 或者是 全部配对


// com.p1.mobile.putong:id/guide_text   暂时没有新配对  有这个就是没有配对信息要点击
// let left_icon_container= id("com.p1.mobile.putong:id/left_icon_container").findOne(100)
// if (left_icon_container) {
//     left_icon_container.click();
// }


// log(Find_Control("尽情右滑、突破右滑上限、不错过").text())
// log(Find_Control("突破右滑").text())


// log(Find_Control("无限右滑").text())

// let node = id("com.p1.mobile.putong:id/description").findOne(5000);
// if (node) {
//     let text = node.text();
//     console.log("控件的文本内容为: " + text);
// } else {
//     console.log("未找到指定控件！");
// }


// 查找包含 "右滑" 文本的控件
// let node = textContains("尽情右滑").findOne(5000);
// // let node = Find_Control("尽情右滑",textContains,5000);  // 无法使用隐藏来判断
// if (node) {
//     console.log("找到控件，文本为: " + node.text());
// } else {
//     console.log("未找到包含该文本的控件！");
// }


// log(id("com.p1.mobile.putong:id/description").findOne(100).text());
// if ( id("com.p1.mobile.putong:id/description").findOne(100).text() == "尽情右滑、突破右滑上限、不错过任何你喜欢的她") {
//     console.log(" 已经完成")
// }


// storage.put(today,{Favorites:Favorites, Likes:getRandomInt(minLikes,maxLikes), Comments:getRandomInt(minComments,maxComments), Posts:getRandomInt(0,maxPosts), Event:"", Time:0, Count:0})

// let data = storage.get(today)
// log(data)

// wrong1()
// getCurrentPage()
// log(Find_message())

// console.log(Find_Control("视频聊天").text())



// com.p1.mobile.putong:id/right_icon_container 右边的图标
// com.p1.mobile.putong:id/input_text   输入框




//   com.p1.mobile.putong:id/send   发布界面 


//  分享我的时刻…   com.p1.mobile.putong:id/edit_field

//  com.p1.mobile.putong:id/selected_topic  加话题


// log(Find_Control("com.p1.mobile.putong:id/selected_topic",id).text())



//  本身是有个上限的 网传是120个     目前我测试的是97个就要会员无法右划了
//  首先是滑动过快会触发喜欢上限  ->    ()





// console.log(Find_Control("你有1个新配对").id()) 
console.time("1")
console.log(Find_Control("com.p1.mobile.putong:id/match_txt",id).text()) 
console.timeEnd("1")


console.time("2")
console.log(Find_Control("match_txt",id).text()) 
console.timeEnd("2")