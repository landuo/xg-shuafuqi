<template>
  <div class="up-img">
    <div>上传背景图</div>
    <div class="upload-wrap anticon" nv-file-drop="" uploader="uploader">
        <input class="file-ele file-upload"  type="file" file-model="image" name="image" nv-file-select uploader="uploader" multiple />
        <div class="file-open"><em class="icon icon-upload"></em>&nbsp;upload</div>    
</div>
  </div>
</template>

<script setup lang="ts">
import{onMounted}from 'vue'

onMounted(()=>{
  let input:HTMLInputElement = document.querySelector('.file-upload') ;  
  input.addEventListener('change', () => {
  const file = input.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    const imageURL = reader.result;
    // 对读取到的图片URL进行后续处理
    const img = new Image();
    img.src = imageURL as string;
    img.onload = function() {
      //将图片设置为背景
    document.body.style.backgroundImage = `url(${imageURL})`;
    document.body.style.backgroundPosition='center'
    document.body.style.backgroundSize='cover'
    }
    //将图片解码存在浏览器缓存中
    localStorage.setItem('backgroundImageURL', imageURL as string);
  }
})
})





</script>

<style scoped>
.up-img{
  text-align: center;
  margin: 0 auto;
}
.upload-wrap{
    position: relative;
    display: inline-block;
    overflow: hidden;
    border:1px solid #2d78f4;
    border-radius: 3px;
}
.upload-wrap .file-ele{
    position: absolute;
    top:0;
    right:0;
    opacity: 0;
    height: 100%;
    width: 100%;
    cursor: pointer;
}
.upload-wrap .file-open{
    width:90px;
    height:30px;
    line-height:30px;
    text-align: center;
    color:#fff;
    background: #3385ff;
}
</style>