<template>
	<view class="page">
		<view class="pageBox">
			<view class="d-flex voiceItem">
				<view class="itemNumber">6</view>
				<view class="d-flex flex-column itemTop">
					<view class="itemNameBox d-flex">
						<view class="itemName">你所谓的迷茫只不过是赚钱太少</view>
						<view class="itemDate">2019-07-15</view>
					</view>
					<view class="d-flex itemBottom">
						<view class="d-flex itemViewBox">
							<view class="viewNumber">
								<!-- <image src="" mode=""></image> -->
								<view>27</view>
							</view>
							<view>
								<!-- <image src="" mode=""></image> -->
								<view>03:55</view>
							</view>
						</view>
						<view class="more">...</view>
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

<style scoped>
	.page {
		background-color: #FFFFFF;
		height: 100Vh;
		width: 100vw;
	}

	.pageBox {
		margin-left: 30upx;
	}

	.voiceItem+.voiceItem {
		border-top: 1px solid #E8E8E8;
	}

	.voiceItem {
		padding-left: 28upx;
	}

	.itemNumber {
		padding: 58upx 58upx 58upx 0;
		color: #999999;
		font-size: 32upx;
	}

	.itemTop {
		width: 84%;
	}

	.itemNameBox {
		padding: 28upx 0;
		justify-content: space-between;
		align-items: center;
	}

	.itemName {
		color: #101010;
		font-size: 30upx;
		width: 80%;
	}

	.itemDate {
		color: #999999;
		font-size: 22upx;
	}

	.itemBottom {
		justify-content: space-between;
		padding-bottom: 30upx;
	}

	.itemViewBox {
		color: #B8B8B8;
		font-size: 18upx;
	}

	.viewNumber {
		padding-right: 22upx;
	}

	.more {
		color: #666666;
	}
</style>
