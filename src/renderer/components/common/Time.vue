<template>
  <div class="add">
    <!-- 色彩修改页面 -->
    <div class="colorIndex" v-show="show">
      <ul class="colorul">
        <li v-for="(one, index) in morecolor" :key="index" class="colorli">
          <div class="colorname">{{ one.name }}:</div>
          <div class="colorrgba">
            <div>
              R:<input
                class="rgba"
                type="number"
                v-model="one.R"
                min="0"
                max="255"
                oninput="if(value<0)value=0;if(value>255)value=255"
              />
              B:<input
                class="rgba"
                type="number"
                v-model="one.B"
                min="0"
                max="255"
                oninput="if(value<0)value=0;if(value>255)value=255"
              />
            </div>
            <div>
              G:<input
                class="rgba"
                type="number"
                v-model="one.G"
                min="0"
                max="255"
                oninput="if(value<0)value=0;if(value>255)value=255"
              />
              A:<input
                class="rgba"
                type="number"
                v-model="one.A"
                min="0"
                max="100"
                oninput="if(value<0)value=0;if(value>100)value=100"
              />
            </div>
          </div>
        </li>
        <li v-for="(one, index) in filter" :key="index" class="colorli">
          <div class="filtername">{{ one.name }}:</div>
          <div class="filrbval">
            <div>
              <input
                class="filinp"
                type="number"
                v-model="one.value"
                min="0"
                max="100"
                oninput="if(value<0)value=0;if(value>100)value=100"
              />
            </div>
          </div>
        </li>
      </ul>
      <ButtonBg class="getimg"></ButtonBg>
      <div class="colorbtn" @click="notShowColor()">关闭</div>
      <div class="colorbtn" @click="clearColor()">清除样式</div>
    </div>

    <div id="addtime" class="addtime nootnull">
      <!-- 设置与白黑风格转换 -->
      <div class="colorStyle">
        <div class="btn" @click="changeBW()">亮白/雅黑</div>
        <div class="config" @click="showColor()">
          <el-icon class="configicon"><Tools class="tool" /></el-icon>
        </div>
      </div>

      <!-- 问好与时间 -->
      <h2 class="me-h2">{{ good[goodi] }}</h2>
      <h3 class="timeear">现在是北京时间：</h3>
      <h3 class="me-time-h3">
        <span class="hhh">{{ h }}</span
        >:<span class="mmm">{{ m }}</span
        >:<span class="sss">{{ s }}</span>
      </h3>

      <!-- 对抗要领 -->
      <ul class="me-ul">
        <li class="me-li1">对抗要领</li>
        <li class="me-li">秒妹给药，胆汁贴脸;</li>
        <li class="me-li">瞎眼黑枪，踩痰救人;</li>
        <li class="me-li">无事跳楼，克局跑分;</li>
        <li class="me-li">机枪秒妹，绿血恰药;</li>
        <li class="me-li">进场问包，女人狂笑;</li>
        <li class="me-li">口水先活，胖子炸控;</li>
        <li class="me-li">跳海HT，打铁AI;</li>
        <li class="me-li">牛抢猴子，空拳坦克;</li>
        <li class="me-li">按C骂人，按X嘲讽;</li>
        <li class="me-li">狂妄至极，扬言单挑;</li>
        <li class="me-li">不堪受辱，中途退出;</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElIcon } from "element-plus";
import { Tools } from "@element-plus/icons-vue";
import { ref, reactive, watch, onMounted } from "vue";
import ButtonBg from "./ButtonBg.vue";
import byMessage from "../../assets/byMessage.js";
import { objectMethod } from "@babel/types";
const { ipcRenderer } = require("electron");
let goodi = 0;
const good = ["夜晚好", "早上好", "中午好", "下午好", "晚上好"];
let h = ref(0);
let m = ref(0);
let s = ref(0);
let bw = 1;
let show = ref(false);
const color = [
  "--bingyu-color-bg1",
  "--bingyu-color-bg2",
  "--bingyu-color-bg3",
  "--bingyu-color-bg4",
  "--bingyu-color-text1",
  "--bingyu-color-text2",
  "--bingyu-color-text3",
  "--bingyu-color-btn1",
  "--bingyu-color-btn2",
  "--bingyu-color-btn3",
  "--bingyu-color-btn1-hover",
  "--el-border-color-lighter",
  "--el-fill-color-light",
];
let morecolor = reactive([
  { name: "MainView", R: 2, G: 2, B: 2, A: 23 },
  { name: "大表格bg", R: 40, G: 40, B: 40, A: 23 },
  { name: "表格bg", R: 31, G: 31, B: 31, A: 23 },
  { name: "弹窗bg", R: 0, G: 0, B: 0, A: 90 },
  { name: "text1", R: 230, G: 230, B: 230, A: 23 },
  { name: "text2", R: 230, G: 230, B: 230, A: 23 },
  { name: "text3", R: 230, G: 230, B: 230, A: 23 },
  { name: "btn1", R: 50, G: 50, B: 50, A: 23 },
  { name: "btn2", R: 50, G: 50, B: 50, A: 23 },
  { name: "btn3", R: 50, G: 50, B: 50, A: 23 },
  { name: "btn:h", R: 100, G: 100, B: 100, A: 23 },
  { name: "border", R: 40, G: 40, B: 40, A: 23 },
  { name: "table:h", R: 40, G: 40, B: 40, A: 23 },
]);

let filter = reactive([
  { class: ".center", name: "左栏模糊", value: 0 },
  { class: ".addtime", name: "右栏模糊", value: 0 },
]);

window.addEventListener("resize", () => {
  let domhei: HTMLElement = document.querySelector(".colorIndex");
  domhei.style.height = (window.innerHeight - 30).toString() + "px";
});
getNowTime();
setInterval(() => {
  getNowTime();
}, 1000);

onMounted(() => {
  changebw();
});
// 监视色彩改变
for (let i = 0; i < filter.length; i++) {
  watch(reactive(filter[i]), (newVal, oldVal) => {
    if (newVal.value.toString() == "") filter[i].value = 0;
    (
      document.querySelector(filter[i].class) as HTMLElement
    ).style.backdropFilter = "blur(" + filter[i].value * 0.1 + "px)";
    for (let i = 0; i < filter.length; i++) {
      localStorage.setItem(filter[i].class, filter[i].value.toString());
    }
  });
}
for (let i = 0; i < color.length; i++) {
  watch(reactive(morecolor[i]), (newVal, oldVal) => {
    if (newVal.R.toString() == "") morecolor[i].R = 0;
    if (newVal.G.toString() == "") morecolor[i].G = 0;
    if (newVal.B.toString() == "") morecolor[i].B = 0;
    if (newVal.A.toString() == "") morecolor[i].A = 0;
    document.documentElement.style.setProperty(
      color[i],
      `rgba(${morecolor[i].R} ,${morecolor[i].G},${morecolor[i].B},${
        morecolor[i].A * 0.01
      })`
    );
    localStorage.setItem(`myColor${i}`, JSON.stringify(morecolor[i]));
    window.localStorage.myColor = true;
  });
}
function showColor() {
  show.value = true;
}
function notShowColor() {
  show.value = false;
}
//清除缓存
async function clearColor() {
  window.localStorage.clear();
  const restart = await byMessage.alert("清除缓存成功，请手动重启程序。");
  if (restart === true) {
    ipcRenderer.invoke("window-close");
  }
}
// 打开页面渲染色彩
function firstcolor() {
  for (let i = 0; i < color.length; i++) {
    document.documentElement.style.setProperty(
      color[i],
      `rgba(${morecolor[i].R} ,${morecolor[i].G},${morecolor[i].B},${
        morecolor[i].A * 0.01
      })`
    );
  }
}
// 打开页面就运行
function changebw() {
  // 模糊;
  if (localStorage.getItem(filter[0].class)) {
    for (let i = 0; i < filter.length; i++) {
      let k: HTMLElement = document.querySelector(filter[i].class);
      k.style.backdropFilter = "blur(" + filter[i].value * 0.1 + "px)";
    }
  } else {
    for (let i = 0; i < filter.length; i++) {
      localStorage.setItem(filter[i].class, filter[i].value.toString());
    }
  }

  // 色彩
  if (window.localStorage.myColor == "false" || !window.localStorage.myColor) {
    if (localStorage.BorW) {
      window.localStorage.BorW == 0 ? (bw = 1) : (bw = 0);
      changeBW();
    } else {
      let newmorecolor = [
        { name: "MainView", R: 50, G: 50, B: 50, A: 100 },
        { name: "大表格bg", R: 40, G: 40, B: 40, A: 100 },
        { name: "表格bg", R: 31, G: 31, B: 31, A: 100 },
        { name: "弹窗bg", R: 0, G: 0, B: 0, A: 90 },
        { name: "text1", R: 230, G: 230, B: 230, A: 100 },
        { name: "text2", R: 230, G: 230, B: 230, A: 100 },
        { name: "text3", R: 230, G: 230, B: 230, A: 100 },
        { name: "btn1", R: 50, G: 50, B: 50, A: 100 },
        { name: "btn2", R: 50, G: 50, B: 50, A: 100 },
        { name: "btn3", R: 50, G: 50, B: 50, A: 100 },
        { name: "btn:h", R: 100, G: 100, B: 100, A: 50 },
        { name: "border", R: 40, G: 40, B: 40, A: 100 },
        { name: "table:h", R: 40, G: 40, B: 40, A: 100 },
      ];
      for (let i = 0; i < newmorecolor.length; i++) {
        localStorage.setItem(`myColor${i}`, JSON.stringify(newmorecolor[i]));
      }
      bw = 0;
      window.localStorage.BorW = 0;
    }
  } else {
    for (let i = 0; i < color.length; i++) {
      morecolor[i].R = (
        JSON.parse(localStorage.getItem(`myColor${i}`)) as any
      ).R;
      morecolor[i].G = (
        JSON.parse(localStorage.getItem(`myColor${i}`)) as any
      ).G;
      morecolor[i].B = (
        JSON.parse(localStorage.getItem(`myColor${i}`)) as any
      ).B;
      morecolor[i].A = (
        JSON.parse(localStorage.getItem(`myColor${i}`)) as any
      ).A;
    }

    // morecolor = reactive([
    //   JSON.parse(localStorage.myColor0),
    //   JSON.parse(localStorage.myColor1),
    //   JSON.parse(localStorage.myColor2),
    //   JSON.parse(localStorage.myColor3),
    //   JSON.parse(localStorage.myColor4),
    //   JSON.parse(localStorage.myColor5),
    //   JSON.parse(localStorage.myColor6),
    //   JSON.parse(localStorage.myColor7),
    //   JSON.parse(localStorage.myColor8),
    //   JSON.parse(localStorage.myColor9),
    //   JSON.parse(localStorage.myColor10),
    //   JSON.parse(localStorage.myColor11),
    //   JSON.parse(localStorage.myColor12),
    // ]);
    firstcolor();
  }
}

function twoNum(a: any) {
  if (a < 10) {
    a = "0" + a;
  }
  return a;
}
function getNowTime() {
  let nowTime = new Date();
  h.value = nowTime.getHours();
  if (h.value < 5) {
    goodi = 0;
  } else if (h.value < 11) {
    goodi = 1;
  } else if (h.value < 13) {
    goodi = 2;
  } else if (h.value < 19) {
    goodi = 3;
  } else if (h.value < 24) {
    goodi = 4;
  }
  h.value = twoNum(h.value);
  m.value = twoNum(nowTime.getMinutes());
  s.value = twoNum(nowTime.getSeconds());
}

function changeBW() {
  if (bw === 1) {
    document.body.style.backgroundColor = "rgb(30,30,30)";
    document.documentElement.style.setProperty(
      "--bingyu-color-bshadow",
      "3px 0px 8px 0 rgba(0,0,0,.2), 0 1px 0px 0 rgb(0 ,0 ,0 ,.1)"
    );
    let newmorecolor = [
      { name: "MainView", R: 50, G: 50, B: 50, A: 100 },
      { name: "大表格bg", R: 40, G: 40, B: 40, A: 100 },
      { name: "表格bg", R: 31, G: 31, B: 31, A: 100 },
      { name: "弹窗bg", R: 0, G: 0, B: 0, A: 90 },
      { name: "text1", R: 200, G: 200, B: 200, A: 100 },
      { name: "text2", R: 200, G: 200, B: 200, A: 100 },
      { name: "text3", R: 200, G: 200, B: 200, A: 100 },
      { name: "btn1", R: 50, G: 50, B: 50, A: 100 },
      { name: "btn2", R: 50, G: 50, B: 50, A: 100 },
      { name: "btn3", R: 50, G: 50, B: 50, A: 100 },
      { name: "btn:h", R: 100, G: 100, B: 100, A: 50 },
      { name: "border", R: 40, G: 40, B: 40, A: 100 },
      { name: "table:h", R: 40, G: 40, B: 40, A: 100 },
    ];
    for (let i = 0; i < morecolor.length; i++) {
      morecolor[i].R = newmorecolor[i].R;
      morecolor[i].G = newmorecolor[i].G;
      morecolor[i].B = newmorecolor[i].B;
      morecolor[i].A = newmorecolor[i].A;
    }
    bw = 0;
    window.localStorage.BorW = 0;
  } else {
    document.body.style.backgroundColor = "rgb(255,255,255)";
    document.documentElement.style.setProperty(
      "--bingyu-color-bshadow",
      "none"
    );
    let newmorecolor = [
      { name: "MainView", R: 255, G: 255, B: 255, A: 0 },
      { name: "大表格bg", R: 255, G: 255, B: 255, A: 0 },
      { name: "表格bg", R: 255, G: 255, B: 255, A: 0 },
      { name: "弹窗bg", R: 240, G: 240, B: 240, A: 100 },
      { name: "text1", R: 0, G: 0, B: 0, A: 100 },
      { name: "text2", R: 255, G: 255, B: 255, A: 100 },
      { name: "text3", R: 40, G: 40, B: 40, A: 100 },
      { name: "btn1", R: 103, G: 194, B: 58, A: 100 },
      { name: "btn2", R: 64, G: 158, B: 225, A: 100 },
      { name: "btn3", R: 144, G: 147, B: 158, A: 100 },
      { name: "btn:h", R: 100, G: 100, B: 100, A: 50 },
      { name: "border", R: 40, G: 40, B: 40, A: 100 },
      { name: "table:h", R: 64, G: 200, B: 255, A: 100 },
    ];
    for (let i = 0; i < morecolor.length; i++) {
      morecolor[i].R = newmorecolor[i].R;
      morecolor[i].G = newmorecolor[i].G;
      morecolor[i].B = newmorecolor[i].B;
      morecolor[i].A = newmorecolor[i].A;
    }
    bw = 1;
    window.localStorage.BorW = 1;
  }
  for (let i = 0; i < morecolor.length; i++) {
    localStorage.setItem(`myColor${i}`, JSON.stringify(morecolor[i]));
  }
  window.localStorage.myColor = false;
}
</script>

<style lang="scss" scoped>
.add {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  text-align: center;
  min-width: 250px;
  box-sizing: border-box;
  padding: 40px 15px 20px 5px;
}
.addtime {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  border-radius: 4px;

  .colorStyle {
    padding: 10px 10px;
    display: flex;
    .btn {
      flex: 1;
      padding: 0 16px;
      height: 35px;
      background-color: none;
      border: rgb(100, 100, 100) solid 1px;
      font-size: 20px;
      line-height: 35px;
      cursor: pointer;
      color: var(--bingyu-color-text1);
    }

    .btn:hover {
      background-color: rgba(100, 100, 100, 0.6);
    }
    .config {
      height: 35px;
      width: 35px;
      background-color: none;
      border: rgb(100, 100, 100) solid 1px;
      cursor: pointer;
      .configicon {
        height: 100%;
        width: 100%;
        .tool {
          height: 60%;
          width: 60%;
          color: var(--bingyu-color-text1);
        }
      }
      .configicon:hover {
        animation: rotating 2s linear infinite;
      }
    }
    .config:hover {
      background-color: rgba(100, 100, 100, 0.6);
    }
  }
}

.colorIndex {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: auto;
  height: 685px;
  width: 100%;
  top: 30px;
  left: 0;
  color: var(--bingyu-color-text1);
  background-color: var(--bingyu-color-bg4);
  z-index: 10;
  overflow-y: auto;
  border-radius: 4px;

  .colorul {
    display: block;
    height: 75%;
    overflow-y: auto;
    overflow-x: none;
    width: 100%;
    .colorli {
      display: flex;
      margin: 8px 0;
      border-bottom: var(--el-border-color-lighter) solid 1px;
      align-items: center;
      text-align: center;
      .colorrgba {
        display: flex;
        flex: 2;
        align-items: center;
        div {
          display: inline-block;
          width: 35%;
          min-width: 68px;
          margin-right: 4px;
          margin: 0 auto;
          .rgba {
            width: 100%;
            height: 20px;
            background-color: rgba(100, 100, 100, 0.5);
            border: none;
            color: var(--bingyu-color-text1);
            outline: none;
          }
        }
      }
      .colorname {
        flex: 1;
        min-width: 70px;
      }
      .filtername {
        width: 50%;
      }
      .filterval {
        width: 50%;
      }
    }
  }

  .filinp {
    width: 100%;
    height: 20px;
    background-color: rgba(100, 100, 100, 0.5);
    border: none;
    color: var(--bingyu-color-text1);
    outline: none;
  }
}
.colorbtn {
  height: 30px;
  width: auto;
  margin-top: 16px;
  line-height: 30px;
  margin: 10px 32px 0 32px;
  background-color: rgba(100, 100, 100, 0.5);
  border-radius: 4px;
}
.colorbtn:hover {
  background-color: var(--el-color-primary);
}
.getimg {
  width: auto;
  text-align: center;
  margin: 10px auto;
}
.me-h2 {
  color: var(--bingyu-color-text1);
}
.timeear {
  color: var(--bingyu-color-text1);
}
.me-time-h3 {
  font-family: DS;
  font-size: 60px;
  background: linear-gradient(
    30deg,
    #ff0000,
    #ff0033,
    #ff2075,
    #ff30c4,
    #ff2eee,
    #b038ff,
    #a459ff,
    #b98eff
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.me-ul {
  margin-top: 30px;
  list-style: none;
}
.me-ul > li {
  font-weight: 600;
  font-size: 20px;
  line-height: 34px;
  color: var(--bingyu-color-text1);
}
.me-ul > .me-li1 {
  font-size: 26px;
}
</style>
