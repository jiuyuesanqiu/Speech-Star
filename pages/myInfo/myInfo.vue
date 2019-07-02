<template>
	<view class="page">
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="changeAvatar" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
				<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						更换头像
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<image style="width: 128upx; height: 128upx;border-radius: 50%;" :src="userInfo.avatarUrl" mode=""></image>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
				<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						昵称
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						{{userInfo.nickName}}
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex" style="margin: 0 0 16upx 26upx;padding: 20upx 20upx 20upx 0;">
				<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						性别
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;" v-if="userInfo.gender==2">
						女
					</view>
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;" v-else="userInfo.gender==1">
						男
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
				<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						生日
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						1990-06-01
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex" @tap="toEdit" style="margin: 0 0 16upx 26upx;padding: 20upx 20upx 20upx 0;">
				<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						所在城市
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						{{userInfo.province}}
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="toEdit" style="margin: 0 0 0 26upx;padding: 20upx 20upx 20upx 0;">
				<view class="d-flex flex-grow-1 align-center" style="padding: 20upx 0 20upx 6upx;">
					<view style="font-size: 32upx;line-height: 68upx;height: 68upx;">
						简介
					</view>
				</view>
			</view>
		</view>
		<view class="container bg-white">
			<editor id="editor" class="" :placeholder="placeholder" @ready="onEditorReady"></editor>
			<view style="text-align: right;">0/140</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	const db = wx.cloud.database();
	export default {
		data() {
			return {
				placeholder: '开始输入...'
			}
		},
		computed: {
			...mapState(['isLogin', 'userInfo'])
		},
		onLoad() {
			wx.getUserInfo({
				success: (res) => {
					console.log(res);
				},
			})
		},
		methods: {
			//更换头像
			changeAvatar() {
				const self = this;
				uni.chooseImage({
					count: 1,
					success(res) {
						const tempFilePath = res.tempFilePaths[0];
						self.updateAvatar(tempFilePath);
						//获取文件后缀
						let suffix = tempFilePath.substring(tempFilePath.lastIndexOf('.'));
						//生成文件名
						let cloudPath = 'avatar/' + new Date().getTime() + Math.floor(Math.random() * 100) + suffix;
						//删除用户旧头像
						wx.cloud.deleteFile({
							fileList: [self.userInfo.avatarUrl],
							success: res => {
								console.log('删除旧头像成功')
							},
							fail: console.error
						})
						//上传用户新头像
						const uploadTask = wx.cloud.uploadFile({
							cloudPath: cloudPath,
							filePath: tempFilePath,
							success: res => {
								//更新用户头像
								db.collection('user').doc(self.userInfo._id).update({
									data: {
										avatarUrl: res.fileID
									},
									success: function(res) {
										console.log('更新用户头像成功')
									}
								})
							},
							fail(res) {
								console.log('上传失败', res)
							}
						})
					}
				})
			},
			toEdit() {
				uni.navigateTo({
					url: '../edit/edit'
				})
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			...mapMutations(['updateUserInfo','updateAvatar'])
		},
		components: {

		}
	};
</script>

<style scoped>
	.page {
		/* background-color: #fff; */
	}

	.container {
		padding: 10px;
	}

	#editor {
		width: 100%;
		height: 10%;
		background-color: #fff;
	}
</style>
