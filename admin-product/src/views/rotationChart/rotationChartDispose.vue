
<template>
    <div class="wrapper">
        <h5>首页轮播图配置</h5>
        <div class="content">
            <el-form
                    label-position="right"
                    label-width="100px"
                    :model="formInline"
                    size="small"
                    class="content-form">
                <el-form-item label="名称" :required="true">
                    <el-input
                            v-model="formInline.name"
                            placeholder="请输入名称，最多30个字"
                            :readonly="modify==='2'"
                            maxlength="30" clearable></el-input>
                </el-form-item>

                <el-form-item label="轮播图" :required="true">
                    <el-upload
                            class="upload-head-img"
                            action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                            with-credentials
                            :show-file-list="false"
                            :before-upload="beforeAvatarUploadImageUrl"
                            :on-success="(response, file, fileList) => handleUplodeSuccessImageUrl(response, file, fileList)"
                            list-type="picture">
                            <el-input
                                    slot="tip"
                                    placeholder="上传首页轮播图图片"
                                    readonly
                                    style="width: 280px;margin-right: 30px;position: absolute; left:0; top: 2px;"></el-input>
                            <el-button  v-if="modify!=='2'" size="small" type="primary" style="margin-left: 318px;">
                                选择图片
                            </el-button>

                        <div slot="tip">
                        <span style="font-size: 12px;color: #999;display: inline-block;">
                           轮播图建议您上传{{imgWidth}}*{{imgHeight}}像素的图片,支持jpg/jpeg/png格式
                        </span>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item  label=""   v-if="formInline.imageUrl" style="margin-bottom: 0;" >
                    <div class="img-url-item">
                        <img :src="formInline.imageUrl" class="img-url">
                        <i class="el-icon-close" v-if="modify!=='2'" @click="handleRemoveImageUrl"></i>
                    </div>
                </el-form-item>

                <el-form-item label="跳转选择" :required="true">
                    <el-radio-group
                            v-model="formInline.jumpType"
                            :disabled="!!modify"
                            @change="handleRadio">
                        <el-radio :label="0">跳转页面</el-radio>
                        <el-radio :label="1">跳转小程序</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="appid"
                        :required="true"
                        v-show="formInline.jumpType===1">
                    <el-input
                            :readonly="!!modify"
                            v-model="formInline.appid"
                            placeholder="请输入跳转小程序的appid"
                            clearable></el-input>
                </el-form-item>
                <el-form-item
                        label="页面路径"
                        :required="true"
                        v-show="formInline.jumpType===1">
                    <el-input
                            :readonly="!!modify"
                            v-model="formInline.jumpUrl"
                            placeholder="请输入跳转小程序页面路径"
                            clearable></el-input>
                </el-form-item>
                <el-form-item
                        label="跳转链接"
                        v-show="formInline.jumpType===0">
                    <el-input
                            :readonly="!!modify"
                            v-model="formInline.jumpUrl"
                            placeholder="请输入点击轮播图后的跳转链接"
                            clearable></el-input>
                </el-form-item>

                <el-form-item label="开始时间" :required="true">
                    <el-date-picker
                            v-model="formInline.startTime"
                            type="datetime"
                            value-format="timestamp"
                            default-time="00:00:00"
                            :readonly="modify==='2'"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" :required="true">
                    <el-date-picker
                            v-model="formInline.endTime"
                            type="datetime"
                            value-format="timestamp"
                            default-time="23:59:59"
                            :readonly="modify==='2'"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="排序" :required="true">
                    <el-input-number
                            :min="0"
                            style="width: 220px;"
                            :controls='false'
                            :disabled="modify==='2'"
                            v-model="formInline.sort"
                            placeholder="请输入排序"></el-input-number>
                </el-form-item>

                <el-form-item class="footer-btn-box">
                    <el-button @click="handleClick" size="mini">取 消</el-button>
                    <el-button v-if="!(modify==='2')" type="primary" @click="onSubmit" size="mini">保 存</el-button>
                </el-form-item>

            </el-form>

        </div>

    </div>
</template>

<script>
    import { coverimgSaveIF, coverimgUpdateIF,coverimgGetIF } from '../../api/rotationChartDispose';
    import { handleStatus,isPicSize } from '../../assets/js/public-method';
    export default {
        name: "RotationChartDispose",
        data() {
            return {
                formInline: {
                    id:'',
                    name: '',
                    imageUrl: '',
                    jumpType:1,
                    appid:'',
                    jumpUrl:'',
                    startTime:'',
                    endTime:'',
                    sort:0
                },
                modify:'',//1为编辑，2为查看 其余为新建
                imgWidth:900,
                imgHeight:383
            }
        },
        methods: {
            //缩略图判断图片类型
            beforeAvatarUploadImageUrl(file) {
                let _this = this;
                let width = _this.imgWidth;
                let height = _this.imgHeight;
                let isSize = isPicSize(this,file,width,height);
                return isSize;
            },
            //缩略图成功回调
            handleUplodeSuccessImageUrl(response, file, fileList) {
                if(response.status!==0){
                    handleStatus(this,response.status,response.msg);
                }
                this.formInline.imageUrl =response.data;
            },
            //删除图片
            handleRemoveImageUrl() {
                this.formInline.imageUrl = '';
            },
            //跳转路径
            handleRadio() {
                this.formInline.jumpUrl='';
                this.formInline.appid='';
            },
            onSubmit() {
                let _this = this;
                let url = coverimgUpdateIF;//更新
                let params = {
                    id:_this.formInline.id,
                    productName:_this.formInline.name,
                    coverImgUrl:_this.formInline.imageUrl,
                    urlType: _this.formInline.jumpType,
                    appid: _this.formInline.appid,
                    url: _this.formInline.jumpUrl,
                    startTime: _this.formInline.startTime,
                    endTime: _this.formInline.endTime,
                    sort: _this.formInline.sort,
                };
                if(!params.productName){
                    this.$message.error('请填写名称!');
                    return false;
                }else if(!params.coverImgUrl){
                    this.$message.error('请上传图片!');
                    return false;
                }else if(params.urlType===1&&!params.appid){
                    this.$message.error('请输入跳转小程序的appid!');
                    return false;
                }else if(params.urlType===1&&!params.url){
                    this.$message.error('请输入跳转小程序页面路径!');
                    return false;
                }else if(!params.startTime){
                    this.$message.error('请选择开始时间!');
                    return false;
                }else if(!params.endTime){
                    this.$message.error('请选择结束时间!');
                    return false;
                }else if(params.startTime>params.endTime){
                    this.$message.error('开始时间不能大于结束时间!');
                    return false;
                }else if(params.sort===''||params.sort===undefined){
                    this.$message.error('请输入排序!');
                    return false;
                }


                if(!params.id){
                    delete params.id;
                    url = coverimgSaveIF;
                }
                _this.$post(url, params).then(res => {
                    if (res.status===0) {
                        _this.$router.push('/rotationChartList');
                    } else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });

            },
            handleClick() {//取消
                this.$router.push('/rotationChartList');
            },
            init() {//初始化数据
                let _this = this;
                let params = _this.$route.query;
                if(params.id){
                    _this.modify = params.modify;
                    _this.$get(coverimgGetIF,{id:params.id}).then(res => {
                        if(res.status === 0){
                            _this.formInline.id=res.data.id;
                            _this.formInline.name=res.data.productName;
                            _this.formInline.imageUrl=res.data.coverImgUrl;
                            _this.formInline.jumpType=res.data.urlType;
                            _this.formInline.appid=res.data.appid;
                            _this.formInline.jumpUrl=res.data.url;
                            _this.formInline.startTime=res.data.startTime;
                            _this.formInline.endTime=res.data.endTime;
                            _this.formInline.sort=res.data.sort;
                        }else {
                            if(res.status === 20002){
                                handleStatus(_this,res.status,res.msg);
                            }else {
                                _this.$message({
                                    type: "error",
                                    message: res.msg
                                });
                                setTimeout(function () {
                                    _this.$router.go(-1);
                                },1500);
                            }
                        }
                    });
                }else {
                    _this.formInline.id='';
                    _this.formInline.imageUrl='';
                    _this.formInline.name='';
                    _this.formInline.jumpType=0;
                    _this.formInline.appid='';
                    _this.formInline.jumpUrl='';
                    _this.formInline.startTime='';
                    _this.formInline.endTime='';
                    _this.formInline.sort=0;
                    _this.modify='';
                }
            }
        },
        watch:{
            '$route':'init'
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .content {
        margin-top: 36px;
    }
    .content-form {
        width: 500px;
        margin: 20px;
    }
    .img-url-item {
        display: inline-block;
        width: 240px;
        margin: 0px 10px 0 0;
        position: relative;
        top: -20px;
        padding: 10px 10px 0 0;
        cursor: pointer;
    }
    .img-url-item .el-icon-close {
        position: absolute;
        top: 4px;
        right: -4px;
        display: block;
    }
    .img-url-item:hover i.el-icon-close{
        display: block;
    }
    .img-url {
        width: 235px;
        height: 100px;
    }
    .footer-btn-box {
        margin-top: 36px;
        text-align: center;
    }
    .footer-btn-box button {
        padding: 8px 25px;
        margin-right: 20px;
    }
</style>