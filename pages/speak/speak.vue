<template>
	<view class="page">
		<view class="d-flex align-center justify-center flex-column speakTop">
			<image class="topImg" src="../../static/star.png" alt="" />
			<view class="topText">演讲星球</view>
		</view>
		<view class="topDes">每天一分钟，演讲好轻松</view>
		<view class="d-flex justify-center mt-5">
			<button class="getUserInfo al"  hover-class="clickActive" hover-start-time="1" @tap="toRecording">开始演讲</button>
		</view>
		<nxLogin :show="loginShow" @success="loginSuccess" @cancel="loginShow=false"></nxLogin>
	</view>
</template>
<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				loginShow: false
			}
		},
		computed: {
			...mapGetters(['isLogin'])
		},
		methods: {
			toRecording() {
				if (!this.isLogin) {
					this.loginShow = true;
					return;
				}
				uni.navigateTo({
					url: '../recording/recording'
				})
			},
			loginSuccess() {
				this.loginShow = false;
				uni.navigateTo({
					url: '../recording/recording'
				})
			}
		},
		components: {
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
		height: 400upx;
	}

	.topImg {
		width: 210upx;
		height: 210upx;
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

	.getUserInfo {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 32upx;
		background-color: #09BB07;
		height: 88upx;
		width: 77%;
		border-radius: 44upx;
		box-shadow: 0 0 10px 0 rgba(170, 170, 170, 1);
	}
	.clickActive {
		background-color: #089B08;
		border-radius: 44upx;
	}
</style>
