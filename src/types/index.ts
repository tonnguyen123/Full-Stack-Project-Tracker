export interface Task{
    id: number;
    name: string;
    description?: string;
    priority?: string;
    status?: string;
    projectId: number;
    assignedId: number;
    due:Date;
    percentage:number;
}

export interface User {
    id:number,
    username: string,
    email: string,
    verificationcode: string,
    verified: boolean,

}

export interface Project{
    id: number;
    name: string;
    description?: string;
    completed: boolean;
    userId: number;
    createdAt: Date;
    dueTime: Date;
    tasks: Task[];
    percentage: number;
}

export interface Team{
    id: number;
    name:string,
    ownerId: number,
    projects: Project[],
    members: User[]
}

export interface Message {
    id?: number;
    senderId?: number;
    receiverId?: number;
    projectId?: number;
    messageText?: string;
    filePath?: string;
    fileName?: string;
    timestamp?: string;
  }
  
export interface Notification {
    id?: number;
    senderId: number;
    receiverId: number;
    isRead: boolean;
    message: string;
    notificationLink: string;
    createdAt: Date;
}

export interface TaskProgress {
    taskName: string;
    progress: number;
    expectation: number;
  }
  
  

