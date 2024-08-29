// 设置服务器地址
const SERVER_URL = "http://192.168.0.119:5000/ocr";

// 初始化数据
const WIDTH_SCREEN = device.height;   // 目标屏幕宽度
const HEIGHT_SCREEN = device.width; // 目标屏幕高度



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
    console.log("未找到目标文本",targetText);
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
    console.log("未找到目标文本",targetText);
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


function init(){
    // 权限检查
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
    }

    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }

}

function process(){
    var img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }

    let width_screenshot = img.getWidth();  // 获取截图的宽度
    let height_screenshot = img.getHeight();  // 获取截图的高度

    // console.log("截图宽度: "+width_screenshot)
    // console.log("截图高度: "+height_screenshot)

    var ocrResults = getOcr(img,"ch");
    if (ocrResults) {
        var reData = JSON.parse(ocrResults);
        var Load = select(reData,"Loading")
        if (Load){
            toast(" Load 界面 等待5秒")
            sleep(5000)
            return
        }

        var OUT = select(reData,"服务器连接断开")
        if (OUT){
            reai = selclick(width_screenshot,height_screenshot,reData, '前往登录')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000)
                return
            }
        }

        OUT = select(reData,"重新尝试")
        if (OUT){
            reai = selclick(width_screenshot,height_screenshot,reData, '重新尝试')
            if (reai) {
                console.log("点击重新尝试")
                sleep(5000)
                return
            }
        }

        OUT = select(reData,"错误")
        if (OUT){
            reai = clickTow(width_screenshot,height_screenshot,reData, '确认')
            if (reai) {
                console.log("点击确认")
                sleep(5000)
                return
            }
            reai = clickTow(width_screenshot,height_screenshot,reData, '游戏结束')
            if (reai) {
                console.log("游戏结束")
                sleep(5000)
                return
            }
        }

        //  关闭广告
        reai = select(reData, '今日不')
        if (reai) {
            console.log("点击关闭广告")
            textClick(width_screenshot,height_screenshot,reai,920)
            sleep(3000)
        }
        
        //  剧情跳过
        reai = selclick(width_screenshot,height_screenshot,reData, '器')
        if (reai) {
            console.log("跳过")
            sleep(5000)
            return
        }

        reai = select(width_screenshot,height_screenshot,reData, '开采岩窟花树液')
        if (reai) {
            click(644.5,274.5)
            sleep(5000)
            return
        }

        reai = selclick(width_screenshot,height_screenshot,reData, '漆黑的')
        if (reai) {
            console.log("跳过")
            sleep(5000)
            return
        }

        reai = selclick(width_screenshot,height_screenshot,reData, '京')
        if (reai) {
            console.log("跳过")
            sleep(5000)
            return
        }
        
        // 判断根识别   进入游戏界面以前
        var reai = select(reData, 'REA') 
        if(reai){
            // 进入游戏
            reai = selclick(width_screenshot,height_screenshot,reData, '点击')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000)
                return
            }

            // 加载补丁中
            reai = selclick(width_screenshot,height_screenshot,reData, '加载补丁中')
            if (reai) {
                console.log("加载补丁中 等待5秒")
                sleep(5000)
                return
            }

            reai = select(reData, '资格的证明') 
            if(reai){
                // 进入游戏
                reai = clickTow(width_screenshot,height_screenshot,reData, '登录游戏')
                if (reai) {
                    console.log("登录游戏")
                    sleep(5000)
                }
            } 
        } 

        //  选择角色界面
        var role = select(reData, '删除角色') 
        if(role){
            // 开始游戏
            reai = selclick(width_screenshot,height_screenshot,reData, '开始游戏')
            if (reai) {
                console.log("点击界面进入游戏")
                sleep(5000)
                return
            }
        }

        //  进入到游戏了
        var Card = select(reData,"卡组变更")
        if (Card){
            // // 开始做任务
            // reai = select(reData, '级')
            // // 找到“级”在字符串中的位置
            // let index = reai.text.indexOf('级');
            // if (index !== -1) {
            //     // 获取“级”前面的字符串并去除空格
            //     let numberBeforeLevel = reai.text.slice(0, index).trim();
            //     toast("人物当前等级" + numberBeforeLevel); // 输出 40
            // } else {
            //     console.log("未找到字符 '级'");
            // }

            // if (reai) {
            //     console.log("开始做任务",reai.text)
            //     sleep(5000)
            //     return
            // }

            // 开始游戏
            reai = selclick(width_screenshot,height_screenshot,reData, 'AUTO')
            if (reai) {
                console.log("AUTO")
                sleep(5000)
                return
            }

        }

    }
}


function main() {
    init()
    let currentPkg = currentPackage();
    // 是否在游戏
    if (currentPkg == "com.wemade.mir4global" ){
        toast("目前在游戏")
        process()
    } else {
        toast("目前不在游戏")
        app.launch('com.wemade.mir4global')
        sleep(5000)
    }
    // console.log("点击操作结束");
}

for (let index = 0; index < 1; index++) {
    // main();
}


toast("操作结束")