/**强行关闭游戏 控件本版
 * 
 * let currentPkg = currentPackage();  可以获取 com.wemade.mir4global  这个表示传奇4 
 * @param {string} str  APP包的名字   
 * @param {boolean} execute  是否启动
 */
function close_app(str,execute) {
    if (execute == null) {
        execute = false
    }
    // 打开详情  
    app.openAppSetting(str)
    let btn = text("强行停止").findOne(4000);
    if (btn) {
        btn.click();
        console.log("点击强行停止按钮成功");
    }
    let qd = text("确定").findOne(3000)
    if (qd) {
        console.log("首都迁往")
        qd.click();
        console.log("点击确定按钮成功");
    }
    // 再一次执行App
    if (execute) {
        app.launch(str)
    }
}

close_app("com.wemade.mir4global")