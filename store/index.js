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
			state.isLogin = true;
			state.userInfo = provider;
		}
	}
})

export default store
