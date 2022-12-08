// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

const rp = require("request-promise");

// 云函数入口函数
exports.main = async (event, context) => {
  let url = `http://wp.birdpaper.com.cn/intf/search?content=${event.keywords}&pageno=${event.pageNum}&count=10`;
  return await rp(encodeURI(url))
    .then((res) => res)
    .catch((err) => err);
};
