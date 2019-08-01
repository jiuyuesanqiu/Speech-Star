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
					<text class="space-right" :class="isLike(item.likeUsers)?'cuIcon-likefill red':'cuIcon-like'" @click="like(item._id,item.likeUsers)"></text>
					<text class="space-right cuIcon-comment" @click="toComment(item._id)"></text>
					<text class="cuIcon-share"></text>
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
			<view v-if="isLogin" @click="toComment(item._id)" class="noInputComment">
				<text>评论</text>
			</view>
			<view v-else @click="loginShow=true" class="noInputComment">
				<text>评论</text>
			</view>
		</view>
		<nxLogin :show="loginShow" @success="loginShow=false" @cancel="loginShow=false"></nxLogin>
	</view>
</template>

<script>
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
	const backgroundAudioManager = wx.getBackgroundAudioManager();
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
				defaultCover: 'cloud://product-yjcc.7072-product-yjcc/base/defaultCover.png'
			}
		},
		onLoad() {
			startPage = 0;
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
			backgroundAudioManager.pause();
			this.clearDynamics();
			this.getNextPage();
		},
		computed: {
			...mapState(['userInfo','dynamics']),
			...mapGetters(['isLogin'])
		},
		methods: {
			/**
			 * 去评论页
			 */
			toComment(id) {
				uni.navigateTo({
					url: `../comment/comment?id=${id}`
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
			 * 点赞
			 */
			like(id, likeUsers) {
				if (this.isLike(likeUsers)) {
					uni.showToast({
						icon: 'none',
						title: '点赞不能反悔哦'
					})
					return;
				}
				likeUsers.push({
					_openid: this.userInfo._openid,
					nickName: this.userInfo.nickName
				})
				console.log(id)
				wx.cloud.callFunction({
					name: 'likeDynamic',
					data: {
						id,
						nickName: this.userInfo.nickName
					}
				}).then(res => {
					console.log('喜欢成功', res)
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
				if(this.isLoading) return;
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
			...mapMutations(['apendDynamics','clearDynamics'])
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

			.space-right {
				margin-right: 66upx;
			}

			.red {
				color: #e64340
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

	.dynamic+.dynamic {
		margin-top: 28upx;
	}
</style>
