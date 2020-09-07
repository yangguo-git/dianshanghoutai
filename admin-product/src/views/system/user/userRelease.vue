<template>
    <div class="wrapper">
        <h5>用户配置</h5>

        <el-form :block="true" :model="formInline" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="userRelease-form" size="small">
            <el-form-item label="用户名" prop="userCode">
                <el-input v-model.trim="formInline.userCode" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="userName">
                <el-input v-model.trim="formInline.userName" placeholder="请输入真实姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="userMobile">
                <el-input v-model.trim="formInline.userMobile" placeholder="请输入手机号" clearable @keyup.native="number('userMobile')"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio v-model="formInline.status" :label="true">启用</el-radio>
                <el-radio v-model="formInline.status" :label="false">禁用</el-radio>
            </el-form-item>
            <el-form-item label="用户角色" prop="roleName">
                <el-radio-group v-model="formInline.roleName">
                    <el-radio v-for="item in rolesData" :key="item.value" :label="item.label">{{item.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class="footer-btn-box">
                <el-button @click="handleClick" size="mini">取 消</el-button>
                <el-button type="primary" @click="onSubmit('ruleForm')" size="mini">保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import { adminGetRoleByIdIF, adminUserUpdateIF,adminUserInfoIF,adminUserRegisterIF,adminGetUserByIdIF } from '../../../api/userRelease';
    import { handleStatus } from '../../../assets/js/public-method';
    export default {
        name: "userRelease",
        data() {
            let validateuserCode = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入用户名'));
                } else {
                    callback();
                }
            };
            let validateuserName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入真实姓名'));
                } else {
                    callback();
                }
            };
            let validateUserMobile = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入手机号'));
                } else {
                    callback();
                }
            };
            let validateRoles = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请选中用户角色'));
                } else {
                    callback();
                }
            };
            return {
                formInline: {
                    id:'',
                    userCode: '',
                    userName: '',
                    userMobile: '',
                    status: true,
                    roleName: '',
                    roles:[],
                },
                rules: {
                    userCode: [
                        { validator: validateuserCode, trigger: 'blur' },
                    ],
                    userName: [
                        { validator:validateuserName, trigger: 'blur' },
                    ],
                    userMobile: [
                        { validator:validateUserMobile, trigger: 'blur' },
                    ],
                    roleName: [
                        { validator:validateRoles, trigger: ['blur'] },
                    ],

                },
                rolesData:[
                    {label:'开发者',value:1},
                    {label:'管理员',value:2},
                ]
            }
        },
        methods: {
            number(val) {//只能输入数字
                this.formInline[val] = this.formInline[val].replace(/[^\.\d]/g, '');
                this.formInline[val] = this.formInline[val].replace('.', '');
            },
            onSubmit(formName) {
                let _this = this;
                let url = adminUserUpdateIF;//更新
                let params = {
                    id:_this.formInline.id,
                    userCode:_this.formInline.userCode,
                    userName:_this.formInline.userName,
                    userMobile:_this.formInline.userMobile,
                    status: _this.formInline.status,
                    roleName: _this.formInline.roleName,
                    roles:[],
                };
                if(_this.formInline.roleName){
                    params.roles=[];
                    params.roles.push({roleName:_this.formInline.roleName});
                }

                if(!params.id){
                    delete params.id;
                    url = adminUserRegisterIF;
                }
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.$post(url, params).then(res => {
                            if (res.status===0) {
                                _this.$router.push('/userList');
                            } else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });

            },
            handleClick() {//取消
                this.$router.push('/userList');
            },
            init() {//初始化数据
                let _this = this;
                let params = _this.$route.query;
                if(params.id){
                    _this.$get(adminGetUserByIdIF,{userId:params.id}).then(res => {
                        if(res.status === 0){
                            _this.formInline.id=res.data.id;
                            _this.formInline.userCode=res.data.userCode;
                            _this.formInline.userName=res.data.userName;
                            _this.formInline.userMobile=res.data.userMobile;
                            _this.formInline.status=res.data.status;
                            _this.formInline.roleName=res.data.role[0].roleName;

                        }else {
                            if(res.status === 20002){
                                handleStatus(_this,res.status,res.msg);
                            }else {
                                _this.$message({
                                    type: "error",
                                    message: res.msg
                                });
                                setTimeout(function () {
                                    _this.$router.go(-1);
                                },1500);
                            }
                        }
                    });
                }else {
                    _this.formInline.id='';
                    _this.formInline.userCode='';
                    _this.formInline.userName='';
                    _this.formInline.userMobile='';
                    _this.formInline.status=true;
                    _this.formInline.roleName='';
                    _this.formInline.roles=[];
                }
            }
        },
        watch:{
            '$route':'init'
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .userRelease-form {
        width: 500px;
        margin: 20px;
    }
    .footer-btn-box {
        text-align: center;
    }
    .footer-btn-box button {
        padding: 8px 25px;
        margin-right: 20px;
    }
</style>