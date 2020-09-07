<template>
  <div id="app">
    <!--<keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        &lt;!&ndash; 这里是会被缓存的视图组件，比如 page1,page2 &ndash;&gt;
      </router-view>
    </keep-alive>-->

    <router-view>
      <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>
  </div>
</template>

<style lang="less">
#app {
  font-family: "微软雅黑";
  color: #333333;
}

body .el-table th.gutter{
  display: table-cell!important;
}
</style>
