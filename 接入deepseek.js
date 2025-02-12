
let SERVER_URL = "192.168.1.139" + ":" + 8001

function postJson(url, jsonData, header, timeout) {
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

function getOcr(img, isSave, savePath) {
    try {
        
        // console.time("********&&& getOCR");  // 开始计时

        console.time("tobase64");  // 开始计时
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");
        console.timeEnd("tobase64");  // 输出执行时间

        // 构造请求的 JSON 数据，添加 lang 字段
        let jsonData = {
            "base64_str": imgData,
            "save": true,
            "path": "mir4/test"
        };
        
        // console.time("httppost");  // 开始计时
        let response = postJson(SERVER_URL + "/ocr/predict-by-base64", jsonData);
        //postJson(SERVER_URL + "/ocr/predict-by-base64", jsonData);
        // console.timeEnd("httppost");  // 输出执行时间
        if (response.statusCode == 200) {
            let result = JSON.parse(response.body.string());
            return result.data;
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("getOcr失败: ", e);
        sleep(10* 1000)  // 10秒
    } finally {
        // console.timeEnd("********&&& getOCR");  // 输出执行时间
    }
    
    return null;
}

function getimg(grayscale) {
    let img ;
    try {
        img = captureScreen();
        if (img == null) {
            return null
        }
        // 是否二级化 
        if (grayscale) {
            let grayscaleImage = images.grayscale(img);
            return grayscaleImage
        }
        return img
    } catch (error) {
        console.error("截图失败 ",error)
    }
    return null
}

function select(ocrResults, targetText, exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        print(`字符串 : ${item[1][0]}, 坐标 : ${item[0][0]}`)
        if (exactMatch) {
            if (item[1][0] === targetText) {
                return item;
            }
        }else{
            if (item[1][0].includes(targetText)) {
                return item;
            }
        }
    }
    return null;
}

function getImageMD5(clip_img) {
    // 截取图片左上角
    let bytes = images.toBytes(clip_img)
    let hexStrings = bytes.map(num => 
        (num < 0 ? -num : num)  // 手动实现绝对值
            .toString(16)       // 转换为十六进制
            .padStart(2, '0')   // 补零到 2 位
    ).join('');
    return $crypto.digest(hexStrings, "MD5");
}

function getScreenOCR() {
    print("-----------------")
    if (!requestScreenCapture()) {
        throw new Error("请求屏幕捕获权限失败");
        // log_z("请求屏幕捕获权限失败")
    }
    // 竖屏权限.横屏的参数是true
    // print("申请截图权限 : " , images.requestScreenCapture(false))
    // print("----------------- ######")

    // 名字截图的坐标和尺寸
    let c = [40, 30, 50, 10]

    let img = getimg(false); 
    print(img.getWidth(), img.getHeight())
    // let croppedImage = images.clip(img, c[0], c[1], c[2], c[3])
    let reData = getOcr(img);
    select(reData, "aasfadsd")
    // let start = Date.now();
    // print(getImageMD5(croppedImage))
    // print(Date.now() - start)
}

function getScreenOrientation() {
    const orientation = context.getResources().getConfiguration().orientation;
    if (orientation === android.content.res.Configuration.ORIENTATION_LANDSCAPE) {
        return "横屏";
    } else if (orientation === android.content.res.Configuration.ORIENTATION_PORTRAIT) {
        return "竖屏";
    } else {
        return "未知";
    }
}
// print(getScreenOrientation())

// getScreenOCR();
// let storage = storages.create("ABC");
// print(storage)
// print(storage.get("Bm",0))
// let cache = storage.get("OCR_CACHE", {});
// print(cache)

// app.launch('com.wemade.mir4global')
// for (let index = 0; index < 100; index++) {
//     print(getScreenOrientation())
//     sleep(128)
// }

// 保持脚本运行
// setInterval(() => {
//     console.log("脚本运行中...");
// }, 1000);

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

        if (target_id != null) {
            // 将聊天上下文保存到服务器
            send_context_toserver(target_id, chat_context)
        }
        
        return result_json;
    }
    return null;
}

function chat1() {
    let tta = []
    let jsonData = {
        "log": true,
        "deviceid": "device_id_123",
        "name": "小雅",
        "attitude": "女汉子",
        "age": 22,
        "reason": "我平时在抖音发一些自拍视频.会吸引很多人关注我,并和我聊天",
        "im": "在校的女大学生",
        "job": "兼职做才艺女主播",
        "region": "北京",
        "hobby": "唱歌，跳舞，打羽毛球，游泳",
        "lead": "邀请对方来观看我的直播",
        "target_id": "888888",
        "target_name": "",
        "target_region": "",
        "target_say": tta,
    };
    let response = postJson("192.168.1.163:8002" + "/api/deepseek_r1_newchat", jsonData);
    print(response)
}

function chat2() {
    let tta = ["对啊，你不觉得吗"]
    let jsonData = {
        "log": true,
        "deviceid": "device_id_123",
        "target_id": "888888",
        "target_say": tta,
        "target_above": "对方说"
    };
    let response = postJson("192.168.1.163:8002" + "/api/deepseek_r1_chat", jsonData);
    let result = JSON.parse(response.body.string());
    print(result.data)
}

function init() {
    let name = "小雅"
    let age = 22
    let im = "在校的女大学生"
    let hobby = "唱歌，跳舞，打羽毛球，游泳，追剧"
    let region = "北京"
    let job = "唱跳女主播"
    let reason = "社交软件上有一个人正在和我聊天."
    let profile = "对方个人资料如下 : 性别:男, 年龄:32岁, 地区:北京. 网名:风清扬, 签名:感动有毒."
    let lead = "对方来观看我的直播."
    let attitude = "女汉子"

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
    6. 我兼职做${job}
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
    如果你看懂了就回复"明白需求并保证要求."那么接下来让我们一起开始分析这个人吧
    `
    return str
}

let storage = storages.create("ABC");
// storage.remove("context")

// let chat_context = storage.get("context")
// send_context_toserver("target_888", chat_context['target_888'])
            // 记录 没有就是{}   标识       谁说的     内容                    初始化
let result = chat(storage, "target_888", "对方说", ["你好啊小野猫", "老子要草你"], init);
print(result)
// 遍历所有 TextView 类型的控件
// let allTextViews = className("TextView").find();
// log("找到 " + allTextViews.size() + " 个 TextView 控件");
// allTextViews.forEach(function (view) {
//     log("控件文本: " + view.text());
//     log("控件描述: " + view.desc());
// });

// // 遍历所有带指定文字的控件
// let specificTextViews = textContains("主页").find();
// specificTextViews.forEach(function (view) {
//     log("匹配控件: " + view.text());
//     log("控件描述: " + view.desc());
// });


// 查找并点击带有文字“确定”的按钮
// let button = text("管理").findOne(); // 找到第一个匹配的控件
// if (button) {
//     let rect = button.bounds(); // 获取控件区域
//     let sdv = click(rect.centerX(), rect.centerY()); // 点击控件中心
//     log("成功点击控件中心", sdv);
// } else {
//     log("未找到目标控件");
// }


// var intent = new Intent();
//intent.setAction("android.net.vpn.SETTINGS"); // 添加 VPN 网络
//intent.setAction("android.settings.ACCESSIBILITY_SETTINGS"); // 无障碍
//intent.setAction("android.settings.ADD_ACCOUNT_SETTINGS"); // 添加账户
//intent.setAction("android.settings.AIRPLANE_MODE_SETTINGS"); // 移动网络
//intent.setAction("android.settings.APN_SETTINGS"); //APN 设置
//intent.setAction("android.settings.APPLICATION_SETTINGS"); // 应用管理
//intent.setAction("android.settings.BATTERY_SAVER_SETTINGS"); // 节电助手
// intent.setAction("android.settings.BLUETOOTH_SETTINGS"); // 蓝牙
//intent.setAction("android.settings.CAPTIONING_SETTINGS"); // 字幕
//intent.setAction("android.settings.CAST_SETTINGS"); // 无线显示
//intent.setAction("android.settings.DATA_ROAMING_SETTINGS"); // 移动网络
//intent.setAction("android.settings.DATE_SETTINGS"); // 日期和时间设置
// intent.setAction("android.settings.DEVICE_INFO_SETTINGS"); // 关于手机
//intent.setAction("android.settings.DISPLAY_SETTINGS"); // 显示设置
//intent.setAction("android.settings.DREAM_SETTINGS"); // 互动屏保设置
//intent.setAction("android.settings.HARD_KEYBOARD_SETTINGS"); // 实体键盘
//intent.setAction("android.settings.HOME_SETTINGS"); // 应用权限, 默认应用设置, 特殊权限
//intent.setAction("android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS"); // 忽略电池优化设置
// intent.setAction("android.settings.INPUT_METHOD_SETTINGS"); // 可用虚拟键盘设置
// intent.setAction("android.settings.INPUT_METHOD_SUBTYPE_SETTINGS"); // 安卓键盘语言设置 (AOSP)
//intent.setAction("android.settings.INTERNAL_STORAGE_SETTINGS"); // 内存和存储
//intent.setAction("android.settings.LOCALE_SETTINGS"); // 语言偏好设置
//intent.setAction("android.settings.LOCATION_SOURCE_SETTINGS"); // 定位服务设置
//intent.setAction("android.settings.MANAGE_ALL_APPLICATIONS_SETTINGS"); // 所有应用
// intent.setAction("android.settings.MANAGE_APPLICATIONS_SETTINGS"); // 应用管理
//intent.setAction("android.settings.MANAGE_DEFAULT_APPS_SETTINGS"); // 与 ACTION_HOME_SETTINGS 相同
//intent.setAction("android.settings.action.MANAGE_OVERLAY_PERMISSION"); // 在其他应用上层显示, 悬浮窗
// intent.setAction("android.settings.MANAGE_UNKNOWN_APP_SOURCES"); // 安装未知应用 安卓 8.0
//intent.setAction("android.settings.action.MANAGE_WRITE_SETTINGS"); // 可修改系统设置 权限
//intent.setAction("android.settings.MEMORY_CARD_SETTINGS"); // 内存与存储
//intent.setAction("android.settings.NETWORK_OPERATOR_SETTINGS"); // 可用网络选择
//intent.setAction("android.settings.NFCSHARING_SETTINGS"); //NFC 设置
//intent.setAction("android.settings.NFC_SETTINGS"); // 网络中的 更多设置
//intent.setAction("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"); // 通知权限设置
//intent.setAction("android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS"); // 勿扰权限设置
//intent.setAction("android.settings.ACTION_PRINT_SETTINGS"); // 打印服务设置
//intent.setAction("android.settings.PRIVACY_SETTINGS"); // 备份和重置
//intent.setAction("android.settings.SECURITY_SETTINGS"); // 安全设置
//intent.setAction("android.settings.SHOW_REGULATORY_INFO"); // 监管信息
//intent.setAction("android.settings.SOUND_SETTINGS"); // 声音设置
//intent.setAction("android.settings.SYNC_SETTINGS"); // 添加账户设置
//intent.setAction("android.settings.USAGE_ACCESS_SETTINGS"); // 有权查看使用情况的应用
//intent.setAction("android.settings.USER_DICTIONARY_SETTINGS"); // 个人词典
//intent.setAction("android.settings.VOICE_INPUT_SETTINGS"); // 辅助应用和语音输入
//intent.setAction("android.settings.VPN_SETTINGS"); //VPN 设置
//intent.setAction("android.settings.VR_LISTENER_SETTINGS"); //VR 助手
//intent.setAction("android.settings.WEBVIEW_SETTINGS"); // 选择 webview
//intent.setAction("android.settings.WIFI_IP_SETTINGS"); // 高级 WLAN 设置
// intent.setAction("android.settings.WIFI_SETTINGS"); // 选择 WIFI, 连接 WIFI
//intent.setAction("com.android.settings.Settings$DevelopmentSettingsActivity");
// app.startActivity(intent);
