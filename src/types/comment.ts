export type TComment = {
  id: number;
  plantId: number;
  userId: number;
  username: string;
  content: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCommentCreateInput = {
  plantId: number;
  userId: number;
  username: string;
  content: string;
  likes?: number;
};
