// 设置服务器地址
var SERVER_URL = "http://192.168.0.119:5000/ocr";

var Shout = "加我QQ 有好东西"

var  Save = false  // true   false 

var width_screenshot = 1285
var height_screenshot = 720

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
            console.error("服务器返回错误：" + response.statusCode);
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
            console.error("服务器返回错误：" + response.statusCode);
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
            console.error("服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        toast("请求失败: ",e)
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
    var OUT = select(reData,"服务器连接断开") // TODO这里有bug
    if (OUT){
        reai = selclick(reData, '前往登录')
        if (reai) {
            console.log("点击界面进入游戏")
            sleep(5000);
            return true
        }
        // click(642,460)   // 另外发方法
        // sleep(8000)
        // return true
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
        return true
    }
    return false
}

function Loong(reData){
    var long = select(reData,"小青龙浩")



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
        click(223 , 560) ;
        sleep(50);
        sleep(1200);
        return
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
        click(950,164)
        return true
    }

    reai = select(reData,"角色")
    if (reai) {
        click(1196,52)
    }


    return false
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

    // var point = images.findColor(img, -13553096, {threshold: 0, region: [522, 41, 6, 3]});
    // if (point) {
    //     sleep(3000)
    //     console.log("在打怪了")
    //     return
    // }

    // 定义裁剪区域，保留上半部分
    // var clipRegion = [0, 0, width_screenshot, height_screenshot - 30];

    // 裁剪图像
    // var croppedImg = images.clip(img, clipRegion[0], clipRegion[1], clipRegion[2], clipRegion[3]);  // 
    var attImg = images.clip(img, 522,41,6,3);  // 裁剪图像打怪的
    //  是否是在打怪
    var clors = getCl(attImg,1,2)

    // 是否在自动寻路
    // var qust = clip(img, [[571.0, 507.0], [633.0, 507.0], [571.0, 529.0], [633.0, 529.0]])
    var imgtext = clip2(img,[[1180 ,145],[1263 ,145],[1263 ,148 ],[1180 ,148]])

    var code = isblue(imgtext)
    imgtext.recycle();
    imgtext = null;
    // console.log("截完图了")

    // var grayscaleImage = images.grayscale(img);  // 灰度处理
    // var binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");     // 二级化

    // 获取OCR
    var reData = getOcr(img,"ch");
    img.recycle(); // 手动释放内存
    img = null;
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
        } 
        
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
            // console.log("点击界面进入游戏") // 粗暴的处理
            // click(1125,660)
            // sleep(5000);
            // return
        }
        
        var Load = select(reData,"Loading")
        if (Load){
            toast(" Load 界面 等待5秒")
            sleep(5000);
            return
        }

        if (wrong(reData)) {return }

        if (closeX(reData)) {return }


        Load = select(reData, '小青龙浩')
        if (Load) {
            Load = select(reData, '同伴就在附近')
            if (Load) {
                Load = selclick(reData, '前往京一')
                if (Load) {
                    sleep(2000);
                    return
                }
            } 
            Load = select(reData, '点击头顶的标记')
            if (Load) {
                Load = selclick(reData, '与京一')
                if (Load) {
                    sleep(30);
                    click(223 , 560) ;
                    sleep(30);
                    click(223 , 560) ;
                    sleep(30);
                    click(223 , 560) ;
                    sleep(1000);
                    return
                }
            } 

            // 使用轻功
            var OUT = select(reData,"看到轻功按键了吗")  // 1段跳跃
            if (OUT){
                click(1221,400)
                return 
            }
            OUT = select(reData,"触发2段跳跃")  // 1段跳跃
            if (OUT){
                click(1221,400);
                return 
            }
            OUT = select(reData,"还要再跳一次")  // 跳跃2次
            if (OUT){
                click(1221,400);
                sleep(2000);
                click(1221,400);
                sleep(1000);
                return true
            }
            //  弹力轻功
            OUT = select(reData,"对墙壁点击")
            if (OUT){
                click(1221,400);
                sleep(2000);
                return 
            }

            OUT = select(reData,"瞬间快速地")
            if (OUT){
                click(1060,531);
                click(1204,400);
                sleep(3000);
                return
            }

            //  滑动
            OUT = select(reData,"请拖拽虚拟摇杆进行移动")
            if (OUT){
                reai = select(reData, '前往狭窄的')
                if (reai) {
                    //  滑动
                    swipe(232, 455, 0, 455, 7000);    
                    sleep(1000)
                    return
                }
            }
            OUT = select(reData,"紧贴墙壁")
            if (OUT){
                reai = select(reData, '前往狭窄的')
                if (reai) {
                    //  滑动
                    swipe(232, 455, 0, 455, 7000);    
                    sleep(2000)
                    return
                }
            }

            //  设置药剂 和 技能频率
            OUT = selclick(reData,"上下")
            if (OUT){
                sleep(3000);
                return
            }

            //  设置药剂 和 技能频率
            OUT = select(reData,"设置各种自动选项")
            if (OUT){
                click(671,660);
                sleep(2000);
                click(1195,595);  // 技能释放频率
                sleep(1000)
                click(1195,595);  // 技能释放频率
                click(1195,595);  // 技能释放频率
                click(1195,595);  // 技能释放频率
                click(1195,441);  // 战斗自动锁定
                click(1195,367);  // 复活时自动返回
                click(1195,297);  // 队伍共享目标
                click(671,660);  // 结束 说明弹窗
                click(1195,224);  // 围绕队长战斗
                click(671,660);  // 结束 说明弹窗
                return
            }

            // 精灵
            OUT = selclick(reData,"最佳帅气帮手")
            if (OUT){
                sleep(1000)
            }
            // 强化
            OUT = select(reData,"强化的方法")
            if (OUT){
                selclick(reData, '跳过')
                sleep(1000)
                return
            }

            OUT = select(reData,"需要新的武器")
            if (OUT){
                click(1221,400);
                sleep(2000);
            }

            // return
        }else{
            // Load = select(reData, '设置窗口')
            // if (Load) {
            //     Load = selclick(reData, '跳过')
            //     sleep(1200);
            //     return
            // }
            // Load = select(reData, '岁月静好')
            // if (!Load) {
            //     Load = selclick(reData, '《器')
            //     if (Load) {
            //         sleep(1000);
            //         return
            //     }
            // } 
        }

        Load = select(reData, '请点击全部菜单')
        if (Load) {
            click(1228,28);
            sleep(2000)
            return
        }

        OUT = select(reData,"前往狭窄的通道")
        if (!OUT) {
            OUT = select(reData,"请拖拽虚拟摇杆进行移动")
            if (OUT){
                swipe(232, 455, 232, 200, 3000); 
                return
            }
        }

        if (clors.hex == '#2e2f34') {
            console.log("在打怪");
            sleep(2000);
            return 
        }    

        // if (imgtext) { // && qust
        if (code ) {
            // console.log(" 我在自动做任务 ",code);
            sleep(3000);
        }else{
            // 加入限定的条件 
            reai = select(reData,"和平")
            reai2 = select(reData,"级")
            reai3 = select(reData,"近距")
            reai4 = select(reData,"标记")
            if (reai||reai2||reai3||reai4) {
                console.log(" . ");
                code = click(1122.5,187);    
                sleep(1000)
                // toast(code)
            }
        } 

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
                reai = selclick(reData, '必杀')
                sleep(1000)
                return
            }

            // reai = selclick(reData, '跳过') // 跳过了设置药剂 和 技能频率
            // if (reai) {
            //     sleep(1200)
            //     return
            // }
        }

        // 岁月静好
        reai = select(reData, '岁月静好')
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
                    sleep(2000);

                    click(575,300); // 点击武器
                    sleep(2000);

                    click(575,300); // 点击武器
                    sleep(1000);

                    click(575,300); // 点击武器
                    sleep(1000);

                    click(575,300); // 制作
                    sleep(3000);
    
                    click(723,600) //  穿戴
    
                    click(1230,29); // 关闭窗口
                    sleep(1200)
                }
            }

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

            reai = select(reData,'强化技能')
            if (reai) {
                selclick(reData, '跳过')
                sleep(1000)
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

        // 黑暗之影   活力  委托
        reai = select(reData, '黑暗之影')
        if (reai) {
            reai = select(reData, '请点击全')
            if (reai) {
                selclick(reData, '跳过')
            }
            reai = select(reData, '请点击按')
            if (reai) {
                selclick(reData, '跳过')
            }
            reai = select(reData, '请点击活')  // TODO 这里要加一颗
            if (reai) {
                click(168,100) // 点击活力
                sleep(2000)
                click(402,533)
                sleep(500)
                click(402,533)
                sleep(500)
                click(402,533) // 补充
                sleep(2000)
                click(725,536)
                sleep(500)
                click(725,536)
                sleep(500)
                click(725,536) // 点击使用
            }

            reai = selclick(reData, '强化体质')
            if (reai) {
                sleep(2000);
                for (let index = 0; index < 7; index++) {
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
                    // 魔力
                    if (index == 6) {
                        click(1111,221)
                    }
                    sleep(1500)
                    click(1040,672)
                    sleep(3000);
                }
                click(1230,25) // 关闭
                return
            }

            reai = select(reData, '采集森')
            if (reai) {
                sleep(5000)
                click(326,638);
                sleep(8000)
                click(326,638);
                return
            }
            return
        }
        
        // 芊菲的下落
        reai = select(reData, '芊菲的下落')
        if (reai) {
            selclick(reData, '跳过')
            sleep(1200)
            return
        }

        // 寻求灵药
        reai = select(reData,"寻求灵药")
        if (reai) {
            reai = selclick(reData, '8.制')
            if (reai) {
                sleep(4000);

                click(1125,676);
                sleep(3000);

                //  穿戴
                click(723,600)
                sleep(3000);

                // // 点击武器 制作武器
                // click(149,81);
                // sleep(2000);

                // click(575,300);
                // sleep(1000);

                // click(1125,676);
                // sleep(3000);

                // //  穿戴
                // click(723,600)

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
                sleep(3000);
                img = captureScreen();
                ocrResults = getOcr(img,"ch");
                img.recycle(); // 手动释放内存
                img = null;
                if(ocrResults){
                    reai = selclick(ocrResults, '修炼秘籍')
                    sleep(4000) ;
                    click(1070,669)
                    sleep(4000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;

                    click(1070,221)
                    sleep(3000) ;

                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;

                    //  脉天
                    click(1070,279)
                    sleep(2000) ;

                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;

                    // 关闭
                    click(1230,29);
                    sleep(2000) ;
                }
                return
            }
        }

        // 比奇城风云
        reai = select(reData,"比奇城风")
        if (reai) {
            reai = select(reData, '请点击全部')
            if (reai) {
                reai = selclick(reData, '跳过')
                sleep(600)
            }
            reai = selclick(reData, '21.强化装备')
            if (reai) {
                // 强化
                click(1100,667);
                sleep(3000);
                click(1100,667);
                sleep(2000);

                click(1100,667);
                sleep(3000);
                click(1100,667);
                sleep(2000);

                //  确认点击
                click(610,383);
                sleep(1000);
                click(732,472);
                sleep(2000);

                // click(1100,667);
                // sleep(3000);
                // click(1100,667);
                // sleep(2000);

                // //  确认点击
                // click(610,383);
                // sleep(1000);
                // click(732,472);
                // sleep(2000);
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
            // reai = selclick(reData, '4.')
            // if (reai) {
            //     sleep(6000)
            // }
            // reai = selclick(reData, '5.')
            // if (reai) {
            //     sleep(6000)
            // }
            // reai = selclick(reData, '9.')
            // if (reai) {
            //     sleep(6000)
            // }

            return
        }

        // 绑架的背后
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
}

// 主函数
function main(){
    // 初始化
    if (init()) {
        upLevel()
    }
}

toast("开始执行!")
// for (let index = 0; index < 3; index++) {
    // main()
// }


// console.log("开始请求截图")
if (!requestScreenCapture(true)) {
    throw new Error("请求屏幕捕获权限失败");
}

// console.log("截图")
var img = captureScreen();
// console.log("开始请求")
var ocrResults = getOcr(img,"ch");
// console.log("结果")

 
// ocrResults = getOcr(img,"ch");
// img.recycle(); // 手动释放内存


// var imgtext = clip2(img,[[1180 ,150],[1243 ,150],[1243 ,191 ],[1180 ,191]])

// console.log(isblue(imgtext))

toast("操作结束")