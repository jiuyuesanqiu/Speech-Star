<template>
	<view>
		<textarea value="" confirm-type="send" :show-confirm-bar="hide" @keyboardheightchange="keyboardheightchange" placeholder="点我输入欧" />
		<view v-show="show" class="operation bg-grey" :style="{bottom:bottom+'px'}">
			<text class="cuIcon-pic"></text>
			<text class="cuIcon-camera"></text>
			<text class="cuIcon-record"></text>
			<text class="cuIcon-voice"></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottom:0,
				hide:false
			}
		},
		methods: {
			keyboardheightchange(e){
				this.bottom = e.detail.height;
			}
		},
		computed:{
			show(){
				return this.bottom != 0;
			}
		}
	}
</script>

<style>
	.operation{
		position: fixed;
	}
</style>
