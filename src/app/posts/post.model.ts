export interface Post {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  imagePath?: string;
  creator: string;
  likeCount?: number;
  likes?: string[];
  status?: string;
  createdAt?: string;
}
