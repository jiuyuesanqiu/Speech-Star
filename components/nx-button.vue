<template>
	<view class="container">
		<view class="d-flex justify-center">
			<button :open-type="openType" :class="['btn','primary',plain?'plain':'',round?'round':'']">
				<slot></slot>
			</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		}, 
		methods:{
			
		},
		props:{
			//是否缕空
			plain:{
				type:Boolean,
				default:false
			},
			//按钮类型
			openType:{
				type:String,
				default:''
			},
			//是否为圆形按钮
			round:{
				type:Boolean,
				default:false
			}
		}
	}
</script>

<style lang="scss" scoped>
	button {
		all: initial;
	}

	button::after {
		all: initial;
	}

	button:hover {
		all: initial;
	}

	.container {
		.btn {
			width: 570upx;
			height: 88upx;
			line-height: 88upx;
			border-radius: 9upx;
			text-align: center;
		}

		.primary {
			background-color: #09bb07;
			color: white;
		}

		.plain {
			background-color: white;
			border: 2upx solid #09bb07;
			color: #09bb07;
			box-sizing: border-box;
		}
		
		.round{
			border-radius: 44upx;
		}
	}
</style>
