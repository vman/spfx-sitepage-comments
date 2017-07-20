export interface User{
  email: string;
  name: string;
}

export interface Comment{
  text: string;
  replyCount: string;
  author: User;
}