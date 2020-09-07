<template>
    <div class="wrapper">
        <div class="wrapper-list">
            <h5>评价列表</h5>
            <!--查询条件-->
            <div class="query-box">
                <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">
                    <el-form-item label="商品ID">
                        <el-input v-model.trim="formInline.productId" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input v-model.trim="formInline.productName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="订单编码">
                        <el-input v-model.trim="formInline.orderCode" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称">
                        <el-input v-model.trim="formInline.userName" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="评价关键字">
                        <el-input v-model.trim="formInline.keyWord" clearable></el-input>
                    </el-form-item>

                    <el-form-item label="评价等级">
                        <el-select v-model="formInline.score" placeholder="请选择" clearable >
                            <el-option v-for="item in starsTypeList" :key="item.id" :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="评价时间">
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
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="productUrl"
                            label="商品图片"
                            width="80">
                        <template slot-scope="scope" v-if="!!scope.row.productUrl">
                            <img @click="handleImgLook($event)" :src="scope.row.productUrl" style="width: 40px;height: 40px; margin: 10px;">
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="productId"
                            label="商品ID"
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="productName"
                            label="商品名称"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="orderCode"
                            label="订单编号"
                            width="170">
                    </el-table-column>
                    <el-table-column
                            prop="commentUserName"
                            label="用户昵称"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            prop="score"
                            label="商品评分"
                            width="100">
                        <template slot-scope="scope">
                            <i class="el-icon-star-on" v-for="(item,i) in 5" :key="i" :style="{color:item<=scope.row.score?'red':'#ccc'}"></i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="comments"
                            label="评价内容"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            width="200"
                            prop="imgUrls"
                            label="评价图片">
                        <template slot-scope="scope" v-if="!!scope.row.imgUrls">
                            <img @click="handleImgLook($event)" v-for="(item,index) in JSON.parse(scope.row.imgUrls)" :src="item" :key="index" style="width: 40px;height: 40px; margin-left: 8px;margin-right: 8px;">
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="commentTime"
                            label="评价时间"
                            width="140">
                        <template slot-scope="scope">
                            {{ scope.row.commentTime | format }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="150"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    @click="handleClick($event,scope.row)"
                                    type="text"
                                    size="small">查看详情</el-button>
                            <el-button v-if="scope.row.status === 0"
                                    @click="handleClick($event,scope.row)"
                                    type="text"
                                    size="small">通过</el-button>
                            <el-button
                                    @click="handleClick($event,scope.row)"
                                    type="text"
                                    size="small">删除</el-button>
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

        <!--查看详情-->
        <el-dialog
                title="评价详情"
                width="80%"
                :visible.sync="isTableDetails">
            <el-table :data="detailsData.list"
                      size="small"
                      :cell-style="listClass"
                      border
                      :header-cell-style="headleListClass">
                <el-table-column
                        property="commentUserName"
                        label="评价人"
                        width="200">
                </el-table-column>
                <el-table-column
                        property="comments"
                        label="评价内容">
                </el-table-column>
                <el-table-column
                        property="commentTime"
                        width="200"
                        label="评价时间">
                    <template slot-scope="scope">
                        {{ scope.row.commentTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="200"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 0"
                                @click="handleClickXq($event,scope.row)"
                                type="text"
                                size="small">通过</el-button>
                        <el-button
                                @click="handleClickXq($event,scope.row)"
                                type="text"
                                size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="paging-box" v-show="detailsData.list&&detailsData.list.length>0">
                <el-pagination
                        background
                        @size-change="handleSizeChangeXq"
                        @current-change="handleCurrentChangeXq"
                        :current-page="detailsData.pageNum"
                        :page-sizes="[10, 20, 30, 40, 50]"
                        :page-size="detailsData.pageSize||10"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="detailsData.total">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
    
</template>

<script>
    //星星状态集合
    const starsTypeList = [
        {id:1,name:'一星',value:'1'},
        {id:2,name:'二星',value:'2'},
        {id:3,name:'三星',value:'3'},
        {id:4,name:'四星',value:'4'},
        {id:5,name:'五星',value:'5'},
    ];
    import { adminGetListIF,adminDetailIF, adminUpdateIF } from '../../api/evaluateList';
    import { handleStatus} from '../../assets/js/public-method';
    export default {
        name: "evaluateList",
        data() {
            return {
                formInline:{
                    productId: '',
                    productName: '',
                    orderCode: '',
                    userName: '',
                    keyWord: '',
                    score: '',
                    startTime: '',
                    endTime: '',
                    pageNo: '',
                    pageSize: '',
                },
                starsTypeList:starsTypeList,
                setTime: [],
                tableData: {},
                isTableDetails:false,
                detailsData:{},
                detailsDataId:'',
            }
        },
        filters:{
            format: function(val) {
                const date = new Date(val);
                return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`
            },
        },
        watch:{
            '$route':'fetchData'
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            //查看图片
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
            //列表查询按钮
            handleClickGuery(){
                let _this = this;
                let params = {
                    productId:_this.formInline.productId,
                    productName:_this.formInline.productName,
                    orderCode:_this.formInline.orderCode,
                    userName:_this.formInline.userName,
                    keyWord:_this.formInline.keyWord,
                    score:_this.formInline.score,
                    startTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[0]||'',
                    endTime: _this.setTime&&_this.setTime.length>0&&_this.setTime[1]||'',
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
                _this.$router.push({path:'/evaluateList',query: params});
            },
            //点击列表操作
            handleClick(e,val) {
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let eventVal = e.target.innerHTML;
                if(eventVal==='查看详情'){
                    let params={ id:val.id};
                    _this.detailsDataId=val.id;
                    _this.$get(adminDetailIF,params).then(res => {
                        if(res.status === 0){
                            _this.detailsData=res.data;
                            _this.isTableDetails=true

                        }else {
                            handleStatus(_this,res.status,res.msg);
                        }
                    });


                }else if(eventVal==='通过'){
                    _this.$confirm('确定要通过商品的评价吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:1 };
                        _this.$get(adminUpdateIF,params).then(res => {
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

                }else if(eventVal==='删除') {
                    _this.$confirm('确定要删除此商品的评价吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:9 };
                        _this.$get(adminUpdateIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                let obj = {
                                    productId:paramsPage.productId||'',
                                    productName:paramsPage.productName||'',
                                    orderCode:paramsPage.orderCode||'',
                                    userName:paramsPage.userName||'',
                                    keyWord:paramsPage.keyWord||'',
                                    score:paramsPage.score||'',
                                    startTime:paramsPage.startTime||'',
                                    endTime:paramsPage.endTime||'',
                                    pageNo:paramsPage.pageNo||'',
                                    pageSize:paramsPage.pageSize||this.tableData.pageSize||'10',
                                };
                                let total = _this.tableData.total>0&&_this.tableData.total-1||0;
                                let zc = total % obj.pageSize;
                                if(zc===0){
                                    obj.pageNo =  obj.pageNo-1>=1?obj.pageNo-1:1;
                                    for(let key in obj){
                                        if(obj[key] === ''){
                                            delete obj[key];
                                        }else {
                                            obj[key] = this.$Base64.encode(obj[key]+'');
                                        }
                                    }
                                    this.$router.push({path:'/evaluateList',query: obj});
                                }
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);

                }

            },
            //点击详情列表操作
            handleClickXq(e,val) {
                let _this = this;
                let eventVal = e.target.innerHTML;
                if(eventVal==='通过'){
                    _this.$confirm('确定要通过评价人的评价吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:1 };
                        _this.$get(adminUpdateIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                let obj={
                                    id:_this.detailsDataId||'',
                                    pageSize:_this.detailsData.pageSize||10,
                                    pageNo:_this.detailsData.pageNum||1,
                                };
                                _this.$get(adminDetailIF,obj).then(res => {
                                    if(res.status === 0){
                                        _this.detailsData=res.data;
                                        _this.isTableDetails=true
                                    }else {
                                        handleStatus(_this,res.status,res.msg);
                                    }
                                });
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }else if(eventVal==='删除') {
                    _this.$confirm('确定要删除此评价人的评价吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ id:val.id, status:9 };
                        _this.$get(adminUpdateIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                let obj={
                                    id:_this.detailsDataId||'',
                                    pageSize:_this.detailsData.pageSize||10,
                                    pageNo:_this.detailsData.pageNum||1,
                                };
                                let total = _this.detailsData.total>0&&_this.detailsData.total-1||0;
                                let zc = total % obj.pageSize;
                                if(zc===0){
                                    obj.pageNo =  obj.pageNo-1>=1?obj.pageNo-1:1;
                                }
                                _this.$get(adminDetailIF,obj).then(res => {
                                    if(res.status === 0){
                                        _this.detailsData=res.data;
                                        _this.isTableDetails=true
                                    }else {
                                        handleStatus(_this,res.status,res.msg);
                                    }
                                });

                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }
            },
            //评价人的详情分页
            handleSizeChangeXq(val) {
                let _this = this;
                let params={
                    id:_this.detailsDataId||'',
                    pageSize:val,
                    pageNo:_this.detailsData.pageNum||1,
                };

                _this.$get(adminDetailIF,params).then(res => {
                    if(res.status === 0){
                        _this.detailsData=res.data;
                        _this.isTableDetails=true
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },
            handleCurrentChangeXq(val) {
                let _this = this;
                let params={
                    id:_this.detailsDataId||'',
                    pageNo:val,
                    pageSize:_this.detailsData.pageSize||10,
                };
                _this.$get(adminDetailIF,params).then(res => {
                    if(res.status === 0){
                        _this.detailsData=res.data;
                        _this.isTableDetails=true
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },
            //分页
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    productId:paramsPage.productId||'',
                    productName:paramsPage.productName||'',
                    orderCode:paramsPage.orderCode||'',
                    userName:paramsPage.userName||'',
                    keyWord:paramsPage.keyWord||'',
                    score:paramsPage.score||'',
                    startTime:paramsPage.startTime||'',
                    endTime:paramsPage.endTime||'',
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

                this.$router.push({path:'/evaluateList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    productId:paramsPage.productId||'',
                    productName:paramsPage.productName||'',
                    orderCode:paramsPage.orderCode||'',
                    userName:paramsPage.userName||'',
                    keyWord:paramsPage.keyWord||'',
                    score:paramsPage.score||'',
                    startTime:paramsPage.startTime||'',
                    endTime:paramsPage.endTime||'',
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

                this.$router.push({path:'/evaluateList',query: params});

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
                        _this.isTableDetails=true
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });

            },
            //初始化
            fetchData(){//url路径
                let params = {};
                params=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in params){
                    params[key] = this.$Base64.decode(params[key]);
                }
                this.formInline.productId = params.productId||'';
                this.formInline.productName = params.productName||'';
                this.formInline.orderCode = params.orderCode||'';
                this.formInline.userName = params.userName||'';
                this.formInline.keyWord = params.keyWord||'';
                this.formInline.score = params.score||'';
                this.formInline.startTime = params.startTime||'';
                this.formInline.endTime = params.endTime||'';
                if(this.formInline.startTime&&this.formInline.endTime){
                    this.setTime=[this.formInline.startTime,this.formInline.endTime]
                }else {
                    this.setTime = [];
                }
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.isDetails=false;
                this.getAdminOrderList(adminGetListIF,params);
            }
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