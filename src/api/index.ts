export interface User {
  id: number;
  avatar: string;
  nickname: string;
}

export interface Message {
  id: number;
  content: string;
  timestamp: Date;
  senderId: number;
}

export interface ChatItem {
  id: number;
  users: User[];
  messages: Message[];
}
