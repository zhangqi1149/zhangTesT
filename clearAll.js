recents()    // 打开最近任务
sleep(2000);
let targetControl = id("net.oneplus.launcher:id/snapshot").findOne(5000);  // 是否打开了最近活动任务
if (targetControl) {
    gesture(100, [[359, 1073]]);   // 最近任务的关闭位置
}