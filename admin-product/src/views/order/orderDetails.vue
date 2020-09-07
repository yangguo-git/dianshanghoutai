<template>
    <div class="wrapper">
        <h5>订单详情</h5>
        <div class="details-status">
            <span>订单状态:</span>
            <span>{{detailsData[0].orderStatusStr}}</span>
            <el-button type="primary" size="mini" class="return-btn" @click="handleGoOrderList">返回</el-button>
        </div>
        <div class="details-item">
            <span>基本信息</span>
            <el-table :data="detailsData"
                      size="small"
                      :cell-style="listClass"
                      border
                      :header-cell-style="headleListClass">
                <el-table-column property="orderCode" label="订单编号"></el-table-column>
                <el-table-column property="orderTypeStr" label="订单类型" ></el-table-column>
                <el-table-column property="phone" label="买家手机号" ></el-table-column>
                <el-table-column property="payTypeStr" label="支付方式"></el-table-column>
                <el-table-column property="orderTime" label="下单时间"></el-table-column>
            </el-table>

        </div>
        <div class="details-item">
            <span>收货人信息</span>
            <el-table :data="detailsData"
                      size="small"
                      :cell-style="listClass"
                      border
                      :header-cell-style="headleListClass">
                <el-table-column property="mailName" label="收货人" ></el-table-column>
                <el-table-column property="mailMobile" label="手机号"></el-table-column>
                <el-table-column property="address" label="收货地址"></el-table-column>
            </el-table>
        </div>
        <div class="details-item">
            <span>商品信息</span>
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
        <br>
        <div class="details-item">
            <span>物流信息</span>
            <el-table :data="detailsData"
                      size="small"
                      :cell-style="listClass"
                      border
                      :header-cell-style="headleListClass">
                <el-table-column property="deliveryName" label="配送方式">
                    <template slot-scope="scope">
                        {{ scope.row.deliveryName||'无'}}
                    </template>
                </el-table-column>
                <el-table-column property="deliverId" label="物流单号">
                    <template slot-scope="scope">
                        {{ scope.row.deliverId||'无'}}
                    </template>
                </el-table-column>
                <el-table-column property="logisticsStatusStr" label="物流状态">
                </el-table-column>
            </el-table>
        </div>
    </div>
    
</template>

<script>

    export default {
        name: "orderDetails",
        props: {
            detailsData:{}
        },
        data() {
            return {}
        },
        methods: {
            //返回列表
            handleGoOrderList(){
                this.$emit('go-order-value', {
                    isDetails:false,
                    openDetails:'',
                });
            },
            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
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
        }

    }
</script>

<style scoped>
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
        font-size: 14px;
        color: #000;
        margin-right: 15px;
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
</style>