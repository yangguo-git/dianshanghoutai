
<template>
    <div class="wrapper">
        <h5>用户配置</h5>

        <el-form :block="true" :model="formInline" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="userRelease-form" size="small">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model.trim="formInline.roleName" placeholder="请输入角色名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio v-model="formInline.status" :label='true'>启用</el-radio>
                <el-radio v-model="formInline.status" :label='false'>禁用</el-radio>
            </el-form-item>
            <!--<el-form-item label="角色权限">
                <el-tree
                        :data="formInline.roleJurisdictionsData"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current>
                </el-tree>
            </el-form-item>-->
            <el-form-item class="footer-btn-box">
                <el-button @click="handleClick" size="mini">取 消</el-button>
                <el-button type="primary" @click="onSubmit('ruleForm')" size="mini">保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import { adminGetRoleByIdIF, adminAddRoleIF,adminUpdateRoleIF } from '../../../api/roleRelease';
    import { handleStatus } from '../../../assets/js/public-method';

    export default {
        name: "roleRelease",
        data() {
            let validateRoleName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入角色名称'));
                } else {
                    callback();
                }
            };
            return {
                formInline: {
                    roleName: '',
                    status: '',
                    roleJurisdiction:[],
                    roleJurisdictionsData:[
                        {
                            id: 1,
                            label: '一级 1',
                            children: [{
                                id: 4,
                                label: '二级 1-1',
                                children: [{
                                    id: 9,
                                    label: '三级 1-1-1'
                                }, {
                                    id: 10,
                                    label: '三级 1-1-2'
                                }]
                            }]
                        }
                    ]
                },
                rules: {
                    roleName: [
                        { validator: validateRoleName, trigger: 'blur' },
                    ],
                },
            }
        },
        methods: {

            onSubmit(formName) {
                let _this = this;
                let url = adminUpdateRoleIF;
                let params = {
                    id:_this.formInline.id,
                    roleName:_this.formInline.roleName,
                    status: _this.formInline.status,
                };
                if(!params.id){
                    delete params.id;
                    url = adminAddRoleIF
                }
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _this.$post(url, params).then(res => {
                            if (res.status===0) {
                                _this.$router.push('/roleList');
                            } else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });

            },
            handleClick(e,val) {
                this.$router.push('/roleList');
            },
            init() {//初始化数据
                let _this = this;
                let params = _this.$route.query;
                if(params.id){
                    _this.$get(adminGetRoleByIdIF,{roleId:params.id}).then(res => {
                        if(res.status === 0){
                            if(!res.data){
                                _this.$message({
                                    type: "error",
                                    message: '没有获取到数据'
                                });
                                setTimeout(function () {
                                    _this.$router.go(-1);
                                },1500);
                            }else {
                                _this.formInline.id=res.data.id;
                                _this.formInline.roleName=res.data.roleName;
                                _this.formInline.status=res.data.status;
                            }

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
                    _this.formInline.roleName='';
                    _this.formInline.status=true;
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