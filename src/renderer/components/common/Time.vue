<template>
    <div class="add">

      <!-- 色彩修改页面 -->
      <div class="colorIndex" v-show="show" >
        <ul class="colorul">
          <li v-for="(one,index) in morecolor" :key="index" class="colorli"> 
            <div class="colorname">{{one.name}}:</div> 
            <div class="colorrgba">
              <div> 
                R:<input class="rgba" type="number" v-model="one.R" min="0" max="255" oninput="if(value<0)value=0;if(value>255)value=255">
                B:<input class="rgba" type="number" v-model="one.B" min="0" max="255" oninput="if(value<0)value=0;if(value>255)value=255">
              </div> 
              <div> 
                G:<input class="rgba" type="number" v-model="one.G" min="0" max="255" oninput="if(value<0)value=0;if(value>255)value=255">   
                A:<input class="rgba" type="number" v-model="one.A" min="0" max="100" oninput="if(value<0)value=0;if(value>100)value=100">
              </div> 
            </div>
        </li>
        </ul>
        <ButtonBg class="getimg "></ButtonBg>
        <div class="colorbtn" @click="notShowColor()">关闭</div>
        <div class="colorbtn" @click="clearColor()">清除样式</div>
      </div>
      <!-- 设置与白黑风格转换 -->
      <div class="colorStyle">
        <div class="btn" @click="changeBW()">亮白/雅黑</div>
        <div class="config "  @click="showColor()">
          <el-icon  class="configicon" ><Tools class="tool" /></el-icon>
        </div>
      </div>

      <!-- 问好与时间 -->
      <h2 class="me-h2">{{ good[goodi] }}</h2>
      <h3 class="timeear">现在是北京时间：</h3> 
      <h3 class="me-time-h3"><span class="hhh">{{ h }}</span>:<span class="mmm">{{ m }}</span>:<span class="sss">{{ s }}</span></h3>

      <!-- 对抗要领 -->
      <ul class="me-ul">
        <li class="me-li1">对抗要领</li>
        <li class="me-li">秒妹给药，胆汁贴脸；</li>
        <li class="me-li">瞎眼黑枪，踩痰救人；</li>
        <li class="me-li">无事跳楼，克局跑分；</li>
        <li class="me-li">机枪秒妹，绿血恰药；</li>
        <li class="me-li">进场问包，女人狂笑；</li>
        <li class="me-li">口水先活，胖子炸控；</li>
        <li class="me-li">牛抢猴子，跳海HT；</li>
        <li class="me-li">空拳坦克，打铁AI；</li>
        <li class="me-li">按C骂人，按X嘲讽；</li>
        <li class="me-li">狂妄至极，扬言单挑；</li>
        <li class="me-li">不堪受辱，中途退出；</li>
      </ul>
  </div>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus';
import { Tools } from '@element-plus/icons-vue'
import { ref,reactive,watch } from 'vue';
import ButtonBg from './ButtonBg.vue'
import byMessage from '../../assets/byMessage.js'
const { ipcRenderer } = require('electron');
  let good =['夜晚好','早上好','中午好','下午好','晚上好']
  let goodi=0
  let h = ref(0)
  let m = ref(0)
  let s = ref(0)
  let bw=1
  let show=ref(false)
  let color=['--bingyu-color-none','--bingyu-color-bg1','--bingyu-color-bg2','--bingyu-color-bg3','--el-fill-color-blank',
            '--el-color-success','--bingyu-color-text1', '--el-text-color-regular','--el-text-color-primary',
            '--el-color-white','--el-border-color-lighter','--el-color-primary','--el-fill-color-light']
  let morecolor=reactive([      
      { name:'MainView', R:0,   G:0,   B:0,   A:0  },
      { name:'RGBbg', R:40,  G:40,  B:40,  A:100 },
      { name:'bg2', R:50,  G:50, B:50, A:100 },
      { name:'弹窗bg', R:0,   G:0,   B:0,   A:90  },
      { name:'大表格bg', R:0,  G:0, B:0, A:0 },
      { name:'低延迟色', R:64,   G:158,   B:255,   A:100  },
      { name:'字色1', R:210,  G:210,  B:210,  A:100 },
      { name:'字色2', R:210,  G:210,  B:210,  A:100 },
      { name:'字色3', R:210,  G:210,  B:210,  A:100 },
      { name:'字色4', R:255,  G:255, B:255, A:100 },
      { name:'边框色', R:100,  G:100, B:100, A:100 },
      { name:'btn色', R:64,  G:158,  B:255,  A:100},
      { name:'停留色', R:40,   G:100,   B:161,   A:100 },
    ])
  window.addEventListener('resize',()=>{
  let domhei:HTMLElement =document.querySelector(".colorIndex")
  domhei.style.height=(window.innerHeight-35).toString()+'px'
})

  changebw()
  //监视色彩改变，改一项数据，动态修改次项数据的的关联色彩，而不是全部修改，代码段多，但前端内存压力小

  for (let i = 0; i < color.length; i++) {
    watch(reactive(morecolor[i]),(newVal,oldVal)=>{
    document.documentElement.style.setProperty(color[i],'rgba('+morecolor[i].R+','+morecolor[i].G+','+morecolor[i].B+','+morecolor[i].A*0.01+')')
    localStorage.setItem(`myColor${i}`,JSON.stringify(morecolor[i])) 
    window.localStorage.myColor =true
  })
  }
  function showColor(){
    show.value=true
  }
  function notShowColor(){
    show.value=false
  }
  async function clearColor(){
    window.localStorage.clear()
    const restart= await byMessage.alert('清除缓存成功，请手动重启程序。')
    if(restart===true){ipcRenderer.invoke("window-close")}
  }
  function firstcolor() {
  for (let i = 0; i < color.length; i++) {
    document.documentElement.style.setProperty(color[i],'rgba('+morecolor[i].R+','+morecolor[i].G+','+morecolor[i].B+','+morecolor[i].A*0.01+')')
  }}

  function changebw() {
    if(window.localStorage.myColor=='false'||!window.localStorage.myColor){
    if(localStorage.BorW){
      window.localStorage.BorW==0?bw =  1: bw =  0
      changeBW()
    }else{
      bw =  0
      changeBW()
    }
    }else{
       morecolor = reactive([JSON.parse(localStorage.myColor0),
       JSON.parse(localStorage.myColor1),JSON.parse(localStorage.myColor2),JSON.parse(localStorage.myColor3),
       JSON.parse(localStorage.myColor4),JSON.parse(localStorage.myColor5),JSON.parse(localStorage.myColor6),
       JSON.parse(localStorage.myColor7),JSON.parse(localStorage.myColor8),JSON.parse(localStorage.myColor9),
       JSON.parse(localStorage.myColor10),JSON.parse(localStorage.myColor11),JSON.parse(localStorage.myColor12)])
       firstcolor()
    }}
  function getgood() {
  if (h.value < 5) {
    goodi = 0
  } else if (h.value < 11) {
    goodi = 1
  } else if (h.value < 13) {
    goodi = 2
  } else if (h.value < 19) {
    goodi = 3
  } else {
    goodi = 4
  }
}
function twoNum(a:any){
    if(a<10){a='0'+a}
    return a
}
function getNowTime() {
    let nowTime =new Date()
    h.value=nowTime.getHours()
    getgood()
    h.value=twoNum(h.value)
    m.value=twoNum(nowTime.getMinutes())
    s.value=twoNum(nowTime.getSeconds())
}
getNowTime()

setInterval(() => {
  getNowTime()
}, 1000);

function changeBW(){ 
 if(bw===1){
  document.documentElement.style.setProperty('--bingyu-color-none','rgba(0,0,0,0)')
  document.documentElement.style.setProperty('--bingyu-color-bg1','rgb(40,40,40)')
  document.documentElement.style.setProperty('--bingyu-color-bg2','rgb(50,50,50)')
  document.documentElement.style.setProperty('--bingyu-color-bg3','rgba(0,0,0,0.9)')
  document.documentElement.style.setProperty('--el-fill-color-blank','none')
  document.documentElement.style.setProperty('--el-color-success','rgb(64, 158, 255)')
  document.documentElement.style.setProperty('--bingyu-color-text1','rgb(210,210,210)')
  document.documentElement.style.setProperty('--el-text-color-regular','rgb(210,210,210)')
  document.documentElement.style.setProperty('--el-text-color-primary','rgb(210,210,210)')
  document.documentElement.style.setProperty('--el-color-white','rgba(255,255,255,1)')
  document.documentElement.style.setProperty('--el-border-color-lighter','rgb(100,100,100)')
  document.documentElement.style.setProperty('--el-color-primary','rgb(64, 158, 255)')
  document.documentElement.style.setProperty('--el-fill-color-light','rgb(40, 100, 161)')
  let newmorecolor =reactive([
      { name:'MainView', R:0,   G:0,   B:0,   A:0  },
      { name:'RGBbg', R:40,  G:40,  B:40,  A:100 },
      { name:'bg2', R:50,  G:50, B:50, A:100 },
      { name:'弹窗bg', R:0,   G:0,   B:0,   A:90  },
      { name:'大表格bg', R:0,  G:0, B:0, A:0 },
      { name:'低延迟色', R:64,   G:158,   B:255,   A:100  },
      { name:'字色1', R:210,  G:210,  B:210,  A:100 },
      { name:'字色2', R:210,  G:210,  B:210,  A:100 },
      { name:'字色3', R:210,  G:210,  B:210,  A:100 },
      { name:'字色4', R:255,  G:255, B:255, A:100 },
      { name:'边框色', R:100,  G:100, B:100, A:100 },
      { name:'btn色', R:64,  G:158,  B:255,  A:100},
      { name:'停留色', R:40,   G:100,   B:161,   A:100 },
  ])
  for(let i=0 ; i<morecolor.length;i++){
    morecolor[i].R=newmorecolor[i].R
    morecolor[i].G=newmorecolor[i].G
    morecolor[i].B=newmorecolor[i].B
    morecolor[i].A=newmorecolor[i].A
  }
  bw=0
  window.localStorage.BorW=0
 }
 else{
  document.documentElement.style.setProperty('--bingyu-color-none','rgba(0,0,0,0)')
  document.documentElement.style.setProperty('--bingyu-color-bg1','none')
  document.documentElement.style.setProperty('--bingyu-color-bg2','rgb(150,150,150)')
  document.documentElement.style.setProperty('--bingyu-color-bg3','rgba(255,255,255,0.9)')
  document.documentElement.style.setProperty('--el-fill-color-blank','rgba(255,255,255,0.5)')
  document.documentElement.style.setProperty('--el-color-success','#67c23a')
  document.documentElement.style.setProperty('--bingyu-color-text1','rgb(0,0,0)')
  document.documentElement.style.setProperty('--el-text-color-regular','#606266')
  document.documentElement.style.setProperty('--el-text-color-primary','#303133')
  document.documentElement.style.setProperty('--el-color-white','#ffffff')
  document.documentElement.style.setProperty('--el-border-color-lighter','#ebeef5')
  document.documentElement.style.setProperty('--el-color-primary','#409eff')
  document.documentElement.style.setProperty('--el-fill-color-light','rgb(220,220,220)')
  let newmorecolor=reactive([
      { name:'MainView', R:0,   G:0,   B:0,   A:0  },
      { name:'RGBbg', R:0,  G:0,  B:0,  A:0 },
      { name:'bg2', R:150,  G:150, B:150, A:100 },
      { name:'弹窗bg', R:255,   G:255,   B:255,   A:90  },
      { name:'大表格bg', R:255,  G:255, B:255, A:0.5 },
      { name:'低延迟色', R:103,   G:194,   B:58,   A:100  },
      { name:'字色1', R:0,  G:0,  B:0,  A:100 },
      { name:'字色2', R:96,  G:98,  B:102,  A:100 },
      { name:'字色3', R:48,  G:49,  B:51,  A:100 },
      { name:'字色4', R:255,  G:255, B:255, A:100 },
      { name:'边框色', R:235,  G:238, B:245, A:100 },
      { name:'btn色', R:64,  G:158,  B:255,  A:100},
      { name:'停留色', R:2205,   G:220,   B:220,   A:100 },
  ])
  for(let i=0 ; i<morecolor.length;i++){
    morecolor[i].R=newmorecolor[i].R
    morecolor[i].G=newmorecolor[i].G
    morecolor[i].B=newmorecolor[i].B
    morecolor[i].A=newmorecolor[i].A
  }
  bw=1
  window.localStorage.BorW=1
 }
 for (let i = 0; i < morecolor.length; i++) {
    localStorage.setItem(`myColor${i}`,JSON.stringify(morecolor[i])) 
}
 window.localStorage.myColor = false
 }
</script>

<style lang="scss" scoped>
.add{
      display: flex;
      justify-content: center;
      flex-direction: column;
      position: relative;
      text-align: center;
      min-width: 250px;
      box-sizing: border-box;
      .colorIndex{
        display: flex;
        flex-direction: column;
        position: absolute;
        min-width: 180px;
        height: 690px;
        width: 100%;
        top:30px;
        background-color: var(--bingyu-color-bg3);
        color: var(--bingyu-color-text1);
        z-index: 99;
        overflow-y: auto;
      }
      // .colorIndex::before{
      //   content: '';
      //   position: absolute;
      //   display: block;
      //   height: 100%;
      //   width: 100%;
      //   background-image: url(../../public/sideImg.JPG);
      //   background-position: center;
      //   background-size: cover;
      //   filter:brightness(.8);
      //   z-index: -1;
      // }
      .colorStyle{
        padding: 10px 10px;
        display: flex;
        .btn{
          flex: 1;
          padding:0 16px;
          height: 35px;
          background-color: none;
          border: rgb(100, 100, 100) solid 1px;
          font-size: 20px;
          line-height: 35px;
          cursor: pointer;
          color: var(--bingyu-color-text1);
        }

        .btn:hover{
          background-color: rgba(100, 100, 100,.6);
        }
        .config{
          height: 35px;
          width: 35px;
          background-color: none;
          border: rgb(100, 100, 100) solid 1px;
          cursor: pointer;
          .configicon{
            height: 100%;
            width: 100%;
            .tool{
              height: 60%;
              width: 60%;
              color: var(--bingyu-color-text1);
            }
          }
          .configicon:hover{
            animation: rotating 2s linear infinite;
          }
        }
        .config:hover{
          background-color: rgba(100, 100, 100,.6);
        }
      }
    }
    .colorul{
      display: block;
      height: 75%;
      overflow-y:auto;
      overflow-x: none;
      width: 100%;
      .colorli{
        display: flex;
        margin:8px 0 ;
        border-bottom: var(--el-border-color-lighter) solid 1px;
        align-items: center;
        text-align: center;
        .colorrgba{
          flex: 3;
          div{
            display: inline-block;
            width: 35%;
            min-width: 60px;
            margin-right: 4px;
            input{
              width: 100%;
              height: 20px;
              background-color: var(--bingyu-color-bg2);
              border: none;
              color: var(--bingyu-color-text1);
              outline: none;
            }
          }

        }
        .colorname{
          flex: 1;
          min-width: 70px;
        }
      }
    }
    .colorbtn{
      height: 30px;
      width: auto;
      margin-top: 16px;
      line-height: 30px;
      margin: 10px 32px 0 32px;
      background-color: var(--bingyu-color-bg3);
    }
    .colorbtn:hover{
      background-color: var(--el-color-primary);
    }
    .getimg{
      width: auto;
      text-align: center;
      margin: 10px auto ;
    }
    .me-h2{
      color:var(--bingyu-color-text1);
    }
    .timeear{
      color: var(--bingyu-color-text1);
    }
    .me-time-h3{
      font-family: DS;
      font-size: 60px;
      background: linear-gradient(30deg, #ff0000,#ff0033,#ff2075, #ff30c4,#ff2eee,#b038ff,#a459ff,#b98eff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .me-ul{
      margin-top: 30px;
      list-style: none;
    }
    .me-ul>li{
      font-weight: 600;
      font-size: 20px;
      line-height: 34px;
      color: var(--bingyu-color-text1);
    }
    .me-ul>.me-li1{
      font-size: 26px;
    }
</style>



