
<template>
    <div class="wrapper">
        <h5>角色列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" label-width="80px" class="demo-form-inline" size="small">
                <el-form-item label="角色名称">
                    <el-input v-model.trim="formInline.roleName" clearable></el-input>
                </el-form-item>
                <el-form-item label="创建人">
                    <el-input v-model.trim="formInline.userName" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="formInline.status" placeholder="请选择" clearable  style="width: 150px">
                        <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="position: absolute;right: -10px">
                    <el-button type="primary" @click="handleClickGuery">查询</el-button>
                    <el-button type="primary" @click="handleClickNewlyBuild">新建</el-button>
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
                        prop="roleName"
                        label="角色名称"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="roleJurisdiction"
                        label="角色权限"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="创建人"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="180">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="userNameUpdate"
                        width="120"
                        label="修改人">
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更改时间"
                        width="180">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick($event,scope.row)" type="text" size="small">编辑</el-button>
                    </template>
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
    const statusList = [
        {id:1,name:'启用',value:'true'},
        {id:2,name:'禁用',value:'false'},
    ];
    import { adminGgtRolesIF } from '../../../api/roleList';
    import { handleStatus } from '../../../assets/js/public-method';
    export default {
        name: "roleList",
        data() {
            return {
                formInline: {
                    roleName: '',
                    userName: '',
                    status: '',
                    pageNum: '',
                    pageSize: '',
                },
                statusList:statusList,
                tableData:{},

            }
        },
        filters:{
            isStatusName(val){//转成名字
                let name ='';
                switch(val) {
                    case true:
                        name='启用';
                        break;
                    case false:
                        name='禁用';
                        break;
                    default:
                        name='';
                }
                return name;
            },
            format: function(val) { //时间戳转换日期时间格式
                if(val){
                    const date = new Date(val);
                    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`

                }else {
                    return'';
                }
            },
        },
        methods: {

            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            handleClickGuery(){ //列表查询按钮
                let _this = this;
                let params = {
                    roleName:_this.formInline.roleName,
                    userName:_this.formInline.userName,
                    status:_this.formInline.status,
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
                _this.$router.push({path:'/roleList',query: params});
            },
            handleClickNewlyBuild(){ //列表新建
                this.$router.push({path:'/roleRelease'});
            },
            handleClick(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
                if(eventVal==='编辑'){
                    _this.$router.push({path:'/roleRelease',query: { id: val.id,modify:1}});
                }else if(eventVal==='查询'){

                }
            },
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    roleName:paramsPage.roleName||'',
                    userName:paramsPage.userName||'',
                    status:paramsPage.status||'',
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
                this.$router.push({path:'/roleList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    roleName:paramsPage.roleName||'',
                    userName:paramsPage.userName||'',
                    status:paramsPage.status||'',
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
                this.$router.push({path:'/roleList',query: params});

            },
            getAdminGetRolesList(url,parma) {//获取列表
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
                this.formInline.roleName = params.roleName||'';
                this.formInline.userName = params.userName||'';
                this.formInline.status = params.status||'';
                this.formInline.pageNum = params.pageNum||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getAdminGetRolesList(adminGgtRolesIF,params);
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

</style>