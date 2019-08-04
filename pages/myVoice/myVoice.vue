<template>
	<view class="page">
		<view class="pageBox">

			<view class="d-flex voiceItem" v-for="(item,key,index) in voiceList" :key="item.voiceId" @tap="toPlay(item.voiceId)">
				<view class="d-flex align-center itemNumber">{{key+1}}</view>
				<view class="d-flex flex-column justify-between itemTop">
					<view class="d-flex justify-between align-center">
						<view class="itemName">{{item.voiceName}}</view>
						<view class="itemDate">{{item.voiceDate}}</view>
					</view>
					<view class="d-flex justify-between itemBottom">
						<view class="d-flex itemViewBox">
							<view class="d-flex viewNumber">
								<image src="../../static/playNumber.png" mode=""></image>
								<view>{{item.voicePlay}}</view>
							</view>
							<view class="d-flex itemTime">
								<image src="../../static/time.png" mode=""></image>
								<view>{{item.voiceTime}}</view>
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
	export default {
		data() {
			return {
				voiceList: [{
					voiceId: 1,
					voiceName: '你所谓的迷茫只不过是赚钱太少',
					voiceDate: '2019-07-15',
					voicePlay: 27,
					voiceTime: '03:56',
				}, {
					voiceId: 2,
					voiceName: '赚钱太少啦啦',
					voiceDate: '2019-12-01',
					voicePlay: 66,
					voiceTime: '01:03:56',
				}]
			}
		},
		onLoad() {
			
		},
		computed: {

		},
		methods: {
			toPlay(voiceId) {
				uni.navigateTo({
					url: `../dynamicDetail/dynamicDetail?voiceId=${voiceId}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #FFFFFF;
		height: 100Vh;
		width: 100vw;
	}

	.pageBox {
		margin-left: 30upx;
	}

	.voiceItem {
		border-bottom: 1px solid #E8E8E8;
		padding-left: 28upx;
	}

	.itemNumber {
		color: #999999;
		font-size: 32upx;
		margin-right: 42upx;
	}

	.itemTop {
		width: 84%;
		margin: 28upx 0;
	}

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
	}

	.itemViewBox {
		color: #B8B8B8;
		font-size: 24upx;
	}

	.viewNumber {
		padding-right: 22upx;
	}

	.viewNumber>image {
		width: 30upx;
		height: 30upx;
		margin-right: 6upx;
	}

	.itemTime>image {
		width: 26upx;
		height: 26upx;
		margin-right: 6upx;
	}

	.more {
		color: #666666;
		font-weight: bold;
		width: 48upx;
		text-align: center;
	}
</style>
