<template>
    <div class="wrapper">
        <h5>库存列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">

                <el-form-item label="规格ID">
                    <el-input v-model.trim="formInline.id" clearable @keyup.native="number1('id')"></el-input>
                </el-form-item>
                <el-form-item label="规格名称">
                    <el-input v-model.trim="formInline.normName" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品ID">
                    <el-input v-model.trim="formInline.productId" clearable @keyup.native="number1('productId')"></el-input>
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
                        label="规格ID">
                </el-table-column>
                <el-table-column
                        prop="productId"
                        width="180"
                        label="商品ID">
                </el-table-column>
                <el-table-column
                        prop="normName"
                        label="规格名称">
                </el-table-column>
                <el-table-column
                        prop="stockQty"
                        label="库存余量"
                        width="140">
                </el-table-column>
                <el-table-column
                        prop="salesQty"
                        label="库存消耗量"
                        width="140">
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
                        width="100"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick($event,scope.row)" type="text" size="small">编辑</el-button>
                        <!--<el-button @click="handleClick($event,scope.row)" type="text" size="small">查看日志</el-button>-->
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
                        :current-page="tableData.pageNo"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="tableData.pageSize||10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableData.total">
                </el-pagination>
            </div>
        </div>
        <!--编辑-->
        <el-dialog
                :title="title"
                :visible.sync="dialogTableVisible"
                :close-on-click-modal='false'
                width="400px">
            <el-row type="flex" justify="start" align="middle" style="margin-bottom: 20px;">
                <el-col :span="5">
                    <el-radio v-model="isStockNum"
                              @change="handleIsStock('入库')"
                              :label='false'>入库</el-radio>
                </el-col>
                <el-col :span="18">
                    <el-input-number v-model.trim="stockData.stockNum1"
                              size="small"
                              style="width: auto"
                              :controls="false"
                              :disabled="isStockNum===true?true:false"></el-input-number>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" align="middle"  style="margin-bottom: 20px;">
                <el-col  :span="5">
                    <el-radio v-model="isStockNum"
                              @change="handleIsStock('出库')"
                              :label='true'>出库</el-radio>
                </el-col>
                <el-col  :span="18">
                    <el-input-number
                              v-model.trim="stockData.stockNum2"
                              size="small"
                              style="width: auto"
                              :controls="false"
                              :disabled="isStockNum===false?true:false"></el-input-number>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSave" size="small">保 存</el-button>
            </div>

        </el-dialog>
       <!-- 查看列表
        <el-dialog title="查看日志" :visible.sync="dialogTableVisibleList" :close-on-click-modal='false' width="760px">
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
        </el-dialog>-->


    </div>
</template>

<script>
    import { adminNormListIF, adminUpdateStockIF } from '../../api/stockList';
    import { handleStatus } from '../../assets/js/public-method';
    export default {
        name: "stockList",
        data() {
            return {
                formInline: {
                    id: '',
                    normName: '',
                    productId: '',
                    beginTime: '',
                    endTime: '',
                    pageNo: '',
                    pageSize: '',
                },
                stockData:{
                    normId:'',
                    stockNum1:undefined,
                    stockNum2:undefined,
                },
                setTime: [],
                isStockNum:false,
                tableData:{},//列表对象下 有分页和list
                currentPage:2,
                dialogTableVisible:false,
                dialogTableVisibleList:false,
                title:'新建',
                journalData:[]
            }
        },
        filters:{
            format: function(val) { //时间戳转换日期时间格式
                const date = new Date(val);
                return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`
            },
        },
        methods: {
            number(val) {//只能输入数字
                this.stockData[val] = this.stockData[val].replace(/[^\.\d]/g, '');
                this.stockData[val] = this.stockData[val].replace('.', '');
                if (this.stockData[val] === '') {
                    this.stockData[val] = '';
                } else {
                    this.stockData[val] = Number(this.stockData[val])+'';
                }
            },
            number1(val) {//只能输入数字
                this.formInline[val] = this.formInline[val].replace(/[^\.\d]/g, '');
                this.formInline[val] = this.formInline[val].replace('.', '');
            },
            handleIsStock(val) {
                if (val === '入库') {
                    this.stockData.stockNum2 = undefined;
                }else {
                    this.stockData.stockNum1 = undefined;
                }
            },
            handleSave() {

                let _this = this;
                let stockNum1 = _this.stockData.stockNum1;
                let stockNum2 = _this.stockData.stockNum2;
                let params = {
                    normId:_this.stockData.normId,
                };
                let error = false;
                if(_this.isStockNum===false){
                    if(stockNum1===undefined){
                        _this.$message({
                            type: "error",
                            message: '请输入数量！'
                        });
                        error = true;
                    }else {
                        params.stockNum = stockNum1;
                    }

                }
                if(_this.isStockNum===true){
                    if(stockNum2===undefined){
                        _this.$message({
                            type: "error",
                            message: '请输入数量！'
                        });
                        error = true;
                    }else {
                        params.stockNum = 0-stockNum2;
                    }
                }
                if(error){
                    return false;
                }else {
                    this.$post(adminUpdateStockIF, params).then(res => {
                        if (res.status===0) {
                            _this.dialogTableVisible=false;
                            _this.fetchData();
                        } else {
                            handleStatus(_this,res.status,res.msg);
                        }
                    });
                }

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
                    id:_this.formInline.id,
                    beginTime:_this.setTime&&_this.setTime.length>0&&_this.setTime[0]||'',
                    endTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[1]||'',
                    normName:_this.formInline.normName||'',
                    productId:_this.formInline.productId||'',
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

                _this.$router.push({path:'/stockList',query: params});
            },
            handleClick(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
                if(eventVal==='编辑'){
                    _this.title = eventVal;
                    _this.stockData.normId = val.id;
                    _this.stockData.stockNum1 = undefined;
                    _this.stockData.stockNum2 = undefined;
                    _this.isStockNum = false;
                    _this.dialogTableVisible = true;
                }

            },
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    id:paramsPage.id||'',
                    beginTime:paramsPage.beginTime||'',
                    endTime:paramsPage.endTime||'',
                    normName:paramsPage.normName||'',
                    productId:paramsPage.productId||'',
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

                this.$router.push({path:'/stockList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    id:paramsPage.id||'',
                    beginTime:paramsPage.beginTime||'',
                    endTime:paramsPage.endTime||'',
                    normName:paramsPage.normName||'',
                    productId:paramsPage.productId||'',
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

                this.$router.push({path:'/stockList',query: params});


            },
            getAdminStockList(url,parma) {//获取列表
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
                this.formInline.id = params.id||'';
                this.formInline.normName = params.normName||'';
                this.formInline.productId = params.productId||'';
                this.formInline.beginTime = params.beginTime||'';
                this.formInline.endTime = params.endTime||'';
                if(this.formInline.beginTime&&this.formInline.endTime){
                    this.setTime=[this.formInline.beginTime,this.formInline.endTime]
                }else {
                    this.setTime = [];
                }
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getAdminStockList(adminNormListIF,params);
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
    .stockData-form {
        width: 280px;
        margin-left: 20px;
    }

</style>