import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const db = wx.cloud.database();

const store = new Vuex.Store({
	state: {
		isLogin: false,
		userInfo:{}
	},
	mutations: {	//所有同步状态更改都提交mutation
		login(state, userInfo) {
			state.isLogin = true;
			state.userInfo = userInfo;
		},
		updateUserInfoSuccess(state,userInfo){
			console.log(userInfo)
			state.userInfo = userInfo;
		},
		updateAvatar(state,url){
			state.userInfo.avatarUrl = url;
		},
		updateNickName(state,nickName){
			state.userInfo.nickName = nickName;
		},
		updateSignature(state,signature){
			state.userInfo = {...state.userInfo,signature}
		},
		updateGender(state,gender){
			state.userInfo.gender = gender;
		}
	},
	actions:{	//所有异步状态更改都分发action
		updateUserInfo({commit}){
			wx.cloud.callFunction({
				name: 'getOwnerUserInfo',
			}).then(res => {
				commit("updateUserInfoSuccess",res.result);
			})
		}
	}
})

export default store
