<template>
    <div class="wrapper"
         v-loading.fullscreen="loading"
         element-loading-text="图片上传中,请勿操作!!!"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.2)">
        <h5>商品配置</h5>
        <!--头-->
        <div class="steps-box">
            <el-steps :active="active" align-center style="font-size: 14px;">
                <el-step title="商品类型"></el-step>
                <el-step title="商品信息"></el-step>
                <el-step title="库存规格"></el-step>
                <el-step title="参数详情"></el-step>
                <el-step title="其他信息"></el-step>
            </el-steps>
        </div>
        <!--内容-->
        <div class="content">
            <!--商品类型-->
            <div class="content-div" v-show="active===0">
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <span class="title">商品类型</span>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px; margin-left: 20px;">
                    <el-col :span="4" style="margin-top: 4px;">
                        商品分类
                    </el-col>
                    <el-col :span="9">
                        <span style="margin-right: 10px;">一级分类</span>
                        <el-select
                                v-model="productInfo.firstCategoryId"
                                placeholder="请选择"
                                size="small"
                                clearable
                                :disabled="!!productInfo.id"
                                @change="handleFirstSelectChange">
                            <el-option
                                    v-for="item in categoryList1"
                                    :key="item.id"
                                    :label="item.categoryName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="9">
                        <span style="margin-right: 10px;">二级分类</span>
                        <el-select
                                v-model="productInfo.secondCategoryId"
                                placeholder="请选择"
                                size="small"
                                :disabled="!!productInfo.id"
                                clearable
                                @change="handleSecondarySelectChange">
                            <el-option
                                    v-for="item in categoryList2"
                                    :key="item.id"
                                    :label="item.categoryName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="20" :offset="3">
                        <span>您当前选择的商品类型是</span>
                        <span style="color: red;display: inline-block;margin-left: 10px;">
                            {{ typeName }}
                        </span>
                    </el-col>
                </el-row>
            </div>
            <!--商品信息-->
            <div class="content-div" v-show="active===1">
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <span class="title">商品信息</span>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="3" style="text-align: right">
                        <span class="">商品类型</span>
                    </el-col>
                    <el-col :span="21">
                        <span style="display: inline-block;margin-left: 10px;">
                            {{ typeName }}
                        </span>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="3" style="text-align: right;margin-top: 5px;">
                        <span class="">商品名称</span>
                    </el-col>
                    <el-col :span="6" style="margin-left: 10px;">
                        <el-input v-model.trim="productInfo.productName" placeholder="请输入商品名称,最多30个字" size="small"
                                  maxlength="30" clearable></el-input>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="3" style="text-align: right;margin-top: 5px;">
                        <span class="">副标题</span>
                    </el-col>
                    <el-col :span="8" style="margin-left: 10px;">
                        <el-input v-model.trim="productInfo.productSubtitle" placeholder="请输入副标题,最多50个字" size="small"
                                  maxlength="50" clearable></el-input>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">商品图片</span>
                    </el-col>
                </el-row>
                <!--商品头图-->
                <el-row style="margin-bottom: 10px;">
                    <el-upload
                            class="upload-head-img"
                            action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                            with-credentials
                            multiple
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :on-success="(response, file, fileList) => handleUplodeSuccess(response, file, fileList,'商品头图')"
                            list-type="picture">
                        <el-col slot="tip" :span="3" style="text-align: right;margin-top: 5px;">
                            <span class="">头图</span>
                        </el-col>
                        <el-col slot="tip" :span="4" style="margin-left: 10px;">
                            <el-input placeholder="支撑批量上传头图" size="small" readonly></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                选择图片
                            </el-button>
                        </el-col>
                        <div slot="tip" class="el-upload__tip">
                            <el-row>
                                <el-col :span="8" :offset="3" style="margin-top: -6px;">
                                    <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                        头图建议您上传{{headImgWidth}}*{{headHeight}} 像素的图片,支持jpg/jpeg/png格式
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-upload>
                    <div class="img-url-box" v-if="productInfo.coverImgUrl&&productInfo.coverImgUrl.length>0">
                        <vuedraggable v-model="productInfo.coverImgUrl">
                            <div class="img-url-item"  v-for="(item,headindex) in productInfo.coverImgUrl" :key="headindex+10">
                                <img :src="item.url" class="img-url">
                                <i class="el-icon-close" @click="handleRemoveHead('商品头图',headindex)"></i>
                            </div>
                        </vuedraggable>
                    </div>

                </el-row>

                <!--商品缩略图-->
                <el-row style="margin-bottom: 10px;">
                    <el-upload
                            class="upload-head-img"
                            action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                            with-credentials
                            :show-file-list="false"
                            :before-upload="beforeAvatarUploadHumbnail"
                            :on-success="(response, file, fileList) => handleUplodeSuccessHumbnail(response, file, fileList, '商品缩略图')"
                            list-type="picture">
                        <el-col slot="tip" :span="3" style="text-align: right;margin-top: 5px;">
                            <span class="">缩略图</span>
                        </el-col>
                        <el-col slot="tip" :span="4" style="margin-left: 10px;">
                            <el-input placeholder="上传缩略图图片" size="small" readonly></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                选择图片
                            </el-button>
                        </el-col>
                        <div slot="tip" class="el-upload__tip">
                            <el-row>
                                <el-col :span="8" :offset="3" style="margin-top: -6px;">
                                    <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                        缩略图建议您上传{{thumbnailImgWidth}}*{{thumbnailImgHeight}}像素的图片,支持jpg/jpeg/png格式
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-upload>
                    <div class="img-url-box"  v-if="productInfo.thumbnailImgUrl" >
                        <div class="img-thumbnail-url-item">
                            <img :src="productInfo.thumbnailImgUrl" class="img-thumbnail-url">
                            <i class="el-icon-close" @click="handleRemoveHumbnail('商品缩略图')"></i>
                        </div>
                    </div>
                </el-row>

                <!--商品海报图-->
                <el-row style="margin-bottom: 10px;">
                    <el-upload
                            class="upload-head-img"
                            action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                            with-credentials
                            :show-file-list="false"
                            :before-upload="beforeAvatarUploadPoster"
                            :on-success="(response, file, fileList) => handleUplodeSuccessPoster(response, file, fileList, '商品海报图')"
                            list-type="picture">
                        <el-col slot="tip" :span="3" style="text-align: right;margin-top: 5px;">
                            <span class="">海报图</span>
                        </el-col>
                        <el-col slot="tip" :span="4" style="margin-left: 10px;">
                            <el-input placeholder="上传海报图图片" size="small" readonly></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                选择图片
                            </el-button>
                        </el-col>
                        <div slot="tip" class="el-upload__tip">
                            <el-row>
                                <el-col :span="8" :offset="3" style="margin-top: -6px;">
                                    <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                        缩略图建议您上传{{posterImgWidth}}*{{posterImgHeight}}像素的图片,支持jpg/jpeg/png格式
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-upload>
                    <div class="img-url-box"  v-if="productInfo.posterImgUrl" >
                        <div class="img-poster-url-item">
                            <img :src="productInfo.posterImgUrl" class="img-poster-url">
                            <i class="el-icon-close" @click="handleRemovePoster('商品海报图')"></i>
                        </div>
                    </div>
                </el-row>

                <!--上传视频-->
                <el-row style="margin-bottom: 10px;">
                    <el-upload
                            class="upload-head-img"
                            action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                            with-credentials
                            :show-file-list="false"
                            :before-upload="beforeAvatarUploadVideo"
                            :on-success="(response, file, fileList) => handleUplodeSuccessVideo(response, file, fileList)"
                            list-type="picture">
                        <el-col slot="tip" :span="3" style="text-align: right;margin-top: 5px;">
                            <span class="">视频</span>
                        </el-col>
                        <el-col slot="tip" :span="4" style="margin-left: 10px;">
                            <el-input placeholder="上传视频" size="small" readonly></el-input>
                        </el-col>
                        <el-col :span="2">
                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                选择视频
                            </el-button>
                        </el-col>
                        <div slot="tip" class="el-upload__tip">
                            <el-row>
                                <el-col :span="8" :offset="3" style="margin-top: -6px;">
                                    <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                        视频仅支持mp4格式
                                    </span>
                                </el-col>
                            </el-row>
                        </div>
                    </el-upload>
                    <div class="video-url-box"  v-if="productInfo.coverVideoUrl" >
                        <div class="video-url-item">
                            <video :src="productInfo.coverVideoUrl" class="video-url" controls="controls">
                                您的浏览器不支持视频播放,建议用谷歌浏览器！
                            </video>
                            <i class="el-icon-close" @click="handleRemoveVideo"></i>
                        </div>
                    </div>
                </el-row>

                <el-row style="margin-bottom: 10px;">
                    <el-col :span="3" style="text-align: right;margin-top: 5px;">
                        <span class="">排序</span>
                    </el-col>
                    <el-col :span="6" style="margin-left: -10px;">
                        <el-input-number :step="1" step-strictly v-model.trim="productInfo.sort"  placeholder="请输入排序" size="small"  class="inp-item" :min="0" :controls="false"></el-input-number>
                    </el-col>
                </el-row>

            </div>
            <!--库存规格-->
            <div class="content-div" v-show="active===2">
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <span class="title">库存规格</span>
                    </el-col>
                </el-row>
                <el-row v-for="(item, itemindex) in productNormList" :key="itemindex">
                    <el-col :span="2" style="text-align: right;width: 100px;" >
                        <span v-show="itemindex===0">商品规格</span>
                    </el-col>
                    <el-col :span="2" :offset="itemindex>0?2:0" style="text-align: right;margin-bottom: 10px; padding-right: 10px;">
                        <span style="font-size: 14px;font-weight: 600;color: #000">{{'规格组'+(itemindex+1)}}</span>
                    </el-col>
                    <el-col :span="2" :offset="8" v-show="modify!=='2'">
                        <el-button type="primary" size="small" @click="handleDelNorm(itemindex)">
                            删除规格
                        </el-button>
                    </el-col>
                    <el-col :offset="2" :span="22" style="position: relative">
                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">规格名称</el-col>
                            <el-col :span="22" class="right-side">
                                <el-input v-model.trim="item.productNorm.normName" placeholder="请输入规格名称" size="small" class="inp-item" clearable></el-input>
                            </el-col>
                        </el-row>
                        <!--<el-row class="item-row">
                            <el-col :span="2" class="left-side">规格值</el-col>
                            <el-col :span="22" class="right-side">
                                <el-input v-model.trim="item.productNorm.normValue" placeholder="请输入规格值" size="small" class="inp-item" ></el-input>
                            </el-col>
                        </el-row>-->

                        <!--主图-->
                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">主图</el-col>
                            <el-col :span="22" class="right-side">
                                <el-upload
                                        class="upload-head-img"
                                        action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                                        with-credentials
                                        multiple
                                        :show-file-list="false"
                                        :before-upload="beforeAvatarUpload"
                                        :on-success="(response, file, fileList) => handleUplodeSuccess(response, file, fileList,itemindex)"
                                        list-type="picture">
                                    <el-row>
                                        <el-col :span="2">
                                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                                选择图片
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                    <div slot="tip" class="el-upload__tip">
                                        <el-row>
                                            <el-col :span="24" style="margin-top: -6px;margin-left: 10px;">
                                                <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                                    头图建议您上传{{headImgWidth}}*{{headHeight}} 像素的图片,支持jpg/jpeg/png格式
                                                </span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-upload>
                                <div class=""  v-if="typeof item.productNorm.imgUrl!= 'string'&&item.productNorm&&item.productNorm.imgUrl&&item.productNorm.imgUrl.length>0">
                                    <vuedraggable v-model="item.productNorm&&item.productNorm.imgUrl">
                                        <div class="img-url-item"  v-for="(zuImg,zuImgIndex) in item.productNorm.imgUrl" :key="zuImgIndex">
                                            <img :src="zuImg.url" class="img-url">
                                            <i class="el-icon-close" @click="handleRemoveHead(itemindex,zuImgIndex)"></i>
                                        </div>
                                    </vuedraggable>

                                </div>
                            </el-col>
                        </el-row>

                        <!--缩略图-->
                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">缩略图</el-col>
                            <el-col :span="22" class="right-side">
                                <el-upload
                                        class="upload-head-img"
                                        action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                                        with-credentials
                                        :show-file-list="false"
                                        :before-upload="beforeAvatarUploadHumbnail"
                                        :on-success="(response, file, fileList) => handleUplodeSuccessHumbnail(response, file, fileList, itemindex)"
                                        list-type="picture">
                                    <el-row>
                                        <el-col :span="2">
                                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                                选择图片
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                    <div slot="tip" class="el-upload__tip">
                                        <el-row>
                                            <el-col :span="24" style="margin-top: -6px;margin-left: 10px;">
                                                <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                                    缩略图建议您上传{{thumbnailImgWidth}}*{{thumbnailImgHeight}}像素的图片,支持jpg/jpeg/png格式
                                                </span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-upload>
                                <div class="" v-if="item.productNorm.thumbnailImgUrl" >
                                    <div class="img-thumbnail-url-item">
                                        <img :src="item.productNorm.thumbnailImgUrl" class="img-thumbnail-url">
                                        <i class="el-icon-close" @click="handleRemoveHumbnail(itemindex)"></i>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                        <!--海报图-->
                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">海报图</el-col>
                            <el-col :span="22" class="right-side">
                                <el-upload
                                        class="upload-head-img"
                                        action="https://tchopshop.weein.cn/busi/admin/uploadFile/img"
                                        with-credentials
                                        :show-file-list="false"
                                        :before-upload="beforeAvatarUploadPoster"
                                        :on-success="(response, file, fileList) => handleUplodeSuccessPoster(response, file, fileList, itemindex)"
                                        list-type="picture">
                                    <el-row>
                                        <el-col :span="2">
                                            <el-button size="small" type="primary" style="margin-left: 20px;">
                                                选择图片
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                    <div slot="tip" class="el-upload__tip">
                                        <el-row>
                                            <el-col :span="24" style="margin-top: -6px;margin-left: 10px;">
                                                <span style="font-size: 12px;color: #999;display: inline-block;margin-left: 10px;">
                                                    海报图建议您上传{{posterImgWidth}}*{{posterImgHeight}}像素的图片,支持jpg/jpeg/png格式
                                                </span>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-upload>
                                <div class="" v-if="item.productNorm.posterImgUrl" >
                                    <div class="img-poster-url-item">
                                        <img :src="item.productNorm.posterImgUrl" class="img-poster-url">
                                        <i class="el-icon-close" @click="handleRemovePoster(itemindex)"></i>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">价格</el-col>
                            <el-col :span="22" class="right-side">
                                <el-input-number :step="1" step-strictly v-model.trim="item.productNorm.price" placeholder="实际售卖价格，单位是分" size="small" class="inp-item" :min="0" :controls="false"></el-input-number>
                            </el-col>
                        </el-row>
                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">划线价</el-col>
                            <el-col :span="22" class="right-side">
                                <el-input-number :step="1" step-strictly v-model.trim="item.productNorm.marketPrice" placeholder="商品原价，单位是分" size="small" class="inp-item" :min="0" :controls="false"></el-input-number>
                            </el-col>
                        </el-row>
                        <el-row class="item-row">
                            <el-col :span="2" class="left-side">库存</el-col>
                            <el-col :span="22" class="right-side">
                                <el-input-number :step="1" step-strictly v-model.trim="item.productNorm.sku" :disabled="!!item.productNorm.id" placeholder="请输入库存" size="small"  class="inp-item" :min="0" :controls="false"></el-input-number>
                            </el-col>
                        </el-row>
                        <el-row class="item-row">
                            <el-col :span="2" :offset="1" style="margin-bottom: 10px">
                                <el-button type="primary" size="small" @click="handleAddAttr(itemindex)">
                                    添加属性
                                </el-button>
                            </el-col>
                            <el-col :span="20":offset="2">
                                <div class="attr-wrapper">
                                    <div class="attr-box" v-for="(attr,attrIndex) in item.productAttrList" :key="attrIndex">
                                        <div class="item-row">
                                            <span>属性名称</span>
                                            <el-input v-model.trim="attr.attrName" placeholder="请输入属性名称" size="small" class="inp-item" clearable></el-input>
                                        </div>
                                        <div class="item-row">
                                            <span>属性值</span>
                                            <el-input v-model.trim="attr.attrValue" placeholder="请输入属性值" size="small" class="inp-item" clearable></el-input>
                                        </div>
                                        <i class="el-icon-delete attr-del"  @click="handleDelAttr(itemindex,attrIndex)"></i>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;" v-if="modify!=='2'">
                    <el-col :span="5" :offset="2">
                        <el-button  size="small" type="primary" @click="handleAddNorm">继续添加规格</el-button>
                    </el-col>
                </el-row>



            </div>
            <!--参数详情-->
            <div class="content-div" v-show="active===3">
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <span class="title">参数详情</span>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <textarea class="my_editor" id="Editor" v-model="productInfo.parameter"></textarea>
                    </el-col>
                </el-row>
            </div>
            <!--其他信息-->
            <div class="content-div" v-show="active===4">
                <el-row style="margin-bottom: 20px;">
                    <el-col :span="24">
                        <span class="title">其他信息</span>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 10px;">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">上架时间</span>
                    </el-col>
                    <el-col :span="8" :offset="1">
                        <el-radio v-model="productInfo.isSchedule" @change="handleRadio" :label='false'>放入仓库</el-radio>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;" align="middle" type="flex">
                    <el-col :span="3" :offset="4">
                        <el-radio v-model="productInfo.isSchedule" @change="handleRadio" :label='true'>自定义上架</el-radio>
                    </el-col>
                    <el-col :span="16">
                        <div class="grounding-time-box">
                            <span>设置时间</span>
                            <el-date-picker
                                    v-model="productInfo.setTime"
                                    :disabled="!productInfo.isSchedule"
                                    :default-time="['00:00:00', '23:59:59']"
                                    type="datetimerange"
                                    value-format="timestamp"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>

                        </div>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom: 20px;" type="flex" align="middle">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">是否推荐</span>
                    </el-col>
                    <el-col :span="1" :offset="1">
                        <el-radio v-model="productInfo.isRecommend" :label='false'>否</el-radio>
                    </el-col>
                    <el-col :span="1" :offset="1">
                        <el-radio v-model="productInfo.isRecommend" :label='true'>是</el-radio>
                    </el-col>
                    <el-col :span="10" style="font-size: 13px;color: #999;display: inline-block;margin-left: 10px;">
                        被推荐的商品会显示在首页
                    </el-col>
                </el-row>

                <el-row style="margin-bottom: 20px;" type="flex" align="middle">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">是否限购</span>
                    </el-col>
                    <el-col :span="1" :offset="1">
                        <el-radio v-model="productInfo.isLimit" @change="handleIsLimit" :label='false'>否</el-radio>
                    </el-col>
                    <el-col :span="1" :offset="1">
                        <el-radio v-model="productInfo.isLimit" @change="handleIsLimit" :label='true'>是</el-radio>
                    </el-col>
                    <el-col :span="3">
                        <el-input-number :step="1"
                                         step-strictly
                                         v-show="productInfo.isLimit"
                                         v-model="productInfo.productLimit"
                                         :disabled="!productInfo.isLimit"
                                         placeholder="输入限购数量"
                                         size="small"
                                         :min="1"
                                         :controls="false">
                        </el-input-number>
                    </el-col>

                </el-row>

                <el-row style="margin-bottom: 20px;" type="flex" align="middle">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">服务标签</span>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-radio v-model="productInfo.showDeliveryTime" :label='1'>48小时内发货</el-radio>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-radio v-model="productInfo.showDeliveryTime" :label='2'>72小时发货</el-radio>
                    </el-col>

                    <el-col :span="4">
                        <el-checkbox v-model="productInfo.showSafeguard">七天无理由退货</el-checkbox>
                    </el-col>
                </el-row>

                <el-row style="margin-bottom: 20px;" type="flex" align="middle">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">促销标签</span>
                    </el-col>
                    <el-col :span="4" :offset="1">
                        <el-checkbox-group v-model="productInfo.promotions">
                            <el-checkbox label="满99元包邮"></el-checkbox>
                        </el-checkbox-group>
                    </el-col>
                </el-row>

                <el-row style="margin-bottom: 20px;"  type="flex" align="middle">
                    <el-col :span="3" style="text-align: right;">
                        <span class="">运费模板</span>
                    </el-col>
                    <el-col :span="6" :offset="1">
                        <el-select
                                v-model="productInfo.fareTemplateCode"
                                placeholder="请选择运费模板"
                                size="small"
                                style="width: 100%;"
                                clearable>
                            <el-option
                                    v-for="item in freightTemplateList"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="3">
                        <span   @click="handleNewFreight"
                                style="display: inline-block;
                                vertical-align: center;
                                color: #409EFF;
                                margin-top: 5px;
                                margin-left: 15px;
                                cursor: pointer">新建运费模板</span>
                    </el-col>
                </el-row>



            </div>
        </div>
        <!--btn-->
        <div class="btn-box">
            <button class="prev-btn" @click="prev" v-show="active>0">上一步</button>
            <button class="next-btn" @click="next" v-show="active<4">下一步</button>
            <button class="save-btn"
                    v-if="modify!=='2'"
                    @click="save"
                    v-throttle
                    v-show="active===4">完&nbsp;成</button>
        </div>
        <!--返回列表-->
        <el-button style="position: absolute;top: 0;right: 0;" type="primary" @click="handleGoOrderList" size="small">返回列表</el-button>
    </div>
</template>

<script>
    import { productAddIF, productEditIF, categoryListIF, productViewIF, adminFreightListIF} from '../../api/productRelease';
    import vuedraggable from 'vuedraggable';
    import tinymce from "tinymce";
    import "tinymce/themes/silver";
    import "tinymce/plugins/image";
    import "tinymce/plugins/link";
    import "tinymce/plugins/code";
    import "tinymce/plugins/table";
    import "tinymce/plugins/lists";
    import "tinymce/plugins/contextmenu";
    import "tinymce/plugins/wordcount";
    import "tinymce/plugins/colorpicker";
    import "tinymce/plugins/textcolor";
    import "tinymce/plugins/print";
    import "tinymce/plugins/preview";
    import "@/assets/tinymce/plugins/lineheight/plugin";
    import { handleStatus, errorMess, isPicSize} from '../../assets/js/public-method';
    const normObj = {
        productNorm:{
            id:'',
            normName:'',
            price:undefined,
            marketPrice:undefined,
            imgUrl:[],
            thumbnailImgUrl:'',
            posterImgUrl:'',
            sku:undefined,
        },

        productAttrList:[{attrName:'',attrValue:''}],
    };
    let freightTemplateList=[
        {name:'A运费模板',value:'0000'},
        {name:'B运费模板',value:'1111'},
    ];

    export default {
        name: "productRelease",
        components: { vuedraggable },
        data() {
            return {
                productInfo:{
                    setTime:[],
                    id:'',
                    firstCategoryId: '',
                    secondCategoryId: '',
                    firstCategoryName: '',
                    secondCategoryName: '',
                    productName: '',
                    productSubtitle: '',
                    sort: 0,
                    isSchedule: false,//是否定时上下线 0 否 1是
                    planTime: '',//定时上架时间
                    expireTime: '',//定时下架时间
                    isLimit: false,//0：否 1：是
                    productLimit: undefined,
                    showDeliveryTime: 1,
                    showSafeguard: false,
                    promotions: [],
                    isRecommend: false,//是否推荐商品 0 否 1 是
                    status: "1",//0:待发布, 1:待上架, 2:已上架, 4:已过期, 9:已删除
                    parameter: '',
                    coverImgUrl: [],
                    thumbnailImgUrl:'',
                    coverVideoUrl:'',
                    fareTemplateCode:'',
                    posterImgUrl:'',
                },
                productNormList:[],
                categoryList:[],
                categoryList1:[],
                categoryList2:[],
                active: 0,
                loading:false,
                modify:'',
                freightTemplateList: [],
                headImgWidth:1000,
                headHeight:750,
                thumbnailImgWidth:345,
                thumbnailImgHeight:275,
                posterImgWidth:624,
                posterImgHeight:388
            }
        },
        computed: {
            typeName() {
                return (this.productInfo.secondCategoryName ?
                    (this.productInfo.firstCategoryName + '>' + this.productInfo.secondCategoryName) :
                    (this.productInfo.firstCategoryName ? this.productInfo.firstCategoryName : ''))
            }

        },
        watch:{
            '$route':'fetchData'
        },
        mounted() {
            this.fetchData();
        },
        beforeDestroy() {
            tinyMCE.editors["Editor"].destroy();
        },
        methods: {
            //新建运费模板
            handleNewFreight() {
                let _this = this;
                _this.$confirm('确定要跳转到运费模板配置吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$router.push('/freightTemplate');
                }).catch(e=>e);


            },
            //返回列表
            handleGoOrderList(){
                this.$router.push('/productList');
            },

            //url路径
            fetchData(){//url路径
                let id = this.$route.query.productId;
                this.modify = this.$route.query.modify||'';
                if(id){
                    this.getProductInfo(id)
                }else {
                    this.productInfo={
                        setTime:[],
                        id:'',
                        firstCategoryId: '',
                        secondCategoryId: '',
                        firstCategoryName: '',
                        secondCategoryName: '',
                        productName: '',
                        productSubtitle: '',
                        sort: 0,
                        isSchedule: false,//是否定时上下线 0 否 1是
                        planTime: '',//定时上架时间
                        expireTime: '',//定时下架时间
                        isLimit: false,//0：否 1：是
                        productLimit: undefined,
                        showDeliveryTime: 1,
                        showSafeguard: false,
                        promotions: [],
                        isRecommend: false,//是否推荐商品 0 否 1 是
                        status: "1",//0:待发布, 1:待上架, 2:已上架, 4:已过期, 9:已删除
                        parameter: '',
                        coverImgUrl: [],
                        thumbnailImgUrl:'',
                        posterImgUrl:'',
                        coverVideoUrl:'',
                        fareTemplateCode:'',
                    };
                    this.productNormList=[];
                    this.active=0,
                    this.loading=false,
                    this.modify='',
                    this.init();
                    tinyMCE.activeEditor.setContent(this.productInfo.parameter);
                    this.getCategoryList();
                    this.getFreightTemplateList();
                }
            },
            //富文本初始化
            init() {
                let _this = this;
                tinymce.init({
                    selector: "#Editor",
                    images_upload_handler: (blobInfo, success, failure) => {
                        let xhr, formData;
                        let queryDetailKey = _this.$baseURL+"/busi/admin/uploadFile/img";
                        xhr = new XMLHttpRequest();
                        xhr.withCredentials = true;
                        xhr.open("POST", queryDetailKey);
                        formData = new FormData();
                        formData.append("file", blobInfo.blob());
                        xhr.onload = function(e){
                            let json;
                            if (xhr.status != 200) {
                                failure('HTTP Error: ' + xhr.status);
                                return;
                            }
                            json = JSON.parse(this.responseText);

                            if (!json || typeof json.data != 'string') {
                                failure('Invalid JSON: ' + xhr.responseText);
                                return;
                            }
                            if(json.status === 0){
                                success(json.data);
                            }else {
                                handleStatus(_this,json.status,json.msg);
                            }
                        };
                        xhr.send(formData);
                    },
                    setup: function(editor) {
                        editor.on('input change undo redo execCommand KeyUp', function(e) {
                            _this.productInfo.parameter = editor.getContent()
                        })
                    },
                    branding: false,
                    elementpath: false,
                    width: "100%",
                    height: 500,
                    skin_url: `${process.env.BASE_URL}tinymce/skins/ui/oxide`,
                    language_url: `${process.env.BASE_URL}tinymce/zh_CN.js`,
                    language: "zh_CN",
                    menubar: "edit format table",
                    fontsize_formats:
                        "11px 12px 14px 16px 18px 24px 36px 48px",
                    lineheight_val: "0.5 1 1.5 1.6 1.75 1.8 2 3 4 5",
                    font_formats:
                        "微软雅黑='微软雅黑';宋体='宋体';黑体='黑体';仿宋='仿宋';楷体='楷体';隶书='隶书';幼圆='幼圆';Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings",
                    plugins: ["code lineheight wordcount print preview image","table"],
                    toolbar:
                        "lineheight | forecolor backcolor bold italic underline | fontsizeselect fontselect | alignleft aligncenter alignright alignjustify | image | code",
                    autosave_interval: "20s",
                    save_enablewhendirty: false,
                    image_advtab: true,
                    element_format: 'html',
                    table_default_styles: {
                        width: "100%",
                        height: "100%",
                        borderCollapse: "collapse"
                    }
                });
            },
            //删除规格
            handleDelNorm(val) {
                this.productNormList.splice(val,1);
            },
            //添加规格
            handleAddNorm() {
                let obj = {};
                obj=JSON.parse(JSON.stringify(normObj));
                this.productNormList.push(obj);
            },
            //删除规格属性
            handleDelAttr(i1,i2) {
                this.productNormList[i1].productAttrList.splice(i2,1);
            },
            //添加规格属性
            handleAddAttr(i1) {
                this.productNormList[i1].productAttrList.push({attrName:'',attrValue:''})
            },

            //图片上传判断类型大小
            beforeAvatarUpload(file) {
                this.loading=false;
                let isSize = isPicSize(this,file,this.headImgWidth,this.headHeight);
                return isSize;
            },
            //头图上传成功回调
            handleUplodeSuccess(response, file, fileList,val) {
                this.loading=false;
                if(response.status!==0){
                    handleStatus(this,response.status,response.msg);
                }
                if(val==='商品头图') {
                    this.productInfo.coverImgUrl.push({url:response.data});
                }else {
                    this.productNormList[val].productNorm.imgUrl.push({url:response.data});
                }
            },
            //头图删除
            handleRemoveHead(v1, v2) {
                if(v1==='商品头图') {
                    this.productInfo.coverImgUrl.splice(v2,1)
                }else {
                    this.productNormList[v1].productNorm.imgUrl.splice(v2,1)
                }
            },
            //缩略图判断图片类型
            beforeAvatarUploadHumbnail(file) {
                this.loading = false;
                let isSize = isPicSize(this,file,this.thumbnailImgWidth,this.thumbnailImgHeight);
                return isSize;
            },
            //缩略图成功回调
            handleUplodeSuccessHumbnail(response, file, fileList,val) {
                this.loading = false;
                if(response.status!==0){
                    handleStatus(this,response.status,response.msg);
                }
                if(val==='商品缩略图'){
                    this.productInfo.thumbnailImgUrl=response.data;
                }else {
                    this.productNormList[val].productNorm.thumbnailImgUrl=response.data;
                }
            },
            //删除缩略图
            handleRemoveHumbnail(val) {
                if(val==='商品缩略图') {
                    this.productInfo.thumbnailImgUrl = '';
                }else {
                    this.productNormList[val].productNorm.thumbnailImgUrl='';
                }
            },

            //海报图判断图片类型
            beforeAvatarUploadPoster(file) {
                this.loading = false;
                let isSize = isPicSize(this,file,this.posterImgWidth,this.posterImgHeight);
                return isSize;
            },
            //海报图成功回调
            handleUplodeSuccessPoster(response, file, fileList,val) {
                this.loading = false;
                if(response.status!==0){
                    handleStatus(this,response.status,response.msg);
                }
                if(val==='商品海报图'){
                    this.productInfo.posterImgUrl=response.data;
                }else {
                    this.productNormList[val].productNorm.posterImgUrl=response.data;
                }
            },
            //删除海报
            handleRemovePoster(val) {
                if(val==='商品海报图') {
                    this.productInfo.posterImgUrl = '';
                }else {
                    this.productNormList[val].productNorm.posterImgUrl='';
                }
            },

            //上传视频校验
            beforeAvatarUploadVideo(file) {
                const loading = this.$loading({
                    lock: true,
                    text: '视频上传中，请勿操作！',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.4)'
                });
                const isVideo = (file.type === 'video/mp4');
                const isLt = file.size / 1024 / 1024 < 100;
                if (!isVideo) {
                    loading.close();
                    this.$message.error('视频只能是 mp4 格式!');
                }
                if (!isLt) {
                    loading.close();
                    this.$message.error('视频大小不能超过 100MB!');
                }
                return isVideo && isLt;
            },
            //上传视频成功回调
            handleUplodeSuccessVideo(response, file, fileList,val) {
                this.$loading({}).close();
                if(response.status!==0){
                    handleStatus(this,response.status,response.msg);
                }
                this.productInfo.coverVideoUrl=response.data;
            },
            //删除视频
            handleRemoveVideo() {
                this.productInfo.coverVideoUrl = '';
            },

            handleIsLimit(val) {
                if (val === false) {
                    this.productInfo.productLimit = undefined;
                }
            },
            handleRadio(val) {
                if (val === false) {
                    this.$set(this.productInfo,'setTime',[]);
                }
            },

            //一级分类
            handleFirstSelectChange(val) {
                this.categoryList2 = [];
                this.productInfo.secondCategoryId = '';
                this.productInfo.firstCategoryName = '';
                this.productInfo.secondCategoryName = '';
                if (val) {
                    this.productInfo.firstCategoryName = this.categoryList1.filter(function (item) {
                        return item.id === val;
                    })[0].categoryName;
                    this.categoryList2 = this.categoryList.filter(function (item) {
                        return item.parentId===val;
                    })
                }

            },
            //二级分类
            handleSecondarySelectChange(val) {
                if (!val) {
                    this.productInfo.secondCategoryName = '';
                } else {
                    this.productInfo.secondCategoryName = this.categoryList2.filter(function (item) {
                        return item.id === val;
                    })[0].categoryName;
                }
            },
            //上一步
            prev() {
                if (this.active-- < 0) {this.active = 0};
            },
            //下一步
            next() {
                //获取富文本内容
                let index = this.active;
                if (index === 0) {
                    if (!this.productInfo.firstCategoryId) {
                        errorMess(this, 'error', '请选择一级分类');
                        return false;
                    }
                } else if (index === 1) {
                    if (!this.productInfo.productName) {
                        errorMess(this, 'error', '请输入商品名称');
                        return false;
                    }else if (!this.productInfo.productSubtitle) {
                        errorMess(this, 'error', '请输入副标题');
                        return false;
                    }else if (!this.productInfo.coverImgUrl||this.productInfo.coverImgUrl.length===0) {
                        errorMess(this, 'error', '请上传商品头图');
                        return false;
                    }else if (!this.productInfo.thumbnailImgUrl) {
                        errorMess(this, 'error', '请上传商品缩略图');
                        return false;
                    }else if (!this.productInfo.posterImgUrl) {
                        errorMess(this, 'error', '请上传商品海报图');
                        return false;
                    }else if (this.productInfo.sort===undefined) {
                        errorMess(this, 'error', '请输入排序');
                        return false;
                    }
                    const productNormListLength = this.productNormList.length;
                    if(productNormListLength === 0) {
                        let obj = {};
                        obj=JSON.parse(JSON.stringify(normObj));
                        this.productNormList.push(obj);
                    }

                } else if (index === 2) {
                    let errMesStr='';
                    let productNormList = this.productNormList;
                    if(!productNormList||productNormList.length===0){
                        errorMess(this, 'error', '至少添加一个库存规格！');
                        return false;
                    }else {
                        for(let item of productNormList){
                            if(!item.productNorm.normName){
                                errMesStr='请输入规格名称！';
                                break;
                            }else if(!item.productNorm.imgUrl||item.productNorm.imgUrl.length===0){
                                errMesStr='请上传规格主图！';
                                break;
                            }else if(!item.productNorm.thumbnailImgUrl){
                                errMesStr='请上传规格缩略图！';
                                break;
                            }else if(!item.productNorm.posterImgUrl){
                                errMesStr='请上传规格海报图！';
                                break;
                            }else if(item.productNorm.price===''||item.productNorm.price===undefined){
                                errMesStr='请输入规格价格！';
                                break;
                            }else if(item.productNorm.marketPrice===''||item.productNorm.marketPrice===undefined){
                                errMesStr='请输入规格划线价！';
                                break;
                            }else if(item.productNorm.price>item.productNorm.marketPrice){
                                errMesStr='实际售卖价格不能高于商品原价！';
                                break;
                            }else if(item.productNorm.sku===''||item.productNorm.sku===undefined){
                                errMesStr='请输入规格库存！';
                                break;
                            }else if(!item.productAttrList||item.productAttrList.length===0) {
                                errMesStr='请添加规格属性！';
                                break;
                            }else if(item.productAttrList.length>0) {
                                for(let itemAttr of item.productAttrList){
                                    if(!itemAttr.attrName||!itemAttr.attrValue){
                                        errMesStr='请输入规格属性名称或输入规格属性值！';
                                        break;
                                    }
                                }

                            }

                        }
                    }

                    if (errMesStr) {
                        errorMess(this, 'error', errMesStr);
                        return false;
                    }
                } else if (index === 3) {
                    if (!this.productInfo.parameter) {
                        errorMess(this, 'error', '请添加参数详情！');
                        return false;
                    }
                }
                if (this.active++ > 4) this.active = 0;
            },
            //商品保存
            save() {
                let _this = this;
                let url = productAddIF;//新建
                let productInfo = {};
                productInfo=JSON.parse(JSON.stringify(_this.productInfo));
                let productNormList = {};
                productNormList=JSON.parse(JSON.stringify(_this.productNormList));
                let params = {
                    productInfo:{
                        id:productInfo.id,
                        categoryId:productInfo.secondCategoryId||productInfo.firstCategoryId,
                        productName:productInfo.productName,
                        productSubtitle:productInfo.productSubtitle,
                        sort:productInfo.sort,
                        isSchedule:productInfo.isSchedule,
                        planTime:productInfo.setTime&&productInfo.setTime.length>0&&productInfo.setTime[0]||'',
                        expireTime:productInfo.setTime&&productInfo.setTime.length>0&&productInfo.setTime[1]||'',
                        isLimit:productInfo.isLimit,
                        productLimit:productInfo.productLimit,
                        showDeliveryTime:productInfo.showDeliveryTime,
                        showSafeguard:productInfo.showSafeguard?1:0,
                        promotions:JSON.stringify(productInfo.promotions),
                        isRecommend:productInfo.isRecommend,
                        status:productInfo.status,
                        parameter:productInfo.parameter,
                        coverImgUrl:JSON.stringify(productInfo.coverImgUrl),
                        thumbnailImgUrl:productInfo.thumbnailImgUrl,
                        posterImgUrl:productInfo.posterImgUrl,
                        coverVideoUrl:productInfo.coverVideoUrl,
                        fareTemplateCode:productInfo.fareTemplateCode,
                    },
                    productNormList:productNormList
                };
                if (params.productInfo.isLimit) {
                    if(!params.productInfo.productLimit){
                        errorMess(_this, 'error', '请填写限购数量，只能大于0！');
                        return false;
                    }
                }else {
                    params.productInfo.productLimit=null
                }
                if (!params.productInfo.fareTemplateCode) {
                    errorMess(_this, 'error', '请选择运费模板！');
                    return false;
                }
                if(params.productNormList.length>0){
                    for (let i=0 ;i<params.productNormList.length;i++) {
                        params.productNormList[i].productNorm.imgUrl=JSON.stringify(params.productNormList[i].productNorm.imgUrl);
                        if(!params.productNormList[i].productNorm.id){
                            delete params.productNormList[i].productNorm.id;
                        }
                    }
                }
                if(!productInfo.id){
                    delete params.productInfo.id
                }else {
                    url = productEditIF;
                }
                _this.$post(url,params).then(res=>{
                    if(res.status === 0){
                        _this.$message({
                            type: "success",
                            message: '保存成功！'
                        });
                        setTimeout(function () {
                            _this.$router.push({path:'/productList'});
                        },1000);
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });

            },

            //获取模板数据
            getFreightTemplateList(){
                let _this = this;
                _this.$get(adminFreightListIF).then(res => {
                    if(res.status === 0){
                        _this.freightTemplateList = res.data&&res.data.length>0
                            ?res.data.map(function (item) {
                                return{
                                    name:item.templateName,
                                    value:item.templateCode
                                }
                            }):[];
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },

            getCategoryList() {//获取分类数据
                let _this = this;
                _this.$get(categoryListIF).then(res => {
                    if(res.status === 0){
                        _this.categoryList = res.data;
                        _this.categoryList1 = _this.categoryList.filter(function (item) {
                            return item.parentId==='';
                        });
                        if(_this.productInfo.firstCategoryId){
                            _this.categoryList2 = _this.categoryList.filter(function (item) {
                                return item.parentId===_this.productInfo.firstCategoryId;
                            })
                        }
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                });
            },

            getProductInfo(productId) {
                let _this = this;
                let params = {
                    productId:productId,
                }
                _this.$get(productViewIF,params).then(res => {
                    if(res.status === 0){
                        _this.productInfo = res.data.productInfo;
                        _this.productInfo.coverImgUrl=JSON.parse(_this.productInfo.coverImgUrl);
                        _this.productInfo.showSafeguard=_this.productInfo.showSafeguard==1?true:false;
                        _this.productInfo.productLimit=_this.productInfo.isLimit?_this.productInfo.productLimit:undefined;
                        _this.productInfo.promotions=!_this.productInfo.promotions?[]:JSON.parse(_this.productInfo.promotions);

                        if(_this.productInfo.planTime&&_this.productInfo.expireTime){
                            _this.$set(_this.productInfo,'setTime',[_this.productInfo.planTime,_this.productInfo.expireTime])
                        }else {
                            _this.$set(_this.productInfo,'setTime',[]);
                        }
                        _this.productNormList = res.data.productNormList;
                        if(_this.productNormList.length>0) {
                            for (let i = 0; i < _this.productNormList.length; i++) {
                                _this.productNormList[i].productNorm.imgUrl = JSON.parse(_this.productNormList[i].productNorm.imgUrl);
                            }
                        }
                        _this.init();
                        tinyMCE.activeEditor.setContent(_this.productInfo.parameter);
                        _this.getCategoryList();
                        _this.getFreightTemplateList();
                    }else {
                        handleStatus(_this,res.status,res.msg);
                    }
                }).catch(err =>{
                    //console.log(err);
                });
            }
        },
    }
</script>

<style scoped>
    .wrapper {
        position: relative;
    }
    .steps-box {
        margin: 20px 0;
    }

    .wrapper >>> .el-step__title {
        font-size: 14px;
    }

    .btn-box {
        text-align: center;
        margin-bottom: 30px;
    }

    .btn-box button {
        margin: 0 40px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: none;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
    }

    .btn-box button.next-btn, .btn-box button.save-btn {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
    }

    .btn-box button:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }

    .btn-box button.next-btn:hover, .btn-box button.save-btn:hover {
        background: #66b1ff;
        border-color: #66b1ff;
        color: #FFF;
    }

    .content-div {
        margin: 40px;
        font-size: 14px;
    }

    .title {
        display: block;
        padding: 10px 0 10px 5px;
        background: rgb(121, 187, 255);
        color: #fff;
        font-size: 14px;
    }

    .wrapper >>> .el-step__icon {
        width: 30px;
        height: 30px;
    }

    .wrapper >>> .el-step__icon.is-text {
        border: 1px solid
    }

    .wrapper >>> .el-step__icon-inner {
        font-weight: 500;
    }
    .img-url-box,.video-url-box {
        margin-left: 11.5%;
    }
    .img-url-item {
        display: inline-block;
        width: 200px;
        margin: 10px;
        position: relative;
        padding: 10px;
        cursor: pointer;
    }
    .img-thumbnail-url-item {
        display: inline-block;
        width: 130px;
        margin: 10px;
        position: relative;
        padding: 10px;
        cursor: pointer;
    }
    .img-poster-url-item {
        display: inline-block;
        width: 165px;
        margin: 10px;
        position: relative;
        padding: 10px;
        cursor: pointer;
    }
    .video-url-item {
        display: inline-block;
        margin: 10px;
        position: relative;
        padding: 10px;
        cursor: pointer;
    }
    .video-url {
        max-width: 300px;
        max-height: 200px;
    }
    .img-url-item .el-icon-close,
    .img-thumbnail-url-item .el-icon-close,
    .img-poster-url-item .el-icon-close,
    .video-url-item .el-icon-close {
        position: absolute;
        top: 4px;
        right: -4px;
        display: none
    }
    .img-url-item:hover i.el-icon-close,
    .img-thumbnail-url-item:hover i.el-icon-close,
    .img-poster-url-item:hover i.el-icon-close,
    .video-url-item:hover i.el-icon-close{
        display: block;
    }
    .img-url {
        width: 195px;
        height: 100px;
    }
    .img-thumbnail-url {
        width: 125px;
        height: 100px;
    }
    .img-poster-url {
        width: 160px;
        height: 100px;
    }

    .grounding-time-box > span {
        display: inline-block;
        margin: 0 10px;
    }
    .item-row {
        margin-bottom: 15px;
    }
    .left-side {
        text-align: right;
        font-size: 13px;
        margin-top: 6px;
    }
    .inp-item {
        width: 300px;
        margin-left: 20px;

    }
    .attr-wrapper {
        max-height: 250px;
        overflow-y: auto;
        width: 500px;
    }
    .attr-box {
        position: relative;
        width:430px;
        margin-bottom: 10px;
        padding: 10px;
    }
    .attr-del {
        display: inline-block;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        font-size: 18px;
    }
    .attr-box>.item-row>span {
        display: inline-block;
        width: 60px;
        text-align: right;
        font-size: 13px;
        margin-top: 6px;
    }
    .attr-del:hover{
        color: #5cb6ff;
    }
</style>