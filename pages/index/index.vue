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
				<nxPlayer src="cloud://test-cjyjj.7465-test-cjyjj/156086052309277.mp3" duration="60" title="李四的歌" singer="李四"></nxPlayer>
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
					<nxPlayer src="cloud://test-cjyjj.7465-test-cjyjj/156086052309277.mp3" duration="60" title="李四的歌" singer="李四" noControl></nxPlayer>
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
	export default {
		data() {
			return {

			}
		},
		methods: {

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
