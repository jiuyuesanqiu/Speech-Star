<template>
	<view class="page">
		<view class="d-flex bg-white border-bottom" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
			<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					更换头像
				</view>
			</view>
			<view class="d-flex align-center pr-2" style="">
				<image style="width: 128upx; height: 128upx;border-radius: 50%;" :src="userInfo.avatarUrl" mode=""></image>
			</view>
			<view class="d-flex align-center">
				<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
			</view>
		</view>
		<view class="d-flex bg-white border-bottom" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
			<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					昵称
				</view>
			</view>
			<view class="d-flex align-center pr-2" style="">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					{{userInfo.nickName}}
				</view>
			</view>
			<view class="d-flex align-center">
				<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
			</view>
		</view>
		<view class="d-flex bg-white border-bottom" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
			<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					性别
				</view>
			</view>
			<view class="d-flex align-center pr-2" style="">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;" v-if="userInfo.gender==2">
					女
				</view>
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;" v-else="userInfo.gender==1">
					男
				</view>
			</view>
			<view class="d-flex align-center">
				<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
			</view>
		</view>
		<view class="d-flex bg-white" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
			<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					所在城市
				</view>
			</view>
			<view class="d-flex align-center pr-2" style="">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					{{userInfo.province}}
				</view>
			</view>
			<view class="d-flex align-center">
				<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
	
			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo'])
		},
		onLoad() {
			wx.getUserInfo({
				success: (res) => {
					console.log(res);
				},
			})
        },
		methods: {
			toEdit(){
				uni.navigateTo({
					url: '../edit/edit'
				})
			}
		},
		components: {
			
		}
	};
</script>

<style scoped>
	.page{
		background-color: #fff;
	}
</style>
