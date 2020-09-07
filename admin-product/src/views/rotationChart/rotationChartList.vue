
<template>
    <div class="wrapper">
        <h5>首页轮播图列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
                <el-form-item label="名称">
                    <el-input v-model.trim="formInline.productName" clearable></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="formInline.status" placeholder="请选择" clearable >
                        <el-option v-for="item in statusList"
                                   :key="item.value"
                                   :label="item.name"
                                   :value="item.value">
                        </el-option>
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
                        width="180"
                        label="序号">
                </el-table-column>
                <el-table-column
                        prop="coverImgUrl"
                        label="图片"
                        width="100">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverImgUrl" style="width: 40px;height: 40px;">
                    </template>
                </el-table-column>
                <el-table-column
                        prop="productName"
                        min-width="200"
                        label="名称">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status | trnStatusName }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sort"
                        label="排序"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="startTime"
                        label="开始时间"
                        width="150">
                    <template slot-scope="scope">
                        {{ scope.row.startTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="endTime"
                        label="结束时间"
                        width="150">
                    <template slot-scope="scope">
                        {{ scope.row.endTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status===1||scope.row.status===2"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">查看</el-button>
                        <el-button
                                v-if="scope.row.status===0"
                                @click="handleClick($event,scope.row)"
                                type="text"
                                size="small">编辑</el-button>
                        <el-button v-if="scope.row.status===2||scope.row.status===0"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">删除</el-button>
                        <el-button v-if="scope.row.status===0"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">上线</el-button>
                        <el-button v-if="scope.row.status===1"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">下线</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="paging-box" v-show="tableData.list&&tableData.list.length>0">
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

    let statusList=[
        {name:'待发布',value:'0'},
        {name:'已上线',value:'1'},
        {name:'已下线',value:'2'}
    ];
    import { adminCoverimgListIF, coverimgUpdateIF} from '../../api/rotationChartList';
    import { handleStatus } from '../../assets/js/public-method';
    export default {
        name: "RotationChartList",
        data() {
            return {
                formInline: {
                    productName: '',
                    status: '',
                },
                statusList:statusList,
                tableData:{},
            }
        },
        filters:{
            trnStatusName(val){//转成名字
                let name ='';
                switch(val) {
                    case 0:
                        name='待发布';
                        break;
                    case 1:
                        name='已上线';
                        break;
                    case 2:
                        name='已下线';
                        break;
                    case 9:
                        name='已删除';
                        break;
                    default:
                        name='';
                }
                return name;
            },
            format: function(val) {
                const date = new Date(val)
                return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`
            },
        },
        methods: {
            headleListClass() {//表头样式
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {//列表内容居中
                return 'text-align: center'
            },
            handleClickGuery(){ //列表查询按钮
                let _this = this;
                let params = {
                    productName:_this.formInline.productName,
                    status:_this.formInline.status,
                    pageNo:'1',
                    pageSize:'10',
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = _this.$Base64.encode(params[key]+'');
                    }
                }
                _this.$router.push({path:'/rotationChartList',query: params});


            },
            handleClickNewlyBuild(){ //列表新建
                this.$router.push({path:'/rotationChartDispose'});
            },
            handleClick(e,val) {//点击事件
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let eventVal = e.target.innerHTML;
                if(eventVal==='查看'){
                    _this.$router.push({path:'/rotationChartDispose',query: { id: val.id,modify:'2'}});
                }else if(eventVal==='编辑'){
                    _this.$router.push({path:'/rotationChartDispose',query: { id: val.id,modify:'1'}});
                }else if(eventVal==='删除'){
                    _this.$confirm('确定要删除此轮播图吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:9 };
                        _this.$post(coverimgUpdateIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                let obj = {
                                    productName:paramsPage.productName||'',
                                    status:paramsPage.status||'',
                                    pageNo:paramsPage.pageNo||'',
                                    pageSize:paramsPage.pageSize||_this.tableData.pageSize||'10',
                                };
                                let total = _this.tableData.total>0&&_this.tableData.total-1||0;
                                let zc = total % obj.pageSize;
                                if(zc===0){
                                    obj.pageNo =  obj.pageNo-1>=1?obj.pageNo-1:1;
                                    for(let key in obj){
                                        if(obj[key] === ''){
                                            delete obj[key];
                                        }else {
                                            obj[key] = _this.$Base64.encode(obj[key]+'');
                                        }
                                    }
                                    _this.$router.push({path:'/rotationChartList',query: obj});
                                }
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }else if(eventVal==='上线'){
                    _this.$confirm('确定要上线此轮播图吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:1 };
                        _this.$post(coverimgUpdateIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '上线成功!'
                                });
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }else if(eventVal==='下线'){
                    _this.$confirm('确定要下线此轮播图吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:2 };
                        _this.$post(coverimgUpdateIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '下线成功!'
                                });
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }
            },
            handleSizeChange(val) {//每页几条
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {

                    productName:paramsPage.productName||'',
                    status:paramsPage.status||'',
                    pageNo:'1',
                    pageSize:val,
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = this.$Base64.encode(params[key]+'');
                    }
                }

                this.$router.push({path:'/rotationChartList',query: params});
            },
            handleCurrentChange(val) {//当前第几页
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {

                    productName:paramsPage.productName||'',
                    status:paramsPage.status||'',
                    pageNo:val,
                    pageSize:paramsPage.pageSize||this.tableData.pageSize||'10',
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = this.$Base64.encode(params[key]+'');
                    }
                }

                this.$router.push({path:'/rotationChartList',query: params});
            },
            getRotationChartList(url,parma) {//获取轮播图列表
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

                this.formInline.productName = params.productName||'';
                this.formInline.status = params.status||'';
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getRotationChartList(adminCoverimgListIF,params);
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