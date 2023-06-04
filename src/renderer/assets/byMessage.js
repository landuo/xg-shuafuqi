// 重写信息框
	var byMessage={}
  byMessage.alert = async function (msg,callback) {
	let re=false 
	var maskBg = "#0000002b"; //蒙版展示色
	var zIndex = 999999; //修改弹出层z-index,应为最顶层,避免被覆盖
	var desColor = "#1f0000"; //提示信息字体颜色
	var buttonVal = "确定"; //确定按钮名称
	var btnBgColor = "#1E90FF"; //确定按钮背景颜色
	var btnColor = "#fff"; //确定按钮字体颜色
	var btnAlign = "center"; //按钮在水平位置,默认居中,变量值:left,center,right
	var style =
	  `<style class="mask-style">
	  .box-sizing{
	   box-sizing: border-box;
	  }
	  .alertMask{
	   position: fixed; /*生成绝对定位的元素，相对于浏览器窗口进行定位*/
	   display: flex;
	   display: webkit-flex;
	   flex-direction: row;
	   align-items: center;
	   justify-content: center;
	   width: 100%;
	   height: 100%;
	   top: 0;
	   left: 0;
	   z-index: ` +
	  zIndex +
	  `;
	   background: ` +
	  maskBg +
	  `;
	  }
	  .alertContainer{
	   min-width: 240px; /*容器最小240px*/
	   max-width: 320px; /*容器最大320px*/
	   background:#fff;
	   border: 1px solid ` +
	  maskBg +
	  `;
	   border-radius: 3px;
	   color: ` +
	  desColor +
	  `;
	   overflow: hidden;
	  }
	  .alertDes{
	   padding: 35px 30px;
	   text-align: center;
	   letter-spacing: 1px;
	   font-size: 14px;
	   color: ` +
	  desColor +
	  `;
	  }
	  .alertDes img{
	   max-width: 100%;
	   height: auto;
	  }
	  .alertConfirmParent{
	   width: 100%;
	   padding: 20px 30px;
	   text-align: ` +
	  btnAlign +
	  `;
	   box-sizing: border-box;
	   background: #f2f2f2;
	  }
	  .alertConfirmBtn{
	   cursor: pointer;
	   padding: 8px 10px;
	   border: none;
	   border-radius: 2px;
	   color: ` +
	  btnColor +
	  `;
	   background-color: ` +
	  btnBgColor +
	  `;
	   box-shadow: 0 0 2px ` +
	  btnBgColor +
	  `;
	  }
	 </style>
	`;
  
	var head = document.getElementsByTagName("head")[0]; //
	// 网页中可以存在多个相同名字的标签，所以使用bytagname时，后面必须加序号，只有1个head，所以是[0]
	head.innerHTML += style;
	//将css样式写入html头部,注意不可使用document.write()写入文件,否则出错
  
	const body = document.getElementsByTagName("body")[0];
  
	// 创建标签
	var alertMask = document.createElement("div");
	var alertContainer = document.createElement("div");
	var alertDes = document.createElement("div");
	var alertConfirmParent = document.createElement("div");
	var alertConfirmBtn = document.createElement("button");
  
	//在body中添加创建的标签  创建标签的同时  就给标签调用css样式对应的类名
	body.append(alertMask);
	alertMask.append(alertContainer);
	alertContainer.append(alertDes);
	alertContainer.append(alertConfirmParent);
	alertConfirmParent.append(alertConfirmBtn);
  
	//为添加的标签  选择  对应的css样式类名
	alertMask.classList.add("alertMask");
	alertMask.classList.add("box-sizing");
  
	alertContainer.classList.add("alertContainer");
	alertContainer.classList.add("box-sizing");
  
	alertDes.classList.add("alertDes");
	alertDes.classList.add("box-sizing");
  
	alertConfirmParent.classList.add("alertConfirmParent");
	alertConfirmParent.classList.add("box-sizing");
  
	alertConfirmBtn.classList.add("alertConfirmBtn");
	alertConfirmBtn.classList.add("box-sizing");
  
	//按钮文本
	alertConfirmBtn.innerText = buttonVal;
  
	//警示框提示信息文本
	alertDes.innerHTML = msg;
  
	//关闭当前alert警视窗函数

	//添加点击事件，点击调用关闭警示框函数
		function alertBtnClick() {
	  body.removeChild(alertMask); //移除警示框html的最大标签  其中的所有内容都会被移除
		let maskStyle = head.getElementsByClassName("mask-style")[0];
		head.removeChild(maskStyle); //移除生成的css样式
			re = true
		}
		function getReturn(){
			return new Promise((resolve)=>{
				const wait = setInterval(() => {
					if (re===true) {
						clearInterval(wait)
						resolve()
					}
				}, 100);
			})
		}

		alertConfirmBtn.addEventListener("click",alertBtnClick);
		await getReturn()
		if (callback) callback;
		return true
	}
	export default byMessage