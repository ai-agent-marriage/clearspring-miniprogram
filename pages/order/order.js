Page({
  data: {
    orders: []
  },

  onLoad() {
    console.log('订单页加载完成');
    this.loadOrders();
  },

  loadOrders() {
    // TODO: 从云数据库加载订单
    this.setData({
      orders: []
    });
  }
});
