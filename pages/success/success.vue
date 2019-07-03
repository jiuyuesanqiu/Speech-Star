<template>
	<view>
		<view class="d-flex justify-center">
			<view>
				<text style="font-size: 250upx;" class=" cuIcon-roundcheckfill text-green"></text>
			</view>
		</view>
		<view class="text-center text-xxl py-3">
			上传成功
		</view>
		<view class="mx-3 mt-5">
			<button class="weui-btn" type="primary" open-type="share">分享好友</button>
			<button class="weui-btn text-primary" type="default" @click="goHome">返回首页</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onShareAppMessage() {
			let item = uni.getStorageSync('parameter');
			return {
				title: item.title,
				path: '/pages/play/play?author=' + item.author +
						'&duration=' + item.duration +
						'&title=' + item.title +
						'&audioUrl=' + item.audioUrl+'&isShare=true',
				imageUrl:'../../static/share.png'
			}
		},
		methods: {
			goHome() {
				uni.switchTab({
					url: '../index/index'
				})
			}
		}
	}
</script>

<style>

</style>
