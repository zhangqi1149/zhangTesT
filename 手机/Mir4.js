// 设置服务器地址
var SERVER_URL = "http://192.168.5.112:5000";

var Shout = "加我QQ 有好东西"

var  Save = false  // true   false 

var width_screenshot = 1285
var height_screenshot = 720

var  storage = storages.create("ABC");

// OCR请求
function getOcr(img, lang) {
    try {
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        // let jsonData = JSON.stringify({
        //     image: imgData,
        //     lang: lang  ,// 动态设置语言
        //     save: Save // true   false 
        // });

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
        console.error("请求失败: ", e);
    }
    return null;
}

// 请求颜色
function getCl(img, x1,y1) {
    try {
        // 将截图转换为Base64编码的PNG格式
        let imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        // let jsonData = JSON.stringify({
        //     image: imgData,
        //     x: x1  , 
        //     y: y1  
        // });

        let jsonData = {
            image: imgData,
            x: x1, 
            y: y1  
        };
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = http.postJson(SERVER_URL+"/color", jsonData, {
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
        let imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        // let jsonData = JSON.stringify({
        //     image: imgData,
        //     save: Save // true   false 
        // });
        
        let jsonData = {
            image: imgData,
            save: Save // true   false 
        };

        // 发送 POST 请求，确保 Content-Type 为 application/json
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
        toast("请求失败: ",e)
        console.error("请求失败: ", e);
    }
    return null;
}

function wait(str, time) {
    let startTime = Date.now();  // 获取当前时间（毫秒）
    
    while (Date.now() - startTime < time) {
        // 尝试找到指定的内容
        let img = captureScreen();
        let reData = getOcr(img,"ch");
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

// 查看控件
function npackageName() {
    // 查找屏幕上的所有控件
    var nodes = className("android.widget.FrameLayout").find();
    // 遍历找到满足条件的控件
    for (var i = 0; i < nodes.size(); i++) {
        var node = nodes.get(i);
        if (node.packageName() === "com.wemade.mir4global") {
            // console.log("找到匹配的控件，包名: " + node.packageName());
            // 可以在这里对控件进行其他操作
            // toast("找到匹配的控件，包名" + node.packageName())
            // break; // 如果只需要找到一个，找到后可以跳出循环
            return true
        }
    }
    return false
}

// 初始化
function init(){
    // 权限检查
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
        return false
    }
    // let currentPkg = currentPackage();
    // 是否在游戏
    // if (currentPkg == "com.wemade.mir4global" || currentPkg =="android" || currentPkg =="com.android.xwkeyboard"){
    //     return true
    // } else {
    //     toast("目前不在游戏")
    //     console.log("当前界面: ",currentPkg);
    //     app.launch('com.wemade.mir4global')
    //     sleep(1000);
    //     app.launch('com.wemade.mir4global')
    //     sleep(3000);
    // }
    if (npackageName()) {
        return true
    }else{
        app.launch('com.wemade.mir4global')
        sleep(3000);
    }
    return false
    // let grayscaleImage = images.grayscale(img);  // 灰度处理
    // let binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");     // 二级化
}

// 生成随机英文名  名字要求6-12 
function getRandomName() {
    // 随机生成 2 到 5 之间的长度
    let length = random(2, 5);
    
    // 定义字符集，可以根据需要修改
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let name = "";

    // 循环生成随机字符组成名字
    for (let i = 0; i < length; i++) {
        var randomIndex = random(0, characters.length - 1);
        name += characters.charAt(randomIndex);
    }
    
    // 加上前缀
    let prefix = "MMOEXP ";
    let fullName = prefix + name;
    
    return fullName;
}

// 查找内容  支持模糊查询  默认 模糊查找内容
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

//  点击文本中间  num 偏移量
function textClick(target,num,num2){
    // 计算文本区域的中心点
    let centerX = (target.box[0][0] + target.box[2][0]) / 2;
    let centerY = (target.box[0][1] + target.box[2][1]) / 2;

    // 将坐标从截图转换到设备屏幕坐标
    let x_phone = (centerX / width_screenshot) * device.height;
    let y_phone = (centerY / height_screenshot) * device.width;

    console.log(`点击坐标: x=${x_phone}, y=${y_phone}`);

    // 点击坐标
    click(x_phone+num,y_phone+num2);
    // click(x_phone+920,y_phone); // 广告的关闭按钮
}

// 查找文本并点击
function selclick(reData,src,num){
    let target = select(reData, src,num)
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

// 公共裁剪函数
function cropImage(img, box) {
    // var grayscaleImage = images.grayscale(croppedImage);  // 灰度处理
    // var binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");     // 二级化
    let x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    let x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    let y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    let y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    return images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);
}

// 区域裁剪 没有在用
function clip(img, box) {
    try {
        let croppedImage = cropImage(img, box);
        // 进行 OCR 处理
        let ocrResults = getOcr(croppedImage, "ch");
        if (ocrResults && Array.isArray(ocrResults) && ocrResults.length > 0 && ocrResults[0].hasOwnProperty('text')) {
            // 确保 ocrResults[0] 存在并且包含 'text' 属性
            if (ocrResults[0].hasOwnProperty('text')) {
                console.log(`裁剪图像中的文本: ${ocrResults[0].text}`);
                return true;
            } else {
                console.error("OCR 结果缺少 'text' 属性");
            }
        } else {
            console.error("OCR 结果为空或格式错误");
        }
    } catch (e) {
        console.error("裁剪 OCR 处理失败: ", e);
    }
    return false;
}

// 区域裁剪
function clip2(img, box) {
    // 获取裁剪区域的坐标
    let x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    let x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    let y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    let y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    let croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    return croppedImage
}

//  错误处理
function wrong(reData){
    let OUT = select(reData,"服务器连接断开")
    if (OUT){
        reai = selclick(reData, '前往登录')
        if (reai) {
            console.log("点击界面进入游戏")
            sleep(5000);
            return true
        }
    }
    OUT = select(reData,"网络套")  // 要给整个应用杀掉
    if (OUT){
        reai = selclick(reData, '重新尝试',1)
        if (reai) {
            console.log("点击重新尝试")
            sleep(5000);
            return true
        }
    }

    OUT = select(reData,"重新尝试")
    if (OUT){
        reai = selclick(reData, '重新尝试')
        if (reai) {
            console.log("点击重新尝试")
            sleep(5000);
            return true
        }
    }

    //  todo
    OUT = select(reData,"关闭节电模式")
    if (OUT){
        swipe(468, 491, 1000, 0, 500);
        sleep(5000);
        return true
    }
    OUT = select(reData,"节电模式中")
    if (OUT){
        click(644, 614);
        sleep(5000);
        return true
    }
    
    OUT = selclick(reData,"据点复活")
    if (OUT){
        sleep(5000);
        return true
    }

    OUT = select(reData,"说明")
    if (OUT){
        reai = selclick(reData, '确认')
        if (reai) {
            sleep(5000);
            return true
        }
        reai = selclick(reData, '结束')
        if (reai) {
            sleep(2000);
            return true
        }
    }

    OUT = select(reData,"警告")
    if (OUT){
        reai = selclick(reData, '确认')
        if (reai) {
            sleep(5000);
            return true
        }
    }

    OUT = select(reData,"错误")
    if (OUT){
        reai = selclick(reData, '确认',1)
        if (reai) {
            console.log("点击确认")
            sleep(5000);
            return true
        }
        reai = selclick(reData, '游戏结束',1)
        if (reai) {
            console.log("游戏结束")
            sleep(5000);
            return true
        }
    }

    //  关闭广告
    reai = select(reData, '今日不')
    if (reai) {
        selclick(reData, '今日不')
        console.log("点击关闭广告")
        textClick(reai,920,0)
        sleep(3000);
        return true
    }

    var Load = select(reData,"Loading")
    if (Load){
        // toast(" Load 界面 等待5秒")
        sleep(5000);
        return true
    }

    return false
}

// 小青龙浩龙
function Loong(reData){
    var long = select(reData,"小青龙浩")
    if (long) {
        long = select(reData, '同伴就在附近')
        if (long) {
            long = selclick(reData, '前往京一')
            if (long) {
                sleep(2000);
                return true
            }
        } 
        long = select(reData, '点击头顶的标记')
        if (long) {
            long = selclick(reData, '与京一')
            if (long) {
                sleep(30);
                click(223 , 560) ;
                sleep(30);
                click(223 , 560) ;
                sleep(30);
                click(223 , 560) ;
                sleep(1000);
                return true
            }
        } 

        Load = select(reData, '利用活力')
        if (Load) {
            click(223 , 560) ;
            sleep(1200);
            return true
        }

        //  -------- 轻功
        long = select(reData,"看到轻功按键了吗")  // 1段跳跃
        if (long){
            click(1221,400)
            return true 
        }
        long = select(reData,"触发2段跳跃")  // 1段跳跃
        if (long){
            click(1221,400);
            return true 
        }
        long = select(reData,"还要再跳一次")  // 跳跃2次
        if (long){
            click(1221,400);
            sleep(2000);
            click(1221,400);
            sleep(1000);
            return true
        }
        long = select(reData,"对墙壁点击")
        if (long){
            click(1221,400);
            sleep(2000);
            return true 
        }
        long = select(reData,"瞬间快速地")
        if (long){
            click(1060,531);
            click(1204,400);
            sleep(3000);
            return true
        }

        long = select(reData,"带回千年")
        if (long){
            long = selclick(reData,"跳过")
            sleep(3000);
            return true
        }

        //  ----- 滑动
        long = select(reData,"请拖拽虚拟摇杆进行移动")
        if (long){
            reai = select(reData, '前往狭窄的')
            if (reai) {
                //  滑动
                swipe(232, 455, 0, 455, 7000);    
                sleep(1000)
                return true
            }
        }
        long = select(reData,"紧贴墙壁")
        if (long){
            reai = select(reData, '前往狭窄的')
            if (reai) {
                //  滑动
                swipe(232, 455, 0, 455, 7000);    
                sleep(2000)
                return true
            }
        }
        long = select(reData,"发现了个好")
        if (long){
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }

        // ----   操作类的
        //  设置药剂 和 技能频率
        long = select(reData,"尝试上下")
        if (long){
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }

        long = select(reData,"各种自动")
        if (long){
            click(668,659);
            sleep(3000);

            click(1195,595);  // 技能释放频率
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

        long = select(reData,"使用频率")
        if (long){
            sleep(4000);
            click(1195,595);  // 技能释放频率
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
        long = selclick(reData,"需要新的武器")
        if (long){
            sleep(2000);
            return true
        }
        long = selclick(reData,"在这里选择想要")
        if (long){
            sleep(2000);
            return true
        }
        long = select(reData,"请选择要制")
        if (long){
            click(575,300);
            sleep(800);
            return true
        }
        long = select(reData,"装备制造")
        if (long) {
            long = select(reData,"确认需要的材料")
            if (long){
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
        }

        //  精灵
        long = selclick(reData,"最佳帅气帮手")
        if (long){
            sleep(3000);
            return true
        }
        long = selclick(reData,"才能召唤精")
        if (long){
            sleep(1000);
            return true
        }
        long = select(reData,"快来召唤我")
        if (long){
            click(1149,674);
            sleep(500);
            click(1149,674);
            sleep(1000);
            return true
        }
        long = selclick(reData,"不同的技能")
        if (long){
            sleep(1000);
            return true
        }
        long = select(reData,"未出战的")
        if (long){
            click(1149,674);
            sleep(500);
            click(1149,674);
            sleep(1000);
            return true
        }
        long = selclick(reData,"一直跟随")
        if (long){
            click(820,110);
            sleep(1000);
            return true
        }
        
        long = selclick(reData,"展示精灵")
        if (long){
            sleep(1000);
            click(1230,29);
            sleep(1000);
            return true
        }

        long = select(reData, '追踪痕迹') 
        if (long) {
            long = select(reData, '技能强化') 
            if (long) {
                selclick(reData,"跳过")
                sleep(1000);
                return true    
            }
        }

        long = select(reData, '一下委托') 
        if (long) {
            selclick(reData,"跳过")
            sleep(1000);
            return true    
        }

        // 技能强化
        long = select(reData,"学习有关")
        if (long){
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }
        long = select(reData,"可以比他强")
        if (long){
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }

        // 魔石
        long = selclick(reData,"如何使用魔")
        if (long){
            sleep(3000);
            return true
        }
        long = select(reData,"为你准备的")
        if (long){
            click(814,183);  //点击石头
            sleep(1000);
            return true
        }
        long = selclick(reData,"魔石也有")
        if (long){
            sleep(1000);
            return true
        }
        long = select(reData,"选择魔石栏")
        if (long){
            click(1150,666);  // 装备
            sleep(1000);
            return true
        }
        long = select(reData,"点击这里的装备")
        if (long){ 
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }
        long = select(reData,"成功镶嵌")
        if (long){
            selclick(reData,"跳过")
            sleep(2000);
            click(1230,29);
            sleep(2000);
            return true
        }

        // 内功
        long = select(reData,"如何修炼")
        if (long){
            selclick(reData,"跳过")
            sleep(3000);
            return true
        }

        //  强化体质
        long = select(reData,"有强化体质")
        if (long) {
            long = selclick(reData,"跳过")
            if (long){
                sleep(3000);
                return true
            }
        }

        // 委托任务
        long = select(reData,"做好事就一定会有好报")
        if (long) {
            long = selclick(reData,"跳过")
            if (long){
                sleep(3000);
                return true
            }
        }
        long = select(reData,"与任务不同")
        if (long) {
            long = selclick(reData,"跳过")
            if (long){
                sleep(3000);
                return true
            }
        }

        // 
        long = select(reData,"设置药水")
        if (long){ 
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }

        //  坐骑
        long = selclick(reData,"有关坐骑的")
        if (long){ 
            sleep(1000);
            return true
        }
        long = select(reData,"各种各样的坐骑")
        if (long){ 
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }
        long = selclick(reData,"每个坐骑都有")
        if (long){ 
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }
        
        //  服饰 
        long = select(reData,"心仪的服饰")
        if (long){ 
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }
        long = select(reData,"最近流行什么")
        if (long){ 
            selclick(reData,"跳过")
            sleep(1000);
            return true
        }


    }
    return false
}

//  制造 强化 合成 魔石  坐骑
function Console(reData) { 
    var long = select(reData, '请点击全部菜单按键')
    if (long) {
        long = select(reData,"7.强化体质")
        if (long) {
            selclick(reData,"跳过")
        }else{
            click(1228,28);
        }
        sleep(2000);
        return true
    } 
    long = select(reData, '请点击菜单按键')
    if (long) {
        var item = long.box[0][0]
        var item2 = long.box[1][1]
        console.log(`请点击菜单按键: ${item}`)
        // [816.0, 269.0], [943.0, 267.0], [944.0, 291.0], [817.0, 293.0] 制造菜单提示位置
        if (item == 816.0) {
            click(1028,216);  // 制造工坊
            sleep(2000);
            return true
        }
        // [[900.0, 155.0], [1049.0, 149.0], [1050.0, 177.0], [902.0, 183.0]] 精灵菜单提示位置
        if (item == 900.0) {
            click(1120,105);  // 精灵
            sleep(2000);
            return true
        }

        // [[727.0, 156.0], [854.0, 156.0], [854.0, 179.0], [727.0, 179.0]]  角色菜单提示位置
        // [[728.0, 156.0], [855.0, 156.0], [855.0, 179.0], [728.0, 179.0]]
        // [[730.0, 159.0], [853.0, 159.0], [853.0, 177.0], [730.0, 177.0]]
        if ( (item > 727.0 && item < 731.0 )|| item2 == 156.0) {
            click(945,109);  // 角色
            sleep(2000);
            click(939,222);  // 铁匠
            return true 
        }

        // [[725.0, 381.0], [855.0, 380.0], [855.0, 404.0], [726.0, 405.0]]  //任务提示按键
        if (item2 > 380.0) {
            selclick(reData, '跳过')
            return
        }

        long = selclick(reData, '跳过')
        if (long) {
            console.log("$$$$$$$$$$$$ 请点击菜单按键 跳过")
            sleep(3000)
        }
        return
    }
    long = select(reData, '请点击按键')
    if (long) {
        var item = long.box[0][0]
        var item2 = long.box[1][1]
        console.log(`请点击按键: ${item}`)
        // [[754.0, 349.0], [843.0, 349.0], [843.0, 368.0], [754.0, 368.0]] 制造按钮提示位置
        if (item == 754.0 || item == 752.0 ) {
            click(935,310);  // 制造
            sleep(1000);
            return true
        }

        // [[205.0, 70.0], [300.0, 70.0], [300.0, 93.0], [205.0, 93.0]] 坐骑
        long = select(reData, '可佩戴')
        if ((item > 203.0 && item < 207.0) && long) {
            sleep(1000);
            click(444,30); // 坐骑
            sleep(2000);
            return true
        }
        
        // [[213.0, 422.0], [306.0, 421.0], [307.0, 441.0], [213.0, 442.0]] 装备的高级选项提示位置
        // [[167.0, 420.0], [262.0, 420.0], [262.0, 442.0], [167.0, 442.0]]
        // if (item == 213.0 ||item == 167.0) {
        if (item <= 213.0 && item >= 167.0) {
            click(71,367); // 高级
            sleep(1000);
            return true
        }
        // [[750.0, 234.0], [845.0, 234.0], [845.0, 257.0], [750.0, 257.0]]  精灵提示位置
        // [[751.0, 236.0], [846.0, 236.0], [846.0, 258.0], [751.0, 258.0]]  精灵提示位置 
        if (item == 750.0 || item == 751.0) {
            click(940,200); // 精灵
            sleep(1000);
            return true
        }

        // [[843.0, 236.0], [938.0, 236.0], [938.0, 258.0], [843.0, 258.0]] 辅助装备提示位置
        // [[842.0, 234.0], [937.0, 234.0], [937.0, 257.0], [842.0, 257.0]
        // if (item == 843.0 || item == 842.0 || item == 845.0) {
        if (item >= 842.0 && item <= 845.0) {
            click(1025,195); // 辅助装备
            sleep(2000);
            return true
        }

        // 936  服饰提示位置
        // [[937.0, 236.0], [1031.0, 236.0], [1031.0, 258.0], [937.0, 258.0]]
        if ((item > 935.0 && item <= 938.0) && item2 < 240.0) {
            click(1123,200); // 辅助装备
            sleep(2000);
            return true
        }

        // [[936.0, 348.0], [1029.0, 348.0], [1029.0, 371.0], [936.0, 371.0]] 解除封印

        // // 未匹配的全跳过
        long = selclick(reData, '跳过')
        if (long) {
            console.log("############## 请点击按键 跳过")
            sleep(4000)
        }
        return true
    }

    long = select(reData, '传承装备')
    if (long) {
        long = select(reData, '请点击。')
        if (long) {
            var item = long.box[0][0]
            console.log(`请点击.: ${item}`)
            // [[754.0, 349.0], [843.0, 349.0], [843.0, 368.0], [754.0, 368.0]] 制造按钮提示位置
            if (item == 754.0 || item == 396.0 ) {
                click(290,200);  // 制造
                sleep(1000);
                return true
            }
            return true
        }
    }

    long = select(reData, '推荐佩戴')
    if (long) {
        click(723,600); //  穿戴
        sleep(1000)
        return true
    }

    long = selclick(reData, '点击画面') 
    if (long) {
        sleep(2000);
        return true
    }
    long = select(reData, '完成',true) 
    if (long) {
        if (long.box[0][0]< 1037) {
            click(1020,227);
            sleep(2000);
            return true
        }
    }
    
    long = select(reData, '来挑选一下') 
    if (long) {
        //  选武器  
        click(809,200);
        sleep(2000);
        return true
    }

    long = select(reData,"中型生命值")
    if (long) {
       if (long.box[0][0] > 700) {
            long = selclick(reData,"中型生命值")
            if (long) {
                // 点击 输入框
                sleep(2000);

                // 点击 + 号  702,395   +100 778,393
                click(778,393);
                sleep(1000);
                click(778,393);
                sleep(1000);
                click(778,393);
                sleep(1000);
                click(778,393);
                sleep(1000);
                click(778,393);
                sleep(1000);
                //  多买一点药
                sleep(1000);
                click(778,393);
                sleep(1000);
                click(778,393);
                sleep(1000);
                click(778,393);
                sleep(1000);
                
                //  购买键
                click(800,495);
                sleep(2000);
            }

            long = selclick(reData,"中型魔力恢复")
            if (long) {
                sleep(2000);
                // 点击 输入框
                click(853,390);
                sleep(4000);

                //  上限
                click(775,489);
                sleep(1000);
                //  输入完毕
                click(775,633);
                sleep(2000);
                //  购买键
                click(800,495);
                sleep(2000);
            }
            click(1219,94); //  X
            sleep(2000);
            return true
       }
    }

    // // 做装备
    // long = select(reData,"可制造")
    // if (long) {
    //     // 重新获取图
    //     var img = captureScreen();
    //     var white = images.pixel(img, 47, 688);   // -2236963 白色  可制造勾选

    //     var arms = images.pixel(img, 258, 74);   // -2236963 橙色色  武器
    //     var tops = images.pixel(img, 507, 74);   // -2236963 橙色色  衣服
    //     var glove = images.pixel(img, 756, 74);  // -2236963 橙色色  手套
    //     if (arms == -1935584 || tops  == -1935584 || glove == -1935584 ) {
    //         var reData = getOcr(img,"ch");
    //     }
    //     imgRecycle(img)

    //     if (reData) {
    //         long = select(reData,"可交易道具使用警告")
    //         if (long) {
    //             //  点击不再提示 
    //             selclick(reData,"不在提示")
    //             sleep(1000);
    //             selclick(reData,"确认")
    //             sleep(1000);
    //         }

    //         // 点击勾选可制造
    //         if (white != -2236963) {
    //             click(101,683);
    //             sleep(1000);
    //         }
    //         if (arms == -1935584) {
    //             click(258, 74);
    //             sleep(1000);
    //         }
    //         if (tops == -1935584) {
    //             click(507, 74);
    //             sleep(1000);
    //         }
    //         if (glove == -1935584) {
    //             click(756, 74);
    //             sleep(1000);
    //         }

    //         for (let i = 0; i < 10; i++) {
    //             // 点击第一个装备
    //             click(245,183);
    //             sleep(1000);
    //             click(671,469); // 强化装备点确认
    //             sleep(1000);
    //             click(1126,674); // 点击制造
    //             sleep(1000);
    //         }


    //     }

    // }




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

// 关闭窗口
function closeX(reData){
    var reai = select(reData, '伪像切换')
    if (reai) {
        // toast("伪像切换")
        click(1230,29);
        sleep(2000);
        return true
    }
    reai = select(reData, '大地图')
    if (reai) {
        click(1230,29);
        sleep(2000);
        return true
    }

    reai = select(reData, '奇缘')
    if (reai) {
        click(1230,29);
        sleep(2000);
        return true
    }

    reai = select(reData, '闭关修炼')
    if (reai) {
        // toast("闭关修炼")
        click(1230,29)
        sleep(2000);
        return true
    }

    reai = select(reData, '可佩戴')
    if (reai) {
        // if (Mount ==  -1935583) {
        //     //  需要购买坐骑
        // }
        click(948,200); // 选中
        sleep(2000);
        click(1150,675); // 购买
        sleep(2000);
        click(1150,675); // 乘骑设置
        sleep(2000);

        click(1230,29);
        sleep(2000);
        return true
    }
    
    reai = select(reData, '龙神器')
    if (reai) {
        click(1230,29);
        sleep(2000);
        return true
    }

    reai = select(reData, '远征队')
    if (reai) {
        click(1230,29);
        sleep(2000);
        return true
    }

    reai = select(reData, '接受委托')
    if (reai) {
        click(795,149)
        sleep(2000);
        return true
    }

    reai = select(reData, '切换频道')
    if (reai) {
        click(1230,29)
        sleep(2000);
        return true
    }
    reai = select(reData, '一键删除')
    if (reai) {
        click(1230,29)
        sleep(2000);
        return true
    }
    reai = select(reData, '合成魔')
    if (reai) {
        click(1230,29)
        sleep(2000);
        return true
    }

    Load = select(reData, '利用活力')
    if (Load) {
        click(223 , 560) ;
        sleep(1200);
        return true
    }

    reai = select(reData, '战斗设置')
    if (reai) {
        click(1235,41)
        sleep(2000);
        return true
    }
    reai = select(reData, '快捷栏设置')
    if (reai) {
        click(1235,41)
        sleep(2000);
        return true
    }

    reai = select(reData, '特殊强化')
    if (reai) {
        click(1230,29)
        sleep(2000);
        return true
    }
    reai = select(reData, '精灵合成')
    if (reai) {
        click(1230,29)
        sleep(2000);
        return true
    }
    // 活力补充
    reai = select(reData,"活力补充")
    if (reai){
        click(950,164);
        sleep(2000);
        return true
    }

    reai = select(reData,"角色",true)
    if (reai) {
        click(1196,52);
        sleep(2000);
        return true
    }

    reai = select(reData,"输入数字")
    if (reai) {
        selclick(reData,"取消")
        sleep(2000);
        return true
    }

    reai = select(reData,"自动装备")
    if (reai) {
        click(732,538);
        sleep(2000);
        return true
    }

    reai = select(reData,"中型生命")
    if (reai) {
        click(1219,94); //  X
        sleep(2000);
        return true
    }

    OUT = select(reData,"前往狭窄的通道")
    if (!OUT) {
        OUT = select(reData,"请拖拽虚拟摇杆进行移动")
        if (OUT){
            swipe(232, 455, 232, 200, 3000); 
            return true
        }
    }

    return false
}

//  清空图片
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

//  领取奖励
function reward(reData) {
    // 领取邮箱
    let reai = select(reData, '一键删除')
    if (reai) {
        let img = captureScreen();
        // 账号
        let emil = images.pixel(img, 163, 75);
        if (emil == -1935584) {
            click( 163, 75);
            sleep(2000);
        }

        // 系统
        emil = images.pixel(img, 163, 151);
        if (emil == -1935584) {
            click( 163, 151);
            sleep(2000);
        }


        // 报告
        emil = images.pixel(img, 163, 443);
        if (emil == -1935584) {
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

    // //  背包空间不足
    reai = selclick(reData, '背包空间不足')
    if (reai) {
        // 处理物品    先售卖一件装备  然后去制造
        sleep(2000);
        click(808,83);   // 点击装备
        //  点击出售
        click(994,669);   // 点击出售
        sleep(2000);
        click(813,564); //  选择一件装备
        sleep(1000);
        click(920,564); //  选择2件装备
        sleep(1000);
        click(999,564); //  选择2件装备
        sleep(1000);
        click(1097,564); //  选择2件装备
        sleep(1000);
        click(1189,564); //  选择2件装备
        sleep(1000);
        
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
    reai = selclick(reData, '可领取成就奖励')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = selclick(reData, '完成成就获得')
    if (reai) {
        click(1206,103);
        sleep(2000);
        click(1206,103);  // 点击画面
        sleep(1000);
        click(1230,29);  // 退出
        sleep(2000);
        return true
    }

    reai = selclick(reData, '请领取每日课题奖励')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = select(reData, '每日课题现状')
    if (reai) {
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
    // reai = selclick(reData, '可解除道具封印。')
    // if (reai) {
    //     sleep(2000);
    //     return true
    // }
    // reai = select(reData, '正在解除封印')
    // if (reai) {
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
    reai = selclick(reData, '存在可召唤的精灵')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = select(reData, '出战效果')
    if (reai) {
        //  重新截图拿到最新的
        let img = captureScreen();
        let color = images.pixel(img, 939, 247);    // -1935584  橙色
        if (color == -1935584 ) {
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
        color = images.pixel(img, 1034, 247);   // -1935584  橙色
        if (color == -1935584 ) {
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
        color = images.pixel(img, 1130, 247);   // -1935584  橙色
        if (color == -1935584 ) {
            sleep(1000);
            click(1130,247);
            // 点击召唤  
            sleep(2000);
            click(1130,666);
        }

        color = images.pixel(img, 1237, 247);   // -1935584  橙色
        if (color == -1935584 ) {
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
    reai = selclick(reData, '存在可镶嵌的魔石')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = select(reData, '合成魔石')
    if (reai) {
        sleep(3000)
        //  重新截图拿到最新的
        let img = captureScreen();
        let color = images.pixel(img, 242, 259);   // -1935584  橙色
        if (color == -1935584 ) {
            
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

        color = images.pixel(img, 217, 357);   // -1935584  橙色
        if (color == -1935584 ) {
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
    reai = selclick(reData, '可学习新技能')
    if (reai) {
        sleep(2000);
        return true
    }
    // 升级技能
    reai = selclick(reData, '存在可升阶的技能')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = select(reData, '效果信息')
    if (reai) {
        sleep(3000)
        //  重新截图拿到最新的
        let img = captureScreen();
        //  拿到最新的数据
        let reData = getOcr(img,"ch");
        if (reData) {
            reai = selclick(reData, '学习',true) 
            if (reai) {
                sleep(1000);
                click(961,669);
                sleep(1000);
            }
            reai = selclick(reData, '腐败') 
            if (reai) {
                click(961,669);
                sleep(1000);
            }
            reai = selclick(reData, '暴血') 
            if (reai) {
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
    reai = selclick(reData, '可修炼内功')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = selclick(reData, '可升阶内功易筋经')
    if (reai) {
        sleep(2000);
        return true
    }

    reai = selclick(reData, '升阶所需等级')
    if (reai) {
        click(1039,671); // 点击修炼
        sleep(4000);
        click(1039,671); // 点击修炼
        return true
    }
    reai = select(reData, '太定')
    if (reai) {
        var img = captureScreen();
        var color = images.pixel(img, 43, 146);  
        if (color == -1935584 ) {
            //  有需要升级的地方
            var img = captureScreen();
            //  天宫  color == -8108002
            var color = images.pixel(img, 330, 605); 
            //  持律 
            var color1 = images.pixel(img, 454, 605); 
            //  脉天
            var color2 = images.pixel(img, 578, 605); 
            //  太定
            var color3 = images.pixel(img, 711, 605); 
            imgRecycle(img)
            if (color == -1935584 ) {
                click( 300,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }

            if (color1 == -1935584 ) {
                click( 424 ,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }

            if (color2 == -1935584 ) {
                click( 547  ,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }

            if (color3 == -1935584 ) {
                click( 672  ,645);
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(4000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            sleep(2000);
            return true
        } 
        return false
    }

    // 背包里存在推荐装备
    reai = selclick(reData, '背包里存在推荐装备')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = selclick(reData, '自动镶嵌')
    if (reai) {
        sleep(2000);
        click(730,540);
        return false
    }
    
    // 存在可提升的体质
    reai = selclick(reData, '存在可提升的体质')
    if (reai) {
        sleep(2000);
        return true
    }
    reai = select(reData, '法术攻击')
    if (reai) {
        var img = captureScreen();
        var color = images.pixel(img, 290, 34);
        if (color == -1935584 ) {
            //  有需要升级的地方
            var img = captureScreen();
            //  法术   
            var color = images.pixel(img, 434, 557); 
            //  命中 
            var color1 = images.pixel(img, 600, 489); 
            //  回避
            var color2 = images.pixel(img, 271, 489); 

            //  魔力
            var color3 = images.pixel(img, 666, 326); 
            //  生命
            var color4 = images.pixel(img, 203, 326); 

            //  法术防御
            var color5 = images.pixel(img, 589, 177); 
            //  物理防御
            var color6 = images.pixel(img, 260, 177); 
            imgRecycle(img)
            if (color == -1935584 ) {
                click(400,600);  // 点击法伤
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (color1 == -1935584 ) {
                click(564,524);  // 点击命中
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (color2 == -1935584 ) {
                click(234,524);  // 点击回避
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (color3 == -1935584 ) {
                click(629,357);  // 点击魔力
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (color4 == -1935584 ) {
                click(166,357);  // 点击生命
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (color5 == -1935584 ) {
                click(562,200);  // 点击法术防御
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            if (color6 == -1935584 ) {
                click(234,200);  // 点击物理防御
                sleep(1000);
                click(1039,671); // 点击修炼
                sleep(3000);
                click(1039,671); // 点击修炼
                sleep(1000);
            }
            sleep(2000);
            click(1230,29)
            sleep(1000);
            return true
        } 
        return false
    }

    closeNote(reData,"可加入门派")
    closeNote(reData,"可执行奇缘")
    closeNote(reData,"可解除道具封印")
    closeNote(reData,"已扩充精灵出战")
    // closeNote(reData,"背包里存在推荐装备")
    closeNote(reData,"可学习新内功")
    closeNote(reData,"可以在村庄里使用私人仓库")

    return false
}

//  创建角色
function create(reData) {
    // 选择角色界面
    let reai = select(reData, '选择职业')
    if (reai) {
        // 选黑道士
        reai = selclick(reData, '黑道士')
        if (reai) {
            sleep(2000);
            selclick(reData, '选择',true)
            sleep(500);
        }
        return true
    }
    // 捏脸界面
    reai = select(reData,"自定义")
    if (reai) {
        //  禁用语或者低俗
        reai = select(reData,"请重新")
        if (reai) {
            selclick(reData,"确定")
            sleep(2000);
            return true
        }

        // 打开了小键盘
        reai = select(reData,"换行")
        if (reai) {
            click(1185,343) // 点击缩放的地方
            sleep(2000);
            //  请输入名称
            input(getRandomName())
            sleep(500);
            return true
        }

        //  请输入名称
        reai = select(reData,"请输入名称")
        if (reai) {
            selclick(reData, '请输入名称')
            sleep(1000);
            return true
        }

        reai = selclick(reData, '创建角色')
        if (!reai) {
            selclick(reData,"确定")
        }
        sleep(2000);
        return true
    }

    return false
}

//  升级
function upLevel(){
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }
    // 截图
    let img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }
    let grayscaleImage = images.grayscale(img);
    
    // 裁剪图像
    let attImg = images.clip(img, 522,41,6,3); 
    //  是否是在打怪
    let clors = getCl(attImg,1,2)
    imgRecycle(attImg)

    // 是否在自动寻路
    let imgtext = clip2(img,[[1180 ,145],[1263 ,145],[1263 ,148 ],[1180 ,148]])
    //  获取颜色
    let code = isblue(imgtext)
    imgRecycle(imgtext)

    // 裁剪等级
    let croppedImage = images.clip(img, 11, 0, 60, 32);
    let lvData = getOcr(croppedImage,"ch");
    imgRecycle(croppedImage);
    // 获取等级
    getlv(lvData)

    // 通知区域 橙色
    let color = images.pixel(img, 1184, 17);

    // 邮箱
    // let emil = images.pixel(img, 66, 94); 
    
    let hp =  images.pixel(img, 459, 666); 
    let mp =  images.pixel(img, 532, 667); 
    // console.log(`hp: ${hp}, mp : ${mp}`)

    let color1 = images.pixel(img, 459, 666);   // 判断是否是中红药
    let color2 = images.pixel(img, 529, 666);   // 判断是否是中蓝药
    // console.log(`color1: ${color1}, color2 : ${color2}`)

    // 获取OCR
    let reData = getOcr(grayscaleImage,"ch");
    imgRecycle(img)
    if (reData) {
        //  创建角色
        if (create(reData)) {return }

        // console.log("处理异常弹窗")
        //  处理异常弹窗
        if (wrong(reData)) {return }

        // 进入游戏界面以前
        let reai = select(reData, 'REA') 
        if(reai){
            // 进入游戏
            reai = selclick(reData, '点击')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000);
                return
            }

            reai = select(reData, '退出登录') 
            if (reai) {
                reai = select(reData, '选项') 
                if (!reai) {
                    // 返回
                    // home()  // 感觉 app.launch('com.wemade.mir4global') 也可 
                    app.launch('com.wemade.mir4global') 
                    sleep(5000)
                }
            }

            // 加载补丁中
            reai = selclick(reData, '加载补丁中')
            if (reai) {
                console.log("加载补丁中 等待5秒")
                sleep(5000);
                return
            }

            reai = select(reData, '资格的证明') 
            if(reai){
                // 进入游戏
                reai = clickTow(reData, '登录游戏')
                if (reai) {
                    console.log("登录游戏")
                    sleep(5000);
                }
            } 
            return
        }else{
            //  选择角色界面
            let role = select(reData, '选择角色') 
            if(role){
                // 开始游戏
                reai = selclick(reData, '开始游戏')
                if (reai) {
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

        let lv = storage.get("lv",0)
        console.log(`人物当前等级: ${lv} `); // 当前等级  
        
        // 领取奖励
        if (lv > 11 ) {
            // 根据气泡领取
            if (reward(reData)) {return }
            //  通知气泡
            if (color == -1935584) {
                click(1184,17)
                sleep(1000);
                return
            }
        }

        // 领取邮箱
        // if (lv > 20) {
        //     if (emil == -2133216) {
        //         //  可以领取
        //         click(55,105);
        //         sleep(3000);
        //         return
        //     }
        // }

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
                    if (hp == -13093322 || hp == -13093065 || hp == -13092809  || mp == -11776688 || mp == -11907760 || mp == -11776432 || mp == -11776431 || mp == -11841968) {
                        console.log("没药剂了")
                        let buy = select(reData,"购买")
                        if (buy) {
                            textClick(buy,-45,0)
                            return
                        } 
                        // 找恢复 向上
                        // let OUT = select(reData,"恢复药")
                        // if (OUT) {
                        //     if (OUT.box[0][1] > 20){
                        //         textClick(OUT,0,-45)
                        //         return
                        //     }
                        // }
                        //  点击地图 去买药的位置
                        reai = selclick(reData,"比奇城")
                        if (reai) {
                            // 进入地图
                            sleep(4000);
                            console.log("前往庆济")
                            // 前往庆济
                            // click(1128,572);
                            // sleep(2000);
                            // click(1128,572);
                            console.log("点击传送")
                            //  点击寻路
                            sleep(1000);
                            // click(1202,678);
                            click(430,574);
                            sleep(1000);
                            click(430,574);
                            click(430,574);
                            sleep(10000);
                            if (wait("购买",200000)) {
                                console.log("找到了")
                                return
                            }
                        }
                    }else{
                        // 判断是否是大药 切换药
                        // var color1 = images.pixel(img, 459, 666);   // 红药
                        // var color2 = images.pixel(img, 529, 666);   // 蓝药
                        if ((color1 != -11661539 && color1 != -13093322 && color1 != -11791328 && color1 != -11791842 || color1 == -11791841) || (color2 != -15912110 && color2 != -13158343 && color2 != -15780527 && color2 != -15911855 && color2 != -15780525 && color2 != -13092551) ) {
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
        }

        // console.log("是否在打怪")
        // 是否在打怪
        if (clors.hex == '#2e2f34') {
            console.log("在打怪");
            // 处理取消打怪升级
            if (lv == 14) {
                OUT = select(reData,"芊菲的下落")
                if (OUT) {
                    OUT = selclick(reData,"1.")
                    if (OUT) {
                        //  停止打怪
                        // click(395,662); 
                        sleep(5000);  
                        return
                    }
                }
            }

            if (lv > 9 && lv <=13 ) {
                return sleep(360000)
            }

            // 使用觉醒
            if (lv > 16 ) {
                click(1133,560);   // 觉醒键 
                sleep(10000);  
            }
            //  检查药回城
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
                        sleep(1000);
                        click(1128,572);   //点击庆济
                        
                        sleep(1000);
                        click(1058,678); // 点击瞬移  

                        //  点击位置跑过去
                        // click(430,574);
                        // sleep(1000);
                        // click(430,574);
                        // click(430,574);
                        sleep(10000);
                    }else{
                        console.log("前往庆济")
                        // 前往庆济
                        // click(1128,572);
                        // sleep(2000);
                        // click(1128,572);
                        console.log("点击传送")
                        //  点击寻路
                        sleep(1000);
                        // click(1202,678);
                        click(430,574);
                        sleep(1000);
                        click(430,574);
                        click(430,574);                        
                        sleep(38000);
                    }
                }
            }

            //  【精英】比奇城后巷 打怪中 长时间等待
            if (lv >= 19) {
                reai = select(reData,"【精英】比奇城后巷")
                if (reai) {
                    if (reai.box[0][1] < 114 ) {
                        reai = select(reData,"12.救出可疑的")
                        if (reai) {
                            click(1197,625);  // 普攻一下
                            sleep(50000);
                        }
                    }
                }
            }

            // if (lv < 19 ) {
            //     click(1197,625);  // 普攻一下
            // }

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
                    sleep(13000);
                    click(395,662);  // 点击打怪
                    click(1195,630);
                    sleep(27000);
                }
                return    
            }
        }

        //  升级到40  TODO 整理装备 领取奖励
        if (lv < 40 ) {
            //  查找 找救出可疑的女人
            reai = select(reData,"12.救出可疑的女人")
            if (reai) {
                console.log("练级到40")
                reai = select(reData,"【精英】比奇城后巷")
                if (reai) {
                    if (reai.box[0][1] < 114 ) {
                        click(395,662);
                        sleep(2000);
                        return
                    }
                }else{
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
                    click(313,526); // 双击去  476,407
                    sleep(500);
                    click(313,526); // 双击去
                    sleep(73000);
                    // click(395,662);  // 打怪
                }
                return
            }
        }


        reai = select(reData,"击败双门帮")
        reai1 = select(reData,"击败老二")
        if (reai || reai1) {
            if ((reai && reai.box && reai.box[0][0]) || (reai1 && reai1.box && reai1.box[0][0])) {
                img = captureScreen();
                let imgtext2 = images.clip(img, 1188, 218, 20, 2); //第二个任务
                let code2 = isblue(imgtext2)
                imgRecycle(imgtext2)
                imgRecycle(img)
                if (code2) {
                    sleep(17000);
                    return 
                }else{
                    click(1187,218);
                    sleep(15000);
                    return
                }
            }
        }

        //  是否在自动做任务
        console.log(`是否在自动做任务: ${code}`)
        if (code) {
            click(945,574); // 奔跑
            //  切换视角
            reai = select(reData,"小传")
            if (reai) {
                if (reai.box[0][0] < 600) {
                    swipe(721, 360, 10, 0, 1000);
                    return
                }
            }

            if (lv >= 19) {
                reai = select(reData,"绑架的背后")
                if (reai) {
                    reai = select(reData,"肉婆婆")
                    if (reai) {
                        click(1164, 172);
                        sleep(1000);
                        return
                    }

                }
            }
            sleep(2000);
        }else{
            reai = select(reData,"可疑的女人")
            if (!reai) {
                // 加入限定的条件 
                reai3 = select(reData,"和平",true)
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
        reai = select(reData, '漆黑的')
        if (reai) {
            reai = select(reData, '开采岩窟花树液')
            if (reai) {
                sleep(3000);
                click(644.5,274.5);
                sleep(6000);
                return
            }
            
            reai = select(reData,"同伴就在")
            if (reai) {
                reai = selclick(reData, '前往')
                return
            }

            reai = select(reData,"与剑啸")
            if (reai) {
                sleep(1000);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(1000);
                return
            }

            reai = selclick(reData,"3.与京")
            if (reai) {
                sleep(5000);
                return
            }
            return
        }

        // 危险的救援计划
        reai = select(reData, '危险的救')
        if (reai) {
            reai = select(reData, '与芊菲对话')
            if (reai) {
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = select(reData, '开启牢门')
            if (reai) {
                click(644.5,274.5)
                sleep(8000)
                return
            }
            reai = select(reData, '救出芊')
            if (reai) {
                sleep(3000);
                click(644.5,274.5)
                sleep(8000)
                return
            }
        }

        //  武功修炼
        reai = select(reData, '武功修炼')
        if (reai) {
            reai = select(reData, '摧毁木')
            if (reai) {
                selclick(reData, '跳过')
                // 点击攻击按钮
                click(1197,625);  // 攻击键
                sleep(1000);
                return
            }
        }

        // 岁月静好
        reai = select(reData, '岁月静好')
        if (reai) {
            reai = select(reData, '跳过')
            if (reai) {
                reai = select(reData, '12.与京')
                if (reai) {
                    //  制作武器的节点
                    reai = select(reData, '制造武器')
                    if (reai) {
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
                reai = select(reData, '5.击败')
                if (reai) {
                    reai = selclick(reData, '跳过')
                    if (reai) {
                        sleep(1200)
                    }
                }
                return
            }else{
                reai = selclick(reData, '跳过')
                if (reai) {
                    sleep(1200)
                    return
                }
            }

            return
        }

        // 追踪痕迹
        reai = select(reData, '追踪痕迹')
        if (reai) {
            reai = select(reData, '寻找芊') // 精灵
            if (reai) {
                sleep(2000);
                reai = select(reData, '请点击全部')
                if (reai) {
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

                reai = select(reData, '请点击按键')
                if (reai) {
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

            reai = selclick(reData, '寻得蛊')
            if (reai) {
                sleep(2000);
                click(326,638);
                sleep(3000);
                click(326,638);
                return
            }

            reai = selclick(reData, '强化技能')
            if (reai) {
                sleep(2000);
                swipe(273, 100, 273, 700, 1000); 
                img = captureScreen();
                reData = getOcr(img,"ch");
                imgRecycle(img)
                if (reData) {
                    reai = selclick(reData, '暴血花')
                    if (reai) {
                        sleep(4000);
                    }
                    reai = selclick(reData, '学习',true)
                    if (reai) {
                        sleep(3000);
                    }
                
                    img = captureScreen();
                    reData = getOcr(img,"ch");
                    imgRecycle(img)
                    reai = selclick(reData, '饿鬼')
                    if (reai) {
                        sleep(2000);
                        reai = selclick(reData, '强化')
                        if (reai) {
                            sleep(3000);
                            click(1230,25);
                        }
                    }
                }
                return
            }
        }

        // 黑暗之影      委托
        reai = select(reData, '黑暗之影')
        if (reai) {
            reai = select(reData, '请点击活')
            if (reai) {
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
                sleep(500);
                click(718,441);// max
                sleep(500);
                click(718,441);// max
                sleep(500);
                click(718,441);// max
                sleep(500);
                click(725,536) ;// 点击使用
            }

            reai = select(reData, '强化体质')
            if (reai) {
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

            reai = select(reData, '采集森')
            if (reai) {
                sleep(8000)
                click(326,638);
                sleep(8000)
                click(326,638);
                return
            }

            //  这个背景是蓝色的 导致识别不正确
            reai = select(reData, '击败跑来')
            if (reai) {
                if (clors.hex != '#2e2f34') {
                    reai = selclick(reData, '击败跑来')
                    sleep(3000);
                    return 
                }  
            }

            return
        }
        // 芊菲的下落

        // 寻求灵药
        reai = select(reData,"寻求灵药")
        if (reai) {
            reai = selclick(reData, '7.与')
            if (reai) {
                sleep(4000);
                return
            }
            reai = selclick(reData, '8.制')
            if (reai) {
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
            reai = select(reData, '22.带')
            if (reai) {
                reai = selclick(reData, '跳过')
                if (reai) {
                    sleep(1200)
                }
                swipe(208, 543, 208, 400, 5000); 
                selclick(reData, '22.带')
                sleep(13000);
                return
            }
            
            reai = select(reData, '21.获')
            if (reai) {
                sleep(20000);
                click(326,638);
                sleep(4000)
                click(326,638);
                return
            }

            reai = selclick(reData, '3.采')
            if (reai) {
                sleep(3000);
                click(326,638);
                sleep(8000)
                click(326,638);
            }

            reai = selclick(reData, '6.修炼')
            if (reai) {
                selclick(reData, '跳过')
                sleep(2000)
                img = captureScreen();
                ocrResults = getOcr(img,"ch");
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

        // 比奇城风云    6.离开龙会楼  可以升级技能什么的 
        reai = select(reData,"比奇城风")
        if (reai) {
            reai = select(reData, '请点击全部')
            if (reai) {
                reai = selclick(reData, '跳过')
                sleep(600)
            }
            reai = select(reData, '21.强化装备')
            if (reai) {
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
        reai = select(reData,"逃离银杏谷")
        if(reai){
            reai = select(reData, '请点击全部')
            if (reai) {
                reai = selclick(reData, '跳过')
                sleep(600)
            }
            return
        }

        // 绑架的背后   精英任务  
        reai = select(reData,"绑架的背后")
        if (reai) {
            reai = select(reData, '银杏谷采')
            if (reai) {
                sleep(8000);
                click(326,638);
                sleep(128000);
            }

            reai = selclick(reData, '4.与')
            if (reai) {
                sleep(2000);
                return 
            }

            reai = selclick(reData, '25.与')
            if (reai) {
                sleep(2000);
                return 
            }

            reai = selclick(reData, '品质2武器')
            if (reai) {
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


            reai = select(reData, '18.完成丹')
            if (reai) {
                reai = select(reData,"击败双");
                if (!reai) {
                    img = captureScreen(); // 重新获取截图
                    reData = getOcr(img,"ch"); // 重新OCR
                    imgRecycle(img);
                    if (reData) {
                        reai = select(reData, '奇缘')     
                        if (reai) {
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
            reai = select(reData, '20.完成朱千')
            if (reai) {
                reai = select(reData,"击败双");
                if (!reai) {
                    selclick(reData, '20.完成朱千')
                    sleep(4000);
                    img = captureScreen(); // 重新获取截图
                    reData = getOcr(img,"ch"); // 重新OCR
                    imgRecycle(img);
                    if (reData) {
                        reai = select(reData, '奇缘')     
                        if (reai) {
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
            reai = select(reData, '22.完成击败')  // 陈秋风
            if (reai) {
                reai = select(reData,"老二陈");
                if (!reai) {
                    selclick(reData, '22.完成击败')
                    sleep(4000);
                    img = captureScreen(); // 重新获取截图
                    reData = getOcr(img,"ch"); // 重新OCR
                    imgRecycle(img);
                    if (reData) {
                        reai = select(reData, '奇缘')     
                        if (reai) {
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
            }

            reai = selclick(reData, '28.前')
            if (reai) {
                sleep(2000);
                return 
            }

            reai = selclick(reData, '29.前')
            if (reai) {
                sleep(5000);
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
                sleep(2000);
                return
            } 
            
        }
        reai = selclick(reData,"《器")
        if (reai) {
            sleep(3000);
            return
        }

        click(223 , 560) ; // 点击画面
        sleep(50);
        click(223 , 560) ; // 点击画面
        sleep(50);
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

console.log("开始执行!")

main()


if (false) {
    // console.log("开始请求截图")
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }

    
    // console.log("截图")
    let img = captureScreen();

    // console.log("开始请求")
    let reData = getOcr(img,"ch");
    
    // emil = images.pixel(img, 47, 688);   // -2236963 白色
    // console.log(emil)

    // color = images.pixel(img, 756, 74);   // -1935584  橙色
    // console.log(color)
    
}
 

// toast("操作结束")
console.log("操作结束")