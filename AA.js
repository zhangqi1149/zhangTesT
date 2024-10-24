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
    //  生成MAC地址
    SetProp("MacAddress", createRandomUnicastAddress(null, () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)))
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

// 生成主板名称
function generateProductBoard() {
    const boards = ['sagit', 'msm8996', 'sdm660', 'mt6753', 'exynos8890'];
    const randomIndex = Math.floor(Math.random() * boards.length);
    return boards[randomIndex];
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


// 设置Build 系统信息的静态常量   动态修改之后必须重启设备!    TODO
function SetBuild() {
    // 小米手机 
    let Flavor = "lineage_sagit-userdebug"
    let VersionRelease = "14"
    let Btags ="test-keys"
    let Btype ="user"
    let Bproduct = "sagit"
    let MANUFACTURER = "xiaomi"
    let Bmodel = "MI 6"
    let SOC_MODEL = "MSM8998"

    let randomDate = generateRandomDate2();  // 随机生成日期  220605 

    let androidVersions = ['8.0.0', '9', '10', '11', '12', '13',`14`];
    let buildIds = ['OPR1.170623.027', 'QKQ1.190828.002', 'RQ2A.210305.006', 'SP1A.210812.016'];
    let miuiVersions = [
        'V9.2.3.0.OCAMIEK', 'V10.0.2.0.PEJMIFH', 'V11.0.5.0.QFNMIXM', 
        'V12.5.4.0.RKACNXM', 'V13.0.1.0.SKAEUXM'
    ];

    // 需要生成的数据
    let Bid = generateBuildId(randomDate)  //  APQ9.220605.056
    
    let Board = generateProductBoard()    // 主板
    
    let androidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)];
    let buildId = buildIds[Math.floor(Math.random() * buildIds.length)];
    let miuiVersion = miuiVersions[Math.floor(Math.random() * miuiVersions.length)];

    // user 随机生成一个
    let Buser = generateRandomUser(12345)
    let Bhost = generateBuildHost(Buser)

    let time = generateRandomDate()
    // incremental 随机生成一个
    let Bincremental = `eng.${Buser}.${time}.${Math.floor(Math.random() * 100000)}`
    
    //  ---------------------------------------------------------------------

    // android_id  **   d3822eacc81ddf37
    SetProp("persist.android_id",generateAndroidId())

    // user  oem
    SetProp("persist.ro.build.user",Buser)

    //  主板名称    msm8998
    SetProp("persist.ro.product.board",Board)

    // 安卓版本  14
    SetProp("persist.ro.build.version.release",VersionRelease)
    SetProp("persist.ro.build.version.release_or_codename",VersionRelease)
    SetProp("persist.ro.build.version.release_or_preview_display",VersionRelease)
    
    //  类型 userdebug
    SetProp("persist.ro.build.type",Btype)


    //  设备制造商名称   设备品牌   xiaomi
    SetProp("persist.ro.product.manufacturer",MANUFACTURER)
    SetProp("persist.ro.product.brand",MANUFACTURER)

    //  设备型号名称   MI 6 
    SetProp("persist.ro.product.model",Bmodel)

    //  内部代号   sagit
    SetProp("ro.build.product",Bproduct)

    
    //  内部代号   lineage-sagit
    SetProp("persist.ro.product.name","lineage-"+Bproduct)

    // host  oem-HM570
    SetProp("persist.ro.build.host",Bhost)

    //  硬件序列号   e8657075	
    let serl = generateSerialNumber()
    SetProp("persist.ro.boot.serialno",serl);
    SetProp("persist.ro.serialno",serl);
    
    
    // 构建标识符   AP2A.240805.005
    SetProp("persist.ro.build.id",Bid);

    // 构建标签     test-keys
    SetProp("persist.ro.build.tags",Btags);

    // 构建类型     userdebug
    SetProp("persist.ro.build.type",Btype);
    
    //  主系统级芯片   MSM8998
    SetProp("persist.ro.soc.model",SOC_MODEL);
    

    
    // 构建版本的增量更新号   eng.oem.20240907.144722
    SetProp("persist.ro.build.version.incremental",Bincremental)



    // 构建版本号  lineage_sagit-userdebug 14 AP2A.240905.003 eng.oem.20241016.161946 test-keys
    SetProp("persist.ro.build.display.id",`${Flavor} ${VersionRelease} ${Bid} ${Bincremental} ${Btags}`)

    
    // 设备代号 + 构建类型 +Android 版本 +构建 ID +MIUI 版本 +签名类型   sagit-user 8.0.0 OPR1.170623.027 V9.2.3.0.OCAMIEK release-keys
    SetProp("persist.ro.build.description",`${Bproduct}-user ${androidVersion} ${buildId} ${miuiVersion} `+"release-keys")
    
    //  ro.build.fingerprint   Xiaomi/sagit/sagit:8.0.0/OPR1.170623.027/V9.2.3.0.OCAMIEK:user/release-keys
    SetProp("persist.ro.build.fingerprint",`${MANUFACTURER}/${Bproduct}/${Bproduct}/${androidVersion}/${buildId}/${miuiVersion}:user/release-keys`)
   

    //  [ro.build.date.utc]: [1729066785]
    SetProp("persist.ro.build.date.utc",generateRandomTimestamp(time))


    //   [2024-09-05]
    SetProp("persist.ro.build.version.security_patch",convertToDateFormat(randomDate))


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

//  生成 IMEI 号码
function generateIMEI() {
    const tac = '86714703'; // 示例 小米最常见的 TAC
    const fac = Math.floor(100000 + Math.random() * 900000).toString(); // 生成 6 位随机数字

    const baseIMEI = tac + fac;
    const checksum = calculateLuhnChecksum(baseIMEI);
    
    return baseIMEI + checksum;
}



//  生成 美国的IMSI
function generateIMSI(operatingCarrier) {
    const MCC = '310'; // 美国的移动国家码
    let MNC;

    // 根据运营商选择 MNC
    switch (operatingCarrier) {
        case 'T-Mobile':
            MNC = '260';
            break;
        case 'AT&T':
            MNC = '410';
            break;
        case 'Verizon':
            MNC = '012';
            break;
        default:
            throw new Error('未知运营商');
    }

    // 生成随机的 MSIN，长度为 10 位
    const MSIN = Math.floor(1000000000 + Math.random() * 9000000000).toString(); 

    return MCC + MNC + MSIN; // 组合成完整的 IMSI
}

// 生成 NAI
function generateNAI(operator) {
    const username = 'user' + Math.floor(Math.random() * 10000); // 生成随机用户名

    // 定义运营商对应的域名
    const operators = {
        'T-Mobile': 't-mobile.com',
        'AT&T': 'att.com',
        'Verizon': 'verizon.com',
        'Sprint': 'sprint.com',
        'US Cellular': 'uscellular.com'
    };

    const domain = operators[operator];

    if (!domain) {
        throw new Error('未知的运营商名称'); // 如果运营商不在列表中，抛出错误
    }

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


// 设置  IMEI   IMSI 
function SetIMSI(phoneNumber) {
    //  获取国家 和 号码  假设我拿到的是 T-Mobile USA 家的手机号   MCC：310  MNC：260   
    let MCC = "310" 
    let MNC = "260" 

    //  设置 gsm.operator.numeric  -->  MCC  +  MNC
    SetProp("gsm.operator.numeric",`${MCC}${MNC},00000`)  // 单卡
    //  设置 gsm.operator.alpha  
    SetProp("gsm.operator.alpha","T-Mobile")  // 表示当前连接的网络运营商的名 
    
    //  设置 telephony_manager.networktype0   --> 网络类型 和 服务类型 
    SetProp("telephony_manager.networktype0","13")  // 表示当前连接的网络运营商的名 
    SetProp("gsm.network.type","LTE, Unknown")  // 表示当前连接的网络服务  LTE 4G网络

    // telephony_manager.iso0
    SetProp("telephony_manager.iso0","us")  // 国家ISO代码
    
    //  telephony_manager.datanetworktype0  telephony_manager.datanetworktype1
    SetProp("telephony_manager.datanetworktype0","13")  // 卡1 数据网络类型
    SetProp("telephony_manager.datanetworktype1","13")  // 卡2 数据网络类型


    // telephony_manager.simstate0  telephony_manager.simstate1
    SetProp("telephony_manager.simstate0","5")  // 卡1 SIM卡状态
    SetProp("gsm.sim.state","LOADED,ABSENT")  

    // gsm.sim.operator.alpha --> 运营商代码
    SetProp("gsm.sim.operator.alpha","T-Mobile") 
    
    // 生成 SIM 卡序列号
    let simSerialNumber0 = generateICCID(MCC,MNC);
    let simSerialNumber1 = generateICCID(MCC,MNC);
    //  telephony_manager.iccid0 --> SIM卡的序列号 
    SetProp("telephony_manager.iccid0",simSerialNumber0);  //  生成的SIM序列号
    SetProp("telephony_manager.iccid1",simSerialNumber1);  //  生成的SIM序列号

   
    //  gsm.operator.iso-country --> 国家代码
    SetProp("gsm.operator.iso-country","[us, ]")
    SetProp("gsm.sim.operator.iso-country","us")
    
    // gsm.sim.operator.numeric --> SIM卡的运营商信息
    SetProp("gsm.sim.operator.numeric",`${MCC}${MNC},`)

    // telephony_manager.imei0 -->  IMEI 号 15位
    SetProp("telephony_manager.imei0",generateIMEI()) // 生成的 IMEI号码
    SetProp("telephony_manager.imei1",generateIMEI()) // 生成的 IMEI号码
    
    // telephony_manager.imsi0  --> 获得IMSI     IMSI   :   MCC + MNC + MSIN（移动用户识别号）
    SetProp("telephony_manager.imsi0",generateIMSI('T-Mobile')) // 生成的 IMSI （国际移动用户识别码） TODO 需要运营商名称
    
    // telephony_manager.phone.number0
    SetProp("telephony_manager.phone.number0", phoneNumber) //  TODO API上获取的号码
    
    // telephony_manager.nai0  --> 获取网络接入标识符
    SetProp("telephony_manager.nai0",generateNAI('T-Mobile')) // 生成的NAI  TODO 需要运营商名称

    // telephony_manager.datastate  --> 数据连接状态
    SetProp("telephony_manager.datastate","2")  // 2,DATA_CONNECTED：表示数据连接已建立。
    
    // telephony_manager.specificcarrierid0  --> 当前订阅的运营商ID 
    SetProp("telephony_manager.specificcarrierid0",`${MCC}${MNC}`) 

    // telephony_manager.carrieridmccmnc0 --> 运营商ID
    SetProp("telephony_manager.carrierid0",`${MCC}${MNC}`) // 对应的国家

    // telephony_manager.specificcarrieridname0   -- 对应的运营商名称
    SetProp("telephony_manager.specificcarrieridname0","T-Mobile")  // 
    
    
    // telephony_manager.carrieridname0  订阅的运营商名称
    SetProp("telephony_manager.carrieridname0","T-Mobile")
    
    // telephony_manager.voicemail.number0  --> 获取语音信箱号码
    
    // gsm.version.baseband  --> 设备的基带版本（Baseband version）
    SetProp("gsm.version.baseband",generateBasebandVersion()+","+generateBasebandVersion()) //生成的基带版本

    //  SubscriptionInfo.mcc
    SetProp("SubscriptionInfo.mcc",MCC)
    
    //  SubscriptionInfo.mnc
    SetProp("SubscriptionInfo.mnc",MNC)
}



SetWifiinfo()

SetIMSI(123456789)

SetBuild()