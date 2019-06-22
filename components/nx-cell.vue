<template>
	<view class="d-flex nx-cell" hover-class="nx-cell-active">
		<view class="nx-cell-left d-flex align-items-center">
			<image class="nx-cell-icon" :src="icon"></image>
		</view>
		<view class="nx-cell-right flex-grow-1 d-flex" :class="border?'border-b':''">
			<view class="flex-grow-1">
				<text>{{title}}</text>
			</view>
			<text class="cuIcon-right text-gray"></text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			icon: String,
			title: String,
			border: {
				type: Boolean,
				value: true
			}
		}
	}
</script>

<style scoped>
	.nx-cell {
		background: white;
		color: #353535;
	}

	.nx-cell-left {
		padding: 31upx 36upx;
	}

	.nx-cell-right {
		font-size: 36upx;
		padding: 31upx 26upx 31upx 0;
	}

	.nx-cell-icon {
		width: 40upx;
		height: 40upx;
	}

	.nx-cell-active {
		background-color: #e5e5e5;
	}

	.border-b {
		border-bottom: 1upx solid #eee;
	}
</style>
