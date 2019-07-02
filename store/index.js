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
			country:''
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
		}
	}
})

export default store
