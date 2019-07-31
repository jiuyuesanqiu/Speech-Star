// 云函数入口文件
const cloud = require('wx-server-sdk')

// 云函数入口函数
exports.main = async(event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  cloud.init({ env: ENV})
  const db = cloud.database()
  let res = await db.collection('user').where({
    _openid: OPENID,
  }).get();
  if(res.data.length ==0){
    return {
      _openid: OPENID,
      _id:''
    }
  }
  return res.data[0];
}