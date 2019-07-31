<template>
	<view>
		<button @getuserinfo="$emit('getuserinfo',$event)" :loading="loading" :type="type" :plain="plain" :open-type="openType"
		 :class="[round?'round':'']">
			<slot></slot>
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		props: {
			//是否缕空
			plain: {
				type: Boolean,
				default: false
			},
			//微信开放能力
			openType: {
				type: String,
				default: ''
			},
			//是否为圆形按钮
			round: {
				type: Boolean,
				default: false
			},
			loading: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				default: "primary"
			}
		}
	}
</script>

<style lang="scss" scoped>
	.round {
		border-radius: 46upx;
	}
</style>
