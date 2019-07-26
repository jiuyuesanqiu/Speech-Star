<template>
	<view>
		<view class="dynamic bg-white">
			<view class="user d-flex align-center">
				<view>
					<image src="http://iph.href.lu/37x37" class="avatar"></image>
				</view>
				<view class="pl-2">
					<view class="nickName">九月三秋</view>
					<view class="createTime">05-27 23:34</view>
				</view>
			</view>
			<view class="introduce">
				<text>
					第一次录音，不好听请见谅
				</text>
			</view>
			<view>
				<image class="cover" src="http://iph.href.lu/130x205" mode="widthFix"></image>
			</view>
			<view class="player">
				<view v-for="(song,index) in songs" :key="song.id">
					<nxPlayer @play="onPlay(index)" @paused="onPause(index)" @sliderChange="onSliderChange(index,$event)"
					 @sliderChanging="onSliderChanging(index,$event)" :src="song.src" :title="song.title" :duration="song.duration"
					 :coverImgUrl="song.coverImgUrl" :singer="song.singer" :isLoading="song.isLoading" :currentTime="song.currentTime"
					 :isPlay="song.isPlay" isBackgroundAudio></nxPlayer>
				</view>
			</view>
			<view class="comment d-flex justify-between">
				<view class="viewCounts d-flex align-center">播放10次</view>
				<view class="operation">
					<text class="cuIcon-appreciate"></text>
					<text class="cuIcon-comment"></text>
					<text class="cuIcon-share"></text>
				</view>
			</view>
			<view class="likenum border-top">
				<text class="cuIcon-appreciatefill"></text>
				<text>九月三秋、逍遥客、我是一小白白</text>
			</view>
			<view>
				<view class="my-1">
					<text>逍遥客：</text>
					<text>你的演讲很棒哦！</text>
				</view>
				<view class="d-flex align-center my-1">
					<text>九月三秋：</text>
					<nxPlayer @playAudio="playAudio(1)" :src="song.src" :title="song.title" :duration="song.duration" :coverImgUrl="song.coverImgUrl"
					 :singer="song.singer" :isLoading="song.isLoading" :currentTime="song.currentTime" :isPlay="song.isPlay"></nxPlayer>
				</view>
			</view>
			<view class="noInputComment">
				<text>评论</text>
			</view>
		</view>
	</view>
</template>

<script>
	import nxPlayer from '../../components/nx-player.vue';
	const backgroundAudioManager = wx.getBackgroundAudioManager();
	const innerAudioContext = wx.createInnerAudioContext();
	export default {
		data() {
			return {
				songs: [{
					id: 1,
					title: '张三的歌',
					singer: '张三',
					duration: 300,
					src: 'cloud://test-cjyjj.7465-test-cjyjj/M500001VfvsJ21xFqb.mp3',
					currentTime: 0,
					isLoading: false,
					isPlay: false,
					coverImgUrl: 'http://iph.href.lu/130x205'
				}, {
					id: 2,
					title: '李四的歌',
					singer: '李四',
					duration: 60,
					src: 'cloud://test-cjyjj.7465-test-cjyjj/156085715105895.m4a',
					currentTime: 0,
					isLoading: false,
					isPlay: false,
					coverImgUrl: 'http://iph.href.lu/130x205'
				}],
				song: {
					id: 1,
					title: '张三的歌',
					singer: '张三',
					duration: 300,
					src: 'cloud://test-cjyjj.7465-test-cjyjj/M500001VfvsJ21xFqb.mp3',
					currentTime: 0,
					isLoading: false,
					isPlay: false,
					coverImgUrl: 'http://iph.href.lu/130x205'
				},
				activeIndex: -1, //当前播放的音频
				intervalId: 0,
				isEnded: false,
				activeAudioId:0
			}
		},
		methods: {
			onPlay(index) {
				let song = this.songs[index];
				if (index != this.activeIndex || index == this.activeIndex && this.isEnded) {
					if (this.activeIndex != -1) {
						this.songs[this.activeIndex].isPlay = false;
						clearInterval(this.intervalId);
						this.intervalId = 0;
					}
					backgroundAudioManager.title = song.title;
					backgroundAudioManager.singer = song.singer;
					backgroundAudioManager.startTime = song.currentTime;
					backgroundAudioManager.src = song.src;
					this.activeIndex = index;
					// //监听音频能够播放的事件
					backgroundAudioManager.onWaiting(() => {
						song.isLoading = true;
					})
					backgroundAudioManager.onCanplay(() => {
						song.isLoading = false;
					})
					backgroundAudioManager.onPlay(() => {
						song.isPlay = true;
						song.isLoading = false;
						this.updateCurrentTime();
					})
					backgroundAudioManager.onPause(() => {
						song.isPlay = false;
						clearInterval(this.intervalId);
						this.intervalId = 0;
					})
					backgroundAudioManager.onStop(() => {
						console.log("背景音频被停止")
					});
					backgroundAudioManager.onEnded(() => {
						song.isPlay = false;
						song.currentTime = 0;
						clearInterval(this.intervalId);
						this.intervalId = 0;
						this.isEnded = true;
					});
				} else {
					backgroundAudioManager.play();
				}
			},
			onPause() {
				backgroundAudioManager.pause();
			},
			onSliderChange(index, value) {
				this.songs[index].currentTime = value;
				if (this.activeIndex != index) {
					this.onPlay(index);
					return;
				}
				backgroundAudioManager.seek(value);
			},
			onSliderChanging(index, value) {
				this.songs[index].currentTime = value;
			},
			updateCurrentTime() {
				if (this.intervalId != 0) {
					return;
				}
				let intervalId = setInterval(() => {
					this.songs[this.activeIndex].currentTime = backgroundAudioManager.currentTime;
				}, 1000)
				this.intervalId = intervalId;
			},
			playAudio(id) {
				if(this.activeAudioId != id){
					innerAudioContext.autoplay = true
					innerAudioContext.src ='cloud://test-cjyjj.7465-test-cjyjj/M500001VfvsJ21xFqb.mp3';
					innerAudioContext.onPlay(() => {
						console.log('开始播放')
					})
					this.activeAudioId = id;
				}else{
					if(innerAudioContext.paused){
						innerAudioContext.play();
					}else{
						innerAudioContext.pause();
					}
				}
				
			}
		},
		components: {
			nxPlayer
		}

	}
</script>

<style lang="scss">
	.dynamic {
		padding: 16px 8px;

		.user {
			padding-bottom: 5px;

			.avatar {
				width: 37px;
				height: 37px;
				border-radius: 4px;
			}

			.nickName {
				margin-bottom: 5px;
				color: rgba(16, 16, 16, 1);
				font-size: 15px;
				line-height: 17px;
			}

			.createTime {
				color: rgba(136, 136, 136, 1);
				font-size: 11px;
			}
		}

		.introduce {
			color: rgba(16, 16, 16, 1);
			font-size: 14px;
			padding: 11px 0;
		}

		.cover {
			width: 130px;
		}

		.player {
			padding: 11px 0;
		}

		.comment {
			padding-right: 7px;

			.viewCounts {
				color: rgba(119, 119, 119, 1);
				font-size: 14px;
			}

			.operation {
				font-size: 24px;
			}

			.cuIcon-appreciate {
				margin-right: 33px;
			}

			.cuIcon-comment {
				margin-right: 33px;
			}
		}

		.likenum {
			padding: 15px 2px 0 2px;
			margin-top: 15px;
			margin-bottom: 15px;
		}

		.noInputComment {
			width: 361px;
			height: 27px;
			border-radius: 2px;
			background-color: rgba(248, 248, 248, 1);
			color: rgba(176, 176, 176, 1);
			font-size: 13px;
			padding-left: 10px;
			padding-top: 6px;
			margin-top: 15px;
		}
	}
</style>
