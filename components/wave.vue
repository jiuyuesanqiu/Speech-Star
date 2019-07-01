<template>
	<view class="waveContent hCenter">
		<text class="wave1"></text>
		<text class="wave2"></text>
		<text class="wave2"></text>
		<text class="wave1"></text>
		<text class="wave3"></text>
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

<style scoped>
	.waveContent {
		width: 100%;
		height: 100%;
	}

	.waveContent text {
		background-color: #D7D7D7;
		width: 6upx;
		margin-left: 14upx;
	}

	.wave1 {
		height: 20%;
	}

	.wave2 {
		height: 10%;
	}

	.wave3 {
		height: 40%;
	}
</style>
