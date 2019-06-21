<template>
	<view class="page">
		<view class="title">
			<text class="time-big">{{title}}</text>
		</view>
		<view class="author">
			{{author}}
		</view>
		<view class="uni-common-mt">
			<slider class="slider" min="0" :max="duration_s" step="1" :value="seekTime" @change="seek"></slider>
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
	//maybe the instance we have used
	const innerAudioContext = uni.createInnerAudioContext();
	var util = require('../../common/util.js');
	export default {
		data() {
			return {
				title: '',
				author: '',
				dataUrl: "",
				playing: false,
				playTime: 0,
				seekTime: 0,
				seeking: false,
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
			innerAudioContext.src = this.dataUrl;

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

			var vueObject = this;
			innerAudioContext.onTimeUpdate(function() {
				//this.changePlayTimeText(innerAudioContext.currentTime);
				console.log(innerAudioContext.currentTime);
				vueObject.changePlayTimeText(innerAudioContext.currentTime);
			});
			//add listenner end
			innerAudioContext.playTime = 0;
			this.changePlayTimeText(0);
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
			innerAudioContext.stop();
		},
		onBackPress() {
			console.log("backPress")
		},
		methods: {
			changePlayTimeText: function(value) {
				this.seekTime = this.playTime = value;
				this.playTime_text = util.formatTime(parseInt(this.seekTime));
			},
			play: function() {
				innerAudioContext.play();
				this.playing = true;
				console.log("play");
			},
			pause: function() {
				console.log("pause")
				innerAudioContext.pause();
				this.playing = false;
			},
			seek: function(e) {
/* 				innerAudioContext.offTimeUpdate(function(){
					console.log("offupdateTime")
				});
				 */
				innerAudioContext.seek(e.target.value);
				this.pause();
				console.log("seek");
				this.changePlayTimeText(e.target.value);
				
/* 				var vueObject = this;
				innerAudioContext.onTimeUpdate(function() {
					//this.changePlayTimeText(innerAudioContext.currentTime);
					console.log(innerAudioContext.currentTime);
					vueObject.changePlayTimeText(innerAudioContext.currentTime);
				});
				 */
				this.play();
			},
			stop: function() {
				innerAudioContext.stop();
				this.playing = false;
				changePlayTimeText(0);
			},
			play_or_stop: function() {
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

	.page {
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
