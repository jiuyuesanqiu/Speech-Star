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
				<view class="btn no-login d-flex align-center justify-center" @click="$emit('cancel')">
					暂不登录
				</view>
				<view class="btn login d-flex align-center justify-center">
					<button type="primary" @getuserinfo="getInfo" open-type="getUserInfo">立即登录</button>
				</view>
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
			};
		},
		methods: {
			getInfo(e) {
				if (e.detail.errMsg == "getUserInfo:ok") {
					let userInfo = {...e.detail.userInfo,signature:'每天一分钟，演讲好轻松'};
					//上传用户信息到云数据库
					db.collection('user').add({
						data: userInfo
					}).then(res => {
						this.$emit('success');
						uni.showToast({
							title:'登录成功'
						})
						this.updateUserInfoField({...userInfo,_id:res._id});
						console.log('登录成功',res)
					})
				}else{
					uni.showToast({
						icon:'none',
						title:'登录失败'
					})
					console.log('登录失败')
					this.$emit('fail');
				}
			},
			...mapMutations(['updateUserInfoField'])
		},
		props:{
			show:{
				type:Boolean,
				default:false
			}
		}
	}
</script>

<style lang="scss" scoped>
	button {
		all: initial;
		color: #FFFFFF;
	}
	
	button:after{
		all: initial;
	}
	
	button:hover{
		all: initial;
		color: #FFFFFF;
	}

	.container {
		width: 304px;
		height: 375px;
		line-height: 20px;
		border-radius: 10px;
		background: #FFFFFF;
		padding: 35px 30px;

		.title {
			font-size: 20px;
			text-align: center;
		}

		.sub-title {
			color: rgba(127, 127, 127, 1);
			font-size: 14px;
			text-align: center;
			margin-top: 10px;
		}

		.logo {
			width: 150px;
			height: 150px;
			margin-top: 15px;
			margin-bottom: 37px;
		}

		.btn {
			width: 100px;
			height: 45px;
			border-radius: 25px;
			font-size: 16px;
		}

		.no-login {
			border: 1px solid rgba(9, 187, 7, 1);
			color: #09bb07;
		}

		.login {
			background-color: #09bb07;
			color: #FFFFFF;
		}
	}
</style>
