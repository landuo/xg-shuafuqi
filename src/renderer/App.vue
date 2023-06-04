<template>
  <title-bar />
  <el-config-provider :locale="i18nt">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed} from "vue";
import { ElConfigProvider } from "element-plus";
import { i18n } from "./i18n";
import TitleBar from "./components/common/TitleBar.vue";
import byMessage from './assets/byMessage.js'
const { ipcRenderer } = require('electron');
let clear = [0, 0]
const i18nt = computed(() => i18n.global.messages.value[i18n.global.locale.value].$el);
// ctrl和p清除浏览器缓存并重启

window.addEventListener('keydown', event => {
    if (event.code === 'ControlLeft') clear[0] = 1
    if (event.code === 'KeyP') clear[1] = 1
    if (clear[0] === 1 && clear[1] === 1)  {
      clearClose()
    }})
    window.addEventListener('keyup', event => {
    if (event.code === 'ControlLeft') clear[0] = 0
    if (event.code === 'KeyP') clear[1] = 0
    })

    async function  clearClose() {
    window.localStorage.clear()
    const restart= await byMessage.alert('清除缓存成功，请手动重启程序。')
    if(restart===true){ipcRenderer.invoke("window-close")}
    }

</script>

<style scoped>

</style>
