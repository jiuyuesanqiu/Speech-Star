<template>
	<view class="page">
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom marginPadding headBox" @tap="changeAvatar">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center">头像</view>
				</view>
				<view class="d-flex align-center p-2">
					<image class="radius" :src="userInfo.avatarUrl" mode=""></image>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom marginPadding" @tap="toEdit('设置名字','nickName')">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center pt-4 pb-4">昵称</view>
				</view>
				<view class="d-flex align-center pr-2">
					<view class="d-flex align-center">{{userInfo.nickName}}</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view v-if="userInfo.gender==0" class="d-flex border-bottom marginPadding" @tap="editGender">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center pt-4 pb-4">性别</view>
				</view>
				<picker class="d-flex align-center pr-2" @change="editGender" :range="genderList">
					<view class="d-flex align-center" v-if="userInfo.gender==0">未知</view>
				</picker>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray"></text>
				</view>
			</view>
			<view v-else class="d-flex border-bottom marginPadding">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center pt-4 pb-4">性别</view>
				</view>
				<view class="d-flex align-center pr-2">
					<view class="d-flex align-center" v-if="userInfo.gender==2">女</view>
					<view class="d-flex align-center" v-if="userInfo.gender==1">男</view>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex marginPadding" @tap="toEdit('个性签名','signature')">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center pt-4 pb-4">个性签名</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view class="d-flex align-center">{{userInfo.signature}}</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray"></text>
				</view>
			</view>
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
				genderList: ['男', '女'],
				genderNum: 0
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
			console.log(this.userInfo);
		},
		methods: {
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
			toEdit(title, opt) {
				uni.navigateTo({
					url: `../edit/edit?title=${title}&opt=${opt}`
				})
			},
			editGender(e) {
				if (e.type == 'change') {
					const self = this;
					//更新性别
					db.collection('user').doc(self.userInfo._id).update({
						data: {
							gender: Number(e.detail.value) + 1
						},
						success: function(res) {
							console.log('更新性别成功');
							self.updateGender(Number(e.detail.value) + 1);
						}
					});
				}
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			...mapMutations(['updateUserInfo', 'updateAvatar', 'updateGender'])
		}
	};
</script>

<style scoped>
	.container {
		padding: 32upx;
	}

	#editor {
		width: 100%;
		height: 10%;
		background-color: #fff;
		font-size: 32upx;
	}

	.marginPadding {
		margin: 0 0 0 32upx;
		padding: 0 20upx 0 0;
		font-size: 32upx;
	}

	.headBox image {
		width: 128upx;
		height: 128upx;
	}
</style>
