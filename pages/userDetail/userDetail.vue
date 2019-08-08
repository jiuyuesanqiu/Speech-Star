<template>
	<view>
		<view v-if="isLogin">
			<view class="d-flex bg-white topBox">
				<view class="topContent">
					<image class="radius" :src="userInfo.avatarUrl"></image>
				</view>
				<view class="flex-grow-1 topNameBox">
					<view class="nickName">{{userInfo.nickName}}</view>
					<view class="text-gray signature" v-if="userInfo.signature!=''">{{userInfo.signature}}</view>
					<view class="text-gray signature" v-else>=他还未设置个性签名哦</view>
				</view>
			</view>
			<nx-cell :arrow="false" icon="/static/disk.png" border title="他的作品" @tap="toMyVoice"></nx-cell>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex';
	const db = wx.cloud.database();
	const _ = db.command;
	import nxCell from '../../components/nx-cell.vue';
	export default {
		data() {
			return {
				loginShow: false,
				userId: '',
				userInfo: {}
			}
		},
		computed: {
			...mapGetters(['isLogin'])
		},
		onLoad(option) {
			this.userId = option.id;
			db.collection('user')
				.doc(option.id)
				.get().then((res) => {
					this.userInfo = res.data;
				})
		},
		methods: {
			toMyVoice() {
				uni.navigateTo({
					url: `../myVoice/myVoice?id=${this.userInfo._openid}`
				})
			},
		},
		components: {
			nxCell
		}
	}
</script>

<style scoped>
	/* 恢复button默认值 */
	button {
		all: initial;
	}

	button:after {
		all: inherit
	}

	.topBox {
		padding: 68upx 26upx;
		margin-bottom: 16upx;
	}

	.topContent {
		padding: 20upx;
	}

	.topContent>image {
		width: 128upx;
		height: 128upx;
	}

	.topNameBox {
		padding: 20upx 0 20upx 6upx;
	}

	.nickName {
		font-size: 40upx;
		line-height: 68upx;
		height: 68upx;
	}

	.signature {
		font-size: 32upx;
		line-height: 60upx;
		height: 60upx;
	}

	.fontSize36 {
		font-size: 36upx;
	}
</style>
