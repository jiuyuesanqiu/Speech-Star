<template>
	<view class="page">
		<view class="whCenter recordingTop">
			<image class="topImg" src="../../static/microphone.jpg" alt=""></image>
		</view>
		<view class="wave" v-if="state==0">
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
		</view>
		<view class="wave" v-if="state==1">
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
			<waveMove></waveMove>
		</view>
		<view class="wave" v-if="state==2">
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
			<wave></wave>
		</view>
		<view class="duration">
			<text>{{displayDuration}}</text>
			<text>10:00</text>
		</view>
		<view class="footer">
			<view class="footerL">
				<image class="playImg" @tap="play" v-show="state==2&&!isPlay" src="../../static/playAudio.png"></image>
				<view class="playText" v-show="state==2&&!isPlay">试听</view>
				<image class="playImg" @tap="pause" v-show="state==2&&isPlay" src="../../static/timeOut.png"></image>
				<view class="playText" v-show="state==2&&isPlay">试听中</view>
			</view>
			<view class="footerM">
				<view class="record">
					<image class="recordImg" @tap="startRecord" v-show="state==0" src="../../static/audioFill.png"></image>
					<image class="recordImg" @tap="stopRecord" v-show="state==1" src="../../static/audioEmpty.png"></image>
					<text class="recordIssue" @tap="publish" v-show="state==2">发布</text>
				</view>
				<view class="recordText" v-show="state==0">点击开始录音</view>
				<view class="recordText" v-show="state==1">点击停止录音</view>
			</view>
			<view class="footerR">
				<image class="footerRImg" @tap="aginRecord" v-show="state==2" src="../../static/reload.png"></image>
				<view class="reload" v-show="state==2">重录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wave from '../../components/wave.vue'
	import waveMove from '../../components/waveMove.vue'
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
		components: {
			wave,
			waveMove
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
					url: `../publish/publish?tempSrc=${tempSrc}&duration=${this.duration}`
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

	.recordingTop {
		width: 100%;
		height: 60%;
		background-color: #F8F8F8;
	}

	.topImg {
		width: 50%;
		height: 45%;
		border-radius: 20upx;
	}

	.wave {
		display: flex;
		width: 100%;
		height: 15.10%;
	}

	.duration {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
		color: #a3a6af;
		font-size: 24upx;
		border-top: 4px solid #74ED74;
		height: 3.356%;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		height: 16.6%;
		margin-top: 4%;
		margin-bottom: 4%;
	}

	.footerL,
	.footerR {
		display: flex;
		width: 30%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.footerM {
		display: flex;
		width: 40%;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding-top: 10upx;
	}

	.playImg {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}

	.playText {
		color: #7d7f82;
		font-size: 24upx;
	}

	.record {
		border: 2px solid #09BB07;
		border-radius: 50%;
		width: 137upx;
		height: 137upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.recordImg {
		width: 104upx;
		height: 104upx;
		border-radius: 50%;
	}

	.recordIssue {
		width: 104upx;
		height: 104upx;
		line-height: 104upx;
		text-align: center;
		border-radius: 50%;
		color: #09BB07;
		font-size: 32upx;
		font-weight: bold;
	}

	.recordText {
		color: #7d7f82;
		font-size: 24upx;
		padding-top: 20upx;
	}

	.footerRImg {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
	}

	.reload {
		color: #7d7f82;
		font-size: 24upx;
	}
</style>
