// pages/categories/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowloading: true,
    categoryList: [],
  },

  // change loading status
  changeLoadingStatus(status) {
    this.setData({
      isShowloading: status ? true : false,
    });
  },

  // get all categories
  getAllCategories() {
    this.changeLoadingStatus(1);
    wx.cloud
      .callFunction({
        name: "getAllCategories",
      })
      .then((res) => {
        this.changeLoadingStatus(0);
        wx.stopPullDownRefresh();
        res = JSON.parse(res.result).data;
        this.setData({
          categoryList: res,
        });
      })
      .catch((err) => {
        wx.stopPullDownRefresh();
        this.changeLoadingStatus(0);
        return err;
      });
  },

  navigateToCategoryPage(e) {
    wx.navigateTo({
      url: `/pages/category/index?old_id=${e.currentTarget.dataset.old_id}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getAllCategories();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getAllCategories();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getAllCategories();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
