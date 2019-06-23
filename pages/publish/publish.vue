<template>
	<view>
		<view class="cu-form-group">
			<view class="title">
				标题
			</view>
			<input placeholder="给我取个好听的名字吧" v-model="title"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">
				简介
			</view>
			<input placeholder="介绍本期内容,可吸引更多播放哦" v-model="author"></input>
		</view>
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" >上传声音</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
