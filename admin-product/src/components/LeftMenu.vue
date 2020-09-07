<template>
    <div class="sidebar">
        <el-row class="menu_page">
            <el-col>
                <el-menu
                        :unique-opened="true"
                        mode="vertical"
                        class="el-menu-vertical-demo"
                        :collapse="collapse"
                        :default-active="$route.path"
                        background-color="#324057"
                        text-color="#fff">
                    <Menu :items='items'/>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Menu from "./Menu";

    export default {
        name: "LeftMenu",
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: "el-icon-shopping-bag-1",
                        name: "商品管理",
                        path: "/product",
                        children: [
                            {
                                path: "/productList",
                                name: "商品列表",
                            },
                            {
                                path: "/productRelease",
                                name: "商品配置"
                            },
                            {
                                path: "/classifyList",
                                name: "分类列表"
                            }

                        ]
                    },
                    {
                        icon: "el-icon-picture-outline",
                        path: "/rotationChart",
                        name: "首页轮播图",
                        children: [
                            {
                                path: "/rotationChartList",
                                name: "首页轮播图列表",
                            },
                            {
                                path: "/rotationChartDispose",
                                name: "首页轮播图配置",
                            }
                        ]
                    },
                    {
                        icon: "el-icon-shopping-cart-full",
                        name: "库存管理",
                        path: "/stock",
                        children: [
                            {
                                path: "/stockList",
                                name: "库存列表",
                            }
                        ]
                    },
                    {
                        icon: "el-icon-document",
                        name: "订单管理",
                        path: "/order",
                        children: [
                            {
                                path: "/orderList",
                                name: "订单列表",
                            }
                        ]
                    },
                    {
                        icon: "el-icon-tickets",
                        name: "运单管理",
                        path: "/freight",
                        children: [
                            {
                                path: "/waybillList",
                                name: "运单列表",
                            },
                            {
                                path: "/freightList",
                                name: "运费列表",
                            },
                            {
                                path: "/freightTemplate",
                                name: "运费模板",
                            }
                        ]
                    },
                    {
                        icon: "el-icon-notebook-2",
                        name: "售后管理",
                        path: "/afterSales",
                        children: [
                            {
                                path: "/afterSalesList",
                                name: "售后列表",
                            }
                        ]
                    },
                    {
                        icon: "el-icon-edit-outline",
                        name: "评价管理",
                        path: "/evaluate",
                        children: [
                            {
                                path: "/evaluateList",
                                name: "评价列表",
                            },
                            {
                                path: "/sensitiveWordsList",
                                name: "敏感词管理",
                            },
                        ]
                    },
                    {
                        icon: "el-icon-setting",
                        name: "系统管理",
                        path: "/system",
                        children: [
                            {
                                name: "用户管理",
                                path: "/user",
                                children: [
                                    {
                                        path: "/userList",
                                        name: "用户列表",
                                    },
                                    {
                                        path: "/userRelease",
                                        name: "用户配置",
                                    },

                                ]
                            },
                            {
                                path: "/resetPassword",
                                name: "重置密码",
                            },
                            /*{
                                path: "role",
                                name: "角色管理",
                                children: [
                                    {
                                        path: "/roleList",
                                        name: "角色列表",
                                    },
                                    {
                                        path: "/roleRelease",
                                        name: "角色配置",
                                    },

                                ]
                            },*/
                            {
                                path: "/customerList",
                                name: "客户管理",
                            },
                        ]
                    },
                ]
            };
        },
        components: {
            Menu
        },
        methods: {
            initScroll() {
                /*this.scroll = new Bscroll(this.$refs.wrapper, {
                })*/
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initScroll()
            })
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            /*bus.$on("collapse", msg => {
              this.collapse = msg;
            });*/
        }
    };
</script>
<style scoped>
.sidebar {
    width: 180px;
}
</style>

