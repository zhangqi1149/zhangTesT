// 设置服务器地址
const SERVER_URL = "http://192.168.0.119:5000/ocr";
const width_screen = 720;
const height_screen = 1280;


function captureAndUploadScreen(img) {
    // 将截图转换为Base64编码的PNG格式
    var imgData = images.toBase64(img, "png");

    // 打印Base64编码数据的长度
    // console.log("Base64编码数据长度: " + imgData.length);

    // 构造请求的 JSON 数据
    var jsonData = JSON.stringify({ image: imgData });

    // 发送 POST 请求，确保 Content-Type 为 application/json  multipart/form-data
    var response = http.postJson(SERVER_URL, jsonData, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.statusCode == 200) {
        var serverResponse = response.body.string();
        // console.log("服务器返回结果:", serverResponse);
        return serverResponse
    } else {
        console.log("服务器返回错误：" + response.statusCode);
    }
}

function select(ocrResults,targetText){
    // console.log(ocrResults)
    if (!Array.isArray(ocrResults)) {
        console.error("ocrResults 不是数组");
        return null;
    }

    for (let i = 0; i < ocrResults.length; i++) {
        let item = ocrResults[i];
        if (item && item.text !== undefined) {
            // console.log(`第 ${i} 项文本: ${item.text}`);
        } else {
            console.error(`第 ${i} 项缺少 text 属性`, item);
        }

        if (item && item.text === targetText) {
            console.log("找到了:", item);
            return item;
        }
    }
    return null;
}

function clip(img,box){
    // 获取裁剪区域的坐标
    var x_min = Math.min(box[0][0], box[1][0], box[2][0], box[3][0]);
    var x_max = Math.max(box[0][0], box[1][0], box[2][0], box[3][0]);
    var y_min = Math.min(box[0][1], box[1][1], box[2][1], box[3][1]);
    var y_max = Math.max(box[0][1], box[1][1], box[2][1], box[3][1]);

    // 裁剪图像
    var croppedImage = images.clip(img, x_min, y_min, x_max - x_min, y_max - y_min);

    // sleep(2000);  // 等待2秒再执行
    var ocrResults = captureAndUploadScreen(croppedImage);
    console.log(ocrResults)
    if (Array.isArray(ocrResults) && ocrResults.length > 0 && ocrResults[0].hasOwnProperty('text')) {
        console.log(`文本: ${ocrResults[0].text}`);
    } else {
        console.log("ocrResults 不包含有效的 text 属性");
    }
}



// 运行主函数
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
    
    console.log("width_screenshot",width_screenshot);
    console.log("height_screenshot",height_screenshot);

    var ocrResults = captureAndUploadScreen(img);

    // 解析成json
    var reData = JSON.parse(ocrResults)
    if (reData) {
        var target = select(reData, '信息');
        if (target != null) {
            console.log("开始点击");
            // clip(img,target.box)
            // 计算文本区域的中心点
            let centerX = (target.box[0][0] + target.box[2][0]) / 2;
            let centerY = (target.box[0][1] + target.box[2][1]) / 2;

            let x_phone = (centerX / width_screenshot) * width_screen;
            let y_phone = (centerY / height_screenshot) * height_screen;

            var a1 = click(x_phone, y_phone);
            console.log("a1点击结果 :",a1)
        }
    }
    console.log("点击结束");
 
}


// [289,493][428,633]



main();


 