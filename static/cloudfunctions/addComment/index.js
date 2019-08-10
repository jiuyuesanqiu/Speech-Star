const cloud = require('wx-server-sdk')
/**
 * 添加评论
 * event.content格式如下
 * 
 */
exports.main = async (event, context) => {
  const { ENV, OPENID, APPID } = cloud.getWXContext()
  cloud.init({ env: ENV })
  const db = cloud.database()
  const _ = db.command

  return await db.collection('dynamic').doc(event.id).update({
    data: {
      comment: _.push({
        user: event.user,
        content: event.content
      })
    }
  });
}