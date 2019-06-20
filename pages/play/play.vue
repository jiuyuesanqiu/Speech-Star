<template>
	<view class="page">
		<view class="title">
			<text class="time-big">{{title}}</text>
		</view>
		<view class="author">
			{{author}}
		</view>
		<view class="uni-common-mt">
			<slider class="slider" min="0" :max="duration_s" step="1" @change="seek"></slider>
		</view>
		<view class="play-time">
			<text>{{playTime_text}}</text>
			<text>{{duration_text}}</text>
		</view>
		<view class="page-body-buttons">
			<view class="page-body-button" @tap="play_or_stop">
				<image v-if="!playing" src="/static/play.png"></image>
				<image v-else src="/static/pause.png"></image>
			</view>
		</view>
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
	var util = require('../../common/util.js');
	export default {
		data() {
			return {
				title: '',
				author: '',
				innerAudioContext: null,
				dataUrl: "",
				playing: false,
				playTime: 0,
				playTime_text: "00:00:00",
				duration_text: '00:00:00',
				duration_s: 0
			}
		},
		onLoad: function(e) {
			console.log("onload")
			this.title = e.title;
			this.author = e.author;
			this.duration_s = parseInt(e.duration);
			this.duration_text = util.formatTime(this.duration_s);
			this.dataUrl = e.audioUrl;
			let innerAudioContext = uni.createInnerAudioContext();
			//add listenner--start
			innerAudioContext.onPlay(() => {
				console.log("开始播放");
			});
			innerAudioContext.onPause(() => {
				console.log("暂停播放");
			});
			innerAudioContext.onEnded(() => {
				this.playTime = 0;
			});

			innerAudioContext.onTimeUpdate(function() {
				this.changePlayTimeText(innerAudioContext.currentTime);
				console.log(this.playTime);
			})
			//add listenner end
			this.changePlayTimeText(innerAudioContext.currentTime);
			this.innerAudioContext = innerAudioContext;
		},
		onShow() {
			console.log("show")
		},
		onReady() {
			console.log("ready");
		},
		onHide() {
			console.log("stop")
		},
		onUnload() {
			console.log("unload")
			this.innerAudioContext.stop();
		},
		onBackPress() {
			console.log("backPress")
		},
		methods: {
			changePlayTimeText: function(value) {
				this.playTime = value;
				this.playTime_text = util.formatTime(parseInt(this.playTime));
			},
			seek: function(e) {
				console.log("seek and play");
				this.initAudioContext();
				this.changePlayTimeText(e.target.value);
				this.innerAudioContext.seek(e.target.value);
				this.innerAudioContext.play();
				this.playing = true;
			},
			initAudioContext: function() {
				if ((this.innerAudioContext === undefined) || (this.dataUrl !== this.innerAudioContext.src)) {
					console.log("init data")
					this.innerAudioContext.src = this.dataUrl;
				}
			},
			play: function() {
				this.initAudioContext();
				this.innerAudioContext.seek(this.playTime);
				this.innerAudioContext.play();
				this.playing = true;
			},
			pause: function() {
				console.log("pause")
				this.innerAudioContext.pause();
				this.playing = false;
			},
			stop: function() {
				this.innerAudioContext.stop();
				this.playing = false;
				changePlayTimeText(0);
				this.formatedPlayTime = util.formatTime(0);
			},
			play_or_stop: function() {
				//console.log("play-or——stop")
				if (!this.playing) {
					this.play();
				} else {
					this.pause();
				}
			}
		}
	}
</script>

<style>
	image {
		width: 150upx;
		height: 150upx;
	}
    .page{
		background: #FFFFFF;
		padding: 12upx;
		height: 100%;
	}
	.title {
		padding-top: 150upx;
		text-align: center;
	}

	.author {
		margin: 20upx;
		text-align: center;
	}

	.time-big {
		font-size: 60upx;
		margin: 20upx;
		text-align: center;
	}

	.slider {
		margin: 40upx;
		justify-content: space-between;
	}

	.page-body-buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 60upx;
	}

	.page-body-button {
		width: 250upx;
		text-align: center;
	}

	.play-time {
		padding: 20upx;
		font-size: 28upx;
		width: 100%;
		text-align: center;
		/*
		* means items are flex layout
		* */
		display: flex;
		justify-content: space-between;
	}
</style>
