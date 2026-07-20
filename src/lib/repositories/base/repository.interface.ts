export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface QueryParams extends PaginationParams, SortParams {
  search?: string;
  [key: string]: any; // Allow specific filters
}

export interface IRepository<T, CreateDTO, UpdateDTO> {
  findById(id: string): Promise<T | null>;
  findMany(query: QueryParams): Promise<{ data: T[]; count: number }>;
  create(data: CreateDTO): Promise<T>;
  update(id: string, data: UpdateDTO): Promise<T>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  exists(filters: Record<string, any>): Promise<boolean>;
  count(filters?: Record<string, any>): Promise<number>;
}
