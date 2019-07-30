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
					<textarea class="text-right intro" placeholder-class="placeholder" v-model="intro" placeholder="介绍本期内容,可吸引更多播放哦!"></textarea>
				</view>
			</view>
			<view class="upload">
				<nxButton @click.native="publish" :loading = "loading">上传声音</nxButton>
			</view>
		</view>

	</view>
</template>

<script>
	const db = wx.cloud.database();
	import {
		mapState
	} from 'vuex';
	import nxButton from '../../components/nx-button.vue';
	export default {
		data() {
			return {
				title: '', //演讲标题
				intro: '', //音频简介
				tempSrc: '', //音频文件临时路径
				duration: 0, //音频时长
				progress: 0, //上传进度
				loading: false, //是否加载中
				coverPath: '', //封面图片临时路径
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
					sizeType: ['compressed'],
					success(res) {
						let tempFilePath = res.tempFilePaths[0];
						self.coverPath = tempFilePath;
					}
				})
			},
			async publish() {
				if (this.title == '') {
					uni.showToast({
						icon: 'none',
						title: '请输入演讲标题'
					})
					return;
				}
				if (this.loading) return;
				this.loading = true;
				let audioCloudPath = this.formatCloudPath(this.tempSrc, 'speech/');
				//上传音频
				let audioFileID = await this.uploadFile(audioCloudPath, this.tempSrc, (res) => {
					//此处减10是因为防止进度条加载完成，但实际上这条数据还没有被插入数据库，以免引起用户焦虑的等待
					this.progress = res.progress - 10;
				})
				if (this.coverPath != '') {
					let coverCloudPath = this.formatCloudPath(this.coverPath, 'cover/');
					//上传封面图
					let coverFileID = await this.uploadFile(coverCloudPath, this.coverPath);
					//发布动态
					this.publishDynamic(audioFileID,coverFileID);
				}else{
					this.publishDynamic(audioFileID)
				}
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
			/**
			 * 上传文件
			 * @param {Object} cloudPath	上传到云存储的路径
			 * @param {Object} filePath		本地文件的路径
			 */
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
			 * @param {Object} coverFileID
			 * @param {Object} audioFileID
			 */
			publishDynamic(audioFileID,coverFileID='cloud://product-yjcc.7072-product-yjcc/base/defaultCover.png') {
				//上传成功后，保存文件id到数据库
				db.collection('dynamic').add({
					data: {
						title: this.title, //演讲标题
						createTime: new Date(),
						comment: [], //评论人数
						duration: this.duration, //音频时长
						cover: coverFileID, //封面图
						audioFileID,
						intro: this.intro,
						likeUsers: [],
						playAmount: 0,
						userInfo: this.userInfo
					}
				}).then(res => {
					console.log("发布动态成功")
					this.progress = 100;
					this.loading = false;
					this.progress = 0;
					uni.reLaunch({
						url: `../success/success?coverSrc=${coverFileID}&title=${this.title}&duration=${this.duration}`
					})
				})
			}
		},
		components: {
			nxButton
		}
	}
</script>

<style lang="scss">
	.container {
		.banner {
			width: 375px;
			height: 144px;
			background-color: rgba(184, 184, 184, 1);

			.coverImg {
				height: 292upx;
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

		.intro {
			margin-top: 6rpx;
			line-height: 39rpx;
		}

		.upload {
			margin-top: 90upx;
			padding: 0 30upx;
		}
	}
</style>
