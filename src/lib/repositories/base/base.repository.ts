import { SupabaseClient } from '@supabase/supabase-js';
import { IRepository, QueryParams } from './repository.interface';
import { NotFoundError, ConflictError, InternalError } from '../../errors/domain.error';

export abstract class BaseRepository<T, CreateDTO, UpdateDTO> implements IRepository<T, CreateDTO, UpdateDTO> {
  constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly tableName: string
  ) {}

  protected handleError(error: any, context: string): never {
    if (error.code === '23505') {
      throw new ConflictError(`Conflict occurred during ${context}`);
    }
    console.error(`[Repository Error - ${this.tableName}] ${context}:`, error);
    throw new InternalError(`Database error during ${context}`);
  }

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error, 'findById');
    }

    return data as T | null;
  }

  async findMany(query: QueryParams): Promise<{ data: T[]; count: number }> {
    const { page, limit, sort, order, search, ...filters } = query;
    const offset = (page - 1) * limit;

    let q = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .is('deleted_at', null);

    // Apply exact match filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== 'deleted_at') {
        q = q.eq(key, value);
      }
    });

    // Apply pagination
    q = q.range(offset, offset + limit - 1);

    // Apply stable sorting
    if (sort) {
      q = q.order(sort, { ascending: order === 'asc' });
    }
    // Always append id as tie-breaker for stable sorting
    q = q.order('id', { ascending: false });

    const { data, count, error } = await q;

    if (error) {
      this.handleError(error, 'findMany');
    }

    return { data: data as T[], count: count || 0 };
  }

  async create(data: CreateDTO): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert(data as any)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'create');
    }

    return result as T;
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .update(data as any)
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      this.handleError(error, 'update');
    }
    
    if (!result) {
      throw new NotFoundError(`${this.tableName} record`);
    }

    return result as T;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null);

    if (error) {
      this.handleError(error, 'softDelete');
    }
  }

  async restore(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .update({ deleted_at: null })
      .eq('id', id)
      .not('deleted_at', 'is', null);

    if (error) {
      this.handleError(error, 'restore');
    }
  }

  async exists(filters: Record<string, any>): Promise<boolean> {
    let q = this.supabase
      .from(this.tableName)
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) q = q.eq(key, value);
    });

    const { count, error } = await q;

    if (error) {
      this.handleError(error, 'exists');
    }

    return (count || 0) > 0;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let q = this.supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true })
      .is('deleted_at', null);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) q = q.eq(key, value);
      });
    }

    const { count, error } = await q;

    if (error) {
      this.handleError(error, 'count');
    }

    return count || 0;
  }
}
