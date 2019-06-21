<template>
	<view>{{data.author}}</view>
</template>

<script>
	export default{
		data(){
			return {
				author:"",
				title:"",
				audioUrl:"",
				data:{}
			}
		},
		onLoad(e) {
			console.log(e);
			console.log(e.createTime);
			console.log(e.duration);
			console.log(e.audioUrl);
			console.log(e.title);
		}
	}
</script>

<style>
</style>
