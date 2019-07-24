<template>
	<view>
		<view v-if="noControl" class="noControl d-flex align-items-center" @click="onControlClick">
			<view class="play-cion">
				<text v-show="!isPlay&&!isLoading" class="cuIcon-video"></text>
				<text v-show="isPlay&&!isLoading" class="cuIcon-stop"></text>
				<div class="loading-icon">
					<text v-show="isLoading" class="cuIcon-loading1"></text>
				</div>
			</view>
			<text class="ml-1">60"</text>
		</view>
		<view v-else class="container d-flex">
			<view class="left">
				<text v-show="!isPlay&&!isLoading" class="cuIcon-video play-icon" @click="play"></text>
				<text v-show="isPlay&&!isLoading" class="cuIcon-stop stop-icon" @click="paused"></text>
				<div class="loading-icon">
					<text v-show="isLoading" class="cuIcon-loading1" @click="paused"></text>
				</div>
			</view>
			<view class="right flex-grow-1">
				<view class="title">{{title}}</view>
				<slider :max="duration" @change="sliderChange" @changing="sliderChanging" block-size="8" :value="currentTime"></slider>
				<view class="time d-flex justify-between">
					<text>{{currentTimeText}}</text>
					<text>{{durationText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let util = require('../common/util.js');
	const backgroundAudioManager = wx.getBackgroundAudioManager();
	let activePlayer = "";

	export default {
		data() {
			return {
				currentTime: 0,
				isPlay: false,
				isLoading: false, //音频加载中
				intervalId: 0
			};
		},
		created() {

		},
		computed: {
			currentTimeText() {
				return util.formatDuration(this.currentTime);
			},
			durationText() {
				return util.formatDuration(this.duration);
			}
		},
		methods: {
			onControlClick(){
				if(this.isLoading){
					return;
				}
				if(this.isPlay){
					this.paused();
				}else{
					this.play();
				}
			},
			check() {
				//判断背景音频管理器当前是否播放的是否为此组件内的音乐
				if (backgroundAudioManager.src != this.src) {
					//判断背景音频是否暂停
					if (!backgroundAudioManager.paused && activePlayer != "") {
						activePlayer.setPlay(false);
					}
					backgroundAudioManager.title = this.title;
					backgroundAudioManager.singer = this.singer;
					backgroundAudioManager.startTime = this.currentTime;
					//监听音频能够播放的事件
					backgroundAudioManager.onWaiting(() => {
						console.log(this.title, "加载中")
						this.isLoading = true;
					})
					backgroundAudioManager.onCanplay(() => {
						console.log(this.title, "能播放")
						this.isLoading = false;
					})
					backgroundAudioManager.onPlay(() => {
						console.log(this.title, "播放中")
						this.isPlay = true;
						this.isLoading = false;
					})
					backgroundAudioManager.onPause(() => {
						console.log(this.title, "暂停了")
						this.isPlay = false;
					})
					backgroundAudioManager.src = this.src;
					activePlayer = this;
				}
			},
			/**
			 * 播放音频
			 */
			play() {
				this.check();
				backgroundAudioManager.play();
				this.updateCurrentTime();
			},
			/**
			 * 暂停音频
			 */
			paused() {
				backgroundAudioManager.pause();
				clearInterval(this.intervalId)
			},
			/**
			 * 停止音频
			 */
			stop(){
				backgroundAudioManager.stop();
			},
			/**
			 * 滚动后触发
			 */
			sliderChange({
				detail
			}) {
				this.check();
				backgroundAudioManager.seek(detail.value);
			},
			/**
			 * 拖动中触发
			 */
			sliderChanging({
				detail
			}) {
				this.currentTime = detail.value;
			},
			setPlay(isPlay) {
				this.isPlay = isPlay;
				clearInterval(this.intervalId);
			},
			//
			updateCurrentTime() {
				let intervalId = setInterval(() => {
					this.currentTime++;
				}, 1000)
				this.intervalId = intervalId;
			}
		},
		props: {
			src: String, //音频播放地址
			title: String, //音频标题
			duration: String, //音频时长
			coverImgUrl: String, //封面图
			singer: String, //歌手名
			noControl: {
				type: Boolean,
				default: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	slider {
		all: initial;
	}

	@-webkit-keyframes loading {

		0% {
			-webkit-transform: rotate(0deg);
		}

		25% {
			-webkit-transform: rotate(90deg);
		}

		50% {
			-webkit-transform: rotate(180deg);
		}

		75% {
			-webkit-transform: rotate(270deg);
		}

		100% {
			-webkit-transform: rotate(360deg);
		}

	}

	.container {
		width: 358px;
		height: 98px;
		border-radius: 2px;
		color: rgba(16, 16, 16, 1);
		border: 1px solid rgba(230, 230, 230, 1);
		padding: 15px 20px;

		.left {
			padding-right: 15px;
			font-size: 50px;
			color: #51AA37;

			.loading-icon {
				animation: loading .5s linear infinite;
				font-size: 50px;
			}
		}

		.right {
			.title {
				color: rgba(16, 16, 16, 1);
				font-size: 16px;
				padding-bottom: 10px;
			}

			.time {
				color: rgba(178, 178, 178, 1);
				font-size: 14px;
			}
		}
	}

	.noControl {
		width: 205px;
		height: 40px;
		border-radius: 5px;
		background-color: rgba(248, 248, 248, 1);
		padding-left: 25px;
		font-size: 14px;
		
		.play-cion{
			font-size: 20px;
		}
	}
</style>
