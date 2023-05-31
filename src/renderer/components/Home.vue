<template>
  <div id="wrapper">
    <div class="center">
      <div><el-text class="title" type="success">香锅云服务器</el-text></div>
      <el-row>
        <el-col :span="6">
          <el-statistic :value="1509343481" group-separator="" title="香锅QQ" />
        </el-col>
        <el-col :span="6">
          <el-statistic :value="currentPlayerCount">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                服务器人数
              </div>
            </template>
            <template #suffix>/{{ totalPlayerCount }}</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="onlineServer">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                在线服务器
              </div>
            </template>
            <template #suffix>/{{ totalServer }}</template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="null">
            <template #title>
              <div style="display: inline-flex; align-items: center">
                <el-button type="success" round @click="refreshTableData"
                  >刷新列表</el-button
                >
              </div>
            </template>
            <!-- <template #suffix>/20</template> -->
          </el-statistic>
        </el-col>
      </el-row>

      <div style="margin-bottom: 10px">
        <el-radio-group
          v-model="gameMode"
          @change="changeGameMode"
          size="large"
        >
          <el-radio-button label="战役" />
          <el-radio-button label="对抗" />
        </el-radio-group>
      </div>
      <el-table
        :data="filterTableData"
        stripe
        border
        height="500"
        style="width: auto"
        :default-sort="{ prop: 'players', order: 'descending' }"
      >
        <el-table-column fixed prop="name" label="服务器名" min-width="200" />
        <el-table-column prop="url" label="地址" v-if="false" />
        <el-table-column prop="map" label="当前地图" min-width="180" />
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
            <el-button type="primary" @click="joinServer(row)"
              >加入服务器</el-button
            >
            <el-button type="info" @click="showServerInfo(row)">详情</el-button>
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
</template>
  
<script lang="ts" setup>
import { getServerList, getPlayers } from "../api/l4d2";
import { ElMessage } from "element-plus";
import { reactive, onMounted, ref, computed, watch } from "vue";
const { shell } = require("electron");
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
let gameMode = ref("战役");

onMounted(async () => {
  refreshTableData();
});

// 定义刷新表格数据的方法
function refreshTableData() {
  getServerList()
    .then((res) => {
      onlineServer.value = res.data.list.length;
      totalServer.value = res.data.total;
      currentPlayerCount.value = res.data.list.reduce((total, item) => {
        return total + item.players;
      }, 0);
      totalPlayerCount.value = res.data.list.reduce((total, item) => {
        return total + item.maxPlayers;
      }, 0);

      tableData.splice(0, tableData.length, ...res.data.list); // 使用扩展运算符替换表格数据，而不是给表格数据重新赋值
      tableData.forEach(async (element) => {
        let addr = element.url.split(":");
        let server = await Server({
          ip: addr[0],
          port: Number(addr[1]),
          timeout: 2000,
        });
        element.times = server.lastPing;
      });
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
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: "Source Sans Pro", sans-serif;
}
.title {
  font-size: xx-large;
}
#wrapper {
  padding: 30px 20px 20px 20px;
}

.el-row {
  text-align: center;
  margin: 10px 0;
}
.el-statistic__head {
  font-size: larger;
}
.delay-time {
  color: red !important;
}
.el-dialog .el-dialog__header {
  text-align: center;
}
</style>
