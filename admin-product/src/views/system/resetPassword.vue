
<template>
    <div class="wrapper">
        <h5>密码重置</h5>
        <el-form :block="true" status-icon  :model="formInline" :rules="rules" ref="formInline" label-width="100px" class="userRelease-form" size="small">
            <el-form-item label="当前密码" prop="dqPass">
                <el-input v-model.trim="formInline.dqPass" show-password placeholder="请输入当前密码" clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPass">
                <el-input v-model.trim="formInline.newPass" show-password placeholder="请输入新密码" clearable></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input v-model.trim="formInline.checkPass" show-password placeholder="请输入确认密码" clearable></el-input>
            </el-form-item>
            <el-form-item class="footer-btn-box">
                <el-button type="primary" @click="submitForm('formInline')" size="mini">保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { adminPwdIF } from '../../api/resetPassword';
    import { handleStatus } from '../../assets/js/public-method';

    export default {
        name: "resetPassword",
        data() {
            let dqPass = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('当前密码不能为空'));
                }else {
                    callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入新密码'));
                } else {
                    if (this.formInline.checkPass !== '') {
                        this.$refs.formInline.validateField('checkPass');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入确认密码'));
                } else if (value !== this.formInline.newPass) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                formInline: {
                    dqPass: '',
                    newPass: '',
                    checkPass: '',
                },
                rules: {
                    newPass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                    dqPass: [
                        { validator: dqPass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                let _this = this;
                let url = adminPwdIF;
                let params = {
                    confirmPwd:_this.formInline.dqPass,
                    userPasswd: _this.formInline.newPass,
                };
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.$post(url, params).then(res => {
                            if (res.status===0) {
                                _this.$message({
                                    type: "success",
                                    message: '操作成功！'
                                });
                            } else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },


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