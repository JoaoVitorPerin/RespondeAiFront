export interface RoomDTO {
  id: string;
  name: string;
  role?: 'ADMIN' | 'MEMBER' | string;
  createdAt?: string | Date;
  members: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MEMBER' | string;
  }[];
}