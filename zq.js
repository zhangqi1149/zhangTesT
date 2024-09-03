
// // 设置服务器地址
// const SERVER_URL = "http://192.168.0.119:5000/ocr";


// // OCR请求
// function getOcr(img, lang) {
//     try {
//         // 将截图转换为Base64编码的PNG格式
//         var imgData = images.toBase64(img, "png");

//         // 构造请求的 JSON 数据，添加 lang 字段
//         var jsonData = JSON.stringify({
//             image: imgData,
//             lang: lang  ,// 动态设置语言
//             save: true // true   false 
//         });
        
//         // 发送 POST 请求，确保 Content-Type 为 application/json
//         var response = http.postJson(SERVER_URL, jsonData, {
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
        
//         if (response.statusCode == 200) {
//             return JSON.parse(response.body.string());
//         } else {
//             console.error("服务器返回错误：" + response.statusCode);
//         }
//     } catch (e) {
//         console.error("请求失败: ", e);
//     }
//     return null;
// }

// toast("开始请求截图")
// if (!requestScreenCapture(true)) {
//     throw new Error("请求屏幕捕获权限失败");
// }

// toast("截图")
// var img = captureScreen();


// toast("开始请求OCR")
// var ocrResults = getOcr(img,"ch");
// toast("OCR结果",ocrResults)

// click(1122.5,187); 

// console.log("运行结束")