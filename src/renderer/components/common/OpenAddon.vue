<template>
  <div class="flex flex-wrap items-center addonLink">
    <el-dropdown
      class="addonbtn"
      split-button="true"
      trigger="click"
      size="large"
      @click="handleClick()"
    >
      addon
      <template #dropdown>
        <el-dropdown-menu class="downmenu">
          游戏根目录路径：
          <input v-model="addonLink" type="text" />
          路径错误无法打开文件夹
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { ElDropdown, ElDropdownMenu } from "element-plus";
import { ref, watch } from "vue";
const { shell } = require("electron");
let addonLink = ref("");
const linkEnd = "\\left4dead2\\addons\\workshop";

localStorage.addonLink
  ? (addonLink.value = localStorage.addonLink)
  : (addonLink = ref(
      "例：D:\\Program Files (x86)\\Steam\\steamapps\\common\\Left 4 Dead 2"
    ));

watch(addonLink, (oldVal, newVal) => {
  localStorage.addonLink = addonLink.value;
});
const handleClick = () => {
  shell.showItemInFolder(addonLink.value + linkEnd);
};
</script>
<style lang="scss" scoped>
.addonLink {
  height: 38px;

  .addonbtn {
    background-color: var(--bingyu-color-btn2);
    height: 38px;
  }
}
.downmenu {
  text-align: center;
  color: var(--bingyu-color-text1);
  background-color: var(--bingyu-color-bg4);
  border: none;
  border-radius: 4px;
  input {
    display: block;
    background-color: rgba(100 100 100/50%);
    color: var(--bingyu-color-text1);
    outline: none;
    border: none;
    height: 30px;
    margin: 0 1rem;
    border-radius: 4px;
    min-width: 400px;
  }
}
</style>
