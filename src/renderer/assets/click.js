//3种样式集合在数组A中，并设置初始值
const cm= document.querySelector('.changeMouse')
let a1 = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国",
"敬业", "诚信", "友善"];
let a2= ["（//▽//）", "（=ˇωˇ=）", "╭(￣▽￣)╯╧═╧", "(๑•́ ₃ •̀๑) ", "(●’◡’●)ﾉ❤", "(〜￣△￣)〜", "(❤◠‿◠)ﾉ ", "（●>∀<●）", "Σ( ￣д￣；) ！！！",
" (๑＞ڡ＜)", "─=≡Σ((( つ•̀ω•́)つ", "o(一︿一+)o"];
let a3=["❤"]
let A=[a1,a2,a3]
let k=Math.floor(Math.random()*3)   //用于改变a
var a=A[k]
var z = 0;  //用于切换a内元素


//   点击改变a
if(cm){
cm.addEventListener('click',function mouse(){
    k==A.length-1?k=0:k++
    a=A[k]
    z = (z+1) % a.length
  })
}
// 点击触发
  window.addEventListener('click' ,function (event) {
    let heart = document.createElement("b"); //创建b元素
    heart.onselectstart = new Function('event.returnValue=false'); //防止拖动
    document.body.appendChild(heart).innerHTML = a[z]; //将b元素添加到页面上
    z = (z + 1) % a.length;
    heart.style.cssText = "position: fixed;left:-100%;z-index:9999;"; //给p元素设置样式


    let f = 16, // 字体大小
        x = event.clientX - f / 2, // 横坐标
        y = event.clientY - f, // 纵坐标
        c = randomColor(), // 随机颜色
        t = 1, // 透明度
        s = 1.2; // 放大缩小
    const timer = setInterval(function mouse() { //添加定时器
        if (t <= 0) {
            document.body.removeChild(heart);
            clearInterval(timer);
        } else {
            heart.style.cssText = "font-size:16px;cursor: default;position: fixed;color:" +
                c + ";left:" + x + "px;top:" + y + "px;opacity:" + t + ";transform:scale(" +
                s + ");";

            y--;
            t -= 0.016;
            s += 0.002;
        }
     
    }, 15)

  })

  // 随机颜色
  function randomColor() {
      return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math
      .random() * 255)) + ")";
  }


