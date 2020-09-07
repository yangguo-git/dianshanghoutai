<template>
    <div class="main">
        <h1 style="display: block;font-size: 30px;font-weight: 600;text-align: center;margin-bottom: 20px;">电商后台</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
            <el-form-item label="" prop="userName">
                <el-input v-model.trim="ruleForm.userName" prefix-icon="el-icon-user" placeholder="用户名" clearable></el-input>
            </el-form-item>
            <el-form-item label="" prop="passWord">
                <el-input type="password" v-model.trim="ruleForm.passWord"  show-password prefix-icon="el-icon-lock" clearable placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item label="" prop="imgverif">
                <el-input v-model.trim="ruleForm.imgverif" prefix-icon="el-icon-picture-outline" placeholder="图片验证码" clearable style="width: 220px;"></el-input>
                <img  class="picturepass"  :src="imgurl" alt="" @click="imgReloadCode">
            </el-form-item>
            <el-form-item label="" prop="smsverif">
                <el-input v-model.trim="ruleForm.smsverif" prefix-icon="el-icon-message" placeholder="短信验证码" clearable style="width: 220px;"></el-input>
                <el-button class="mespass" :disabled="disabled" @click="countDown">{{mescont}}</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100%;">登 &nbsp;录</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    function errorMess(_this, _type, _message, _duration) {
        return _this.$message({
            message: _message,
            type: _type,
            duration:_duration||1500
        });
    }
    import { userLogin, getVerify, checkVerify,userSms } from '../api/login';
    export default {
        name: "login",
        data() {
            let validateUserName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入用户名'));
                } else {
                    callback();
                }
            };
            let validatePassWord = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            let validateImgverif = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入图片验证码'));
                } else if (value) {
                    this.$get(checkVerify, {'imgverif':value}).then(res => {
                        if (res.status===0) {
                            callback();
                        } else {
                            callback(new Error(res.msg));
                        }
                    });
                 //  callback();
                }else {
                    callback();
                }
            };
            let validateSmsverif = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入短信验证码'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    userName: '',
                    passWord: '',
                    imgverif: '',
                    smsverif: '',
                },
                imgurl:this.$baseURL+getVerify,
                countdown:60,
                mescont:'获取验证码',
                disabled:false,
                rules: {
                    userName: [
                        { validator: validateUserName, trigger: 'blur' },
                    ],
                    passWord: [
                        { validator:validatePassWord, trigger: 'blur' },
                    ],
                    imgverif: [
                        { validator:validateImgverif, trigger: 'blur' },
                    ],
                    smsverif: [
                        { validator:validateSmsverif, trigger: 'blur' },
                    ],

                }
            };
        },
        methods: {
            submitForm(formName) {
                let _this = this;
                let params = Object.assign({}, _this.ruleForm);
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.$post(userLogin, params).then(res => {
                            if (res.status===0) {
                                sessionStorage.setItem("userInfo", JSON.stringify(res.data));
                                _this.$router.push('/productList');
                            } else {
                                _this.$message({
                                    type: "error",
                                    message: res.msg
                                });

                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            imgReloadCode(){
               this.imgurl = this.$baseURL + getVerify+"?"+Math.floor(Math.random()*10000)
            },
            countDown(){
                let _this = this;
                if(!_this.ruleForm.userName){
                    errorMess(_this,'error', '请输入用户名！' );
                    return false;
                }else if(!_this.ruleForm.passWord){
                    errorMess(this,'error', '请输入密码！' );
                    return false;
                }else if(!_this.ruleForm.imgverif){
                    errorMess(_this,'error', '请输入图片验证码！' );
                    return false;
                }
                _this.disabled = true;
                let params = Object.assign({}, _this.ruleForm);
                delete params.smsverif;
                let timer = setInterval(()=>{
                    _this.countdown--;
                    _this.mescont = "重新发送("+_this.countdown+")s";
                    if(_this.countdown==0){
                        _this.mescont = "获取验证码";
                        _this.countdown = 60;
                        _this.disabled = false;
                        clearInterval(timer);
                    }
                },1000);
                _this.$post(userSms, params).then(res => {
                    if (res.status===0) {

                    } else {
                        _this.$message({
                            type: "error",
                            message: res.msg
                        });
                        clearInterval(timer);
                        _this.mescont = "获取验证码";
                        _this.countdown = 60;
                        _this.disabled = false;
                    }
                });


            }
        }
    }
</script>

<style scoped>
    .main {
        width: 360px;
        height: 390px;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
    }
    .main .picturepass {
        width: 130px;
        height: 40px;
        position: absolute;
        top: 0;
        right: 0;
    }
    .main .mespass {
        width: 130px;
        position: absolute;
        right: 0;
        top: 0;
    }
</style>