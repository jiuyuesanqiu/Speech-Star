<template>
	<view class="warp">
		<textarea v-model="content" maxlength="500" placeholder="写下你的神回复吧" auto-focus/>
		<view class="fixed-bottom p-3">
			<button type="primary" @click="addComment">发表评论</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,mapGetters
	} from 'vuex';
	const db = wx.cloud.database();
	const _ = db.command
	export default {
		data() {
			return {
				id:'',
				content:''
			};
		},
		computed:{
			...mapState(['userInfo'])
		},
		onLoad(option) {
			this.id = option.id;
		},
		methods:{
			addComment(){
				if(this.content == ''){
					uni.navigateBack();
					return;
				}
				
				wx.cloud.callFunction({
					name:'addComment',
					data:{
						id:this.id,
						user:this.userInfo,
						content:[{
							type:'text',
							content:this.content
						}]
					}
				}).then(res=>{
					console.log('评论成功',res)
					uni.navigateBack()
				})
			}
		},
		
	}
</script>

<style lang="scss">
	page{
		background: white;
	}
	.warp{
		padding-left: 52upx;
		padding-right: 56upx;
		line-height: 53upx;
		color: #191919;
		font-size: 32upx;
	}
	textarea{
		height: 80vh;
	}
</style>
