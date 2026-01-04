export interface RoomDTO {
  id: string;
  name: string;
  role?: 'ADMIN' | 'MEMBER' | string;
  createdAt?: string | Date;
}