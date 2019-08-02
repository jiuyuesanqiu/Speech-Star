<template>
	<view>
		<view class="dynamic bg-white" v-for="(item,index) in dynamics" :key="item._id">
			<view class="user d-flex align-center" @tap="toDynamicDetail(item._id)">
				<view>
					<image :src="item.userInfo.avatarUrl" class="avatar"></image>
				</view>
				<view class="pl-2">
					<view class="nickName">{{item.userInfo.nickName}}</view>
					<view class="createTime">{{timeAgoFormat(item.createTime)}}</view>
				</view>
			</view>
			<view class="intro" v-if="item.intro">
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
				<view v-if="isLogin" class="operation">
					<text class="space-right" :class="isLike(item.likeUsers)?'cuIcon-likefill red':'cuIcon-like'" @click="togglelike(item._id,index)"></text>
					<text class="space-right cuIcon-comment" @click="toComment(item._id,index)"></text>
					<button class="share-btn" open-type="share" :data-id="item._id" :data-share-title="getShareTitle(item.userInfo.nickName,item.title)">
						<text class="cuIcon-share"></text>
					</button>
				</view>
				<view v-else @click="loginShow=true" class="operation">
					<text class="space-right cuIcon-like"></text>
					<text class="space-right cuIcon-comment"></text>
					<text class="cuIcon-share"></text>
				</view>
			</view>
			<view v-if="item.likeUsers.length!=0" class="likenum border-top">
				<text class="cuIcon-like"></text>
				<text v-for="(likeUser,index) in item.likeUsers" :key="index" @click="userDetail(likeUser._openid)">{{likeUser.nickName}}{{(index+1)!=item.likeUsers.length?'、':''}}</text>
			</view>
			<view>
				<view class="my-1 d-flex" v-for="(comment,index) in item.comment" :key="index">
					<view>
						<text>{{comment.user.nickName}}：</text>
					</view>
					<view v-for="(content,index) in comment.content" :key="index">
						<view v-if="content.type=='text'" class="mb-1">
							<text>{{content.content}}</text>
						</view>
						<!-- <nxPlayer @changeActive="onChangeActive" :activeSrc="activeSrc" :src="comment.content.voice.src" :duration="comment.content.voice.duration"></nxPlayer> -->
					</view>
				</view>
			</view>
			<!-- <view v-if="isLogin" @click="toComment(item._id)" class="noInputComment">
				<text>评论</text>
			</view>
			<view v-else @click="loginShow=true" class="noInputComment">
				<text>评论</text>
			</view> -->
		</view>
		<nxLogin :show="loginShow" @success="loginShow=false" @cancel="loginShow=false"></nxLogin>
	</view>
</template>

<script>
	const backgroundAudioManager = wx.getBackgroundAudioManager();
	import {
		format,
		render,
		cancel,
		register
	} from 'timeago.js';
	import nxPlayer from '../../components/nx-player.vue';
	import nxLogin from '../../components/nx-login.vue';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = wx.cloud.database();
	const _ = db.command
	let startPage = 0; //起始页数
	let pageSize = 20;
	export default {
		data() {
			return {
				activeSrc: '', //当前播放的音频
				isLoading: false, //数据是否正在加载中
				loginShow: false,
				defaultCover: 'cloud://product-yjcc.7072-product-yjcc/base/defaultCover.png',
			}
		},
		onLoad() {
			startPage = 0;
			this.getNextPage();
			wx.showShareMenu();
		},
		//下拉刷新
		onPullDownRefresh() {
			startPage = 0;
			this.isLoading = false;
			backgroundAudioManager.stop();
			this.clearDynamics();
			this.getNextPage();
		},
		computed: {
			...mapState(['userInfo', 'dynamics', 'inActiveCallback']),
			...mapGetters(['isLogin'])
		},
		onShareAppMessage(res) {
			if (res.from === 'button') {
				return {
					title: res.target.dataset.shareTitle,
					path: `/pages/dynamicDetail/dynamicDetail?id=${res.target.dataset.id}`
				}
			}
		},
		methods: {
			/**
			 * 获取分享标题
			 */
			getShareTitle(nickName, title) {
				return `【${nickName}】${title}`;
			},
			/**
			 * 动态详情
			 */
			toDynamicDetail(id) {
				uni.navigateTo({
					url: `../dynamicDetail/dynamicDetail?id=${id}`
				})
			},
			/**
			 * 去评论页
			 */
			toComment(id, index) {
				uni.navigateTo({
					url: `../comment/comment?id=${id}&index=${index}`
				})
			},
			/**
			 * 格式化创建时间
			 */
			timeAgoFormat(time) {
				return format(time, 'zh_CN')
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
			 * 点赞或取消点赞
			 */
			togglelike(id, index) {
				let likeUsers = [];
				let likeUsersOriginal = this.dynamics[index].likeUsers;
				if (this.isLike(likeUsersOriginal)) {
					likeUsers = likeUsersOriginal.filter((value) => {
						return value._openid != this.userInfo._openid;
					})
				} else {
					likeUsers = [...likeUsersOriginal, {
						_openid: this.userInfo._openid,
						nickName: this.userInfo.nickName
					}]
				}
				this.togglelikeState({
					index,
					likeUsers
				})
				wx.cloud.callFunction({
					name: 'likeDynamic',
					data: {
						id,
						likeUsers
					}
				}).then(res => {
					console.log('togglelike', res)
				})
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
				if (this.isLoading) return;
				this.isLoading = true;
				const self = this;
				//获取演讲数据,倒序排列
				db.collection('dynamic').orderBy('createTime', 'desc').skip(startPage * pageSize).limit(pageSize).get().then(res => {
					this.apendDynamics(res.data);
					startPage += 20;
					uni.stopPullDownRefresh();
					if (res.data.length < 20) {
						this.isLoad = true;
						return;
					}
					this.isLoading = false;
				})
			},
			...mapMutations(['apendDynamics', 'clearDynamics', 'togglelikeState'])
		},
		components: {
			nxPlayer,
			nxLogin
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #ececec;
		height: 100Vh;
		width: 100vw;
	}

	.dynamic {
		padding: 32upx 16upx;

		.user {
			padding-bottom: 20upx;

			.avatar {
				width: 74upx;
				height: 74upx;
				border-radius: 8upx;
			}

			.nickName {
				margin-bottom: 10upx;
				color: rgba(16, 16, 16, 1);
				font-size: 30upx;
				line-height: 34upx;
			}

			.createTime {
				color: rgba(136, 136, 136, 1);
				font-size: 22upx;
			}
		}

		.intro {
			color: rgba(16, 16, 16, 1);
			font-size: 28upx;
			padding: 22upx 0;
		}

		.cover {
			width: 260upx;
		}

		.player {
			padding: 22upx 0;
		}

		.comment {
			padding-right: 14upx;

			.viewCounts {
				color: rgba(119, 119, 119, 1);
				font-size: 28upx;
			}

			.operation {
				font-size: 48upx;
			}

			.space-right {
				margin-right: 66upx;
			}

			.red {
				color: #e64340
			}
		}

		.likenum {
			padding: 30upx 4upx 0 4upx;
			margin-top: 30upx;
			margin-bottom: 30upx;
		}

		.noInputComment {
			width: 722upx;
			height: 54upx;
			border-radius: 4upx;
			background-color: rgba(248, 248, 248, 1);
			color: rgba(176, 176, 176, 1);
			font-size: 26upx;
			padding-left: 20upx;
			padding-top: 12upx;
			margin-top: 30upx;
		}
	}

	.dynamic+.dynamic {
		margin-top: 28upx;
	}

	button.share-btn {
		all: initial;

		&:after {
			all: initial;
		}

		font-size: 48upx;
		color: #3A3A3A;
	}
</style>
