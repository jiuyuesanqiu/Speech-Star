import Vue from 'vue'
import App from './App'
import store from './store'

//这里必须要用相对路径，否则不能编译
import nxLogin from './components/nx-login.vue'
Vue.component('nx-login',nxLogin)

Vue.config.productionTip = false

Vue.prototype.$store = store

App.mpType = 'app'

Vue.mixin({
	onLoad() {
		wx.hideShareMenu()
	}
})

const app = new Vue({
	store,
	...App
})
app.$mount()
