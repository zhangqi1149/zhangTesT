// 设置服务器地址
const SERVER_URL = "http://192.168.0.119:5000/ocr";

const Shout = "加我QQ 有好东西"

const  Save = false  // true   false 

const width_screenshot = 1285
const height_screenshot = 720

const WIDTH_SCREEN = device.height;   // 目标屏幕宽度
const HEIGHT_SCREEN = device.width; // 目标屏幕高度

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
            }
        });
        
        if (response.statusCode == 200) {
            return JSON.parse(response.body.string());
        } else {
            console.error("服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
    }
    return null;
}


// 初始化
function init(){
    // 权限检查
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
        return false
    }

    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
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
                    console.log("找到目标文本:", item.text);
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
    let x_phone = (centerX / width_screenshot) * WIDTH_SCREEN;
    let y_phone = (centerY / height_screenshot) * HEIGHT_SCREEN;

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
        let x_phone = (centerX / width_screenshot) * WIDTH_SCREEN;
        let y_phone = (centerY / height_screenshot) * HEIGHT_SCREEN;

        console.log(`点击${src}: x=${x_phone}, y=${y_phone}`);

        // 点击坐标
        click(x_phone,y_phone);
        sleep(5)
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
        console.log("点击关闭广告")
        textClick(reai,920)
        sleep(3000);
        return
    }
}

function flying(reData){
    // 使用轻功
    var OUT = select(reData,"1段跳跃")
    if (OUT){
        click(1221,400)
        return true
    }

    OUT = select(reData,"瞬间快速地")
    if (OUT){
        toast("弹力轻功")
        click(1060,531)
        click(1204,400)
        sleep(3000);
        return true
    }

    // 使用轻功
    OUT = select(reData,"点击轻功")
    if (OUT){
        click(1221,400)
        return true
    }

    // 使用轻功
    OUT = select(reData,"试试轻功吧")
    if (OUT){
        click(1221,400)
        sleep(2000);
        click(1221,400)
        return true
    }
    return false
}

function closeX(reData){
    var reai = select(reData, '伪像切换')
    if (reai) {
        toast("伪像切换")
        click(1230,29)
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
        toast("龙神器")
        click(1230,29)
        sleep(2000);
        return true
    }

    Load = select(reData, '利用活力')
    if (Load) {
        Load = selclick(reData, '跳过')
        sleep(2000);
        return
    }
    
    reai = select(reData, '特殊强化')
    if (reai) {
        toast("特殊强化")
        click(1230,29)
        sleep(2000);
        return true
    }
    // 活力补充
    reai = select(reData,"活力补充")
    if (reai){
        click(950,164)
        return true
    }
    return false
}


//  升级
function upLevel(){
    // 截图
    var img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }

    width_screenshot = img.getWidth();  // 获取截图的宽度
    height_screenshot = img.getHeight();  // 获取截图的高度

    // 获取OCR
    var reData = getOcr(img,"ch");
    if (reData) {
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
        } 
        
        //  选择角色界面
        var role = select(reData, '删除角色') 
        if(role){
            // 开始游戏
            reai = selclick(reData, '开始游戏')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000);
                return
            }
        }
        
        var Load = select(reData,"Loading")
        if (Load){
            toast(" Load 界面 等待5秒")
            sleep(5000);
            return
        }

        Load = select(reData, '小青龙')
        if (!Load) {
            Load = selclick(reData, '《器')
            if (Load) {
                sleep(3000);
                return
            }
            Load = select(reData, '设置窗口')
            if (Load) {
                Load = selclick(reData, '跳过')
                sleep(2000);
                return
            }
        }

        if (wrong(reData)) {return }

        if (flying(reData)) {return }

        if (closeX(reData)) {return }

        OUT = select(reData,"请拖拽虚拟摇杆进行移动")
        if (OUT){
            swipe(232, 455, 232, 200, 3000); 
            sleep(4000);
            return
        }

        // 在图像中查找颜色
        // var point = images.findColor(img, 16777215, {threshold: 100, region: [1002, 141, 14, 37]});
        // var point2 = images.findColor(img, 16777215, {threshold: 100, region: [1035, 141, 14, 37]});
        // if (point|point2) {
        //     console.log("正在执行任务-等待2秒")
        //     sleep(3000)
        //     return
        // } else {
        //     // 不在执行动作 点击开始开始执行
        //     click(1122.5,187)
        //     console.log("..点击")
        // }

        var point = images.findColor(img, 16110772, {threshold: 30, region: [370, 635, 50, 50]});
        if (point) {
            console.log("在打怪");
            sleep(2000);
            return 
        }
        
        // 是否在自动寻路
        var imgtext = clip(img, [[582.0, 507.0], [713.0, 507.0], [713.0, 529.0], [582.0, 529.0]])
        if (imgtext) {
            console.log(" 我在奔跑 ");
            sleep(3000);
            return
        }else{
            click(1122.5,187)
            sleep(1000)
        } 

        // 漆黑的密道
        reai = select(reData, '漆黑的')
        if (reai) {
            reai = select(reData, '开采岩窟花树液')
            if (reai) {
                sleep(5000);
                click(644.5,274.5);
                return
            }
            
            reai = select(reData,"同伴就在")
            if (reai) {
                reai = selclick(reData, '前往')
                return
            }
        }

        // 危险的救援计划
        reai = select(reData, '危险的救')
        if (reai) {
            reai = select(reData, '前往狭窄的')
            if (reai) {
                //  滑动
                swipe(232, 455, 0, 455, 7000);    //200 536
                return
            }
            reai = select(reData, '开启牢门')
            if (reai) {
                click(644.5,274.5)
                return
            }

            reai = select(reData, '救出芊')
            if (reai) {
                sleep(2000);
                click(644.5,274.5)
                return
            }
 
        }

        //  武功修炼
        reai = select(reData, '武功修炼')
        if (reai) {
            reai = selclick(reData, '跳过')
            if (reai) {
                sleep(3000)
                return
            }
        }

        // 岁月静好
        reai = select(reData, '岁月静好')
        if (reai) {
            reai = selclick(reData, '跳过')
            if (reai) {
                sleep(3000)
                return
            }
        }

        // 追踪痕迹
        reai = select(reData, '追踪痕迹')
        if (reai) {

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
                img = captureScreen();
                ocrResults = getOcr(img,"ch");
                reData = JSON.parse(ocrResults);
                if (reData) {
                    reai = clickTow(width_screenshot,height_screenshot,reData, '学习')
                    if (reai) {
                        sleep(4000);
                    }
        
                    reai = selclick(reData, '饿鬼')
                    if (reai) {
                        sleep(3000);
                        reai = selclick(reData, '强化')
                        if (reai) {
                            sleep(4000);
                            click(1230,25);
                        }
                    }
                }
                return
            }
        }

        // 黑暗之影
        reai = select(reData, '黑暗之影')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '强化体质')
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
                    if (index == 3|index == 4) {
                        click(860,221)
                    }
                    // 魔力
                    if ( index == 5) {
                        click(1111,221)
                    }
                    sleep(1500)
                    click(1040,672)
                    sleep(3000);
                }
                click(1230,25) // 关闭
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '采集森')
            if (reai) {
                sleep(5000)
                click(326,638);
                sleep(8000)
                click(326,638);
                return
            }
        }
        
    }
}

// 主函数
function main(){
    // 初始化
    if (init()) {
        upLevel()
    }
}

for (let index = 0; index < 3; index++) {
    main()
}

// if (!requestScreenCapture(true)) {
//     throw new Error("请求屏幕捕获权限失败");
// }
// var img = captureScreen();
// var ocrResults = getOcr(img,"ch");

 


toast("操作结束")