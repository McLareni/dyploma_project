export type Collection = {
  id: number;
  progress: number;
  completed: boolean;
  collection: {
    id: number;
    name: string;
    authorName: string;
    length: number;
  };
};
