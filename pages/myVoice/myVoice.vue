<template>
	<view class="page">
		<view class="pageBox">
			<view class="d-flex voiceItem">
				<view class="d-flex align-center itemNumber">6</view>
				<view class="d-flex flex-column justify-between itemTop">
					<view class="d-flex justify-between align-center">
						<view class="itemName">你所谓的迷茫只不过是赚钱太少</view>
						<view class="itemDate">2019-07-15</view>
					</view>
					<view class="d-flex justify-between itemBottom">
						<view class="d-flex itemViewBox">
							<view class="d-flex viewNumber">
								<image src="../../static/playNumber.png" mode=""></image>
								<view>27</view>
							</view>
							<view class="d-flex itemTime">
								<image src="../../static/time.png" mode=""></image>
								<view>03:55</view>
							</view>
						</view>
						<view class="more">. . .</view>
					</view>
				</view>
			</view>
			<view class="d-flex voiceItem">
				<view class="d-flex align-center itemNumber">6</view>
				<view class="d-flex flex-column justify-between itemTop">
					<view class="d-flex justify-between align-center">
						<view class="itemName">你所谓的迷茫只不过是赚钱太少</view>
						<view class="itemDate">2019-07-15</view>
					</view>
					<view class="d-flex justify-between itemBottom">
						<view class="d-flex itemViewBox">
							<view class="d-flex viewNumber">
								<image src="../../static/playNumber.png" mode=""></image>
								<view>27</view>
							</view>
							<view class="d-flex itemTime">
								<image src="../../static/time.png" mode=""></image>
								<view>03:55</view>
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

			}
		},
		onLoad() {

		},
		computed: {

		},
		methods: {

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
		font-size: 28upx;
	}

	.itemBottom {
		margin-top: 22upx;
	}

	.itemViewBox {
		color: #B8B8B8;
		font-size: 26upx;
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
