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
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const uuidv4 = require('uuid/v4');
	let util = require('../common/util.js');
	export default {
		data() {
			return {
				uuid:uuidv4(),//组件唯一标识码
				isLoading: false,
				isPlay: false,
				currentTime: 0,
				isUpdateTime: false,
			};
		},
		computed: {
			currentTimeText() {
				return util.formatDuration(this.currentTime);
			},
			durationText() {
				return util.formatDuration(this.duration);
			},
			...mapState({
				isActive(state){		//当前播放器是否活动
					if(state.activePlayerUUID != this.uuid){
						this.paused();
						return false;
					}else{
						return true;
					}
				}
			})
		},
		watch: {
			/**
			 * @param {Object} value
			 * 播放完成后停止
			 */
			currentTime(value) {
				if (value >= this.duration) {
					this.stopRecordTime();
					this.currentTime = 0;
					this.isPlay = false;
				}
			}
		},
		/**
		 * 销毁前停止计时
		 */
		beforeDestroy() {
			this.stopRecordTime();
		},
		methods: {
			/**
			 * 播放音频
			 */
			play() {
				if(!this.isActive){
					this.updateActivePlayerUUID(this.uuid);
				}
				this.isPlay = true;
				this.startRecordTime();
			},
			/**
			 * 暂停音频
			 */
			paused() {
				this.isPlay = false;
				this.stopRecordTime();
			},
			/**
			 * 滚动后触发
			 */
			sliderChange({
				detail
			}) {
				this.currentTime = detail.value;
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
					this.currentTime = this.currentTime + 0.1;
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
