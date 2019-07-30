<template>
	<view>
		<view class="dynamic bg-white" v-for="item in dynamics" :key="item._id">
			<view class="user d-flex align-center">
				<view>
					<image :src="item.userInfo.avatarUrl" class="avatar"></image>
				</view>
				<view class="pl-2">
					<view class="nickName">{{item.userInfo.nickName}}</view>
					<view class="createTime">{{timeAgoFormat(item.createTime)}}</view>
				</view>
			</view>
			<view class="intro">
				<text>
					{{item.intro}}
				</text>
			</view>
			<view v-if="item.cover != defaultCover">
				<image class="cover" :src="item.cover" mode="widthFix" @click="previewImage(item.cover)"></image>
			</view>
			<view class="player">
				<nxPlayer @changeActive="onChangeActive" :activeSrc="activeSrc" :src="item.audioFileID" :title="item.title"
				 :duration="item.duration" :coverImgUrl="item.cover" :singer="item.nickName" isBackgroundAudio></nxPlayer>
			</view>
			<view class="comment d-flex justify-between">
				<view class="viewCounts d-flex align-center">播放{{item.playAmount}}次</view>
				<view class="operation">
					<text :class="isLike(item.likeUsers)?'cuIcon-appreciatefill':'cuIcon-appreciate'" @click="like"></text>
					<text class="cuIcon-comment"></text>
					<text class="cuIcon-share"></text>
				</view>
			</view>
			<view v-if="item.likeUsers.length!=0" class="likenum border-top">
				<text class="cuIcon-appreciatefill"></text>
				<text v-for="(likeUser,index) in item.likeUsers" :key="index" @click="userDetail(likeUser._openid)">{{likeUser.nickName}}{{(index+1)!=item.likeUsers.length?'、':''}}</text>
			</view>
			<view>
				<view class="my-1 d-flex" v-for="(comment,index) in item.comment" :key="index">
					<view>
						<text>{{comment.userInfo.nickName}}：</text>
					</view>
					<view>
						<view class="mb-1">
							<text>{{comment.content.text}}</text>
						</view>
						<nxPlayer @changeActive="onChangeActive" :activeSrc="activeSrc" :src="comment.content.voice.src" :duration="comment.content.voice.duration"></nxPlayer>
					</view>
				</view>
			</view>
			<view class="noInputComment">
				<text>评论</text>
			</view>
		</view>
		<nxLogin :show="loginShow" @success="loginShow=false" @cancel="loginShow=false"></nxLogin>
	</view>
</template>

<script>
	import { format, render, cancel, register } from 'timeago.js';
	import nxPlayer from '../../components/nx-player.vue';
	import nxLogin from '../../components/nx-login.vue';
	import {
		mapState
	} from 'vuex';
	const backgroundAudioManager = wx.getBackgroundAudioManager();
	const db = wx.cloud.database();
	const _ = db.command
	let startPage = 0; //起始页数
	let pageSize = 20;
	export default {
		data() {
			return {
				activeSrc: '', //当前播放的音频
				dynamics: [], //动态列表
				isLoading: false, //数据是否正在加载中
				loginShow: false,
				defaultCover: 'cloud://product-yjcc.7072-product-yjcc/base/defaultCover.png'
			}
		},
		onLoad() {
			startPage = 0;
			this.dynamics = [];
			this.getNextPage();
			wx.showShareMenu();
		},
		onShow() {
			this.activeSrc = backgroundAudioManager.src;
		},
		//下拉刷新
		onPullDownRefresh() {
			startPage = 0;
			this.isLoading = false;
			this.dynamics = [];
			this.getNextPage();
		},
		computed: {
			...mapState(['isLogin', 'userInfo']),
		},
		methods: {
			/**
			 * 格式化创建时间
			 */
			timeAgoFormat(time){
				return format(time,'zh_CN')
			},
			/**
			 * 预览图片
			 */
			previewImage(url) {
				wx.previewImage({
					urls: [url]
				})
			},
			isLike(arr) {
				return arr.some((value) => {
					return value._openid == this.userInfo._openid;
				});
			},
			/**
			 * 点赞
			 */
			like() {

			},
			/**
			 * 用户详情
			 */
			userDetail() {

			},
			onChangeActive(src) {
				this.activeSrc = src;
			},
			async getNextPage() {
				const self = this;
				//获取演讲数据,倒序排列
				db.collection('dynamic').orderBy('createTime', 'desc').skip(startPage * pageSize).limit(pageSize).get().then(res => {
					this.dynamics = res.data;
					startPage += 20;
					uni.stopPullDownRefresh();
					if (res.data.length < 20) {
						this.isLoad = true;
						return;
					}
				})
			},
		},
		components: {
			nxPlayer,
			nxLogin
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

		.intro {
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

			.cuIcon-appreciate,
			.cuIcon-appreciatefill {
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
