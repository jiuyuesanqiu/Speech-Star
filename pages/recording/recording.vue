<template>
	<view class="page" style="height: 100%;">
		<view class="whCenter" style="width:100%;height: 62.597%;background-color: #f6f6f6;">
			<img src="../../static/microphone.jpg" alt="" style="width:50%;height:50%;border-radius: 20upx;">
		</view>
		<view style="width: 100%;height: 15.10%;font-size: 0;" v-show="state==0">
			<img src="../../static/timg1.png" alt="" style="width: 100%;height:100%">
		</view>
		<view style="width: 100%;height: 15.10%;font-size: 0;background-color: #FFFBE6;" v-show="state==1">
			<img src="../../static/timg11.gif" alt=""  style="width: 100%;height:100%">
		</view>
		<!-- <view class="bg-gradual-yellow" style="width: 100%;height: 15.10%;font-size: 0;">
			<image src="../../static/timg1.gif" class="gif-black response" style="width: 100%;height:100%"></image>
		</view> -->
		<view style="width: 100%;height: 15.10%;font-size: 0;" v-show="state==2">
			<img src="../../static/timg1.png" alt="" style="width: 100%;height:100%">
		</view>
		<view style="display: flex;justify-content: space-between;align-items: center;padding: 0 30upx;color: #a3a6af;font-size: 24upx;border-top: 4px solid #fff3ea;height: 3.356%;">
			<text>{{displayDuration}}</text>
			<text>10:00</text>
		</view>

		<view style="display: flex;justify-content: space-between;padding: 0 74upx;height: 16.6%;margin-top: 4%;">
			<view class="left" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
				<image @tap="play" v-show="state==2&&!isPlay" src="../../static/playAudio.png" style="width: 60upx;height: 60upx;border-radius: 50%;"></image>
				<view v-show="state==2&&!isPlay" style="color: #7d7f82;font-size: 24upx;">试听</view>
				<image @tap="pause" v-show="state==2&&isPlay" src="../../static/timeOut.png" style="width: 60upx;height: 60upx;border-radius: 50%;"></image>
				<view v-show="state==2&&isPlay" style="color: #7d7f82;font-size: 24upx;">试听中</view>
			</view>
			<view class="middle" style="display: flex;flex-direction: column;">
				<view style="border: 2px solid #ffa72e;border-radius: 50%;width: 137upx;height: 137upx;display: flex;justify-content: center;align-items: center;">
					<image @tap="startRecord" v-show="state==0" src="../../static/audioFill.png" style="width: 104upx;height: 104upx;border-radius: 50%;"></image>
					<image @tap="stopRecord" v-show="state==1" src="../../static/audioEmpty.png" style="width: 104upx;height: 104upx;border-radius: 50%;"></image>
					<text @tap="publish" v-show="state==2" style="width: 104upx;height: 104upx;line-height: 104upx;text-align: center;border-radius: 50%;color: #ffaa33;font-size: 32upx;font-weight: bold;">发布</text>
				</view>
				<view v-show="state==0" style="color: #7d7f82;font-size: 24upx;padding-top: 20upx;">点击开始录音</view>
				<view v-show="state==1" style="color: #7d7f82;font-size: 24upx;padding-top: 20upx;">点击停止录音</view>
			</view>
			<view class="right" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
				<image @tap="aginRecord" v-show="state==2" src="../../static/reload.png" style="width: 60upx;height: 60upx;border-radius: 50%;"></image>
				<view v-show="state==2" style="color: #7d7f82;font-size: 24upx;">重录</view>
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
		sampleRate: 48000,
		encodeBitRate: 320000
	}
	let tempSrc = '';
	recorderManager.onStop(({
		tempFilePath,
		duration,
		fileSize
	}) => {
		tempSrc = tempFilePath;
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
				isPlay: false
			}
		},
		computed: {
			displayDuration() {
				return formatDuration(this.duration);
			}
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
				//开始录音
				recorderManager.start();
				this.state = 1;
				//开始计时
				timeoutID = setTimeout(() => {
					this.timedCount()
				}, 1000);
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
				innerAudioContext.src = tempSrc;
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
				uni.navigateTo({
					url: `../publish/publish?tempSrc=${tempSrc}`
				})
			}
		}
	}
</script>

<style>
	.page {
		background-color: #fff;
	}

	button {
		all: initial
	}

	button:after {
		all: initial
	}

	.whCenter {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hCenter {
		display: flex;
		align-items: center;
	}

	.wCenter {
		display: flex;
		justify-content: center;
	}
</style>
