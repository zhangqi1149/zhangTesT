
let Log = true   // 是否显示打印内容

function log_z(message) {
    if (Log) {
        console.log("  * ",message);
    }
}

// 初始化
function init() {
    // 检查权限 无障碍
    log_z("检查权限 无障碍")
    if (!auto.service) {
        // log_z("请求无障碍权限失败")
        console.log("请求无障碍权限失败")
        auto();
        throw new Error("请求无障碍权限失败");
    }
    log_z("检查权限 无障碍 完成")

    // 锁屏了就打开
    // if (!device.isScreenOn()) {
    //     device.wakeUpIfNeeded() // 唤醒
    //     swipe(232, 1000, 232, 200, 800);  // 打开
    // }

    // log_z("请求屏幕捕获权限")
    // if (!requestScreenCapture(true)) {
    //     // throw new Error("请求屏幕捕获权限失败");
    //     log_z("请求屏幕捕获权限失败")
    //     sleep(5000);
    //     return false
    // }
    // log_z("请求屏幕捕获权限 完成")
    
    try {
        let ts = textContains("选择账号").findOne(3000)
        if (ts) {
            log_z("谷歌登录-选择账号")
            click(600,314);
            return
        }
    } catch (error) {
        console.error("选择账号  Error during database operation:", error);
        return false
    }

    //  检查电量
    if (Recent()) {
        return false
    }
    if (!packageNameEndsWith("mir4global")) {
        app.launch('com.wemade.mir4global')
        log_z("启动游戏")
        sleep(3000);
        return false
    } 
    return true
}

/** 关闭所有运行的任务
 *  打开最近任务界面
 *  点击清理按钮
 */
function Recent() {
    // if (compareTime()) {
    //     sleep(15*1000*60)  // 等待15分钟
    //     return true
    // }
    var battery = device.getBattery()
    if (battery < 2.0) {
        console.log("电量不足 : ", battery)
        clearAll();
        // 直接卡在这里等1个小时
        sleep(1000*60*30);
        sleep(1000*60*30);
        return true;
    }
    return false;
}

/**
 * 打开最近任务清理所有
 */
function clearAll(){
    recents()    // 打开最近任务
    sleep(2000);
    let targetControl = id("net.oneplus.launcher:id/snapshot").findOne(5000);  // 是否打开了最近活动任务
    if (targetControl) {
        log_z("打开了最近活动任务")
        gesture(100, [[359, 1073]]);   // 最近任务的关闭位置
    }
}

function assistant() {
    let allScript = engines.all();
    for (let index = 0; index < allScript.length; index++) {
        const element = allScript[index].getS;
        print(element)
    }
}

engines.execScript("assistant", "assistant();\n" + assistant.toString());