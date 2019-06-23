<script>
	wx.cloud.init({
		env: 'test-cjyjj'
	});
	export default {
		onLaunch: function() {
			wx.getUserInfo({
				success: function(res) {
					var userInfo = res.userInfo
					var nickName = userInfo.nickName
					var avatarUrl = userInfo.avatarUrl
					var gender = userInfo.gender //性别 0：未知、1：男、2：女
					var province = userInfo.province
					var city = userInfo.city
					var country = userInfo.country
				}
			})
		},
		onShow: function() {},
		onHide: function() {}
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
</style>
