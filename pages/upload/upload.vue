<template>
	<view>
		<view v-if="!uploadShow">
			<view class="padding bg-white">
				<view class="flex">
					<view class="cu-progress round">
						<view class="bg-green" :style="[{ width:progress+'%'}]"></view>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">
					标题
				</view>
				<input placeholder="请输入演讲标题" v-model="title"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">
					作者
				</view>
				<input placeholder="请输入演讲者名字" v-model="author"></input>
			</view>
			<view class="cu-form-group">
				<view class="title">
					编号
				</view>
				<input placeholder="请输入演讲者编号(选填)" v-model="authorNumber"></input>
			</view>
			<view class="padding mt-5">
				<button class="weui-btn" type="primary" :loading="loading" @tap="again?chooseFile():uploadFile()">{{uploadBtn}}</button>
			</view>
		</view>
		<view v-if="uploadShow" class="upload round d-flex justify-center align-items-center white bg-green" @tap="chooseFile">
			<text class="cuIcon-upload"></text>
		</view>
	</view>
</template>

<script>
	wx.cloud.init()
	const db = wx.cloud.database();
	const _ = db.command;
	let file = {};
	export default {
		data() {
			return {
				uploadShow: true, //上传按钮是否显示
				title: '',
				author: '',
				authorNumber: '',
				progress: 0,
				duration: 0,
				loading:false,
				uploadBtn:'确认上传',
				again:false
			}
		},
		methods: {
			//选择文件
			chooseFile() {
				const self = this;
				wx.chooseMessageFile({
					count: 1,
					type: 'file',
					tempFiles: ['mp3', 'm4a', 'wav', 'aac'],
					success(res) {
						file = res.tempFiles[0];
						//隐藏上传按钮
						self.uploadShow = false;
						//获取文件名
						self.title = file.name.substring(0, file.name.lastIndexOf('.'));
					}
				})
			},
			uploadFile() {
				if(this.loading){
					return;
				}
				//校验输入是否正确
				if (this.title == '') {
					uni.showToast({
						title: '请输入演讲标题',
						icon: 'none'
					})
					return;
				} else if (this.author == '') {
					uni.showToast({
						title: '请输入作者名称',
						icon: 'none'
					})
					return;
				}
				this.loading = true;
				this.uploadBtn = '正在上传';
				
				const self = this;
				//获取文件后缀
				let suffix = file.name.substring(file.name.lastIndexOf('.'));
				//生成文件名
				let cloudPath = '' + this.authorNumber + new Date().getTime() + Math.floor(Math.random() * 100) + suffix;
				console.lo
				//上传到云存储
				const uploadTask = wx.cloud.uploadFile({
					cloudPath: cloudPath,
					filePath: file.path,
					success: res => {
						//#ifdef MP-WEIXIN
						//设置不会终止其他应用或微信内的音乐
						wx.setInnerAudioOption();
						//#endif
						//获取音频时长--这里这么复杂获取音频时长，是因为小程序的api有bug
						const innerAudioContext = uni.createInnerAudioContext()
						innerAudioContext.autoplay = true;
						innerAudioContext.volume = 0; //设置音量为0
						innerAudioContext.src = res.fileID;
						innerAudioContext.onTimeUpdate(() => {
							self.insert(innerAudioContext.duration, res.fileID)
							innerAudioContext.stop();
						})
					}
				})
				//监听文件上传进度，并展示给用户看
				uploadTask.onProgressUpdate((res) => {
					this.progress = res.progress;
				})
			},
			insert(duration, fileID) {
				//上传成功后，保存文件id到数据库
				db.collection('speeches').add({
					data: {
						title: this.title, //演讲标题
						author: this.author,
						authorNumber: this.authorNumber,
						fileID: fileID,
						createTime: new Date(),
						listener: 0, //听众人数
						comment: 0, //评论人数
						duration: duration //音频时长
					}
				}).then(res => {
					uni.showToast({
						title: '上传成功',
					})
					this.loading = false;
					this.uploadBtn = '再传一个';
					this.again = true;
					return;
				})
			}
		}
	}
</script>

<style>
	.upload {
		font-size: 200upx;
		height: 400upx;
		width: 400upx;
		position: fixed;
		left: calc(50% - 200upx);
		top: calc(50% - 150px);
	}

	/* 防止表单标题长短不一 */
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
