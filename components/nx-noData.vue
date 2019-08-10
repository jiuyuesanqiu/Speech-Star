<template>
	<view class="nx-warp">
		<image src="/static/empty-box.svg"></image>
		<view class="text-center text-lg">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
	.nx-warp{
		width: 300upx;
		margin: 0 auto;
	}
</style>
