// models/notification.model.ts
export interface Notification {
  id: number;
  user: User;
  message: string;
  seen: boolean;
  createdAt: Date;
}

// models/user.model.ts
export interface User {
  id: number;
  name: string;
  email: string;
}