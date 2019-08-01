<template>
	<view class="page">
		<view class="whCenter duration">
			<text>{{displayDuration}}</text>
		</view>

		<view class="footer">
			<view class="footerL">
				<image class="playImg" @tap="play" v-show="state==2&&!isPlay" src="../../static/headset.png"></image>
				<view class="playText" v-show="state==2&&!isPlay">试听</view>
				<image class="playImg" @tap="pause" v-show="state==2&&isPlay" src="../../static/timeOut.png"></image>
				<view class="playText" v-show="state==2&&isPlay">试听中</view>
			</view>
			<view class="footerM">
				<!-- <view class="record"> -->
				<image class="recordImg" @tap="startRecord" v-show="state==0" src="../../static/audioFill.png"></image>
				<image class="stopImg" @tap="stopRecord" v-show="state==1" src="../../static/audioEmpty.png"></image>
				<image class="recordImg publish" @tap="publish" v-show="state==2" src="../../static/issue.png"></image>
				<!-- </view> -->
				<view class="recordText" v-show="state==0">录音</view>
				<view class="recordText" v-show="state==1">停止录音</view>
				<view class="recordText" v-show="state==2">发布</view>
			</view>
			<view class="footerR">
				<image class="playImg" @tap="aginRecord" v-show="state==2" src="../../static/reload.png"></image>
				<view class="reload" v-show="state==2">重录</view>
			</view>
		</view>
	</view>
</template>

<script>
	let {
		formatDuration
	} = require('../../common/util.js');
	//获取全局录音器
	const recorderManager = uni.getRecorderManager();
	const options = {
		duration: 600000,
		sampleRate: 48000,
		encodeBitRate: 320000,
		format:'mp3'
	}
	recorderManager.onStart(function() {
		console.log('开始录音')
	})
	recorderManager.onResume(() => {
		console.log('录音继续')
	})
	recorderManager.onPause(function() {
		console.log('录音暂停')
	})

	//获取音乐播放器
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;

	let timeoutID = 0;
	export default {
		data() {
			return {
				duration: 0,
				state: 0, //0代表未开始，1代表开始录音，2代表停止录音，3代表重新录音
				isPlay: false,
				tempSrc: ''
			}
		},
		computed: {
			displayDuration() {
				return formatDuration(this.duration);
			}
		},
		onUnload() {
			this.stopRecord();
			innerAudioContext.stop();
		},
		onHide() {
			this.stopRecord();
			innerAudioContext.stop();
		},
		onLoad() {
			recorderManager.onStop(({
				tempFilePath,
				duration,
				fileSize
			}) => {
				this.tempSrc = tempFilePath;
				this.stopRecord();
			})
			recorderManager.onInterruptionBegin(()=>{
				this.stopRecord();
				innerAudioContext.stop();
			})
		},
		methods: {
			timedCount() {
				this.duration += 1;
				timeoutID = setTimeout(() => {
					this.timedCount()
				}, 1000);
			},
			/**
			 * 开始录音
			 */
			startRecord() {
				const self = this;
				uni.getSetting({
					success(res) {
						if (!res.authSetting['scope.record']) {
							uni.authorize({
								scope: 'scope.record',
								success() {
									//开始录音
									recorderManager.start(options);
									self.state = 1;
									//开始计时
									timeoutID = setTimeout(() => {
										self.timedCount()
									}, 1000);
								},
								fail() {
									uni.showModal({
										showCancel: false,
										content: '请先打开录音开关',
										success() {
											uni.openSetting()
										}
									})
								}
							})
						} else {
							//开始录音
							recorderManager.start(options);
							self.state = 1;
							//开始计时
							timeoutID = setTimeout(() => {
								self.timedCount()
							}, 1000);
						}
					}
				})
			},
			/**
			 * 停止录音
			 */
			stopRecord() {
				recorderManager.stop();
				this.state = 2;
				clearTimeout(timeoutID);
			},
			/**
			 * 试听播放
			 */
			play() {
				innerAudioContext.src = this.tempSrc;
				innerAudioContext.onEnded(() => {
					this.isPlay = false;
				})
				innerAudioContext.onPause(() => {
					this.isPlay = false;
				})
				innerAudioContext.onStop(() => {
					this.isPlay = false;
				})
				this.isPlay = true;
				innerAudioContext.play();
			},
			/**
			 * 试听暂停
			 */
			pause() {
				innerAudioContext.pause();
			},
			/**
			 * 重新录制
			 */
			aginRecord() {
				this.startRecord();
				innerAudioContext.stop();
				this.duration = 0;
			},
			/**
			 * 发布
			 */
			publish() {
				uni.setStorageSync('file', {
					tempSrc: this.tempSrc,
					duration: this.duration
				})
				uni.navigateTo({
					url: '../publish/publish'
				})
			}
		}
	}
</script>

<style scoped>
	.page {
		background-color: #fff;
		height: 100%;
	}

	button {
		all: initial
	}

	button:after {
		all: initial
	}

	.duration {
		color: #09BB07;
		font-size: 140upx;
		height: 30%;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		height: 23%;
		margin-top: 66%;
	}

	.footerL,
	.footerR {
		display: flex;
		width: 26%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 78upx;
	}

	.footerM {
		display: flex;
		width: 40%;
		flex-direction: column;
		align-items: center;
	}

	.playImg {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		padding: 30upx;
		margin-bottom: 32upx;
		box-shadow: 0 0 10px 0 rgba(9, 187, 7, 1);
	}

	.playText {
		color: #b2b2b2;
		font-size: 32upx;
	}

	.recordImg {
		width: 200upx;
		height: 200upx;
		padding: 30upx;
		border-radius: 50%;
		box-shadow: 0 0 10px 0 rgba(170, 170, 170, 1);
	}

	.publish {
		box-shadow: 0 0 10px 0 rgba(9, 187, 7, 1);
	}

	.stopImg {
		width: 200upx;
		height: 200upx;
		border-radius: 50%;
	}

	.recordText {
		color: #b2b2b2;
		font-size: 32upx;
		padding-top: 32upx;
	}

	.reload {
		color: #b2b2b2;
		font-size: 32upx;
	}
</style>
