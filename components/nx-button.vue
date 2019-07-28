<template>
	<view class="container">
		<view class="d-flex justify-center">
			<button :open-type="openType" :class="['btn','primary',plain?'plain':'']">
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
			plain:{
				type:Boolean,
				default:false
			},
			openType:{
				type:String,
				default:''
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
			width: 285px;
			height: 44px;
			line-height: 44px;
			border-radius: 22px;
			text-align: center;
		}

		.primary {
			background-color: #09bb07;
			color: white;
		}

		.plain {
			background-color: white;
			border: 1px solid #09bb07;
			color: #09bb07;
			box-sizing: border-box;
		}
	}
</style>
