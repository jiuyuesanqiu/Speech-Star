<template>
	<view>
		<cu-custom bgColor="bg-white" @tapHome="goHome" :isBack="showBack" :showHome="showHome">
			<block slot="content">动态详情</block>
		</cu-custom>
		<view class="dynamic bg-white mt-2">
			<view class="user d-flex align-center" @click="userDetail(dynamic.userInfo._id)">
				<view>
					<image :src="dynamic.userInfo.avatarUrl" class="avatar"></image>
				</view>
				<view class="pl-2">
					<view class="nickName">{{dynamic.userInfo.nickName}}</view>
					<view class="createTime">{{timeAgoFormat(dynamic.createTime)}}</view>
				</view>
			</view>
			<view class="intro" v-if="dynamic.intro">
				<text>
					{{dynamic.intro}}
				</text>
			</view>
			<view v-if="dynamic.cover != defaultCover">
				<image class="cover" :src="dynamic.cover" mode="widthFix" @click="previewImage(dynamic.cover)"></image>
			</view>
			<view class="player">
				<nxPlayer @click.native="addPlayTime(dynamic._id)" @changeActive="onChangeActive" :activeSrc="activeSrc" :src="dynamic.audioFileID" :title="dynamic.title"
				 :duration="dynamic.duration" :coverImgUrl="dynamic.cover" :singer="dynamic.nickName" isBackgroundAudio></nxPlayer>
			</view>
			<view class="comment d-flex justify-between">
				<view class="viewCounts d-flex align-center">播放{{dynamic.playAmount}}次</view>
				<view v-if="isLogin" class="operation">
					<text class="space-right" :class="isLike(dynamic.likeUsers)?'cuIcon-likefill red':'cuIcon-like'" @click="togglelike"></text>
					<text class="space-right cuIcon-comment" @click="toComment(dynamic._id)"></text>
					<button class="share-btn" open-type="share" :data-id="dynamic._id" :data-share-title="getShareTitle(userInfo.nickName,dynamic.title)">
						<text class="cuIcon-share"></text>
					</button>
				</view>
				<view v-else @click="loginShow=true" class="operation">
					<text class="space-right cuIcon-like"></text>
					<text class="space-right cuIcon-comment"></text>
					<text class="cuIcon-share"></text>
				</view>
			</view>
			<view v-if="dynamic.likeUsers.length!=0" class="likenum border-top">
				<text class="cuIcon-like"></text>
				<text v-for="(likeUser,index) in dynamic.likeUsers" :key="index" @click="userDetail(likeUser._openid)">{{likeUser.nickName}}{{(index+1)!=dynamic.likeUsers.length?'、':''}}</text>
			</view>
			<view>
				<view class="my-1 d-flex" v-for="(comment,index) in dynamic.comment" :key="index">
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
			<view v-if="isLogin" @click="toComment(dynamic._id)" class="noInputComment">
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
	const db = wx.cloud.database();
	import nxPlayer from '../../components/nx-player.vue';
	import nxLogin from '../../components/nx-login.vue';
	import cuCustom from '../../components/cu-custom.vue';
	import {
		format
	} from 'timeago.js';
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				dynamic: {
					likeUsers: []
				},
				loginShow: false,
				defaultCover: 'cloud://product-yjcc.7072-product-yjcc/base/defaultCover.png',
				id: '',
				showHome: false, //主页按钮是否显示
				showBack: true,
				playContainer:[]
			};
		},
		computed: {
			...mapState(['userInfo']),
			...mapGetters(['isLogin'])
		},
		onLoad(option) {
			this.id = option.id;
			//判断是不是从分享进来的，如果是那么展示主页按钮
			let pages = getCurrentPages();
			if (pages.length == 1) {
				this.showHome = true;
				this.showBack = false;
			}
		},
		onShow() {
			this.loadData();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData();
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
			 * 增加播放次数
			 */
			addPlayTime(id) {
				if(this.isPlayed(id)) return
				this.playContainer.push(id);
				wx.cloud.callFunction({
					name: 'addPlayAmount',
					data: {
						id
					}
				}).then(res => {
					console.log('增加播放次数成功');
				})
				this.dynamic.playAmount++;
			},
			/**
			 * 是否播放过
			 */
			isPlayed(value){
				return this.playContainer.includes(value);
			},
			/**
			 * 获取分享标题
			 */
			getShareTitle(nickName, title) {
				return `【${nickName}】${title}`;
			},
			/**
			 * 用户详情
			 */
			userDetail(id) {
				if(id==this.userInfo._id){
					uni.switchTab({
						url:'../my/my'
					})
					return;
				}
				uni.navigateTo({
					url: `../userDetail/userDetail?id=${id}`
				});
			},
			goHome(){
				uni.switchTab({
					url:'../index/index'
				})
			},
			togglelike() {
				let likeUsers = this.dynamic.likeUsers;
				if (this.isLike(likeUsers)) {
					likeUsers = likeUsers.filter((value) => {
						return value.userId != this.userInfo._id;
					})
				} else {
					likeUsers = [...likeUsers, {
						userId: this.userInfo._id,
						nickName: this.userInfo.nickName
					}]
				}
				this.dynamic.likeUsers = likeUsers;
				wx.cloud.callFunction({
					name: 'likeDynamic',
					data: {
						id: this.dynamic._id,
						likeUsers
					}
				}).then(res => {
					console.log('togglelike', res)
				})
			},
			//获取动态详情
			loadData() {
				db.collection('dynamic').doc(this.id).get().then(res => {
					this.dynamic = res.data;
					wx.stopPullDownRefresh();
				})
			},
			/**
			 * 去评论页
			 */
			toComment(id, index) {
				uni.navigateTo({
					url: `../comment/comment?id=${id}`
				})
			},
			isLike(arr) {
				return arr.some((value) => {
					return value.userId == this.userInfo._id;
				});
			},
			/**
			 * 格式化创建时间
			 */
			timeAgoFormat(time) {
				return format(time, 'zh_CN')
			},
		},
		components: {
			nxPlayer,
			nxLogin,
			cuCustom
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
