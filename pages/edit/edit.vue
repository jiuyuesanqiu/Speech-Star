<template>
	<view>
		<input style="height: 112upx;font-size: 32upx;line-height: 112upx;padding-left: 20upx;" v-model="value" placeholder='您还未设置个性签名哦' type="text" class="bg-white text-black">
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" @tap="finish">保存</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';
	const db = wx.cloud.database();
	export default {
		data() {
			return {
				value:'',
				editName:''
			}
		},
		onLoad(option) {
			//设置标题和编辑名称
			uni.setNavigationBarTitle({
				title: option.title
			})
			this.editName = option.opt;
			this.value = this.userInfo[this.editName];
			console.log(this.value);	
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			finish() {
				const self = this;
				switch (this.editName){
					case 'nickName':
						//更新用户名
						db.collection('user').doc(self.userInfo._id).update({
							data: {
								nickName: self.value
							},
							success: function(res) {
								console.log('更新用户名成功')
								self.updateUserInfoField({nickName:self.value});
								uni.navigateBack();
							}
						});
						break;
					case 'signature':
						//更新签名
						db.collection('user').doc(self.userInfo._id).update({
							data: {
								signature: self.value
							},
							success: function(res) {
								console.log('更新签名成功')
								self.updateUserInfoField({signature:self.value});
								uni.navigateBack();
							}
						})
						break;
					default:
						break;
				}
			},
			...mapMutations(['updateUserInfoField'])
		}
	}
</script>

<style>
	page {
		background-color: #ededed;
	}
</style>
