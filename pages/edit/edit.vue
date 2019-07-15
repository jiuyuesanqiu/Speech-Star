<template>
	<view>
		<input style="height: 112upx;font-size: 32upx;line-height: 112upx;padding-left: 20upx;" v-model="value" type="text" class="bg-white text-black">
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" @tap="finish">完成</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const db = wx.cloud.database();
	const getOpt = (opt)=>{
		switch (opt){
			case 'nikeName':
				break;
			default:
				break;
		}
	}
	export default {
		data() {
			return {
				value:''
			}
		},
		onLoad(option) {
			//设置标题
			uni.setNavigationBarTitle({
				title: option.title
			})
			this.value = this.userInfo.nickName;
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			finish() {
				const self = this;
				//更新用户名
				db.collection('user').doc(self.userInfo._id).update({
					data: {
						nickName: self.value
					},
					success: function(res) {
						console.log('更新用户名成功')
						self.updateNickName(self.value);
						uni.navigateBack();
					}
				})
			},
			...mapMutations(['updateNickName'])
		}
	}
</script>

<style>
	page {
		background-color: #ededed;
	}
</style>
