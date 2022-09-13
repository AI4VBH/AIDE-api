export interface Role {
  id: string;
  name: string;
  editable: boolean;
}

export interface PaginatedRolesResponse {
  totalRolesCount: number;
  totalFilteredRolesCount: number;
  roles: Role[];
}
