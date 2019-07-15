<template>
	<view class="cu-bar search bg-white fixed">
		<view class="search-form">
			<input v-model="nikeName" class="px-2" auto-focus type="text" :placeholder="placeholder"></input>
		</view>
		<view class="action">
			<button class="cu-btn bg-green shadow-blur" @tap="back">取消</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nikeName:'',
				placeholder:'请输入昵称'
			}
		},
		methods:{
			back(){
				uni.navigateBack({
					delta:1
				})
			}
		}
	}
</script>

<style>
</style>
