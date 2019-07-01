<template>
	<view>
		<button class="getUserInfo" @getuserinfo="getInfo" open-type="getUserInfo">点击登录</button>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				isTab:false,
				backUrl:''
			}
		},
		onLoad(option) {
			this.isTab = option.isTab;
			this.backUrl = option.backUrl;
		},
		methods: {
			getInfo(e) {
				if(e.detail.errMsg=="getUserInfo:ok"){
					this.login(e.detail.userInfo);
					if(this.isTab){
						uni.switchTab({
							url:this.backUrl
						})
					}else{
						uni.navigateTo({
							url:this.backUrl
						})
					}
				}
			},
			...mapMutations(['login'])
		}
	}
</script>

<style>

</style>
