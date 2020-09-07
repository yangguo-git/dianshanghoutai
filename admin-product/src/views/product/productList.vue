<template>
    <div class="wrapper">
        <h5>商品列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
                <el-form-item label="商品一级分类">
                    <el-select v-model="formInline.firstClassification" placeholder="请选择" clearable  @change="handleCategoryList1">
                        <el-option v-for="item in categoryList1"
                                   :key="item.id"
                                   :label="item.categoryName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品二级分类">
                    <el-select v-model="formInline.secondaryClassification" placeholder="请选择" clearable >
                        <el-option v-for="item in categoryList2"
                                   :key="item.id"
                                   :label="item.categoryName"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
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
                <el-form-item label="商品售价">
                    <el-input v-model.trim="formInline.minSalePrice"
                              style="display: inline-block;width: 100px"
                              @keyup.native="number('minSalePrice')"
                              clearable></el-input>
                    -
                    <el-input v-model.trim="formInline.maxSalePrice"
                              style="display: inline-block;width: 100px"
                              @keyup.native="number('maxSalePrice')"
                              clearable></el-input>
                </el-form-item>
                <el-form-item label="推荐商品">
                    <el-select v-model="formInline.isRecommend" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="item in isRecommendList"
                                   :key="item.value"
                                   :label="item.name"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="限购商品">
                    <el-select v-model="formInline.isLimit" placeholder="请选择" clearable style="width: 150px;">
                        <el-option v-for="item in isLimitList"
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
                    style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column
                        prop="id"
                        width="180"
                        label="序号">
                </el-table-column>
                <el-table-column
                        prop="firstCategoryName"
                        label="一级分类"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="secondCategoryName"
                        label="二级分类"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="productName"
                        min-width="200"
                        label="商品名称">
                </el-table-column>
                <el-table-column
                        prop="salePrice"
                        label="商品售价"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="salePrice"
                        label="推荐商品"
                        width="80">
                    <template slot-scope="scope">
                        {{ scope.row.isRecommend | isRecommendName }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="isLimit"
                        label="限购商品"
                        width="80">
                    <template slot-scope="scope">
                        {{ scope.row.isLimit | isLimitName }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="salePrice"
                        label="限购数量"
                        min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.isLimit?scope.row.productLimit:''}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="salePrice"
                        label="销量"
                        min-width="100">
                    <template slot-scope="scope">
                        <span style="color: #409EFF;cursor: pointer" @click="handlevirtualSales(scope.row)">
                            {{!scope.row.virtualSales?0:scope.row.virtualSales}}
                        </span>
                    </template>
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
                        prop="createTime"
                        label="创建时间"
                        width="150">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="140"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status===2" @click="handleClick($event,scope.row)" type="text" size="small">查看</el-button>
                        <el-button
                                v-if="scope.row.status===1"
                                @click="handleClick($event,scope.row)"
                                type="text"
                                size="small">编辑</el-button>
                        <el-button v-if="scope.row.status===4||scope.row.status===0||scope.row.status===1"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">删除</el-button>
                        <el-button v-if="scope.row.status===1"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">上架</el-button>
                        <el-button v-if="scope.row.status===2"
                                   @click="handleClick($event,scope.row)"
                                   type="text"
                                   size="small">下架</el-button>
                        <!--<el-button @click="handleClick($event,scope.row)" type="text" size="small">查看日志</el-button>-->
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
        <!--查看日志-->
        <!--<el-dialog title="查看日志" :visible.sync="dialogTableVisible" :close-on-click-modal='false' width="760px">
            <el-table :data="journalData"
                      size="small"
                      :cell-style="listClass"
                      :header-cell-style="headleListClass"
                      border>
                <el-table-column property="date" label="日期" width="150"></el-table-column>
                <el-table-column property="name" label="姓名" width="200"></el-table-column>
                <el-table-column property="address" label="地址"></el-table-column>
            </el-table>
            &lt;!&ndash;分页&ndash;&gt;
            <el-pagination
                    style="margin: 20px 0 0;"
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40, 50]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="120">
            </el-pagination>

        </el-dialog>
-->
        <!--编辑销量弹框-->
        <el-dialog title="编辑销量" :visible.sync="dialogFormVisible" width="300px">
            <el-form :model="virtualSalesObj">
                <el-form-item label="销量" label-width="80">
                    <el-input-number
                            :controls="false"
                            :min="0"
                            :max="9999"
                            :step="1"
                            placeholder="范围为0-9999的整数"
                            step-strictly
                            v-model="virtualSalesObj.virtualSales"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handlevirtualSalesSave" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let isRecommendList=[
        {name:'是',value:'true'},
        {name:'否',value:'false'}
    ];
     let isLimitList=[
        {name:'是',value:'true'},
        {name:'否',value:'false'}
    ];
    let statusList=[
        {name:'待发布',value:'0'},
        {name:'待上架',value:'1'},
        {name:'已上架',value:'2'},
        {name:'已过期',value:'4'}
    ];
    import { adminProductListIF, adminUpdateStatusIF, categoryListIF,addSalesIF} from '../../api/productList';
    import { handleStatus } from '../../assets/js/public-method';
    export default {
        name: "productList",
        data() {
            return {
                formInline: {
                    productId:'',
                    firstClassification: '',
                    secondaryClassification: '',
                    productName: '',
                    status: '',
                    minSalePrice: '',
                    maxSalePrice: '',
                    isRecommend: '',
                    isLimit: '',
                },
                isRecommendList:isRecommendList,
                isLimitList:isLimitList,
                statusList:statusList,
                categoryList:[],
                categoryList1:[],
                categoryList2:[],
                tableData:{},
                multipleSelection: [],
                dialogTableVisible:false,
                dialogFormVisible:false,
                virtualSalesObj:{
                    virtualSales:undefined,
                    id:''
                }
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
                        name='待上架';
                        break;
                    case 2:
                        name='已上架';
                        break;
                    case 4:
                        name='已过期';
                        break;
                    case 9:
                        name='已删除';
                        break;
                    default:
                        name='';
                }
                return name;
            },
            isRecommendName(val){//转成名字
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
            isLimitName(val){//转成名字
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


            format: function(val) {
                const date = new Date(val)
                return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`
            },
        },
        methods: {
            handleSelectionChange(val) {//列表多选
                this.multipleSelection = val;
            },
            headleListClass() {//表头样式
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {//列表内容居中
                return 'text-align: center'
            },
            handleClickGuery(){ //列表查询按钮
                let _this = this;
                let params = {
                    productId:_this.formInline.productId,
                    categoryId:_this.formInline.secondaryClassification||_this.formInline.firstClassification||'',
                    firstClassification:_this.formInline.firstClassification,
                    secondaryClassification:_this.formInline.secondaryClassification,
                    productName:_this.formInline.productName,
                    status:_this.formInline.status,
                    minSalePrice:_this.formInline.minSalePrice,
                    maxSalePrice:_this.formInline.maxSalePrice,
                    isRecommend:_this.formInline.isRecommend,
                    isLimit:_this.formInline.isLimit,
                    pageNo:'1',
                    pageSize:'10',
                };
                let error=false;
                if(params.minSalePrice
                    &&params.maxSalePrice
                    &&(params.minSalePrice-0)
                    >(params.maxSalePrice-0)){
                    this.$message({
                        type: "error",
                        message: '请正确填写商品售价'
                    });
                    error=true;
                }
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = _this.$Base64.encode(params[key]+'');
                    }
                }

                if(!error){
                    _this.$router.push({path:'/productList',query: params});

                }
            },
            handleClickNewlyBuild(){ //列表新建
                this.$router.push({path:'/productRelease'});
            },
            //销量事件
            handlevirtualSales(rows) {
                this.virtualSalesObj = Object.assign({}, this.virtualSalesObj, { virtualSales: rows.virtualSales, id: rows.id })
                this.dialogFormVisible=true;
            },
            //销量保存
            handlevirtualSalesSave() {
                let _this = this;
                let params={ id:_this.virtualSalesObj.id, virtualSales:_this.virtualSalesObj.virtualSales};
                if(params.virtualSales===undefined) {
                    _this.$message.error('请填写销售数量!');
                    return false;
                }
                _this.$post(addSalesIF,params).then(res => {
                    if(res.status === 0){
                        _this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        _this.fetchData();
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
                _this.dialogFormVisible=false;
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
                    _this.$router.push({path:'/productRelease',query: { productId: val.id,modify:'2'}});
                }else if(eventVal==='编辑'){
                    _this.$router.push({path:'/productRelease',query: { productId: val.id,modify:'1'}});
                }else if(eventVal==='删除'){
                    _this.$confirm('确定要删除此商品吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:9 };
                        _this.$post(adminUpdateStatusIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });

                                let obj = {
                                    productId:paramsPage.productId||'',
                                    categoryId:paramsPage.secondaryClassification||paramsPage.firstClassification||'',
                                    firstClassification:paramsPage.firstClassification||'',
                                    secondaryClassification:paramsPage.secondaryClassification||'',
                                    productName:paramsPage.productName||'',
                                    status:paramsPage.status||'',
                                    minSalePrice:paramsPage.minSalePrice||'',
                                    maxSalePrice:paramsPage.maxSalePrice||'',
                                    isRecommend:paramsPage.isRecommend||'',
                                    isLimit:paramsPage.isLimit||'',
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
                                    _this.$router.push({path:'/productList',query: obj});
                                }
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }else if(eventVal==='上架'){
                    _this.$confirm('确定要上架此商品吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:2 };
                        _this.$post(adminUpdateStatusIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '上架成功!'
                                });
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }else if(eventVal==='下架'){
                    _this.$confirm('确定要下架此商品吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:1 };
                        _this.$post(adminUpdateStatusIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '下架成功!'
                                });
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }else if(eventVal==='查看日志'){
                    _this.dialogTableVisible = true;
                }
            },
            number(val) {//处理数据
                this.formInline[val] = this.formInline[val].replace(/[^\.\d]/g, '');
                this.formInline[val] = this.formInline[val].replace('.', '');
                if (this.formInline[val] === '') {
                    this.formInline[val] = '';
                } else {
                    this.formInline[val] = Number(this.formInline[val])+'';
                }
            },

            handleSizeChange(val) {//每页几条
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    productId:paramsPage.productId||'',
                    categoryId:paramsPage.secondaryClassification||paramsPage.firstClassification||'',
                    firstClassification:paramsPage.firstClassification||'',
                    secondaryClassification:paramsPage.secondaryClassification||'',
                    productName:paramsPage.productName||'',
                    status:paramsPage.status||'',
                    minSalePrice:paramsPage.minSalePrice||'',
                    maxSalePrice:paramsPage.maxSalePrice||'',
                    isRecommend:paramsPage.isRecommend||'',
                    isLimit:paramsPage.isLimit||'',
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

                this.$router.push({path:'/productList',query: params});
            },
            handleCurrentChange(val) {//当前第几页
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    productId:paramsPage.productId||'',
                    categoryId:paramsPage.secondaryClassification||paramsPage.firstClassification||'',
                    firstClassification:paramsPage.firstClassification||'',
                    secondaryClassification:paramsPage.secondaryClassification||'',
                    productName:paramsPage.productName||'',
                    status:paramsPage.status||'',
                    minSalePrice:paramsPage.minSalePrice||'',
                    maxSalePrice:paramsPage.maxSalePrice||'',
                    isRecommend:paramsPage.isRecommend||'',
                    isLimit:paramsPage.isLimit||'',
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

                this.$router.push({path:'/productList',query: params});
            },
            handleCategoryList1(val) {//选中一级分类渲染二级分类的数据
                this.formInline.secondaryClassification='';
                this.categoryList2=[];
                if(val){
                    this.categoryList2 = this.categoryList.filter(function (item) {
                        return item.parentId===val;
                    });
                }

            },
            getCategoryList() {//获取分类数据
                let _this = this;
                _this.$get(categoryListIF).then(res => {
                    if(res.status === 0){
                        _this.categoryList = res.data;
                        _this.categoryList1 = _this.categoryList.filter(function (item) {
                            return item.parentId==='';
                        });
                        if(_this.formInline.firstClassification){
                            _this.categoryList2=[];
                            _this.categoryList2 = _this.categoryList.filter(function (item) {
                                return item.parentId===_this.formInline.firstClassification;
                            });
                        }
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },
            getProductList(url,parma) {//获取商品列表
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
                this.formInline.productId = params.productId||'';
                this.formInline.categoryId = this.formInline.secondaryClassification||this.formInline.firstClassification||'';
                this.formInline.firstClassification = params.firstClassification||'';
                this.formInline.secondaryClassification = params.secondaryClassification||'';
                this.formInline.productName = params.productName||'';
                this.formInline.status = params.status||'';
                this.formInline.minSalePrice = params.minSalePrice||'';
                this.formInline.maxSalePrice = params.maxSalePrice||'';
                this.formInline.isRecommend = params.isRecommend||'';
                this.formInline.isLimit = params.isLimit||'';
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getCategoryList();
                this.getProductList(adminProductListIF,params);
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