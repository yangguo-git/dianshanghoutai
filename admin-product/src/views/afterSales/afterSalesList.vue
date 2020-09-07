
<template>
    <div class="wrapper">
        <div class="wrapper-list" v-show="!isDetails">
            <h5>售后列表</h5>
            <!--查询条件-->
            <div class="query-box">
                <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">
                    <el-form-item label="订单编号">
                        <el-input v-model.trim="formInline.orderCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="退款单号">
                        <el-input v-model.trim="formInline.refundId" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="退款状态">
                        <el-select v-model="formInline.refundStatus" placeholder="请选择" clearable >
                            <el-option v-for="item in refundStatusList" :key="item.id" :label="item.name" :value="item.value"></el-option>
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
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="orderCode"
                            label="订单编号"
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="refundId"
                            label="退款单号"
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="refundFee"
                            label="退款金额"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="买家手机号"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="refundStatusStr"
                            width="110"
                            label="退款状态">
                    </el-table-column>
                    <el-table-column
                            prop="applyTime"
                            label="申请时间"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="handleTime"
                            label="处理时间"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            width="150"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click="handleClick($event,scope.row)"
                                    type="text"
                                    size="small">查看</el-button>
                            <el-button v-if="scope.row.refundStatus===0"
                                       @click="handleClick($event,scope.row)"
                                       type="text"
                                       size="small">同意退款</el-button>
                            <el-button v-if="scope.row.refundStatus===0"
                                       @click="handleClick($event,scope.row)"
                                       type="text"
                                       size="small">拒绝</el-button>
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
        </div>
        <div class="wrapper-details"  v-show="isDetails">
            <h5>退款详情</h5>
            <div class="details-status">
                <div class="refund-box">

                    <div>
                        <div class="refund-box2">
                            <div>
                                <span>退款状态： </span>
                                <span>{{detailsData[0].refundStatusStr}}</span>
                            </div>
                            <div>
                                <span>申请时间： </span>
                                <span>{{detailsData[0].applyTime}}</span>
                            </div>
                        </div>
                    </div>

                </div>
                <el-button type="primary" size="mini" class="return-btn" @click="handleGoAfterSalesList">返回</el-button>
            </div>


            <div class="details-item">
                <span>退货商品</span>
                <el-table :data="detailsData[0].goodsVOList"
                          size="small"
                          :cell-style="listClass"
                          :summary-method="getSummaries"
                          max-height="600px"
                          show-summary
                          border
                          :header-cell-style="headleListClass">
                    <el-table-column
                            property="thumbnailImgUrl"
                            label="商品图片"
                            width="160">
                        <template slot-scope="scope">
                            <img :src="scope.row.thumbnailImgUrl" style="width: 40px;height: 40px;">
                        </template>
                    </el-table-column>
                    <el-table-column
                            property="productName"
                            label="商品名称">
                    </el-table-column>
                    <el-table-column
                            property="productAttr"
                            label="属性">
                    </el-table-column>
                    <el-table-column
                            property="price"
                            label="价格">
                    </el-table-column>
                    <el-table-column
                            property="count"
                            label="数量">
                    </el-table-column>
                    <el-table-column
                            property="subtotal"
                            label="小计">
                    </el-table-column>
                </el-table>
            </div>

            <div class="details-item">
                <span>运费信息</span>
                <el-table :data="detailsData"
                          size="small"
                          :cell-style="listClass"
                          border
                          :header-cell-style="headleListClass">
                    <el-table-column property="totalPrice" label="商品价格合计"></el-table-column>
                    <el-table-column property="mailCost" label="运费" ></el-table-column>
                    <el-table-column property="payPrice" label="订单实付金额"></el-table-column>
                </el-table>
            </div>

            <div class="details-item">
                <span>退货信息</span>
                <el-table :data="detailsData"
                          size="small"
                          :cell-style="listClass"
                          border
                          :header-cell-style="headleListClass">
                    <el-table-column property="refundId" label="退货单号"></el-table-column>
                    <el-table-column property="orderCode" label="订单编码"></el-table-column>
                    <el-table-column property="refundedFee" label="退款金额"></el-table-column>
                    <el-table-column property="reason" label="退款原因"></el-table-column>
                    <el-table-column property="voucher" label="凭证">
                        <template slot-scope="scope" v-if="!!scope.row.voucher">
                            <img @click="handleImgLook($event)" v-for="(item,i) in (scope.row.voucher.split(','))" :key="i" :src="item" style="width: 40px;height: 40px; margin: 10px;">
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </div>
</template>

<script>

    /*退款状态*/
    const refundStatusList = [
        {id:0,name:'退款待处理',value:'0'},
        {id:1,name:'退款处理中',value:'1'},
        {id:2,name:'退款已处理',value:'2'},
        {id:3,name:'退款成功',value:'3'},
        {id:4,name:'退款已拒绝',value:'4'},
    ];
    import { adminServiceListIF,adminServiceCodeIF, adminServiceRefundIF } from '../../api/afterSalesList';
    import { handleStatus } from '../../assets/js/public-method';
    export default {
        name: "afterSalesList",
        data() {
            return {
                formInline: {
                    orderCode: '',
                    refundId: '',
                    refundStatus: '',
                    pageNo: '',
                    pageSize: '',
                },
                refundStatusList: refundStatusList,
                tableData:{},
                isDetails:false,
                detailsData:[{
                    "goodsVOList": [
                        {
                            "count": 0,
                            "price": "string",
                            "productAttr": "string",
                            "productName": "string",
                            "subtotal": "5",
                            "thumbnailImgUrl": "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                        }
                    ],
                    "orderCode": "string",
                    "reason": "string",
                    "refundFee": "string",
                    "refundId": "string",
                    "remark": "string",
                    "voucher": "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
                    "refundStatus": 1,
                }],


            }
        },
        methods: {
            handleImgLook(e) {
                let imgsrc = e.target.src;
                this.$alert('<div style="max-height: 500px;overflow-y: auto;width: 380px"><img src="'+imgsrc+'" style="max-width: 350px"></div>', '', {
                    dangerouslyUseHTMLString: true,
                    center: true,
                    lockScroll: true,
                    showConfirmButton: false

                })
                    .then(() => {})
                    .catch(() => {});
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
                    orderCode:_this.formInline.orderCode,
                    refundId:_this.formInline.refundId,
                    refundStatus:_this.formInline.refundStatus,
                    pageNo:'1',
                    pageSize:'10',
                };
                for(let key in params){
                    if(params[key] === ''){
                        delete params[key];
                    }else {
                        params[key] = this.$Base64.encode(params[key]+'');
                    }
                }
                _this.$router.push({path:'/afterSalesList',query: params});
            },
            handleClick(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
                if(eventVal==='查看'){
                    let params = {
                        id:val.id,
                        orderCode:val.orderCode,
                        refundId:_this.formInline.refundId,
                        refundStatus:_this.formInline.refundStatus,
                        pageNo:_this.formInline.pageNo,
                        pageSize:_this.formInline.pageSize,
                        openDetails:'true',
                    };
                    for(let key in params){
                        if(params[key] === ''){
                            delete params[key];
                        }else {
                            params[key] = this.$Base64.encode(params[key]+'');
                        }
                    }
                    _this.$router.push({path:'/afterSalesList',query: params});
                }else if(eventVal==='同意退款'){
                    _this.$confirm('确定要同意退款吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={
                            orderReturnId:val.id,
                            refundResult:0
                        };
                        _this.$get(adminServiceRefundIF,params).then(res => {
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
                    }).catch(e=>e);
                }else if(eventVal==='拒绝'){
                    _this.$confirm('确定要拒绝吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={
                            orderReturnId:val.id,
                            refundResult:1
                        };
                        _this.$get(adminServiceRefundIF,params).then(res => {
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
                    }).catch(e=>e);
                }
            },

            //返回列表
            handleGoAfterSalesList(){
                this.isDetails=false;
                this.formInline.openDetails='';
                this.$router.go(-1);
            },

            //分页
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    orderCode:paramsPage.orderCode||'',
                    refundId:paramsPage.refundId||'',
                    refundStatus:paramsPage.refundStatus||'',
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
                this.$router.push({path:'/afterSalesList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    orderCode:paramsPage.orderCode||'',
                    refundId:paramsPage.refundId||'',
                    refundStatus:paramsPage.refundStatus||'',
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
                this.$router.push({path:'/afterSalesList',query: params});
            },
            //合计
            getSummaries(param) {
                const { columns, data } = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }
                    if (index === 1) {
                        sums[index] = '';
                        return;
                    }
                    if (index === 2) {
                        sums[index] = '';
                        return;
                    }
                    if (index === 3) {
                        sums[index] = '';
                        return;
                    }
                    if (index === 4) {
                        sums[index] = '';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' ';
                    } else {
                        sums[index] = 'N/A';
                    }
                });

                return sums;
            },
            //获取列表
            getAdminServiceList(url,parma) {//获取列表
                let _this = this;
                _this.$get(url,parma).then(res => {
                    if(res.status === 0){
                        _this.tableData = res.data;
                    }else {
                        handleStatus(_this,res.status,res.msg);

                    }
                });
            },
            //获取订单详情
            getAdminOrderCode(url,parma){ //获取订单详情
                let _this = this;
                _this.$get(url,{'orderReturnId':parma.id}).then(res => {
                    if(res.status === 0){
                        _this.detailsData=[];
                        _this.detailsData.push(res.data);
                        _this.isDetails=true
                    }else {
                        _this.$router.go(-1);
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
                this.formInline.orderCode = params.orderCode||'';
                this.formInline.refundId = params.refundId||'';
                this.formInline.refundStatus = params.refundStatus||'';
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.formInline.openDetails = params.openDetails||'';
                if(this.formInline.orderCode&&this.formInline.id&&this.formInline.openDetails){
                    this.getAdminOrderCode(adminServiceCodeIF,params)
                }else {
                    this.isDetails=false;
                    this.getAdminServiceList(adminServiceListIF,params);
                }

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
    /*详情*/
    .details-status,.details-item {
        margin: 20px 20px 0 25px;
        position: relative;
    }
    .return-btn {
        position: absolute;
        top: 0;
        right: 30px;
        padding: 7px 20px;
    }
    .details-status span {
        display: inline-block;
        font-size: 13px;
        color: #666;
    }
    .details-item {
        font-size: 14px;
        color: #000;
        margin-bottom: 20px;
    }
    .details-item>span {
        display: inline-block;
        margin-bottom: 10px;
    }
    .wrapper>>>.el-table__footer-wrapper tbody td .cell {
        text-align: center;
    }
    /*退款申请是否同意样式*/
    .refund-box {
        width: 320px;
        margin: 20px 0;
    }
    .refund-box1>>>.el-button {
        padding: 10px 20px;
        margin-right: 30px;
    }
    .refund-box2 span {
        display: inline-block;
        font-size: 14px;
        color: #222;
    }

</style>