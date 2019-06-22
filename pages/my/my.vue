<template>
	<view>
		<nx-cell icon="/static/disk.png" border title="我的作品"></nx-cell>
		<button open-type="contact">
			<nx-cell icon="/static/service.png" title="我要吐槽"></nx-cell>
		</button>
	</view>
</template>

<script>
	import nxCell from '../../components/nx-cell.vue';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		components: {
			nxCell
		}
	}
</script>

<style>
	/* 恢复button默认值 */
	button{
		all:initial;
	}
	button:after{
		all:inherit
	}
</style>
