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
	export default {
		data() {
			return {
			};
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
			/**
			 * 播放音频
			 */
			play() {
				this.$emit('play');
			},
			/**
			 * 暂停音频
			 */
			paused() {
				this.$emit('paused');
			},
			/**
			 * 停止音频
			 */
			stop(){
				this.$emit('stop');
			},
			/**
			 * 滚动后触发
			 */
			sliderChange({detail}) {
				this.$emit('sliderChange',detail.value);
			},
			/**
			 * 拖动中触发
			 */
			sliderChanging({detail}) {
				this.$emit('sliderChanging',detail.value);
			},
			playAudio(){
				this.$emit('playAudio');
			}
		},
		props: {
			src: String, //音频播放地址
			title: String, //音频标题
			duration: String, //音频时长
			coverImgUrl: String, //封面图
			singer: String, //歌手名
			isBackgroundAudio: {
				type: Boolean,
				default: false
			},
			isLoading:{
				type:Boolean,
				default:false
			},
			currentTime:{
				type:Number,
				default:0
			},
			isPlay:{
				type:Boolean,
				default:false
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
