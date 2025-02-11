# zhangTesT

```
    首先能不去截图就不去截图
    参数能不传就不传
    可以不计算的就不计算


    // 设置屏幕密度为 320 dpi   adb shell wm density 当前屏幕密度
    // shell("wm density 320", true); adb shell wm density 320

    // 设置屏幕分辨率为 720x1280 像素   adb shell wm size
    // shell("wm size 720x1280", true);   adb shell wm size 720x1280

    // var currentPackage = currentPackage();  // 获取当前应用的包名
    // var currentActivity = currentActivity();  // 获取当前应用的 Activity 名称

    // console.log("当前应用包名: " + currentPackage);
    // 当前应用包名: com.huawei.android.launcher  // 桌面  
    // 当前应用包名: com.wemade.mir4global   // 传奇4
    // console.log("当前应用的 Activity: " + currentActivity);
    // 当前应用的 Activity: com.huawei.android.launcher.unihome.UniHomeLauncher  // 桌面
    // 当前应用的 Activity: com.epicgames.ue4.GameActivity   // 传奇4

    8-31 11-52  更改服务器代码 可以自己控制是否保存图片

    
    click(1195,224);  // 围绕队长战斗
    click(1195,297);  // 队伍共享目标
    click(1195,367);  // 复活时自动返回
    click(1195,441);  // 战斗自动锁定
    click(1195,595);  // 技能释放频率

    
    天宫   1070,162
    持律   1070,219 
    脉天   1070,278
    太定   1070,340

    任务点 click(1164, 172);

    退出   click(1230,29);
  

    采集键  click(326,638); 
    自动战斗 click (395,662);
    攻击键  click(1197,625);  

    随意点击的地方
    click(223 , 560) ;
    sleep(50);


    逃生
    click(1230,29);
    sleep(500);
    click(356,516);
    sleep(5000);

    800,222 // 药剂

    
    (x1, y1) - 左上角的坐标    1180 ,150
    (x2, y2) - 右上角的坐标    1243 ,150
    (x3, y3) - 右下角的坐标    1243 ,191 
    (x4, y4) - 左下角的坐标    1180 ,191

    389, 640 -1967362 战斗的颜色   389, 652  -262402  战斗的颜色
    304,661  -7233623  自动采集的颜色

    // 459, 666 -11661539  大血  关闭 471,606
    // 529, 666 -15912110  大蓝  关闭 541,606

    点开打开商店
    var OUT = select(reData,"恢复药")
    var OUT = textClick(OUT,0,-45)

```

### 错误信息
```
    15:20:48.835/E: Wrapped com.stardust.autojs.runtime.exception.ScriptException: 无障碍服务已启用但并未运行，这可能是安卓的BUG，您可能需要重启手机或重启无障碍服务 (/android_asset/modules/__automator__.js#136)
    Wrapped com.stardust.autojs.runtime.exception.ScriptException: 无障碍服务已启用但并未运行，这可能是安卓的BUG，您可能需要重启手机或重启无障碍服务
        at /android_asset/modules/__automator__.js:136:0
        at init ([remote]Mir4:46:0)
        at main ([remote]Mir4:111:0)
        at [remote]Mir4:117:0

    15:20:48.845/V: 
    ------------ 
    [ [remote]Mir4 ]运行结束，用时0.435000秒
```
### 探探
```
    /**获取属性
     * 
     * @param {string} key 属性
     */
    function executeCommand(command) {
        let res = http.get("http://127.0.0.1:8848/execute?cmd= "+ command);    // 查看文件
        if(res.statusCode != 200){
            toast("请求失败: " + res.statusCode + " " + res.statusMessage);
            return ""
        }else{
            // console.log(res.body.string())
            let bodyString = res.body.string(); // 立即读取响应体
            console.log(`value : ${bodyString}`)
            return bodyString
        }
    }

    lockscreen.disabled 1表示禁用 0表示启用锁屏。   adb命令为  adb shell settings get secure lockscreen.disabled    # 读取属性
                                                            adb shell settings put secure lockscreen.disabled 1  # 禁用锁屏
                                                            adb shell settings put secure lockscreen.disabled 0  # 启用锁屏

    //  设置
    executeCommand("settings put secure lockscreen.disabled 0")  // lockscreen.disabled 1表示禁用 0表示启用锁屏。

    //  读取
    executeCommand("settings get secure lockscreen.disabled")   // lockscreen.disabled 1表示禁用 0表示启用锁屏。


    user_rotation 设置为     强制设置设备为竖屏（纵向）模式：  adb shell settings put system user_rotation 0  
    0 表示竖屏模式。
    1 表示顺时针旋转90度（横屏）。
    2 表示旋转180度（逆时针旋转90度）。
    3 表示顺时针旋转270度。  

    com.p1.mobile.putong:id/close  关闭支付弹窗

    adb shell settings put system screen_off_timeout 2147483647  设置息屏时间  2147483647 毫秒（约 24.8 天） 相当于不息屏 

```