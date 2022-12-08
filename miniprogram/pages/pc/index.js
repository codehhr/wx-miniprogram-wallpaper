// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    keywords: "",
    imgList: [],
    total_count: 0,
    categoryList: [],
    currentCategoryId: null,
    active: 0,
    isShowloading: true,
    pageNum: 1,
    option: 0, // (Last operation) : 0 => change category; 1 => search; for reach bottom
  },

  // input value change
  onChange(e) {
    this.setData({
      keywords: e.detail,
    });
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

  // click the search
  onClickSearch() {
    this.onSearch();
  },

  // press Enter to search
  onSearch() {
    this.resetPageNum();
    this.resetImgList();
    if (this.data.keywords) {
      this.searchByKeywords();
    } else {
      // get first category img
      this.getImgListByCategory(
        this.data.categoryList[this.data.active].old_id
      );
    }
  },

  // search by keywords
  searchByKeywords() {
    this.changeLoadingStatus(1);
    this.setData({
      option: 1,
    });
    wx.cloud
      .callFunction({
        name: "searchByKeywords",
        data: {
          keywords: this.data.keywords,
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

  // get all categories
  getAllCategories() {
    this.changeLoadingStatus(1);
    wx.cloud
      .callFunction({
        name: "getAllCategories",
      })
      .then((res) => {
        res = JSON.parse(res.result).data;
        this.setData({
          categoryList: res,
        });
        // get first category img
        this.getImgListByCategory(
          this.data.categoryList[this.data.active].old_id
        );
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

  // click category
  onClickCategory(event) {
    // update currentCategoryId
    this.setData({
      currentCategoryId: this.data.categoryList[event.detail.name].old_id,
    });
    this.resetPageNum();
    this.resetImgList();
    this.getImgListByCategory(this.data.categoryList[event.detail.name].old_id);
  },

  // get img by categoryId
  getImgListByCategory(categoryId) {
    this.changeLoadingStatus(1);
    this.setData({
      option: 0,
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
        res = JSON.parse(res.result).data;
        this.setData({
          imgList:
            this.data.pageNum > 1
              ? this.data.imgList.concat(res.list)
              : res.list,
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
    // reget all categories
    this.getAllCategories();
    this.resetPageNum();
    this.resetImgList();
    // init currentCategoryId
    if (!this.data.currentCategoryId) {
      this.setData({
        currentCategoryId: this.data.categoryList[0].old_id,
      });
    }
    // option
    if (this.data.option == 0) {
      this.getImgListByCategory(this.data.currentCategoryId);
    } else {
      this.onSearch();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // pageNum ++
    this.setData({
      pageNum: this.data.pageNum + 1,
    });

    // init currentCategoryId
    if (!this.data.currentCategoryId) {
      this.setData({
        currentCategoryId: this.data.categoryList[0].old_id,
      });
    }

    // option (Last operation): 0 => category; 1 => search
    if (this.data.option == 0) {
      this.getImgListByCategory(this.data.currentCategoryId);
    } else {
      this.searchByKeywords();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
