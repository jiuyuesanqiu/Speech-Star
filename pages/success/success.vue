<template>
	<view>
		<view class="text-center">
			<image class="logo" src="../../static/star.png" mode=""></image>
		</view>
		<view class="success text-center mt-3">
			<text>恭喜！节目已经发布成功</text>
		</view>
		<view class="group">
			<view class="mb-4">
				<nxButton openType="share" round>分享，轻松提升播放量</nxButton>
			</view>
			<nxButton plain round @click.native="goHome()">完成</nxButton>
		</view>
		<view class="d-flex justify-center mt-5" @click="toDynamicDetail">
			<view class="content d-flex">
				<view>
					<image class="cover" :src="coverSrc"></image>
				</view>
				<view class="right">
					<view class="title">
						<text>{{title}}</text>
					</view>
					<view class="time">
						<text>时长：{{durationText}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- canvas.wxml -->
		<canvas style="width: 300px; height: 240px;position: fixed;left: 9999999upx;" canvas-id="firstCanvas"></canvas>
	</view>
</template>

<script>
	import util from '../../common/util.js';
	import nxButton from '../../components/nx-button.vue';
	import wmPoster from '../../components/wm-poster/wm-poster.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				coverSrc: '',
				title: '',
				duration: '',
				id: '',
				shareCoverUrl: ''
			}
		},
		onShareAppMessage() {
			return {
				title: this.getShareTitle(this.userInfo.nickName, this.title),
				path: `/pages/dynamicDetail/dynamicDetail?id=${this.id}`,
				imageUrl: this.shareCoverUrl
			}
		},

		methods: {
			getShareCover() {
				return new Promise((resolve, reject) => {
					wx.canvasToTempFilePath({
						canvasId: 'firstCanvas',
						success(res) {
							resolve(res.tempFilePath)
						}
					})
				})
			},
			/**
			 * 获取分享标题
			 */
			getShareTitle(nickName, title) {
				return `【${nickName}】${title}`;
			},
			goHome() {
				uni.switchTab({
					url: '../index/index?refresh=true'
				})
			},
			toDynamicDetail() {
				uni.redirectTo({
					url: `../dynamicDetail/dynamicDetail?id=${this.id}`
				})
			},
			async uploadFile(cloudPath, filePath, progressCallback = () => {}) {
				return new Promise((resolve, reject) => {
					let uploadTask = wx.cloud.uploadFile({
						cloudPath: cloudPath,
						filePath: filePath,
						success(res) {
							resolve(res.fileID)
							console.log('上传文件成功')
						}
					})
					uploadTask.onProgressUpdate(progressCallback)
				})
			},
			/**
			 * 格式化云存储路径
			 * @param {Object} tempFilePath	临时文件路径
			 * @param {Object} folder	上传到哪个文件夹
			 */
			formatCloudPath(tempFilePath, folder = '') {
				//获取文件后缀
				let suffix = tempFilePath.substring(tempFilePath.lastIndexOf('.'));
				//封面生成文件名
				let cloudPath = folder + new Date().getTime() + Math.floor(Math.random() * 100) + suffix;
				console.log("格式化云存储路径成功")
				return cloudPath;
			},
			generateShareImg() {
				const self = this;
				wx.canvasToTempFilePath({
					canvasId: 'firstCanvas',
					success(res) {
						let cloudPath = self.formatCloudPath(res.tempFilePath, 'img/shareCover/')
						self.uploadFile(cloudPath, res.tempFilePath).then((fileID) => {
							wx.cloud.getTempFileURL({
								fileList: [{
									fileID
								}]
							}).then(res => {
								self.shareCoverUrl = res.fileList[0].tempFileURL;
								console.log("生成分享图成功", self.shareCoverUrl)
							}).catch(error => {})
						});
					}
				})
			},
			async getImageInfo(imgSrc) {
				return new Promise((resolve, errs) => {
					uni.getImageInfo({
						src: imgSrc,
						success: function(image) {
							resolve(image);
						},
						fail(err) {
							errs(err);
						}
					});
				});
			},
			async dealShareImg(){
				const self = this;
				// 使用 wx.createContext 获取绘图上下文 context
				var ctx = wx.createCanvasContext('firstCanvas')
				ctx.drawImage('/static/shareCover.png', 0, 0, 300, 240)
				//开始路径画圆,剪切处理
				ctx.save();
				ctx.beginPath();
				ctx.arc(145, 131, 64, 0, Math.PI * 2);
				ctx.clip(); //剪切路径
				let image = await this.getImageInfo(this.userInfo.avatarUrl);
				ctx.drawImage(image.path, 81, 67, 128, 128)
				//恢复状态
				ctx.restore();
				ctx.draw(false, () => {
					self.generateShareImg();
				})
			}
		},
		onLoad(option) {
			const self = this;
			this.coverSrc = option.coverSrc;
			this.title = option.title;
			this.duration = option.duration;
			this.id = option.id;
		},
		onReady() {
			this.dealShareImg();
		},
		computed: {
			durationText() {
				return util.formatDuration(this.duration);
			},
			...mapState(['userInfo'])
		},
		components: {
			nxButton,
			wmPoster
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		height: 100Vh;
		width: 100vw;
	}

	.logo {
		width: 300upx;
		height: 300upx;
	}

	.group {
		padding: 0 90upx;
	}

	.success {
		color: rgba(51, 51, 51, 1);
		font-size: 17px;
		margin-bottom: 120upx;
	}

	.content {
		padding: 30rpx;
		width: 325px;
		height: 90px;
		border-radius: 6px;
		background-color: rgba(248, 248, 248, 1);

		.cover {
			width: 120rpx;
			height: 120rpx;
			border-radius: 6rpx;
		}

		.right {
			padding: 15rpx;
			padding-left: 30rpx;

			.title {
				color: rgba(16, 16, 16, 1);
				font-size: 13px;
				margin-bottom: 24rpx;
			}

			.time {
				color: rgba(152, 152, 152, 1);
				font-size: 13px;
			}
		}
	}
</style>
