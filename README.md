# zhangTesT

```
    首先能不去截图就不去截图
    参数能不传就不传
    可以不计算的就不计算

    indexInParent() 控件在父控件的位置

    // 设置屏幕密度为 320 dpi   adb shell wm density 当前屏幕密度
    // shell("wm density 320", true); adb shell wm density 320

    // 设置屏幕分辨率为 720x1280 像素   adb shell wm size
    // shell("wm size 720x1280", true);   adb shell wm size 720x1280



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
    方案1 : 
        1.建立模式   
            喜欢模式 (在探探界面 滑动喜欢和不喜欢)
            预览模式 (看别人的资料 去发现界面看别人发的动态)
            互动模式 (给别人发的动态 点赞 评论 和 打招呼)
            动态模式 (自己发送动态)
            静默状态 (在一个界面等待一段时间 或者是 关闭应用休息 等待脚本再一次启动)
        2.行为限定  
            点赞 评论 发动态 当前喜欢人数 
            命中了那种模式就去做那个事情    

    先做精确的模式控制   +   随机行为  (行为可以看做是事件驱动)


    方案2 :
        1.行为限定  点赞 评论 发动态 当前喜欢人数 
        2.判断当前的界面 来随机我要做的事情 
            比如 在喜欢界面  可以随机做: 看别人的资料,喜欢别人 ,不喜欢别人 和切换到其他界面去
                在发现界面  可以随机做  看别人的动态 点赞 评论 打招呼  , 滑动更多的动态  , 发送自己的动态 

    //  信息界面  有信息提示 可能是有信息没看  或者有新配对   
    // all_pairs_entrance  这个是会变动的 新配对 或者是 全部配对

    //  send                 发布界面 
    //  input_text           输入框
    //  edit_field           分享我的时刻…
    //  selected_topic       加话题
    //  right_icon_container 右边的图标

    

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

    //  锁屏属性
    if (executeCommand("settings get secure lockscreen.disabled") == 0 ) {
        log_z("禁用锁屏:")
        executeCommand("settings put secure lockscreen.disabled 1")  // lockscreen.disabled 1表示禁用 0表示启用锁屏。        
    }
    //  强制设置为竖屏
    if (executeCommand("settings get secure lockscreen.disabled") != 0 ) {
        log_z("设置竖屏:")
        //  强制设置为竖屏
        executeCommand("settings put system user_rotation 0")
    }
    if (executeCommand("settings get system screen_off_timeout") != 2147483647) {
        // 设置当前息屏时间为 2147483647
        log_z("设置息屏:")
        executeCommand("settings put system screen_off_timeout 2147483647")
    }

    adb shell settings put system screen_off_timeout 2147483647  设置息屏时间  2147483647 毫秒（约 24.8 天） 相当于不息屏 

```

### 遍历控件
```
    获取当前界面的根节点 - 根节点向下遍历拿到全部的子节点

    // 获取指定控件
    let node = className("android.widget.FrameLayout").findOne(5000);
    if (node) {
        // 递归遍历子控件
        function getAllChildren(node, depth) {
            depth = depth || 0; // 如果 depth 未传入，则默认为 0

            // 打印当前控件的信息
            console.log(" ".repeat(depth * 2) + "控件: " + node.className() + " | 文本: " + node.text());

            // 遍历子控件
            let children = node.children();
            for (let i = 0; i < children.size(); i++) {
                getAllChildren(children.get(i), depth + 1);
            }
        }

        // 开始递归遍历，从深度 0 开始
        getAllChildren(node, 0);
    } else {
        console.log("未找到指定控件！");
    }
```

### 使用已知条件 利用父子控件关系获取到 无法定位的控件
```
    // 先定位到文本 "打招呼" 的控件
    let Nodes = text("打招呼").find();
    if (Nodes) {
        Nodes.forEach((targetNode)=>{
        // 获取 "打招呼" 所在的父节点（可能是 FrameLayout）
        let parentNode = targetNode.parent().parent();

        // 确保 parentNode 为 FrameLayout 类型
        if (parentNode && parentNode.className() === "android.view.ViewGroup") {
            // 获取该父节点下的兄弟控件
            let siblingNode = parentNode.child(1); // 根据结构去获取第N个子控件或者是兄弟控件
            
            // 确保是 TextView 类型并获取文本   使用控件类型过滤
            if (siblingNode ) {
                let sib = siblingNode.findOne(className("android.widget.TextView"))
                log("找到1文本: " + sib.text());
            } else {
                log("未找到文本控件！");
            }
        } else {
            log("未找到正确的父控件！");
        }
    })
    }  
```
### 拥有无障碍去点击赋予截图权限
```
        /** 点击坐标 适配偏移
        * 
        * @param {*} targetControl 
        * @param {number} offsetx 
        * @param {number} offsety 
        */
        function clickobj(targetControl, offsetx, offsety) {
            if (offsetx == null) {offsetx = 0}
            if (offsety == null) {offsety = 0}
            // 检查控件是否有效
            if (!targetControl) {
                console.log("目标控件无效");
                return false;
            }
            // 获取控件的边界
            let bounds = targetControl.bounds();
            // 检查边界是否有效
            if (!bounds) {
                console.log("未能获取控件的边界");
                return false;
            }

            // 计算控件的中心坐标
            let centerX = bounds.centerX();
            let centerY = bounds.centerY();

            // 输出原始中心点坐标
            // console.log("原始控件: X = " + centerX + ", Y = " + centerY);

            // 计算点击位置，考虑偏移
            let clickX = centerX + offsetx;
            let clickY = centerY + offsety;

            // 输出调整后的点击位置
            // console.log("调整后点击: X = " + clickX + ", Y = " + clickY);

            // 执行点击操作
            // return httpclick(clickX, clickY);
            return click(clickX, clickY);
        }

        //截屏权限获取
        function getScreenCapture() {
            log("请求截屏权限",device.sdkInt);
            let Thread = null
            if (device.sdkInt > 28) {
                //等待截屏权限申请并同意
                Thread = threads.start(function () {
                    packageName('com.android.systemui').text("单个应用").findOne(2000);
                    clickobj(text("单个应用").findOne(10))
                    packageName('com.android.systemui').text("整个屏幕").findOne(2000);
                    clickobj(text("整个屏幕").findOne(10))
                    packageName('com.android.systemui').text("开始").findOne(2000);
                    text("开始").findOne(1000).click();
                });
            }
            //申请截屏权限
            if (!requestScreenCapture()) {
                log("请求截图失败");
                exit();
                return false;
            } else {
                Thread.interrupt()
                log("已获得截图权限");
                return true;

            }
        }


```
### 查找控件
```
    /** 查找控件     
    * @param {要查找的内容} str     
    * @param {指令} call    
    * @param {查找时间} timeout 
    * @returns 
    */
    function Find_Control(str,call,timeout) {
        call = (call !== undefined) ? call : textContains;
        timeout = (timeout !== undefined) ? timeout : 100;
        let targetControl = call(str).findOne(timeout)
        // if (targetControl) {
        //     if (targetControl.visibleToUser()) {
        //         return targetControl
        //     }
        // }
        return targetControl && targetControl.visibleToUser() ? targetControl : null;
    }
```

### 固定结构的情况下限定区域并查找指定数据
```
   // 获取消息的未读数量
    function getUnread(config) {
        // 获取 bottombar 控件的边界
        var bo = id(config.id).findOne(1000); 
        var bound;
        if (bo) {
            bound = bo.bounds();
        } else {
            return 0; // 如果找不到 bottombar 控件，直接返回 0
        }

        // 获取左上角 (left, top) 和右下角 (right, bottom) 的坐标
        var num = 0;  // 当前的未读信息数
        var left = bound.left;
        var top = bound.top;
        var right = bound.right;
        var bottom = bound.bottom;

        var w = className(config.type).boundsInside(left, top, right, bottom).find();

        // 遍历所有找到的控件
        w.forEach((node) => {
            if (node != null && config.conditionFunc(node)) {  // 使用传入的条件函数
                var parentNode = node;
                // 根据层级设置父控件
                if (config.hasGrandparent === 1) {
                    parentNode = node.parent();
                } else if (config.hasGrandparent === 2) {
                    parentNode = node.parent().parent();
                }

                // 查找指定 ID 的 badge 控件
                var badge = parentNode.findOne(id(config.bid));
                if (badge != null) {
                    // 获取 badge 控件的文本并确保是数字
                    var badgeText = badge.text();
                    if (badgeText && !isNaN(badgeText)) {
                        num = badgeText;  // 转换为整数
                    }
                }
            }
        });

        return num;
    }

    // 示例 config 对象
    var config = {
        id: "bottombar",                         // bottombar 控件的 ID
        type: "TextView",                        // 要查找的控件的类名
        conditionFunc: function(node) {          // 控件文本为 "消息" 的条件函数
            return node.text() === "消息";  
        },
        bid: "badge",                            // badge 控件的 ID
        hasGrandparent: 2,         // 是否有祖父控件，适应不同结构的需求 层级
    };

```


