// 设置服务器地址
const SERVER_URL = "http://192.168.0.119:5000/ocr";

const WIDTH_SCREEN = device.height;   // 目标屏幕宽度
const HEIGHT_SCREEN = device.width; // 目标屏幕高度

// const HEIGHT_SCREEN = device.height;   // 目标屏幕宽度
// const WIDTH_SCREEN = device.width; // 目标屏幕高度

var currentPackage = currentPackage();  // 获取当前应用的包名
var currentActivity = currentActivity();  // 获取当前应用的 Activity 名称

console.log("当前应用包名: " + currentPackage);
// 当前应用包名: com.huawei.android.launcher  // 桌面
// 当前应用包名: com.wemade.mir4global   // 传奇4
console.log("当前应用的 Activity: " + currentActivity);
// 当前应用的 Activity: com.huawei.android.launcher.unihome.UniHomeLauncher  // 桌面
// 当前应用的 Activity: com.epicgames.ue4.GameActivity   // 传奇4

console.log("WIDTH_SCREEN: ",WIDTH_SCREEN);
console.log("HEIGHT_SCREEN: ",HEIGHT_SCREEN);

function captureAndUploadScreen(img) {
    try {
        // 将截图转换为Base64编码的PNG格式
        var imgData = images.toBase64(img, "png");
        // 构造请求的 JSON 数据
        var jsonData = JSON.stringify({ image: imgData });
        
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

function select(ocrResults, targetText) {
    if (!Array.isArray(ocrResults)) {
        console.error("OCR 结果不是数组");
        return null;
    }

    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            if (item.text === targetText) {
                console.log("找到目标文本:", item);
                return item;
            }
            // 检查文本是否包含 "40级"
            if (item.text.includes(targetText)) {
                console.log("找到目标文本:", item);
                return item;
            }
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
        }
    }
    console.log("未找到目标文本");
    return null;
}

function clip(img, box) {
    // 获取裁剪区域的坐标
    var x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    var x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    var y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    var y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    var croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    // 上传裁剪后的图像并获取 OCR 结果
    var ocrResults = captureAndUploadScreen(croppedImage);
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

function main() {
    if (!auto.service) {
        console.log("请开启无障碍服务");
        auto();
    }
    if (!requestScreenCapture(true)) {
        throw new Error("请求屏幕捕获权限失败");
    }

    var img = captureScreen();
    if (!img) {
        console.log("截图失败");
        exit();
    }

    let width_screenshot = img.getWidth();  // 获取截图的宽度
    let height_screenshot = img.getHeight();  // 获取截图的高度

    // console.log("截图宽度:", width_screenshot);
    // console.log("截图高度:", height_screenshot);

    var ocrResults = captureAndUploadScreen(img);
    if (ocrResults) {
        try {
            var reData = JSON.parse(ocrResults);
            var target = select(reData, '信息');
            if (target != null) {
                console.log("开始点击");

                // 计算文本区域的中心点
                let centerX = (target.box[0][0] + target.box[2][0]) / 2;
                let centerY = (target.box[0][1] + target.box[2][1]) / 2;

                // 将坐标从截图转换到设备屏幕坐标
                let x_phone = (centerX / width_screenshot) * WIDTH_SCREEN;
                let y_phone = (centerY / height_screenshot) * HEIGHT_SCREEN;

                console.log(`点击坐标: x=${x_phone}, y=${y_phone}`);

                // 点击坐标
                click(x_phone,y_phone);
                sleep(1000);  // 等待1秒
            } else {
                console.log("未找到目标文本");
            }
        } catch (e) {
            console.error("解析 OCR 结果失败: ", e);
        }
    }
    console.log("点击操作结束");
}

main();
 