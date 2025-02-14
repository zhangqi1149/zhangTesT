function main() {
    // 是否打印日志
    let Log = true;

    let storage = storages.create("ABC");

    // 日志
    function log_z(message) {
        if (Log) {
            console.log(`  * ${message}`)
        }
    }

    // 计算两个 rect的关系和距离
    function getRelativePosition(rect1, rect2) {
        // 计算中心点坐标
        const cx1 = (rect1.left + rect1.right) / 2;
        const cy1 = (rect1.top + rect1.bottom) / 2;
        const cx2 = (rect2.left + rect2.right) / 2;
        const cy2 = (rect2.top + rect2.bottom) / 2;
    
        // 计算欧几里得距离
        const distance = Math.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2);
    
        let position = "";
    
        // 位置判断
        const isLeft = rect2.right < rect1.left;
        const isRight = rect2.left > rect1.right;
        const isAbove = rect2.bottom <= rect1.top;
        const isBelow = rect2.top >= rect1.bottom;
    
        if (isLeft) position = "左";
        if (isRight) position = "右";
        if (isAbove) position += "上";
        if (isBelow) position += "下";
    
        // 处理重叠情况
        if (!position) {
            position = "内部";
        }
    
        return { position, distance };
    }

    // 创建一个矩形
    function createRect(left, top, right, bottom) {
        return {
            left,
            top,
            right,
            bottom,
            getWidth() {
                return this.right - this.left;
            },
            getHeight() {
                return this.bottom - this.top;
            },
            getCenter() {
                return {
                    x: (this.left + this.right) / 2,
                    y: (this.top + this.bottom) / 2
                };
            }
        };
    }

    // 获取控件对象
    function getUIObjectOne(call, text, timeout) {
        let obj = call(text).findOne(timeout != null ? timeout : 2000)
        if (obj && obj.visibleToUser()) { return obj; }
        return null;
    }

    // 获取控件的坐标
    function getUIObjectBounds(call, text, timeout) {
        let obj = getUIObjectOne(call, text, timeout)
        if (obj) { return obj.bounds() }
        return null;
    }

    // 手机设备的所有设置都在这里
    function device() {
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
        
        print(executeCommand("getprop ro.serialno"))
        
         //  锁屏属性
         if (executeCommand("settings get secure lockscreen.disabled") == 0 ) {
            // log_z("禁用锁屏:")
            executeCommand("settings put secure lockscreen.disabled 1")  // lockscreen.disabled 1表示禁用 0表示启用锁屏。        
        }
        
        //  强制设置为竖屏
        if (executeCommand("settings get secure lockscreen.disabled") != 0 ) {
            // log_z("设置竖屏:")
            //  强制设置为竖屏
            executeCommand("settings put system user_rotation 0")
        }
        
        if (executeCommand("settings get system screen_off_timeout") != 2147483647) {
            // 设置当前息屏时间为 2147483647
            // log_z("设置息屏:")
            executeCommand("settings put system screen_off_timeout 2147483647")
        }
    }

    // 抖音所有的操作都在这里
    function douyin() {
        // 通用常量
        const SC_FAILED  = 0
        const SC_SUCCESS = 1

        // 当前所在页面的常量
        const PAGE_UNKNOWN          = 10000
        const PAGE_INDEX            = 10001     // 首页
        const PAGE_FRIEND           = 10002     // 朋友
        const PAGE_MESSAGE          = 10004     // 消息 页面
        const PAGE_MYPAGE           = 10005     // "我" 页面

        const PAGE_MYINFO           = 10006     // 修改个人信息页面    
        const PAGE_CAMERA           = 10007     // 摄像
        const PAGE_CHANGENAME       = 10008     // 修改名字
        const PAGE_INTRODUC         = 10009     // 修改简介
        const PAGE_GENDER           = 10010     // 修改性别
        const PAGE_AREA             = 10011     // 修改地区
        const PAGE_BACKGROUND       = 10012     // 更换背景
        const PAGE_SELBACKGROUND    = 10013     // 选择背景
        const PAGE_BACKGROUND_PHOTO = 10014     // 更换背景选择照片
        const PAGE_AVATAR_PHOTO     = 10015     // 更换头像选择照片
        const PAGE_USERPAGE         = 10016     // 其它用户主页

        // 检查当前所在的页面
        // 当有参数的时候,则检查参数的字符串并在成功时返回return_value
        function getCurrentPage() {
            function findStrings(list, strs) {
                for (let i = 0; i < strs.length; i++) {
                    let s = strs[i];
                    if (list[s] == undefined) {
                        return false;
                    }
                }
                return true;
            }
            // 检查key是否包含str
            function includesString(list, str) {
                return Object.keys(list).some(key => key.includes(str));
            }
            function isSelect(uiobj) {
                let parentobj = uiobj;
                for (let index = 0; index < 5; index++) {
                    parentobj = parentobj.parent()
                }
                if (parentobj.selected() == true) {
                    return true;
                }
                return false;
            }

            let uiobj1 = getUIObjectOne(desc, "首页，按钮")
            if (uiobj1) {
                if (isSelect(uiobj1)) {
                    return PAGE_INDEX;
                }

                let uiobj2 = getUIObjectOne(desc, "朋友，按钮")
                if (uiobj2) {
                    if (isSelect(uiobj2)) {
                        return PAGE_FRIEND;
                    }
                }

                let uiobj3 = getUIObjectOne(desc, "消息，按钮")
                if (uiobj3) {
                    if (isSelect(uiobj3)) {
                        return PAGE_MESSAGE;
                    }
                }

                let uiobj4 = getUIObjectOne(desc, "我，按钮")
                if (uiobj4) {
                    if (isSelect(uiobj4)) {
                        return PAGE_MYPAGE;
                    }
                }
            }

            let str_list = {}
            let obj = className("android.widget.TextView").find()
            for (let i = 0; i < obj.length; i++) {
                // obj[i].desc()
                let text = obj[i].getText()
                if (text && obj[i].visibleToUser()) {
                    print(text)
                    str_list[text] = 1;
                }
            }

            // 其它人主页
            if (findStrings(str_list, ["获赞", "关注", "粉丝"])) {
                if (includesString(str_list, "抖音号：")) {
                    return PAGE_USERPAGE
                }    
            }
           
            // 修改个人信息页面
            if (findStrings(str_list, ["更换头像", "名字", "简介", "所在地"])) { return PAGE_MYINFO }
            // 修改名字页面
            if (findStrings(str_list, ["修改名字", "保存", "我的名字"])) { return PAGE_CHANGENAME }
            // 修改简介
            if (findStrings(str_list, ["修改简介", "保存"])) { return PAGE_INTRODUC }
            // 修改性别
            if (findStrings(str_list, ["男", "女", "不展示"])) { return PAGE_GENDER }
            // 选择地区
            if (findStrings(str_list, ["选择地区", "当前位置", "暂不设置"])) { return PAGE_AREA }
            // 更换背景
            //if (findStrings(str_list, ["更换背景", "下载"])) { return PAGE_BACKGROUND }
            // 选择背景
            //if (findStrings(str_list, ["从手机相册选择照片", "选择推荐或自己公开的视频"])) { return PAGE_SELBACKGROUND }
            // 更换背景选择照片
            //if (findStrings(str_list, ["所有照片", "添加可访问照片"])) { return PAGE_BACKGROUND_PHOTO }
            // 更换头像选择照片
            //if (findStrings(str_list, ["所有照片", "拍个头像"])) { return PAGE_AVATAR_PHOTO }
            
            return PAGE_UNKNOWN;
        }

        // 获取主页信息
        function getMainPageInfo() {
            let currpage = getCurrentPage()
            if (currpage != PAGE_MYPAGE && currpage != PAGE_USERPAGE) {
                return {};
            }

            let result = {}
            
            // 利用 "获赞", "互关", "关注", "粉丝"分别来定位对应的数量
            let rect_praise = getUIObjectBounds(text, "获赞");
            let rect_mutual_follow = getUIObjectBounds(text, "互关");
            let rect_follow = getUIObjectBounds(text, "关注");
            let rect_fan = getUIObjectBounds(text, "粉丝");
            let dynumber = getUIObjectOne(textContains, "抖音号：")
            let rect_dynumber = dynumber != null ? dynumber.bounds() : null;
            
            let gender = ""
            let age = ""
            let ui_gender = descStartsWith("男").findOne(1000)
            if (ui_gender == null) { 
                ui_gender = descStartsWith("女").findOne(1000)
                if (ui_gender != null) { gender = "女" }
            }
            if (ui_gender != null) {
                let s_age = ui_gender.getText()
                if (s_age.endsWith("岁")) { age = s_age }
            }
            result["name"] = ""
            result["gender"] = gender
            result["age"] = age
            result["dynumber"] = dynumber != null ? dynumber.getText() : ""
            result['praise'] = ""
            result["mutual_follow"] = ""
            result["follow"] = ""
            result["fan"] = ""

            // 因为ID经常变动所以拉取所有 TextView利用坐标进行定位
            let obj = className("android.widget.TextView").find()
            let count = 0
            for (let i = 0; i < obj.length; i++) {
                if (!obj[i].visibleToUser()) {
                    continue;
                }
                let rect = obj[i].bounds();
                print(obj[i].getText(), rect)
                
                // 判断名字
                if (rect_dynumber) {
                    let rect_result1 = getRelativePosition(rect_dynumber, rect)
                    if (rect_result1.position == "上" && rect_result1.distance < 150) {
                        result["name"] = obj[i].getText()
                        count += 1;
                        continue;
                    }
                }
                
                // 获赞
                if (rect_praise) {
                    if (currpage == PAGE_MYPAGE) {
                        let rect_result1 = getRelativePosition(rect_praise, rect)
                        if (rect_result1.position == "上" && rect_result1.distance < 100) {
                            result["praise"] = obj[i].getText()
                            count += 1;
                            continue;
                        }
                    } else {
                        let rect_result1 = getRelativePosition(rect_praise, rect)
                        if (rect_result1.position == "左" && rect_result1.distance < 150) {
                            result["praise"] = obj[i].getText()
                            count += 1;
                            continue;
                        }
                    }
                }

                // 互关
                if (rect_mutual_follow) {
                    if (currpage == PAGE_MYPAGE) {
                        let rect_result1 = getRelativePosition(mutual_follow, rect)
                        if (rect_result1.position == "上" && rect_result1.distance < 100) {
                            result["mutual_follow"] = obj[i].getText()
                            count += 1;
                            continue;
                        }
                    }
                }

                // 关注
                if (rect_follow) {
                    print("-----------------")
                    let rect_result1 = getRelativePosition(rect_follow, rect)
                    print(rect_result1)
                    if (currpage == PAGE_MYPAGE) {
                        if (rect_result1.position == "上" && rect_result1.distance < 100) {
                            result["follow"] = obj[i].getText()
                            count += 1;
                            continue;
                        }
                    } else {
                        if (rect_praise) {
                            let rect_result2 = getRelativePosition(rect_praise, rect)
                            print("-----------------===")
                            print(rect_result2)
                            if (rect_result1.position == "左" && rect_result2.position == "右") {
                                result["follow"] = obj[i].getText()
                                count += 1;
                                continue;
                            }  
                        }                        
                    }
                }                

                // 粉丝
                if (rect_fan) {
                    let rect_result1 = getRelativePosition(rect_fan, rect)
                    if (currpage == PAGE_MYPAGE) {
                        if (rect_result1.position == "上" && rect_result1.distance < 100) {
                            result["fan"] = obj[i].getText()
                            count += 1;
                            continue;
                        }
                    } else {
                        if (rect_follow) {
                            let rect_result2 = getRelativePosition(rect_follow, rect)
                            if (rect_result1.position == "左" && rect_result2.position == "右") {
                                result["fan"] = obj[i].getText()
                                count += 1;
                                continue;
                            }
                        }
                    }
                }
                
                
                if (currpage == PAGE_MYPAGE) {
                    if (count >= 5) { break }
                }
            }
            return result
        }

        // 点击一个UI对象的中间
        // uiobj = UI对象. 例如 let uiobj = id("1111").findOne(1000)
        // delay = 点击成功之后等待多久
        function clickMidd(uiobj, delay) {
            let isclick = false;
            try {
                if (uiobj) {
                    let rect = uiobj.bounds();
                    // 按钮是否可以点击
                    // uiobj.clickable()
                    isclick = click(rect.centerX(), rect.centerY()); 
                    return isclick
                }
            } catch (e) {
                log("clickMidd: " + e);
            } finally {
                if (true == isclick && delay) {
                    sleep(delay)
                }
            }
            return false;
        }

        // 点击返回按钮
        function back(num) {
            function checkPoint(rect) {
                return (rect.right < 130 && rect.bottom < 210);
            }

            // 点击返回控件
            function findClickBack() {
                let back_list = descStartsWith("返回").find()
                for (let i = 0; i < back_list.length; i++) {
                    if (back_list[i].visibleToUser() &&checkPoint(back_list[i].bounds())) {
                        return clickMidd(back_list[i], 1000)
                    }
                }
                return false;
            }
            
            for (let i = 0; i < num; i++) {
                if (!findClickBack()) {
                    break;
                }
            }
        }

        // 打开分类页面: 首页, 朋友, 拍摄, 消息, 我
        function openClass(page) {
            // 等待页面打开
            function waitClassPage(page, timeout) {
                let ui_const = 0
                switch (page) {
                    case "首页":
                        ui_const = PAGE_INDEX
                        break;
                    case "朋友":
                        ui_const = PAGE_FRIEND
                        break;
                    case "拍摄":
                        ui_const = PAGE_CAMERA
                        break;
                    case "消息":
                        ui_const = PAGE_MESSAGE
                        break;
                    case "我":
                        ui_const = PAGE_MYPAGE
                        break;
                    default:
                        break;
                }
                let start = new Date()
                for (let index = 0; index < timeout; index++) {
                    sleep(10)
                    if (getCurrentPage() == ui_const) {
                        return true;
                    }
                    if ( (new Date() - start) > timeout) {
                        break;
                    }
                }
                return false;
            }

            // 检查当前页面是否可以看到最下面的大分类
            let currpage = getCurrentPage()
            if (currpage > PAGE_UNKNOWN && currpage <= PAGE_MYPAGE) {
                log_z("openPage : " + page)
                let desc_str = page + "，按钮"
                let button = getUIObjectOne(desc, desc_str)
                if (clickMidd(button)) {
                    if (page == "拍摄") {
                        sleep(1500)
                        return true;
                    }
                    return waitClassPage(page, 1000);
                }
            }
            return false;
        }

        // 设置个人信息
        function setMyInfo(info) {
            // 在"我" - 点击"名字"打开设置页面
            function openMySeting() {
                return clickMidd(getUIObjectOne(text, "编辑主页"));
            }

            function setName(name) {
                clickMidd(getUIObjectOne(desc, "清空"))
                if (clickMidd(getUIObjectOne(className, "android.widget.EditText"))) {
                    if (setText(name)) {
                        return clickMidd(getUIObjectOne(text, "保存"), 2000);
                    }
                }
                return false;
            }
            function setIntroduc(introduc) {
                if (clickMidd(getUIObjectOne(className, "android.widget.EditText"))) {
                    if (setText(introduc)) {
                        return clickMidd(getUIObjectOne(text, "保存"), 2000);
                    }
                }
                return false;
            }
            function setGender(gender) {
                return clickMidd(getUIObjectOne(desc, gender), 2000)
            }

            for (let i = 0; i < 2; i++) {
                // 获得当前页面
                let currpage = getCurrentPage()
                print(currpage)
                if (currpage > PAGE_UNKNOWN && currpage <= PAGE_MYPAGE) {
                    // 打开 ”我“
                    if (openClass("我") == false) {
                        log_z("打开 我 页面失败.")
                        return false;
                    }
                    // 读取个人信息检查是否已经设置过了
                    let myinfo = getMyInfo()
                    if (myinfo.name == info.name && myinfo.gender == info.gender) {
                        log_z("无需重新设置个人信息!")
                        return true;
                    }
                    // 打开设置页面
                    if (!openMySeting()) {
                        return false;
                    }
                    sleep(2000)
                    continue;
                }

                // 开始设置吧
                if (currpage >= PAGE_MYINFO && currpage <= PAGE_AVATAR_PHOTO) {
                    switch (currpage) {
                        // 在更换页面
                        case PAGE_MYINFO:
                            // 检查哪个没有设置就设置哪个
                            let item_list = id("tv_profile_item_content").find()
                            if (item_list.length != 7) {
                                throw new Error("douyin - setMyInfo : Item数量错误.");
                            }
                            // 名字
                            if (item_list[0].getText() != info.name) {
                                clickMidd(item_list[0], 1000)
                                break;
                            }
                            // 简介
                            if (item_list[1].getText() != info.introduc) {
                                clickMidd(item_list[1], 1000)
                            }
                            // 性别
                            if (item_list[2].getText() != info.gender) {
                                clickMidd(item_list[2], 1000)
                            }
                            break;
                        // 更改名字
                        case PAGE_CHANGENAME:
                            if (!setName(info.name)) {
                                throw new Error("douyin.setMyInfo : setName 失败!");
                            }
                            break;
                        // 更改简介
                        case PAGE_INTRODUC:
                            if (!setIntroduc(info.introduc)) {
                                throw new Error("douyin.setMyInfo : setIntroduc 失败!");
                            }
                            break;
                        // 更改性别
                        case PAGE_GENDER:
                            if (!setGender(info.gender)) {
                                throw new Error("douyin.setMyInfo : setGender 失败!");
                            }
                            break;
                        default:
                            break;
                    }
                }
                
                sleep(10)
            }
            
            return false;
        }

        // ---------------------------------------------------------
        // backPage(["首页", "朋友", "消息", "我"])
        // print(getCurrentPage()) INTRODUC
        // setMyInfo({name:"月光精灵", introduc:"一个简单的小精灵.", gender:"女"})
        print(getMainPageInfo())        
    }

    // 抖音
    douyin();
}

// main();

function text2(str, callback) {
    let result = {
        str_list: [],
        findOne() {
            let v = this.str_list[0].t
            return v != undefined ? v : null;
        },
        find() {
            return this.str_list;
        }
    }
    let obj = className("android.widget.TextView").find()
    for (let i = 0; i < obj.length; i++) {
        let t = obj[i].getText()
        if (t && obj[i].visibleToUser()) {
            if (str == t) {
                if (callback) {
                    if (callback(t, obj[i])) {
                        result.str_list.push({t: obj[i]});
                        continue;
                    }
                }
                result.str_list.push({t: obj[i]});
            }
        }
    }
    return result
}

let v = new text2("关注", function (t, ui){
    print("text2", t, ui.getText())
    
    return ui.visibleToUser()
})

// print(v.findOne().getText())

// print(typeof(""))
// print(typeof([]))

// function test(call) {
//     print(call == text)
// }
// test(desc)