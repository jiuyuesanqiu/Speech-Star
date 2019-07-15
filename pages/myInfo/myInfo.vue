<template>
	<view class="page">
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="changeAvatar" style="margin: 0 0 0 32upx;padding: 0 20upx 0 0;">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center" style="font-size: 32upx;">
						更换头像
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="height: 180upx;">
					<image style="width: 128upx; height: 128upx;border-radius: 50%;" :src="userInfo.avatarUrl" mode=""></image>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="toEdit('设置名字','nikeName')" style="margin: 0 0 0 32upx;padding: 0 20upx 0 0;">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
						昵称
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
						{{userInfo.nickName}}
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex" style="margin: 0 0 16upx 32upx;padding: 0 20upx 0 0;">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
						性别
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;" v-if="userInfo.gender==2">
						女
					</view>
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;" v-if="userInfo.gender==1">
						男
					</view>
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;" v-if="userInfo.gender==0">
						未知
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view>
		<!-- <picker mode="date" :value="date" start="1950-01-01" :end="endDate" @change="bindDateChange">
			<view class="bg-white" style="width: 100%;">
				<view class="d-flex border-bottom" style="margin: 0 0 0 32upx;padding: 0 20upx 0 0;">
					<view class="d-flex flex-grow-1 align-center">
						<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
							生日
						</view>
					</view>
					<view class="d-flex align-center pr-2" style="">
						<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
							{{date}}
						</view>
					</view>
					<view class="d-flex align-center">
						<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
					</view>
				</view>
			</view>
		</picker>
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex" @tap="toEdit" style="margin: 0 0 16upx 32upx;padding: 0 20upx 0 0;">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
						所在城市
					</view>
				</view>
				<view class="d-flex align-center pr-2" style="">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
						{{userInfo.province}}
					</view>
				</view>
				<view class="d-flex align-center">
					<text class="cuIcon-right text-gray" style="font-size: 36upx;"></text>
				</view>
			</view>
		</view> 
		<view class="bg-white" style="width: 100%;">
			<view class="d-flex border-bottom" @tap="toEdit" style="margin: 0 0 0 32upx;padding: 0 20upx 0 0;">
				<view class="d-flex flex-grow-1 align-center">
					<view class="d-flex align-center" style="font-size: 32upx;height: 120upx;">
						简介
					</view>
				</view>
			</view>
		</view>
		<view class="container bg-white">
			<editor id="editor" class="" :placeholder="placeholder" @ready="onEditorReady"></editor>
			<view style="text-align: right;">0/140</view>
		</view> -->
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
			/* const currentDate = this.getDate({
				format: true
			}) */

			return {
				// placeholder: '小主很懒，还没有简介'
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		onLoad() {
		},
		methods: {
			/* getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}, */
			/**
			 * 修改生日
			 */
			/* bindDateChange: function(e) {
				this.date = e.target.value
			}, */
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
			toEdit(title, opt) {
				uni.navigateTo({
					url: `../edit/edit?title=${title}&opt=${opt}`
				})
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			...mapMutations(['updateUserInfo', 'updateAvatar'])
		}
	};
</script>

<style scoped>
	.page {
		/* background-color: #fff; */
	}

	.container {
		padding: 32upx;
	}

	#editor {
		width: 100%;
		height: 10%;
		background-color: #fff;
		font-size: 32upx;
	}
</style>
