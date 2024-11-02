// 本地存储名称
// var WhatsApp = storages.create("WhatsApp"); 

// 持久化处理  persist. 


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
}

//  设置属性
function SetValue(data) {
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            console.log(`set : ${key} --> ${data[key]}`);
            SetProp(key,data[key])
        }
    }
}


let Phoneconfig = {
    "16603089590": {
        "Data1": {
            "persist.android_id": "fe5e0577b4e7bc90",
            "persist.ro.build.type": "user",
            "persist.ro.build.tags": "release-keys",
            "persist.ro.build.version.release": "14",
            "persist.ro.build.version.release_or_codename": "14",
            "persist.ro.build.version.release_or_preview_display": "14",
            "persist.ro.build.version.sdk": "34",
            "persist.ro.build.version.min_supported_target_sdk": "28",
            "persist.ro.product.name": "aosp-undefined",
            "persist.ro.product.manufacturer": "xiaomi",
            "persist.ro.product.brand": "xiaomi",
            "persist.ro.product.model": "Redmi K30",
            "persist.ro.build.product": "tulip",
            "persist.ro.soc.model": "SDM730",
            "persist.ro.product.board": "sdm730",
            "persist.ro.build.version.security_patch": "2017-02-17",
            "persist.ro.build.id": "APQ5.170217.785",
            "persist.ro.build.user": "WW",
            "persist.ro.build.host": "WW-YR0XS4",
            "persist.ro.build.date.utc": "1688361868",
            "persist.ro.build.version.incremental": "eng.WW.20230603.37605",
            "persist.ro.boot.serialno": "e8339590",
            "persist.ro.serialno": "e8339590",
            "persist.ro.build.display.id": "aosp_tulip-user 14 APQ5.170217.785 eng.WW.20230603.37605 release-keys",
            "persist.ro.build.description": "tulip-user 11 QKQ1.190828.002 V11.0.5.0.QFNMIXM release-keys",
            "persist.ro.build.fingerprint": "xiaomi/tulip/tulip/11/QKQ1.190828.002/V11.0.5.0.QFNMIXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460066128001164",
            "telephony_manager.phone.number0":"16603089590",
            "telephony_manager.nai0":"user6065@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-458,M6600A-W24.10.31P-154",
            "telephony_manager.imei0":"867147039641036",
            "telephony_manager.imei1":"867147037196226",
            "telephony_manager.iccid0":"4600689500949610",
            "telephony_manager.iccid1":"4600670141681689",
            "mutou.location.longitude":"38.849587",
            "mutou.location.latitude":"121.526121",
        },
    },
    "18588074571": {
        "Data1":{
            "persist.android_id":"e471f6aac34b5a4c",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"resurrectionremix-undefined",
            "persist.ro.product.manufacturer":"xiaomi",
            "persist.ro.product.brand":"xiaomi",
            "persist.ro.product.model":"Redmi Note 10",
            "persist.ro.build.product":"vayu",
            "persist.ro.soc.model":"SM7150",
            "persist.ro.product.board":"sm7150",
            "persist.ro.build.version.security_patch":"2020-05-04",
            "persist.ro.build.id":"APK4.200504.155",
            "persist.ro.build.user":"dAdK",
            "persist.ro.build.host":"dAdK-EMHRQ7",
            "persist.ro.build.date.utc":"1657865363",
            "persist.ro.build.version.incremental":"eng.dAdK.20220615.25795",
            "persist.ro.boot.serialno":"e9870035",
            "persist.ro.serialno":"e9870035",
            "persist.ro.build.display.id":"resurrectionremix_vayu-user 14 APK4.200504.155 eng.dAdK.20220615.25795 release-keys",
            "persist.ro.build.description":"vayu-user 12 RQ2A.210305.006 V11.0.5.0.QFNMIXM release-keys",
            "persist.ro.build.fingerprint":"xiaomi/vayu/vayu/12/RQ2A.210305.006/V11.0.5.0.QFNMIXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460063043399940",
            "telephony_manager.phone.number0":"18588074571",
            "telephony_manager.nai0":"user5916@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-676,M6600A-W24.10.31P-997",
            "telephony_manager.imei0":"867147034126996",
            "telephony_manager.imei1":"867147031572394",
            "telephony_manager.iccid0":"4600679731423850",
            "telephony_manager.iccid1":"4600682696727470",
            "mutou.location.longitude":"38.849587",
            "mutou.location.latitude":"121.526121",
        },
    },
    "13066470751": {
        "Data1":{
            "persist.android_id":"5180397cb733329a",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"lineage-undefined",
            "persist.ro.product.manufacturer":"google",
            "persist.ro.product.brand":"google",
            "persist.ro.product.model":"Pixel 7 Pro",
            "persist.ro.build.product":"pika",
            "persist.ro.soc.model":"Google Tensor G2",
            "persist.ro.product.board":"google tensor g2",
            "persist.ro.build.version.security_patch":"2016-04-08",
            "persist.ro.build.id":"APE2.160408.536",
            "persist.ro.build.user":"mBEX",
            "persist.ro.build.host":"mBEX-C4ERVR",
            "persist.ro.build.date.utc":"1638453055",
            "persist.ro.build.version.incremental":"eng.mBEX.20211102.70546",
            "persist.ro.boot.serialno":"e1009005",
            "persist.ro.serialno":"e1009005",
            "persist.ro.build.display.id":"lineage_pika-user 14 APE2.160408.536 eng.mBEX.20211102.70546 release-keys",
            "persist.ro.build.description":"pika-user 9 OPR1.170623.027 V11.0.5.0.QFNMIXM release-keys",
            "persist.ro.build.fingerprint":"google/pika/pika/9/OPR1.170623.027/V11.0.5.0.QFNMIXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460061957603997",
            "telephony_manager.phone.number0":"13066470751",
            "telephony_manager.nai0":"user5971@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-462,M6600A-W24.10.31P-265",
            "telephony_manager.imei0":"867147034853628",
            "telephony_manager.imei1":"867147034478491",
            "telephony_manager.iccid0":"4600681491753919",
            "telephony_manager.iccid1":"4600634010424870",
            "mutou.location.longitude":"121.54839",
            "mutou.location.latitude":"38.866112",
        }
    },
    "13160996851": {
        "Data1":{
            "persist.android_id":"7c16bec54a342986",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"lineage-undefined",
            "persist.ro.product.manufacturer":"google",
            "persist.ro.product.brand":"google",
            "persist.ro.product.model":"Pixel 3",
            "persist.ro.build.product":"sargo",
            "persist.ro.soc.model":"Qualcomm Snapdragon 845",
            "persist.ro.product.board":"qualcomm snapdragon 845",
            "persist.ro.build.version.security_patch":"2016-06-10",
            "persist.ro.build.id":"APH3.160610.774",
            "persist.ro.build.user":"aDr",
            "persist.ro.build.host":"aDr-G1U0E2",
            "persist.ro.build.date.utc":"1652402693",
            "persist.ro.build.version.incremental":"eng.aDr.20220413.87498",
            "persist.ro.boot.serialno":"e2173102",
            "persist.ro.serialno":"e2173102",
            "persist.ro.build.display.id":"lineage_sargo-user 14 APH3.160610.774 eng.aDr.20220413.87498 release-keys",
            "persist.ro.build.description":"sargo-user 8.0.0 SP1A.210812.016 V9.2.3.0.OCAMIEK release-keys",
            "persist.ro.build.fingerprint":"google/sargo/sargo/8.0.0/SP1A.210812.016/V9.2.3.0.OCAMIEK:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460063752091671",
            "telephony_manager.phone.number0":"13160996851",
            "telephony_manager.nai0":"user8373@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-639,M6600A-W24.10.31P-883",
            "telephony_manager.imei0":"867147036115734",
            "telephony_manager.imei1":"867147037159418",
            "telephony_manager.iccid0":"4600635172696707",
            "telephony_manager.iccid1":"4600695498422303",
            "mutou.location.longitude":"121.531102",
            "mutou.location.latitude":"38.902904",
        }
    },
    "17688294290": {
        "Data1":{
            "persist.android_id":"e6809a65d59feb19",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"crdroid-undefined",
            "persist.ro.product.manufacturer":"xiaomi",
            "persist.ro.product.brand":"xiaomi",
            "persist.ro.product.model":"MI 10",
            "persist.ro.build.product":"joyeuse",
            "persist.ro.soc.model":"SDM865",
            "persist.ro.product.board":"sdm865",
            "persist.ro.build.version.security_patch":"2016-03-27",
            "persist.ro.build.id":"APZ9.",
            "persist.ro.build.user":"NdP",
            "persist.ro.build.host":"NdP-7UBOGR",
            "persist.ro.build.date.utc":"1688492668",
            "persist.ro.build.version.incremental":"eng.NdP.20230605.44902",
            "persist.ro.boot.serialno":"e6647737",
            "persist.ro.serialno":"e6647737",
            "persist.ro.build.display.id":"crdroid_joyeuse-user 14 APZ9.160327.980 eng.NdP.20230605.44902 release-keys",
            "persist.ro.build.description":"joyeuse-user 14 OPR1.170623.027 V10.0.2.0.PEJMIFH release-keys",
            "persist.ro.build.fingerprint":"xiaomi/joyeuse/joyeuse/14/OPR1.170623.027/V10.0.2.0.PEJMIFH:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China ",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460063509859778",
            "telephony_manager.phone.number0":"17688294290",
            "telephony_manager.nai0":"user3600@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-759,M6600A-W24.10.31P-809",
            "telephony_manager.imei0":"867147036245434",
            "telephony_manager.imei1":"867147039788084",
            "telephony_manager.iccid0":"4600675376770009",
            "telephony_manager.iccid1":"4600649366706235",
            "mutou.location.longitude":"38.902904",
            "mutou.location.latitude":"121.531102",
        }
    },
    "18664265448": {
        "Data1":{
            "persist.android_id":"fbf94592403d5e3e",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"pa-undefined",
            "persist.ro.product.manufacturer":"xiaomi",
            "persist.ro.product.brand":"xiaomi",
            "persist.ro.product.model":"MI 11 Lite 5G NE",
            "persist.ro.build.product":"cappuccino",
            "persist.ro.soc.model":"SDM778G",
            "persist.ro.product.board":"sdm778g",
            "persist.ro.build.version.security_patch":"2016-10-04",
            "persist.ro.build.id":"APC5.161004.973",
            "persist.ro.build.user":"EzMQo",
            "persist.ro.build.host":"EzMQo-Y61EMA",
            "persist.ro.build.date.utc":"1588550213",
            "persist.ro.build.version.incremental":"eng.EzMQo.20200404.3392",
            "persist.ro.boot.serialno":"e9900302",
            "persist.ro.serialno":"e9900302",
            "persist.ro.build.display.id":"pa_cappuccino-user 14 APC5.161004.973 eng.EzMQo.20200404.3392 release-keys",
            "persist.ro.build.description":"cappuccino-user 8.0.0 SP1A.210812.016 V12.5.4.0.RKACNXM release-keys",
            "persist.ro.build.fingerprint":"xiaomi/cappuccino/cappuccino/8.0.0/SP1A.210812.016/V12.5.4.0.RKACNXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460062591806857",
            "telephony_manager.phone.number0":"18664265448",
            "telephony_manager.nai0":"user2081@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-999,M6600A-W24.10.31P-466",
            "telephony_manager.imei0":"867147035334697",
            "telephony_manager.imei1":"867147039843924",
            "telephony_manager.iccid0":"4600653796312857",
            "telephony_manager.iccid1":"4600637231055900",
            "mutou.location.longitude":"38.888888",
            "mutou.location.latitude":"121.532535",
        }
    },
    "13202414507": {
        "Data1":{
            "persist.android_id":"e77e2fb6b3b21f07",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"resurrectionremix-undefined",
            "persist.ro.product.manufacturer":"google",
            "persist.ro.product.brand":"google",
            "persist.ro.product.model":"Pixel 3",
            "persist.ro.build.product":"sargo",
            "persist.ro.soc.model":"Qualcomm Snapdragon 845",
            "persist.ro.product.board":"qualcomm snapdragon 845",
            "persist.ro.build.version.security_patch":"2018-10-09",
            "persist.ro.build.id":"APW1.181009.900",
            "persist.ro.build.user":"Tj",
            "persist.ro.build.host":"Tj-OBXQ37",
            "persist.ro.build.date.utc":"1654863827",
            "persist.ro.build.version.incremental":"eng.Tj.20220510.81407",
            "persist.ro.boot.serialno":"e8802424",
            "persist.ro.serialno":"e8802424",
            "persist.ro.build.display.id":"resurrectionremix_sargo-user 14 APW1.181009.900 eng.Tj.20220510.81407 release-keys",
            "persist.ro.build.description":"sargo-user 10 SP1A.210812.016 V13.0.1.0.SKAEUXM release-keys",
            "persist.ro.build.fingerprint":"google/sargo/sargo/10/SP1A.210812.016/V13.0.1.0.SKAEUXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460067713844696",
            "telephony_manager.phone.number0":"13202414507",
            "telephony_manager.nai0":"user6289@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-837,M6600A-W24.10.31P-897",
            "telephony_manager.imei0":"867147036356135",
            "telephony_manager.imei1":"867147031175082",
            "telephony_manager.iccid0":"4600685700685510",
            "telephony_manager.iccid1":"4600611488790844",
            "mutou.location.longitude":"38.893216",
            "mutou.location.latitude":"121.521275",
        }
    },
    "13242147820": {
        "Data1":{
            "persist.android_id":"e01d91f93e5d8c0d",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"pa-undefined",
            "persist.ro.product.manufacturer":"oneplus",
            "persist.ro.product.brand":"oneplus",
            "persist.ro.product.model":"OnePlus 6T",
            "persist.ro.build.product":"OnePlus 6T",
            "persist.ro.soc.model":"MSM8998",
            "persist.ro.product.board":"msm8998",
            "persist.ro.build.version.security_patch":"2018-04-24",
            "persist.ro.build.id":"APH0.180424.519",
            "persist.ro.build.user":"cAtQ",
            "persist.ro.build.host":"cAtQ-GYN0W5",
            "persist.ro.build.date.utc":"1690220846",
            "persist.ro.build.version.incremental":"eng.cAtQ.20230625.27216",
            "persist.ro.boot.serialno":"e7894738",
            "persist.ro.serialno":"e7894738",
            "persist.ro.build.display.id":"pa_OnePlus 6T-user 14 APH0.180424.519 eng.cAtQ.20230625.27216 release-keys",
            "persist.ro.build.description":"OnePlus 6T-user 11 RQ2A.210305.006 V11.0.5.0.QFNMIXM release-keys",
            "persist.ro.build.fingerprint":"oneplus/OnePlus 6T/OnePlus 6T/11/RQ2A.210305.006/V11.0.5.0.QFNMIXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460067460531798",
            "telephony_manager.phone.number0":"13242147820",
            "telephony_manager.nai0":"user5449@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-575,M6600A-W24.10.31P-837",
            "telephony_manager.imei0":"867147034561471",
            "telephony_manager.imei1":"867147033212305",
            "telephony_manager.iccid0":"4600630401401364",
            "telephony_manager.iccid1":"4600616331754391",
            "mutou.location.longitude":"38.89925",
            "mutou.location.latitude":"121.521225",
        }
    },
    "13249423420": {
        "Data1":{
            "persist.android_id":"fa63fde4099143c4",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"lineage-undefined",
            "persist.ro.product.manufacturer":"google",
            "persist.ro.product.brand":"google",
            "persist.ro.product.model":"Pixel 7a",
            "persist.ro.build.product":"lynx",
            "persist.ro.soc.model":"Google Tensor GS201",
            "persist.ro.product.board":"google tensor gs201",
            "persist.ro.build.version.security_patch":"2019-01-25",
            "persist.ro.build.id":"APX1.190125.943",
            "persist.ro.build.user":"KMymE",
            "persist.ro.build.host":"KMymE-2YM5QL",
            "persist.ro.build.date.utc":"1602406690",
            "persist.ro.build.version.incremental":"eng.KMymE.20200911.16382",
            "persist.ro.boot.serialno":"e160278",
            "persist.ro.serialno":"e160278",
            "persist.ro.build.display.id":"lineage_lynx-user 14 APX1.190125.943 eng.KMymE.20200911.16382 release-keys",
            "persist.ro.build.description":"lynx-user 9 SP1A.210812.016 V9.2.3.0.OCAMIEK release-keys",
            "persist.ro.build.fingerprint":"google/lynx/lynx/9/SP1A.210812.016/V9.2.3.0.OCAMIEK:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460062779808054",
            "telephony_manager.phone.number0":"13249423420",
            "telephony_manager.nai0":"user5690@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-101,M6600A-W24.10.31P-59",
            "telephony_manager.imei0":"867147035211114",
            "telephony_manager.imei1":"867147031578566",
            "telephony_manager.iccid0":"4600665229229893",
            "telephony_manager.iccid1":"4600617296811181",
            "mutou.location.longitude":"38.861371",
            "mutou.location.latitude":"121.548062",
        }
    },
    "13077485596": {
        "Data1":{
            "persist.android_id":"f6513d9a1cdd95eb",
            "persist.ro.build.type":"user",
            "persist.ro.build.tags":"release-keys",
            "persist.ro.build.version.release":"14",
            "persist.ro.build.version.release_or_codename":"14",
            "persist.ro.build.version.release_or_preview_display":"14",
            "persist.ro.build.version.sdk":"34",
            "persist.ro.build.version.min_supported_target_sdk":"28",
            "persist.ro.product.name":"aospextended-undefined",
            "persist.ro.product.manufacturer":"oneplus",
            "persist.ro.product.brand":"oneplus",
            "persist.ro.product.model":"OnePlus 8",
            "persist.ro.build.product":"OnePlus 8",
            "persist.ro.soc.model":"SM8250",
            "persist.ro.product.board":"sm8250",
            "persist.ro.build.version.security_patch":"2019-07-28",
            "persist.ro.build.id":"APT1.190728.411",
            "persist.ro.build.user":"dhoj",
            "persist.ro.build.host":"dhoj-011LQ1",
            "persist.ro.build.date.utc":"1586959296",
            "persist.ro.build.version.incremental":"eng.dhoj.20200315.3342",
            "persist.ro.boot.serialno":"e9637976",
            "persist.ro.serialno":"e9637976",
            "persist.ro.build.display.id":"aospextended_OnePlus 8-user 14 APT1.190728.411 eng.dhoj.20200315.3342 release-keys",
            "persist.ro.build.description":"OnePlus 8-user 14 SP1A.210812.016 V13.0.1.0.SKAEUXM release-keys",
            "persist.ro.build.fingerprint":"oneplus/OnePlus 8/OnePlus 8/14/SP1A.210812.016/V13.0.1.0.SKAEUXM:user/release-keys",
        },
        "Data2":{
            "gsm.operator.numeric":"46006,00000",
            "gsm.operator.alpha":"China Unicom",
            "telephony_manager.networktype0":"13",
            "gsm.network.type":"LTE, Unknown",
            "telephony_manager.iso0":"cn",
            "telephony_manager.datanetworktype0":"13",
            "telephony_manager.datanetworktype1":"13",
            "telephony_manager.simstate0":"5",
            "gsm.sim.state":"LOADED,ABSENT",
            "gsm.sim.operator.alpha":"China Unicom",
            "gsm.operator.iso-country":"[cn, ]",
            "gsm.sim.operator.iso-country":"cn",
            "gsm.sim.operator.numeric":"46006,",
            "telephony_manager.imsi0":"460065014523665",
            "telephony_manager.phone.number0":"13077485596",
            "telephony_manager.nai0":"user430@chinaunicom.com",
            "telephony_manager.datastate":"2",
            "telephony_manager.specificcarrierid0":"46006",
            "telephony_manager.carrierid0":"46006",
            "telephony_manager.specificcarrieridname0":"cn",
            "telephony_manager.carrieridname0":"cn",
            "SubscriptionInfo.mcc":"460",
            "SubscriptionInfo.mnc":"06",
            "gsm.version.baseband":"M6600A-W24.10.31P-225,M6600A-W24.10.31P-467",
            "telephony_manager.imei0":"867147037285718",
            "telephony_manager.imei1":"867147036639223",
            "telephony_manager.iccid0":"4600657377770198",
            "telephony_manager.iccid1":"4600625206356458",
            "mutou.location.longitude":"38.841234",
            "mutou.location.latitude":"121.512876",
        }
    },
}


function main(phoneNumber) {
    //  文件数据
    let userData = Phoneconfig[phoneNumber];

    let aid =  GetProp("persist.android_id")
    if (aid == "") {
        throw new Error("请求 android_id 失败");
    }
    //  获取当前手机硬件信息
    if (aid.trim() !== userData.Data1["persist.android_id"].trim()) {
        console.log(`aid type: ${typeof aid}, value: ${aid}`);
        console.log(`userData Data1 type: ${typeof userData.Data1["persist.android_id"]}, value: ${userData.Data1["persist.android_id"]}`);
        SetValue(userData.Data1);
        // 动态修改之后必须重启设备!
        SetCom();
    }else{
        console.log(" 不需要重置硬件信息")
    }

    // 获取卡数据   卡槽id
    let imei0 =  GetProp("telephony_manager.imei0")
    if (imei0 == "") {
        throw new Error("请求 imei0 失败");
    }
    if (imei0.trim() !== userData.Data2["telephony_manager.imei0"].trim()) {
        console.log(`imei0   value: ${imei0}`);
        console.log(`userData Data1   value: ${userData.Data2["telephony_manager.imei0"]}`);
        SetValue(userData.Data2)
    }else{
        console.log(" 不需要重置卡信息")
    }
    
    //  设置wifi
    //  隐藏连接的WIFI详情
    SetProp("wifiservice.wifi.isEmptyInfo","yes")
    //  隐藏周围的WIFI
    SetProp("wifiservice.wifi.isEmptyScanResults","yes")
}

main("13066470751")