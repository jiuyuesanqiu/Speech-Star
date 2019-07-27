<template>
	<view>
		<view v-if="!isBackgroundAudio" class="noControl d-flex align-items-center" @click="playAudio">
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
	export default {
		data() {
			return {
				isLoading: false,
				isPlay: false,
				isEnded: false,
				intervalId: 0,
				currentTime: 0,
				isPlayed:false,//是否播放过至少一次
			};
		},
		computed: {
			currentTimeText() {
				return util.formatDuration(this.currentTime);
			},
			durationText() {
				return util.formatDuration(this.duration);
			},
			isActive() {
				if (this.src == this.activeSrc) {
					if (!backgroundAudioManager.paused && this.intervalId == 0 && !this.isPlayed) {
						this.currentTime = backgroundAudioManager.currentTime;
						this.isPlay = true;
						this.updateCurrentTime();
						this.listener();
					}
					if(backgroundAudioManager.paused && !this.isPlayed){
						this.currentTime = backgroundAudioManager.currentTime;
					}
					return true;
				} else {
					this.init();
					return false;
				}
			}
		},
		methods: {
			init() {
				this.isLoading = false;
				this.isPlay = false;
				clearInterval(this.intervalId);
			},
			/**
			 * 播放背景音频
			 */
			play() {
				this.isPlayed = true;
				if (this.isActive && !this.isEnded) {
					backgroundAudioManager.play();
				} else {
					backgroundAudioManager.title = this.title;
					backgroundAudioManager.singer = this.singer;
					backgroundAudioManager.startTime = this.currentTime;
					backgroundAudioManager.src = this.src;
					this.$emit('changeActive', this.src);
				}
				this.listener();
			},
			/**
			 * 监听事件
			 */
			listener() {
				//监听音频能够播放的事件
				backgroundAudioManager.onWaiting(() => {
					this.isLoading = true;
				})
				backgroundAudioManager.onCanplay(() => {
					this.isLoading = false;
				})
				backgroundAudioManager.onPlay(() => {
					this.isPlay = true;
					this.isLoading = false;
					this.updateCurrentTime();
				})
				backgroundAudioManager.onPause(() => {
					this.isPlay = false;
					clearInterval(this.intervalId);
					this.intervalId = 0;
				})
				backgroundAudioManager.onStop(() => {
					console.log("背景音频被停止")
				});
				backgroundAudioManager.onEnded(() => {
					this.isPlay = false;
					this.currentTime = 0;
					clearInterval(this.intervalId);
					this.intervalId = 0;
					this.isEnded = true;
				});
			},
			/**
			 * 暂停音频
			 */
			paused() {
				backgroundAudioManager.pause();
			},
			/**
			 * 停止音频
			 */
			stop() {
				backgroundAudioManager.stop();
			},
			/**
			 * 滚动后触发
			 */
			sliderChange({
				detail
			}) {
				this.currentTime = detail.value;
				if (this.isActive) {
					backgroundAudioManager.seek(detail.value);
				} else {
					this.play();
				}
			},
			/**
			 * 拖动中触发
			 */
			sliderChanging({
				detail
			}) {
				this.currentTime = detail.value;
			},
			/**
			 * 更新时间
			 */
			updateCurrentTime() {
				if (this.intervalId != 0) {
					return;
				}
				let intervalId = setInterval(() => {
					this.currentTime = backgroundAudioManager.currentTime;
				}, 1000)
				this.intervalId = intervalId;
			},
			playAudio() {
				if (!this.isPlay && !this.isLoading) {
					this.play();
				} else if (this.isPlay && !this.isLoading) {
					this.paused();
				}
			}
		},
		props: {
			src: String, //音频播放地址
			title: {
				type: String,
				default: new Date().toString()
			}, //音频标题
			duration: String, //音频时长
			coverImgUrl: String, //封面图
			singer: String, //歌手名
			isBackgroundAudio: {
				type: Boolean,
				default: false
			},
			//当前音频播放的音频src
			activeSrc: {
				type: String,
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

		.play-cion {
			font-size: 20px;
		}
	}
</style>
