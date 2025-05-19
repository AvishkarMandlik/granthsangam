// interfaces/like.interface.ts
export interface BookLike {
  id: number;
  user: {
    id: number;
    name: string;
  };
  book: {
    id: number;
    title: string;
  };
}

export interface LikeResponse {
  message: string;
}

export interface LikeCountResponse {
  count: number;
}