<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "common/main.css";
	@import "common/icon.css";
	@import "common/bootstrap.wxss";
	page {
		background-color: #f7f7f7;
	}
	
	.text-primary {
		color: #09bb07 !important;
	}
	
	.fixed-bottom {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
	}
	
	.text-link {
		color: #576b95;
	}
	
	.text-success {
		color: #09BB07;
	}
	
	.text-error{
		color: #e64340;
	}
</style>
