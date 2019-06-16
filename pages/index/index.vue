<template>
	<view>
		<view class="nx-list">
			<view v-for="(item,index) in speeches" :key="item._id" class="nx-item border-bottom">
				<view class="nx-title">
					{{item.title}}
				</view>
				<view class="nx-secondary flex justify-between">
					<view>
						{{formatDate(item.createTime)}} | {{formatDuration(item.duration)}}
					</view>
					<view class="nx-icon">
						<view class="d-inline-flex align-items-center" style="margin-left: 42upx;" @tap="play(item.fileID,index)">
							<text :class="active==index?'cuIcon-stop':'cuIcon-video'"></text>
							<text style="font-size: 22upx;">{{active==index?'暂停':'播放'}}</text>
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
	wx.cloud.init()
	const db = wx.cloud.database();
	const _ = db.command;
	//#ifdef MP-WEIXIN
	//设置会终止其他应用或微信内的音乐
	wx.setInnerAudioOption({
		mixWithOther: false
	});
	//#endif
	const innerAudioContext = uni.createInnerAudioContext()
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
				}],
				speeches: [],
				long: 0,
				active: -1, //当前被点击播放的按钮
			}
		},
		onShow() {
			//获取演讲数据,倒序排列
			db.collection('speeches').orderBy('createTime', 'desc').get().then(res => {
				this.speeches = res.data;
			})
		},
		methods: {
			formatDate(date) {
				return `${date.getMonth()+1}月${date.getDate()}日`
			},
			formatDuration(duration) {
				let m = Math.trunc(duration / 60) + '';
				let s = Math.trunc(duration % 60) + '';
				return `${m.padStart(2,'0')}分${s.padStart(2,'0')}秒`;
			},
			trigger(e) {
				uni.navigateTo({
					url: '../upload/upload'
				})
				e.open();
			},
			/**
			 * 播放音频
			 */
			play(fileID, index) {
				if (index == this.active) {
					innerAudioContext.stop();
					this.active = -1;
					return;
				}
				innerAudioContext.autoplay = true;
				innerAudioContext.src = fileID;
				this.active = index;
			},
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
		font-size: 42upx;
	}
</style>
