import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const db = wx.cloud.database();

const store = new Vuex.Store({
	state: {
		isLogin: false,
		userInfo:{
			nickName:'',
			avatarUrl:'',
			gender:'',
			province:'',
			city:'',
			country:'',
			signature:''
		}
	},
	mutations: {
		login(state, provider) {
			state.isLogin = true;
			state.userInfo = provider;
		},
		updateUserInfo(state){
			db.collection('user').get().then(res => {
				state.userInfo = res.data[0];
			})
		},
		updateAvatar(state,url){
			state.userInfo.avatarUrl = url;
		},
		updateNickName(state,nickName){
			state.userInfo.nickName = nickName;
		},
		updateSignature(state,signature){
			state.userInfo.signature = signature;
		},
		updateGender(state,gender){
			state.userInfo.gender = gender;
		},
	}
})

export default store
