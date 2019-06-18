<template>
	<view class="content">
		<imt-audio continue :src="audio[now].src" :duration="audio[now].duration" @prev="now = now === 0?audio.length-1:now-1"
		 @next="now = now === audio.length-1?0:now+1"></imt-audio>
		<!-- 
			 src: String 音频链接*必须*
			 duration: Number 总时长（单位：s）*必须*
			 autoplay: Boolean 是否自动播放*默认false*
			 control: Boolean 是否需要上一曲/下一曲按钮*默认true*
			 continue:Boolean 播放完成后是否继续播放下一首，需定义@next事件*默认false*
			 color: String 主色调*默认#169af3*
			 @prev:点击上一首按钮
			 @next:点击下一首按钮
		  -->
		<view class="list" :class="{active:key===now}" v-for="(item,key) in audio" :key="key" @click="now = key">
			<view class="list-title">{{key+1}}</view>
			<image class="list-pic" src="http://mouyizhan.com/music.gif"></image>
		</view>
	</view>
</template>

<script>
	import imtAudio from 'components/imt-audio/imt-audio'
	export default {
		data() {
			return {
				audio: [{
						src: 'http://mouyizhan.com/1.mp3',
						duration: 212
					},
					{
						src: 'http://mouyizhan.com/2.mp3',
						duration: 189
					},
					{
						src: 'http://mouyizhan.com/3.mp3',
						duration: 214
					},
					{
						src: 'http://mouyizhan.com/4.mp3',
						duration: 205
					},
					{
						src: 'http://mouyizhan.com/5.mp3',
						duration: 228
					}
				],
				now: 0
			}
		},
		components: {
			imtAudio
		}
	}
</script>

<style>
	page{
		background: #f5f5f5;
	}
	.content {
		padding: 20upx;
	}

	.list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30upx;
		background: #fff;
		border-radius: 10upx;
		margin-top: 20upx;
		color: #333;
	}

	.list-title {
		font-size: 28upx;
		line-height: 88upx;
	}

	.list-pic {
		display: none;
		width: 28upx;
		height: 28upx;
	}

	.active {
		background: #169af3;
		color: #fff;
	}

	.active .list-pic {
		display: block;
	}
</style>