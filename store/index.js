import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

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
			console.log(provider)
			state.isLogin = true;
			state.userInfo = provider;
		},
		logout(state) {
			state.login = false;
			state.token = '';
			state.userName = '';
			state.avatarUrl = '';
		}
	}
})

export default store
