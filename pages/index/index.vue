<template>
	<view>
		<view class="nx-list">
			<view @tap="navigateTo(item)" v-for="(item,index) in speeches" :key="item._id" class="nx-item border-bottom">
				<view class="nx-title">
					{{item.author}} | {{item.title}}
				</view>
				<view class="nx-secondary flex justify-between">
					<view>
						{{formatDate(item.createTime)}} | {{formatDuration(item.duration)}}
					</view>
					<view class="nx-icon">
						<view class="d-inline-flex align-items-center" :class="active==index?'text-green':''" style="margin-left: 42upx;"
						 @tap="play(item.fileID,index,item.duration)">
							<text :class="active==index?'cuIcon-stop':'cuIcon-video'"></text>
							<text style="font-size: 22upx;">{{active==index?'停止':'播放'}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
		 @trigger="trigger"></uni-fab>
		<view class="cu-load" :class="!isLoad?'loading':'over'"></view>
	</view>
</template>

<script>
	const db = wx.cloud.database();
	const _ = db.command;
	//#ifdef MP-WEIXIN
	//设置会终止其他应用或微信内的音乐
	wx.setInnerAudioOption({
		mixWithOther: false,
		obeyMuteSwitch: false //不遵循IOS静音开关
	});
	//#endif
	const innerAudioContext = uni.createInnerAudioContext()
	let startPage = 0; //起始页数
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
					selectedColor: '#353535',
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
				isLoad: false,
				src: 'cloud://test-cjyjj.7465-test-cjyjj-1259470932/156085715105895.m4a',
				duration: 65.806,
				now: 0
			}
		},
		onLoad() {
			startPage = 0;
			this.speeches = [];
			this.getNextPage();
		},
		onReachBottom() {
			if (!this.isLoad) {
				this.getNextPage();
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			startPage = 0;
			this.isLoad = false;
			this.speeches = [];
			this.getNextPage();
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
			play(fileID, index, duration) {
				this.duration = duration;
				this.src = fileID;
				console.log(this.src, duration)
				// if (index == this.active) {
				// 	innerAudioContext.stop();
				// 	this.active = -1;
				// 	return;
				// }
				// innerAudioContext.autoplay = true;
				// innerAudioContext.src = fileID;
				// innerAudioContext.play()
				// this.active = index;
			},
			//page related
			getNextPage() {
				//获取演讲数据,倒序排列
				db.collection('speeches').orderBy('createTime', 'desc').skip(startPage).limit(20).get().then(res => {
					this.speeches = this.speeches.concat(res.data);
					startPage += 20;
					uni.stopPullDownRefresh();
					if (res.data.length < 20) {
						this.isLoad = true;
						return;
					}
				})
			},
			navigateTo(item) {
				console.log(item.author);
				uni.navigateTo({
					url: '../play/play' + '?author=' + item.author +
						'&createTime=' + item.createTime +
						'&duration=' + item.duration +
						'&title=' + item.title +
						'&audioUrl=' + item.fileID
				})
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
		font-size: 42upx;
	}
</style>
