<template>
  <!-- 主聊天容器 -->
  <div class="chat-container">
    <!-- 侧边栏，显示好友列表 -->
    <div class="sidebar">
      <!-- 遍历好友列表，为每个好友创建一个项 -->
      <!-- 如果当前好友被选中，则添加active类 -->
      <!-- 点击好友时选择该好友 -->
      <!-- 鼠标悬停时高亮好友 -->
      <!-- 鼠标离开时取消高亮 -->
      <div
        v-for="(friend, index) in friends"
        :key="index"
        class="friend-item"
        :class="{ active: selectedFriendIndex === index }"
        @click="selectFriend(index)"
      >
        <img :src="friend.avatar" alt="avatar" class="avatar" />
        <!-- 显示好友头像 -->
        <div class="info">
          <div class="name-time">
            <span class="name">{{ friend.name }}</span>
            <!-- 显示好友名称 -->
            <span class="time">{{ friend.lastMessageTime }}</span>
            <!-- 显示最后一条消息的时间 -->
          </div>
          <div class="message">{{ friend.lastMessageContent }}</div>
          <!-- 显示最后一条消息的内容 -->
        </div>
      </div>
    </div>
    <!-- 主内容区域，显示聊天记录和输入框 -->
    <div class="main-content">
      <!-- 聊天记录区域 -->
      <div class="chat-history">
        <!-- 遍历聊天记录，为每条消息创建一个项 -->
        <div v-for="(message, index) in chatHistory" :key="index">
          <!-- 展示好友发送的消息 -->
          <div
            class="message-item"
            :class="{ self: message.isSelf }"
            v-if="!message.isSelf"
          >
            <!-- 好友头像 -->
            <img :src="message.avatar" alt="avatar" class="avatar" />
            <!-- 三角形 -->
            <span
              class="left-message-bubble-triangle"
              :class="{
                leftMessageBubbleTriangle: index === hoverIndexMessage,
              }"
            ></span>
            <!-- 显示消息发送者的头像（如果不是自己） -->
            <div
              class="message-bubble"
              @mouseover="hoverFriendMessage(index)"
              @mouseleave="leaveFriendMessage()"
            >
              <!-- 显示消息内容 -->
              <div class="message-text">{{ message.content }}</div>
              <!-- 显示消息发送时间 -->
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>
          <!-- 展示自己发送的消息 -->
          <div v-else class="message-item" :class="{ self: message.isSelf }">
            <!-- 显示消息发送者的头像（如果不是自己） -->
            <div
              class="message-bubble"
              @mousemove="hoverSelfMessage(index)"
              @mouseleave="leaveSelfMessage()"
            >
              <!-- 显示消息内容 -->
              <div class="message-text">{{ message.content }}</div>
              <!-- 显示消息发送时间 -->
              <div class="message-time">{{ message.time }}</div>
            </div>
            <!-- 三角形 -->
            <span
              class="right-message-bubble-triangle"
              :class="{
                rightMessageBubbleTriangle: index === hoverIndexSelfMessage,
              }"
            ></span>
            <img
              v-if="message.isSelf"
              :src="currentAvatar"
              alt="avatar"
              class="avatar"
            />
            <!-- 显示自己的头像（如果是自己发送的消息） -->
          </div>
        </div>
      </div>
      <!-- 输入区域，包含消息输入框和发送按钮 -->
      <div class="input-area">
        <!-- 绑定输入框的值到newMessage变量 -->
        <!-- 按下回车键时发送消息 -->
        <!-- 输入框占位符 -->
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="请输入要发送的消息,按回车键发送消息"
        />
        <button @click="sendMessage">发送</button>
        <!-- 发送按钮，点击时发送消息 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";

// 定义好友接口
interface Friend {
  avatar: string; // 头像地址
  name: string; // 好友名称
  lastMessageTime: string; // 最后一条消息的时间
  lastMessageContent: string; // 最后一条消息的内容
}

// 定义消息接口
interface Message {
  avatar: string; // 发送者头像地址
  content: string; // 消息内容
  time: string; // 消息发送时间
  isSelf: boolean; // 是否是自己发送的消息
}

// 好友列表
const friends = ref<Friend[]>([
  {
    avatar: "src/assets/image/head1.webp",
    name: "Alice",
    lastMessageTime: "10:00 AM",
    lastMessageContent: "Hello",
  },
  {
    avatar: "src/assets/image/head2.webp",
    name: "Bob",
    lastMessageTime: "11:00 AM",
    lastMessageContent: "Hi there",
  },
  {
    avatar: "src/assets/image/head3.webp",
    name: "Charlie",
    lastMessageTime: "12:00 PM",
    lastMessageContent: "Hey",
  },
  {
    avatar: "src/assets/image/head4.webp",
    name: "David",
    lastMessageTime: "1:00 PM",
    lastMessageContent: "What's up?",
  },
  {
    avatar: "src/assets/image/head5.webp",
    name: "Eve",
    lastMessageTime: "2:00 PM",
    lastMessageContent: "See you later",
  },
]);

// 聊天记录
const chatRecords = ref<{ [key: number]: Message[] }>({
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
});

// 当前选中的好友索引
const selectedFriendIndex = ref<number | null>(null);
// 当前聊天记录
const chatHistory = ref<Message[]>([]);
// 新消息输入框的内容
const newMessage = ref<string>("");
// 自己的头像地址
const currentAvatar = "src/assets/image/head5.webp";
// 鼠标悬停的好友消息索引
const hoverIndexMessage = ref<number | null>(null);
// 鼠标悬停的自己消息索引
const hoverIndexSelfMessage = ref<number | null>(null);

// 选择好友时调用的方法
const selectFriend = (index: number) => {
  selectedFriendIndex.value = index; // 设置选中的好友索引
  chatHistory.value = chatRecords.value[index] || []; // 更新聊天记录
};

// 发送消息时调用的方法
const sendMessage = () => {
  if (newMessage.value.trim() && selectedFriendIndex.value !== null) {
    const message: Message = {
      avatar: currentAvatar, // 设置消息发送者的头像
      content: newMessage.value, // 设置消息内容
      time: new Date().toLocaleTimeString(), // 设置消息发送时间
      isSelf: true, // 标记为自己的消息
    };
    // chatHistory.value.push(message); // 将消息添加到聊天记录
    chatRecords.value[selectedFriendIndex.value].push(message); // 将消息添加到对应好友的聊天记录

    // 更新选中好友的最后一条消息
    const friend = friends.value[selectedFriendIndex.value];
    friend.lastMessageContent = newMessage.value;
    friend.lastMessageTime = message.time;
    newMessage.value = ""; // 清空输入框
    saveData(); // 保存数据到本地存储
  }
};
// 鼠标悬浮到好友消息的气泡上
const hoverFriendMessage = (index: number) => {
  hoverIndexMessage.value = index;
  console.log("鼠标悬浮到好友消息的气泡上");
  // 鼠标悬浮到此消息气泡上时,改变伪选择器的样式
};
// 鼠标离开好友消息的气泡时调用的方法
const leaveFriendMessage = () => {
  // 清空鼠标悬停的好友消息索引
  hoverIndexMessage.value = null;
};
// 鼠标悬浮到自己消息的气泡上
const hoverSelfMessage = (index: number) => {
  hoverIndexSelfMessage.value = index;
};
// 鼠标离开自己消息的气泡时调用的方法
const leaveSelfMessage = () => {
  // 清空鼠标悬停的自己消息索引
  hoverIndexSelfMessage.value = null;
};


// 保存数据到本地存储
const saveData = () => {
  localStorage.setItem("friends", JSON.stringify(friends.value)); // 保存好友列表
  localStorage.setItem("chatRecords", JSON.stringify(chatRecords.value)); // 保存聊天记录
};

// 从本地存储加载数据
const loadData = () => {
  const storedFriends = localStorage.getItem("friends");
  const storedChatRecords = localStorage.getItem("chatRecords");

  if (storedFriends) {
    friends.value = JSON.parse(storedFriends); // 加载好友列表
  }

  if (storedChatRecords) {
    chatRecords.value = JSON.parse(storedChatRecords); // 加载聊天记录
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadData();
});

// 监听选中的好友索引变化，更新聊天记录
watch(selectedFriendIndex, (newIndex) => {
  console.log("选中的好友索引变化", newIndex);
  if (newIndex !== null) {
    chatHistory.value = chatRecords.value[newIndex] || [];
  }
});
</script>

<style scoped>
.time {
  color: #888;
  font-size: 12px;
}

/* 主聊天容器样式 */
.chat-container {
  display: flex;
  height: 100vh;
}

/* 侧边栏样式 */
.sidebar {
  /* 占20份 */
  width: 20vw;
  background-color: #f5f5f5;
  padding: 10px;
}

/* 好友项样式 */
.friend-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

/* 好友项悬停样式 */
.friend-item:hover {
  background-color: #e0e0e0;
}

/* 选中的好友项样式 */
.friend-item.active {
  background-color: #d0d0d0;
}

/* 头像样式 */
.avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 2px;
}

/* 好友信息样式 */
.info {
  flex-grow: 1;
  width: 170px;
  height: 50px;
}

/* 好友名称和时间样式 */
.name-time {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

/* 好友最后一条消息样式 */
.message {
  white-space: nowrap; /* 防止内容换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  margin-top: 10px; /* 上边距 */
  width: 100%; /* 确保容器有固定宽度，可以根据实际情况调整 */
  color: #888;
  font-size: 12px;
}

/* 主内容区域样式 */
.main-content {
  /* 占80份 */
  width: 80vw;
  /* 把当前聊天区域div变成弹性盒子 */
  display: flex;
  /* 垂直方向为从上到下排列 */
  flex-direction: column;
}

/* 聊天记录区域样式 */
.chat-history {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

/* 消息项样式 */
.message-item {
  display: flex;
  margin-bottom: 10px;
}

/* 自己发送的消息项样式 */
.message-item.self {
  justify-content: flex-end;
}

/* 左侧消息气泡默认样式 */
.message-bubble {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  background-color: #fff;
  border-radius: 15px;
  padding: 10px;
}
/* 鼠标悬浮到此样式修饰的元素上 */
.message-bubble:hover {
  background-color: #d0d0d0;
}
/* 左侧消息气泡鼠标悬浮样式 */

/* 左侧消息气泡的三角形默认样式 */
.left-message-bubble-triangle {
  margin-top: 15px;
  width: 0px;
  height: 0px;
  border-style: solid;
  border-color: transparent #fff transparent transparent; /* 改变三角形颜色 */
  border-width: 5px 10px 5px 0; /* 改变三角形大小 */
}
/* 右侧消息气泡的三角形默认样式 */
.right-message-bubble-triangle {
  margin-top: 15px;
  width: 0px;
  height: 0px;
  border-style: solid;
  border-color: transparent transparent transparent #fff; /* 改变三角形颜色 */
  border-width: 5px 0px 5px 10px; /* 改变三角形大小 */
}
/* 左侧消息气泡的三角形鼠标悬浮样式 */
.leftMessageBubbleTriangle {
  border-color: transparent #d0d0d0 transparent transparent; /* 改变三角形颜色 */
}
/* 右侧消息气泡的三角形鼠标悬浮样式 */
.rightMessageBubbleTriangle {
  border-color: transparent transparent transparent #d0d0d0; /* 改变三角形颜色 */
}
/* 自己发送的消息气泡三角形样式 */
.message-item.self .message-bubble::before {
  right: -10px;
  border-width: 5px 0 5px 10px;
  border-color: transparent transparent transparent #e1ffc7;
}

/* 消息文本样式 */
.message-text {
  width: 100%;
  word-wrap: break-word;
}

/* 消息时间样式 */
.message-time {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
  text-align: right;
}

/* 输入区域样式 */
.input-area {
  display: flex;
  padding: 10px;
  background-color: #f5f5f5;
}

/* 输入框样式 */
input[type="text"] {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
}

input[type="text"]:focus {
  outline: none;
}

/* 发送按钮样式 */
button {
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

/* 发送按钮悬停样式 */
button:hover {
  background-color: #0056b3;
}
</style>
