<template>
	<view class="page">
		<view style="margin-left: 30upx;">
			<view class="voiceItem" style="display: flex;padding-left: 28upx;">
				<view style="padding: 58upx 58upx 58upx 0;">6</view>
				<view style="display: flex;flex-direction: column;width: 80%;">
					<view style="padding: 28upx 0;display: flex;justify-content: space-between;">
						<view>你所谓的迷茫只不过是赚钱太少</view>
						<view>2019-07-15</view>
					</view>
					<view style="display: flex;justify-content: space-between;padding-bottom: 30upx;">
						<view style="display: flex;">
							<view style="padding-right: 22upx;">27</view>
							<view>03:55</view>
						</view>
						<view>...</view>
					</view>
				</view>
				
				

				
			</view>


			<view class="voiceItem">
				<view>6</view>
				<view>你所谓的迷茫只不过是赚钱太少</view>
				<view>2019-07-15</view>
				<view>27</view>
				<view>03:55</view>
				<view>...</view>
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

	.voiceItem+.voiceItem {
		border-top: 1px solid #E8E8E8;
	}
</style>
