<template>
	<view>
		<view>
			{{displayDuration}}/10:00
		</view>
		<button @tap="play" v-show="state==2&&!isPlay">
			试听
		</button>
		<button @tap="pause" v-show="state==2&&isPlay">
			试听中
		</button>
		<button open-type="getUserInfo" @tap="startRecord" v-show="state==0">
			开始录音
		</button>
		<button @tap="stopRecord" v-show="state==1">
			停止录音
		</button>
		<button  @tap="publish" v-show="state==2">
			发布
		</button>
		<button @tap="aginRecord" v-show="state==2">
			重录
		</button>
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

</style>
