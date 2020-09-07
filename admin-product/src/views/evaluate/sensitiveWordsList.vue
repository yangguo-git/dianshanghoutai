<template>
    <div class="wrapper-list">
        <h5>敏感词管理</h5>
        <!--查询条件-->
        <div class="query-box">
            <el-form :inline="true" :model="formInline" label-width="90px" class="demo-form-inline" size="small">
                <el-form-item label="敏感词">
                    <el-input v-model.trim="formInline.word" clearable style="width: 350px"></el-input>
                </el-form-item>
                <el-form-item style="position: absolute;right: 10px">
                    <el-button type="primary" @click="handleClickGuery" size="mini">查询</el-button>
                    <el-button type="primary" @click="handleClickImport" size="mini">导入</el-button>
                </el-form-item>
            </el-form>

        </div>
        <!--列表展示-->
        <div class="list-box">
            <el-table
                    ref="multipleTable"
                    :data="tableData.list"
                    border
                    size="small"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                    :cell-style="listClass"
                    :header-cell-style="headleListClass"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="序号"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="word"
                        label="敏感词">
                </el-table-column>
                <el-table-column
                        prop="userName"
                        label="创建人"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间"
                        width="200">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="updateTime"
                        label="更新时间"
                        width="200">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | format }}
                    </template>
                </el-table-column>
                <el-table-column
                        width="100"
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
                <div style="float: left;">
                    <el-button  type="primary" @click="handleAllSelection" size="small">全选</el-button>
                    <el-button  type="primary" @click="handleAllDel" size="small">批量删除</el-button>
                </div>
                <el-pagination
                        background
                        style="float: right;"
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

        <!--导入-->
        <el-dialog
                title="上传文件"
                :visible.sync="isImport"
                :close-on-click-modal='false'
                width="500px">
            <p style="font-size: 15px;margin-top: -18px;margin-bottom: 20px;margin-left: 20px;">请选择要上传的文件：</p>
            <el-upload
                    class="upload-head-img"
                    accept=".txt"
                    action="#"
                    with-credentials
                    style="position: relative;margin-left: 40px;"
                    :show-file-list="false"
                    :on-change="handleChangeAvatarUpload"
                    :before-upload="beforeAvatarUpload"
                    :auto-upload="false">
                <el-button  size="small" type="primary" style="position: relative;">
                    选择文件
                </el-button>
                <span slot="tip" style="font-size: 14px;color: #999;display: inline-block;position: absolute;left: 110px;top: 6px;">
                    {{importData.text}}
                </span>
                <div slot="tip">
                    <p style="font-size: 14px;color: #999;margin-top: 20px;">说明：</p>
                    <p style="font-size: 14px;color: #999;margin-top: 8px;">
                        1、仅支持txt文件，敏感词个数不超过5000个。
                    </p>
                    <p style="font-size: 14px;color: #999;margin-top: 8px;">
                        2、敏感词长度不超过100个字符。
                    </p>
                </div>

            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isImport = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleImportSave" size="small">保 存</el-button>
            </div>
        </el-dialog>

        <!--编辑-->
        <el-dialog
                class="editDialogBox"
                title="编辑"
                :visible.sync="isEdit"
                :close-on-click-modal='false'
                width="400px">
                    <span style="display: inline-block;margin: 0 20px">敏感词</span>
                    <el-input type="textarea"
                              resize="none"
                              show-word-limit
                              v-model="editData.word"
                              style="width: 250px;vertical-align: top;"
                              rows="8"
                              maxlength="100"
                              placeholder="请输入敏感词，长度不能超过100个字符"></el-input>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isEdit = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleEditSave" size="small">保 存</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import { adminSensitivesListIF, adminUpdateSensitivesIF,adminImportSensitivesIF,adminDelSensitivesIF } from '../../api/sensitiveWordsList';
    import { handleStatus} from '../../assets/js/public-method';
    export default {
        name: "sensitiveWordsList",
        data() {
            return {
                formInline:{
                    word:'',
                    pageNo: '',
                    pageSize: '',
                },
                tableData: {},
                isEdit:false,
                editData:{
                    id:'',
                    word:''
                },
                isImport:false,
                importData: {
                    text:'sdfasfd'
                },
                fileList:[],
                multipleSelection:[],
                multipleSelectionId:[]
            }
        },
        filters: {
            format:function(val) {
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
            //list下批量删除
            handleAllDel() {
                let _this = this;
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }

                if(_this.multipleSelectionId.length===0){
                    _this.$message.error('请选中要删除的敏感词！');
                    return false
                }
                _this.$confirm('确定要批量删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params={ ids:_this.multipleSelectionId.join()};
                     _this.$get(adminDelSensitivesIF,params).then(res => {
                         if(res.status === 0){
                             _this.$message({
                                 type: 'success',
                                 message: '删除成功!'
                             });
                             let obj = {
                                 word:paramsPage.word||'',
                                 pageNo:paramsPage.pageNo||'',
                                 pageSize:paramsPage.pageSize||_this.tableData.pageSize||'10',
                             };
                             let total = _this.tableData.total>0&&_this.tableData.total-_this.multipleSelectionId.length||0;
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
                                 _this.$router.push({path:'/sensitiveWordsList',query: obj});
                             }
                             _this.fetchData();
                         }else {
                             handleStatus(_this,res.status,res.msg);
                         }
                     });
                }).catch(e=>e);

            },
            //list下全选按钮
            handleAllSelection() {
                this.$refs.multipleTable.toggleAllSelection();
            },
            //全选checkbox
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.multipleSelectionId=[];

                for(let item of this.multipleSelection){
                    this.multipleSelectionId.push(item.id);
                }
            },
            //导入显示弹框按钮
            handleClickImport() {
                this.isImport = true;
                this.importData = {
                    text:'未选择文件'
                }
            },
            //选中文件判断类型
            handleChangeAvatarUpload(file,fileList) {
                //判断文件格式
                let hz = file.name.split(".")[1];
                if (hz != 'txt') {
                    this.$message.warning('上传文件只能是txt格式!');
                    return false;
                }else {
                    this.fileList = file.raw;

                    this.importData = {
                        text:file.name
                    }
                }
            },
            //导入前判断
            beforeAvatarUpload(file) {
                let hz = file.name.split(".")[1];
                if ( hz != 'txt') {
                    this.$message.warning('上传文件只能是txt格式!');
                    return false;
                }
            },
            //导入保存
            handleImportSave() {
                let _this = this;
                let fileName = _this.importData.text;
                if(fileName === '未选择文件'){
                    _this.$message.error('请上传文件后才可保存');
                    return false
                }else {
                    // FormData 对象
                    const form = new FormData();
                    // 文件对象
                    form.append('upload', _this.fileList);
                    _this.$postHttpForm(adminImportSensitivesIF, form).then(res => {
                        if(res.status === 0){
                            _this.$message({
                                type: 'success',
                                message: '上传成功!'
                            });
                            _this.isImport = false;
                            _this.fetchData();

                        }else {
                            handleStatus(_this,res.status,res.msg);
                        }
                    })
                }

            },
            //编辑保存
            handleEditSave() {
                let _this = this;
                _this.$get(adminUpdateSensitivesIF,_this.editData).then(res => {
                    if(res.status === 0){
                        _this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        _this.isEdit = false;
                        _this.fetchData();
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });

            },
            headleListClass() {
                return 'background:#eef1f6;text-align: center'
            },
            listClass() {
                return 'text-align: center'
            },
            //列表查询按钮
            handleClickGuery(){
                let _this = this;
                let params = {
                    word:_this.formInline.word,
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
                _this.$router.push({path:'/sensitiveWordsList',query: params});
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
                if(eventVal==='编辑'){
                    _this.editData={
                        id:val.id,
                        word:val.word||'',
                    };
                    _this.isEdit=true

                }else if(eventVal==='删除') {
                    _this.$confirm('确定要敏感词吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        let params={ ids:val.id};
                         _this.$get(adminDelSensitivesIF,params).then(res => {

                             if(res.status === 0){
                                 _this.$message({
                                     type: 'success',
                                     message: '删除成功!'
                                 });
                                 let obj = {
                                    word:paramsPage.word||'',
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
                                    _this.$router.push({path:'/sensitiveWordsList',query: obj});
                                }
                                 _this.fetchData();
                             }else {
                                 handleStatus(_this,res.status,res.msg);
                             }
                         });
                    }).catch(e=>e);

                }

            },
            //分页
            handleSizeChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    word:paramsPage.word||'',
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

                this.$router.push({path:'/sensitiveWordsList',query: params});

            },
            handleCurrentChange(val) {
                let paramsPage = {};
                paramsPage=JSON.parse(JSON.stringify(this.$route.query));
                for(let key in paramsPage){
                    paramsPage[key] = this.$Base64.decode(paramsPage[key]);
                }
                let params = {
                    word:paramsPage.word||'',
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

                this.$router.push({path:'/sensitiveWordsList',query: params});

            },
            //获取列表
            getAdminSensitivesList(url,parma) {//获取列表
                let _this = this;
                _this.$get(url,parma).then(res => {
                    if(res.status === 0){
                        _this.tableData = res.data;
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
                this.formInline.word = params.word||'';
                this.formInline.pageNo = params.pageNo||'';
                this.formInline.pageSize = params.pageSize||'';
                this.isDetails=false;
                this.getAdminSensitivesList(adminSensitivesListIF,params);
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
        position:relative;
        text-align: right;
        margin: 15px;
    }
    .dialog-footer {
        text-align: center;
    }
    .dialog-footer button {
        margin-left: 20px;
        margin-right: 20px;
    }
</style>