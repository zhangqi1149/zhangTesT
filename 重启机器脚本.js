device.wakeUpIfNeeded()   // 唤醒屏幕  
sleep(1000);
if (device.isScreenOn()) { // 是否在亮着
    console.log("屏幕亮着")
    // device.keepScreenOn() // 保持常亮
    // 关机选择界面
    powerDialog()
    let gj = text("重新启动").findOne(5000)
    if (gj) {
        let bounds = gj.bounds();
        // 计算控件的中心坐标
        let centerX = bounds.centerX();
        let centerY = bounds.centerY();
        console.log("点击坐标: ", centerX, centerY);  // 打印计算出来的坐标
        gesture(200, [[centerX, centerY]]);
    }
} 


throw new Error("执行完成");



