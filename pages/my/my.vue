<template>
	<view>
		<view v-if="isLogin">
			<view class="d-flex bg-white" @tap="toInformation" style="padding: 68upx 26upx;margin-bottom: 16upx;">
				<view style="padding: 20upx;">
					<image style="width: 128upx; height: 128upx;" class="radius" :src="userInfo.avatarUrl"></image>
				</view>
				<view style="padding: 20upx 0 20upx 6upx;" class="flex-grow-1">
					<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
						{{userInfo.nickName}}
					</view>
					<view style="font-size: 32upx;line-height: 60upx;height: 60upx;" class="text-gray">
						走别人的路，让别人无路可走
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
			<nx-cell icon="/static/disk.png" border title="我的作品"></nx-cell>
		</view>
		
		<!-- 未登录状态 -->
		<view v-else @click="loginShow =true">
			<view class="d-flex bg-white" style="padding: 68upx 26upx;margin-bottom: 16upx;">
				<view style="padding: 20upx;">
					<image style="width: 128upx; height: 128upx;" class="radius" src="../../static/star.png"></image>
				</view>
				<view style="padding: 20upx 0 20upx 6upx;" class="flex-grow-1">
					<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
						点击登录账户
					</view>
					<view style="font-size: 32upx;line-height: 60upx;height: 60upx;" class="text-gray">
						每天十分钟，演讲好轻松
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
			<nx-cell icon="/static/disk.png" border title="我的作品"></nx-cell>
		</view>
		<button open-type="contact">
			<nx-cell icon="/static/service.png" title="我要吐槽"></nx-cell>
		</button>

		<nxLogin :show="loginShow" @success="loginSuccess" @cancel="loginShow=false"></nxLogin>
	</view>
</template>

<script>
	import nxLogin from '../../components/nx-login.vue';
	import {
		mapState
	} from 'vuex';
	import nxCell from '../../components/nx-cell.vue';
	export default {
		data() {
			return {
				loginShow: false
			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo'])
		},
		methods: {
			toInformation() {
				uni.navigateTo({
					url: '../myInfo/myInfo'
				})
			},
			loginSuccess(){
				this.loginShow = false;
			}
		},
		components: {
			nxCell,
			nxLogin
		}
	}
</script>

<style scoped>
	/* 恢复button默认值 */
	button {
		all: initial;
	}

	button:after {
		all: inherit
	}
</style>
