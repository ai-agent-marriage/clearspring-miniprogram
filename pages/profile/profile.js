Page({
  data: {
    hasUserInfo: false,
    userInfo: null,
    avatarUrl: '/images/profile.png',
    nickname: '',
    userId: '',
    menuItems: [
      { id: 1, name: '我的预约', path: '' },
      { id: 2, name: '历史记录', path: '' },
      { id: 3, name: '优惠券', path: '' },
      { id: 4, name: '设置', path: '' }
    ]
  },

  onLoad() {
    console.log('个人页加载完成');
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    // 检查登录状态
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo,
        avatarUrl: userInfo.avatarUrl || '/images/profile.png',
        nickname: userInfo.nickName || '',
        userId: userInfo.userId || ''
      });
    }
  },

  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          hasUserInfo: true,
          userInfo,
          avatarUrl: userInfo.avatarUrl,
          nickname: userInfo.nickName
        });
        console.log('用户登录成功', userInfo);
      },
      fail: (err) => {
        console.log('用户取消登录', err);
      }
    });
  },

  navigateTo(e) {
    const item = e.currentTarget.dataset.item;
    if (item.path) {
      wx.navigateTo({ url: item.path });
    } else {
      wx.showToast({ title: '即将开放', icon: 'none' });
    }
  },

  contactUs() {
    wx.makePhoneCall({
      phoneNumber: '400-xxx-xxxx'
    });
  },

  aboutUs() {
    wx.showModal({
      title: '关于清如 ClearSpring',
      content: '清如 ClearSpring 专业服务小程序\n版本：1.0.0',
      showCancel: false
    });
  }
});
