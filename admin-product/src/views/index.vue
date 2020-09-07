<template>
    <div class="wrapper-box">
        <Header></Header>
        <el-container style="height: 100%;">
            <el-aside style="width: 200px;background: rgb(50, 64, 87);overflow: auto;">
                <LeftMenu></LeftMenu>
            </el-aside>
            <el-main class="el-main-box">
                <div class="content">
                    <router-view/>
                </div>
            </el-main>
        </el-container>

    </div>
</template>

<script>

    import Header from "../components/Header";
    import LeftMenu from "../components/LeftMenu";
    export default {
        name: "index",
        data(){
           return {}
        },
        components: {
            Header,
            LeftMenu
        },
    }
</script>

<style scoped lang="less">
    .wrapper-box{
        font-size: 20px;
        height: 100%;
    }
    .el-main-box {
        margin-bottom: 60px;
    }
</style>