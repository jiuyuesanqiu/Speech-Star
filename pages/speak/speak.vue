<template>
	<view style="background-color: #fff;height: 100%;">
		<view style="display: flex;align-items: center;justify-content: center;flex-direction: column;height: 400upx;">
			<image src="../../static/microphone.jpg" alt="" style="width: 158upx;height: 158upx;border-radius: 24%;" />
			<view style="color: #292a2e;font-size: 34upx;font-weight: bold;margin-top: 20upx;">演讲口才</view>
		</view>
		<view style="font-size: 30upx;color: #000;text-align: center;">
			欢迎进入演讲圈，来和我们一起演讲吧！
		</view>
		<view style="font-size: 22upx;color: #838689;text-align: center;height: 90upx;line-height: 90upx;margin-top: 10upx;">
			请完成微信授权以继续使用
		</view>
		<view class="" style="width: 100%;display: flex;justify-content: center;">
			<button @getuserinfo="getInfo" open-type="getUserInfo" style="color: #fff;font-size: 32upx;background-color: #ffa22c;height: 88upx;width: 77%;display:flex;justify-content: center;align-items: center;border-radius: 44upx;">授权登录</button>
		</view>
		<view class="" style="width: 100%;display: flex;justify-content: center;">
			<button @tap="toRecording" style="color: #fff;font-size: 32upx;background-color: #ffa22c;height: 88upx;width: 77%;display:flex;justify-content: center;align-items: center;border-radius: 44upx;">开始演讲</button>
		</view>
		
	</view>
</template>
<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			getInfo(result){
				console.log(result);
			},
			toRecording(){
				uni.navigateTo({
					url:'../recording/recording'
				})
			}
		}
	}
	
	
</script>
<style>
	button {
		all:initial
	}
	
	button:after {
		all:initial
	}
</style>