<script>
	import {
		mapMutations
	} from 'vuex';
	wx.cloud.init({
		env: 'product-yjcc'
	});
	const db = wx.cloud.database();
	export default {
		onLaunch: function() {
			let self = this;
			wx.cloud.callFunction({
				// 要调用的云函数名称
				name: 'getOwnerOpenid',
			}).then(resContext => {
				//查询云数据库是否有此用户数据
				db.collection('user').where({
					_openid:resContext.OPENID
				}).get().then(res => {
					if (res.data.length > 0) {
						self.login(res.data[0]);
					} else {
						//没有则调用微信接口获取
						wx.getUserInfo({
							success: function(res) {
								self.login(res.userInfo);
								//上传用户信息到云数据库
								db.collection('user').add({
									data: res.userInfo
								}).then(res => {
									console.log('保存用户数据到云数据库')
								})
							}
						})
					}
				})
			}).catch(err => {
			})
		},
		methods: {
			...mapMutations(['login'])
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "common/main.css";
	@import "common/icon.css";
	@import "common/animation.css";
	@import "common/bootstrap.wxss";

	page {
		background-color: #f7f7f7;
		height: 100Vh;
		width: 100vw;
	}

	.text-primary {
		color: #09bb07 !important;
	}

	.fixed-bottom {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.text-link {
		color: #576b95;
	}

	.text-success {
		color: #09BB07;
	}

	.text-error {
		color: #e64340;
	}

	.wCenter {
		display: flex;
		justify-content: center;
	}

	.hCenter {
		display: flex;
		align-items: center;
	}

	.whCenter {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
