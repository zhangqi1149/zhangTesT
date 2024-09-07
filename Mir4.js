// 设置服务器地址
var SERVER_URL = "http://192.168.0.119:5000/ocr";

var Shout = "加我QQ 有好东西"

var  Save = false  // true   false 

var width_screenshot = 1285
var height_screenshot = 720

var storage = storages.create("ABC");

// OCR请求
function getOcr(img, lang) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            lang: lang  ,// 动态设置语言
            save: Save // true   false 
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson(SERVER_URL, jsonData, {
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

// OCR请求
function getCl(img, x1,y1) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            x: x1  , 
            y: y1  
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson("http://192.168.0.119:5000/color", jsonData, {
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

// OCR请求
function isblue(img) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            save: Save // true   false 
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson("http://192.168.0.119:5000/is_blue", jsonData, {
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

// var grayscaleImage = images.grayscale(img);  // 灰度处理
// var binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");     // 二级化

// 初始化
function init(){
    // 权限检查
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
        return false
    }
    let currentPkg = currentPackage();
    // 是否在游戏
    if (currentPkg == "com.wemade.mir4global" | currentPkg =="android"){
        return true
    } else {
        toast("目前不在游戏")
        app.launch('com.wemade.mir4global')
        sleep(1000);
        app.launch('com.wemade.mir4global')
        sleep(3000);
    }
    return false
}
 
// 查找内容  支持模糊查询 1是精准查询  不传是模糊查询
// 模糊查找内容
function select(ocrResults, targetText,num) {
    if (!Array.isArray(ocrResults)) {
        console.error("OCR 结果不是数组");
        return null;
    }

    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            if (num == 1) {
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
function textClick(target,num){
    // 计算文本区域的中心点
    let centerX = (target.box[0][0] + target.box[2][0]) / 2;
    let centerY = (target.box[0][1] + target.box[2][1]) / 2;

    // 将坐标从截图转换到设备屏幕坐标
    let x_phone = (centerX / width_screenshot) * device.height;
    let y_phone = (centerY / height_screenshot) * device.width;

    console.log(`点击坐标: x=${x_phone}, y=${y_phone}`);

    // 点击坐标
    click(x_phone+num,y_phone);
    // click(x_phone+920,y_phone); // 广告的关闭按钮
}

// 查找文本并点击
function selclick(reData,src,num){
    var target = select(reData, src,num)
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
            toast(`selclick ${src} 点击失败`)
        }
        return true
    }else{
        return false
    }
}

// 区域裁剪
function clip(img, box) {
    // 获取裁剪区域的坐标
    var x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    var x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    var y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    var y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    var croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    // var grayscaleImage = images.grayscale(croppedImage);  // 灰度处理
    // var binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");     // 二级化

    // 上传裁剪后的图像并获取 OCR 结果
    var ocrResults = getOcr(croppedImage,"ch");
    if (ocrResults) {
        try {
            if (Array.isArray(ocrResults) && ocrResults.length > 0 && ocrResults[0].hasOwnProperty('text')) {
                console.log(`裁剪图像中的文本: ${ocrResults[0].text}`);
                return true
            }
        } catch (e) {
            console.error("解析 OCR 结果失败: ", e);
        }
    }
    return false
}

// 区域裁剪
function clip2(img, box) {
    // 获取裁剪区域的坐标
    var x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    var x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    var y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    var y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    var croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    return croppedImage
}

//  错误处理
function wrong(reData){
    var OUT = select(reData,"服务器连接断开")
    if (OUT){
        reai = selclick(reData, '前往登录')
        if (reai) {
            console.log("点击界面进入游戏")
            sleep(5000);
            return true
        }
    }

    var OUT = select(reData,"重新尝试")
    if (OUT){
        reai = selclick(reData, '重新尝试')
        if (reai) {
            console.log("点击重新尝试")
            sleep(5000);
            return true
        }
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
        click(105,607);  // 今日不再显示
        sleep(500)
        console.log("点击关闭广告")
        textClick(reai,920)
        sleep(3000);
        return true
    }

    var Load = select(reData,"Loading")
    if (Load){
        toast(" Load 界面 等待5秒")
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
    
        // ----   操作类的
        //  设置药剂 和 技能频率
        long = selclick(reData,"尝试上下")
        if (long){
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
            click(1195,441);  // 战斗自动锁定
            click(1195,367);  // 复活时自动返回
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
            click(1195,441);  // 战斗自动锁定
            click(1195,367);  // 复活时自动返回
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
            sleep(1000);
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
    }
    return false
}

//  制造 强化 合成 魔石  
function Console(reData) { 
    var long = select(reData, '请点击全部菜单按键')
    if (long) {
        click(1228,28);
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
        if (item == 727.0 || item == 728.0 || item2 == 156.0) {
            click(945,109);  // 角色
            sleep(2000);
            click(939,222);  // 铁匠
            return true 
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
        console.log(`请点击按键: ${item}`)
        // [[754.0, 349.0], [843.0, 349.0], [843.0, 368.0], [754.0, 368.0]] 制造按钮提示位置
        if (item== 754.0) {
            click(935,310);  // 制造
            sleep(1000);
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

    return false
}

// 关闭窗口
function closeX(reData){
    var reai = select(reData, '伪像切换')
    if (reai) {
        toast("伪像切换")
        click(1230,29);
        sleep(2000);
        return true
    }
    var reai = select(reData, '大地图')
    if (reai) {
        click(1230,29);
        sleep(2000);
        return true
    }

    reai = select(reData, '闭关修炼')
    if (reai) {
        toast("闭关修炼")
        click(1230,29)
        sleep(2000);
        return true
    }
    reai = select(reData, '龙神器')
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

    reai = select(reData, '特殊强化')
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

    reai = select(reData,"角色")
    if (reai) {
        click(1196,52);
        sleep(2000);
        return true
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

//  升级
function upLevel(){
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }
    // 截图
    var img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }

    // 裁剪图像
    var attImg = images.clip(img, 522,41,6,3); 
    //  是否是在打怪
    var clors = getCl(attImg,1,2)

    // 是否在自动寻路
    var imgtext = clip2(img,[[1180 ,145],[1263 ,145],[1263 ,148 ],[1180 ,148]])

    // 裁剪等级
    var croppedImage = images.clip(img, 25, 0, 55, 32);
    var lvData = getOcr(croppedImage,"ch");
    imgRecycle(croppedImage);
    // 获取等级
    getlv(lvData)

    //  获取颜色
    var code = isblue(imgtext)
    imgRecycle(imgtext)

    // 获取OCR
    var reData = getOcr(img,"ch");
    imgRecycle(img)
    if (reData) {
        //  处理异常弹窗
        if (wrong(reData)) {return }

        // 进入游戏界面以前
        var reai = select(reData, 'REA') 
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
            var role = select(reData, '选择角色') 
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
        
        // 处理小青龙
        if (Loong(reData)) {return }
        
        //  处理强化 制造 加点
        if (Console(reData)) {return }
        
        // 关闭所有的弹窗
        if (closeX(reData)) {return }

        OUT = select(reData,"前往狭窄的通道")
        if (!OUT) {
            OUT = select(reData,"请拖拽虚拟摇杆进行移动")
            if (OUT){
                swipe(232, 455, 232, 200, 3000); 
                return
            }
        }

        var lv = storage.get("lv",0)
        if (clors.hex == '#2e2f34') {
            console.log("在打怪");
            // 处理取消打怪升级
            if (lv == 15) {
                OUT = select(reData,"芊菲的下落")
                if (OUT) {
                    // OUT = select(reData,"1.与")
                    // if (OUT) {
                    // }
                    //  停止打怪
                    click(395,662); 
                    sleep(10000);  
                }
            }
            sleep(5000);
            return 
        }    

        //  获取等级 
        console.log(`人物当前等级: ${lv} `); // 输出等级  
        if (lv >= 9 && lv < 15) {
            reai = select(reData,"芊菲的下落")
            if (reai) {
                // 去银杏谷练级
                // reai = selclick(reData,"银")
                // if (reai) {
                    sleep(2000);
                    click(330,445);
                    sleep(500)
                    click(330,445);
                    click(330,445);
                    sleep(7000);
                    click(395,662);  // 点击打怪
                    sleep(7000);
                // }
                return    
            }
        }

        // if (imgtext) { // && qust
        if (code) {
            // console.log(" 我在自动做任务 ",code);
            sleep(5000);
        }else{
            // 加入限定的条件 
            reai = select(reData,"和平")
            reai3 = select(reData,"近距")
            reai4 = select(reData,"安全")
            if (reai||reai3||reai4) {
                console.log(" . ");
                code = click(1122.5,187);    
                sleep(2000)
            }
        } 

        if (lv < 15 ) {
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
                    img.recycle(); // 手动释放内存
                    img = null;
                    if (reData) {
                        reai = selclick(reData, '暴血花')
                        if (reai) {
                            sleep(4000);
                        }
                        reai = selclick(reData, '学习',1)
                        if (reai) {
                            sleep(3000);
                        }
                    
                        img = captureScreen();
                        reData = getOcr(img,"ch");
                        img.recycle(); // 手动释放内存
                        img = null;
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
                    click(718,441);// max
                    click(718,441);// max
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
        }else{
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

                // 14.   采集真气  TODO

                reai = selclick(reData, '6.修炼')
                if (reai) {
                    selclick(reData, '跳过')
                    sleep(2000)
                    img = captureScreen();
                    ocrResults = getOcr(img,"ch");
                    imgRecycle(img)
                    if(ocrResults){
                        sleep(2000) ;
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

            // 逃离银杏谷    // 9.与师父对话 可以切换药剂
            reai = select(reData,"逃离银杏谷")
            if(reai){
                reai = select(reData, '请点击全部')
                if (reai) {
                    reai = selclick(reData, '跳过')
                    sleep(600)
                }
                // reai = selclick(reData, '4.')
                // if (reai) {
                //     sleep(6000)
                // }
 

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
                return
            }

        }
       
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


if (Save) {
    // console.log("开始请求截图")
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }

    // console.log("截图")
    var img = captureScreen();

    // console.log("开始请求")
    var reData = getOcr(img,"ch");
}
 
// toast("操作结束")
console.log("操作结束")