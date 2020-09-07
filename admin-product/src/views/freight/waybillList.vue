<template>
    <div class="wrapper">
        <div class="wrapper-list" v-show="!isDetails">
            <h5>运单列表</h5>
            <!--查询条件-->
            <div class="query-box">
                <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">
                    <el-form-item label="运单编号">
                        <el-input v-model.trim="formInline.deliverId" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="运单名称">
                        <el-select v-model="formInline.deliverySn" placeholder="请选择" clearable >
                            <el-option v-for="item in deliveryNameList" :key="item.id" :label="item.name" :value="item.type"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单编号">
                        <el-input v-model.trim="formInline.orderCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="买家手机号">
                        <el-input v-model.trim="formInline.phone" clearable></el-input>
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
                            prop="deliverId"
                            label="运单编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="deliveryName"
                            label="运单名称"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="orderCode"
                            label="订单编号"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="买家手机号"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="deliverTime"
                            label="运单时间"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            min-width="120">
                        <template slot-scope="scope">
                            <el-button
                                    v-if="scope.row.orderStatus==='301'"
                                    @click="handleClick($event,scope.row)"
                                    type="text"
                                    size="small">编辑</el-button>
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
        <!--编辑-->
        <el-dialog
                title="编辑"
                :visible.sync="isSpringBox"
                :close-on-click-modal='false'
                width="500px">
            <el-form label-position="right"  :model="freightData" class="categoryData-form" size="small" label-width="100px">
                <el-form-item label="序号">
                    <el-input class="inpBox"  v-model="freightData.id" disabled readonly></el-input>
                </el-form-item>
                <el-form-item label="运单编号">
                    <el-input class="inpBox"  v-model.trim="freightData.deliverId"></el-input>
                </el-form-item>
                <el-form-item label="运单名称">
                    <el-select v-model="freightData.deliverySn" placeholder="请选择" clearable style="width: 300px;">
                        <el-option v-for="item in deliveryNameList" :key="item.id" :label="item.name" :value="item.type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单编码">
                    <el-input class="inpBox"  v-model="freightData.orderCode" disabled readonly></el-input>
                </el-form-item>
                <el-form-item label="买家手机号">
                    <el-input class="inpBox"  v-model="freightData.phone" disabled readonly></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isSpringBox = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSave" size="small">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>

    import { adminDeliveryListIF,adminLogisticsIF, adminOrderCodeIF,adminDeliveryUpdateIF } from '../../api/waybillList';
    import orderDetails from '../order/orderDetails'
    import { handleStatus, errorMess} from '../../assets/js/public-method';
    export default {
        name: "waybillList",
        data() {
            return {
                formInline: {
                    deliverId: '',
                    deliverySn: '',
                    orderCode: '',
                    phone: '',
                    pageNo: '',
                    pageSize: '',
                },
                deliveryNameList: [],
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
                freightData:{},
                isSpringBox:false,
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
                    deliverId:_this.formInline.deliverId,
                    deliverySn:_this.formInline.deliverySn,
                    orderCode:_this.formInline.orderCode,
                    phone:_this.formInline.phone,
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
                _this.$router.push({path:'/waybillList',query: params});
            },
            handleClick(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
                if(eventVal==='查看详情'){
                   let params = {
                       orderCode:val.orderCode,
                       deliverId:_this.formInline.deliverId,
                       deliverySn:_this.formInline.deliverySn,
                       phone:_this.formInline.phone,
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
                    this.$router.push({path:'/waybillList',query: params});
                }else if(eventVal==='编辑'){
                    _this.freightData.id = val.id;
                    _this.$set(_this.freightData,'deliverId',val.deliverId || '');
                    _this.$set(_this.freightData,'deliverySn',val.deliverySn || '');
                    _this.freightData.orderCode = val.orderCode;
                    _this.freightData.phone = val.phone || '';
                    _this.isSpringBox = true;
               }
            },
            handleSave() {
                let _this = this;
                let params = {
                    id:_this.freightData.id,
                    deliverId:_this.freightData.deliverId,
                    deliverySn:_this.freightData.deliverySn,
                    orderCode:_this.freightData.orderCode,
                };
                if(!params.deliverId){
                    errorMess(_this, 'error', '请填写运单编号');
                    return false;
                }else if(!params.deliverySn) {
                    errorMess(_this, 'error', '请选择运单名称');
                    return false;
                }
                _this.$post(adminDeliveryUpdateIF,params).then(res => {
                    if(res.status === 0){
                        _this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        _this.isSpringBox=false;
                        _this.fetchData();
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
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
                    deliverId:paramsPage.deliverId||'',
                    deliverySn:paramsPage.deliverySn||'',
                    orderCode:paramsPage.orderCode||'',
                    phone:paramsPage.phone||'',
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
                this.$router.push({path:'/waybillList',query: params});
            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    deliverId:paramsPage.deliverId||'',
                    deliverySn:paramsPage.deliverySn||'',
                    orderCode:paramsPage.orderCode||'',
                    phone:paramsPage.phone||'',
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
                this.$router.push({path:'/waybillList',query: params});

            },


            //获取物流名称列表
            getAdminLogisticsList() {//获取物流名称列表
                let _this = this;
                _this.$get(adminLogisticsIF).then(res => {
                    if(res.status === 0){
                        _this.deliveryNameList = res.data;
                    }else {
                        handleStatus(_this,res.status,res.msg);

                    }
                });
            },

            //获取列表
            getAdminDeliveryList(url,parma) {//获取列表
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
                this.formInline.deliverId = params.deliverId||'';
                this.formInline.deliverySn = params.deliverySn||'';
                this.formInline.orderCode = params.orderCode||'';
                this.formInline.phone = params.phone||'';
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.formInline.openDetails = params.openDetails||'';

                if(this.formInline.orderCode&&this.formInline.openDetails){
                    this.getAdminLogisticsList();
                    this.getAdminOrderCode(adminOrderCodeIF,params)
                }else {
                    this.isDetails=false;
                    this.getAdminLogisticsList();
                    this.getAdminDeliveryList(adminDeliveryListIF,params);
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
    .inpBox {
        display: inline-block;
        width: 300px;
    }
    .dialog-footer {
        text-align: center;
        padding-bottom: 10px;
        position: relative;
        top: -10px;
    }
    .dialog-footer button {
        margin: 0 25px;
    }

</style>