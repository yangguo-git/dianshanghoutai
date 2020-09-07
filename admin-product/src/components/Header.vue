<template>
	<header class="header-nav">
		<el-row>
			<el-col :span="6">
				<span class="title">电商后台管理系统</span>
			</el-col>
			<el-col :span="6" :offset="12" class="user">
				<div class="userinfo">
					<img :src="user.userimg" alt="" class="user-img">
					<el-dropdown @command="handleCommand" placement="top-start">
						<span class="el-dropdown-link userinfo-box">
							<span>您好</span>
							<span>{{user.userCode}}</span>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="退出">退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>

				</div>
			</el-col>
		</el-row>
	</header>
</template>

<script>

	export default {
		name: 'header-nav',
		data() {
			return {
				user:{
					//userimg:'http://gss0.baidu.com/7Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/267f9e2f07082838685c484ab999a9014c08f11f.jpg',
					userimg:require('../assets/img/headImg.jpg'),
					userCode:''
				},
			}
		},
		methods: {
			handleCommand(command) {
				if(command === '退出') {
					sessionStorage.removeItem("userInfo");
					this.$router.push('/login');
				}
			},
			userinfo(){
				let _this = this;
				let userInfo =  JSON.parse(sessionStorage.getItem("userInfo"));
				if(!userInfo){
					_this.$router.push('/login');
				}else {
					_this.user.userCode = userInfo.userCode;
				}
			}
		},
		mounted() {
			this.userinfo();
		}
	}
</script>
<style scoped>
	.header-nav {
		width: 100%;
		background: #409eff;
		color: #fff;
		border-bottom: 1px solid #409eff;
		overflow: hidden;
		padding: 15px 0;
	}
	.title {
		margin-left: 20px;
		vertical-align: sub;
	}
	.userinfo {
		text-align: right;
		padding-right: 30px;
	}
	.user-img {
		width: 35px;
		height: 35px;
		border-radius: 50%;
		border: 1px solid #ddd;
		vertical-align: middle;
	}
	.userinfo-box {
		display: inline-block;
		margin-right: 10px;
		font-size: 13px;
		margin-left: 10px;
		vertical-align: middle;
		height: 40px;
		text-align: left;
		cursor: pointer;
	}
	.userinfo-box>span {
		display: block;
		color: #fff;
	}

</style>
