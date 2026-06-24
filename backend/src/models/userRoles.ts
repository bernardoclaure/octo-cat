export type UserRole = 'buyer' | 'approver' | 'supplier' | 'admin';

export interface UserContext {
  id: string;
  role: UserRole;
  branchId?: string;
}
