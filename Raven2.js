 
let Log = true
let text = "全球最低金币 PlayPal担保交易。欢迎来到 igokay.com  。 The lowest price gold transactions in the world. Use PlayPal guaranteed payment. Welcome to igokay.com." ;
let interval = 3*1000*60 ;    // 12分钟 720000毫秒  *60000
let today = new Date().toISOString().split('T')[0]; 
let storage = storages.create("ABC");

//  检查当前界面是否是游戏 com.netmarble.raven2
function packageNameEndsWith(suffix) {
    // 查找所有的控件
    let nodes = className("android.widget.FrameLayout").find();
    // 遍历控件列表
    for (let i = 0; i < nodes.size(); i++) {
        let node = nodes.get(i);
        // 使用 endsWith 检查包名是否以指定的后缀结尾
        if (node.packageName().endsWith(suffix)) {
            return true;  // 找到匹配的控件，返回 true
        }
    }
    
    nodes = null
    return false;  // 没有找到匹配的控件，返回 false
}
if (storage.get("e_time",0) == 0){
    storage.put("e_time",today)
}
let Bm = storage.get("Bm",0);
if ( Bm == 0) {
    Bm = readLastLine().trim()
    storage.put("Bm", Bm);
    // console.log("storage.",storage.get(Bm))
}

/** 服务器 
 *  
 * Eden   伊甸  
 * Noah   挪亞
 * Ark	  方舟
 * Luna   露娜
 * 
 * 	小区   菲狄斯:Fides ,  莫爾斯 : Mors,  薩虞斯 : Salus ,  霍諾爾 : Honor ,  梅杜莎 : Metus ,  多洛爾 : Dolor,
 *  
*/
let Servers = {
    // 
    "3c7a0b0c-f3d1-44bc-9613-0015f038b5f9": {
		"Id": "3",
		"Server": "Luna",
		"Area": "Fides",
		"OCRip":"http://192.168.1.139",
		"port" : "8002"
	},
    "d597973b-b1df-4815-bc6c-a9a6350e83eb": {
		"Id": "70",
		"Server": "Luna",
		"Area": "Fides",
		"OCRip":"http://192.168.1.139",
		"port" : "8001"
	},
    // MIR4 
    "73940854": {
		"Id": "2",
		"Server": "ASIA073",
		"OCRip":"http://192.168.1.139",
		"port" : "8002"
	},
    "5e19856c-7435-4426-813d-4c0b3899399b": {
		"Id": "000",
		"Server": "SA011",
		"OCRip":"http://192.168.1.139",
		"port" : "8001"
	},
}

let SERVER_URL = Servers[Bm].OCRip + ":" + Servers[Bm].port

// 读取文件并返回最后一行
function readLastLine() {
    let filePath = "/storage/emulated/0/Documents/config.txt";
    let reader = new java.io.BufferedReader(new java.io.FileReader(filePath));
    let line;
    let lastLine = '';

    // 逐行读取文件内容
    while ((line = reader.readLine()) !== null) {
        lastLine = line;  // 不断更新最后一行
    }

    reader.close();
    return lastLine;  // 返回最后一行内容
}

//  控制日志
function log_z(message) {
    if (Log) {
        console.log("  * ",message);
    }
}

/** 截图函数
 * 
 * @param {boolean} grayscale 是否进行二级化处理  去除色彩
 * @returns 
 */
function getimg(grayscale) {
    let img ;
    try {
        img = captureScreen();
        if (img == null) {
            return null
        }
        // 是否二级化 
        if (grayscale) {
            let grayscaleImage = images.grayscale(img);
            imgRecycle(img) // 清理资源
            return grayscaleImage
        }
        return img
    } catch (error) {
        console.error("截图失败 ",error)
    }
    return null
}

// OCR请求
function getOcr(img) {
    try {
        let imgData = images.toBase64(img, "png");
        // 构造请求的 JSON 数据，添加 lang 字段
        let jsonData = {
            "base64_str": imgData,
        };
        // 发送 POST 请求，确保 Content-Type 为 application/json
        let response = http.postJson(SERVER_URL+"/ocr/predict-by-base64", jsonData, {
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.statusCode == 200) {
            let result = JSON.parse(response.body.string());
            return result.data;
        } else {
            console.error("getOcr 服务器返回错误：" + response.statusCode);
        }
    } catch (e) {
        console.error("请求失败: ", e);
        sleep(10* 1000)  // 10秒
    } finally {
    }
    
    return null;
}

/** 查找内容并返回。
 *  
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} targetText - 要查找的文本。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function select(ocrResults, targetText,exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
	// log_z(`要找: ${targetText} ocrResults长度 ${ocrResults[0].length}`)
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        // log_z(item[1][0])
        if (exactMatch) {
            if (item[1][0] === targetText) {
                // log_z(`text: ${item[1][0]} 坐标 ${item[0]}`)
                return item;
            }
        }else{
            if (item[1][0].includes(targetText)) {
                return item;
            }
        }
    }
    return null;
}

// 等待
function waitTimes(str,x,y,width,height) {
	let startTime = Date.now();  // 获取当前时间（毫秒）
	let img;
	let reData;
	let grayscaleImage;
	let croppedImage;
	while (Date.now() - startTime < 2*60*1000) {
		// 截图
		img = getimg(false)
        if (img == null) {
            sleep(2000);
            return false
        }
		grayscaleImage = images.grayscale(img);
		croppedImage = images.clip(grayscaleImage, x,y,width,height);
		reData = getOcr(croppedImage)
		if (select(reData ,str)) {
			return false
		}
		sleep(5000);
	}
	return true
}

//  生成未来时间 
function addRandomMinutes(min, max) {
    let now = new Date();  // 获取当前时间
    let randomMinutes = Math.floor(Math.random() * (max - min + 1)) + min; // 生成 min 到 max 之间的随机分钟数
    now.setMinutes(now.getMinutes() + randomMinutes); // 当前时间加上随机分钟数，自动处理进位
    return now;
}

//  对比时间
function compareTime() {
    let now = new Date();  // 获取当前时间
    let futureTime = new Date(storage.get("e_time"))
    // 比较时间戳
    if (futureTime > now) {
        // log_z('未来时间大于当前时间');
        return false
    } else {
        // log_z('未来时间小于当前时间');
        return true
    }
}

// 初始化
function init() {
    // 检查权限 无障碍
    // log_z("检查权限 无障碍")
    if (!auto.service) {
        // log_z("请求无障碍权限失败")
        console.log("请求无障碍权限失败")
        auto();
        throw new Error("请求无障碍权限失败");
    }
    // log_z("检查权限 无障碍 完成")

	//  补丁 5分钟关闭一次游戏
	if (compareTime()) {
		Recent()
		sleep(5000);
		storage.put("e_time",addRandomMinutes(5,5))
		return 
	}

    if (!packageNameEndsWith("raven2")) {
        app.launch('com.netmarble.raven2')
        log_z("启动游戏")
        sleep(3000);
        return false
    } 
    log_z("初始化完成")
    return true
}

/** 生成随机英文名  名字要求6-12 
 * 
 * @returns string
 */
function getRandomName() {
    // 随机生成 2 到 5 之间的长度
    let length = random(4, 10);
    
    // 定义字符集，可以根据需要修改
    let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let name = "";

    // 循环生成随机字符组成名字
    for (let i = 0; i < length; i++) {
        var randomIndex = random(0, characters.length - 1);
        name += characters.charAt(randomIndex);
    }
    
    // 加上前缀
    let prefix = "A";  
    let fullName = prefix + name;
    return fullName;
}

/** 关闭所有运行的任务
 *  打开最近任务界面
 *  点击清理按钮
 */
function Recent() {
	recents()    // 打开最近任务
	sleep(2000);
	let targetControl = id("net.oneplus.launcher:id/snapshot").findOne(5000);  // 是否打开了最近活动任务
	if (targetControl) {
		log_z("打开了最近活动任务")
		gesture(100, [[359, 1073]]);   // 最近任务的关闭位置
	}
}

/** 检查服务器-区服
 *  
 * Eden   伊甸  
 * Noah   挪亞
 * Ark	  方舟
 * Luna   露娜
 * 
 * 	小区   菲狄斯:Fides ,  莫爾斯 : Mors,  薩虞斯 : Salus ,  
 *       霍諾爾 : Honor ,  梅杜莎 : Metus ,  多洛爾 : Dolor,
 *  
*/
function select_create(reData) {
	// console.log("Server ",Servers[Bm].Server)
	// console.log("Area   ",Servers[Bm].Area)
	// 判断服务器
	if ((select(reData,Servers[Bm].Server) && select(reData,Servers[Bm].Area))) { // 判断服务器和区服
		log_z("点击进入服务器列表")
		click(640,422);
		sleep(1000);
		click(640,422);
		return true
	}
	return false
}

// 执行
function main(){
    if (init()) {
		//  检查到输入界面就输入名字
		try {
			let ts = className("android.widget.EditText").findOne(1000)
			if (ts) {
				log_z("输入法打开了")
				// 输入文字
				sleep(500);
				input(getRandomName());
				sleep(500);
				// 点击发送
				click(1187,683)
				sleep(2500);
				click(723,438)//确定
				sleep(1000);
				click(723,438)//确定
				return
			}
		} catch (error) {
			console.error("main  Error during database operation:", error);
			return 
		}

        // 截图
        let img = getimg(false)
        if (img == null) {
            sleep(20000);
            console.log("没有截图权限 ")
            if (!requestScreenCapture(true)) {
                console.log("请求屏幕捕获权限失败", )
                sleep(5000);
                return false
            }
            console.log("执行结束 ")
            return false
        }
        log_z("截图完成")
        let grayscaleImage = images.grayscale(img);  // 图片二级化
        let reData;
        let croppedImage;

		// * 角色列表 创建完成
		croppedImage = images.clip(grayscaleImage, 1070, 655, 60, 27);
		reData = getOcr(croppedImage) 
		if (select(reData,"ntr") ) {  // Entry
			log_z("创建完成")
			throw new Error(" 创建完成")
		}

		// * 创建提示框 - 确定
		croppedImage = images.clip(grayscaleImage, 663, 415, 108, 28);
        reData = getOcr(croppedImage);
        if (reData) {
			if (select(reData,"onfi")){ // Confirm
				log_z("确定名字 ")
                click(587, 338);
				return
            }
        }

		//  弹出对话框  输入名字
		croppedImage = images.clip(grayscaleImage, 587, 338, 44, 21);
        reData = getOcr(croppedImage);
        if (reData) {
			if (select(reData,"nte")){ // Enter
				log_z("点击输入名字 ")
                click(587, 338);
				return
            }
        }

		// *  Reset 在捏脸界面
		croppedImage = images.clip(grayscaleImage, 125, 662, 163, 18);
        reData = getOcr(croppedImage);
        if (reData) {
			if (select(reData,"eset")){ // Reset
				log_z("点击创建")
                click(1143,676);
				return
            }
        }

		// * 点击创建  选择职业 进入捏脸
		croppedImage = images.clip(grayscaleImage, 79, 19, 145, 26);
        reData = getOcr(croppedImage);
        if (reData) {
			//  *  class Detaile 选中职业
			if (select(reData,"elect")) {
				log_z("选择职业完成");
                click(640,422);
                return 
            }
			//  *  select clsaa  选职业
            if (select(reData,"ass")) {
				log_z("点击进入捏脸");
                click(1143,676);
                return 
            }
        }

		croppedImage = images.clip(grayscaleImage, 570, 8, 130, 31); 
        reData = getOcr(croppedImage) 
		if (reData) {
			if (select(reData,"rver")) { // AllServers
				log_z("在选择服务器界面")
				// 找点击的服务器
				let serbm = Servers[Bm].Server
				if (serbm == "Luna") {
					// 向下拉
					swipe(600,600,200,200,250)
					sleep(2000);
					// 点击区服
					if (Servers[Bm].Area == "Fides") {
						log_z(`选择大区 ${serbm} - Fides `)
						click(535,563)
					}
					if (Servers[Bm].Area == "Mors") {
						log_z(`选择大区 ${serbm} - Mors `)
						click(749,563)
					}
					if (Servers[Bm].Area == "Salus") {
						log_z(`选择大区 ${serbm} - Salus `)
						click(975,563)
					}
					// 下三区
					if (Servers[Bm].Area == "Honor") {
						log_z(`选择大区 ${serbm} - Honor `)
						click(535,644)
					}
					if (Servers[Bm].Area == "Metus") {
						log_z(`选择大区 ${serbm} - Metus `)
						click(749,644)
					}
					if (Servers[Bm].Area == "Dolor") {
						log_z(`选择大区 ${serbm} - Dolor `)
						click(975,644)
					}
				}
				if (serbm == "Ark") {
					// 向下拉
					swipe(600,600,200,200,250)
					sleep(2000);
					// 点击区服
					if (Servers[Bm].Area == "Fides") {
						log_z(`选择大区 ${serbm} - Fides `)
						click(535,370)
					}
					if (Servers[Bm].Area == "Mors") {
						log_z(`选择大区 ${serbm} - Mors `)
						click(749,370)
					}
					if (Servers[Bm].Area == "Salus") {
						log_z(`选择大区 ${serbm} - Salus `)
						click(975,370)
					}
					// 下三区
					if (Servers[Bm].Area == "Honor") {
						log_z(`选择大区 ${serbm} - Honor `)
						click(535,442)
					}
					if (Servers[Bm].Area == "Metus") {
						log_z(`选择大区 ${serbm} - Metus `)
						click(749,442)
					}
					if (Servers[Bm].Area == "Dolor") {
						log_z(`选择大区 ${serbm} - Dolor `)
						click(975,442)
					}
				}
				if (serbm == "Noah") {
					// 向下拉
					swipe(600,600,200,200,250)
					sleep(2000);
					// 点击区服
					if (Servers[Bm].Area == "Fides") {
						log_z(`选择大区 ${serbm} - Fides `)
						click(535,172)
					}
					if (Servers[Bm].Area == "Mors") {
						log_z(`选择大区 ${serbm} - Mors `)
						click(749,172)
					}
					if (Servers[Bm].Area == "Salus") {
						log_z(`选择大区 ${serbm} - Salus `)
						click(975,172)
					}
					// 下三区
					if (Servers[Bm].Area == "Honor") {
						log_z(`选择大区 ${serbm} - Honor `)
						click(535,249)
					}
					if (Servers[Bm].Area == "Metus") {
						log_z(`选择大区 ${serbm} - Metus `)
						click(749,249)
					}
					if (Servers[Bm].Area == "Dolor") {
						log_z(`选择大区 ${serbm} - Dolor `)
						click(975,249)
					}
				}
				if (serbm == "Eden") {
					// 向上拉
					swipe(200,200,600,600,250)
					sleep(2000);
					// 点击区服
					if (Servers[Bm].Area == "Fides") {
						log_z(`选择大区 ${serbm} - Fides `)
						click(535,126)
					}
					if (Servers[Bm].Area == "Mors") {
						log_z(`选择大区 ${serbm} - Mors `)
						click(749,126)
					}
					if (Servers[Bm].Area == "Salus") {
						log_z(`选择大区 ${serbm} - Salus `)
						click(975,126)
					}
					// 下三区
					if (Servers[Bm].Area == "Honor") {
						log_z(`选择大区 ${serbm} - Honor `)
						click(535,210)
					}
					if (Servers[Bm].Area == "Metus") {
						log_z(`选择大区 ${serbm} - Metus `)
						click(749,210)
					}
					if (Servers[Bm].Area == "Dolor") {
						log_z(`选择大区 ${serbm} - Dolor `)
						click(975,210)
					}
				}
				return
			}
		}

		//  ** 在游戏主界面
		croppedImage = images.clip(grayscaleImage, 1115, 0, 160, 100);
        reData = getOcr(croppedImage) 
        if (select(reData,"ption") || select(reData,"hang")) {  // 在主游戏界面
			//  *  检查大区 要是不对就点击大区
			croppedImage = images.clip(grayscaleImage, 478, 623, 322, 30);
			reData = getOcr(croppedImage)
			if (reData) {
				if (select_create(reData)) {
					log_z("检查服务器区服")
					return
				}
			}

			//  *  选择大区
			log_z("点击进入选择服务器界面")
			click(566, 640);  //  点击进入服务器选择界面 
			sleep(1000);
        }
    }
}

// for (let i = 0; i < 10; i++) {
	main()
	// console.log("执行完成 ")
	// sleep(1000);
// }


/** 查找内容并返回。
 *  
 * @param {Array} reData - OCR 结果的数组，每个元素通常包含识别出的文本和其他信息。
 * @param {string} targetText - 要查找的文本。
 * @param {boolean} [exactMatch=false] - 是否进行精确匹配。如果为 `true`，则只匹配完全相同的文本；如果为 `false`（默认值），则进行模糊匹配。
 *
 */
function select3(ocrResults, targetText,exactMatch) {
    exactMatch = (exactMatch !== undefined) ? exactMatch : false;
    if (!Array.isArray(ocrResults)) {
        console.error(`OCR 结果不是数组: ${targetText}`);
        return null;
    }
    console.log("ocrResults.length",ocrResults[0].length)
    for (let i = 0; i < ocrResults[0].length; i++) {
        let item = ocrResults[0][i];
        // log_z(item[1][0])
        log_z(`text: ${item[1][0]} 坐标 ${item[0]}`)
        if (exactMatch) {
            if (item[1][0] === targetText) {
                return item;
            }
        }else{
            if (item[1][0].includes(targetText)) {
                return item;
            }
        }
    }
    return null;
}

// if (!requestScreenCapture(true)) {
// 	console.log("请求屏幕捕获权限失败", )
// }

// let img = getimg(false)
// let grayscaleImage = images.grayscale(img);
// let reData = getOcr(grayscaleImage)
// if (reData) {
// 	select3(reData,"Class")
// }

// console.log("?-------------------------------")

// let croppedImage = images.clip(grayscaleImage, 663, 415, 108, 28);
// croppedImage = images.clip(grayscaleImage, 1070, 655, 60, 27);
// reData = getOcr(croppedImage)
// if (reData) {
// 	select3(reData,"Class")
// }
