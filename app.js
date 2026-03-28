App({
  onLaunch() {
    // 小程序启动时执行
    console.log('清如 ClearSpring 小程序启动');
    
    // 检查更新
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            }
          });
        });
      }
    });
  },
  
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    // 云服务配置
    cloudEnv: 'clearspring-prod',
    // API 基础地址
    apiBase: ''
  }
});
