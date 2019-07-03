<template>
	<view>
		<view class="load-progress" :class="progress!=0?'show':'hide'" :style="[{top:'0px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-progress) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>
		<view class="cu-form-group">
			<view class="title">
				标题
			</view>
			<input placeholder="给我取个好听的名字吧" v-model="title"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">
				简介
			</view>
			<input placeholder="介绍本期内容,可吸引更多播放哦" v-model="synopsis"></input>
		</view>
		<view class="padding mt-5">
			<button class="weui-btn" type="primary" @tap="publish">立即发布</button>
		</view>
	</view>
</template>

<script>
	const db = wx.cloud.database();
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				title: '',
				synopsis: '',
				tempSrc: '',
				duration: 0,
				progress:0,
				loading:false
			}
		},
		onLoad(option) {
			let file = uni.getStorageSync('file');
			this.tempSrc = file.tempSrc;
			this.duration = file.duration;
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			publish() {
				if(this.title == ''){
					uni.showToast({
						icon:'none',
						title:'请输入演讲标题'
					})
					return;
				}
				const self = this;
				//生成文件名
				let cloudPath = '' + new Date().getTime() + Math.floor(Math.random() * 100) + '.aac';
				//上传到云存储
				const uploadTask = wx.cloud.uploadFile({
					cloudPath: cloudPath,
					filePath: self.tempSrc,
					success: res => {
						console.log('插入数据')
						self.insert(res.fileID)
					}
				})
				//监听文件上传进度，并展示给用户看
				uploadTask.onProgressUpdate((res) => {
					this.progress = res.progress-10;//此处减10是因为防止进度条加载完成，但实际上这条数据还没有被插入数据库，以免引起用户焦虑的等待
				})
			},
			insert(fileID) {
				//上传成功后，保存文件id到数据库
				db.collection('speeches').add({
					data: {
						title: this.title, //演讲标题
						author: this.userInfo.nickName,
						fileID: fileID,
						createTime: new Date(),
						listener: 0, //听众人数
						comment: 0, //评论人数
						duration: this.duration //音频时长
					}
				}).then(res => {
					this.progress = 100;
					this.loading = false;
					this.progress = 0;
					uni.setStorageSync('parameter',{
						author:this.userInfo.nickName,
						duration:this.duration,
						title:this.title,
						audioUrl:fileID
					})
					uni.reLaunch({
						url:'../success/success'
					})
				})
			}
		}
	}
</script>

<style>

</style>
