<template>
  <!-- 整个聊天页面 -->
  <div class="chat-container">
    <!-- 左侧好友列表 -->
    <div class="friend-list">
      <!-- 好友条目 -->
      <div
        v-for="friend in sortedfriends"
        :key="friend.id"
        @click="haoyou(friend.id)"
        :class="['friend-item', { active: activeFriendId === friend.id }]"
      >
        <img class="avatar" :src="friend.avatar" />
        <div class="friend-item-right">
          <!-- 名字和时间 -->
          <div class="friend-item-right-top">
            <span>{{ friend.name }}</span>
            <span class="sj">{{ friend.lastMessageTime }}</span>
          </div>
          <div class="xiaoxi">
            <!-- 最后一条消息 -->
            <span>{{ friend.lastMessage }}</span>
          </div>
        </div>
      </div>
    </div>

        <!-- 新增下载成功提示 -->
    <div v-if="showDownloadSuccess" class="download-success-message">
      {{ downloadSuccessMessage }}
    </div>

    <!-- 主内容区域 -->
    <div class="zhuquyu">
      <!-- 聊天区域 -->
      <div
        class="liaotianquyu"
        :class="{ 'no-scroll': !isOverflowing }"
        ref="chatMessages"
      >
        <!-- 显示当前好友的聊天记录 -->
        <div v-for="(message, index) in currentChatHistory" :key="index">
          <!-- 别人发送的消息 -->
          <div v-if="message.sender === 'opponent'" class="ltxiaoxiym opponent-message">
            <img class="avatar" :src="message.avatar" />
            <div class="ltxiaoxi">
              <!-- 对方发送的图片 -->
              <div v-if="message.type === 'image'" class="media-content">
                <img v-if="message.mediaUrl" :src="message.mediaUrl" class="media-preview" @click="openMediaViewer(message.mediaUrl, 'image')" />
              </div>
              <!-- 对方发送的视频 -->
              <div v-else-if="message.type === 'video'" class="media-content">
                <video v-if="message.mediaUrl" controls class="media-preview" @click="openMediaViewer(message.mediaUrl, 'video')">
                  <source :src="message.mediaUrl" type="video/mp4">
                  您的浏览器不支持视频播放
                </video>
              </div>
              <!-- 对方发送的文本 -->
              <div v-else class="opponent-xiaoxi">{{ message.content }}</div>
              <div class="sj">{{ message.time }}</div>
            </div>
          </div>

          <!-- 自己发送的消息 -->
          <div v-else class="ltxiaoxiym my-message">
            <img class="avatar" :src="message.avatar" />
            <div class="myltxiaoxi">
              <!-- 自己发送的图片 -->
              <div v-if="message.type === 'image'" class="media-content">
                <img v-if="message.mediaUrl" :src="message.mediaUrl" class="media-preview" @click="openMediaViewer(message.mediaUrl, 'image')" />
              </div>
              <!-- 自己发送的视频 -->
              <div v-else-if="message.type === 'video'" class="media-content">
                <video v-if="message.mediaUrl" controls class="media-preview" @click="openMediaViewer(message.mediaUrl, 'video')">
                  <source :src="message.mediaUrl" type="video/mp4">
                  您的浏览器不支持视频播放
                </video>
              </div>
              <!-- 自己发送的文本 -->
              <div v-else class="my-xiaoxi">{{ message.content }}</div>
              <div class="mysj">{{ message.time }}</div>
            </div>
          </div>
        </div>
      </div>

    <!-- 媒体查看器模态框 -->
    <div v-if="showMediaViewer" class="media-viewer" @click.self="closeMediaViewer">
      <div class="media-viewer-content">
        <button class="close-button" @click="closeMediaViewer">×</button>
        <div class="media-toolbar" v-if="viewerType === 'image'">
          <button @click="downloadImage(currentMediaUrl)" class="toolbar-button" title="下载图片">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
          </button>
        </div>
        <img v-if="viewerType === 'image'" :src="currentMediaUrl" class="full-media" />
        <video v-else controls autoplay class="full-media">
          <source :src="currentMediaUrl" type="video/mp4">
          您的浏览器不支持视频播放
        </video>
      </div>
    </div>

      <!-- 输入和发送内容区域 -->
      <div class="chat-area">
        <!-- 媒体按钮区域 -->
        <div class="media-buttons">
          <button @click="openFilePicker('image')" class="media-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
            </svg>
          </button>
          <button @click="openFilePicker('video')" class="media-button">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"/>
            </svg>
          </button>
          <input 
            type="file" 
            ref="imageInput" 
            accept="image/*" 
            style="display: none" 
            @change="handleImageUpload"
          >
          <input 
            type="file" 
            ref="videoInput" 
            accept="video/*" 
            style="display: none" 
            @change="handleVideoUpload"
          >
        </div>
        
        <div class="input-container">
          <input
            v-model="inputMessage"
            class="liaotiankuang"
            type="text"
            placeholder="请输入要发送的消息,按回车键发送消息"
            @keyup.enter="fasongxiaoxi"
          />
          <button @click="fasongxiaoxi" class="fasong">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";

// 好友列表数据
const friends = ref([
{
  id: 1,
  name: "蔡徐坤",
  avatar: "https://b0.bdstatic.com/a57bac6471e8e04cdb24a8b98a9e5ad9.jpg@h_1280",
  lastMessage: "你干嘛哎呦？",
  lastMessageTime: "12:30:57",
},
{
  id: 3,
  name: "李四",
  avatar: "/src/assets/image/head2.webp",
  lastMessage: "晚上一起吃饭吗？",
  lastMessageTime: "昨天",
},
{
  id: 4,
  name: "王五",
  avatar: "/src/assets/image/head3.webp",
  lastMessage: "项目进展如何？",
  lastMessageTime: "前天",
},
{
  id: 5,
  name: "赵六",
  avatar: "/src/assets/image/head4.webp",
  lastMessage: "明天有空吗",
  lastMessageTime: "上周",
},
{
  id: 2,
  name: "张三",
  avatar: "/src/assets/image/head1.webp",
  lastMessage: "记得明天开会",
  lastMessageTime: "2.30:39",
},
{
  id: 6,
  name: "坤坤",
  avatar: "https://img0.baidu.com/it/u=633096351,741701515&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800",
  lastMessage: "早上记得吃饭",
  lastMessageTime: "上周",
},
]);

// 为每个好友维护独立的聊天历史
const chatHistories = ref<Record<number, Array<{
sender: 'me' | 'opponent';
avatar: string;
content: string;
time: string;
type?: 'text' | 'image' | 'video';
mediaUrl?: string;
}>>>({});

// 文件输入引用
const imageInput = ref<HTMLInputElement | null>(null);
const videoInput = ref<HTMLInputElement | null>(null);

// 媒体查看器相关状态
const showMediaViewer = ref(false);
const currentMediaUrl = ref("");
const viewerType = ref<"image" | "video">("image");

// 打开媒体查看器
const openMediaViewer = (url: string, type: "image" | "video") => {
currentMediaUrl.value = url;
viewerType.value = type;
showMediaViewer.value = true;
};

// 关闭媒体查看器
const closeMediaViewer = () => {
showMediaViewer.value = false;
};

// 打开文件选择器
const openFilePicker = (type: 'image' | 'video') => {
if (type === 'image' && imageInput.value) {
  imageInput.value.click();
} else if (type === 'video' && videoInput.value) {
  videoInput.value.click();
}
};

// 处理图片上传
const handleImageUpload = (event: Event) => {
const input = event.target as HTMLInputElement;
if (input.files && input.files[0] && activeFriendId.value !== null) {
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const imageUrl = e.target?.result as string;
    
    // 添加到聊天历史
    const newMessage = {
      sender: 'me' as const,
      avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
      content: '[图片]',
      time: new Date().toLocaleTimeString(),
      type: 'image' as const,
      mediaUrl: imageUrl
    };
    
    if (!chatHistories.value[activeFriendId.value!]) {
      chatHistories.value[activeFriendId.value!] = [];
    }
    
    chatHistories.value[activeFriendId.value!].push(newMessage);
    
    // 更新最后一条消息
    const friendIndex = friends.value.findIndex(f => f.id === activeFriendId.value);
    if (friendIndex !== -1) {
      friends.value[friendIndex].lastMessage = '[图片]';
      friends.value[friendIndex].lastMessageTime = new Date().toLocaleTimeString();
    }

    // 模拟对方回复
    setTimeout(() => {
      const replyMessage = {
        sender: 'opponent' as const,
        avatar: friends.value[friendIndex].avatar,
        content: '图片已收到',
        time: new Date().toLocaleTimeString(),
        type: 'text' as const 
      };
      chatHistories.value[activeFriendId.value!].push(replyMessage);
      
      // 更新好友的最后一条消息
      friends.value[friendIndex].lastMessage = replyMessage.content;
      friends.value[friendIndex].lastMessageTime = replyMessage.time;
      
      // 滚动到底部
      scrollToBottom();
    }, 1000);
    
    // 滚动到底部
    scrollToBottom();
  };
  
  reader.readAsDataURL(file);
  input.value = ''; // 清除输入，以便可以再次选择同一文件
}
console.log("发送图片成功");
};


// 处理视频上传
const handleVideoUpload = (event: Event) => {
const input = event.target as HTMLInputElement;
if (input.files && input.files[0] && activeFriendId.value !== null) {
  const file = input.files[0];
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const videoUrl = e.target?.result as string;
    
    // 添加到聊天历史
    const newMessage = {
      sender: 'me' as const,
      avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
      content: '[视频]',
      time: new Date().toLocaleTimeString(),
      type: 'video' as const,
      mediaUrl: videoUrl
    };
    
    if (!chatHistories.value[activeFriendId.value!]) {
      chatHistories.value[activeFriendId.value!] = [];
    }
    
    chatHistories.value[activeFriendId.value!].push(newMessage);
    
    // 更新最后一条消息
    const friendIndex = friends.value.findIndex(f => f.id === activeFriendId.value);
    if (friendIndex !== -1) {
      friends.value[friendIndex].lastMessage = '[视频]';
      friends.value[friendIndex].lastMessageTime = new Date().toLocaleTimeString();
    }
    
    // 模拟对方回复
    setTimeout(() => {
      const replyMessage = {
        sender: 'opponent' as const,
        avatar: friends.value[friendIndex].avatar,
        content: '视频已收到',
        time: new Date().toLocaleTimeString(),
        type: 'text' as const
      };
      chatHistories.value[activeFriendId.value!].push(replyMessage);
      
      // 更新好友的最后一条消息
      friends.value[friendIndex].lastMessage = replyMessage.content;
      friends.value[friendIndex].lastMessageTime = replyMessage.time;
      
      // 滚动到底部
      scrollToBottom();
    }, 1000);
    
    // 滚动到底部
    scrollToBottom();
  };
  
  reader.readAsDataURL(file);
  input.value = ''; // 清除输入，以便可以再次选择同一文件
}
console.log("发送视频成功");

};

// 新增一个状态来控制提示信息的显示
const showDownloadSuccess = ref(false);
const downloadSuccessMessage = ref('');
    // 下载图片
    const downloadImage = (imageUrl: string) => {
  const link = document.createElement('a');
  link.href = imageUrl;

  // 从URL中提取文件名，如果没有则使用默认文件名
  let fileName = 'downloaded_image';
  try {
    const url = new URL(imageUrl);
    const pathname = url.pathname;
    const lastSlashIndex = pathname.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      fileName = pathname.substring(lastSlashIndex + 1) || fileName;
    }
  } catch (e) {
    console.warn('无法解析URL，使用默认文件名');
  }
  
  // 确保文件名有正确的扩展名
  if (!fileName.includes('.')) {
    const extension = imageUrl.split(';')[0].split('/')[1];
    fileName += `.${extension}`;
  }
  
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  console.log("下载图片成功");

  // 显示下载成功提示
  downloadSuccessMessage.value = '下载成功';
  showDownloadSuccess.value = true;
  
  // 一段时间后隐藏提示
  setTimeout(() => {
    showDownloadSuccess.value = false;
  }, 2000);
};;

// 初始化聊天历史
const initializeChatHistories = () => {
friends.value.forEach(friend => {
  if (!chatHistories.value[friend.id]) {
    chatHistories.value[friend.id] = [];
  }
  
  // 为每个好友添加不同的初始消息
  switch(friend.id) {
    case 1: // 蔡徐坤
      chatHistories.value[friend.id] = [
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '你好，我是蔡徐坤',
          time: '12:30:10',
          type: 'text'
        },
        {
          sender: 'me',
          avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
          content: '你好，我是练习时长两年半的个人练习生',
          time: '12:30:30',
          type: 'text'
        },
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '你干嘛哎呦？',
          time: '12:30:57',
          type: 'text'
        }
      ];
      break;
      
    case 2: // 张三
      chatHistories.value[friend.id] = [
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '记得明天开会',
          time: '09:15:22',
          type: 'text'
        },
        {
          sender: 'me',
          avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
          content: '好的，几点？',
          time: '09:16:10',
          type: 'text'
        },
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '上午10点,别迟到',
          time: '09:16:45',
          type: 'text'
        }
      ];
      break;
      
    case 3: // 李四
      chatHistories.value[friend.id] = [
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '晚上一起吃饭吗？',
          time: '18:30:00',
          type: 'text'
        },
        {
          sender: 'me',
          avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
          content: '可以啊，去哪吃？',
          time: '18:31:15',
          type: 'text'
        }
      ];
      break;
      
    case 4: // 王五
      chatHistories.value[friend.id] = [
        {
          sender: 'me',
          avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
          content: '项目进展如何？',
          time: '14:20:00',
          type: 'text'
        },
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '还在进行中，预计下周完成',
          time: '14:22:30',
          type: 'text'
        }
      ];
      break;
      
    case 5: // 赵六
      chatHistories.value[friend.id] = [
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '明天有空吗',
          time: '20:15:00',
          type: 'text'
        },
        {
          sender: 'me',
          avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
          content: '明天没空 ',
          time: '21:32:15',
          type: 'text'
        }
      ];
      break;
      
    case 6: // 坤坤
      chatHistories.value[friend.id] = [
        {
          sender: 'opponent',
          avatar: friend.avatar,
          content: '早上记得吃饭',
          time: '07:30:00',
          type: 'text'
        },
        {
          sender: 'me',
          avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
          content: '好的，你也是',
          time: '07:32:15',
          type: 'text'
        }
      ];
      break;
  }
  
  // 更新最后一条消息和时间
  const lastMessage = chatHistories.value[friend.id].at(-1);
  if (lastMessage) {
    const friendIndex = friends.value.findIndex(f => f.id === friend.id);
    if (friendIndex!== -1) {
      friends.value[friendIndex].lastMessage = lastMessage.content;
      friends.value[friendIndex].lastMessageTime = lastMessage.time;
    }
  }
});
};

// 当前选中的好友 ID
const activeFriendId = ref<number | null>(null);

// 当前显示的聊天记录
const currentChatHistory = computed(() => {
if (activeFriendId.value === null) return [];
return chatHistories.value[activeFriendId.value] || [];
});

// 输入框的内容
const inputMessage = ref("");

// 判断内容是否溢出
const isOverflowing = ref(false);

// 添加聊天区域引用
const chatMessages = ref<HTMLElement | null>(null);

const checkOverflow = () => {
const chatMessages = document.querySelector(".liaotianquyu");
if (chatMessages) {
  isOverflowing.value = chatMessages.scrollHeight > chatMessages.clientHeight;
}
};

// 滚动到底部方法
const scrollToBottom = () => {
if (chatMessages.value) {
  chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
}
};

// 点击好友条目时设置当前选中的好友 ID
const haoyou = (friendId: number) => {
activeFriendId.value = friendId;

// 在DOM更新后滚动到底部
nextTick(() => {
  scrollToBottom();
});
};

// 发送消息
const fasongxiaoxi = () => {
if (inputMessage.value.trim() === "" || activeFriendId.value === null) return;
console.log("发送成功");


// 1. 添加到当前聊天历史
const newMessage = {
  sender: 'me' as const,
  avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
  content: inputMessage.value,
  time: new Date().toLocaleTimeString(),
  type: 'text' as const
};

if (!chatHistories.value[activeFriendId.value]) {
  chatHistories.value[activeFriendId.value] = [];
}

chatHistories.value[activeFriendId.value].push(newMessage);

// 2. 更新当前好友的最后一条消息
const friendIndex = friends.value.findIndex(f => f.id === activeFriendId.value);
if (friendIndex!== -1) {
  friends.value[friendIndex].lastMessage = inputMessage.value;
  friends.value[friendIndex].lastMessageTime = new Date().toLocaleTimeString();
}

// 3. 模拟对方回复
setTimeout(() => {
  const replyMessage = {
    sender: 'opponent' as const,
    avatar: friends.value[friendIndex].avatar,
    content: getRandomReply(),
    time: new Date().toLocaleTimeString(),
    type: 'text' as const
  };
  
  if (activeFriendId.value!== null) {
    chatHistories.value[activeFriendId.value].push(replyMessage);
  }
  
  // 更新好友的最后一条消息
  friends.value[friendIndex].lastMessage = replyMessage.content;
  friends.value[friendIndex].lastMessageTime = replyMessage.time;
  
  // 滚动到底部
  scrollToBottom();
}, 1000);

inputMessage.value = "";
// 在DOM更新后滚动到底部
nextTick(() => {
  scrollToBottom();
});
};

// 随机回复消息
const getRandomReply = () => {
const replies = [
  "好的",
  "我知道了",
  "谢谢",
  "嗯嗯",
  "明白了",
  "稍等",
  "在忙，晚点回复",
  "OK",
  "👌",
  "哈哈",
  "是"
];
return replies[Math.floor(Math.random() * replies.length)];
};

// 好友列表排序
const sortedfriends = computed(() => {
return friends.value.slice().sort((a, b) => a.id - b.id);
});

// 在组件挂载时初始化
onMounted(() => {
initializeChatHistories();
if (friends.value.length > 0) {
  activeFriendId.value = friends.value[0].id;
}
scrollToBottom();
});

// 监听聊天历史变化
watch(currentChatHistory, () => {
nextTick(() => {
  scrollToBottom();
  checkOverflow();
});
}, { deep: true });
</script>

<style scoped>
/* 原有样式保持不变 */
.my-message {
margin-left: auto;
margin-right: 5px;
flex-direction: row-reverse;
}

.opponent-message {
margin-right: auto;
margin-left: 5px;
}

.chat-container {
width: 100vw;
height: 100vh;
display: flex;
}

.friend-list {
width: 20vw;
height: 100vh;
background-color: #fff;
overflow-y: auto;
}

.avatar {
width: 60px;
height: 60px;
border-radius: 4px;
}

.friend-item-right {
display: flex;
flex-direction: column;
justify-content: space-between;
flex-grow: 1;
margin-left: 10px;
}

.xiaoxi {
margin-top: 10px;
color: #666;
max-width: 200px;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
display: inline-block;
}

.friend-item {
display: flex;
align-items: center;
padding: 10px;
border-bottom: 1px solid #ddd;
}

.friend-item:hover {
background-color: #e0e0e0;
cursor: pointer;
}

.friend-item.active {
background-color: rgb(193 193 193);
}

.friend-item-right-top {
display: flex;
justify-content: space-between;
}

.zhuquyu {
width: 80vw;
display: flex;
flex-direction: column;
background-color: #f5f5f5;
}

.liaotianquyu {
flex: 1;
padding: 10px;
overflow-y: auto;
}

.liaotianquyu.no-scroll {
/* overflow-y: hidden; */
}

.ltxiaoxiym {
display: flex;
max-width: 80;
border-radius: 15px;
padding: 10px;
margin-bottom: 10px;
}

.ltxiaoxi {
display: flex;
flex-direction: column;
max-width: 80%;
background-color: #fff;
border-radius: 15px;
padding: 10px;
border: 1px solid #ddd;
}

.myltxiaoxi {
display: flex;
flex-direction: column;
max-width: 80%;
background-color: #dcf8c6;
border-radius: 15px;
padding: 10px;
border: 1px solid #ddd;
}

.chat-area {
display: flex;
flex-direction: column;
padding: 10px 20px;
background-color: #f5f5f5;
border-top: 1px solid #ddd;
border: none;
}

.media-buttons {
display: flex;
padding: 5px 0;
gap: 10px;
}

.media-button {
background: none;
border: none;
cursor: pointer;
color: #666;
padding: 5px;
border-radius: 4px;
display: flex;
align-items: center;
justify-content: center;
}

.media-button:hover {
background-color: #e0e0e0;
color: #333;
}

.input-container {
display: flex;
width: 100%;
}

.liaotiankuang {
flex: 1;
padding: 10px;
border: 1px solid #ddd;
border-radius: 4px;
}

.liaotiankuang:focus {
outline: none;
}

.fasong {
background-color: rgb(146, 205, 251);
border: none;
padding: 10px 20px;
margin-left: 10px;
border-radius: 4px;
cursor: pointer;
}

.fasong:hover {
background-color: rgb(120, 190, 240);
}

.sj {
font-size: 15px;
color: #888;
}

.mysj {
text-align: right;
font-size: 15px;
color: #888;
}

/* 媒体消息样式 */
.media-content {
margin: 5px 0;
cursor: pointer;
}

.media-preview {
max-width: 300px;
max-height: 300px;
border-radius: 8px;
object-fit: contain;
}

/* 媒体查看器样式 */
.media-viewer {
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(0, 0, 0, 0.8);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
}

.media-viewer-content {
position: relative;
max-width: 90%;
max-height: 90%;
}

.full-media {
max-width: 100%;
max-height: 80vh;
display: block;
margin: 0 auto;
}

.close-button {
position: absolute;
top: -40px;
right: 0;
background: none;
border: none;
color: white;
font-size: 30px;
cursor: pointer;
padding: 5px 15px;
}

.close-button:hover {
color: #ccc;
}

/* 媒体工具栏样式 */
.media-toolbar {
  position: absolute;
  top: -40px;
  left: 0;
  display: flex;
  gap: 10px;
}

.toolbar-button {
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.toolbar-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.toolbar-button svg {
  width: 20px;
  height: 20px;
}

/* 调整关闭按钮位置 */
.close-button {
  top: -40px;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  padding: 0;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

/* 文本消息样式 */
.opponent-xiaoxi, .my-xiaoxi {
word-break: break-word;
white-space: pre-wrap;
}

.download-success-message {
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
    z-index: 1001;
    animation: fadeIn 0.3s ease-in-out;
}
</style>