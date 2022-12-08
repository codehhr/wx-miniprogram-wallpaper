// pages/news/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    pageNum: 1,
    total_count: 0,
    isShowloading: true,
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

  // get newest list
  getNewestList() {
    this.changeLoadingStatus(1);
    wx.cloud
      .callFunction({
        name: "getNewestList",
        data: {
          pageNum: this.data.pageNum,
        },
      })
      .then((res) => {
        res = JSON.parse(res.result).data;
        this.setData({
          imgList:
            this.data.pageNum > 1
              ? this.data.imgList.concat(res.list)
              : res.list,
          total_count: res.total_count,
        });
        wx.stopPullDownRefresh();
        this.changeLoadingStatus(0);
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
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.getNewestList();
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
    this.resetPageNum();
    this.resetImgList();
    this.getNewestList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // pageNum ++
    this.setData({
      pageNum: this.data.pageNum + 1,
    });
    this.getNewestList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
