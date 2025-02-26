let Log =  false  // 是否打日志
//  初始化今日养号份额
let maxLikes = 20;       // 点赞上限
let minLikes = 1;       // 点赞下限

let maxComments = 1;     // 评论上限
let minComments = 1;     // 评论下限

//  滑动过快或者频率过快会触发喜欢上限限制 就要会员无法右划喜欢了  目前我测试的手动是104个 脚本是109个   网传是120个
 
let today = new Date().toISOString().split('T')[0];  // 获取今日日期


// 未来时间区间     心情保持时间
let maxTimeInFuture = 10
let minTimeInFuture = 6


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
        //  随机     今日    情绪描述        是否可以喜欢       点赞上限                                执行时间 
        storage.put(today,{Mood:"心情愉悦", Favorites: true,  Likes:getRandomInt(minLikes,maxLikes), Time:0})
        //  随机     今日    情绪描述                           喜欢上限                        点赞上限                                          评论上限                               发动态上限                      执行时间 
        // storage.put(today,{Mood:"心情愉悦",Favorites:getRandomInt(minFavorites,maxFavorites), Likes:getRandomInt(minLikes,maxLikes), Comments:getRandomInt(minComments,maxComments), Posts:getRandomInt(0,maxPosts), Time:0})
        storage.put("num", 0)  // 重置今日喜欢数量
        storage.put("no_start", false)  // 沉默
        storage.put("count",0)
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

    //  心情低落的时候不上号
    let data = storage.get(today);
    // log("情绪 :",data.Mood)
    if (data.Mood == "心情低落") {
        if (!compareTime(data)) {
            if (storage.get("no_start")) {
                if (currentPackage() != "net.oneplus.launcher") {
                    console.log(" 返回桌面 ")
                    back();
                    back();
                    back();
                    back();
                }
                sleep(3 * 1000 * 60) // 5分钟
                return false
            }
        }else{
            // 重置内容可以启动
            storage.put("no_start",false);
        }
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

// 获取时间差（单位：分钟）
function getTimeDifferenceInMinutes(futureTime) {
    let currentTime = new Date();  // 获取当前时间
    let futureTimeObj = new Date(futureTime);  // 将字符串转换为 Date 对象
    let futureTimeStamp = futureTimeObj.getTime(); // 获取未来时间的时间戳
    let currentTimeStamp = currentTime.getTime(); // 获取当前时间的时间戳

    // console.log("未来时间: " + futureTimeObj);
    // console.log("当前时间: " + currentTime);

    // 检查时间戳是否有效
    if (isNaN(futureTimeStamp)) {
        log_z("无效的未来日期对象");
        return NaN;
    }
    if (isNaN(currentTimeStamp)) {
        log_z("无效的当前日期对象");
        return NaN;
    }

    let timeDifference = futureTimeStamp - currentTimeStamp; // 计算时间差（毫秒）
    return Math.floor(timeDifference / (1000 * 60));  // 将毫秒转换为小时
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

/** 拆分信息 获取对方发的信息
 * 
 * @param {信息列表} messages 
 * @returns 
 */
function sort_mess(messages) {
    // log(messages)
    if (!Array.isArray(messages) || messages.length === 0) {
        console.log("消息为空，返回空数组")
        return []; // 如果消息为空，返回空数组
    }

    // 获取最后一次自己发的消息的位置
    let lastSelfMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].sender === "自己说") {
            lastSelfMessageIndex = i;
            break;
        }
    }
    
    // 从最后一次自己发的消息开始，获取对方发的后续消息
    let targetMessages = [];
    for (let i = lastSelfMessageIndex + 1; i < messages.length; i++) {
        if (messages[i].sender === "对方说") {
            targetMessages.push(messages[i].text);
        }
    }
    
    // 最终只保留最后一条对方的消息
    // let result = targetMessages.slice(-1); // 获取最后一条对方的消息
    // console.log(targetMessages);  // 输出: ["为什么啊"]
    return targetMessages
}

/**
 * 利用AI聊天
 * @param {Storages} storage : 本地存储上下文的容器
 * @param {string} target_id : 聊天对方的ID,如果为null则是我们自己要和AI对话
 * @param {string} above : 介词.比如 : "对方说:"
 * @param {Array} say_text : 聊天的内容
 * @param {function} init: 初始化函数, 用于第一次和哪个吊毛聊天时初始化信息
 * @returns AI的给出的结果 json
 */
function chat(storage, target_id, above, say_text, init) {
    function post(url, jsonData, header, timeout) {
        let response = null;
        // 创建线程执行 HTTP 请求
        let thread = threads.start(function () {
            try {
                // 这个东西默认2分钟超时
                response = http.postJson(url, jsonData, {
                    headers: header
                });
            } catch (e) {
                log("请求出错: " + e);
            }
        });
    
        // 等待线程完成, 超时时间为 10 
        // 当接受到数据之后join也立即返回.
        thread.join(timeout)
        thread.interrupt();
        return response;
    }
    
    // 发送AI聊天请求 
    function send_request(messages) {
        let url = 'https://api.siliconflow.cn/v1/chat/completions';
        let payload = {
            "model":"deepseek-ai/DeepSeek-V3",
            "messages": [],
            "stream":false,
            "max_tokens":512,
            "stop":["null"],
            "temperature":0.7,
            "top_p":0.7,
            "top_k":50,
            "frequency_penalty":0.5,
            "n":1,
            "response_format":{"type":"text"},
            "tools":[
                {
                    "type":"function",
                    "function":{
                        "description":"<string>",
                        "name":"<string>",
                        "parameters":{},
                        "strict":false
                    }
                }
            ]
        }
    
        let headers = {
            "Authorization": 'Bearer sk-jmspwvbzckqtiqzislxfnalfhhtuidmrsidmlwidvycdasqf',
            "Content-Type": "application/json"
        }
    
        // 设置上下文
        payload.messages = messages
        
        // 请求聊天, 1分钟超时
        return post(url, payload, headers, 60 * 1000)
    }
    
    // 将上下文发送到服务器保存
    function send_context_toserver(target_id, chat_context) {
        let url = 'http://192.168.1.163:8002/save_context';
        let headers = {
            "Content-Type": "application/json"
        }
        let payload = {
            "device_id":"device_id_123",
            "target_id":target_id,
            "messages": chat_context,
        }
        // 保存到服务器1分钟超时
        return post(url, payload, headers, 60 * 1000)
    }
    
    function extractJsonBlocks(markdownStr) {
        /**
         * 从 Markdown 字符串中提取所有用 ```json 包裹的 JSON 块。
         *
         * @param {string} markdownStr - 包含 Markdown 格式的字符串，其中可能包含多个 JSON 块。
         * @returns {Array} 返回一个包含解析后 JSON 对象的数组。如果没有找到任何 JSON 块则返回空数组。
         */
        
        // 使用正则表达式匹配所有 ```json ... ``` 的块
        const pattern = /```json\n([\s\S]*?)\n```/g;
        const jsonBlocks = [];
        let match;
    
        // 提取所有匹配的块
        while ((match = pattern.exec(markdownStr)) !== null) {
            jsonBlocks.push(match[1].trim());
        }
    
        const extractedData = [];
    
        // 尝试解析每个 JSON 块
        jsonBlocks.forEach(block => {
            try {
                const data = JSON.parse(block);
                extractedData.push(data);
            } catch (e) {
                console.error(`Failed to decode JSON block: ${block.slice(0, 50)}... Error: ${e}`);
            }
        });
    
        return extractedData;
    }

    // 获得上下文
    function get_context(chat_context, target_id, above, say_text, init) {
        // 将聊天内容格式化成一个字符串
        // 例如 :
        //      对方说 : 你好啊
        //      对方说 : 怎么不吊我?
        let say = ""
        for (let index = 0; index < say_text.length; index++) {
            say = say + above + " : " + say_text[index] + "\n"
        }

        // 如果目标ID不为空则说明需要组织和对方聊天上下文了
        if (target_id != null) {
            // 如果还没有和对方这个吊毛聊过天,则设置初始聊天内容保存到上下文
            let target_context = chat_context[target_id]
            if (undefined == target_context) {
                if (say_text.length == 0) {
                    say = "<msg>我想主动和对方打招呼, 该如何说?</msg>"
                } else {
                    say = "<msg>对方主动和我打招呼了: \n" + say + "我该如何回复?</msg>"; 
                }
                target_context = {
                    "last_time" : "",
                    "chat": [],
                    "context": [{
                        "role": "user",
                        "content": init() + "\n" + say
                    }]
                }
                chat_context[target_id] = target_context;
                say = ""
            }

            // 保存最后更新上下文时间,用于计算间隔了多少天删除上下文
            // let timeDiff = Date() - target_context.last_time的结果是相隔了多少毫秒
            // 转为分 let diffInMinutes = timeDiff / (1000 * 60);
            // 转为时 let diffInMinutes = timeDiff / (1000 * 60 * 60);
            // 转为天 let diffInMinutes = timeDiff / (1000 * 60 * 60 * 24);
            target_context.last_time = new Date();

            // 保存聊天内容
            for (let index = 0; index < say_text.length; index++) {
                target_context.chat.push(above + " : " + say_text[index])
            }

            // 对方说什么什么
            if (say.length > 0) {
                target_context.context.push({"role": "user",
                    "content": say
                })
            }

            // 检查上下文长度,如果太长的话合并一下
            if (target_context.context.length > 10) {
                // 先删除 <msg> ... </msg>块
                let sd = target_context.context[0].content
                target_context.context[0].content = sd.replace(/<msg>[\s\S]*?<\/msg>/g, '');
                // 保留前面两次对话,删除其它的
                target_context.context.splice(2)
                // 重组一个
                let chat_log = "我现在把我们之间的聊天内容发送给你 : \n"
                for (let index = 0; index < target_context.chat.length; index++) {
                    chat_log = chat_log + target_context.chat[index] + "\n"
                }
                target_context.context.push({"role":"user", "content":chat_log})
            }
            return target_context.context;
        }
        return [{"role":"user","content": say}]
    }
    
    // 调取聊天上下文
    let chat_context = storage.get("context")
    if (undefined == chat_context) { chat_context = {} }
    let ai_context = get_context(chat_context, target_id, above, say_text, init)
    let begin = new Date()
    let response = send_request(ai_context);
    print(`请求时长 : ${new Date() - begin}`)
    if (response != null && response.statusCode == 200) {
        let result_json = {};
        let result = JSON.parse(response.body.string());
        // print(result["choices"][0]["message"])
        // print("AI说 : " + result["choices"][0]["message"]["content"])
        if (target_id != null) {
            let target_context = chat_context[target_id]
            if (undefined != target_context) {
                target_context.context.push(result.choices[0].message)
                let text = extractJsonBlocks(result.choices[0].message.content)
                if (text.length > 0) {
                    result_json = text[0]
                    target_context.chat.push("我说 : " + text[0].chattext)
                }
            }
        }

        // 保存上下文
        storage.put("context", chat_context)

        // if (target_id != null) {
        //     // 将聊天上下文保存到服务器
        //     send_context_toserver(target_id, chat_context)
        // }
        
        return result_json;
    }
    return null;
}

function chatinit() {
    let name = "小雅"
    let age = 22
    let im = "在校的女大学生"
    let hobby = "唱歌，跳舞，打羽毛球，游泳，追剧"
    let region = "北京"
    let job = "学生"
    let reason = "社交软件上有一个人正在和我聊天."
    let lead = "聊聊天"
    let attitude = "女汉子"

    // 获取被选中的账号
    let accList = storage.get("accList",[]);
    let tan_name = storage.get("Selected","未知")
    // console.log("tantan_id",tantan_id)
    let existing = accList.findIndex(profile => profile.name === tan_name);
    // console.log("existing",existing)
    // console.log("accList[existing]")
    // log(accList[existing])

    // let profile = "对方个人资料如下 : 性别:男, 年龄:32岁, 地区:北京. 网名:风清扬, 签名:感动有毒."
    let profile = `对方个人资料如下 :  网名 : ${accList[existing].name}, 年龄 : ${accList[existing].age} ,  个人签名 ${accList[existing].content}, 个人标签 : ${accList[existing].tag}`
    // console.log(profile)

    let jsonObject = {
        "chattext": "发送给对方的内容",
        "friendly level": 1.0,
        "gender":"对方的性别或未知",
        "age":"对方的年龄或未知",
        "region":"对方的地区或未知",
        "work":"对方的工作或未知",
        "income situation":"对方的收入情况或未知",
        "personality":"对方的性格或未知",
        "preferred girl type":"对方喜欢的女孩类型或未知",
        "preferred girl age range":"对方喜欢的女孩年龄段或未知",
        "ambiguous":0.0,
        "isok":false,
    };
    let json_s = JSON.stringify(jsonObject);

    let str = `你好deepseek. 
    下面是我的个人信息:
    1. 我叫${name}
    2. 今年${age}岁.
    3. 我是一个${im}
    4. 我的爱好${hobby}
    5. 我生活在${region}
    6. 我是个${job}
    请记住不要修改我的个人信息.
    ${reason}${profile}
    请你帮我和对方聊天,并通过引入各种不同的话题尽量分析对方如下信息:
    部分信息可能已经在"对方个人资料当中提供给你".
    1. 工作
    2. 收入情况
    3. 对方的性格
    4. 对方喜欢的女孩类型
    5. 对方喜欢哪个年龄段的女孩
    6. 年龄段
    7. 现居住地
    我想通过聊天给对方留下好感,并吸引对方${lead}
    当对方聊天的内容有性暗示、性要求时希望你帮我想一个相对暧昧的回复,并不直接恢复.
    接下来我会陆续将我们之间的聊天内容发送给你,你告诉我如何与对方交谈.
    请务必遵守下列要求:
    1. 请使用${attitude}的语气帮我聊天
    2. 通过聊天的内容分析一个"friendly level". 初始1分,满分10分,每次最多添加0.5分
    3. 如果对方聊天内容出现了侮辱中国、反动、反华、侮辱我的话请将"friendly level"设置为0
    4. 你每次帮我回复的时候只需要给出一个 json chunk 就可以了,其它的不要.
    5. json 模版如下: \`\`\`json\
    ${json_s}\
    }\`\`\`
    6. 分析对方和我聊天的暧昧程度满分10. 保存到ambiguous字段
    7. 在任何情况下不可以暴露是AI在帮我聊天
    8. 不要在问句后面带”呢“字
    9. 聊天的内容不能有AI的味道
    10. 请保持风趣幽默
    11. 如果对方聊天内容暧昧的话我们就和他聊的暧昧点.
    12. 如果对方连续说了相同的话请不要给出相同的回复.
    13. 如果对方明确的要来看我直播的话请将isok字段设置为true
    14. 如果在我发送给你的内容里面看到了<msg>...</msg>标签请仔细阅读
    15. 如果出现 "非文本信息" 表示对方发送了个图片或者是语音,请根据上下文给出回复
    16. 不要出现 "非文本信息" 也不要让对方解释发送的图片是什么意思.
    17. 如果没有对方发送了一个 "非文本信息" 并且还没有上下文 就表示我先和别人打的招呼 比如 : hi
    18. 不要在聊天的时候带上对方的网名
    19. 我不开直播 也没有直播间
    如果你看懂了就回复"明白需求并保证要求."那么接下来让我们一起开始分析这个人吧
    `
    return str
}

//  调用api
function chats(mess) {
    let accList = storage.get("accList",[]);
    let tan_name = storage.get("Selected","未知")
    let existing = accList.findIndex(profile => profile.name === tan_name);

    // log("tan_name :",tan_name)
    log("id :",accList[existing].tantan_id)
    // 接入AI   
    // let result = chat(storage, "target_888", "对方说", mess, chatinit); 
    let result = chat(storage, accList[existing].tantan_id, "对方说", mess, chatinit); 

    // log(result);

    return result
}

//  -------------------------------- 探探

/** 获取当前被选择的界面
 * 
 * @returns 
 */
function get_tab_selete() {
    // 获取所有匹配的控件
    let tab ;
    var nodes = id("com.p1.mobile.putong:id/tv_tab_title").find();  // 获取所有匹配控件的列表
    // 确保 nodes 不为 null 或 undefined
    if (!nodes || nodes.length === 0) {
        console.log("没有找到符合条件的控件");
    } else {
        // 打印控件数量
        // console.log("找到的控件数量: " + nodes.length);
        nodes.forEach((w) => {
            if (w.selected() == true && w.visibleToUser()) {   // 非隐藏 并且 被选中
                console.log("选中的控件文本: " + w.text());  // 打印选中的控件的文本
                tab =   w.text()
            }
        });
    }
    return tab
}

//  特殊处理滑动
function randomSwipe() {
    //  获取信息内容  
    let wergh = calculateAccountWeight(account_info());
    if (wergh > 0.51) {
        log_z(" *** 优质账号:",wergh);
        // **增加休息模拟**
        if (random(20, 30) % random(10, 20) === 0) {
            let restTime = random(1000, 2000); // 模拟更长时间的停顿（1s-2s）
            sleep(restTime);
        }
        //  点击资料片
        if (Math.random() > 0.1 && Math.random() < 0.2) {
            let clickX = random(device.width * 0.4, device.width * 0.6);
            let clickY = random(device.height * 0.3, device.height * 0.7);
            click(clickX, clickY);
            // console.log("模拟点击屏幕 (" + clickX + ", " + clickY + ")");
            sleep(random(1000, 3000)); // 点击后短暂停顿
            // return
        }
    } else {
        log_z("差账号:",wergh);
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
        log_z(" ****  🎉 向右滑动")
        startX = random(width * 0.1, width * 0.3);
        endX = random(width * 0.7, width * 0.9);
        storage.put("count", storage.get("count",0)+1)
        storage.put("num", storage.get("num")+1)
    } else {
        log_z("向左滑动 ---  ")
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

    log_z("滑动结束 🎉");
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
    data.name = nameNode ? nameNode.text() : "未知";

    // 获取位置
    var detailsNode = card.findOne(id("com.p1.mobile.putong:id/details"));
    data.details = detailsNode ? detailsNode.text() : "未知";

    // // 获取性别   默认是男的   自己是女号 刷到的就是男号
    // // var sexAgeNode = card.findOne(id("com.p1.mobile.putong:id/sex_age_content"));
    // var sex = card.findOne(id("com.p1.mobile.putong:id/sex"));
    // data.sex = sex ? sex.text() : "未知";

    
    //  他喜欢我
    var me_was_liked = card.findOne(id("com.p1.mobile.putong:id/me_was_liked"));
    data.me_was_liked = me_was_liked ? me_was_liked.text() : "未知";

    //  获取年龄
    var age = card.findOne(id("com.p1.mobile.putong:id/age"));
    data.age = age ? age.text() : "未知";

    // 是否是vip
    var vip_icon = card.findOne(id("com.p1.mobile.putong:id/vip_icon"));
    data.vip_icon = vip_icon ? "vip" : "未知";

    // 获取交友目的
    var purposeNode = card.findOne(id("com.p1.mobile.putong:id/tv_purpose"));
    data.purpose = purposeNode ? purposeNode.text() : "未知";

    // 动态标签 做了性格测试的
    var dynamic_tag =  card.findOne(id("com.p1.mobile.putong:id/dynamic_tag"))
    data.dynamic_tag = dynamic_tag ? dynamic_tag.text() : "未知";

    // 获取星座
    var zodiacNode = card.findOne(id("com.p1.mobile.putong:id/zodiac"));
    data.zodiac = zodiacNode ? zodiacNode.text() : "未知";

    //  实名认证   certification_normal 子控件  text   头像本人
    var certification_normal = card.findOne(id("com.p1.mobile.putong:id/certification_normal"));
    if (certification_normal) {
        var normal = certification_normal.findOne(id("com.p1.mobile.putong:id/text"))
        data.normal = normal ? normal.text() : "未知";
    }

    // com.p1.mobile.putong:id/superlike_recv   收到的超级喜欢
    
    //  探探id
    // let tantan_id_number = id("com.p1.mobile.putong:id/tantan_id_number").findOne(100)
    // data.tantan_id = tantan_id_number ? tantan_id_number.text() : "未知";

    // //  地址 活动时间  多少人喜欢他
    // let location_and_active = id("com.p1.mobile.putong:id/location_and_active").findOne(100)
    // data.active = location_and_active ? location_and_active.text() : "未知";
    

    // log(data)
    return data
}

 /** 获取资料卡信息
 * 
 * @returns   
 */
 function account_card() {
    // 使用前提是打开资料卡
    let account = {
        name:"",     // 姓名
        age:"",      // 年龄
        content:"无",  // 个人签名
        tag:"无",      // 标签  职业 学校 学历 交友目的  星座  地址 身高 常去的地方
        tantan_id:"未知" // 
    }

    let name = id("com.p1.mobile.putong:id/name").findOne(10)
    account.name = name ? name.text() : "无";

    let age = id("com.p1.mobile.putong:id/age").findOne(10)
    account.age = age ? age.text() : "无";

    let num = 0
    //  获取资料卡信息
    while (account.tantan_id == "未知"){
        // 获取用户名
        if (account.content == "无" ) {
            var content = Find_Control("com.p1.mobile.putong:id/content",id);
            account.content = content ? content.text() : "无";
        }

        // 获取标签
        if (account.tag == "无" ) {
            var tags = id("com.p1.mobile.putong:id/title").find()
            if (tags) {
                for (let i = 0; i < tags.length; i++) {
                    let tag = tags[i];
                    let ttext = tag.text()
                    if (ttext != "关于我" &&  ttext != "更了解他" &&  !["来自其他", "其他"].includes(ttext)  ) {
                        if (account.tag == "无") {
                            account.tag = ""
                        }
                        account.tag = account.tag + tag.text() + ", " 
                    }
                }
            }
        }else{
            // swipe( 540, device.height - 100 , 540, 200, 210); // 大拉 
            swipe( device.width/2 , device.height - 100 , device.width/2 , 200, 210); // 大拉 
        }

        //  探探id
        if (account.tantan_id == "未知" ) {
            var tantan_id = Find_Control("com.p1.mobile.putong:id/tantan_id_number",id);
            account.tantan_id = tantan_id ? tantan_id.text() : "未知";
        }

        num = num + 1
        
        // swipe( 489, 1396, 489, 650, 210); // 小拉 
        swipe( device.width/2, device.height * 0.8, device.width/2, device.height * 0.4, 210); // 小拉 

        sleep( 600);
        if (num == 10 ) {
            break
        }
    }
    return account
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

/** 获取当前是否有消息需要查看
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
                message =  textView.text()  // 这个是红点里面的数字
            }
        }
    });
    // log_z("未读信息 : ",message)
    return message
}

/** 返回当前界面的消息记录
 * 
 * @returns  消息数据
 * @returns  用户名
 */
function chat_history() {
    let messages = [];
    let N_name ="";
    let zname = Find_Control("com.p1.mobile.putong:id/title",id);
    if (zname) {
        N_name = zname.text();
    }

    let allItems = id("com.p1.mobile.putong:id/content_wrapper").find();
    if (allItems.empty()) {
        log_z("没有找到聊天消息！");
        return {massage_name:N_name, list : null};
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
            var msg = {
                sender: avatar ? "对方说" : "自己说",
                text: "非文本信息"
            };
        }

        if (textView.text().length <= 0 && textView.className() == "android.widget.LinearLayout") {
            // console.log("过滤掉");
            return 
        }
        //  && textView.visibleToUser() 加上数据就拿不全面了 
        if (textView.className() == "android.widget.TextView" ) {    // 是文本
            // console.log("信息记录为 ",textView.text())
            var msg = {
                sender: avatar ? "对方说" : "自己说",
                text: textView.text()
            };
        }
        messages.push(msg);
    })
    // log(messages)
    return {massage_name : N_name, list : messages};
}

/** 获取当前是那个业务界面
 * 
 * @returns 
 */
function getCurrentPage() {
    //  - 探探界面 
    // 滑动喜欢
    if (Find_Control("com.p1.mobile.putong:id/card",id)) {
        return "喜欢"
    }

    // - 娱乐界面
    // 是否选择了那个界面卡
    if (Find_Control("com.p1.mobile.putong:id/title_bar",id)) { // 在娱乐界面
        //  获取被选择的资料卡  
        return  get_tab_selete()
    }
    if (Find_Control("com.p1.mobile.putong:id/live_close",id)) { // 看直播界面
        //  获取被选择的资料卡  
        return  "看直播中"
    }

    // - 发现界面
    if (Find_Control("发动态")) {
        let w = className("TextView").boundsInside(0, 0, device.width/2, device.height/2).find();
        // 遍历所有找到的控件
        let dt = "";
        w.forEach((node) => {
            if (node != null && node.text() == "附近") { 
                let badgeText = node.text();
                if (badgeText) {
                    dt = "看动态";
                }
            }
        });
        if (dt) {
            return dt;
        }
    }

    //  判断是否是根界面
    if (Find_Control("com.p1.mobile.putong:id/bottombar",id)) {
        //  "探探" 界面
        if (Find_Control("tab_content",id)) {
            log_z("在 探探 界面 ")
            return "探探"
        }
        //  "消息" 界面
        if (Find_Control("com.p1.mobile.putong:id/menu_search_conv",id)) {
            log_z("在 消息 界面 ")
            return "消息"
        }
        //  "发现" 界面
        if (Find_Control("附近") && Find_Control("官宣")) {
            log_z("在 发现 界面 ");
            return "发现"
        }
        //  "我" 界面
        if (Find_Control("com.p1.mobile.putong:id/tab_right_icon",id)) {
            log_z("在 我 界面 ");
            return "我"
        }
        //  "娱乐" 界面
        if (Find_Control("com.p1.mobile.putong:id/title_bar",id)) {
            log_z("在 娱乐 界面 ")
            return "娱乐"
        }
    }

    //  聊天界面
    if (Find_Control("com.p1.mobile.putong:id/input_emoji",id)) {   // log(Find_Control("input_text",id))  表情按钮
        return "聊天界面"
    }

    // log_z("界面未知")
    console.log("界面未知")
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

    if (currentMood == "心情低落") {
        storage.put("no_start",true)
    }
    // 获取保存数据
    let d = storage.get(today);
    // 生成未来时间
    let wtime = addRandomMinutes(minTimeInFuture,maxTimeInFuture)
    storage.put(today,{Mood:currentMood,Favorites:d.Favorites,Likes:d.Likes,Time:wtime}) 

    d = storage.get(today);
    console.log(` 当前人物情绪描述 : ${d.Mood} 情绪持续时间 ${getTimeDifferenceInMinutes(d.Time)} 分钟`);
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

    //  长按连送
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
    let iv_close = Find_Control("com.p1.mobile.putong:id/iv_close",id)
    if (iv_close) {
        iv_close.click();
        return false
    }
    log_z("头像认证和直播弹窗")

    //  选择只看未读信息
    let message_sort_unread_text = Find_Control("com.p1.mobile.putong:id/message_sort_unread_text",id)
    if (message_sort_unread_text) {
        clickobj(message_sort_unread_text);
        return false
    }
    

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
    //  广告
    zs = Find_Control("放弃查看")
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

    //  闪聊广告
    if (Find_Control("com.p1.mobile.putong:id/have_a_chat",id)) {
        startX =height * 0.5;  
        startY = width / 2;
        
        endX =height * 0.1;  
        endY = width / 2; 
        
        return swipe(startX, startY, endX, endY, 500); // 500ms 表示滑动持续的时间，可以根据需要调整
    }

    // 开通svip广告 
    if (Find_Control("开通SVIP会员")) {
        let aerr_close =  Find_Control("com.p1.mobile.putong:id/close",id);
        if (aerr_close.click()) {
            return false
        }
    }
    //  充值1元 
    if (Find_Control("心动x6")) {
        let aerr_close =  Find_Control("com.p1.mobile.putong:id/empty",id);
        if (aerr_close.click()) {
            return false
        }
    }

    //  右划跳出了会员  无法继续喜欢了
    let node = id("com.p1.mobile.putong:id/description").findOne(500);
    if (node) {
        let text = node.text();
        if (text === "尽情右滑、突破右滑上限、不错过\u000A任何你喜欢的她") {
            let num = storage.get("count",0)
            log_z(`滑动要会员了 无法继续喜欢了 今日滑动次数 ${{ num }} `);
             //  获取内存数据
            let data = storage.get(today)
            // 生成新的
            storage.put(today,{Mood:data.Mood,Favorites:false, Likes:data.Likes, Time:data.Time})
            changeMood(data)
            //  关闭窗口
            back();
            // throw new Error(" 无法喜欢了 ")
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
    //  配对成功提示
    if (Find_Control("com.p1.mobile.putong:id/match_success_txt",id)) {
        Find_Control("com.p1.mobile.putong:id/one_emoji_text",id).click();
        return  false
    }

    //  资料详情界面
    if (Find_Control("com.p1.mobile.putong:id/button_container",id)) {
        // 子界面 -> 资料片详情    返回按钮是动态的 读取混乱
        back();
        return false
    }

    // 弹出窗口   广告
    if (Find_Control("以结婚为目的”的恋爱") && Find_Control("我要参加")) {
        //  划走
        swipe(300, 572, 32, 568, random(200, 400));
        return false 
    }

    // 弹出窗口   广告
    if ((Find_Control("上传照片") && Find_Control("上传展示生活的照片")) || (Find_Control("今日缘分") && Find_Control("快来查看你的")) || (Find_Control("找个聊天搭子") && Find_Control("向好友发射信号"))) {
        // 要是我上传照片的弹窗需要关闭
        let close = id("com.p1.mobile.putong:id/close").findOne(100);
        if (close) {
            clickobj(close)
            return false
        }
        return false
    }

    // 弹出窗口 新人广告
    if (Find_Control("恭喜获得限时礼包") && Find_Control("立即查看")) {
        let title_text= Find_Control("稍后再说")  // 取消掉青少年模式
        if (title_text) {
            clickobj(title_text) // 点击取消广告弹窗
        }
        return false
    }

      // 弹出窗口   广告
    if (Find_Control("com.p1.mobile.putong:id/ignore_btn",id)) {
        let title_text= Find_Control("稍后再说")  
        if (title_text) {
            clickobj(title_text);
        }
        return false
    }

    // 查看详情 开通礼物充值广告
    if (Find_Control("查看详情",id)) {
        let empty= Find_Control("com.p1.mobile.putong:id/empty",id)  
        if (empty) {
            clickobj(empty);  //  empty.click();
            return false
        }
    }

    // 弹出框 索要通知    
    // if (Find_Control("打开动态消息通知") && Find_Control("去开启")) {
    if ( Find_Control("去开启") ||  Find_Control("打开通知") ) {
        let no =  Find_Control("暂不设置");
        if (no) {
            clickobj(no)
        }
        let close = Find_Control("com.p1.mobile.putong:id/close",id)
        if (close) {
            close.click();
        }
        return false
    }

    // 取消掉青少年模式
    if (Find_Control("青少年模式") && Find_Control("开启青少年模式")) {
        let title_text= Find_Control("我知道了")
        if (title_text) {
            clickobj(title_text)  // 点击取消青少年弹窗
        }
        return false
    }

    log_z("广告 和 弹出框检查完成")
    // 消息界面处理
    if (Find_Control("闪聊广场")) {
        let back =  Find_Control("back_btn",id,10);
        if (back) {
            back.click();
        }
        return false
    }
    
    // // 误触了分享按钮
    // if (Find_Control("分享给好友")) {
    //     clickobj(Find_Control("取消"))
    //     return false
    // }
    return true
}

// 心情愉悦 - 喜欢   
function like(Page) {
    log_z(`心情愉悦  - ${Page}`);
    //  当前界面
    if (Page == "喜欢") {
        var cards = id("com.p1.mobile.putong:id/root").find();
        // 如果没有找到任何卡片，直接返回
        if (cards.length > 0) {
            return randomSwipe();  // 开始滑动
        }
    }else{back()}
}

// 心情一般 - 看直播
function preview(Page) {

    log_z(`心情一般  - ${Page}`);
    // 先到指定的界面
    if (Page == "推荐") {
        // com.p1.mobile.putong:id/right_text
        // click(800,486)
        click(514,276)
    }
    if (Page == "精选") {
        log_z(" 点击进入直播间")
        let zb = Find_Control("com.p1.mobile.putong:id/tv_center",id);
        if (zb){
            return clickobj(zb);
        }
    }
    if (Page == "视频聊天") {
        // let tj = Find_Control("推荐");
        // if (tj){
        //     console.log("推荐")
        //     return clickobj(tj);
        //     // return tj.click();
        // }
        let tj = Find_Control("精选");
        if (tj){
            console.log("精选")
            return clickobj(tj);
            // return tj.click();
        }
    }
    if (Page == "附近") {
        // click(800,486)
        click(514,276)
    }
    if (Page == "新人") {
        // click(800,486)
        click(514,276)
    }
    if (Page == "派对") {
        // com.p1.mobile.putong:id/right_text
        // click(800,486)
        click(514,276)
    }
    if (Page == "圈子") {
        log_z("点新人")
        let tj = Find_Control("新人");
        if (tj){
            return clickobj(tj);
        }
    }
    if (Find_Control("com.p1.mobile.putong:id/bottombar",id)) { // 在根界面
        log_z("在根节点 前往发现界面")
        // 点击发现
        let fx = Find_Control("娱乐");
        if (fx) {
            return clickobj(fx);
        }
    }
}

// 心情较差 - 看动态
function dynamic(Page) {
    log_z(`心情较差  - ${Page}`);
    if (Page == "看动态") {
        if (Math.random() > 0.5) {
            // 获取屏幕的宽度和高度
            let width = device.width;
            let height = device.height;
            let startX, endX, startY, endY
            
            // 设置向上滑动的起始点和结束点
            startX = width / 2;  
            startY = height * 0.7; // 从屏幕底部80%的地方开始
            
            endX = width / 2;    
            endY = height * 0.4;  // 滑动到屏幕顶部20%的地方
            
            let ranM = Math.random()
            //  几率点赞
            if (ranM > 0.1 && ranM < 0.2 ) {
                let data = storage.get(today)
                if (data.Likes > 0 ) {
                    // 先找到“打招呼”按钮
                    let sayHiButton = text("打招呼").findOne(1000);
                    if (sayHiButton) {
                        // 再找到父控件的父控件
                        let grandparentGroup = sayHiButton.parent().parent();
                        let textView357 = grandparentGroup.find(className("android.widget.TextView"));
                        for (let i = 0; i < textView357.length; i++) {
                            let item = textView357[i];
                            if ( item && item.visibleToUser()) {
                                console.log("点赞",item.text());
                                clickobj(item);
                                return
                            }
                        }
                    }
                }
            }

            swipe(startX, startY, endX, endY, 500); // 500ms 表示滑动持续的时间，可以根据需要调整
            
            sleep(random(3000, 5000));  // 思考时间

            // 向上滑动
            log_z("向上滑动");
        }else{
            let fx = text("刷新").findOne(50);
            if (fx) {
                log_z("点击刷新")
                return clickobj(fx)
            }
        }
    } else {
        //  首先是找到主界面
        if (Find_Control("com.p1.mobile.putong:id/bottombar",id)) { // 在根界面
            log_z("在根节点 前往发现界面")
            // 点击发现
            let fx = Find_Control("发现");
            if (fx) {
                return clickobj(fx);
            }
        }else{
            back();
        }
        
    }
}

//  工作
function works() {
    //  获取当前界面
    let Page = getCurrentPage()
    console.log("所在界面 :",Page)
    if (Page == "聊天界面") {
        log_z("在聊天界面 ")
        // 如果是未读的的情况下应该退出去联系其他的用户
        if (Find_Control("com.p1.mobile.putong:id/read_state_text",id)) {
            let left_icon_container = Find_Control("com.p1.mobile.putong:id/left_icon_container",id)
            if (left_icon_container) {
                left_icon_container.click();
                return back();
            }
        }
        
        // 是否有系统推荐的开场白
        // if (Find_Control("帮你准备了2句开场白，点击发送")) {
        //     //  选择一个开场白   系统推荐的开场白
        //     log_z("率先开团 ")
        //     return Find_Control("break_ice_message2_content",id).parent().click();
        // }
        
        // 如果在探探小助手聊天界面
        if (Find_Control("探探小助手")) {
            log_z(" 退出 小助手聊天信息!!! ")
            // return id("left_icon_container").findOne(100).click()
            return  back();
        }

        //  获取本地数据
        let accList = storage.get("accList",[]);
        // log(accList)
        // 在回信息界面 获取聊天内容
        let chat_data = chat_history()
        if (chat_data) {
            //  检查数据
            // let existing = accList.findIndex(profile => profile.name === chat_data.massage_name);
            // if (existing == -1) {
            //     // 点击头像
            //     let ge_name = Find_Control(`${chat_data.massage_name}`);
            //     if (ge_name) {
            //         console.log("点击头像");
            //         clickobj(ge_name);
            //         sleep(4000);
            //     }

            //     console.log(" 获取个人数据 ");
    
            //     // 开始获取个人资料
            //     let acc_data = account_card();
            //     console.log("获取完成")
                
            //     if (accList[existing].tantan_id !== acc_data.tantan_id) {
            //         // 如果 tantan_id 不一样，替换数据
            //         accList[existing] = acc_data;
            //         storage.put("accList",accList)
            //         // console.log("数据已更新:", accList);
            //     }
            //     if (acc_data.tantan_id != "未知") {
            //         back();
            //     }
            // }

            if (!accList.some(profile => profile.name === chat_data.massage_name)) {
                //  点击按钮
                let ge_name = Find_Control(`${chat_data.massage_name}`);
                if (ge_name) {
                    // console.log("点击头像");
                    clickobj(ge_name);
                    sleep(3000);
                }
                //  找的客户数据
                let accdata = account_card();
                if (accdata.tantan_id != "未知") {
                    back();
                }
                // storage.put("Selected", accdata.tantan_id);  // 当前选中的探探号码

                // 保存数据到本地
                accList.push(accdata);
                storage.put("accList", accList);  // 账号
            }

            storage.put("Selected", chat_data.massage_name);  // 当前选中的探探名字

            log_z("找到聊天记录了");
            // 获取对方的话
            let messages = sort_mess(chat_data.list);
            console.log("消息记录");
            // log(messages)
            if (messages.length > 0) {
                console.log("调用AI发送内容")
                let text = chats(messages);
                setText(text.chattext)
                Find_Control("发送").click()
            }
        }
        return 
    }

    //  如果是根界面 检查当前是否有信息要发
    if (Find_message() > 0 ) {
        if (Page == "消息") {
            //  处理消息框 只显示未读的 
            let message_header_text = Find_Control("com.p1.mobile.putong:id/message_header_text",id)
            if (message_header_text) {
                if ( message_header_text.text() != "消息 · 只看未读") {
                    //  点击三个杠 
                    return Find_Control("com.p1.mobile.putong:id/message_sort_image",id).click();
                }
            }

            // 先处理配对 显示你有一个新配对
            let match = Find_Control("com.p1.mobile.putong:id/match_txt",id)
            // console.log("处理新出现的新配对 ")
            if (match.text().includes("新配对")) {
                return clickobj(match);
            }
            // 选中一个聊天的对象  com.p1.mobile.putong:id/conversation_item_root
            let content = Find_Control("com.p1.mobile.putong:id/content",id)
            if (content) {
                console.log("这里选中一个倒霉蛋")
               return clickobj(content);
            }
        }else{
            //  前往信息界面 首先是找到主界面
            if (Find_Control("com.p1.mobile.putong:id/bottombar",id)) { // 在根界面
                log_z("在根节点 前往消息界面")
                // 点击发现
                let fx = Find_Control("消息");
                if (fx) {
                    return clickobj(fx);
                }
            }
            back();
            return
        }
    }

    let Data = storage.get(today);
    let Moodr = Data.Mood
    //  执行情绪行为
    if (compareTime(Data)) {
        console.log(` 当前界面 ${Page} 当前人物情绪描述 : ${Moodr} 情绪持续时间 ${getTimeDifferenceInMinutes(Data.Time)} 分钟`);
        //  生成新的人物情绪
        changeMood(Moodr)
    }else{
        // console.log("有事情做")
        if (Moodr == "心情愉悦") {   
            if (Data.Favorites) {
                like(Page);     // 喜欢
            }else{
                console.log("无法喜欢了")
                return changeMood(Moodr);
            }
        } else if (Moodr == "心情一般") {  
            // 正在进行作业 
            if (Page == "看直播中") {
                if (!compareTime(Data)) {
                    log_z("看直播中 等待12 - 15秒");
                    let rand = Math.random()
                    if (rand > 0.1 && rand < 0.2) {
                        // 获取屏幕的宽度和高度
                        let width = device.width;
                        let height = device.height;
                        let startX, endX, startY, endY
                        
                        // 设置向上滑动的起始点和结束点
                        startX = width / 2;  
                        startY = height * 0.7; // 从屏幕底部80%的地方开始
                        
                        endX = width / 2;    
                        endY = height * 0.2;  // 滑动到屏幕顶部20%的地方
                        
                        // 执行滑动操作：从 (startX, startY) 滑动到 (endX, endY)
                        swipe(startX, startY, endX, endY, 500); // 500ms 表示滑动持续的时间，可以根据需要调整
                        console.log(" 更换直播间 ")
                    }
                    return  sleep(random(12000,15000));
                }
            }
            preview(Page);     // 看直播中
        } else if (Moodr == "心情较差") {  
            dynamic(Page);     // 看动态
        }
    }
}

function main() {
    // 初始化先
    if (init()) {
        //  处理异常情况  弹窗广告
        if (wrong()) {
            console.log("无异常界面 开始工作")
            works();
        }
    }
}


// storage.remove("context")
// storage.remove("accList")
// let accList = storage.get("accList",[]);
// log(accList)
 

// setText("泥嚎")       //  在聊天窗口是可以直接输入的 快捷界面需要打开才能输入
// Find_Control("发送").click()


//  修改初始化当前情绪持续时间
// let wtime = addRandomMinutes(1,2)
// let data = storage.get(today)
// storage.put(today,{Mood:"心情愉悦",Favorites:false, Likes:data.Likes, Time:wtime})
// log(data)


// console.log("开始执行 ")
for (let i = 0; i < 100 ; i++) {
    main()
}

log("已经喜欢人数: ",storage.get("num", 0))


//  -------------------------------------测试代码-----------------------------------------


// log(Find_Control("心动x6").text())
// account_card()
 
