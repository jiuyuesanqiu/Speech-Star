<template>
	<view class="page">
		<view class="pageBox">
			
			<view class="d-flex voiceItem" v-for="(item,key) in voiceList" :key="item._Id" @tap="toPlay(item._Id)">
				<view class="d-flex align-center itemNumber">{{key+1}}</view>
				<view class="d-flex flex-column justify-between itemContent">
					<view class="d-flex justify-between align-center">
						<view class="itemName">{{item.title}}</view>
						<view class="itemDate">{{formatTime(item.createTime)}}</view>
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
						<view class="more">. . .</view>
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
			}
		},
		onLoad() {
			this.getMyVioce();
		},
		computed: {
			...mapState(['userInfo']),
		},
		methods: {
			// 根据openId获取我的作品列表
			getMyVioce() {
				db.collection('dynamic').where({
					_openid: this.userInfo._openid
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
				uni.navigateTo({
					url: `../dynamicDetail/dynamicDetail?voiceId=${voiceId}`
				})
			},
			// 格式化时间为yyyy-mm-dd
			formatTime(timeStamp) {
				return util.formatDate(timeStamp);
			},
			// 格式化秒数
			formatSeconds(seconds) {
				return util.formatDuration(seconds);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #FFFFFF;
		height: 100Vh;
		width: 100vw;
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
					margin: 28upx 0;
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
						margin-top: 22upx;
						.itemViewBox {
							color: #B8B8B8;
							font-size: 24upx;
							.viewNumber {
								padding-right: 22upx;
								.viewNumberIcon{
									width: 30upx;
									height: 30upx;
									margin-right: 6upx;
									background: url('../../static/playNumber.png') no-repeat top left;
									background-size: 30upx 30upx;
								}
							}
							.itemTimeIcon{
								width: 26upx;
								height: 26upx;
								margin-right: 6upx;
								background: url('../../static/time.png') no-repeat top left;
								background-size: 26upx 26upx;
							}
						}
						.more {
							color: #666666;
							font-weight: bold;
							width: 48upx;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>
