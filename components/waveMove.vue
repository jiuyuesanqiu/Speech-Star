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
		background-color: #09BB07;
		width: 6upx;
		margin-left: 14upx;
	}

	.wave1 {
		height: 20%;
		animation: waveMove 0.3s linear 0s infinite alternate;
	}

	.wave2 {
		height: 10%;
		animation: waveMove 0.3s linear 0.1s infinite alternate;
	}

	.wave3 {
		height: 40%;
		animation: waveMove 0.3s linear 0.3s infinite alternate;
	}
	
	@keyframes waveMove {
		from {
			height: 40%;
		}
		to {
			height: 10%;
		}
	}
</style>
