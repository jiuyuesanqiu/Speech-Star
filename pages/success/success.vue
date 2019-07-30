<template>
	<view>
		<view class="text-center">
			<image class="logo" src="../../static/star.png" mode=""></image>
		</view>
		<view class="success text-center mt-3">
			<text>恭喜！节目已经发布成功</text>
		</view>
		<view class="group">
			<view class="mb-4">
				<nxButton openType="share" round>分享，轻松提升播放量</nxButton>
			</view>
			<nxButton plain round @click.native="goHome()">完成</nxButton>
		</view>
		<view class="d-flex justify-center mt-5">
			<view class="content d-flex">
				<view>
					<image class="cover" :src="coverSrc"></image>
				</view>
				<view class="right">
					<view class="title">
						<text>{{title}}</text>
					</view>
					<view class="time">
						<text>时长：{{durationText}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '../../common/util.js';
	import nxButton from '../../components/nx-button.vue';
	export default {
		data() {
			return {
				coverSrc:'',
				title:'',
				duration:''
			}
		},
		onShareAppMessage() {
			let item = uni.getStorageSync('parameter');
			return {
				title: item.title,
				path: '/pages/play/play?author=' + item.author +
					'&duration=' + item.duration +
					'&title=' + item.title +
					'&audioUrl=' + item.audioUrl + '&isShare=true',
				imageUrl: '../../static/share.png'
			}
		},
		methods: {
			goHome() {
				uni.switchTab({
					url: '../index/index'
				})
			}
		},
		onLoad(option) {
			this.coverSrc = option.coverSrc;
			this.title = option.title;
			this.duration = option.duration;
		},
		computed:{
			durationText(){
				return util.formatDuration(this.duration);
			}
		},
		components: {
			nxButton
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		height: 100Vh;
		width: 100vw;
	}

	.logo {
		width: 300upx;
		height: 300upx;
	}
	
	.group{
		padding: 0 90upx;
	}

	.success {
		color: rgba(51, 51, 51, 1);
		font-size: 17px;
		margin-bottom: 120upx;
	}

	.content {
		padding: 30rpx;
		width: 325px;
		height: 90px;
		border-radius: 6px;
		background-color: rgba(248, 248, 248, 1);

		.cover {
			width: 120rpx;
			height: 120rpx;
			border-radius: 6rpx;
		}

		.right {
			padding: 15rpx;
			padding-left: 30rpx;

			.title {
				color: rgba(16, 16, 16, 1);
				font-size: 13px;
				margin-bottom: 24rpx;
			}

			.time {
				color: rgba(152, 152, 152, 1);
				font-size: 13px;
			}
		}
	}
</style>
