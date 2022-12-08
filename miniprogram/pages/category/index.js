// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    imgList: [],
    total_count: 0,
    isShowloading: true,
    currentCategoryId: 0,
  },

  // change loading status
  changeLoadingStatus(status) {
    this.setData({
      isShowloading: status ? true : false,
    });
  },

  // reset pageNum
  resetPageNum() {
    this.setData({
      pageNum: 1,
    });
  },

  // reset imgList
  resetImgList() {
    this.setData({
      imgList: [],
    });
  },

  // get img about current category
  getImgListByCategory(categoryId) {
    this.changeLoadingStatus(1);
    this.setData({
      currentCategoryId: categoryId,
    });
    wx.cloud
      .callFunction({
        name: "getImgListByCategory",
        data: {
          categoryId,
          pageNum: this.data.pageNum,
        },
      })
      .then((res) => {
        wx.stopPullDownRefresh();
        this.changeLoadingStatus(0);
        res = JSON.parse(res.result).data;
        this.setData({
          imgList:
            this.data.pageNum > 1
              ? this.data.imgList.concat(res.list)
              : res.list,
          total_count: res.total_count,
        });
      })
      .catch((err) => {
        wx.stopPullDownRefresh();
        this.changeLoadingStatus(0);
        return err;
      });
  },

  // click to preview image
  previewImgHandle(e) {
    // get urls
    let previewImgUrlsList = [];
    this.data.imgList.forEach((img) => {
      previewImgUrlsList.push(img.url);
    });
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: previewImgUrlsList,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getImgListByCategory(options.old_id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

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
    this.resetPageNum();
    this.resetImgList();
    this.getImgListByCategory(this.data.currentCategoryId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // pageNum ++
    this.setData({
      pageNum: this.data.pageNum + 1,
    });
    this.getImgListByCategory(this.data.currentCategoryId);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
