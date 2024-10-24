// 本地存储名称
// var WhatsApp = storages.create("WhatsApp"); 

// 持久化处理  persist. 


/**设置属性
 * 
 * @param {string} key 要设置的属性
 * @param {*} value    要设置的属性值 
 */
function SetProp(key,value) {
    // let res = http.get("http://127.0.0.1:8848/setprop?key="+key+"&value="+value);    // 查看文件
    // if(res.statusCode != 200){
    //     toast("请求失败: " + res.statusCode + " " + res.statusMessage);
    // }else{
    //     console.log(res.body.string())
    // }

    console.log(`key :[${key}]   value : ${value}`)
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

/**随机生成MAC 并隐藏WIFI信息
 * 
 */
function SetWifiinfo() {
    //  生成MAC地址   TODO 数据要保存
    let MACA = createRandomUnicastAddress(null, () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
    SetProp("MacAddress", MACA)
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
    google: [
        {
            Bproduct: "sargo",                 // 设备代号
            Bmodel: "Pixel 3",                 // 设备型号
            SOC_MODEL: "Qualcomm Snapdragon 845" // 系统单芯片型号
        },
        {
            Bproduct: "blueline",              // 设备代号
            Bmodel: "Pixel 3 XL",              // 设备型号
            SOC_MODEL: "Qualcomm Snapdragon 845" // 系统单芯片型号
        },
        {
            Bproduct: "coral",                 // 设备代号
            Bmodel: "Pixel 4 XL",              // 设备型号
            SOC_MODEL: "Qualcomm SM8150 Snapdragon 855" // 系统单芯片型号
        },
        {
            Bproduct: "redfin",                // 设备代号
            Bmodel: "Pixel 5",                 // 设备型号
            SOC_MODEL: "Qualcomm SM7250 Snapdragon 765G" // 系统单芯片型号
        },
        {
            Bproduct: "raven",                 // 设备代号
            Bmodel: "Pixel 6",                 // 设备型号
            SOC_MODEL: "Google Tensor"         // 系统单芯片型号
        },
        {
            Bproduct: "barbet",                // 设备代号
            Bmodel: "Pixel 6 Pro",             // 设备型号
            SOC_MODEL: "Google Tensor"         // 系统单芯片型号
        },
        {
            Bproduct: "lynx",                  // 设备代号
            Bmodel: "Pixel 7a",                // 设备型号
            SOC_MODEL: "Google Tensor GS201"   // 系统单芯片型号
        },
        {
            Bproduct: "ghida",                 // 设备代号
            Bmodel: "Pixel 7",                 // 设备型号
            SOC_MODEL: "Google Tensor G2"      // 系统单芯片型号
        },
        {
            Bproduct: "pika",                  // 设备代号
            Bmodel: "Pixel 7 Pro",             // 设备型号
            SOC_MODEL: "Google Tensor G2"      // 系统单芯片型号
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

    // 构建类型     userdebug
    SetProp("persist.ro.build.type",Btype);
    
    // 构建标签     test-keys
    SetProp("persist.ro.build.tags",Btags);
    // 安卓版本  14
    SetProp("persist.ro.build.version.release",VersionRelease)
    SetProp("persist.ro.build.version.release_or_codename",VersionRelease)
    SetProp("persist.ro.build.version.release_or_preview_display",VersionRelease)

    //  安卓SDK版本
    SetProp("persist.ro.build.version.sdk",BVersionSdk)

    // 安卓 API 级别  14 对应的 28 
    SetProp("persist.ro.build.version.min_supported_target_sdk",BversionMSdk)



    //  随机获得一部设备信息
    let brands = Object.keys(devices);
    let randomBrand = brands[Math.floor(Math.random() * brands.length)];
    let randomDevice = devices[randomBrand][Math.floor(Math.random() * devices[randomBrand].length)];

    // 系统前缀
    let Flavors =  ['lineage', 'aosp', 'resurrectionremix', 'pa', 'crdroid', 'aospextended']
    let Flavo = Flavors[Math.floor(Math.random() * Flavors.length)]
    //  内部代号   lineage-sagit
    SetProp("persist.ro.product.name",`${Flavo}-`+Bproduct)


    //  需要随机的设备信息
    let Bproduct = randomDevice.Bproduct // "sagit"
    let MANUFACTURER = randomBrand // "xiaomi"
    let Bmodel = randomDevice.Bmodel // "MI 6"
    let SOC_MODEL = randomDevice.SOC_MODEL // "MSM8998"

    let Flavor = `${Flavo}_${Bproduct}-user`   // "lineage_sagit-user"
    //  设备制造商名称   设备品牌   xiaomi
    SetProp("persist.ro.product.manufacturer",MANUFACTURER)
    SetProp("persist.ro.product.brand",MANUFACTURER)

    //  设备型号名称   MI 6 
    SetProp("persist.ro.product.model",Bmodel)

    //  内部代号   sagit
    SetProp("ro.build.product",Bproduct)

    //  主系统级芯片   MSM8998
    SetProp("persist.ro.soc.model",SOC_MODEL);

    //  主板名称    msm8998
    SetProp("persist.ro.product.board",SOC_MODEL.toLowerCase())


    let randomDate = generateRandomDate2();  // 随机生成日期  220605 
    //   [2024-09-05]
    SetProp("persist.ro.build.version.security_patch",convertToDateFormat(randomDate))

    // 需要生成的数据  
    
    // 构建标识符   AP2A.240805.005
    let Bid = generateBuildId(randomDate)  //  APQ9.220605.056
    SetProp("persist.ro.build.id",Bid);

    // user 随机生成一个
    let Buser = generateRandomUser()
    let Bhost = generateBuildHost(Buser)
    // user  oem
    SetProp("persist.ro.build.user",Buser)
    // host  oem-HM570
    SetProp("persist.ro.build.host",Bhost)


    let time = generateRandomDate()
    //  [ro.build.date.utc]: [1729066785]
    SetProp("persist.ro.build.date.utc",generateRandomTimestamp(time))

    // incremental 随机生成一个  构建版本的增量更新号   eng.oem.20240907.144722
    let Bincremental = `eng.${Buser}.${time}.${Math.floor(Math.random() * 100000)}`
    SetProp("persist.ro.build.version.incremental",Bincremental)

    // android_id  **   d3822eacc81ddf37
    SetProp("persist.android_id",generateAndroidId())


    //  硬件序列号   e8657075	
    let serl = generateSerialNumber()
    SetProp("persist.ro.boot.serialno",serl);
    SetProp("persist.ro.serialno",serl);
    
    

    let androidVersions = ['8.0.0', '9', '10', '11', '12', '13',`14`];
    let buildIds = ['OPR1.170623.027', 'QKQ1.190828.002', 'RQ2A.210305.006', 'SP1A.210812.016'];
    let miuiVersions = ['V9.2.3.0.OCAMIEK', 'V10.0.2.0.PEJMIFH', 'V11.0.5.0.QFNMIXM', 'V12.5.4.0.RKACNXM', 'V13.0.1.0.SKAEUXM'];

    let androidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    let buildId = buildIds[Math.floor(Math.random() * buildIds.length)];
    let miuiVersion = miuiVersions[Math.floor(Math.random() * miuiVersions.length)];


    // 构建版本号  lineage_sagit-userdebug 14 AP2A.240905.003 eng.oem.20241016.161946 test-keys
    SetProp("persist.ro.build.display.id",`${Flavor} ${VersionRelease} ${Bid} ${Bincremental} ${Btags}`)
    
    // 设备代号 + 构建类型 +Android 版本 +构建 ID +MIUI 版本 +签名类型   sagit-user 8.0.0 OPR1.170623.027 V9.2.3.0.OCAMIEK release-keys
    SetProp("persist.ro.build.description",`${Bproduct}-user ${androidVersion} ${buildId} ${miuiVersion} `+"release-keys")
    
    //  ro.build.fingerprint   Xiaomi/sagit/sagit:8.0.0/OPR1.170623.027/V9.2.3.0.OCAMIEK:user/release-keys
    SetProp("persist.ro.build.fingerprint",`${MANUFACTURER}/${Bproduct}/${Bproduct}/${androidVersion}/${buildId}/${miuiVersion}:user/release-keys`)

    //  需要保存数据 TODO 

    // 动态修改之后必须重启设备!    TODO

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


let carriers = {
    us: [ //美国
        {
            name: "Verizon",
            MCC: 310,
            MNC: 12,
            isoCountryCode: "us",
            carrierId: "310012",
            carrierName: "Verizon Wireless",
            numberPrefix: ["202", "303", "404"], // Verizon 号段
            domain: "vzw.com"
        },
        {
            name: "AT&T",
            MCC: 310,
            MNC: 410,
            isoCountryCode: "us",
            carrierId: "310410",
            carrierName: "AT&T",
            numberPrefix: ["214", "312", "415"], // AT&T 号段
            domain: "att.com"
        },
        {
            name: "T-Mobile",
            MCC: 310,
            MNC: 260,
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
            MCC: 234,
            MNC: 30,
            isoCountryCode: "gb",
            carrierId: "23430",
            carrierName: "EE",
            numberPrefix: ["7911", "7711"], // EE 号段
            domain: "ee.co.uk"
        },
        {
            name: "Vodafone UK",
            MCC: 234,
            MNC: 15,
            isoCountryCode: "gb",
            carrierId: "23415",
            carrierName: "Vodafone",
            numberPrefix: ["7712", "7812"], // Vodafone 号段
            domain: "vodafone.co.uk"
        },
        {
            name: "O2",
            MCC: 234,
            MNC: 10,
            isoCountryCode: "gb",
            carrierId: "23410",
            carrierName: "O2",
            numberPrefix: ["7713", "7813"], // O2 号段
            domain: "o2.co.uk"
        },
        {
            name: "Three UK",
            MCC: 234,
            MNC: 20,
            isoCountryCode: "gb",
            carrierId: "23420",
            carrierName: "Three",
            numberPrefix: ["7814", "7914"], // Three 号段
            domain: "three.co.uk"
        }
    ]
};


// 识别国家代码和运营商
function getCarrierInfoByPhoneNumber(phoneNumber) {
    // 识别国家代码
    let countryCode = phoneNumber.startsWith("+") ? phoneNumber.split(" ")[0] : "";
    
    let numberWithoutCode = phoneNumber.replace(countryCode, "").replace(/[\s-]/g, "");
    
    // 根据国家代码提取正确长度的号段
    let prefixLength = countryCode === "+44" ? 4 : 3; // 英国号段4位，美国3位
    let numberPrefix = numberWithoutCode.slice(0, prefixLength); // 提取号段

    // 防止 undefined 问题，先检查是否存在 numberPrefix
    if (countryCode === "+1") {
        // 美国
        let carrier = carriers.us.find(c => c.numberPrefix && c.numberPrefix.includes(numberPrefix));
        return carrier ? carrier : "未找到匹配的运营商";
    } else if (countryCode === "+44") {
        // 英国
        let carrier = carriers.gb.find(c => c.numberPrefix && c.numberPrefix.includes(numberPrefix));
        return carrier ? carrier : "未找到匹配的运营商";
    } else {
        return "未知国家";
    }
}

// 设置  IMEI   IMSI 
function SetIMSI(phoneNumber) {
    // 拿到号码 判断号码的国家和运营商
    let phone = getCarrierInfoByPhoneNumber(phoneNumber)

    //  设置 gsm.operator.numeric  -->  MCC  +  MNC
    SetProp("gsm.operator.numeric",`${phone.MCC}${phone.MNC},00000`)  // 单卡

    //  设置 gsm.operator.alpha  
    SetProp("gsm.operator.alpha",phone.name)  // 表示当前连接的网络运营商的名 
    
    //  设置 telephony_manager.networktype0   --> 网络类型 和 服务类型 
    SetProp("telephony_manager.networktype0","13")  // 表示当前连接的网络运营商的名 
    SetProp("gsm.network.type","LTE, Unknown")  // 表示当前连接的网络服务  LTE 4G网络

    //  国家ISO代码
    SetProp("telephony_manager.iso0",phone.isoCountryCode) 
    
    //  数据网络类型
    SetProp("telephony_manager.datanetworktype0","13")  
    SetProp("telephony_manager.datanetworktype1","13")  


    // 设置 SIM卡状态
    SetProp("telephony_manager.simstate0","5")
    SetProp("gsm.sim.state","LOADED,ABSENT")  

    // gsm.sim.operator.alpha --> 运营商代码
    SetProp("gsm.sim.operator.alpha",phone.name) 
   
    //  gsm.operator.iso-country --> 国家代码
    SetProp("gsm.operator.iso-country",`[${phone.isoCountryCode}, ]`)
    SetProp("gsm.sim.operator.iso-country",phone.isoCountryCode)
    
    // gsm.sim.operator.numeric --> SIM卡的运营商信息
    SetProp("gsm.sim.operator.numeric",`${phone.MCC}${phone.MNC},`)

    // telephony_manager.imsi0  --> 获得IMSI     IMSI   :   MCC + MNC + MSIN（移动用户识别号）
    SetProp("telephony_manager.imsi0",generateIMSI(phone.MCC,phone.MNC)) // 生成的 IMSI （国际移动用户识别码）
    
    // 设置  手机号码
    SetProp("telephony_manager.phone.number0", phoneNumber)
    
    // telephony_manager.nai0  --> 获取网络接入标识符   生成的NAI 需要运营商域名
    SetProp("telephony_manager.nai0",generateNAI(phone.domain))

    // telephony_manager.datastate  --> 数据连接状态  2,DATA_CONNECTED：表示数据连接已建立。
    SetProp("telephony_manager.datastate","2")
    
    // telephony_manager.specificcarrierid0  --> 当前订阅的运营商ID 
    SetProp("telephony_manager.specificcarrierid0",`${phone.MCC}${phone.MNC}`) 

    // telephony_manager.carrieridmccmnc0 --> 运营商ID    MCC + MNC
    SetProp("telephony_manager.carrierid0",`${phone.MCC}${phone.MNC}`)

    // telephony_manager.specificcarrieridname0   -- 对应的运营商名称
    SetProp("telephony_manager.specificcarrieridname0",phone.isoCountryCode)
    
    
    // telephony_manager.carrieridname0  订阅的运营商名称
    SetProp("telephony_manager.carrieridname0",phone.isoCountryCode)
    
    //  SubscriptionInfo.mcc
    SetProp("SubscriptionInfo.mcc",phone.MCC)

    //  SubscriptionInfo.mnc
    SetProp("SubscriptionInfo.mnc",phone.MNC)

    // gsm.version.baseband  --> 设备的基带版本（Baseband version）
    let baseband = generateBasebandVersion()+","+generateBasebandVersion()
    SetProp("gsm.version.baseband",baseband) //生成的基带版本

    // telephony_manager.imei0 -->  IMEI 号 15位
    let imei0 = generateIMEI()
    let imei1 = generateIMEI()
    SetProp("telephony_manager.imei0",imei0) // 生成的 IMEI号码
    SetProp("telephony_manager.imei1",imei1) // 生成的 IMEI号码

    // 生成 SIM 卡序列号
    let simSerialNumber0 = generateICCID(phone.MCC,phone.MNC)
    let simSerialNumber1 = generateICCID(phone.MCC,phone.MNC)

    //  telephony_manager.iccid0 --> SIM卡的序列号   生成的SIM序列号
    SetProp("telephony_manager.iccid0",simSerialNumber0)
    SetProp("telephony_manager.iccid1",simSerialNumber1)

    //  需要保存的信息  phoneNumber     baseband      imei0       imei1      simSerialNumber0  simSerialNumber1
    //                   电话号码        基带版本   IMEI 1号    IMEI 2号     SIM 1卡序列号       SIM 2卡序列号
}



SetWifiinfo()
console.log("-----------     ---------------")
console.log("")
console.log("")
console.log("")
SetIMSI("+1 202-555-0136")
console.log("")
console.log("")
console.log("")
SetBuild()



// 美国号码: +1 202-555-0136
// 英国号码: +44 7911 123456
 

// SetIMSI("+1 202-555-0136")
// console.log("-----------     ---------------")
// SetIMSI("+44 7911 123456")