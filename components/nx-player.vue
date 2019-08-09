<template>
	<view>
		<view v-if="!isBackgroundAudio" class="noControl d-flex align-items-center" @click.stop="playAudio">
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
				<text v-show="!isPlay&&!isLoading" class="cuIcon-video play-icon" @click.stop="play"></text>
				<text v-show="isPlay&&!isLoading" class="cuIcon-stop stop-icon" @click.stop="paused"></text>
				<div class="loading-icon">
					<text v-show="isLoading" class="cuIcon-loading1"></text>
				</div>
			</view>
			<view class="right flex-grow-1">
				<view class="title">{{title}}</view>
				<slider :max="duration" step="0.1" @change="sliderChange" @changing="sliderChanging" block-size="8" :value="currentTime"></slider>
				<view class="time d-flex justify-between">
					<text>{{currentTimeText}}</text>
					<text>{{durationText}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const backgroundAudioManager = wx.getBackgroundAudioManager();
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const uuidv4 = require('uuid/v4');
	let util = require('../common/util.js');
	export default {
		data() {
			return {
				uuid: uuidv4(), //组件唯一标识码
				isLoading: false,
				isPlay: false,
				currentTime: 0,
				isUpdateTime: false,
			};
		},
		watch: {
			isActive(newValue, oldValue) {
				if (newValue) {
					this.listener();
				} else {
					this.isPlay = false;
					this.stopRecordTime();
				}
			}
		},
		computed: {
			currentTimeText() {
				return util.formatDuration(this.currentTime);
			},
			durationText() {
				return util.formatDuration(this.duration);
			},
			...mapState({
				isActive(state) { //当前播放器是否活动
					if (state.activePlayerUUID == this.uuid) {
						return true;
					} else {
						return false;
					}
				}
			})
		},
		/**
		 * 销毁前停止计时
		 */
		beforeDestroy() {
			this.stopRecordTime();
		},
		methods: {
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
					this.startRecordTime();
				})
				backgroundAudioManager.onPause(() => {
					this.isPlay = false;
					this.stopRecordTime();
				})
				backgroundAudioManager.onStop(() => {
					this.isPlay = false;
					this.currentTime = 0;
					this.stopRecordTime();
				});
				backgroundAudioManager.onEnded(() => {
					this.isPlay = false;
					this.currentTime = 0;
					this.stopRecordTime();
				});
			},
			/**
			 * 播放音频
			 */
			play() {
				if (!this.isActive) {
					this.updateActivePlayerUUID(this.uuid);
				}
				backgroundAudioManager.play();
				backgroundAudioManager.title = new Date().getTime().toString();
				backgroundAudioManager.startTime = this.currentTime;
				backgroundAudioManager.src = this.src;

				this.isPlay = true;
			},
			/**
			 * 暂停音频
			 */
			paused() {
				this.isPlay = false;
				backgroundAudioManager.pause();
				this.stopRecordTime();
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
			 * 开始计时
			 */
			async startRecordTime() {
				//判断是否已经在计时
				if (this.isUpdateTime) return;
				this.isUpdateTime = true;
				while (this.isUpdateTime) {
					await this.sleep(100);
					//判断是否播放完成
					if (this.currentTime + 0.1 >= this.duration) {
						this.isPlay = false;
						this.currentTime = 0;
						this.stopRecordTime();
					} else {
						this.currentTime = this.currentTime + 0.1;
					}
				}
			},
			/**
			 * 结束计时
			 */
			stopRecordTime() {
				this.isUpdateTime = false;
			},
			playAudio() {
				if (!this.isPlay && !this.isLoading) {
					this.play();
				} else if (this.isPlay && !this.isLoading) {
					this.paused();
				}
			},
			/**
			 * @param {Object} interval	间隔秒数
			 */
			sleep(interval) {
				return new Promise(resolve => {
					setTimeout(resolve, interval);
				})
			},
			...mapMutations(['updateActivePlayerUUID'])
		},
		props: {
			title: {
				type: String,
				default: '音频'
			}, //音频标题
			duration: String, //音频时长
			isBackgroundAudio: {
				type: Boolean,
				default: false
			},
			src: String
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
		width: 716upx;
		height: 196upx;
		border-radius: 4upx;
		color: rgba(16, 16, 16, 1);
		border: 2upx solid rgba(230, 230, 230, 1);
		padding: 30upx 40upx;

		.left {
			padding-right: 30upx;
			font-size: 100upx;
			color: #51AA37;

			.loading-icon {
				animation: loading .5s linear infinite;
				font-size: 100upx;
			}
		}

		.right {
			.title {
				color: rgba(16, 16, 16, 1);
				font-size: 32upx;
				padding-bottom: 20upx;
			}

			.time {
				color: rgba(178, 178, 178, 1);
				font-size: 28upx;
			}
		}
	}

	.noControl {
		width: 410upx;
		height: 80upx;
		border-radius: 10upx;
		background-color: rgba(248, 248, 248, 1);
		padding-left: 50upx;
		font-size: 28upx;

		.play-cion {
			font-size: 40upx;
		}
	}
</style>
