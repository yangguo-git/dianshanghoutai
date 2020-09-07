<template>
    <div class="wrapper">
        <h5>运费列表</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">
                <el-form-item label="模板名称">
                    <el-input v-model.trim="formInline.name" clearable></el-input>
                </el-form-item>
                <el-form-item style="position: absolute;right: 10px">
                    <el-button type="primary" @click="handleClickGuery" size="mini">查询</el-button>
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
                    :header-cell-style="headleListClass">
                <el-table-column
                        prop="templateCode"
                        width="300"
                        label="序号">
                </el-table-column>
                <el-table-column
                        prop="templateName"
                        label="模板名称">
                    <template slot-scope="scope">
                        <span
                                style="color: #409EFF;cursor: pointer"
                                @click="handleLookName(scope.row)">{{ scope.row.templateName }}</span>
                    </template>
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
                        <el-button
                                @click="handleClick($event,scope.row)"
                                type="text"
                                size="small">编辑</el-button>
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

        <!--查看模板列表-->
        <el-dialog
                :title="'模板名称'+freightInfoIdObj.templateName"
                width="80%"
                :visible.sync="dialogTableVisible">
            <el-table :data="freightInfoIdObj.fareTemplates"
                      size="small"
                      :cell-style="listClass"
                      border
                      :header-cell-style="headleListClass">
                <el-table-column
                        property="region"
                        label="区域"
                        width="200">
                    <template slot-scope="scope">
                        {{ provinceIdName(scope.row.region) }}
                    </template>
                </el-table-column>
                <el-table-column
                        property="isInclPostage"
                        label="是否包邮">
                    <template slot-scope="scope">
                        {{ scope.row.isInclPostage | isInclPostageName }}
                    </template>
                </el-table-column>
                <el-table-column
                        property="valuationModel"
                        label="计价方式">
                    <template slot-scope="scope">
                        {{ scope.row.valuationModel | valuationModelName }}
                    </template>
                </el-table-column>
                <el-table-column
                        property="fixedFreight"
                        label="固定运费">
                </el-table-column>
                <el-table-column
                        property="firstPiece"
                        label="首（件|Kg）">
                    <template slot-scope="scope">
                        {{ scope.row | isJianKgFirst }}
                    </template>
                </el-table-column>
                <el-table-column
                        property="firstAmount"
                        label="首（件|Kg）运费">
                </el-table-column>
                <el-table-column
                        property="secondPiece"
                        label="续（件|Kg）">
                    <template slot-scope="scope">
                        {{ scope.row | isJianKgSecond }}
                    </template>
                </el-table-column>
                <el-table-column
                        property="secondAmount"
                        label="续（件|Kg）运费">
                </el-table-column>
                <el-table-column
                        property="inclUnitNum"
                        label="满（件|Kg）包邮">
                    <template slot-scope="scope">
                        {{ scope.row | inclUnitNumName }}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    import { adminFreightListIF,adminProvinceListIF, adminFreightDelIF,adminFareGetByCodeIF } from '../../api/freightList';
    import { handleStatus} from '../../assets/js/public-method';
    export default {
        name: "freightList",
        data() {
            return {
                formInline: {
                    name: '',
                    pageNo: '',
                    pageSize: '',
                },

                freightInfoIdObj:{
                    templateCode:'',
                    templateName:'',
                    fareTemplates:[],
                },
                districtIdList:[],
                tableData:{},
                dialogTableVisible:false,
            }
        },
        filters:{
            //过滤时间
            format: function(val) {
                if(!val){
                    return '';
                }else {
                    const date = new Date(val);
                    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate()<10?'0'+(date.getDate()):(date.getDate())} ${date.getHours()<10?'0'+(date.getHours()):(date.getHours())}:${date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes())}:${date.getSeconds()<10?'0'+(date.getSeconds()):(date.getSeconds())}`

                }
            },
            isInclPostageName(val){//转成名字
                let name ='';
                switch(val) {
                    case 1:
                        name='包邮';
                        break;
                    case 0:
                        name='不包邮';
                        break;
                    default:
                        name='';
                }
                return name;
            },
            valuationModelName(val){//转成名字
                let name ='';
                switch(val) {
                    case 1:
                        name='按件数';
                        break;
                    case 2:
                        name='按重量';
                        break;
                    default:
                        name='';
                }
                return name;
            },
            isJianKgFirst(val) {
                if(val.valuationModel===1){
                    return val.firstPiece
                }else if(val.valuationModel===2){
                    return val.firstWeight
                }
            },
            isJianKgSecond(val) {
                if(val.valuationModel===1){
                    return val.secondPiece
                }else if(val.valuationModel===2){
                    return val.secondWeight
                }
            },
            inclUnitNumName: function(val) {
                if(val.valuationModel===1){
                    if(val.inclUnitNum){
                        if(val.inclUnit===0){
                            return `满 ${val.inclUnitNum} 件`;
                        }else {
                            return `满 ${val.inclUnitNum} 元`;
                        }

                    }else {
                        return '';
                    }
                }else if(val.valuationModel===2) {
                    if(val.inclUnitNum){
                        if(val.inclUnit===1){
                            return `满 ${val.inclUnitNum} Kg`;
                        }else {
                            return `满 ${val.inclUnitNum} 元`;
                        }
                    }else {
                        return '';
                    }
                }else {
                    return ``;
                }
            },
        },
        methods: {
            //省份名字转换
            provinceIdName(val) {
                let str = '';
                if(val&&val.length>0){
                    for(let i=0;i<val.length;i++){
                        for(let item of this.districtIdList){
                            if(val[i] === item.districtId){
                                str += item.districtName+','
                            }
                        }
                    }
                    return str.substring(0,str.length-1);
                }else {
                    return '';
                }
            },
            //查看模板列表
            handleLookName(val) {
                let _this = this;
                let params ={
                    templateCode:val.templateCode
                }
                _this.$get(adminFareGetByCodeIF,params).then(res => {
                    if(res.status === 0){
                        _this.freightInfoIdObj=res.data;
                        if(_this.freightInfoIdObj.fareTemplates.length>0) {
                            for (let i = 0; i < _this.freightInfoIdObj.fareTemplates.length; i++) {
                                _this.freightInfoIdObj.fareTemplates[i].region = JSON.parse(_this.freightInfoIdObj.fareTemplates[i].region);
                                _this.freightInfoIdObj.fareTemplates[i].fixedFreight = (_this.freightInfoIdObj.fareTemplates[i].fixedFreight
                                ===0?0:(_this.freightInfoIdObj.fareTemplates[i].fixedFreight
                                    ?((_this.freightInfoIdObj.fareTemplates[i].fixedFreight)/100):undefined));
                                _this.freightInfoIdObj.fareTemplates[i].firstAmount = (_this.freightInfoIdObj.fareTemplates[i].firstAmount
                                ===0?0:(_this.freightInfoIdObj.fareTemplates[i].firstAmount
                                    ?((_this.freightInfoIdObj.fareTemplates[i].firstAmount)/100):undefined));
                                _this.freightInfoIdObj.fareTemplates[i].secondAmount = (_this.freightInfoIdObj.fareTemplates[i].secondAmount
                                ===0?0:(_this.freightInfoIdObj.fareTemplates[i].secondAmount
                                    ?((_this.freightInfoIdObj.fareTemplates[i].secondAmount)/100):undefined));
                            }
                        }
                        _this.dialogTableVisible=true;
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                }).catch(err =>{});

            },
            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            //列表查询
            handleClickGuery(){ //列表查询按钮
                let _this = this;
                let params = {
                    name:_this.formInline.name,
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

                _this.$router.push({path:'/freightList',query: params});
            },
            //新建模板
            handleClickNewlyBuild(){ //列表新建
                this.$router.push({path:'/freightTemplate'});
            },
            handleClick(e,val) {
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let eventVal = e.target.innerHTML;
                if(eventVal==='编辑'){
                    _this.$router.push({path:'/freightTemplate',query: { id: val.templateCode,modify:'1'}});
                }else if(eventVal==='删除') {
                    _this.$confirm('确定要删除此模板吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let params={ templateCode:val.templateCode};
                        _this.$get(adminFreightDelIF,params).then(res => {
                            if(res.status === 0){
                                _this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                let obj = {
                                    name:paramsPage.name||'',
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
                                    _this.$router.push({path:'/freightList',query: obj});
                                }
                                _this.fetchData();
                            }else {
                                handleStatus(_this,res.status,res.msg);
                            }
                        });
                    }).catch(e=>e);
                }

            },
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    name:paramsPage.name||'',
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

                this.$router.push({path:'/freightList',query: params});
            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    name:paramsPage.name||'',
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

                this.$router.push({path:'/freightList',query: params});
            },

            getAdminProvinceList() {//获取省份列表
                let _this = this;
                _this.$get(adminProvinceListIF).then(res => {
                    if(res.status === 0){
                        _this.districtIdList = res.data;
                    }else {
                        handleStatus(_this,res.status,res.msg);

                    }
                });
            },
            getAdminFreightList(url,parma) {//获取列表
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
                this.formInline.name = params.name||'';
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.getAdminProvinceList();
                this.getAdminFreightList(adminFreightListIF,params);
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
    .categoryData-form {
        width: 280px;
        margin-left: 20px;
    }

</style>