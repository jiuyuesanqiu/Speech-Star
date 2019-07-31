<script>
	import {
		mapMutations,mapGetters
	} from 'vuex';
	wx.cloud.init({
		env: 'product-yjcc'
	});
	const db = wx.cloud.database();
	export default {
		onLaunch: function() {
			let self = this;
			wx.cloud.callFunction({
				name: 'getOwnerUserInfo',
			}).then(res => {
				console.log('启动时请求用户信息',res)
				self.updateUserInfoField(res.result);
			})
		},
		methods: {
			...mapMutations(['updateUserInfoField'])
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
