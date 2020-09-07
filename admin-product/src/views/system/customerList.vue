
<template>
    <div class="wrapper">
        <h5>客户列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">

                <el-form-item label="微信昵称">
                    <el-input v-model.trim="formInline.nickName" clearable style="width: 200px;"></el-input>
                </el-form-item>

                <el-form-item label="手机号">
                    <el-input v-model.trim="formInline.phone" clearable style="width: 200px;" @keyup.native="number('phone')"></el-input>
                </el-form-item>

                <el-form-item label="客户类型">
                    <el-select v-model="formInline.accountType" placeholder="请选择" clearable style="width: 150px">
                        <el-option v-for="item in accountTypeList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item style="position: absolute;right: -10px">
                    <el-button type="primary" @click="handleClickGuery" size="mini">查询</el-button>
                </el-form-item>
            </el-form>

        </div>
        <!--列表展示-->
        <div class="list-box">
            <el-table
                    :data="tableData.list"
                    border
                    size="small"
                    tooltip-effect="dark"
                    :cell-style="listClass"
                    :header-cell-style="headleListClass"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="序号"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="nickName"
                        label="微信昵称"
                        width="250">
                    <template slot-scope="scope">
                        {{  nickNameDecode(scope.row.nickName) }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="openId"
                        label="openId">
                </el-table-column>
                <el-table-column
                        prop="accountType"
                        label="客户类型"
                        width="150">
                    <template slot-scope="scope">
                        {{ scope.row.accountType | isAccountTypeName }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="province"
                        width="150"
                        label="省份">
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="paging-box"
                 v-show="tableData.list&&tableData.list.length>0">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="tableData.pageNum"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="tableData.pageSize||10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.total">
                </el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
    /*运单名称*/
    const accountType = [
        {id:1,name:'公众号',value:'wx'},
        {id:2,name:'小程序',value:'minip'},
    ];
    import { adminGetWxUsersIF } from '../../api/customerList';
    import { handleStatus } from '../../assets/js/public-method';

    export default {
        name: "customerList",
        data() {
            return {
                formInline: {
                    nickName: '',
                    phone: '',
                    accountType: '',
                    pageNum:'1',
                    pageSize:'10',
                },
                accountTypeList: accountType,
                tableData:{},
            }
        },
        filters:{
            isAccountTypeName(val){//转成名字
                let name ='';
                switch(val) {
                    case 'wx':
                        name='公众号';
                        break;
                    case 'minip':
                        name='小程序';
                        break;
                    default:
                        name='';
                }
                return name;
            },

        },
        methods: {
            //微信昵称解码
            nickNameDecode(val) {
                if(!val){
                    return '';
                }else {
                    return decodeURIComponent(val);
                }
            },
            number(val) {//只能输入数字
                this.formInline[val] = this.formInline[val].replace(/[^\.\d]/g, '');
                this.formInline[val] = this.formInline[val].replace('.', '');
            },
            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            handleClickGuery(){ //列表查询按钮
                let _this = this;
                let params = {
                    nickName:_this.formInline.nickName,
                    phone:_this.formInline.phone,
                    accountType:_this.formInline.accountType,
                    pageNum:'1',
                    pageSize:'10',
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = _this.$Base64.encode(params[key]+'');
                    }
                }
                _this.$router.push({path:'/customerList',query: params});
            },
            handleClick(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
            },
            //分页
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    nickName:paramsPage.nickName||'',
                    phone:paramsPage.phone||'',
                    accountType:paramsPage.accountType||'',
                    pageNum:'1',
                    pageSize:val,
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = this.$Base64.encode(params[key]+'');
                    }
                }
                this.$router.push({path:'/customerList',query: params});
            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    nickName:paramsPage.nickName||'',
                    phone:paramsPage.phone||'',
                    accountType:paramsPage.accountType||'',
                    pageNum:val,
                    pageSize:paramsPage.pageSize||this.tableData.pageSize||'10',
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = this.$Base64.encode(params[key]+'');
                    }
                }
                this.$router.push({path:'/customerList',query: params});

            },
            getAdminGetCustomerList(url,parma) {//获取列表
                let _this = this;
                _this.$get(url,parma).then(res => {
                    if(res.status === 0){
                        _this.tableData = res.data;
                    }else {
                        handleStatus(_this,res.status,res.msg);

                    }
                });
            },
            fetchData(){//url路径
                let params = {};
                params=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in params){
                    params[key] = this.$Base64.decode(params[key]);
                }
                this.formInline.nickName = params.nickName||'';
                this.formInline.phone = params.phone||'';
                this.formInline.accountType = params.accountType||'';
                this.formInline.pageNum = params.pageNum||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getAdminGetCustomerList(adminGetWxUsersIF,params);
            }
        },
        watch:{
            '$route':'fetchData'
        },
        mounted() {
            this.fetchData();
        }
    }
</script>

<style scoped>
    .demo-form-inline {
        position: relative;
    }
    .query-box {
        margin: 20px 0;
        border-bottom: 1px dashed #ccc;
    }
    .paging-box {
        text-align: right;
        margin: 15px;
    }
    .dialog-footer {
        text-align: center;
    }
    .dialog-footer button {
        margin:0 25px;
    }
    .categoryData-form {
        width: 280px;
        margin-left: 20px;
    }

</style>