import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const db = wx.cloud.database();

const store = new Vuex.Store({
	state: {
		userInfo:{}
	},
	getters:{
		isLogin(state){
			return Boolean(state.userInfo._id);
		}
	},
	mutations: {	//所有同步状态更改都提交mutation
		login(state) {
			state.isLogin = true;
		},
		/**
		 * 更新用户信息
		 * @param {Object} state
		 * @param {Object} userInfoFielld	要更新的字段，传值如{signature:'走自己的路，让别人说去吧'}
		 */
		updateUserInfoField(state,userInfoFielld){
			state.userInfo = {...state.userInfo,...userInfoFielld}
		}
	},
	actions:{	//所有异步状态更改都分发action
		updateUserInfo({commit}){
			wx.cloud.callFunction({
				name: 'getOwnerUserInfo',
			}).then(res => {
				commit("updateUserInfoField",res.result);
			})
		}
	}
})

export default store
