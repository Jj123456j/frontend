<template>
    <div v-if="isVisible" class="popover">
      <div class="popover-content">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isVisible = ref(false);
  const message = ref('');
  
  // 显示弹窗
  const show = (msg) => {
    message.value = msg;
    isVisible.value = true;
    setTimeout(() => {
      isVisible.value = false; // 3秒后自动关闭
    }, 3000);
  };
  
  // 暴露方法
  defineExpose({ show });
  </script>
  
  <style scoped>
  .popover {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    /* background-color: #ff4d4f; */
    background-color: white;
    color: black;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  </style>