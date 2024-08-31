// 设置服务器地址
const SERVER_URL = "http://192.168.0.119:5000/ocr";

// 初始化数据
const WIDTH_SCREEN = device.height;   // 目标屏幕宽度
const HEIGHT_SCREEN = device.width; // 目标屏幕高度


// // 进入到游戏了
// var Card = select(reData,"卡组变更")
// if (Card){
//     // // 开始做任务
//     // reai = select(reData, '级')
//     // // 找到“级”在字符串中的位置
//     // let index = reai.text.indexOf('级');
//     // if (index !== -1) {
//     //     // 获取“级”前面的字符串并去除空格
//     //     let numberBeforeLevel = reai.text.slice(0, index).trim();
//     //     toast("人物当前等级" + numberBeforeLevel); // 输出 40
//     // } else {
//     //     console.log("未找到字符 '级'");
//     // }

//     // if (reai) {
//     //     console.log("开始做任务",reai.text)
//     //     sleep(5000);
//     //     return
//     // }

//     // 开始游戏
//     reai = selclick(width_screenshot,height_screenshot,reData, 'AUTO')
//     if (reai) {
//         console.log("AUTO")
//         sleep(5000);
//         return
//     }

// }

// console.log("WIDTH_SCREEN: ",WIDTH_SCREEN);
// console.log("HEIGHT_SCREEN: ",HEIGHT_SCREEN);

// 发送请求
function getOcr(img, lang) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");

        // 构造请求的 JSON 数据，添加 lang 字段
        var jsonData = JSON.stringify({
            image: imgData,
            lang: lang  // 动态设置语言
        });
        
        // 发送 POST 请求，确保 Content-Type 为 application/json
        var response = http.postJson(SERVER_URL, jsonData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        if (response.statusCode == 200) {
            return response.body.string();
        } else {
            console.error("服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
    }
    return null;
}

// 模糊查找内容
function select(ocrResults, targetText) {
    if (!Array.isArray(ocrResults)) {
        console.error("OCR 结果不是数组");
        return null;
    }

    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            // if (item.text === targetText) {
            //     console.log("找到目标文本:", item.text);
            //     return item;
            // }
            // 检查文本是否包含 "40级"
            if (item.text.includes(targetText)) {
                console.log("模糊查找目标文本:", item.text);
                return item;
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
        }
    }
    // console.log("未找到目标文本",targetText);
    return null;
}

// 精准查找内容
function selectTow(ocrResults, targetText) {
    if (!Array.isArray(ocrResults)) {
        console.error("OCR 结果不是数组");
        return null;
    }
    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            if (item.text === targetText) {
                console.log("找到目标文本:", item.text);
                return item;
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
        }
    }
    // console.log("未找到目标文本",targetText);
    return null;
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
    var ocrResults = getOcr(croppedImage);
    console.log("OCR 结果:", ocrResults);

    if (ocrResults) {
        try {
            var parsedResults = JSON.parse(ocrResults);
            if (Array.isArray(parsedResults) && parsedResults.length > 0 && parsedResults[0].hasOwnProperty('text')) {
                console.log(`裁剪图像中的文本: ${parsedResults[0].text}`);
            } else {
                console.log("裁剪图像的 OCR 结果不包含有效的 text 属性");
            }
        } catch (e) {
            console.error("解析 OCR 结果失败: ", e);
        }
    }
}

// 图片处理
function preprocessImage(img) {
    // 1. 灰度处理
    var grayscaleImage = images.grayscale(img);

    // 2. 二值化处理
    var binaryImage = images.threshold(grayscaleImage, 128, 255, "BINARY");

    // 3. 去除噪声（可以选择性使用，如果没有高斯模糊则跳过）
    // var denoisedImage = images.gaussianBlur(binaryImage, 2); 

    // 返回预处理后的图像
    return binaryImage;
}

//  点击文本中间
function textClick(width_screenshot,height_screenshot,target,num){
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
function selclick(width_screenshot,height_screenshot,reData,src){
    var target = select(reData, src)
    if(target != null){
        // 存在 点击
        console.log("开始点击",src);

        // 计算文本区域的中心点
        let centerX = (target.box[0][0] + target.box[2][0]) / 2;
        let centerY = (target.box[0][1] + target.box[2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        let x_phone = (centerX / width_screenshot) * WIDTH_SCREEN;
        let y_phone = (centerY / height_screenshot) * HEIGHT_SCREEN;

        console.log(`点击坐标: x=${x_phone}, y=${y_phone}`);

        // 点击坐标
        click(x_phone,y_phone);

        return true
    }else{
        return false
    }
}

// 查找文本并点击
function clickTow(width_screenshot,height_screenshot,reData,src){
    var target = selectTow(reData, src)
    if(target != null){
        // 存在 点击
        console.log("开始点击",src);

        // 计算文本区域的中心点
        let centerX = (target.box[0][0] + target.box[2][0]) / 2;
        let centerY = (target.box[0][1] + target.box[2][1]) / 2;

        // 将坐标从截图转换到设备屏幕坐标
        let x_phone = (centerX / width_screenshot) * WIDTH_SCREEN;
        let y_phone = (centerY / height_screenshot) * HEIGHT_SCREEN;

        console.log(`点击坐标: x=${x_phone}, y=${y_phone}`);

        // 点击坐标
        click(x_phone,y_phone);

        return true
    }else{
        return false
    }
}

//  执行任务
function process(){
    // 截图
    var img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }

    // var qst = images.pixel(img, 1233, 188); 
    // if (qst >= -6766849) {
    //     // 没有做任务 点击让他去做任务
    //     toast(" 避免了问题:" + qst)
    //     sleep(1000);
    //     return
    // } 

    let width_screenshot = img.getWidth();  // 获取截图的宽度
    let height_screenshot = img.getHeight();  // 获取截图的高度

    var ocrResults = getOcr(img,"ch");
    if (ocrResults) {
        var reData = JSON.parse(ocrResults);

        //  剧情的开端
        var OUT = select(reData,"请拖拽虚拟摇杆进行移动")
        if (OUT){
            // 422.0, 425.0
            swipe(232, 455, 232, 200, 3000); 
            sleep(4000);
            return
        }

        var Load = select(reData,"Loading")
        if (Load){
            toast(" Load 界面 等待5秒")
            sleep(5000);
            return
        }
        
        // 活力补充
        OUT = select(reData,"活力补充")
        if (OUT){
            click(950,164)
            return
        }

        // // 使用轻功
        // OUT = select(reData,"来，尝试进行1段")
        // if (OUT){
        //     click(1225,438);
        //     sleep(1000);
        //     click(1225,438);
        //     return
        // }

        // OUT = select(reData,"飞行术")
        // if (OUT){
        //     click(1063,429);
        //     sleep(3000);
        //     click(1225,438);
        //     sleep(1000);
        //     click(1063,429);
        //     return
        // }




        OUT = select(reData,"服务器连接断开")
        if (OUT){
            reai = selclick(width_screenshot,height_screenshot,reData, '前往登录')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000);
                return
            }
        }

        OUT = select(reData,"重新尝试")
        if (OUT){
            reai = selclick(width_screenshot,height_screenshot,reData, '重新尝试')
            if (reai) {
                console.log("点击重新尝试")
                sleep(5000);
                return
            }
        }

        OUT = select(reData,"说明")
        if (OUT){
            reai = selclick(width_screenshot,height_screenshot,reData, '确认')
            if (reai) {
                sleep(5000);
                return
            }
        }


        OUT = select(reData,"错误")
        if (OUT){
            reai = clickTow(width_screenshot,height_screenshot,reData, '确认')
            if (reai) {
                console.log("点击确认")
                sleep(5000);
                return
            }
            reai = clickTow(width_screenshot,height_screenshot,reData, '游戏结束')
            if (reai) {
                console.log("游戏结束")
                sleep(5000);
                return
            }
        }

        //  关闭广告
        reai = select(reData, '今日不')
        if (reai) {
            console.log("点击关闭广告")
            textClick(width_screenshot,height_screenshot,reai,920)
            sleep(3000);
            return
        }

        //  选择角色界面
        var role = select(reData, '删除角色') 
        if(role){
            // 开始游戏
            reai = selclick(width_screenshot,height_screenshot,reData, '开始游戏')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000);
                return
            }
        }

        reai = selclick(width_screenshot,height_screenshot,reData, '跳过')
        if (reai) {
            sleep(4000);
            return
        }

        // 使用轻功
        OUT = select(reData,"1段跳跃")
        if (OUT){
            click(1221,400)
            return
        }

        OUT = select(reData,"瞬间快速地")
        if (OUT){
            toast("弹力轻功")
            click(1060,531)
            click(1204,400)
            sleep(3000);
            return
        }

        // 使用轻功
        OUT = select(reData,"点击轻功")
        if (OUT){
            click(1221,400)
            return
        }

        // 使用轻功
        OUT = select(reData,"试试轻功吧")
        if (OUT){
            click(1221,400)
            sleep(2000);
            click(1221,400)
            return
        }

        reai = select(reData, '伪像切换')
        if (reai) {
            toast("伪像切换")
            click(1230,29)
            sleep(2000);
            return
        }
        reai = select(reData, '闭关修炼')
        if (reai) {
            toast("闭关修炼")
            click(1230,29)
            sleep(2000);
            return
        }

        reai = select(reData, '龙神器')
        if (reai) {
            toast("龙神器")
            click(1230,29)
            sleep(2000);
            return
        }

        
        reai = select(reData, '特殊强化')
        if (reai) {
            toast("特殊强化")
            click(1230,29)
            sleep(2000);
            return
        }


        // 再遭绑架的芊菲
        reai = select(reData,"绑架的背后")
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '与禹玄')
            if (reai) {
                sleep(3000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(5000);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            // 制伏

            reai = selclick(width_screenshot,height_screenshot,reData, '寻找鲁云')
            if (reai) {
                sleep(33000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与陈生')
            if (reai) {
                sleep(4000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }

            reai = select(reData, '银杏谷采')
            if (reai) {
                click(326,638);
                sleep(79000);
                sleep(79000);
                sleep(79000);
                click(326,638);
                selclick(width_screenshot,height_screenshot,reData, '银杏谷采')
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往陈')
            if (reai) {
                sleep(12000);
                selclick(width_screenshot,height_screenshot,reData, '前往陈')
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '品质2武器')
            if (reai) {
                sleep(3000);
                click(1125,676);
                sleep(3000);

                //  穿戴
                click(723,600)
                sleep(3000);

                click(1230,29);
                sleep(1000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往比奇城后')
            if (reai) {
                sleep(97000);
                return
            }

            
            reai = selclick(width_screenshot,height_screenshot,reData, '刺客')
            if (reai) {
                sleep(7000);
                return
            }
            
            reai = selclick(width_screenshot,height_screenshot,reData, '与禹真')
            if (reai) {
                sleep(7000);
                selclick(width_screenshot,height_screenshot,reData, '与禹真')
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '跟踪龙骨')
            if (reai) {
                sleep(23000);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }
            
        }
 

        // 再遭绑架的芊菲
        reai = select(reData,"再遭绑架")
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '击败城墙')
            if (reai) {
                sleep(24000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往城墙内')
            if (reai) {
                sleep(17000)
                return
            }

            // 阻断援军

            reai = selclick(width_screenshot,height_screenshot,reData, '前往剑')
            if (reai) {
                sleep(7000)
                return
            }

            // 与孙德一

            reai = selclick(width_screenshot,height_screenshot,reData, '与师父')
            if (reai) {
                sleep(3000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

        }

        // 比奇城风云
        reai = select(reData,"比奇城风")
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '移动至龙会楼入')
            if (reai) {
                sleep(4000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '进入龙')
            if (reai) {
                sleep(4000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往禹')
            if (reai) {
                sleep(5000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '移动至龙会楼上')
            if (reai) {
                sleep(7000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '5.与师父')
            if (reai) {
                sleep(2000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '离开龙会楼')
            if (reai) {
                sleep(13000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '返回至龙会楼')
            if (reai) {
                sleep(33000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '寻得金')
            if (reai) {
                sleep(5000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '转交金疮')
            if (reai) {
                sleep(4000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '确认后巷')
            if (reai) {
                sleep(28000)
                return
            }

            //  阻挡孙德

            reai = selclick(width_screenshot,height_screenshot,reData, '前往剑啸大')
            if (reai) {
                sleep(6700)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往比奇城后巷')
            if (reai) {
                sleep(13000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '接近可疑')
            if (reai) {
                sleep(5000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '铲除')
            if (reai) {
                sleep(90000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与可疑之人对话')
            if (reai) {
                sleep(5000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '追赶剑')
            if (reai) {
                sleep(25000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与可疑之人交易')
            if (reai) {
                sleep(4000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(2000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '铲除邪派')
            if (reai) {
                sleep(34000)
                return
            }

            //  制服赵
            reai = selclick(width_screenshot,height_screenshot,reData, '找赵奎理论')
            if (reai) {
                sleep(20000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '28.与京一师弟')
            if (reai) {
                sleep(4000);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '29.与京一师弟')
            if (reai) {
                sleep(4000);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '20.与京一师弟')
            if (reai) {
                sleep(8000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '21.强化装备')
            if (reai) {
                sleep(4000);
                click(809,190);
                sleep(2000);

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

                click(1100,667);
                sleep(3000);
                click(1100,667);
                sleep(2000);

                //  确认点击
                click(610,383);
                sleep(1000);
                click(732,472);
                sleep(2000);

                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '领取金疮')
            if (reai) {
                sleep(20000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '从居民处')
            if (reai) {
                sleep(5000)
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }


        }

        // 逃离银杏谷
        reai = select(reData,"逃离银杏谷")
        if(reai){
            reai = selclick(width_screenshot,height_screenshot,reData, '1.离开')
            if (reai) {
                sleep(22000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '2.侦察周围')
            if (reai) {
                sleep(25000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '4.与')
            if (reai) {
                sleep(5000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '5.与芊')
            if (reai) {
                sleep(18000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '6.护卫')
            if (reai) {
                sleep(88000);
                return
            }

            // reai = selclick(width_screenshot,height_screenshot,reData, '7.击')
            // if (reai) {
            //     sleep(48000);
            //     return
            // }

            // reai = selclick(width_screenshot,height_screenshot,reData, '8.护卫')
            // if (reai) {
            //     sleep(8000);
            //     return
            // }

            reai = selclick(width_screenshot,height_screenshot,reData, '与师父对话')
            if (reai) {
                sleep(4000);

                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                click(223 , 560) ;
                sleep(50);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往比奇')
            if (reai) {
                sleep(8000);
                return
            }


        }

        // 寻求灵药
        reai = select(reData,"寻求灵药")
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '8.制')
            if (reai) {
                sleep(3000);

                click(1125,676);
                sleep(3000);

                //  穿戴
                click(723,600)
                sleep(3000);

                // 点击武器 制作武器
                click(149,81);
                sleep(2000);

                click(575,300);
                sleep(1000);

                click(1125,676);
                sleep(3000);

                //  穿戴
                click(723,600)

                click(1230,29);
                sleep(1000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '9.离')
            if (reai) {
                sleep(18000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '再次调查')
            if (reai) {
                sleep(18000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '摧毁')
            if (reai) {
                sleep(10000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '11.收')
            if (reai) {
                sleep(35000);
                return
            }

            //  这个不可以自动
            reai = selclick(width_screenshot,height_screenshot,reData, '22.带')
            if (reai) {
                swipe(208, 543, 208, 400, 5000); 
                selclick(width_screenshot,height_screenshot,reData, '22.带')
                sleep(7000);
                return
            }
            
            
            reai = selclick(width_screenshot,height_screenshot,reData, '21.获')
            if (reai) {
                sleep(20000);

                click(326,638);
                sleep(4000)
                click(326,638);

                return
            }
            
            reai = selclick(width_screenshot,height_screenshot,reData, '26.将')
            if (reai) {
                sleep(20000);
                return
            }

            
            reai = selclick(width_screenshot,height_screenshot,reData, '24.与红')
            if (reai) {
                sleep(28000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '25.前往')
            if (reai) {
                sleep(28000);
                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '20.确')
            if (reai) {
                sleep(10000);
                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '19.击')
            if (reai) {
                sleep(47000);
                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '18.寻')
            if (reai) {
                sleep(17000);
                click(223 , 560);
                sleep(500);
                click(223 , 560);
                sleep(2500);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '寻找千年果')
            if (reai) {
                sleep(17000);
                click(223 , 560);
                sleep(500);
                click(223 , 560);
                sleep(1500);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '15.帮')
            if (reai) {
                sleep(17000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '14.击')
            if (reai) {
                sleep(41000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '13.寻')
            if (reai) {
                sleep(18000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '12.将')
            if (reai) {
                sleep(7000);
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '10.与')
            if (reai) {
                sleep(42000);
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '7.与京')
            if (reai) {
                sleep(8000);
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '1.与师父')
            if (reai) {
                sleep(2000);
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '4.与师父')
            if (reai) {
                sleep(19000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '3.采')
            if (reai) {
                sleep(3000);
                click(326,638);
                sleep(8000)
                click(326,638);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '6.修炼')
            if (reai) {
                sleep(3000);
                img = captureScreen();
                ocrResults = getOcr(img,"ch");
                reData = JSON.parse(ocrResults);
                if(reData){
                    reai = selclick(width_screenshot,height_screenshot,reData, '修炼秘籍')
                    sleep(4000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;
                    click(1070,669)
                    sleep(2000) ;

                    click(1070,221)
                    sleep(2000) ;

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

            reai = selclick(width_screenshot,height_screenshot,reData, '下至')
            if (reai) {
                sleep(4000);
                click(1250, 195) ;
                sleep(500)
                return
            }
            
        }

        // 芊菲的下落
        reai = select(reData, '芊菲的下落')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '击败半兽人哨')
            if (reai) {
                sleep(55000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '4.与师父')
            if (reai) {
                sleep(4000);
                click(223 , 560) ;
                sleep(500)
                click(223 , 560);
                sleep(500)
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '11.与')
            if (reai) {
                sleep(3000);
                click(223 , 560);
                sleep(500)
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                click(223 , 560) ;
                return
            }
 
            reai = selclick(width_screenshot,height_screenshot,reData, '7.与师')
            if (reai) {
                sleep(9000)
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                sleep(500)
                click(223 , 560);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '击败废墟村入口')
            if (reai) {
                sleep(18000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '查看内')
            if (reai) {
                sleep(58000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '逃出废墟')
            if (reai) {
                sleep(32000)
                return
            }

            
            reai = selclick(width_screenshot,height_screenshot,reData, '15.前往虫洞')
            if (reai) {
                sleep(4000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往虫洞')
            if (reai) {
                sleep(32000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '8.击败突击')
            if (reai) {
                sleep(32000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '击败半兽人搜')
            if (reai) {
                sleep(63000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '1.与')
            if (reai) {
                sleep(7000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '3.')
            if (reai) {
                sleep(7000)
                return
            }



        }

        // 黑暗之影
        reai = select(reData, '黑暗之影')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '收集食人')
            if (reai) {
                sleep(22000)
                return
            }

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
                sleep(8500)
                click(326,638);
                sleep(8000)
                click(326,638);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '收集熊胆')
            if (reai) {
                sleep(23000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '返回红药')
            if (reai) {
                sleep(35000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '击退污染的')
            if (reai) {
                sleep(45000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往寻找')
            if (reai) {
                sleep(8500)
                return
            }

            // TODO 这里开启了重复任务
            reai = selclick(width_screenshot,height_screenshot,reData, '与孔大夫')
            if (reai) {
                sleep(4000);
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与陈生对')
            if (reai) {
                sleep(4000);
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                sleep(500)
                click(223 , 560) ;
                sleep(3000);
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往师父所在')
            if (reai) {
                sleep(4500)
                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '前往狗熊栖息地')
            if (reai) {
                sleep(8000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '击败')
            if (reai) {
                sleep(15000)
                return
            }
            reai = selclick(width_screenshot,height_screenshot,reData, '前往银')
            if (reai) {
                sleep(13000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与京一师弟')
            if (reai) {
                sleep(2000);
                click(223 , 560) ;
                sleep(50)
                click(223 , 560) ;
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '拜见师父')
            if (reai) {
                sleep(4000);
                click(223 , 560) ;
                sleep(50)
                click(223 , 560) ;
                sleep(50)
                click(223 , 560) ;
                sleep(50)
                click(223 , 560) ;
                sleep(50)
                click(223 , 560) ;
                return
            }
    
            reai = selclick(width_screenshot,height_screenshot,reData, '与红药')
            if (reai) {
                sleep(5000);
                click(223 , 560) ;
                sleep(50)
                click(223 , 560) ;
                sleep(2000);
                return
            }

        }

        // 追踪痕迹
        reai = select(reData, '追踪痕迹')
        if (reai) {

            reai = selclick(width_screenshot,height_screenshot,reData, '寻得蛊')
            if (reai) {
                sleep(2000);
                click(326,638);
                sleep(3000);
                click(326,638);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '强化技能')
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
        
                    reai = selclick(width_screenshot,height_screenshot,reData, '饿鬼')
                    if (reai) {
                        sleep(3000);
                        reai = selclick(width_screenshot,height_screenshot,reData, '强化')
                        if (reai) {
                            sleep(4000);
                            click(1230,25)
                            return
                        }
                    }
                }
                return
            }

            
            reai = selclick(width_screenshot,height_screenshot,reData, '击败')
            if (reai) {
                sleep(15000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '离开桃花')
            if (reai) {
                sleep(5000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往师父')
            if (reai) {
                sleep(5000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往银')
            if (reai) {
                sleep(3000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与师父对话')
            if (reai) {
                sleep(2000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与精灵对话')
            if (reai) {
                sleep(2000);
                return
            }
   
            reai = selclick(width_screenshot,height_screenshot,reData, '寻找芊')
            if (reai) {
                sleep(5000);
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                sleep(500)
                click(1250, 195) ;
                return
            }
 
        }

        // 燃烧的桃花谷
        reai = select(reData, '燃烧的')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '寻找')
            if (reai) {
                sleep(4000);
                return
            }
            reai = selclick(width_screenshot,height_screenshot,reData, '师父对话')
            if (reai) {
                sleep(2000);
                return
            }
        }
        
        // 岁月静好
        reai = select(reData, '岁月静好')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '前往师父')
            if (reai) {
                sleep(2000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '击败半')
            if (reai) {
                sleep(16000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往更深')
            if (reai) {
                sleep(7000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往芊')
            if (reai) {
                sleep(7000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往声')
            if (reai) {
                sleep(7000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与京一师弟对话')
            if (reai) {
                sleep(5000);
                return
            }
        }

        //  武功修炼
        reai = select(reData, '武功修炼')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '与师父对话')
            if (reai) {
                sleep(2000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '摧毁木')
            if (reai) {
                sleep(6000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '前往木')
            if (reai) {
                sleep(4000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '深入修炼')
            if (reai) {
                sleep(6000)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '击败蛤蟆')
            if (reai) {
                sleep(15000)
                return
            }


            reai = selclick(width_screenshot,height_screenshot,reData, '师弟对话')
            if (reai) {
                sleep(4000);
                return
            }
      
        }

        // 危险的救援计划
        reai = select(reData, '危险的救')
        if (reai) {
            reai = select(reData, '前往狭窄的')
            if (reai) {
                sleep(1000);
                //  滑动
                swipe(232, 455, 0, 455, 8000);    //200 536
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '离开监牢')
            if (reai) {
                sleep(4000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '与芊')
            if (reai) {
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '开启牢门')
            if (reai) {
                sleep(5000);
                click(644.5,274.5)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '救出芊')
            if (reai) {
                sleep(5000);
                click(644.5,274.5)
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '寻找特殊')
            if (reai) {
                sleep(5000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '跟着剑')
            if (reai) {
                sleep(5000);
                return
            }
            reai = selclick(width_screenshot,height_screenshot,reData, '前往地牢内部')
            if (reai) {
                sleep(5000);
                return
            }
            reai = selclick(width_screenshot,height_screenshot,reData, '前往内部')
            if (reai) {
                sleep(5000);
                return
            }

            reai = selclick(width_screenshot,height_screenshot,reData, '剑啸大师兄对话')
            if (reai) {
                sleep(8000)
                return
            }
        }

        // 漆黑的密道
        reai = select(reData, '漆黑的')
        if (reai) {
            reai = selclick(width_screenshot,height_screenshot,reData, '开采岩窟花树液')
            if (reai) {
                sleep(5000);
                click(644.5,274.5)
                return
            }
      
            reai = selclick(width_screenshot,height_screenshot,reData, '前往')
            if (reai) {
                sleep(9000)
                return
            }
            reai = selclick(width_screenshot,height_screenshot,reData, '师弟对话')
            if (reai) {
                sleep(5000);
                return
            }
            reai = selclick(width_screenshot,height_screenshot,reData, '对话')
            if (reai) {
                sleep(5000);
                return
            }
        }

        reai = selclick(width_screenshot,height_screenshot,reData, '京')
        if (reai) {
            console.log("跳过")
            sleep(5000);
            return
        }
        
        // 判断根识别   进入游戏界面以前
        var reai = select(reData, 'REA') 
        if(reai){
            // 进入游戏
            reai = selclick(width_screenshot,height_screenshot,reData, '点击')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000);
                return
            }

            // 加载补丁中
            reai = selclick(width_screenshot,height_screenshot,reData, '加载补丁中')
            if (reai) {
                console.log("加载补丁中 等待5秒")
                sleep(5000);
                return
            }

            reai = select(reData, '资格的证明') 
            if(reai){
                // 进入游戏
                reai = clickTow(width_screenshot,height_screenshot,reData, '登录游戏')
                if (reai) {
                    console.log("登录游戏")
                    sleep(5000);
                }
            } 
        } 

        // //  剧情跳过
        // reai = selclick(width_screenshot,height_screenshot,reData, '器')
        // if (reai) {
        //     sleep(2000);
        //     return
        // }
    }
}


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

for (let index = 0; index < 400 ; index++) {
    // 初始化
    if (init()) {
        process()
    }
}


// var img = captureScreen();
// var ocrResults = getOcr(img,"ch");

 


toast("操作结束")