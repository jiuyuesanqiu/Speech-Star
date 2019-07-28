<template>
	<view>
		<view class="load-progress" :class="progress!=0?'show':'hide'" :style="[{top:'0px'}]">
			<view class="load-progress-bar bg-green" :style="[{transform: 'translate3d(-' + (100-progress) + '%, 0px, 0px)'}]"></view>
			<view class="load-progress-spinner text-green"></view>
		</view>

		<view class="container">
			<view class="bg-grey banner d-flex justify-center align-center" @click="chooseImage">
				<view v-if="coverPath==''" class="dashBox d-flex flex-column">
					<text class="cuIcon-add add"></text>
					<text class="text">添加配图</text>
				</view>
				<view v-else>
					<image :src="coverPath" class="coverImg" mode="aspectFit"></image>
				</view>
			</view>
			<view class="pl-3 bg-white">
				<view class="d-flex justify-between cell">
					<view class="label d-flex align-center">标题</view>
					<input class="text-right flex-grow-1" placeholder-class="placeholder" type="text" v-model="title" placeholder="给我取个好听的名字吧"></input>
				</view>
				<view class="d-flex justify-between cell">
					<view class="label">简介</view>
					<textarea class="text-right introduction" placeholder-class="placeholder" v-model="introduction" placeholder="介绍本期内容,可吸引更多播放哦!"></textarea>
				</view>
			</view>
			<view class="d-flex justify-center">
				<view class="upload d-flex align-center justify-center" @click="publish">
					<text>
						上传声音
					</text>
				</view>
			</view>
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
				title: '',//演讲标题
				introduction: '',//简介
				tempSrc: '',//音频文件临时路径
				duration: 0,//音频时长
				progress: 0,//上传进度
				loading: false,//是否加载中
				coverPath:'',//封面图片临时路径
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
			chooseImage() {
				const self = this;
				uni.chooseImage({
					count: 1,
					success(res) {
						let tempFilePath = res.tempFilePaths[0];
						self.coverPath = tempFilePath;
					}
				})
			},
			publish() {
				if (this.title == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入演讲标题'
					})
					return;
				}
				const self = this;
				//获取文件后缀
				let suffix = this.coverPath.substring(this.coverPath.lastIndexOf('.'));
				//封面生成文件名
				let coverCloudPath = 'avatar/' + new Date().getTime() + Math.floor(Math.random() * 100) + suffix;
				//生成音频文件名
				let cloudPath = '' + new Date().getTime() + Math.floor(Math.random() * 100) + '.aac';
				wx.cloud.uploadFile({
					cloudPath: coverCloudPath,
					filePath: this.coverPath
				}).then(coverRes=>{
					//上传到云存储
					const uploadTask = wx.cloud.uploadFile({
						cloudPath: cloudPath,
						filePath: self.tempSrc,
						success: videoRes => {
							console.log('插入数据')
							self.insert(coverRes.fileID,videoRes.fileID)
						}
					})
					//监听文件上传进度，并展示给用户看
					uploadTask.onProgressUpdate((res) => {
						this.progress = res.progress - 10; //此处减10是因为防止进度条加载完成，但实际上这条数据还没有被插入数据库，以免引起用户焦虑的等待
					})
				})
			},
			insert(coverFileID,videoFileID) {
				//上传成功后，保存文件id到数据库
				db.collection('dynamic').add({
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
					uni.setStorageSync('parameter', {
						author: this.userInfo.nickName,
						duration: this.duration,
						title: this.title,
						audioUrl: fileID
					})
					uni.reLaunch({
						url: '../success/success'
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		.banner {
			width: 375px;
			height: 144px;
			background-color: rgba(184, 184, 184, 1);
			.coverImg{
				height: 288upx;
			}
			.dashBox {
				width: 200rpx;
				height: 200rpx;
				border: 1px dashed rgba(255, 255, 255, 1);
				padding-top: 39upx;

				.add {
					font-size: 60upx;
					text-align: center;
				}

				.text {
					padding-top: 15upx;
					font-size: 14px;
					text-align: center;
				}
			}
		}

		.cell {
			padding: 30rpx;
			padding-left: 0;

			&:first-of-type {
				border-bottom: 2rpx solid rgba(204, 204, 204, 1);
			}
		}

		.label {
			min-width: 20%;
			color: rgba(51, 51, 51, 1);
			font-size: 30rpx;
		}

		.placeholder {
			color: rgba(204, 204, 204, 1);
			font-size: 26rpx;
		}

		.introduction {
			margin-top: 6rpx;
			line-height: 39rpx;
		}

		.upload {
			width: 345px;
			height: 44px;
			border-radius: 4px;
			background-color: #09BB07;
			color: rgba(255, 255, 255, 1);
			font-size: 17px;
			margin-top: 90rpx;
		}
	}
</style>
