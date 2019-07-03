<template>
	<view>
		<view class="padding" style="margin-top: 400upx;">
			<button class="weui-btn" type="primary" @getuserinfo="getInfo" open-type="getUserInfo">点击登录</button>
			<button class="weui-btn" type="default" @tap="goHome">返回首页</button>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	const db = wx.cloud.database();
	export default {
		data() {
			return {
				isTab: false,
				backUrl: ''
			}
		},
		onLoad(option) {
			this.isTab = option.isTab;
			this.backUrl = option.backUrl;
		},
		methods: {
			getInfo(e) {
				if (e.detail.errMsg == "getUserInfo:ok") {
					this.login(e.detail.userInfo);
					//上传用户信息到云数据库
					db.collection('user').add({
						data: e.detail.userInfo
					}).then(res => {
						console.log('保存用户数据到云数据库')
					})
					if (this.isTab) {
						uni.switchTab({
							url: this.backUrl
						})
					} else {
						uni.navigateTo({
							url: this.backUrl
						})
					}
				}
			},
			goHome() {
				uni.switchTab({
					url: '../index/index'
				})
			},
			...mapMutations(['login'])
		}
	}
</script>

<style>

</style>
