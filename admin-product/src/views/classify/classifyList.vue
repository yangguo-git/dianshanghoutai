<template>
    <div class="wrapper">
        <h5>分类列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" label-width="90px" :model="formInline" class="demo-form-inline" size="small">
                <el-form-item label="分类名称">
                    <el-input v-model.trim="formInline.categoryName" clearable></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                            v-model="setTime"
                            :default-time="['00:00:00', '23:59:59']"
                            type="datetimerange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="position: absolute;right: 10px">
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
                        prop="categoryName"
                        label="分类名称">
                </el-table-column>
                <el-table-column
                        prop="parentId"
                        width="180"
                        label="上级序号">
                </el-table-column>
                <el-table-column
                        prop="isDisplay"
                        label="是否显示"
                        width="100">
                    <template slot-scope="scope">
                        {{ scope.row.isDisplay | isDisplayName }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="categorySort"
                        label="排序"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        width="150"
                        label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="150"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick($event,scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="handleClick($event,scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="handleClick($event,scope.row)" type="text" size="small" v-if="!scope.row.parentId">查看下级</el-button>
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
        <!--编辑 新建-->
        <el-dialog
                :title="title"
                :visible.sync="dialogTableVisible"
                :close-on-click-modal='false'
                width="400px">
            <el-form label-position="right"
                     label-width="80px"
                     :model="categoryData"
                     class="categoryData-form"
                     ref="ruleForm"
                     size="small">
                <el-form-item label="分类名称">
                    <el-input v-model.trim="categoryData.categoryName" clearable></el-input>
                </el-form-item>
                <el-form-item label="上级序号" v-if="!!categoryData.parentId">
                    <el-input v-model="categoryData.parentIdName" readonly disabled ></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model.trim="categoryData.categorySort" @keyup.native="number('categorySort')" clearable></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-radio v-model="categoryData.isDisplay"  :label='false'>否</el-radio>
                    <el-radio v-model="categoryData.isDisplay"  :label='true'>是</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSave" size="small">保 存</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>

    import { adminCategoryAddIF, adminCategoryEditIF,adminCategoryListIF,adminCategoryDedIF, categoryListIF} from '../../api/classifyList';
    import { handleStatus, errorMess} from '../../assets/js/public-method';
    export default {
        name: "classifyList",
        data() {
            return {
                formInline: {//检索字段
                    categoryId: '',
                    parentId: '',
                    categoryName: '',
                    beginTime: '',
                    endTime: '',
                    pageNo: '',
                    pageSize: '',
                },
                categoryData:{//新建编辑
                    id:'',
                    categoryName:'',
                    parentId:'',
                    parentIdName:'',
                    categorySort:'',
                    isDisplay:false,
                },
                dialogTableVisible:false,//控制弹框
                title:'新建',//弹框标题
                setTime: [],//设置时间开始和结束 时间戳
                categoryList:[],//获取分类的数据
                tableData:{},//列表对象下 有分页和list
            }
        },
        filters:{
            isDisplayName(val){//转成名字
                let name ='';
                switch(val) {
                    case true:
                        name='是';
                        break;
                    case false:
                        name='否';
                        break;
                    default:
                        name='';
                }
                return name;
            },
            format: function(val) { //时间戳转换日期时间格式
                const date = new Date(val);
                return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`
            },
        },
        methods: {
            number(val) {//只能输入数字
                this.categoryData[val] = this.categoryData[val].replace(/[^\.\d]/g, '');
                this.categoryData[val] = this.categoryData[val].replace('.', '');
                if (this.categoryData[val] === '') {
                    this.categoryData[val] = '';
                } else {
                    this.categoryData[val] = Number(this.categoryData[val])+'';
                }
            },
            handleSave() {
                let _this = this;
                let url = adminCategoryAddIF;
                let params = {
                    categoryName:_this.categoryData.categoryName,
                    categorySort:_this.categoryData.categorySort,
                    isDisplay:_this.categoryData.isDisplay,
                    id:_this.categoryData.id,
                    parentId:_this.categoryData.parentId,
                };
                if(params.id){
                    url = adminCategoryEditIF;
                }else {
                    delete params.id;
                }
                if(!params.categoryName){
                    errorMess(_this, 'error', '请输入分类名称');
                    return false;
                }else if(params.categorySort===''||params.categorySort===undefined){
                    errorMess(_this, 'error', '请输入排序');
                    return false;
                }
                _this.$post(url, params).then(res => {
                    if (res.status===0) {
                        _this.dialogTableVisible=false;
                        _this.fetchData();
                    } else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },
            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            handleClickGuery(){ //列表查询按钮
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let parentId = paramsPage.parentId ||'';
                let params = {
                    categoryName:_this.formInline.categoryName,
                    beginTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[0]||'',
                    endTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[1]||'',
                    parentId:parentId,
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
                _this.$router.push({path:'/classifyList',query: params});
            },
            handleClickNewlyBuild(){ //列表新建
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let parentId = paramsPage.parentId ||'';
                this.title = '新建';
                _this.categoryData.categoryName = '';
                _this.categoryData.categorySort = '';
                _this.categoryData.id = '';
                _this.categoryData.isDisplay = false;
                _this.categoryData.parentId = parentId||'';
                if(!parentId){
                    this.dialogTableVisible = true;
                }else {
                    let parentIdNameArr = _this.categoryList.filter(function (item) {
                        return item.id === parentId;
                    });
                    if(parentIdNameArr&&parentIdNameArr.length>0){
                        _this.categoryData.parentIdName = parentIdNameArr[0].categoryName
                    }
                    this.categoryData.parentIdName =  _this.categoryData.parentId;
                    this.dialogTableVisible = true;
                }
            },
            handleClick(e,val) {
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let eventVal = e.target.innerHTML;
                let parentId = paramsPage.parentId ||'';
                if(eventVal==='编辑'){
                    this.title = eventVal;
                    _this.categoryData.categoryName = val.categoryName||'';
                    _this.categoryData.categorySort = val.categorySort===0?0:(val.categorySort||'');
                    _this.categoryData.id = val.id||'';
                    _this.categoryData.isDisplay = val.isDisplay||false;
                    _this.categoryData.parentId = parentId||val.parentId||'';
                    if(!_this.categoryData.parentId){
                        this.dialogTableVisible = true;
                    }else {
                        let parentIdNameArr = _this.categoryList.filter(function (item) {
                            return item.id === _this.categoryData.parentId;
                        });
                        if(parentIdNameArr&&parentIdNameArr.length>0){
                            _this.categoryData.parentIdName = parentIdNameArr[0].categoryName
                        }
                        _this.categoryData.parentIdName =  _this.categoryData.parentId;
                        _this.dialogTableVisible = true;
                    }

                }else if(eventVal==='删除'){
                    this.$confirm('确定要删除此分类吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ categoryId:val.id };
                        _this.$post(adminCategoryDedIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                let obj = {
                                    categoryName:paramsPage.categoryName||'',
                                    beginTime:paramsPage.beginTime||'',
                                    endTime:paramsPage.endTime||'',
                                    parentId:paramsPage.parentId||'',
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
                                    _this.$router.push({path:'/classifyList',query: obj});
                                }
                                _this.fetchData();

                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);

                }else if(eventVal==='查看下级'){
                    let params = {
                        parentId: val.id
                    };
                    for(let key in params){
                        params[key] = this.$Base64.encode(params[key]+'');
                    }
                    _this.$router.push({path:'/classifyList',query: params});
                }

            },
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    categoryName:paramsPage.categoryName||'',
                    beginTime:paramsPage.beginTime||'',
                    endTime:paramsPage.endTime||'',
                    parentId:paramsPage.parentId||'',
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
                this.$router.push({path:'/classifyList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    categoryName:paramsPage.categoryName||'',
                    beginTime:paramsPage.beginTime||'',
                    endTime:paramsPage.endTime||'',
                    parentId:paramsPage.parentId||'',
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
                this.$router.push({path:'/classifyList',query: params});
            },
            getCategoryList() {//获取分类数据
                let _this = this;
                _this.$get(categoryListIF).then(res => {
                    if(res.status === 0){
                        _this.categoryList = res.data;
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },
            getAdminCategoryList(url,parma) {//获取分类列表
                let _this = this;
                _this.$get(url,parma).then(res => {
                    if(res.status === 0){
                        _this.tableData = res.data;
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },
            fetchData(){
                let params = {};
                params=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in params){
                    params[key] = this.$Base64.decode(params[key]);
                }
                this.formInline.categoryName = params.categoryName||'';
                this.formInline.beginTime = params.beginTime||'';
                this.formInline.endTime = params.endTime||'';
                if(this.formInline.beginTime&&this.formInline.endTime){
                    this.setTime=[this.formInline.beginTime,this.formInline.endTime]
                }else {
                    this.setTime = [];
                }
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getCategoryList();
                this.getAdminCategoryList(adminCategoryListIF,params);
            }
        },
        watch:{
            '$route':'fetchData'
        },
        mounted(){
            this.fetchData();
        },

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
