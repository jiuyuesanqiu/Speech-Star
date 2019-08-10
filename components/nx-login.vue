<template>
	<view class="cu-modal" :class="show?'show':''">
		<view class="container cu-dialog">
			<view class="title">
				您还未登录
			</view>
			<view class="sub-title">
				请先登录后进行操作
			</view>
			<view>
				<image class="logo" src="../static/star.png" mode=""></image>
			</view>
			<view class="d-flex justify-between">
				<nxButton @click.native="$emit('cancel')" plain>暂不登录</nxButton>
				<nxButton @getuserinfo="getInfo" :loading="loading" open-type="getUserInfo">立即登录</nxButton>
			</view>
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
				loading:false
			};
		},
		methods: {
			getInfo(e) {
				if(this.loading) return;
				this.loading = true;
				if (e.detail.errMsg == "getUserInfo:ok") {
					let userInfo = { ...e.detail.userInfo,
						signature: '每天一分钟，演讲好轻松'
					};
					//上传用户信息到云数据库
					db.collection('user').add({
						data: userInfo
					}).then(res => {
						this.$emit('success');
						uni.showToast({
							title: '登录成功'
						})
						this.updateUserInfoField({ ...userInfo,
							_id: res._id
						});
						console.log('登录成功', res)
						this.loading = false;
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '登录失败'
					})
					console.log('登录失败')
					this.$emit('fail');
					this.loading = false;
				}
			},
			...mapMutations(['updateUserInfoField'])
		},
		props: {
			show: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 608upx;
		height: 750upx;
		line-height: 40upx;
		border-radius: 20upx;
		background: #FFFFFF;
		padding: 70upx 60upx;

		.title {
			font-size: 40upx;
			text-align: center;
		}

		.sub-title {
			color: rgba(127, 127, 127, 1);
			font-size: 28upx;
			text-align: center;
			margin-top: 20upx;
		}

		.logo {
			width: 300upx;
			height: 300upx;
			margin-top: 30upx;
			margin-bottom: 74upx;
		}

		.btn {
			width: 200upx;
			height: 90upx;
			border-radius: 50upx;
			font-size: 32upx;
		}

		.no-login {
			border: 2upx solid rgba(9, 187, 7, 1);
			color: #09bb07;
		}

		.login {
			background-color: #09bb07;
			color: #FFFFFF;
		}
	}
</style>
