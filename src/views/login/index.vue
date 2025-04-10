<template>
  <div class="root">
    <!-- 登录页面背景动画 -->
    <vue-particles
      class="bg-root"
      id="tsparticles"
      @particles-loaded="particlesLoaded"
      :options="particlesOptions"
    />
    <div class="login-card">
      <div class="title">登录微信</div>

      <input
        v-model="username"
        class="marginbottom10 username"
        type="text"
        placeholder="请输入用户名"
      />
      <input
        v-model="password"
        class="marginbottom10 password"
        type="password"
        placeholder="请输入密码"
      />

      <button class="login" @click="clickLogin">登录</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router"; 

// 用户名和密码
const username = ref("");
const password = ref("");

const router = useRouter();
// 定义用户数组
const userArray = [
  {
    username: "xupeilin",
    password: "123",
  },
  {
    username: "zhuziyang",
    password: "456",
  },
];

// 点击登录按钮
const clickLogin = () => {
  console.log("登录, 用户名:", username.value, "密码:", password.value);
  // 遍历数组,检查用户名和密码是否正确
  userArray.forEach((item) => {
    if (item.username == username.value && item.password == password.value) {
      console.log("登录成功");
      router.push("/chat");
    }
  });
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
.bg-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.login-card {
  width: 400px;
  height: 400px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 999;
}

.root {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
}
.marginbottom10 {
  margin-bottom: 10px;
}
.username {
  width: 80%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid #fff;
  border-radius: 2px;
  background-color: #000;
  color: #fff;
}
.username:focus {
  /* 输入框获取焦点之后隐藏4个边框 */
  outline: none;
  border-bottom: 2px solid #00f; /* 改变边框颜色为蓝色 */
}
.username:hover {
  /* 输入框获取焦点之后隐藏4个边框 */
  outline: none;
  border-bottom: 2px solid #00f; /* 改变边框颜色为蓝色 */
}

.password {
  width: 80%;
  height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  border: none;
  border-bottom: 2px solid #fff;
  border-radius: 2px;
  background-color: #000;
  color: #fff;
}
.password:hover {
  /* 输入框获取焦点之后隐藏4个边框 */
  outline: none;
  border-bottom: 2px solid #ef4d12; /* 改变边框颜色为蓝色 */
}
.password:focus {
  /* 输入框获取焦点之后隐藏4个边框 */
  outline: none;
  border-bottom: 2px solid #ef4d12; /* 改变边框颜色为蓝色 */
}
.login {
  width: 80%;
  height: 40px;
  background-color: #0d69ea;
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  margin-top: 30px;
  font-weight: bold;
}
.login:hover {
  background-color: #072dd9;
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #fff;
}
</style>
