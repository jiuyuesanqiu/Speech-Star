<template>
	<view class="page">
		<view class="speakTop">
			<image class="topImg" src="../../static/microphone.jpg" alt="" />
			<view class="topText">演讲口才</view>
		</view>
		<view class="topDes">
			欢迎进入演讲圈，来和我们一起演讲吧！
		</view>
		<view class="topJurisdiction" v-if="isLogin"></view>
		<view class="topJurisdiction" v-else>
			请完成微信授权以继续使用
		</view>
		<view class="jurisdiction" v-if="isLogin">
			<button class="getUserInfo" @tap="toRecording">开始演讲</button>
		</view>
		<view class="jurisdiction" v-else>
			<button class="getUserInfo" @getuserinfo="getInfo" open-type="getUserInfo">授权登录</button>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				isLogin:false
			}
		},
		methods: {
			toRecording() {
				uni.navigateTo({
					url: '../recording/recording'
				})
			}
		},
		onLoad (){
			var that = this;
			// 查看是否授权
			wx.getSetting({
				success: function (res) {
					if (res.authSetting['scope.userInfo']) {
						wx.getUserInfo({
							success: function (res) {
								//从数据库获取用户信息
								console.log(res);
								that.isLogin = true;
								//用户已经授权过
								// wx.switchTab({
								// 	url: '/pages/index/index'
								// })
							}
						});
					}
				}
			})
		}
	}
</script>
<style scoped>
	button {
		all: initial
	}

	button:after {
		all: initial
	}

	.page {
		background-color: #fff;
		height: 100%;
	}

	.speakTop {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 400upx;
	}

	.topImg {
		width: 158upx;
		height: 158upx;
		border-radius: 24%;
	}

	.topText {
		color: #292a2e;
		font-size: 34upx;
		font-weight: bold;
		margin-top: 20upx;
	}

	.topDes {
		font-size: 30upx;
		color: #000;
		text-align: center;
	}

	.topJurisdiction {
		font-size: 22upx;
		color: #838689;
		text-align: center;
		height: 90upx;
		line-height: 90upx;
		margin-top: 10upx;
	}

	.jurisdiction {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.getUserInfo {
		color: #fff;
		font-size: 32upx;
		background-color: #09BB07;
		height: 88upx;
		width: 77%;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 44upx;
	}
</style>
