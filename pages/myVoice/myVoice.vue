<template>
	<view class="page">
		<nxNoData v-if="voiceList.length==0">您还没有发布作品哦!</nxNoData>
		<view v-else>
			<view class="pageBox">
				<view class="d-flex voiceItem" v-for="(item,key) in voiceList" :key="item._id" @tap="toPlay(item._id)">
					<view class="d-flex align-center itemNumber">{{key+1}}</view>
					<view class="d-flex flex-column justify-between itemContent">
						<view class="d-flex justify-between align-center">
							<view class="itemName">{{item.title}}</view>
							<view class="itemDate">{{formatDate(item.createTime)}}</view>
						</view>
						<view class="d-flex justify-between itemBottom">
							<view class="d-flex itemViewBox">
								<view class="d-flex viewNumber">
									<text class="viewNumberIcon"></text>
									<view>{{item.playAmount}}</view>
								</view>
								<view class="d-flex itemTime">
									<text class="itemTimeIcon"></text>
									<view>{{formatSeconds(item.duration)}}</view>
								</view>
							</view>
							<text v-if="moreShow == true" class="cuIcon-more more d-flex align-end justify-center" @tap.stop="showMore(item._id)"></text>
						</view>
					</view>
				</view>
			</view>
			<view class="moreCover" @tap="closeMore" :style="{top:(coverShow==true?'0':'100%')}">
				<view class="moreBox" @tap.stop :style="{bottom:(editShow==true?'0':'-40%')}">
					<view class="moreOperate">
						<view class="d-flex align-center editBox" @tap.stop="toPublish">
							<text class="editIcon"></text>
							<text>编辑</text>
						</view>
						<view class="d-flex align-center" @tap.stop="deleteDynamic">
							<text class="deleteIcon"></text>
							<text>删除</text>
						</view>
					</view>
					<view @tap="closeMore" class="moreClose">
						<text>关闭</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	const db = wx.cloud.database();
	const _ = db.command;
	// 引入格式化时间等文件
	let util = require('../../common/util.js');
	export default {
		data() {
			return {
				voiceList: '',
				moreShow:false,
				coverShow: false,
				editShow: false,
				activeId: '',
				openid:'',
			}
		},
		onLoad(option) {
			if(option.id != undefined){
				// 这是从别人的个人页进入
				this.openid = option.id;
				uni.setNavigationBarTitle({
					title: '他的作品'
				})
			}else{
				// 这是从自己的个人页进入
				this.openid = this.userInfo._openid;
				this.moreShow = true;
			}
		},
		onShow() {
			this.getMyVioce();
		},
		computed: {
			...mapState(['userInfo']),
		},
		methods: {
			/**
			 * 删除动态
			 */
			deleteDynamic() {
				const self = this;
				uni.showModal({
					title: '提示',
					content: '确认删除此条音频吗？',
					success: function(res) {
						if (res.confirm) {
							wx.cloud.callFunction({
								name: 'deleteDynamic',
								data: {
									id: self.activeId
								}
							}).then(res => {
								console.log('删除成功');
								uni.showToast({
									title: '删除成功'
								})
								self.closeMore();
								self.getMyVioce();
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 根据openId获取我的作品列表
			getMyVioce() {
				db.collection('dynamic').where({
					_openid: this.openid
				}).get().then((res) => {
					console.log(res);
					if (res.errMsg == 'collection.get:ok') {
						this.voiceList = res.data;
					} else {
						uni.showToast({
							title: res.errMsg,
							icon: 'loading',
							duration: 1500,
						});
					}
				})
			},
			// 去播放页
			toPlay(voiceId) {
				console.log(voiceId)
				uni.navigateTo({
					url: `../dynamicDetail/dynamicDetail?id=${voiceId}`
				})
			},
			// 去编辑发布页
			toPublish() {
				uni.navigateTo({
						url: `../publish/publish?id=${this.activeId}`
					}),
				this.closeMore();
			},
			// 显示更多操作
			showMore(activeId) {
				this.coverShow = true;
				this.editShow = true;
				this.activeId = activeId;
			},
			// 关闭更多操作
			closeMore() {
				this.editShow = false;
				// 这里用箭头函数使setTimeout指向当前对象
				setTimeout(() => {
					this.coverShow = false;
				}, 250);
			},
			// 格式化时间为yyyy-mm-dd
			formatDate(timeStamp) {
				return util.formatDate(timeStamp);
			},
			// 格式化秒数为 mm:ss
			formatSeconds(seconds) {
				return util.formatDuration(seconds);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #FFFFFF;
		height: 100%;
		width: 100%;
		position: relative;
		overflow: hidden;

		.pageBox {
			margin-left: 30upx;

			.voiceItem {
				border-bottom: 1px solid #E8E8E8;
				padding-left: 28upx;

				.itemNumber {
					color: #999999;
					font-size: 32upx;
					margin-right: 42upx;
				}

				.itemContent {
					width: 84%;
					margin: 28upx 0 0;

					.itemName {
						color: #101010;
						font-size: 30upx;
						width: 76%;
					}

					.itemDate {
						color: #999999;
						font-size: 26upx;
					}

					.itemBottom {
						.itemViewBox {
							color: #B8B8B8;
							font-size: 24upx;
							margin: 22upx 0 28upx;

							.viewNumber {
								padding-right: 22upx;

								.viewNumberIcon {
									width: 30upx;
									height: 30upx;
									margin-right: 6upx;
									background: url('../../static/playNumber.png') no-repeat top left;
									background-size: 30upx 30upx;
								}
							}

							.itemTimeIcon {
								width: 26upx;
								height: 26upx;
								margin-right: 6upx;
								background: url('../../static/time.png') no-repeat top left;
								background-size: 26upx 26upx;
							}
						}

						.more {
							color: #666666;
							width: 48upx;
							padding-bottom: 10upx;
						}
					}
				}
			}
		}

		.moreCover {
			background: rgba(0, 0, 0, 0.7);
			width: 100vw;
			height: 100vh;
			position: absolute;

			.moreBox {
				background-color: #D5D5D5;
				width: 100%;
				position: absolute;
				bottom: 0;
				border-radius: 20upx 20upx 0 0;
				color: #101010;
				transition: bottom 0.3s cubic-bezier(0.71,0.1,1,1);

				.moreOperate {
					padding: 62upx 40upx;
					font-size: 28upx;

					.editBox {
						margin-bottom: 62upx;

						.editIcon {
							width: 40upx;
							height: 40upx;
							background: url('../../static/edit.png') no-repeat top left;
							background-size: 40upx 40upx;
							margin-right: 60upx;
						}
					}

					.deleteIcon {
						width: 40upx;
						height: 40upx;
						background: url('../../static/delete.png') no-repeat top left;
						background-size: 40upx 40upx;
						margin-right: 60upx;
					}
				}

				.moreClose {
					color: #333333;
					border-top: 1px solid #A9A9A9;
					padding: 32upx 0 96upx;
					font-size: 32upx;
					text-align: center;
				}
			}
		}
	}
</style>
