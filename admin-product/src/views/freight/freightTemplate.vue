<template>
    <div class="wrapper">
        <h5>运费配置</h5>
        <div class="box">
            <el-row style="margin-bottom: 20px;">
                <el-col :span="24">
                    <span class="title">模板基本信息</span>
                </el-col>
                <el-col :span="12">
                    <el-form
                            label-position="right"
                            size="small"
                            class="content-form"
                            :model="formInline"
                            label-width="100px">
                        <el-form-item label="模板名称" :required="true">
                            <el-input v-model="formInline.templateName" placeholder="请输入模板名称，最多30个字" maxlength="30" clearable></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>

            </el-row>
        </div>
        <div class="box">
            <el-row style="margin-bottom: 20px;">
                <el-col :span="24">
                    <span class="title">区域</span>
                </el-col>
                <el-col :span="24">
                    <el-table :data="formInline.fareTemplates"
                              size="small"
                              :cell-style="listClass"
                              border
                              :header-row-style="headleListClass"
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
                                label="满（件|Kg|元）包邮">
                            <template slot-scope="scope">
                                {{ scope.row | inclUnitNumName }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="150"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        @click="handleEidtClick(scope.$index, scope.row)"
                                        type="text"
                                        size="small">编辑</el-button>
                                <el-button
                                           @click="deleteRow(scope.$index, formInline.fareTemplates)"
                                           type="text"
                                           size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24">
                    <el-button
                            style="margin: 10px;"
                            type="primary"
                            @click="handleAddFreight"
                            size="small">添加区域及运费信息</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="box">
            <el-row style="margin-bottom: 20px;">
                <el-col :span="24" class="btn-box">
                    <el-button  size="mini" @click="handleCancel">取消</el-button>
                    <el-button type="primary" size="mini" @click="handleSave" v-throttle>保存</el-button>
                </el-col>
            </el-row>
        </div>

        <!--弹框-->
        <el-dialog
                class="dialog-box"
                title="配置区域及运费信息"
                width="65%"
                :visible.sync="dialogFormVisible">
            <el-form
                    label-position="right"
                    label-width="100px"
                    size="small"
                    :model="freightInfoObj">
                <el-form-item label="选择地区" :required="true">
                    <el-checkbox-group v-model="freightInfoObj.region" @change="handleCheckedCitiesChange">
                        <el-checkbox
                                v-for="item in districtIdList"
                                :label="item.districtId"
                                :disabled="disabledProvinceId(item.districtId)"
                                :key="item.districtId">{{item.districtName}}</el-checkbox>
                    </el-checkbox-group>
                    <div>
                        <el-button type="primary" size="mini"@click="handleCheckAll">全选</el-button>
                        <el-button type="primary" size="mini"@click="handleReverseCheckAll">反选</el-button>
                        <el-button type="primary" size="mini"@click="handleResetCheck">重置</el-button>
                    </div>
                </el-form-item>
                <el-form-item label="是否包邮">
                    <el-radio-group v-model="freightInfoObj.isInclPostage" @change="handleBaoYou">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计价方式">
                    <el-radio-group v-model="freightInfoObj.valuationModel" @change="handleJiJiaType">
                        <el-radio :label="1">按件数</el-radio>
                        <el-radio :label="2">按重量</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="配置运费" v-show="!freightInfoObj.isInclPostage">
                    <el-radio-group v-model="freightInfoObj.isFixedFreight" @change="handlePeiZhiYunFei">
                        <el-radio :label="0">固定运费</el-radio>
                        <el-radio :label="1">阶梯运费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="固定运费"
                              :required="true"
                              v-show="(!freightInfoObj.isInclPostage&&freightInfoObj.isFixedFreight===0)">
                    <el-input-number :min="0" style="width: 220px;" :precision="2" :controls='false' v-model="freightInfoObj.fixedFreight" placeholder="请固定运费"></el-input-number>  元
                </el-form-item>
                <el-form-item label="阶梯运费"
                              :required="true"
                              v-show="(!freightInfoObj.isInclPostage&&freightInfoObj.isFixedFreight===1)">
                    <div v-if="(freightInfoObj.valuationModel===1)">
                        <div style="margin-bottom: 10px;">
                            <span style="display: inline-block;margin-right: 35px;">
                                <span>首件</span>
                            <el-input-number :min="1" step-strictly style="width: 200px; margin:0 10px;" :controls='false' v-model="freightInfoObj.firstPiece"></el-input-number>
                            件
                            </span>
                            <span>
                                <span>首费</span>
                            <el-input-number :min="0" style="width: 200px;margin:0 10px;" :precision="2" :controls='false' v-model="freightInfoObj.firstAmount"></el-input-number>
                            元
                            </span>

                        </div>
                        <div style="margin-bottom: 10px;">
                            <span style="display: inline-block;margin-right: 35px;">
                                <span>续件</span>
                            <el-input-number :min="1" step-strictly  style="width: 200px;margin:0 10px;" :controls='false' v-model="freightInfoObj.secondPiece"></el-input-number>
                            件
                            </span>
                            <span>
                                <span>续费</span>
                            <el-input-number :min="0" style="width: 200px;margin:0 10px;" :precision="2" :controls='false' v-model="freightInfoObj.secondAmount"></el-input-number>
                            元
                            </span>
                        </div>
                        <div>
                            <span>
                                购满
                            </span>
                            <el-input-number  style="width: 200px;margin:0 10px;" :controls='false' v-model="freightInfoObj.inclUnitNum"></el-input-number>
                            <el-select
                                    v-model="freightInfoObj.inclUnit"
                                    style="width: 70px">
                                <el-option label="件" :value="0"></el-option>
                                <el-option label="元" :value="2"></el-option>
                            </el-select>
                            包邮
                        </div>

                    </div>
                    <div v-if="(freightInfoObj.valuationModel===2)">
                        <div style="margin-bottom: 10px;">
                            <span style="display: inline-block;margin-right: 35px;">
                                <span>首重</span>
                            <el-input-number :min="0.01" style="width: 200px; margin:0 10px;" :controls='false' v-model="freightInfoObj.firstWeight"></el-input-number>
                            Kg
                            </span>
                            <span>
                                <span>首费</span>
                            <el-input-number :min="0" style="width: 200px;margin:0 10px;" :precision="2" :controls='false' v-model="freightInfoObj.firstAmount"></el-input-number>
                            元
                            </span>

                        </div>
                        <div style="margin-bottom: 10px;">
                            <span style="display: inline-block;margin-right: 35px;">
                                <span>续重</span>
                            <el-input-number :min="0.01" style="width: 200px;margin:0 10px;" :controls='false' v-model="freightInfoObj.secondWeight"></el-input-number>
                            Kg
                            </span>
                            <span>
                                <span>续费</span>
                            <el-input-number :min="0" style="width: 200px;margin:0 10px;" :precision="2" :controls='false' v-model="freightInfoObj.secondAmount"></el-input-number>
                            元
                            </span>
                        </div>
                        <div>
                            <span>
                                购满
                            </span>
                            <el-input-number style="width: 200px;margin:0 10px;" :controls='false' v-model="freightInfoObj.inclUnitNum"></el-input-number>
                            <el-select
                                    v-model="freightInfoObj.inclUnit"
                                    style="width: 70px">
                                <el-option label="Kg" :value="1"></el-option>
                                <el-option label="元" :value="2"></el-option>
                            </el-select>
                            包邮
                        </div>
                    </div>

                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleDialogSave" size="small" v-throttle>确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { adminProvinceListIF,adminFareUpdateIF,adminFareAddIF,adminFareGetByCodeIF } from '../../api/freightTemplate';
    import { handleStatus} from '../../assets/js/public-method';
    let freightInfoObj = {
        id:'',
        region:[],
        isInclPostage:1,//0：不包邮 1包邮
        valuationModel:1, //计价方式 1:按件 2:按重量 3:按体积
        isFixedFreight:0,//是否固定运费 0固定运费 1 阶梯运费
        fixedFreight:undefined,
        firstPiece:undefined,
        firstWeight:undefined,
        firstAmount:undefined,
        secondPiece:undefined,
        secondWeight:undefined,
        secondAmount:undefined,
        inclUnitNum:undefined,
        inclUnit:undefined,
    };
    let provinceIdArr = [];
    let itemIndext = null; //记录当前操作的是第几条数据
    export default {
        name: "freightTemplate",
        data() {
            return {
                formInline: {
                    templateCode:'',
                    templateName:'',
                    fareTemplates:[],
                },
                freightInfoObj:{},
                districtIdList:[],
                dialogFormVisible:false,
                disabledProvinceIdArr:[]
            }
        },
        computed:{

        },
        filters:{
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
        watch:{
            '$route':'fetchData'
        },
        mounted() {
            this.fetchData();
        },
        methods:{
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

            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            handleEidtClick(index, row) {

                let newformInline = {};
                newformInline=JSON.parse(JSON.stringify(this.formInline));
                newformInline.fareTemplates.splice(index, 1);
                this.disabledProvinceIdArr = [];
                for(let item of newformInline.fareTemplates){
                    if(item&&item.region.length>0){
                        this.disabledProvinceIdArr = this.disabledProvinceIdArr.concat(item.region);
                    }
                }
                itemIndext = index;
                this.freightInfoObj = Object.assign({}, row);
                this.dialogFormVisible = true;

            },
            deleteRow(index, rows) {
                rows.splice(index, 1);
            },
            handleCancel() {
                this.$router.push('/freightList');
            },
            signFigures(num, rank = 6) {
                if(!num) return(0);
                const sign = num / Math.abs(num);
                const number = num * sign;
                const temp = rank - 1 - Math.floor(Math.log10(number));
                let ans;
                if (temp > 0) {
                    ans = parseFloat(number.toFixed(temp));
                }
                else if (temp < 0) {
                    ans = Math.round(number / Math.pow(10, temp)) * temp;
                }
                else {
                    ans = Math.round(number);
                }
                return (ans * sign);
            },
            handleSave() {
                let sfArr = [];//判断是否有31个省
                let _this = this;
                let url = adminFareAddIF;
                for(let item of this.formInline.fareTemplates){
                    if(item&&item.region.length>0){
                        sfArr = sfArr.concat(item.region);
                    }
                }
                if(!this.formInline.templateName){
                    this.$message.error('请输入模板名称！');
                    return false
                }else if(sfArr.length<31) {
                    this.$message.error('请检查选择的省份，配置的模板须包含所有省份！');
                    return false
                }
                let obj = {};
                obj=JSON.parse(JSON.stringify(_this.formInline));
                let params = {
                    templateCode:obj.templateCode||'',
                    templateName:obj.templateName,
                    fareTemplates:obj.fareTemplates
                }

                if(params.fareTemplates.length>0) {
                    for (let i = 0; i < params.fareTemplates.length; i++) {
                        params.fareTemplates[i].region = JSON.stringify(params.fareTemplates[i].region);
                        params.fareTemplates[i].fixedFreight = (params.fareTemplates[i].fixedFreight
                        ===0?0:(params.fareTemplates[i].fixedFreight
                            ?(_this.signFigures((params.fareTemplates[i].fixedFreight)*100)):undefined));
                        params.fareTemplates[i].firstAmount = (params.fareTemplates[i].firstAmount
                        ===0?0:(params.fareTemplates[i].firstAmount
                            ?(_this.signFigures((params.fareTemplates[i].firstAmount)*100)):undefined));
                        params.fareTemplates[i].secondAmount = (params.fareTemplates[i].secondAmount
                        ===0?0:(params.fareTemplates[i].secondAmount
                            ?(_this.signFigures((params.fareTemplates[i].secondAmount)*100)):undefined));
                        if(!params.fareTemplates[i].id){
                            delete params.fareTemplates[i].id
                        }
                        if(params.fareTemplates[i].firstAmount===undefined
                            ||params.fareTemplates[i].firstAmount===null){
                            delete params.fareTemplates[i].firstAmount
                        }
                        if(params.fareTemplates[i].fixedFreight===undefined
                            ||params.fareTemplates[i].fixedFreight===null){
                            delete params.fareTemplates[i].fixedFreight
                        }
                        if(params.fareTemplates[i].secondAmount===undefined
                            ||params.fareTemplates[i].secondAmount===null){
                            delete params.fareTemplates[i].secondAmount
                        }
                        if(params.fareTemplates[i].firstAmount===undefined
                            ||params.fareTemplates[i].firstAmount===null){
                            delete params.fareTemplates[i].firstAmount
                        }

                    }
                }
                if(!params.templateCode){
                    delete params.templateCode
                }else {
                    url = adminFareUpdateIF;
                }

                _this.$post(url,params).then(res=>{
                    if(res.status === 0){
                        _this.$message({
                            type: "success",
                            message: '保存成功！'
                        });
                        setTimeout(function () {
                            _this.$router.push({path:'/freightList'});
                        },1000);
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });

            },
            getAdminProvinceList() {//获取省份列表
                let _this = this;
                _this.$get(adminProvinceListIF).then(res => {
                    provinceIdArr = [];
                    if(res.status === 0){
                        _this.districtIdList = res.data;
                        for (let i of res.data) {
                            provinceIdArr.push(i.districtId)
                        }
                    }else {
                        handleStatus(_this,res.status,res.msg);

                    }
                });
            },
            //获取id 模板信息
            getFreightTemplateInfo(id) {
                let _this = this;
                let params ={
                    templateCode:id
                }
                _this.$get(adminFareGetByCodeIF,params).then(res => {
                    if(res.status === 0){
                        _this.formInline=res.data;
                        if(_this.formInline.fareTemplates.length>0) {
                            for (let i = 0; i < _this.formInline.fareTemplates.length; i++) {
                                _this.formInline.fareTemplates[i].region = JSON.parse(_this.formInline.fareTemplates[i].region);
                                _this.formInline.fareTemplates[i].firstPiece = _this.formInline.fareTemplates[i].firstPiece===null?undefined:_this.formInline.fareTemplates[i].firstPiece;
                                _this.formInline.fareTemplates[i].firstWeight = _this.formInline.fareTemplates[i].firstWeight===null?undefined:_this.formInline.fareTemplates[i].firstWeight;
                                _this.formInline.fareTemplates[i].secondPiece = _this.formInline.fareTemplates[i].secondPiece===null?undefined:_this.formInline.fareTemplates[i].secondPiece;
                                _this.formInline.fareTemplates[i].secondWeight = _this.formInline.fareTemplates[i].secondWeight===null?undefined:_this.formInline.fareTemplates[i].secondWeight;
                                _this.formInline.fareTemplates[i].inclUnitNum = _this.formInline.fareTemplates[i].inclUnitNum===null?undefined:_this.formInline.fareTemplates[i].inclUnitNum;
                                _this.formInline.fareTemplates[i].inclUnit = _this.formInline.fareTemplates[i].inclUnit===null?undefined:_this.formInline.fareTemplates[i].inclUnit;
                                _this.formInline.fareTemplates[i].fixedFreight = (_this.formInline.fareTemplates[i].fixedFreight
                                ===0?0:(_this.formInline.fareTemplates[i].fixedFreight
                                    ?((_this.formInline.fareTemplates[i].fixedFreight)/100):undefined));
                                _this.formInline.fareTemplates[i].firstAmount = (_this.formInline.fareTemplates[i].firstAmount
                                ===0?0:(_this.formInline.fareTemplates[i].firstAmount
                                    ?((_this.formInline.fareTemplates[i].firstAmount)/100):undefined));
                                _this.formInline.fareTemplates[i].secondAmount = (_this.formInline.fareTemplates[i].secondAmount
                                ===0?0:(_this.formInline.fareTemplates[i].secondAmount
                                    ?((_this.formInline.fareTemplates[i].secondAmount)/100):undefined));
                            }
                        }
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                }).catch(err =>{});
            },
            //url路径
            fetchData(){//url路径
                let id = this.$route.query.id;
                this.dialogFormVisible = false;
                this.freightInfoObj = {};
                this.getAdminProvinceList();
                if(id){
                    this.getFreightTemplateInfo(id);
                }else {
                    this.formInline={
                        templateCode:'',
                        templateName: '',
                        fareTemplates: [],
                    };
                }
            },
            //添加运费地区
            handleAddFreight() {
                itemIndext = null; //null 新建 有值 是编辑
                this.disabledProvinceIdArr = [];
                this.freightInfoObj = Object.assign({}, freightInfoObj);
                for(let item of this.formInline.fareTemplates){
                    if(item&&item.region.length>0){
                        this.disabledProvinceIdArr = this.disabledProvinceIdArr.concat(item.region);
                    }
                }
                this.dialogFormVisible = true;
            },
            //地区 是否 被禁用
            disabledProvinceId(val){
                return this.disabledProvinceIdArr.includes(val);
            },
            //弹框确定
            handleDialogSave() {

                let _this = this;
                if(this.freightInfoObj.region.length===0){
                    this.$message.error('请选择地区');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===0
                    &&this.freightInfoObj.fixedFreight===undefined) {
                    this.$message.error('请输入固定运费');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.valuationModel===1
                    &&this.freightInfoObj.firstPiece===undefined) {
                    this.$message.error('请输入首件数量');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.valuationModel===2
                    &&this.freightInfoObj.firstWeight===undefined) {
                    this.$message.error('请输入首件重量');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.firstAmount===undefined) {
                    this.$message.error('请输入（首件或首重）运费');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.valuationModel===1
                    &&this.freightInfoObj.secondPiece===undefined) {
                    this.$message.error('请输入续件数量');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.valuationModel===2
                    &&this.freightInfoObj.secondWeight===undefined) {
                    this.$message.error('请输入续重数量');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.secondAmount===undefined) {
                    this.$message.error('请输入（续件或续重）运费');
                    return false
                }else if(!this.freightInfoObj.isInclPostage
                    &&this.freightInfoObj.isFixedFreight===1
                    &&this.freightInfoObj.inclUnit===0
                    &&!!this.freightInfoObj.inclUnitNum) {
                    let y = String(this.freightInfoObj.inclUnitNum).indexOf(".") + 1;//获取小数点的位置
                    if(y>0){
                        this.$message.error('请输入正确的购满数量值');
                        return false
                    }

                }

                let obj = {};
                obj=JSON.parse(JSON.stringify(this.freightInfoObj));
                if(itemIndext||itemIndext===0){
                    this.formInline.fareTemplates.splice(itemIndext, 1,obj);
                }else {
                    this.formInline.fareTemplates.push(obj);
                }
                _this.dialogFormVisible = false;
            },
            handleCheckedCitiesChange(value) {

             },
            //单选 包邮
            handleBaoYou() {
                this.freightInfoObj.valuationModel = 1;
                this.freightInfoObj.isFixedFreight = 0;
                this.freightInfoObj.fixedFreight = undefined;
                this.freightInfoObj.firstPiece = undefined;
                this.freightInfoObj.firstAmount = undefined;
                this.freightInfoObj.secondPiece = undefined;
                this.freightInfoObj.secondWeight = undefined;
                this.freightInfoObj.secondAmount = undefined;
                this.freightInfoObj.inclUnitNum = undefined;
                this.freightInfoObj.inclUnit = undefined;
            },
            //计价方式
            handleJiJiaType() {
                this.freightInfoObj.isFixedFreight = 0;
                this.freightInfoObj.fixedFreight = undefined;
                this.freightInfoObj.firstPiece = undefined;
                this.freightInfoObj.firstWeight = undefined;
                this.freightInfoObj.firstAmount = undefined;
                this.freightInfoObj.secondPiece = undefined;
                this.freightInfoObj.secondWeight = undefined;
                this.freightInfoObj.secondAmount = undefined;
                this.freightInfoObj.inclUnitNum = undefined;
                this.freightInfoObj.inclUnit = undefined;
            },
            //配置运费
            handlePeiZhiYunFei(val) {
                this.freightInfoObj.fixedFreight = undefined;
                this.freightInfoObj.firstPiece = undefined;
                this.freightInfoObj.firstWeight = undefined;
                this.freightInfoObj.firstAmount = undefined;
                this.freightInfoObj.secondPiece = undefined;
                this.freightInfoObj.secondWeight = undefined;
                this.freightInfoObj.secondAmount = undefined;
                this.freightInfoObj.inclUnitNum = undefined;
                if(this.freightInfoObj.valuationModel===1){
                    this.freightInfoObj.inclUnit = 0;
                }else if(this.freightInfoObj.valuationModel===2) {
                    this.freightInfoObj.inclUnit = 1;
                }

            },
            //全选
            handleCheckAll() {
                let _this = this;
                let filterArr=provinceIdArr.filter(item=>{
                    return !(_this.disabledProvinceIdArr.includes(item))
                });
                _this.freightInfoObj.region = filterArr;


            },
            //反选
            handleReverseCheckAll() {
                let _this = this;
                let filterArr=provinceIdArr.filter(item=>{
                    return !(_this.disabledProvinceIdArr.includes(item))
                });
                let reverseFilterArr=filterArr.filter(item=>{
                    return !(_this.freightInfoObj.region.includes(item))
                });
                _this.freightInfoObj.region = reverseFilterArr;
            },
            //重置
            handleResetCheck() {
                let _this = this;
                _this.freightInfoObj.region = [];
            },
        }
    }
</script>

<style scoped>
    .wrapper {
        position: relative;
    }
    .box {
        margin: 20px 0;
    }
    .title {
        display: block;
        padding: 10px 0 10px 5px;
        background: rgb(121, 187, 255);
        color: #fff;
        font-size: 14px;
        margin-bottom: 20px;
    }
    .btn-box {
        text-align: center;
    }
    .btn-box>>>.el-button {
        padding: 10px 20px;
        margin-right: 30px;
    }
    .dialog-box >>> .el-dialog__header{
        padding: 15px 20px 15px;
        background: #ddd;
    }
    .dialog-box >>> .el-dialog__body{
        padding: 15px 20px;
    }
    .dialog-footer {
        text-align: center;
    }
    .dialog-footer>>>.el-button {
        padding: 10px 20px;
        margin-right: 30px;
    }


</style>