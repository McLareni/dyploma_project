export type Collection = {
  id: number;
  name: string;
  length: number;
  authorName: string;
  users: {
    progress: number;
    completed: boolean;
  }[];
};
