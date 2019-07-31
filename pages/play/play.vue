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
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" open-type="share">分享好友</button>
			<button class="weui-btn" type="default" @tap="goHome" v-if="isShare">返回首页</button>
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
				duration_s: 0,
				isShare:false
			}
		},
		onLoad: function(e) {
			/**
			 * 判断用户是否是从别人分享的小程序进入的
			 */
			if(e.isShare){
				this.isShare = true;
			}
			this.title = e.title;
			this.author = e.author;
			this.duration_s = parseInt(e.duration);
			this.duration_text = util.formatTime(this.duration_s);
			this.dataUrl = e.audioUrl;
			innerAudioContext.src = this.dataUrl;
			innerAudioContext.onEnded(() => {
				this.playTime = 0;
				this.playing = false;
			});
			var vueObject = this;
			innerAudioContext.onTimeUpdate(function() {
				vueObject.changePlayTimeText(innerAudioContext.currentTime);
			});
			innerAudioContext.playTime = 0;
			this.changePlayTimeText(0);
		},
		onUnload() {
			innerAudioContext.stop();
		},
		onShareAppMessage() {
			return {
				title: this.title,
				path: '/pages/play/play?isShare=true&author=' + this.author +
						'&duration=' + this.duration_s +
						'&title=' + this.title +
						'&audioUrl=' + this.dataUrl,
				imageUrl:'../../static/share.png'
			}
		},
		methods: {
			goHome(){
				uni.switchTab({
					url:'../index/index'
				})
			},
			changePlayTimeText: function(value) {
				this.seekTime = this.playTime = value;
				this.playTime_text = util.formatTime(parseInt(this.seekTime));
			},
			play: function() {
				innerAudioContext.play();
				this.playing = true;
			},
			pause: function() {
				innerAudioContext.pause();
				this.playing = false;
			},
			seek: function(e) {
				innerAudioContext.seek(e.target.value);
				this.pause();
				this.changePlayTimeText(e.target.value);
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
