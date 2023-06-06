<template>
  <div class="mainView">
    <div id="wrapper">
      <div class="center">
        <el-descriptions class="desc" column="5">
          <el-descriptions-item label="服务器人数" align="center"
            >{{ currentPlayerCount }}/{{
              totalPlayerCount
            }}</el-descriptions-item
          >
          <el-descriptions-item label="在线服务器" align="center"
            >{{ onlineServer }}/{{ totalServer }}</el-descriptions-item
          >
          <el-descriptions-item label="QQ群" align="center"
            >2719813</el-descriptions-item
          >
          <el-descriptions-item align="center"
            ><el-button
              type="success"
              class="elbtn"
              round
              @click="refreshTableData"
              >刷新列表</el-button
            ></el-descriptions-item
          >
          <el-descriptions-item align="center"
            ><el-button type="success" class="elbtn" round @click="joinQQGroup"
              >加入群聊</el-button
            ></el-descriptions-item
          >
        </el-descriptions>

        <el-descriptions size="large">
          <el-descriptions-item label-align="center">
            <el-radio-group
              v-model="gameMode"
              @change="changeGameMode"
              size="large"
              class=""
            >
              <el-radio-button label="战役" />
              <div
                style="
                  width: 1px;
                  height: 38px;
                  background-color: rgb(64, 158, 255);
                "
              ></div>
              <el-radio-button label="对抗" />
            </el-radio-group>
            <OpenAddon class="OpenAddon"></OpenAddon>
          </el-descriptions-item>
        </el-descriptions>
        <el-table
          :data="filterTableData"
          stripe
          border
          class="serverList"
          :default-sort="{ prop: 'players', order: 'descending' }"
        >
          <el-table-column fixed prop="name" label="服务器名" min-width="120" />
          <el-table-column prop="url" label="地址" v-if="showUrl" />
          <el-table-column prop="map" label="当前地图" min-width="100" />
          <el-table-column
            label="人数"
            prop="players"
            sortable
            :custom="true"
            min-width="60"
          >
            <!-- 自定义插槽 -->
            <template #default="{ row }">
              <el-tag>
                <span>{{ row.players }}</span>
                <span>/</span>
                <span>{{ row.maxPlayers }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="times" label="延迟" sortable min-width="50">
            <template #default="scope">
              <el-tag :type="timesTagType(scope.row.times)">
                {{ scope.row.times }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template #default="{ row }">
              <el-button type="primary" class="elbtn" @click="joinServer(row)"
                >加入服务器</el-button
              >
              <el-button type="info" class="elbtn" @click="showServerInfo(row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          v-model="dialogVisible"
          :before-close="handleClose"
          title="服务器信息"
          width="50%"
        >
          <div v-if="serverInfo" style="margin: 0px 0 10px 20px">
            <p>名称：{{ serverInfo.name }}</p>
            <p>地图：{{ serverInfo.map }}</p>
            <p>人数：{{ serverInfo.players }}/{{ serverInfo.maxPlayers }}</p>
            <p>延迟：{{ serverInfo.nowPing }}</p>
          </div>
          <el-table
            v-if="serverInfo"
            :data="tablePlayer"
            border
            style="width: auto"
          >
            <el-table-column fixed prop="name" label="玩家" />
            <el-table-column prop="score" label="比分" />
            <el-table-column prop="duration" label="时间" />
          </el-table>
          <span v-else>加载中...</span>
        </el-dialog>
      </div>
    </div>
    <Time class="addTime"></Time>
  </div>
</template>

<script lang="ts" setup>
import { getServerList, getPlayers } from "../api/l4d2";
import {
  ElMessage,
  ElTable,
  ElTableColumn,
  ElDialog,
  ElButton,
  ElTag,
  ElDescriptions,
  ElDescriptionsItem,
  ElRadioButton,
  ElRadioGroup,
} from "element-plus";
import Time from "./common/Time.vue";
import OpenAddon from "./common/OpenAddon.vue";
import { reactive, onMounted, ref, onUnmounted } from "vue";
const { ipcRenderer, shell } = require("electron");
const { Server } = require("@fabricio-191/valve-server-query");

const tableData = reactive([]);
let filterTableData = reactive([]);
let tablePlayer = reactive([]);
let currentPlayerCount = ref(0);
let totalPlayerCount = ref(0);
let onlineServer = ref(0);
let totalServer = ref(0);
let serverInfo = ref(null);
let dialogVisible = ref(false);
let showUrl = ref(false);
let key = [0, 0];
let gameMode = ref("战役");
onMounted(async () => {
  refreshTableData();
  ipcRenderer.invoke("hot-update");
});

if (localStorage.backgroundImageURL) {
  document.body.style.backgroundImage = `url(${localStorage.backgroundImageURL})`;
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundSize = "cover";
}

// ctrl和u显示服务器地址
window.addEventListener("keydown", (event) => {
  if (event.code === "ControlLeft") key[0] = 1;
  if (event.code === "KeyU") key[1] = 1;
  if (key[0] === 1 && key[1] === 1) {
    showUrl.value === true ? (showUrl.value = false) : (showUrl.value = true);
  }
});
window.addEventListener("keyup", (event) => {
  if (event.code === "ControlLeft") key[0] = 0;
  if (event.code === "KeyU") key[1] = 0;
});

window.addEventListener("resize", () => {
  let domhei: HTMLElement = document.querySelector(".serverList");
  domhei.style.height = (window.innerHeight - 180).toString() + "px";
});
// 定义刷新表格数据的方法
function refreshTableData() {
  getServerList()
    .then((res) => {
      // console.log(res.data);
      onlineServer.value = res.data.list.length;
      totalServer.value = res.data.total;
      currentPlayerCount.value = res.data.list.reduce((total, item) => {
        return total + item.players;
      }, 0);
      totalPlayerCount.value = res.data.list.reduce((total, item) => {
        return total + item.maxPlayers;
      }, 0);
      res.data.list.forEach(async (element) => {
        let addr = element.url.split(":");
        let server = await Server({
          ip: addr[0],
          port: Number(addr[1]),
          timeout: 2000,
        });
        element.times = server.lastPing;
      });
      tableData.splice(0, tableData.length, ...res.data.list); // 使用扩展运算符替换表格数据，而不是给表格数据重新赋值
      let mode = gameMode.value === "战役" ? 1 : 2;
      filterTableData.splice(
        0,
        filterTableData.length,
        ...tableData.filter((row) => row.type === mode)
      );
      ElMessage({
        type: "success",
        message: "刷新列表成功",
      });
    })
    .catch((err) => {
      console.error(err);
      ElMessage({
        type: "error",
        message: "刷新列表失败，请联系管理员",
      });
    });
}

function changeGameMode(value) {
  refreshTableData();
  let mode = value === "战役" ? 1 : 2;
  filterTableData.splice(
    0,
    filterTableData.length,
    ...tableData.filter((row) => row.type === mode)
  );
}

function showServerInfo(row) {
  getPlayers({ url: row.url })
    .then(async (res) => {
      serverInfo = {
        name: row.name,
        map: row.map,
        players: row.players,
        maxPlayers: row.maxPlayers,
        nowPing: 0,
      };
      let addr = row.url.split(":");
      let server = await Server({
        ip: addr[0],
        port: Number(addr[1]),
        timeout: 2000,
      });
      serverInfo.nowPing = server.lastPing;
      tablePlayer.splice(0, tablePlayer.length, ...res.data.players);
      dialogVisible.value = true;
    })
    .catch((err) => {
      console.error(err);
      ElMessage({
        type: "error",
        message: "查询失败，请联系管理员",
      });
    });
}

function joinServer(row) {
  let url = `steam://connect/${row.url}`;
  shell.openExternal(url);
}

function handleClose() {
  dialogVisible.value = false;
}

// 计算属性，用来动态设置el-tag的type属性
const timesTagType = (times) => {
  return times > 40 ? "danger" : "success";
};

function joinQQGroup() {
  shell.openExternal(
    "https://qm.qq.com/cgi-bin/qm/qr?k=a0gzjDW6QnWlzus-9M6S2jsLV_a0bvTn&jump_from=webapi&authKey=kkHv2DtSZ8jxdyaw+GbKomHzQIvcbJHQ63kruh5NkI9uqkJBdJPdp4vJRBLOo5eT"
  );
}

ipcRenderer.on("hot-update-status", (event, msg) => {
  switch (msg.status) {
    case "downloading":
      ElMessage("检测到新版本，正在更新");
      break;
    case "moving":
      // ElMessage("正在移动文件");
      break;
    case "finished":
      ElMessage.success("更新成功,请重启");
      break;
    case "failed":
      ElMessage.error(msg.message.message);
      break;
    default:
      break;
  }
});
onUnmounted(() => {
  ipcRenderer.removeAllListeners("hot-update-status");
});
</script>

<style lang="scss" scoped>
table {
  background-color: none !important;
}
.mainView {
  min-width: 1000px;
  display: flex;
  height: 100%;
  overflow-x: hidden;
  #wrapper {
    display: flex;
    flex: 78;
    padding: 40px 15px 15px 20px;
    min-width: 760px;
    width: 100%;
    position: relative;
  }
  .addTime {
    flex: 22;
    min-width: 220px;
    width: 100%;
  }
}
.center {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 10px;
}
.serverList {
  height: 550px;
  border-radius: 6px;
  border: none;
}
tr {
  border: none;
  th {
    border: none;
  }
}
.el-table--border::after {
  background-color: none !important;
}
.elbtn:focus {
  outline: none;
}
.OpenAddon {
  float: right;
}
</style>
