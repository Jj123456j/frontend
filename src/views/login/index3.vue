<template>
    <div class="root">
        <div class="yemian">
            <div class="title">登录微信</div>
            <input class="username" type="text" placeholder="请输入用户名">
            <input class="password" type="text" placeholder="请输入密码">
            <button class="denglu">登录</button>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.root {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    /* background-color: black; */
    background-image: url('https://img.zcool.cn/community/013c1860b076db11013eaf70c6b95e.gif?x-image-process=image/format,jpg');
    /* 替换为你的背景图片URL */
    background-size: cover;
    /* 使背景图片覆盖整个页面 */
    background-position: center;
    /* 背景图片居中 */
    background-color: black;
    /* 如果图片加载失败，显示黑色背景 */
}

.yemian {
    width: 400px;
    height: 400px;
    display: flex;
    /* background-color: black; */
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 2px;
    /* animation: fadeIn 1s ease-in-out; 添加淡入动画 */
}

/* @keyframes fadeIn {
    from {
        opacity: 0; 
        transform: translateY(-20px);
    }
    to {
        opacity: 1; 
        transform: translateY(0);
    }
} */

.title {
    color: white;
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 20px;
}

.username {
    width: 80%;
    height: 40px;
    margin-bottom: 10px;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    border-bottom: 2px solid white;
    border-radius: 2px;
    background-color: black;
    color: white;
}

.username:hover {
    outline: none;
    border-bottom: 2px solid blue;
}

.username:focus {
    outline: none;
    border-bottom: 2px solid orangered;
}

.password {
    width: 80%;
    height: 40px;
    margin-bottom: 10px;
    padding: 0 10px;
    box-sizing: border-box;
    border: none;
    border-bottom: 2px solid white;
    border-radius: 2px;
    background-color: black;
    color: white;
}

.password:hover {
    outline: none;
    border-bottom: 2px solid blue;
}

.password:focus {
    outline: none;
    border-bottom: 2px solid orangered;
}

.denglu {
    width: 80%;
    height: 35px;
    margin-top: 20px;
    background-color: rgb(64, 154, 196);
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 2px;
    font-weight: bold;
}

.denglu:hover {
    background-color: rgb(0, 34, 255);
}
</style>