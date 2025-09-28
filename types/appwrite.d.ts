import { Models } from 'appwrite';

export type User = Models.Document & {
  name: string;
  email: string;
  avatar: string;
}

