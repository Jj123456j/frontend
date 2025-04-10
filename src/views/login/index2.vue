<template>
  <div class="login">
    <!-- 登录页面背景动画 -->
    <vue-particles
      class="bg-root"
      id="tsparticles"
      @particles-loaded="particlesLoaded"
      :options="particlesOptions"
    />
    <!-- 登录表单 -->
    <div class="yemian" v-if="!showRegisterForm">
      <div class="title">密码登录</div>
      <input
        v-model="username"
        class="username"
        type="text"
        placeholder="请输入用户名"
      />
      <div class="password-container">
        <input
          v-model="password"
          class="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="请输入密码"
        />
        <!-- 动态切换图片 -->
        <span class="toggle-password" @click="showPassword = !showPassword">
          <img
            :src="
              showPassword // 隐藏密码时显示的图片
                ? '/src/assets/image/zk.png' // 显示密码时显示的图片
                : '/src/assets/image/yc.png'
            "
            alt="密码切换图标"
            style="width: 20px; height: 20px"
          />
        </span>
      </div>
      <div class="zhanghao">
        还没有账号？<span class="zhuce" @click="switchToRegister">注册</span>
      </div>
      <button class="denglu" @click="dengLu">登录</button>
    </div>

    <!-- 注册表单 -->
    <div class="yemian" v-else>
      <div class="title">注册账号</div>
      <input
        v-model="registerUsername"
        class="username"
        type="text"
        placeholder="请输入用户名"
      />
      <div class="password-container">
        <input
          v-model="registerPassword"
          class="password"
          :type="showRegisterPassword ? 'text' : 'password'"
          placeholder="请输入密码"
        />
        <!-- 动态切换图片 -->
        <span
          class="toggle-password"
          @click="showRegisterPassword = !showRegisterPassword"
        >
          <img
            :src="
              showRegisterPassword
                ? '/src/assets/image/zk.png'
                : '/src/assets/image/yc.png'
            "
            alt="密码切换图标"
            style="width: 25px; height: 25px"
          />
        </span>
      </div>
      <div class="password-container">
        <input
          v-model="confirmPassword"
          class="password"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="请确认密码"
        />
        <!-- 动态切换图片 -->
        <span
          class="toggle-password"
          @click="showConfirmPassword = !showConfirmPassword"
        >
          <img
            :src="
              showConfirmPassword
                ? '/src/assets/image/zk.png'
                : '/src/assets/image/yc.png'
            "
            style="width: 25px; height: 25px"
          />
        </span>
      </div>
      <div class="zhanghao">
        已有账号？<span class="zhuce" @click="switchToLogin">登录</span>
      </div>
      <button class="denglu" @click="register">注册</button>
    </div>

    <!-- 气泡弹窗 -->
    <Popover ref="popover" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Popover from "../login/Popover.vue"; // 引入气泡弹窗组件

// 判断字符串中是否包含中文
const containsChinese = (str: string) => {
  return /[\u4e00-\u9fa5]/.test(str);
};

const username = ref("");
const password = ref("");
const router = useRouter();
const popover = ref(); // 获取 Popover 组件的引用

// 密码显示状态
const showPassword = ref(false);
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);

// 注册相关状态
const showRegisterForm = ref(false);
const registerUsername = ref("");
const registerPassword = ref("");
const confirmPassword = ref("");

// 用户信息数组
const userArray = [
  {
    username: "admin",
    password: "88888888",
  },
  {
    username: "1",
    password: "1",
  },
];

// 登录
const dengLu = () => {
  if (username.value === "") {
    popover.value.show("请输入用户名");
    return;
  } else if (password.value === "") {
    popover.value.show("请输入密码");
    return;
  } else if (containsChinese(password.value)) {
    popover.value.show("密码不能包含中文");
    return;
  }

  let loginSuccess = false;

  if (!loginSuccess) {
    popover.value.show("用户名或密码错误");
  }

  userArray.forEach((item) => {
    if (item.username === username.value && item.password === password.value) {
      loginSuccess = true;
      console.log("登录成功");
      router.push("/chat");
    }
  });
};

const switchToRegister = () => {
  // 清空登录表单数据
  username.value = "";
  password.value = "";
  showRegisterForm.value = true;
  showPassword.value = false;
  // showRegisterPassword.value = false;
  // showConfirmPassword.value = false;
};

const switchToLogin = () => {
  // 清空注册表单数据
  registerUsername.value = "";
  registerPassword.value = "";
  confirmPassword.value = "";
  showRegisterForm.value = false;
  // showPassword.value = false;
  showRegisterPassword.value = false;
  showConfirmPassword.value = false;
};

// 注册
const register = () => {
  if (registerUsername.value === "") {
    popover.value.show("请输入用户名");
    return;
  } else if (registerPassword.value === "") {
    popover.value.show("请输入密码");
    return;
  } else if (confirmPassword.value === "") {
    popover.value.show("请确认密码");
    return;
  } else if (containsChinese(registerPassword.value) && (confirmPassword.value)) {
    popover.value.show("密码不能包含中文");
    return;
  // } else if (containsChinese(confirmPassword.value)) {
  //   popover.value.show("密码不能包含中文");
  //   return;
  } else if (registerPassword.value !== confirmPassword.value) {
    popover.value.show("两次输入的密码不一致");
    return;
  }

  // 检查用户名是否已存在
  const userExists = userArray.some(
    (user) => user.username === registerUsername.value
  );
  if (userExists) {
    popover.value.show("用户名已存在");
    return;
  }

  // 注册新用户
  userArray.push({
    username: registerUsername.value,
    password: registerPassword.value,
  });

  popover.value.show("注册成功");
  console.log("注册成功");
  
  // 注册成功后自动切换到登录表单
  showRegisterForm.value = false;
  // 清空注册表单
  registerUsername.value = "";
  registerPassword.value = "";
  confirmPassword.value = "";
};

// 动画加载完毕触发这个方法
const particlesLoaded = () => {
  console.log("particlesLoaded");
};

// 动画的配置
const particlesOptions = {
  fullScreen: {
    zIndex: 1,
  },
  emitters: [
    {
      position: {
        x: 0,
        y: 30,
      },
      rate: {
        quantity: 5,
        delay: 0.15,
      },
      particles: {
        move: {
          direction: "top-right",
          outModes: {
            top: "none",
            left: "none",
            default: "destroy",
          },
        },
      },
    },
    {
      position: {
        x: 100,
        y: 30,
      },
      rate: {
        quantity: 5,
        delay: 0.15,
      },
      particles: {
        move: {
          direction: "top-left",
          outModes: {
            top: "none",
            right: "none",
            default: "destroy",
          },
        },
      },
    },
  ],
  particles: {
    color: {
      value: ["#ffffff", "#FF0000"],
    },
    move: {
      decay: 0.05,
      direction: "top",
      enable: true,
      gravity: {
        enable: true,
      },
      outModes: {
        top: "none",
        default: "destroy",
      },
      speed: {
        min: 10,
        max: 50,
      },
    },
    number: {
      value: 0,
    },
    opacity: {
      value: 1,
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: "random",
      animation: {
        enable: true,
        speed: 30,
      },
    },
    tilt: {
      direction: "random",
      enable: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 30,
      },
    },
    size: {
      value: {
        min: 0,
        max: 2,
      },
      animation: {
        enable: true,
        startValue: "min",
        count: 1,
        speed: 16,
        sync: true,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 5,
        max: 15,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      speed: {
        min: -7,
        max: 7,
      },
    },
    shape: {
      type: ["circle", "square", "triangle", "polygon", "emoji", "image"],
      options: {
        polygon: [
          {
            sides: 5,
          },
          {
            sides: 6,
          },
        ],
        emoji: {
          particles: {
            size: {
              value: 8,
            },
          },
          value: ["💩", "🤡", "🍀", "🍙", "🦄", "⭐️"],
        },
        image: [
          {
            src: "https://particles.js.org/images/fruits/apple.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/avocado.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/banana.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/berries.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/cherry.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/grapes.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/lemon.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/orange.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/peach.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/pear.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/pepper.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/plum.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/star.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/strawberry.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/watermelon.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
          {
            src: "https://particles.js.org/images/fruits/watermelon_slice.png",
            width: 32,
            height: 32,
            particles: {
              size: {
                value: 16,
              },
            },
          },
        ],
      },
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://xqimg.imedao.com/18f036eaa913490d3fead05e.jpg%21800.jpg");
  background-size: cover;
  background-position: center;
  background-color: black;
  z-index: 2;
}

.bg-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.zhanghao {
  color: white;
  font-size: 14px;
}

.zhuce {
  color: red;
  cursor: pointer;
}

.zhuce:hover {
  color: blue;
}

.yemian {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 400px;
  border-radius: 10px;
  animation: fadeIn 1s ease-in-out;
  z-index: 999;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 40px;
  color: white;
}

.username {
  width: 80%;
  height: 35px;
  padding: 0 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid white;
  border-radius: 5px;
  background-color: black;
  color: white;
}

.username:hover {
  outline: none;
  border-bottom: 2px solid rgb(255, 0, 25);
}

.username:focus {
  outline: none;
  border-bottom: 2px solid blue;
}

.password-container {
  position: relative;
  width: 80%;
  margin-bottom: 10px;
}

.password {
  width: 100%;
  height: 35px;
  padding: 0 30px 0 10px;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid white;
  border-radius: 5px;
  background-color: black;
  color: white;
}

.password:hover {
  outline: none;
  border-bottom: 2px solid rgb(255, 0, 25);
}

.password:focus {
  outline: none;
  border-bottom: 2px solid blue;
}

/* 移除冗余的图标样式注释，其他样式保持不变 */
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  /* 可选：添加鼠标悬停效果 */
  /* opacity: 0.8; */
  /* transition: opacity 0.3s; */
}

.toggle-password:hover {
  /* opacity: 1; */
  color: #007bff;
}

.imgzy {
  width: 25px;
  height: 25px;
}

.denglu {
  width: 80%;
  height: 35px;
  margin-top: 20px;
  color: white;
  background-color: rgb(0, 128, 255);
  cursor: pointer;
  border: none;
  font-weight: bold;
  border-radius: 2px;
}

.denglu:hover {
  background-color: blue;
}
</style>
