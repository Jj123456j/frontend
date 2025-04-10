<template>
    <div class="chat-container">
      <!-- 左侧好友列表 -->
      <div class="friend-list">
        <div
          v-for="friend in sortedfriends"
          :key="friend.id"
          @click="haoyou(friend.id)"
          :class="['friend-item', { active: activeFriendId === friend.id }]"
        >
          <img class="avatar" :src="friend.avatar" />
          <div class="friend-item-right">
            <div class="friend-item-right-top">
              <span>{{ friend.name }}</span>
              <span class="sj">{{ friend.lastMessageTime }}</span>
            </div>
            <div class="xiaoxi">
              <span>{{ friend.lastMessage }}</span>
              <span v-if="friend.unreadCount > 0" class="unread-badge">{{ friend.unreadCount }}</span>
            </div>
          </div>
        </div>
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
                <div class="opponent-xiaoxi">{{ message.content }}</div>
                <div class="sj">{{ message.time }}</div>
              </div>
            </div>
  
            <!-- 自己发送的消息 -->
            <div v-else class="ltxiaoxiym my-message">
              <img class="avatar" :src="message.avatar" />
              <div class="myltxiaoxi">
                <div class="my-xiaoxi">{{ message.content }}</div>
                <div class="mysj">{{ message.time }}</div>
              </div>
            </div>
          </div>
  
          <!-- AI正在输入指示器 -->
          <div v-if="isAIResponding" class="ltxiaoxiym opponent-message">
            <img class="avatar" :src="currentFriendAvatar" />
            <div class="ltxiaoxi">
              <div class="ai-typing">
                正在输入
                <div class="typing-dots">
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                  <div class="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 输入和发送内容区域 -->
        <div class="chat-area">
          <input
            v-model="inputMessage"
            class="liaotiankuang"
            type="text"
            placeholder="请输入要发送的消息,按回车键发送消息"
            @keyup.enter="fasongxiaoxi"
            :disabled="isAIResponding"
          />
          <button @click="fasongxiaoxi" class="fasong" :disabled="isAIResponding || !inputMessage.trim()">
            {{ isAIResponding ? '等待回复...' : '发送' }}
          </button>
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
      unreadCount: 0
    },
    {
      id: 3,
      name: "李四",
      avatar: "/src/assets/image/head2.webp",
      lastMessage: "晚上一起吃饭吗？",
      lastMessageTime: "昨天",
      unreadCount: 0
    },
    {
      id: 4,
      name: "王五",
      avatar: "/src/assets/image/head3.webp",
      lastMessage: "项目进展如何？",
      lastMessageTime: "前天",
      unreadCount: 0
    },
    {
      id: 5,
      name: "赵六",
      avatar: "/src/assets/image/head4.webp",
      lastMessage: "明天有空吗",
      lastMessageTime: "上周",
      unreadCount: 0
    },
    {
      id: 2,
      name: "张三",
      avatar: "/src/assets/image/head1.webp",
      lastMessage: "记得明天开会",
      lastMessageTime: "2.30:39",
      unreadCount: 0
    },
    {
      id: 6,
      name: "坤坤",
      avatar: "https://img0.baidu.com/it/u=633096351,741701515&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800",
      lastMessage: "早上记得吃饭",
      lastMessageTime: "上周",
      unreadCount: 0
    },
  ]);
  
  // 为每个好友维护独立的聊天历史
  const chatHistories = ref<Record<number, Array<{
    sender: 'me' | 'opponent';
    avatar: string;
    content: string;
    time: string;
  }>>>({});
  
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
              time: '12:30:10'
            },
            {
              sender: 'me',
              avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
              content: '你好，我是练习时长两年半的个人练习生',
              time: '12:30:30'
            },
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '你干嘛哎呦？',
              time: '12:30:57'
            }
          ];
          break;
          
        case 2: // 张三
          chatHistories.value[friend.id] = [
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '记得明天开会',
              time: '09:15:22'
            },
            {
              sender: 'me',
              avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
              content: '好的，几点？',
              time: '09:16:10'
            },
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '上午10点,别迟到',
              time: '09:16:45'
            }
          ];
          break;
          
        case 3: // 李四
          chatHistories.value[friend.id] = [
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '晚上一起吃饭吗？',
              time: '18:30:00'
            },
            {
              sender: 'me',
              avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
              content: '可以啊，去哪吃？',
              time: '18:31:15'
            }
          ];
          break;
          
        case 4: // 王五
          chatHistories.value[friend.id] = [
            {
              sender: 'me',
              avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
              content: '项目进展如何？',
              time: '14:20:00'
            },
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '还在进行中，预计下周完成',
              time: '14:22:30'
            }
          ];
          break;
          
        case 5: // 赵六
          chatHistories.value[friend.id] = [
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '明天有空吗',
              time: '20:15:00'
            },
            {
              sender: 'me',
              avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
              content: '明天没空',
              time: '21:32:15'
            }
          ];
          break;
          
        case 6: // 坤坤
          chatHistories.value[friend.id] = [
            {
              sender: 'opponent',
              avatar: friend.avatar,
              content: '早上记得吃饭',
              time: '07:30:00'
            },
            {
              sender: 'me',
              avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
              content: '好的，你也是',
              time: '07:32:15'
            }
          ];
          break;
      }
      
      // 更新最后一条消息和时间
      const lastMessage = chatHistories.value[friend.id].at(-1);
      if (lastMessage) {
        updateLastMessage(friend.id, lastMessage);
      }
    });
  };
  
  // 当前选中的好友 ID
  const activeFriendId = ref<number | null>(null);
  // AI正在响应状态
  const isAIResponding = ref(false);
  // 输入框的内容
  const inputMessage = ref("");
  // 判断内容是否溢出
  const isOverflowing = ref(false);
  // 聊天区域引用
  const chatMessages = ref<HTMLElement | null>(null);
  
  // 计算当前好友头像
  const currentFriendAvatar = computed(() => {
    if (!activeFriendId.value) return '';
    const friend = friends.value.find(f => f.id === activeFriendId.value);
    return friend ? friend.avatar : '';
  });
  
  // 当前显示的聊天记录
  const currentChatHistory = computed(() => {
    if (activeFriendId.value === null) return [];
    return chatHistories.value[activeFriendId.value] || [];
  });
  
  // 好友列表排序
  const sortedfriends = computed(() => {
    return [...friends.value].sort((a, b) => {
      // 先按未读消息数排序
      if (a.unreadCount !== b.unreadCount) {
        return b.unreadCount - a.unreadCount;
      }
      // 再按ID排序
      return a.id - b.id;
    });
  });
  
  // 更新最后一条消息
  const updateLastMessage = (friendId: number, message: { content: string; time: string }) => {
    const friendIndex = friends.value.findIndex(f => f.id === friendId);
    if (friendIndex !== -1) {
      friends.value[friendIndex].lastMessage = message.content;
      friends.value[friendIndex].lastMessageTime = message.time;
    }
  };
  
  // 检查内容是否溢出
  const checkOverflow = () => {
    if (chatMessages.value) {
      isOverflowing.value = chatMessages.value.scrollHeight > chatMessages.value.clientHeight;
    }
  };
  
  // 滚动到底部
  const scrollToBottom = () => {
    if (chatMessages.value) {
      nextTick(() => {
        chatMessages.value!.scrollTop = chatMessages.value!.scrollHeight;
      });
    }
  };
  
  // 点击好友条目
  const haoyou = (friendId: number) => {
    // 清除未读消息
    const friendIndex = friends.value.findIndex(f => f.id === friendId);
    if (friendIndex !== -1) {
      friends.value[friendIndex].unreadCount = 0;
    }
    
    activeFriendId.value = friendId;
    scrollToBottom();
  };
  
  // 添加WebSocket连接
  const socket = ref<WebSocket | null>(null);
  
  // 初始化WebSocket连接
  const initWebSocket = () => {
    // 实际项目中替换为你的WebSocket服务器地址
    const wsUrl = 'ws://your-ai-server/chat';
    
    socket.value = new WebSocket(wsUrl);
  
    socket.value.onopen = () => {
      console.log('WebSocket连接已建立');
    };
  
    socket.value.onclose = (event) => {
      console.log('WebSocket连接关闭', event);
      // 5秒后尝试重连
      setTimeout(initWebSocket, 5000);
    };
  
    socket.value.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
    
    socket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'ai_response') {
          const friendId = data.userId || activeFriendId.value;
          if (friendId) {
            const replyMessage = {
              sender: 'opponent',
              avatar: friends.value.find(f => f.id === friendId)?.avatar || '',
              content: data.content,
              time: new Date().toLocaleTimeString(),
            };
            
            chatHistories.value[friendId].push(replyMessage);
            updateLastMessage(friendId, replyMessage);
            
            // 如果不是当前活跃聊天，增加未读计数
            if (activeFriendId.value !== friendId) {
              const friendIndex = friends.value.findIndex(f => f.id === friendId);
              if (friendIndex !== -1) {
                friends.value[friendIndex].unreadCount += 1;
              }
            }
            
            isAIResponding.value = false;
            scrollToBottom();
          }
        } else if (data.type === 'ai_typing') {
          // 可以处理AI正在输入的状态
          isAIResponding.value = true;
        }
      } catch (error) {
        console.error('解析消息错误:', error);
      }
    };
  };
  
  // 发送消息
  const fasongxiaoxi = () => {
    if (inputMessage.value.trim() === "" || activeFriendId.value === null || isAIResponding.value) return;
  
    const newMessage = {
      sender: 'me' as const,
      avatar: 'http://img1.baidu.com/it/u=4017932926,2850820796&fm=253&app=138&f=JPEG?w=810&h=800',
      content: inputMessage.value,
      time: new Date().toLocaleTimeString(),
    };
    
    if (!chatHistories.value[activeFriendId.value]) {
      chatHistories.value[activeFriendId.value] = [];
    }
    
    chatHistories.value[activeFriendId.value].push(newMessage);
    updateLastMessage(activeFriendId.value, newMessage);
    
    // 通过WebSocket发送消息
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      isAIResponding.value = true;
      socket.value.send(JSON.stringify({
        type: 'user_message',
        content: inputMessage.value,
        userId: activeFriendId.value
      }));
    } else {
      // WebSocket未连接时的模拟回复
      setTimeout(() => {
        const friendIndex = friends.value.findIndex(f => f.id === activeFriendId.value);
        if (friendIndex !== -1) {
          const replyMessage = {
            sender: 'opponent' as const,
            avatar: friends.value[friendIndex].avatar,
            content: getRandomReply(),
            time: new Date().toLocaleTimeString(),
          };
          chatHistories.value[activeFriendId.value].push(replyMessage);
          updateLastMessage(activeFriendId.value, replyMessage);
          scrollToBottom();
        }
      }, 1000);
    }
    
    inputMessage.value = "";
    scrollToBottom();
  };
  
  // 随机回复消息（WebSocket不可用时的备用）
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
      "哈哈"
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  };
  
  // 组件挂载时初始化
  onMounted(() => {
    initializeChatHistories();
    if (friends.value.length > 0) {
      activeFriendId.value = friends.value[0].id;
    }
    initWebSocket();
    scrollToBottom();
  });
  
  // 监听聊天历史变化
  watch(currentChatHistory, () => {
    scrollToBottom();
    checkOverflow();
  }, { deep: true });
  
  // 监听activeFriendId变化，清除未读
  watch(activeFriendId, (newVal) => {
    if (newVal) {
      const friendIndex = friends.value.findIndex(f => f.id === newVal);
      if (friendIndex !== -1) {
        friends.value[friendIndex].unreadCount = 0;
      }
    }
  });
  </script>
  
  <style scoped>
  /* 基础样式保持不变... */
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
    padding: 20px;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
    border: none;
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
  /* 新增样式 */
  .unread-badge {
    display: inline-block;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background-color: #f56c6c;
    color: white;
    border-radius: 10px;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    margin-left: 8px;
  }
  
  .ai-typing {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    color: #888;
    font-size: 14px;
  }
  
  .typing-dots {
    display: flex;
    margin-left: 5px;
  }
  
  .typing-dot {
    width: 6px;
    height: 6px;
    background-color: #888;
    border-radius: 50%;
    margin: 0 2px;
    animation: typingAnimation 1.4s infinite ease-in-out;
  }
  
  .typing-dot:nth-child(1) {
    animation-delay: 0s;
  }
  .typing-dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing-dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typingAnimation {
    0%, 60%, 100% { transform: translateY(0); }
    30% { transform: translateY(-5px); }
  }
  
  /* 禁用状态样式 */
  button:disabled, input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  </style>