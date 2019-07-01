<template>
	<view>
		<view class="d-flex bg-white" @tap="toInformation" style="padding: 68upx 26upx;margin-bottom: 16upx;">
			<view style="padding: 20upx;">
				<image style="width: 128upx; height: 128upx;" class="radius" :src="userInfo.avatarUrl" mode=""></image>
			</view>
			<view style="padding: 20upx 0 20upx 6upx;" class="flex-grow-1">
				<view style="font-size: 40upx;line-height: 68upx;height: 68upx;">
					{{userInfo.nickName}}
				</view>
				<view style="font-size: 32upx;line-height: 60upx;height: 60upx;" class="text-gray">
					倔强青铜
				</view>
			</view>
			<view class="d-flex align-center">
				<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
			</view>
		</view>
		<nx-cell icon="/static/disk.png" border title="我的作品"></nx-cell>
		<button open-type="contact">
			<nx-cell icon="/static/service.png" title="我要吐槽"></nx-cell>
		</button>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import nxCell from '../../components/nx-cell.vue';
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo'])
		},
		onLoad() {
			if(!this.isLogin){
				uni.redirectTo({
					url:'../login/login?backUrl=../my/my&isTab=true'
				})
			}
		},
		methods: {
			toInformation() {
				uni.navigateTo({
					url: '../myInfo/myInfo'
				})
			}
		},
		components: {
			nxCell
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
