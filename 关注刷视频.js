/**
 * 初始化 检查抖音是否打开了 
 * 1.执行参数事件:
 *          检查当前界面 若在执行界面就开始执行  否则操作到可执行界面
 *          
 * 2.生成随机参数塞入本地   
 *          事件id e_id :   
 *                          1.刷推荐视频
 *                          2.直播间关注
 *                          3.纯刷直播间
 *                          4.推荐视频点赞
 *                          5.推荐视频收藏
 *           事件执行时间 *e_time  :  直播/推荐视频的时间
 *           事件执行间隔  e_sleep :  点赞   关注  收藏  切换推荐视频/直播间 之间的间隔
 *           事件执行次数  e_num   :  完成一次 -1  
 * 
*/

let Num = 120      // 关注人数
let Age = 21       // 年龄
let Lv = 5        // 财富等级
let storage = storages.create("ABC");  // 创建存储对象
let today = new Date().toISOString().split('T')[0];  // 获取今日日期，格式为 YYYY-MM-DD

//  管理存储值
function manage_value() {
    // 获取保存的所有键列表，如果没有保存过键列表，则默认为空数组
    var keys = storage.get("keysList", []);
    // 如果键不存在，将今天的日期添加到 keysList 中
    if (!keys.includes(today)) {
        keys.push(today);
        storage.put(today,[{e_num:Num, e_id:0, e_time:0, e_sleep:0, e_count:0 }])
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

/** 初始化 
 *  无障碍服务  启动抖音
 * @returns 
 */
function init(){
    manage_value()  // 初始今日数据 删除其余的数据
    // 检查进入关注是否到达数量了
    let a = storage.get(today)
    if (a[0].e_num <= 0 ) {
        toast("今日账号关注到上限了");
        return false
    }

    // 权限检查
    if (!auto.service) {
        console.log("无障碍服务未开启");
        auto();
        return  false
    }
    
    //  检查当前应用
    let currentPkg = currentPackage();
    if (currentPkg == "com.ss.android.ugc.aweme"){   // 是否在抖音
        return true
    } else {
        console.log("不在抖音界面,当前界面: ",currentPkg);
        app.launch('com.ss.android.ugc.aweme')
        sleep(7000);   // 等待未成年结束
    }
    return false
}

//  遍历UI对象
function traverseUIObject(uiobj, depth) {
    depth = depth || 0; // 如果 depth 未定义，则初始化为 0

    if (!uiobj) {
        return;
    }
    
    // 打印当前节点信息
    const indentation = ' '.repeat(depth * 2); // 控制缩进，用于更清晰的打印
    _text_ = uiobj.text()
    // console.log(`${indentation} Class: ${uiobj.className()}, ID: ${uiobj.id()}, Child Count: ${uiobj.childCount()}, Text: ${_text_}, visibleToUser: ${uiobj.visibleToUser()}`);
    console.log(`${indentation} Class: ${uiobj.className()}, ID: ${uiobj.id()}, 子类数量: ${uiobj.childCount()}, Text: ${_text_}, visibleToUser: ${uiobj.visibleToUser()}`);

    // 遍历子节点
    for (let i = 0; i < uiobj.childCount(); i++) {
        childUiObject = uiobj.child(i);
        traverseUIObject(childUiObject, depth + 1); // 递归调用，深度加一
    }
}


// 检查参数
function inspect() {
    let a = storage.get(today)
    if (a[0].e_id > 0 ) {
        return true
    }
    return false
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

/** 点击屏幕上1/3
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
    console.log("-.-! 1/3 ");

    httpclick(centerX, centerY);  // 点击屏幕中心点
    sleep(2000);
}

/** 屏幕上 1/2 向 1/3 滑动
 * 
 */
function swipes() {
    // 获取屏幕宽度和高度
    let width = device.width;
    let height = device.height;

    // 计算屏幕中心点的坐标
    let centerX = width / 2;
    let centerY = height / 2;

    let oferX = width / 2;
    let oferY = height / 3;

    swipe(centerX, centerY, oferX, oferY, 200); 

    console.log("->.->"); 
}

/** 查找控件 (textContains)
 * 
 * @param {string} str  
 * @returns 
 */
function Find_Control(str) {
    let targetControl = textContains(str).findOne(800); 
    if (targetControl) {
        if (targetControl.visibleToUser()) {
            return targetControl
        }
        // console.log("饿哦i ",targetControl.text());
    }  
    return null
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
    return httpclick(clickX, clickY);
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
            toast("不符合标准 ! ")
            console.log("不符合标准 ! ")
        }
    }
    return false
}

//  -----------------------------------------------------------生成参数

// 随机一个参数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
function compareTime() {
    let now = new Date();  // 获取当前时间
    let a = storage.get(today)
    let futureTime = new Date(a[0].e_time)
    // 比较时间戳
    if (futureTime > now) {
        // console.log('未来时间大于当前时间');
        return true
    } else {
        // console.log('未来时间小于当前时间');
        return false
    }
}

// 生成参数
function generate() {
    // * 事件执行时间 e_time    :  直播/推荐视频的时间  15 - 20 分钟
    //   事件执行间隔 e_sleep   :  点赞   关注  收藏  切换推荐视频/直播间 之间的间隔    具体执行的时候随机  暂时弃用
    //   事件执行次数 e_num     :  完成一次 -1
    let a = storage.get(today)
    // 生成行为id  根据id去生成行为参数
    let id = getRandomInt(1,2); 
    if (id == 1) { // 刷推荐视频指标  e_time : 看13-20分钟就停了  (e_sleep : 切换视频的时间  8-15 秒 具体执行的时候随机)
        return storage.put(today,[{e_num: a[0].e_num, e_id: 1, e_time: addRandomMinutes(5,8), e_sleep: 0, e_count: 0}])
    }
    if (id == 2) { // 直播间关注指标   e_count  关注数量 2 - 4 个   (e_sleep 随机切换直播间 具体执行的时候随机)
        return storage.put(today,[{e_num: a[0].e_num, e_id: 2, e_time: 0, e_sleep:0, e_count:getRandomInt(2,4)}])
    }
    if (id == 3) { // 纯刷直播间指标 e_time 停留时长 15 - 17   (e_sleep 随机切换直播间 具体执行的时候随机)
        return storage.put(today,[{e_num: a[0].e_num, e_id: 3, e_time:addRandomMinutes(15,17), e_sleep:0, e_count:0}])
    }
}

//  重置参数
function reset_V() {
    let e = storage.get(today)
    storage.put(today,[{e_num: e[0].e_num, e_id: 0, e_time:0, e_sleep:0, e_count:0}]);
}

//  =======================================================================================具体操作

// 处理小资料卡
function Small_Data_Card() {
    let a = storage.get(today)
    // 判断是否关注过了
    let targetControl = desc("关注 按钮").findOne(1800);
    if (targetControl) { // 未关注
        console.log("未关注")
        clickobj(targetControl);
        sleep(2000);
        storage.put(today,[{e_num: a[0].e_num-1, e_id: 2, e_time: a[0].e_time, e_sleep:0, e_count:a[0].e_count-1}])
        // console.log("Small_Data_Card 点击屏幕中间")
        clickCenter();
    }else{
        // console.log("Small_Data_Card 点击屏幕中间1")
        // 点击屏幕中间
        return clickCenter();
    }
}

//  点关注
function interest() {
    // 随机关注方式
    let randomInt = Math.floor(Math.random() * 10) + 1;

    //  现在是可以点的  选择是小资料点关注 还是 资料点关注
    if (randomInt % 2 === 0 ) {
        let targetControl = id("com.ss.android.ugc.aweme:id/q=4").findOne(1000);  // 说点什么
        console.log("点头像")
        clickobj(targetControl,-350)  // 点击头像
        sleep(5000);  // 等待加载控件
    }else{
        // console.log("点击关注按钮")
        Small_Data_Card();  // 点击关注
    }

    let targetControl = id("com.ss.android.ugc.aweme:id/ind").findOne(1000);  // 关注按钮
    if (targetControl) {
        console.log("Small_Data_Card2")
        Small_Data_Card();
        sleep(2000);
    }
    
    // 当前界面 -> 用户资料界面
    if (Find_Control("已关注") == null) {
        let targetControl = id("com.ss.android.ugc.aweme:id/ind").findOne(1000);  // 关注按钮
        if (targetControl) {
            console.log("用户资料界面")
            clickobj(targetControl);
            let a = storage.get(today)
            storage.put(today,[{e_num: a[0].e_num-1, e_id: 2, e_time: a[0].e_time, e_sleep:0, e_count:a[0].e_count-1}])
            sleep(1000);
        }
    }
    
    //  回到直播间
    let targetret = desc("返回").findOne(1000);
    if (targetret) {
        console.log("用户资料界面- 返回界面")
        clickobj(targetret);
        return sleep(5000);
    }
}

//  刷视频向上
function brush() {
    swipes()
    sleep(randomDelay(15,22)) // 随机sleep
}

//  当前界面  -1 指重新执行 0可以执行命令
function enter_interface(e_id) {
    if (e_id == 1) { // 推荐视频  1-20
        // 到时间了就重置
        if (!compareTime()) {
            console.log("行为已经完成")
            reset_V()
            return -1
        }

        if (desc("已选中，推荐，按钮").findOne(500)) {
            console.log("已选中")
            return 0
        }
        
        // let cl =  desc("关闭").findOne(500)
        // if (cl) {
        //     console.log("关闭")
        //     clickobj(cl)
        //     sleep(5000);
        //     return -1
        // }

        // let buttont =  desc("推荐，按钮").findOne(500)
        // if (buttont) {
        //     console.log("推荐，按钮")
        //     back();
        //     sleep(3000);
        //     return 0
        // }


        back();  // 返回
        return -1
    }

    if (e_id == 2) { // 直播间    20-40
        let to = storage.get(today)
        if (to[0].e_count <= 0) {
            console.log("行为已经完成")
            reset_V()
            return -1
        }

        if (Find_Control("编辑主页")) {
            back();
            return -1
        }
        console.log("1")
        
        // 神秘人隐身特权 要点掉
        let mysterious = id("com.ss.android.ugc.aweme:id/q2z").findOne(500);  
        if (mysterious) {
            console.log("神秘人隐身特权")
            clickCenter();
        }

        console.log("2")

        if (text("直播已结束").findOne(500)) {
            console.log("直播已结束")
            swipes(); //  下滑
            sleep(5000);  // 等待控价加载
        }

        if (Find_Control("***")) {
            console.log("直播间隐藏id")
            swipes(); //  下滑
            sleep(5000);  // 等待控价加载
        }

        console.log("2.5")
        if (text("个人中心").findOne(500)) {
            // 点击屏幕1/3
            clickCenter();
            console.log("直播间少")
            swipes(); //  下滑
            sleep(5000);  // 等待控价加载
        }

        // 因主播设置，暂不支持查看个人信息
        if (Find_Control("因主播设置，暂不支持查看个人信息")) {
            // 点击取消
            clickCenter();
            swipes(); //  下滑
            sleep(5000); // 等待控件加载
        }

        console.log("3")

        //  是不是点出来了用户小资料片  ( 检查是否符合点关注 )
        let AT = desc("艾特 按钮").findOne(500);
        if (AT) { // 找到了未关注
            if (sieving()) { // 判断是否可以点关注
                // 可以点关注
                console.log("可以点关注")
                return 0
            }else{
                console.log("点击取消")
                clickCenter(); //点击屏幕去除小资料
                //  随机更换直播间
                if (getRandomInt(1,6) == 6) {
                    swipes(); //  下滑
                    sleep(5000); // 等待控件加载
                }
                return -1
            }
        }

        console.log("4")

        //  是不是在直播间外面
        if (desc("已选中，推荐，按钮").findOne(500)) { //在推荐视频界面
            // 点击直播按钮
            let button = desc("直播，按钮").findOne(500)
            if (button) {
                // console.log("直播按钮")
                clickobj(button);
                sleep(4000); //等待加载控件
            }
            return -1
        }

        console.log("5")
        
        //  是不是在用户资料   && Find_Control("作品") 
        if (Find_Control("抖音号")) {
            // 在用户资料界面
            console.log("在用户资料界面");
            return 0
        }
        
        console.log("6")

        //  是不是在直播间内
        if (Find_Control("更多直播") || Find_Control("小时榜") || Find_Control("人气榜") ) { // 在直播间
            // 执行点击操作
            let targetControl = id("com.ss.android.ugc.aweme:id/gth").findOne(1800);  // 点击用户弹出小资料框
            // console.log("更多直播")
            clickobj(targetControl,-25,-80);
            sleep(2000);
            return -1
        }
        console.log("7")

        // 在看直播外面看直播
        if (desc("已选中，直播，按钮").findOne(500)) {
            // 点击进入直播间
            if (Find_Control("观看历史")) {
                swipes();
                sleep(2000);
            }
            // if (Find_Control("直播发现")) {
                // 点击屏幕进入直播间
                clickCenter()
                sleep(5000);
            // }
            return 0
        }
        console.log("8")
        // 找到直播按钮就去点击
        let buttonz =  desc("直播，按钮").findOne(500)
        if (buttonz) {
            console.log("直播，按钮")
            clickobj(buttonz)
            sleep(5000);
            return -1
        }
        console.log("9")
        back();
        return -1
    }
}

// ==================================== 推荐视频

// 推荐视频
function Suggest() {
    console.log("执行推荐视频")
    let e = storage.get(today)
    let e_id =e[0].e_id
    //  检查是否完成了
    if (e_id == 1  && !compareTime() ) {
        console.log(" 重置")
        reset_V(); // 重置
        return 
    }

    let enter_code = enter_interface(e_id)
    if (enter_code == 0 ) {
        // 点关注还是更换直播间
        brush();  //  具体的行为  点关注 
    }

    // console.log("执行")
    
}

// ==================================== 直播间点关注 

// 直播管理
function LiveManage() {
    console.log("执行直播管理")
    // 获取行为id
    let e = storage.get(today)
    let e_id =e[0].e_id
    // 检查纯看直播时长
    if ( (e_id == 3 && !compareTime()) || (e_id == 2 && e[0].e_count <= 0)) { 
        reset_V(); // 重置
        return 
    }

    // 当前界面
    let enter_code = enter_interface(e_id)
    if (enter_code == 0 ) {
        console.log(" 点关注 ")
        // 点关注还是更换直播间
        interest();  //  具体的行为  点关注 
    }
}

// 执行行为操作
function execute() {
    // 获取参数 执行那一项
    let behavior = storage.get(today)
    let b_id =behavior[0].e_id
    if (b_id == 1) {
        // 执行刷推荐视频
        Suggest();
    }

    if (b_id == 2 || b_id == 3 ) {
        // 执行直播间关注
        console.log("执行直播间关注")
        LiveManage();
    }
}

// ======================================================================================= end

function main() {
    // 初始化状态
    if (!init()) {return}
    // 检查参数
    if (inspect()) {
        // 执行操作
        console.log("执行操作")
        execute()
    }else{
        console.log("生成参数")
        // 生成行为参数
        generate()
    }
}

for (let i = 0; i < 2000; i++) {
    main()
    let e = storage.get(today)
    console.log("==============",e)
}


// id  com.ss.android.ugc.aweme:id/z3w  是管理员

// console.log("抖音号 ====== : ",Find_Control("抖音号"))
// console.log(id("android:id/content").findOne().childCount())