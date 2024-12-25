
// 持久化处理  persist. 

let filePath = "/storage/emulated/0/Documents/my_file.json";

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
        // console.log(`key :[${key}]   value : ${value}`)
        console.log(`set : ${key} --> ${[value]}`);
    }
    // console.log(`key :[${key}]   value : ${value}`)
}

/**获取属性
 * 
 * @param {string} key 属性
 */
function GetProp(key) {
    let res = http.get("http://127.0.0.1:8848/execute?cmd=getprop "+key);    // 查看文件
    if(res.statusCode != 200){
        toast("请求失败: " + res.statusCode + " " + res.statusMessage);
        return ""
    }else{
        // console.log(res.body.string())
        let bodyString = res.body.string(); // 立即读取响应体
        // console.log(`value : ${bodyString}`)
        return bodyString
    }
}

// 重启
function SetCom() {
    let res = http.get("http://127.0.0.1:8848/execute?cmd=reboot");    // 查看文件
    if(res.statusCode != 200){
        toast("请求失败: " + res.statusCode + " " + res.statusMessage);
    }else{
        console.log(res.body.string())
    }

    // console.log(`key :[${key}]   value : ${value}`)
}

//  设置属性
function SetValue(data) {
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            SetProp(key,data[key])
        }
    }
}

//  生成MAC地址
function isMacAddress(addr) {
    return Array.isArray(addr) && addr.length === 6;
}

function longAddrFromByteAddr(addr) {
    if (!Array.isArray(addr) || !isMacAddress(addr)) {
        throw new Error(`${addr} was not a valid MAC address`);
    }
    let longAddr = 0n; // 使用 BigInt
    for (let b of addr) {
        longAddr = (longAddr << 8n) + (BigInt(b) & 0xffn);
    }
    return longAddr;
}

function byteAddrFromLongAddr(addr) {
    const bytes = [];
    for (let i = 0; i < 6; i++) {
        bytes.unshift(Number(addr & 0xffn)); // 将 BigInt 转换为 Number
        addr >>= 8n;
    }
    return bytes;
}

function createRandomUnicastAddress(base, random) {
    const VALID_LONG_MASK = (1n << 48n) - 1n;
    const LOCALLY_ASSIGNED_MASK = longAddrFromByteAddr([0x02, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const MULTICAST_MASK = longAddrFromByteAddr([0x01, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const OUI_MASK = longAddrFromByteAddr([0xff, 0xff, 0xff, 0x00, 0x00, 0x00]);
    const NIC_MASK = longAddrFromByteAddr([0x00, 0x00, 0x00, 0xff, 0xff, 0xff]);
    const DEFAULT_MAC_ADDRESS = "02:00:00:00:00:00";

    let addr;

    if (!base) {
        addr = BigInt(random()) & VALID_LONG_MASK;
    } else {
        addr = (BigInt(longAddrFromByteAddr(base)) & OUI_MASK) | (NIC_MASK & BigInt(random()));
    }

    addr |= LOCALLY_ASSIGNED_MASK;
    addr &= ~MULTICAST_MASK;

    const macArray = byteAddrFromLongAddr(addr);
    const macString = macArray.map(byte => byte.toString(16).padStart(2, '0')).join(':');

    if (macString === DEFAULT_MAC_ADDRESS) {
        return createRandomUnicastAddress(base, random);
    }

    return macString;
}

/** 隐藏WIFI信息
 * 
 */
function SetWifi() {
    //  隐藏连接的WIFI详情
    SetProp("wifiservice.wifi.isEmptyInfo","yes")
    //  隐藏周围的WIFI
    SetProp("wifiservice.wifi.isEmptyScanResults","yes")
}

//  硬件序列号
function generateSerialNumber() {
    const numberPart = Math.floor(Math.random() * 10000000); // 生成随机数字部分
    return `e${numberPart}`; // 组合成序列号
}

//  生成 2020-2023的随机时间  大日期
function generateRandomDate() {
    const year = Math.floor(Math.random() * (2023 - 2020 + 1)) + 2020; // 随机年份 2020-2023
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // 随机月份
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // 随机日期（最大28天）

    return `${year}${month}${day}`; // 返回格式为 YYYYMMDD
}

//  生成 2016-2020的随机时间  小日期
function generateRandomDate2() {
    const year = Math.floor(Math.random() * (20 - 16 + 1)) + 16; // 随机年份 2020-2023
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0'); // 随机月份
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0'); // 随机日期（最大28天）

    return `${year}${month}${day}`; // 返回格式为 YYYYMMDD
}


function generateRandomBuildVersion() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // 可用字母
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length)); // 随机字母
    const randomNumber = Math.floor(Math.random() * 10); // 随机数字

    return `${randomLetter}${randomNumber}`; // 组合成字符串
}

//  生成完整的 ro.build.id      APU9.221021.191
function generateBuildId(time) {
    const prefix = "AP"; // 构建 ID 前缀
    const randomVersion = generateRandomBuildVersion(); // 随机生成构建版本
    const randomSuffix = String(Math.floor(Math.random() * 1000)).padStart(3, '0'); // 随机后缀

    return `${prefix}${randomVersion}.${time}.${randomSuffix}`; // 生成完整的构建 ID
}

//  随机字符串
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 可用字符
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result; // 生成随机字符串
}

//  随机Host
function generateBuildHost(randomOem) {
    const randomHostName = generateRandomString(6); // 随机生成6位字符
    return `${randomOem}-${randomHostName}`; // 组合生成的字符串
}

// 生成 AndroidId
function generateAndroidId() {
    const hexDigits = '0123456789abcdef'; // 十六进制字符集
    let androidId = '';

    for (let i = 0; i < 16; i++) {
        androidId += hexDigits[Math.floor(Math.random() * 16)]; // 随机生成16位的十六进制数
    }

    return androidId;
}

// 生成 user
function generateRandomUser() {
       // 随机生成 2 到 5 之间的长度
       let length = random(2, 5);
    
       // 定义字符集，可以根据需要修改
       let characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
       let name = "";
   
       // 循环生成随机字符组成名字
       for (let i = 0; i < length; i++) {
           var randomIndex = random(0, characters.length - 1);
           name += characters.charAt(randomIndex);
       }

    return name;
}

// 转换时间
function convertToDateFormat(code) {
    // 提取年份、月份和日期
    const year = '20' + code.slice(0, 2);  // 取前两位，前面加上"20"
    const month = code.slice(2, 4);         // 取中间两位
    const day = code.slice(4, 6);           // 取最后两位

    // 格式化为 YYYY-MM-DD
    return `${year}-${month}-${day}`;
}

//  转换时间戳
function generateRandomTimestamp(dateStr) {
    // 生成随机的小时、分钟、秒
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);

    // 从 dateStr 中提取年、月、日
    const year = parseInt(dateStr.slice(0, 4));
    const month = parseInt(dateStr.slice(4, 6));
    const day = parseInt(dateStr.slice(6, 8));

    // 创建 Date 对象
    const dateObj = new Date(year, month, day, hour, minute, second);

    // 转换为时间戳
    const timestamp = Math.floor(dateObj.getTime() / 1000); // 秒级时间戳

    return timestamp;
}

//  设备信息
let devices = {
    oneplus: [
        {
            Bproduct: "OnePlus 2",              // 设备代号
            Bmodel: "OnePlus 2",                // 设备型号
            SOC_MODEL: "MSM8994"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 3",              // 设备代号
            Bmodel: "OnePlus 3",                // 设备型号
            SOC_MODEL: "MSM8996"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 3T",             // 设备代号
            Bmodel: "OnePlus 3T",               // 设备型号
            SOC_MODEL: "MSM8996"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 5",              // 设备代号
            Bmodel: "OnePlus 5",                // 设备型号
            SOC_MODEL: "MSM8998"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 5T",             // 设备代号
            Bmodel: "OnePlus 5T",               // 设备型号
            SOC_MODEL: "MSM8998"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 6",              // 设备代号
            Bmodel: "OnePlus 6",                // 设备型号
            SOC_MODEL: "MSM8998"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 6T",             // 设备代号
            Bmodel: "OnePlus 6T",               // 设备型号
            SOC_MODEL: "MSM8998"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 7",              // 设备代号
            Bmodel: "OnePlus 7",                // 设备型号
            SOC_MODEL: "MSM8998"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 7 Pro",          // 设备代号
            Bmodel: "OnePlus 7 Pro",            // 设备型号
            SOC_MODEL: "MSM8998"                // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 7T",             // 设备代号
            Bmodel: "OnePlus 7T",               // 设备型号
            SOC_MODEL: "SM8150"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 7T Pro",         // 设备代号
            Bmodel: "OnePlus 7T Pro",           // 设备型号
            SOC_MODEL: "SM8150"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 8",              // 设备代号
            Bmodel: "OnePlus 8",                // 设备型号
            SOC_MODEL: "SM8250"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 8 Pro",          // 设备代号
            Bmodel: "OnePlus 8 Pro",            // 设备型号
            SOC_MODEL: "SM8250"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 8T",             // 设备代号
            Bmodel: "OnePlus 8T",               // 设备型号
            SOC_MODEL: "SM8250"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus Nord",           // 设备代号
            Bmodel: "OnePlus Nord",             // 设备型号
            SOC_MODEL: "SM7250"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus Nord 2",         // 设备代号
            Bmodel: "OnePlus Nord 2",           // 设备型号
            SOC_MODEL: "DM1203"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 9",              // 设备代号
            Bmodel: "OnePlus 9",                // 设备型号
            SOC_MODEL: "SM8350"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 9 Pro",          // 设备代号
            Bmodel: "OnePlus 9 Pro",            // 设备型号
            SOC_MODEL: "SM8350"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 9R",             // 设备代号
            Bmodel: "OnePlus 9R",               // 设备型号
            SOC_MODEL: "SM8250-AC"              // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 10",             // 设备代号
            Bmodel: "OnePlus 10",               // 设备型号
            SOC_MODEL: "SM8450"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 10 Pro",         // 设备代号
            Bmodel: "OnePlus 10 Pro",           // 设备型号
            SOC_MODEL: "SM8450"                 // 系统单芯片型号
        },
        {
            Bproduct: "OnePlus 11",             // 设备代号
            Bmodel: "OnePlus 11",               // 设备型号
            SOC_MODEL: "SM8550"                 // 系统单芯片型号
        }
    ],
    xiaomi: [
        {
            Bproduct: "sagit",               // 设备代号
            Bmodel: "MI 6",                   // 设备型号
            SOC_MODEL: "MSM8998"              // 系统单芯片型号
        },
        {
            Bproduct: "dipper",               // 设备代号
            Bmodel: "MI 8",                    // 设备型号
            SOC_MODEL: "MSM8996"               // 系统单芯片型号
        },
        {
            Bproduct: "ursa",                 // 设备代号
            Bmodel: "MI 8 Explorer Edition",   // 设备型号
            SOC_MODEL: "MSM8996"               // 系统单芯片型号
        },
        {
            Bproduct: "platina",              // 设备代号
            Bmodel: "MI 8 Lite",              // 设备型号
            SOC_MODEL: "MSM8996"               // 系统单芯片型号
        },
        {
            Bproduct: "polaris",              // 设备代号
            Bmodel: "MI MIX 2S",              // 设备型号
            SOC_MODEL: "SDM845"                // 系统单芯片型号
        },
        {
            Bproduct: "merlin",               // 设备代号
            Bmodel: "Redmi Note 9",           // 设备型号
            SOC_MODEL: "MT6768"                // 系统单芯片型号
        },
        {
            Bproduct: "renoir",               // 设备代号
            Bmodel: "MI 11 Lite 5G",          // 设备型号
            SOC_MODEL: "SM7350-AB"             // 系统单芯片型号
        },
        {
            Bproduct: "tulip",                // 设备代号
            Bmodel: "Redmi K30",              // 设备型号
            SOC_MODEL: "SDM730"                // 系统单芯片型号
        },
        {
            Bproduct: "lmi",                  // 设备代号
            Bmodel: "Redmi Note 8",           // 设备型号
            SOC_MODEL: "MT6769"                // 系统单芯片型号
        },
        {
            Bproduct: "lmiin",                // 设备代号
            Bmodel: "Redmi Note 8 Pro",       // 设备型号
            SOC_MODEL: "G90T"                  // 系统单芯片型号
        },
        {
            Bproduct: "miatoll",              // 设备代号
            Bmodel: "MI A2",                  // 设备型号
            SOC_MODEL: "SDM660"                // 系统单芯片型号
        },
        {
            Bproduct: "jasmine",              // 设备代号
            Bmodel: "Redmi K20",              // 设备型号
            SOC_MODEL: "SDM730"                // 系统单芯片型号
        },
        {
            Bproduct: "raphael",              // 设备代号
            Bmodel: "MI 9",                   // 设备型号
            SOC_MODEL: "SDM855"                // 系统单芯片型号
        },
        {
            Bproduct: "pyxis",                // 设备代号
            Bmodel: "Redmi 9",                // 设备型号
            SOC_MODEL: "MT6769"                // 系统单芯片型号
        },
        {
            Bproduct: "vayu",                 // 设备代号
            Bmodel: "Redmi Note 10",          // 设备型号
            SOC_MODEL: "SM7150"                // 系统单芯片型号
        },
        {
            Bproduct: "joyeuse",              // 设备代号
            Bmodel: "MI 10",                  // 设备型号
            SOC_MODEL: "SDM865"                // 系统单芯片型号
        },
        {
            Bproduct: "nemo",                 // 设备代号
            Bmodel: "Redmi Note 10 Pro",      // 设备型号
            SOC_MODEL: "SM7150"                // 系统单芯片型号
        },
        {
            Bproduct: "pheonix",              // 设备代号
            Bmodel: "MI 10 Lite",             // 设备型号
            SOC_MODEL: "SDM765G"               // 系统单芯片型号
        },
        {
            Bproduct: "xaga",                 // 设备代号
            Bmodel: "MI 11",                  // 设备型号
            SOC_MODEL: "SM8350"                // 系统单芯片型号
        },
        {
            Bproduct: "haydn",                // 设备代号
            Bmodel: "Redmi Note 11",          // 设备型号
            SOC_MODEL: "SM8250"                // 系统单芯片型号
        },
        {
            Bproduct: "cappuccino",           // 设备代号
            Bmodel: "MI 11 Lite 5G NE",       // 设备型号
            SOC_MODEL: "SDM778G"               // 系统单芯片型号
        }
    ],
    oppo: [
        {
            "Bproduct": "r15",               // 设备代号
            "Bmodel": "R15",                 // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },
        {
            "Bproduct": "r17",               // 设备代号
            "Bmodel": "R17",                 // 设备型号
            "SOC_MODEL": "SDM710"            // 系统单芯片型号
        },
        {
            "Bproduct": "findx",             // 设备代号
            "Bmodel": "Find X",              // 设备型号
            "SOC_MODEL": "SDM845"            // 系统单芯片型号
        },
        {
            "Bproduct": "a5",                // 设备代号
            "Bmodel": "A5",                  // 设备型号
            "SOC_MODEL": "SDM450"            // 系统单芯片型号
        },
        {
            "Bproduct": "a7",                // 设备代号
            "Bmodel": "A7",                  // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },
        {
            "Bproduct": "renoa",             // 设备代号
            "Bmodel": "Reno A",              // 设备型号
            "SOC_MODEL": "SDM710"            // 系统单芯片型号
        },
        {
            "Bproduct": "reno3",             // 设备代号
            "Bmodel": "Reno 3",              // 设备型号
            "SOC_MODEL": "MT6779"            // 系统单芯片型号
        },
        {
            "Bproduct": "k3",                // 设备代号
            "Bmodel": "K3",                  // 设备型号
            "SOC_MODEL": "SDM710"            // 系统单芯片型号
        },
        {
            "Bproduct": "f11",               // 设备代号
            "Bmodel": "F11",                 // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },
        {
            "Bproduct": "f15",               // 设备代号
            "Bmodel": "F15",                 // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },{
            "Bproduct": "a1k",               // 设备代号
            "Bmodel": "A1k",                 // 设备型号
            "SOC_MODEL": "MT6765"            // 系统单芯片型号
        },
        {
            "Bproduct": "k5",                // 设备代号
            "Bmodel": "K5",                  // 设备型号
            "SOC_MODEL": "SDM712"            // 系统单芯片型号
        },
        {
            "Bproduct": "f9",                // 设备代号
            "Bmodel": "F9",                  // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },
        {
            "Bproduct": "a9",                // 设备代号
            "Bmodel": "A9",                  // 设备型号
            "SOC_MODEL": "SDM665"            // 系统单芯片型号
        },
        {
            "Bproduct": "findx2",            // 设备代号
            "Bmodel": "Find X2",             // 设备型号
            "SOC_MODEL": "SDM865"            // 系统单芯片型号
        },
        {
            "Bproduct": "a15",               // 设备代号
            "Bmodel": "A15",                 // 设备型号
            "SOC_MODEL": "MT6765"            // 系统单芯片型号
        },
        {
            "Bproduct": "r17pro",            // 设备代号
            "Bmodel": "R17 Pro",             // 设备型号
            "SOC_MODEL": "SDM845"            // 系统单芯片型号
        },
        {
            "Bproduct": "a11",               // 设备代号
            "Bmodel": "A11",                 // 设备型号
            "SOC_MODEL": "SDM460"            // 系统单芯片型号
        },
        {
            "Bproduct": "f11pro",            // 设备代号
            "Bmodel": "F11 Pro",             // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },
        {
            "Bproduct": "k3s",               // 设备代号
            "Bmodel": "K3s",                 // 设备型号
            "SOC_MODEL": "SDM710"            // 系统单芯片型号
        }
    ],
    vivo: [
        {
            "Bproduct": "v15",               // 设备代号
            "Bmodel": "V15",                 // 设备型号
            "SOC_MODEL": "MT6765"            // 系统单芯片型号
        },
        {
            "Bproduct": "v11",               // 设备代号
            "Bmodel": "V11",                 // 设备型号
            "SOC_MODEL": "SDM660"            // 系统单芯片型号
        },
        {
            "Bproduct": "x21",               // 设备代号
            "Bmodel": "X21",                 // 设备型号
            "SOC_MODEL": "SDM660"            // 系统单芯片型号
        },
        {
            "Bproduct": "nex",               // 设备代号
            "Bmodel": "NEX",                 // 设备型号
            "SOC_MODEL": "SDM845"            // 系统单芯片型号
        },
        {
            "Bproduct": "z1",                // 设备代号
            "Bmodel": "Z1",                  // 设备型号
            "SOC_MODEL": "SDM710"            // 系统单芯片型号
        },
        {
            "Bproduct": "y91",               // 设备代号
            "Bmodel": "Y91",                 // 设备型号
            "SOC_MODEL": "MT6765"            // 系统单芯片型号
        },
        {
            "Bproduct": "v20",               // 设备代号
            "Bmodel": "V20",                 // 设备型号
            "SOC_MODEL": "MT6771"            // 系统单芯片型号
        },
        {
            "Bproduct": "s7",                // 设备代号
            "Bmodel": "S7",                  // 设备型号
            "SOC_MODEL": "SDM855"            // 系统单芯片型号
        },
        {
            "Bproduct": "x27",               // 设备代号
            "Bmodel": "X27",                 // 设备型号
            "SOC_MODEL": "SDM710"            // 系统单芯片型号
        },
        {
            "Bproduct": "v25",               // 设备代号
            "Bmodel": "V25",                 // 设备型号
            "SOC_MODEL": "MT6885"            // 系统单芯片型号
        },
        {
            "Bproduct": "v30",               // 设备代号
            "Bmodel": "V30",                 // 设备型号
            "SOC_MODEL": "MT6875"            // 系统单芯片型号
        },
        {
            "Bproduct": "x50",               // 设备代号
            "Bmodel": "X50",                 // 设备型号
            "SOC_MODEL": "SDM765G"           // 系统单芯片型号
        },
        {
            "Bproduct": "y15",               // 设备代号
            "Bmodel": "Y15",                 // 设备型号
            "SOC_MODEL": "MT6765"            // 系统单芯片型号
        },
        {
            "Bproduct": "v19",               // 设备代号
            "Bmodel": "V19",                 // 设备型号
            "SOC_MODEL": "SDM675"            // 系统单芯片型号
        },
        {
            "Bproduct": "nex3",              // 设备代号
            "Bmodel": "NEX 3",               // 设备型号
            "SOC_MODEL": "SDM855"            // 系统单芯片型号
        },
        {
            "Bproduct": "y91i",              // 设备代号
            "Bmodel": "Y91i",                // 设备型号
            "SOC_MODEL": "MT6765"            // 系统单芯片型号
        },
        {
            "Bproduct": "v17",               // 设备代号
            "Bmodel": "V17",                 // 设备型号
            "SOC_MODEL": "SDM675"            // 系统单芯片型号
        },
        {
            "Bproduct": "s1",                // 设备代号
            "Bmodel": "S1",                  // 设备型号
            "SOC_MODEL": "MT6757"            // 系统单芯片型号
        },
        {
            "Bproduct": "x21s",              // 设备代号
            "Bmodel": "X21s",                // 设备型号
            "SOC_MODEL": "SDM660"            // 系统单芯片型号
        },
        {
            "Bproduct": "y50",               // 设备代号
            "Bmodel": "Y50",                 // 设备型号
            "SOC_MODEL": "MT6768"            // 系统单芯片型号
        }
    ]
};


/**设置Build 系统信息的静态常量  
 * 
 */ 
function SetBuild() {
    // 固化设备版本信息
    let Btags ="release-keys"
    let VersionRelease = "14" // 安卓版本
    let BversionMSdk = "28"  // 安卓api版本
    let BVersionSdk = "34"   // SDK 版本号
    let Btype ="user"
    
    //  随机获得一部设备信息
    let brands = Object.keys(devices);
    let randomBrand = brands[Math.floor(Math.random() * brands.length)];
    let randomDevice = devices[randomBrand][Math.floor(Math.random() * devices[randomBrand].length)];

    // 系统前缀
    let Flavors =  ['lineage', 'aosp', 'resurrectionremix', 'pa', 'crdroid', 'aospextended']
    let Flavo = Flavors[Math.floor(Math.random() * Flavors.length)]

    //  需要随机的设备信息
    let Bproduct = randomDevice.Bproduct // "sagit"
    let MANUFACTURER = randomBrand // "xiaomi"
    let Bmodel = randomDevice.Bmodel // "MI 6"
    let SOC_MODEL = randomDevice.SOC_MODEL // "MSM8998"

    let Flavor = `${Flavo}_${Bproduct}-user`   // "lineage_sagit-user"

    let randomDate = generateRandomDate2();  // 随机生成日期  220605 
    
    // 构建标识符   AP2A.240805.005
    let Bid = generateBuildId(randomDate)  //  APQ9.220605.056

    // user 随机生成一个
    let Buser = generateRandomUser()
    let Bhost = generateBuildHost(Buser)

    let time = generateRandomDate()

    // incremental 随机生成一个  构建版本的增量更新号   eng.oem.20240907.144722
    let Bincremental = `eng.${Buser}.${time}.${Math.floor(Math.random() * 100000)}`
    //  硬件序列号   e8657075	
    let serl = generateSerialNumber()

    let androidVersions = ['8.0.0', '9', '10', '11', '12', '13',`14`];
    let buildIds = ['OPR1.170623.027', 'QKQ1.190828.002', 'RQ2A.210305.006', 'SP1A.210812.016'];
    let miuiVersions = ['V9.2.3.0.OCAMIEK', 'V10.0.2.0.PEJMIFH', 'V11.0.5.0.QFNMIXM', 'V12.5.4.0.RKACNXM', 'V13.0.1.0.SKAEUXM'];

    let androidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    let buildId = buildIds[Math.floor(Math.random() * buildIds.length)];
    let miuiVersion = miuiVersions[Math.floor(Math.random() * miuiVersions.length)];

    let MACA = createRandomUnicastAddress(null, () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))    
    
    let Data1 ={
        "persist.android_id": generateAndroidId(),
        "persist.ro.build.type": Btype,
        "persist.ro.build.tags": Btags,
        "persist.ro.build.version.release": VersionRelease,
        "persist.ro.build.version.release_or_codename": VersionRelease,
        "persist.ro.build.version.release_or_preview_display": VersionRelease,
        "persist.ro.build.version.sdk": BVersionSdk,
        "persist.ro.build.version.min_supported_target_sdk": BversionMSdk,
        "persist.ro.product.name": `${Flavo}-`+Bproduct,
        "persist.ro.product.manufacturer": MANUFACTURER,
        "persist.ro.product.brand": MANUFACTURER,
        "persist.ro.product.model": Bmodel,
        "persist.ro.build.product": Bproduct,
        "persist.ro.soc.model": SOC_MODEL,
        "persist.ro.product.board": SOC_MODEL.toLowerCase(),
        "persist.ro.build.version.security_patch": convertToDateFormat(randomDate),
        "persist.ro.build.id": Bid,
        "persist.ro.build.user": Buser,
        "persist.ro.build.host": Bhost,
        "persist.ro.build.date.utc": generateRandomTimestamp(time),
        "persist.ro.build.version.incremental": Bincremental,
        "persist.ro.boot.serialno": serl,
        "persist.ro.serialno": serl,
        "persist.ro.build.display.id": `${Flavor} ${VersionRelease} ${Bid} ${Bincremental} ${Btags}`,
        "persist.ro.build.description": `${Bproduct}-user ${androidVersion} ${buildId} ${miuiVersion} `+"release-keys",
        "persist.ro.build.fingerprint": `${MANUFACTURER}/${Bproduct}/${Bproduct}/${androidVersion}/${buildId}/${miuiVersion}:user/release-keys`,
        "persist.wifi.mac": MACA,
    }
    
    for (let key in Data1) {
        if (Data1.hasOwnProperty(key)) {
            // console.log(`set : ${key} --> ${Data1[key]}`);
            SetProp(key,Data1[key])
        }
    }
    return Data1
}


function calculateLuhnChecksum(number) {
    let sum = 0;
    let alternate = false;
    for (let i = number.length - 1; i >= 0; i--) {
        let n = parseInt(number.charAt(i), 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return (10 - (sum % 10)) % 10; // 校验位
}

//  生成 SIM 卡序列号
function generateICCID(mcc , mnc) {
    const personalAccount = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10 位随机数字

    const baseICCID = mcc + mnc + personalAccount;
    const checksum = calculateLuhnChecksum(baseICCID);
    
    return baseICCID + checksum;
}

//  生成 IMEI 号码    示例 小米最常见的 TAC
function generateIMEI() {
    const tac = '86714703'; 
    const fac = Math.floor(100000 + Math.random() * 900000).toString(); // 生成 6 位随机数字

    const baseIMEI = tac + fac;
    const checksum = calculateLuhnChecksum(baseIMEI);
    
    return baseIMEI + checksum;
}

//  生成 美国的IMSI
function generateIMSI(MCC,MNC) {
    // 生成随机的 MSIN，长度为 10 位
    const MSIN = Math.floor(1000000000 + Math.random() * 9000000000).toString(); 

    return MCC + MNC + MSIN; // 组合成完整的 IMSI
}

// 生成 NAI
function generateNAI(domain) {
    const username = 'user' + Math.floor(Math.random() * 10000); // 生成随机用户名

    return `${username}@${domain}`; // 组合成完整的 NAI
}

//  生成基带版本
function generateBasebandVersion() {
    const version = 'M6600A';  // 基带版本常见前缀
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // 两位年份
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份
    const day = date.getDate().toString().padStart(2, '0'); // 日期
    const randomSuffix = Math.floor(Math.random() * 1000); // 随机的后缀数字

    return `${version}-W${year}.${month}.${day}P-${randomSuffix}`;
}

// 国家营运商信息
let carriers = {
    us: [ //美国
        {
            name: "Verizon",
            MCC: "310",
            MNC: "12",
            isoCountryCode: "us",
            carrierId: "310012",
            carrierName: "Verizon Wireless",
            numberPrefix: ["202", "303", "404"], // Verizon 号段
            domain: "vzw.com"
        },
        {
            name: "AT&T",
            MCC: "310",
            MNC: "410",
            isoCountryCode: "us",
            carrierId: "310410",
            carrierName: "AT&T",
            numberPrefix: ["214", "312", "415"], // AT&T 号段
            domain: "att.com"
        },
        {
            name: "T-Mobile",
            MCC: "310",
            MNC: "260",
            isoCountryCode: "us",
            carrierId: "310260",
            carrierName: "T-Mobile USA",
            numberPrefix: ["510", "212", "555"], // T-Mobile 号段
            domain: "t-mobile.com"
        }
    ],
    gb: [ // 英国
        {
            name: "EE",
            MCC: "234",
            MNC: "30",
            isoCountryCode: "gb",
            carrierId: "23430",
            carrierName: "EE",
            numberPrefix: ["7911", "7711"], // EE 号段
            domain: "ee.co.uk"
        },
        {
            name: "Vodafone UK",
            MCC: "234",
            MNC: "15",
            isoCountryCode: "gb",
            carrierId: "23415",
            carrierName: "Vodafone",
            numberPrefix: ["7712", "7812"], // Vodafone 号段
            domain: "vodafone.co.uk"
        },
        {
            name: "O2",
            MCC: "234",
            MNC: "10",
            isoCountryCode: "gb",
            carrierId: "23410",
            carrierName: "O2",
            numberPrefix: ["7713", "7813"], // O2 号段
            domain: "o2.co.uk"
        },
        {
            name: "Three UK",
            MCC: "234",
            MNC: "20",
            isoCountryCode: "gb",
            carrierId: "23420",
            carrierName: "Three",
            numberPrefix: ["7814", "7914"], // Three 号段
            domain: "three.co.uk"
        }
    ],
    cn: [ // 中国
        {
            // name: "中国移动",
            name: "China Mobile",
            MCC: `460`,
            MNC: `07`,
            isoCountryCode: "cn",
            carrierId: "46007",
            numberPrefix: ["134", "135", "136", "137", "138", "139", "150", "151", "152", "157", "158", "159"], // 中国移动号段
            domain: "chinamobileltd.com"
        },
        {
            // name: "中国联通",
            name: "China Unicom",
            MCC: "460",
            MNC: "06",
            isoCountryCode: "cn",
            carrierId: "46006",
            numberPrefix: ["130", "131", "132", "155", "156" ,"185","186","176","166"], // 中国联通号段
            domain: "chinaunicom.com"
        },
        {
            // name: "中国电信",
            name: "China Telecom",
            MCC: "460",
            MNC: "05",
            isoCountryCode: "cn",
            carrierId: "46005",
            numberPrefix: ["133", "153", "180", "181", "189"], // 中国电信号段
            domain: "chinatelecom.com.cn"
        }
    ]
};


// 识别国家代码和运营商
function getCarrierInfoByPhoneNumber(phoneNumber) {
    // 识别国家代码
    let countryCode = phoneNumber.startsWith("+") ? phoneNumber.split(" ")[0] : "";

    // console.log(countryCode)
    
    let numberWithoutCode = phoneNumber.replace(countryCode, "").replace(/[\s-]/g, "");
    
    // 根据国家代码提取正确长度的号段
    let prefixLength = countryCode === "+44" ? 4 : 3; // 英国号段4位，美国3位
    let numberPrefix = numberWithoutCode.slice(0, prefixLength); // 提取号段

    // console.log(numberPrefix)

    // 防止 undefined 问题，先检查是否存在 numberPrefix
    if (countryCode === "+1") {
        // 美国
        let carrier = carriers.us.find(c => c.numberPrefix && c.numberPrefix.includes(numberPrefix));
        return carrier ? carrier : "未找到匹配的运营商";
    } else if (countryCode === "+44") {
        // 英国
        let carrier = carriers.gb.find(c => c.numberPrefix && c.numberPrefix.includes(numberPrefix));
        return carrier ? carrier : "未找到匹配的运营商";
    } else if (countryCode === "+86") {
        let carrier = carriers.cn.find(c => c.numberPrefix && c.numberPrefix.includes(numberPrefix));
        return carrier ? carrier : "未找到匹配的运营商";
    }else{
        return "未知国家";
    }
}

/**设置  IMEI   IMSI 
 * 
 * @param {*} phoneNumber 
 * @param {*} longitude 
 * @param {*} latitude 
 * @returns 
 */
function SetIMSI(phoneNumber,longitude,latitude) {
    // 拿到号码 判断号码的国家和运营商
    let phone = getCarrierInfoByPhoneNumber(phoneNumber)

    if (phone == "未知国家" || phone == "未找到匹配的运营商") {
        return new Error(`${phone} 未知国家 || 未找到匹配的运营商`);
    }

    // 生成需要保存的数据
    let baseband = generateBasebandVersion();
    let imei0 = generateIMEI();
    let imei1 = generateIMEI();
    let simSerialNumber0 = generateICCID(phone.MCC, phone.MNC);
    let simSerialNumber1 = generateICCID(phone.MCC, phone.MNC);

    let cleanNumber = phoneNumber.split(" ")[1]; // 第二部分 不要+86的

    let Data2 = {
        "gsm.operator.numeric":`${phone.MCC}${phone.MNC},00000`,
        "gsm.operator.alpha":phone.name,
        "telephony_manager.networktype0":"13",
        "gsm.network.type":"LTE, Unknown",
        "telephony_manager.iso0":phone.isoCountryCode,
        "telephony_manager.datanetworktype0":"13",
        "telephony_manager.datanetworktype1":"13",
        "telephony_manager.simstate0":"5",
        "gsm.sim.state":"LOADED,ABSENT",
        "gsm.sim.operator.alpha":phone.name,
        "gsm.operator.iso-country":`[${phone.isoCountryCode}, ]`,
        "gsm.sim.operator.iso-country":phone.isoCountryCode,
        "gsm.sim.operator.numeric":`${phone.MCC}${phone.MNC},`,
        "telephony_manager.imsi0":generateIMSI(phone.MCC,phone.MNC),
        "telephony_manager.phone.number0":cleanNumber,
        "telephony_manager.nai0":generateNAI(phone.domain),
        "telephony_manager.datastate":"2",
        "telephony_manager.specificcarrierid0":`${phone.MCC}${phone.MNC}`,
        "telephony_manager.carrierid0":`${phone.MCC}${phone.MNC}`,
        "telephony_manager.specificcarrieridname0":phone.isoCountryCode,
        "telephony_manager.carrieridname0":phone.isoCountryCode,
        "SubscriptionInfo.mcc":phone.MCC,
        "SubscriptionInfo.mnc":phone.MNC,
        "gsm.version.baseband":baseband,
        "telephony_manager.imei0":imei0,
        "telephony_manager.imei1":imei1,
        "telephony_manager.iccid0":simSerialNumber0,
        "telephony_manager.iccid1":simSerialNumber1,
        "mutou.location.longitude":longitude,
        "mutou.location.latitude":latitude,
    };

    for (let key in Data2) {
        if (Data2.hasOwnProperty(key)) {
            // console.log(`set : ${key} --> ${Data1[key]}`);
            SetProp(key,Data2[key])
        }
    }

    return Data2
}
 
// 保存数据到文件
function saveDataToFile(phoneNumber, data1, data2) {
    let cleanNumber = phoneNumber.split(" ")[1]; // 第二部分 不要+86的
    // 检查文件是否存在
    let jsonData = {};
    const file = new java.io.File(filePath);
    if (file.exists()) {
        let reader = new java.io.FileReader(file);
        let bufferedReader = new java.io.BufferedReader(reader);
        let stringBuilder = new java.lang.StringBuilder();
        let line;
        while ((line = bufferedReader.readLine()) !== null) {
            stringBuilder.append(line);
        }
        jsonData = JSON.parse(stringBuilder.toString());
        bufferedReader.close();
    }

    // 确保 jsonData 中有正确的键
    if (!jsonData[cleanNumber]) {
        jsonData[cleanNumber] = {};
    }

    // 保存 Data1
    if (data1) {
        jsonData[cleanNumber]["Data1"] = data1;
    }

    // 保存 Data2
    if (data2) {
        jsonData[cleanNumber]["Data2"] = data2;
    }

    // 写回文件
    const writer = new java.io.FileWriter(file);
    writer.write(JSON.stringify(jsonData, null, 4));
    writer.flush();
    writer.close();
}

//  读取文件
function readFile() {
    let reader = new java.io.BufferedReader(new java.io.FileReader(filePath));
    let line;
    let content = '';

    // 逐行读取文件内容
    while ((line = reader.readLine()) !== null) {
        content += line + "\n"; // 添加换行符
    }
    
    reader.close();
    return content.trim(); // 返回内容，去掉末尾的换行符
}

//  检查手机号是否存在
function checkAccount(cleanNumber) {
    let content = readFile(filePath);

    if (content === null) {
        return new Error("读取文件时出错!! ");
    }

    let data = JSON.parse(content);

    // 检查账号是否存在
    if (data.hasOwnProperty(cleanNumber)) {
        return data[cleanNumber]; // 返回存在的账号数据
    } else {
        return null; // 账号不存在
    }
}


//  设置定位经纬度
function SetLocation(longitude,latitude) {
    let Data2 = {
        "mutou.location.longitude":longitude,
        "mutou.location.latitude":latitude,
    };

    // SetProp("mutou.location.longitude",longitude)
    // SetProp("mutou.location.latitude",latitude)
    return Data2
}


function main(phoneNumber,longitude,latitude) {
    // 1.检查配置文件是否存在
    let file = new java.io.File(filePath);
    if (!file.exists()) {
        // 文件不存在  生成当前号码的模拟数据
        let Data1 = SetBuild()
        // let Data2 = SetIMSI(phoneNumber,longitude,latitude)
        let Data2 = SetLocation(longitude,latitude)
        saveDataToFile(phoneNumber,Data1,Data2)
        SetCom()  // 重启
    }else{
        // 2.如果存在就查找号码
        let cleanNumber = phoneNumber.split(" ")[1];
        let data = checkAccount(cleanNumber)

        if (data != null) {
            // 3.检查静态属性 对的上就向下执行, 否则读取文件静态属性,设置并重启.
            let aid =  GetProp("persist.android_id")
            if (aid == "") {
                throw new Error("请求 android_id 失败");
            }
            if (aid.trim() !== data.Data1["persist.android_id"].trim()) {
                // 回档模拟数据
                SetValue(data.Data1)
                SetCom()  // 重启
            }else{
                console.log(`不需要重置硬件信息`);
            }

            // // 4.检查动态属性 对不上就读取文件静态属性 设置账号属性
            // let imei0 =  GetProp("telephony_manager.imei0")    // 获取卡数据   卡槽id
            // if (imei0 == "") {
            //     throw new Error("请求 imei0 失败");
            // }
            // if (imei0.trim() !== data.Data2["telephony_manager.imei0"].trim()) {
            //     // 回档模拟数据
            //     SetValue(data.Data2)
            // }else{
            //     console.log(`不需要重置`);
            // }

            //  5. 检查经纬
            // let latitude = GetProp("mutou.location.latitude")    // 获取卡数据   卡槽id
            // if (latitude == "") {
            //     throw new Error("请求 latitude 失败");
            // }
            // console.log(String(latitude).trim())
            // console.log(data.Data2["mutou.location.latitude"])
            // if (String(latitude).trim() !== String(data.Data2["mutou.location.latitude"]).trim()) {
            //     // 回档模拟数据
            //     SetValue(data.Data2)
            //     console.log(`回档模拟数据2`);
            // }else{
            //     console.log(`不需要重置经纬度`);
            // }
        }else{
            // 未记录账号信息 生成当前号码的模拟数据
            let Data1 = SetBuild()
            // let Data2 = SetIMSI(phoneNumber,longitude,latitude)
            let Data2 = SetLocation(longitude,latitude)
            saveDataToFile(phoneNumber,Data1,Data2)
            SetCom()  // 重启
        }
    }
    //  关闭WiFi
    SetWifi()
}



let longitude =  0    // 经 -180 到 180    longitude 
let latitude = 0  // 纬 -90  到  90    latitude
main("+86 13149875285",longitude,latitude)



