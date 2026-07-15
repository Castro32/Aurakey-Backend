export interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: { msg: string; param: string }[];
}