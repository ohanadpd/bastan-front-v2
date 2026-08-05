/**
 * API response type definitions
 */

export interface ApiResponse<T = any> {
    msg: string;
    code: number;
    data: T;
  }
  
  export interface PaginatedResponse<T = any> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }