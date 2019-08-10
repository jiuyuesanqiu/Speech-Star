<template>
	<view>
		<view v-if="isLogin">
			<view class="d-flex bg-white topBox" @tap="toInformation">
				<view class="topContent">
					<image class="radius" :src="userInfo.avatarUrl"></image>
				</view>
				<view class="flex-grow-1 topNameBox">
					<view class="nickName">{{userInfo.nickName}}</view>
					<view class="text-gray signature" v-if="userInfo.signature!=''">{{userInfo.signature}}</view>
					<view class="text-gray signature" v-else>您还未设置个性签名哦</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray fontSize36"></text>
				</view>
			</view>
			<nx-cell icon="/static/disk.png" border title="我的作品" @tap="toMyVoice"></nx-cell>
		</view>

		<!-- 未登录状态 -->
		<view v-else @click="loginShow =true">
			<view class="d-flex bg-white topBox">
				<view class="topContent">
					<image class="radius" src="../../static/star.png"></image>
				</view>
				<view class="flex-grow-1 topNameBox">
					<view class="nickName">点击登录账户</view>
					<view class="text-gray signature">每天1分钟，演讲好轻松</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray"></text>
				</view>
			</view>
			<nx-cell icon="/static/disk.png" border title="我的作品"></nx-cell>
		</view>
		<button open-type="contact">
			<nx-cell icon="/static/service.png" border title="我要吐槽"></nx-cell>
		</button>
		<button open-type="share">
			<nx-cell icon="/static/toShare.png" title="分享好友"></nx-cell>
		</button>

		<nxLogin :show="loginShow" @success="loginSuccess" @cancel="loginShow=false"></nxLogin>
	</view>
</template>

<script>
	import nxCell from '../../components/nx-cell.vue';
	import {
		mapState,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				loginShow: false
			}
		},
		computed: {
			...mapState(['userInfo']),
			...mapGetters(['isLogin'])
		},
		methods: {
			toInformation() {
				uni.navigateTo({
					url: '../myInfo/myInfo'
				})
			},
			loginSuccess() {
				this.loginShow = false;
			},
			onShareAppMessage() {
				return {
					title: '演讲口才2',
					path: '/pages/index/index',
					imageUrl: '../../static/shareImg.jpg'
				}
			},
			toMyVoice() {
				uni.navigateTo({
					url: '../myVoice/myVoice'
				})
			},
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

	.topBox {
		padding: 68upx 26upx;
		margin-bottom: 16upx;
	}

	.topContent {
		padding: 20upx;
	}

	.topContent>image {
		width: 128upx;
		height: 128upx;
	}

	.topNameBox {
		padding: 20upx 0 20upx 6upx;
	}

	.nickName {
		font-size: 40upx;
		line-height: 68upx;
		height: 68upx;
	}

	.signature {
		font-size: 32upx;
		line-height: 60upx;
		height: 60upx;
	}

	.fontSize36 {
		font-size: 36upx;
	}
</style>
