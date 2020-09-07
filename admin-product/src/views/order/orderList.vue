<template>
    <div class="wrapper">
        <div class="wrapper-list" v-show="!isDetails">
            <h5>订单列表</h5>
            <!--查询条件-->
            <div class="query-box">
                <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">
                    <el-form-item label="订单编号">
                        <el-input v-model.trim="formInline.orderCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="订单类型">
                        <el-select v-model="formInline.orderType" placeholder="请选择" clearable >
                            <el-option v-for="item in orderTypeList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单状态">
                        <el-select v-model="formInline.orderStatus" placeholder="请选择" clearable >
                            <el-option v-for="item in orderStatusList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付方式">
                        <el-select v-model="formInline.payType" placeholder="请选择" clearable >
                            <el-option v-for="item in payTypeList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="买家手机号">
                        <el-input v-model.trim="formInline.phone" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model.trim="formInline.productName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="下单时间">
                        <el-date-picker
                                v-model="setTime"
                                :default-time="['00:00:00', '23:59:59']"
                                type="datetimerange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item style="position: absolute;right: 10px">
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
                            prop="orderCode"
                            label="订单编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="orderTypeStr"
                            label="订单类型"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="productName"
                            label="商品名称"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="买家手机号"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="payPrice"
                            label="订单实付金额"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="payTypeStr"
                            label="支付方式"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="orderStatusStr"
                            label="订单状态"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="orderTime"
                            label="下单时间"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click="handleClick($event,scope.row)"
                                    type="text"
                                    size="small">查看详情</el-button>
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
            <order-details :detailsData="detailsData" @go-order-value="handleGoOrderList"></order-details>
        </div>
    </div>
</template>
<script>

    /*订单类型*/
    const orderTypeList = [
        {id:1,name:'小程序订单',value:'1'},
        {id:2,name:'H5订单',value:'2'},
    ];
    /*订单状态*/
    const orderStatusList = [
        {id:1,name:'待付款',value:'101'},
        /*{id:2,name:'付款成功',value:'201'},
        {id:3,name:'付款失败',value:'202'},*/
        {id:4,name:'已取消',value:'102'},
        {id:5,name:'待发货',value:'301'},
        {id:6,name:'已发货',value:'302'},
        /*{id:7,name:'待签收',value:'303'},*/
        {id:8,name:'已签收',value:'304'},
        {id:9,name:'申请退款中',value:'401'},
        {id:10,name:'已退款',value:'402'},
    ];
    /*支付方式*/
    const payTypeList = [
        {id:1,name:'微信支付',value:'1'},
        {id:2,name:'支付宝支付',value:'2'},
        {id:3,name:'现金支付',value:'3'},
    ];
    import { adminOrderListIF, adminOrderCodeIF } from '../../api/orderList';
    import orderDetails from './orderDetails'
    import { handleStatus} from '../../assets/js/public-method';
    export default {
        name: "orderList",
        data() {
            return {
                formInline: {
                    orderCode: '',
                    orderType: '',
                    orderStatus: '',
                    payType: '',
                    phone: '',
                    productName: '',
                    orderStartTime: '',
                    orderEndTime: '',
                    pageNo: '',
                    pageSize: '',
                    openDetails:''//openDetails和orderCode同时有值调订单详情数据
                },
                orderTypeList: orderTypeList,
                orderStatusList: orderStatusList,
                payTypeList: payTypeList,
                setTime: [],
                tableData: {},
                isDetails:false,
                detailsData:[{
                    "address": "string",
                    "deliverId": "string",
                    "deliveryName": "string",
                    "discountPrice": "string",
                    "goodsVOList": [
                        {
                            "count": 0,
                            "price": "20",
                            "productAttr": "string",
                            "productName": "string",
                            "subtotal": "20",
                            "thumbnailImgUrl": "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                        },
                        {
                            "count": 0,
                            "price": "23.33",
                            "productAttr": "string",
                            "productName": "string",
                            "subtotal": "23.33",
                            "thumbnailImgUrl": "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                        },
                    ],
                    "id": "string",
                    "mailCost": "string",
                    "mailMobile": "string",
                    "mailName": "string",
                    "orderCode": "string",
                    "orderStatus": "string",
                    "orderTime": "string",
                    "orderType": 0,
                    "payPrice": "string",
                    "payType": 0,
                    "phone": "string",
                    "postCode": "string",
                    "totalPrice": "string"
                }],
                goodsVOList:[],
            }
        },
        components: {
            'order-details':orderDetails
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
                    orderCode:_this.formInline.orderCode,
                    orderType:_this.formInline.orderType,
                    orderStatus:_this.formInline.orderStatus,
                    payType:_this.formInline.payType,
                    phone:_this.formInline.phone,
                    productName:_this.formInline.productName,
                    orderStartTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[0]||'',
                    orderEndTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[1]||'',
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
                _this.$router.push({path:'/orderList',query: params});
            },
            handleClick(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
                if(eventVal==='查看详情'){
                    let params = {
                        orderCode:val.orderCode,
                        orderType:_this.formInline.orderType,
                        orderStatus:_this.formInline.orderStatus,
                        payType:_this.formInline.payType,
                        phone:_this.formInline.phone,
                        productName:_this.formInline.productName,
                        orderStartTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[0]||'',
                        orderEndTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[1]||'',
                        pageNo:_this.formInline.pageNo,
                        pageSize:_this.formInline.pageSize,
                        openDetails:'true',
                    };
                    for(let key in params){
                        if(params[key] === ''){
                            delete params[key];
                        }else {
                            params[key] = _this.$Base64.encode(params[key]+'');
                        }
                    }

                    _this.$router.push({path:'/orderList',query: params});
                }

            },

            //返回列表
            handleGoOrderList(data){
                this.isDetails=data.isDetails;
                this.formInline.openDetails=data.openDetails;
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
                    orderType:paramsPage.orderType||'',
                    orderStatus:paramsPage.orderStatus||'',
                    payType:paramsPage.payType||'',
                    phone:paramsPage.phone||'',
                    productName:paramsPage.productName||'',
                    orderStartTime:paramsPage.orderStartTime||'',
                    orderEndTime:paramsPage.orderEndTime||'',
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

                this.$router.push({path:'/orderList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    orderCode:paramsPage.orderCode||'',
                    orderType:paramsPage.orderType||'',
                    orderStatus:paramsPage.orderStatus||'',
                    payType:paramsPage.payType||'',
                    phone:paramsPage.phone||'',
                    productName:paramsPage.productName||'',
                    orderStartTime:paramsPage.orderStartTime||'',
                    orderEndTime:paramsPage.orderEndTime||'',
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

                this.$router.push({path:'/orderList',query: params});

            },
            //获取列表
            getAdminOrderList(url,parma) {//获取列表
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
                _this.$get(url,{'orderCode':parma.orderCode}).then(res => {
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
                this.formInline.orderCode = params.orderCode||'';
                this.formInline.orderType = params.orderType||'';
                this.formInline.orderStatus = params.orderStatus||'';
                this.formInline.payType = params.payType||'';
                this.formInline.phone = params.phone||'';
                this.formInline.productName = params.productName||'';
                this.formInline.orderStartTime = params.orderStartTime||'';
                this.formInline.orderEndTime = params.orderEndTime||'';
                if(this.formInline.orderStartTime&&this.formInline.orderEndTime){
                    this.setTime=[this.formInline.orderStartTime,this.formInline.orderEndTime]
                }else {
                    this.setTime = [];
                }
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.formInline.openDetails = params.openDetails||'';
                if(this.formInline.orderCode&&this.formInline.openDetails){
                    this.getAdminOrderCode(adminOrderCodeIF,params)
                }else {
                    this.isDetails=false;
                    this.getAdminOrderList(adminOrderListIF,params);
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

</style>