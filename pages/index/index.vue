<template>
	<view>
		<view class="nx-list">
			<view class="nx-item border-bottom">
				<view class="nx-title">
					罗胖精选 | 从高考到贫血补铁，化学如何看世界？
				</view>
				<view class="nx-secondary flex justify-between">
					<view>
						6月9日|461573人学过
					</view>
					<view class="nx-icon">
						<text class="cuIcon-video nx-pr"></text>
						<view class="d-inline-flex align-items-center" style="margin-left: 42upx;">
							<text class="cuIcon-video"></text>
							<text style="font-size: 22upx;">播放</text>
						</view>
					</view>
				</view>
			</view>
			<view class="nx-item">
				<view class="nx-title">
					罗胖精选 | 从高考到贫血补铁，化学如何看世界？
				</view>
				<view class="nx-secondary flex justify-between">
					<view>
						6月9日|461573人学过
					</view>
					<view class="nx-icon">
						<text class="cuIcon-video nx-pr"></text>
						<view class="d-inline-flex align-items-center" style="margin-left: 40upx;">
							<text class="cuIcon-video"></text>
							<text style="font-size: 22upx;">播放</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger"></uni-fab>
	</view>
</template>

<script>
	import uniFab from '../../components/uni-fab/uni-fab.vue';
	export default {
		components: {
			uniFab
		},
		data() {
			return {
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'horizontal',
				pattern: {
					color: '#353535',
					backgroundColor: '#fff',
					selectedColor: '#09bb07',
					buttonColor: "#09bb07"
				},
				content: [{
					iconPath: '/static/uploadInactive.png',
					selectedIconPath: '/static/upload.png',
					text: '上传',
					active: true
				}]
			}
		},
		onLoad() {
			
		},
		methods: {
			trigger(e) {
				uni.navigateTo({
					url:'../upload/upload'
				})
				e.open();
			}
		}
	}
</script>

<style>
	.nx-list {
		padding: 20upx;
	}

	.nx-item {
		background-color: #FFFFFF;
		padding: 30upx 32upx;
		line-height: 46upx;
	}

	.nx-title {
		font-size: 30upx;
		padding: 6upx 46upx 6upx 0;
	}

	.nx-secondary {
		font-size: 24upx;
		line-height: 38upx;
		color: #888888;
		margin-top: 12upx;
	}

	.nx-icon {
		font-size: 38upx;
	}
</style>
