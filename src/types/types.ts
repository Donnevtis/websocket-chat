import { JWTPayload } from 'jose';

export type Credits = {
  login: string;
  password: string;
};

export interface TokenData extends JWTPayload {
  sub?: string;
  name?: string;
}

export type Topics = Record<number, string>;

export type MyMessage = {
  login: string;
  topics: number;
  message: string;
};

export type ChatMessage = {
  id: number;
  login: string;
  message: string;
};

export type ChatResult = { topics: string; result: ChatMessage[] };

export type WebSocketMessage = ChatResult | ChatMessage;

export type SetOptional<BaseType, Keys extends keyof BaseType> = Omit<BaseType, Keys> &
  Partial<Pick<BaseType, Keys>>;

export enum PATHS {
  Login = '/login',
  Logout = '/logout',
  Topics = '/topics',
  Chat = '/chat',
}

export enum WS_CLOSE_CODE {
  Disconnected = 1008,
  Clean = 1000,
}
