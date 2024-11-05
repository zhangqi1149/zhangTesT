
// function chatWithGPT(prompt) {
//     const apiKey = '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'; // 替换为你的 API 密钥
//     const endpoint = 'https://api.openai.com/v1/chat/completions';

//     const xhr = new XMLHttpRequest();
//     xhr.open('POST', endpoint, true);
//     xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);
//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 const data = JSON.parse(xhr.responseText);
//                 console.log('ChatGPT 的回复:', data.choices[0].message.content);
//             } else {
//                 console.error('Error calling API:', xhr.statusText);
//             }
//         }
//     };

//     const requestBody = JSON.stringify({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }]
//     });

//     xhr.send(requestBody);
// }

// // 使用示例
// chatWithGPT('你好！');

//  不支持
// try {
//     const xhr = new XMLHttpRequest();
//     console.log('XMLHttpRequest is supported');
// } catch (e) {
//     console.log('XMLHttpRequest is not supported');
// }

// function checkCurlSupport() {
//     const curlCommand = 'curl --version'; // 检查 curl 版本

//     exec(curlCommand, (error, stdout, stderr) => {
//         if (error) {
//             console.log('不支持 curl');
//             return;
//         }
//         if (stderr) {
//             console.log('curl 发生错误:', stderr);
//             return;
//         }
//         console.log('curl 版本:', stdout);
//     });
// }

// 调用函数检查 curl 支持
// checkCurlSupport();


/**设置属性
 * 
 * @param {string} key 要设置的属性
 * @param {*} value    要设置的属性值 
 */
function SetProp(key,value) {
    let res = http.get("http://127.0.0.1:8848/setprop?key="+key+"&value="+value);    // 查看文件
    if(res.statusCode != 200){
        toast("请求失败: " + res.statusCode + " " + res.statusMessage);
    }else{
        // console.log(res.body.string())
        console.log(`key :[${key}]   value : ${value}`)
    }
}
 
/**随机生成MAC 并隐藏WIFI信息
 * 
 */
function SetWifi() {
    //  隐藏连接的WIFI详情
    SetProp("wifiservice.wifi.isEmptyInfo","yes")
    //  隐藏周围的WIFI
    SetProp("wifiservice.wifi.isEmptyScanResults","yes")
}




// SetWifi()