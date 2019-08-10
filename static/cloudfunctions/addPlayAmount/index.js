// 云函数入口文件
const cloud = require('wx-server-sdk')

// 云函数入口函数
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  cloud.init({ env: ENV })
  const db = cloud.database()
  const _ = db.command


  return await db.collection('dynamic').doc(event.id)
    .update({
      data: {
        playAmount: _.inc(1)
      }
    })
}

