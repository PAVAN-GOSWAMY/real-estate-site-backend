import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as repository from '@/modules/builders/repository/builders.repository';
import { createClient } from '@/lib/supabase/server';

// Mock Supabase Server Client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Builders Repository', () => {
  let mockQueryResult: any;

  // The deep-chained Supabase query builder mock
  const mockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    // Make the mock object thenable so `await chain` works
    then: vi.fn().mockImplementation((resolve) => resolve(mockQueryResult)),
  };

  const mockSupabase = {
    from: vi.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockDBRow = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Builder',
    slug: 'test-builder',
    logo_url: null,
    description: null,
    established_year: null,
    headquarters: null,
    website: null,
    email: null,
    phone: null,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);
    // Reset query result for each test
    mockQueryResult = { data: null, error: null };
  });

  describe('createBuilder', () => {
    it('should successfully insert and map a builder', async () => {
      mockQueryResult = { data: mockDBRow, error: null };

      const input = {
        name: 'Test Builder',
        slug: 'test-builder',
        isActive: true,
        isFeatured: false,
      };

      const result = await repository.createBuilder(input);

      expect(mockSupabase.from).toHaveBeenCalledWith('builders');
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Builder',
        slug: 'test-builder',
      }));
      expect(mockQueryBuilder.single).toHaveBeenCalled();
      expect(result.name).toBe('Test Builder');
    });

    it('should throw error on insert failure', async () => {
      mockQueryResult = { data: null, error: { message: 'Database error' } };

      await expect(repository.createBuilder({ name: 'T', slug: 't', isActive: true, isFeatured: false }))
        .rejects.toThrow(/Failed to create builder: Database error/);
    });
  });

  describe('getBuilderById', () => {
    it('should return mapped builder if found', async () => {
      mockQueryResult = { data: mockDBRow, error: null };

      const result = await repository.getBuilderById(mockDBRow.id);

      expect(mockSupabase.from).toHaveBeenCalledWith('builders');
      expect(mockQueryBuilder.select).toHaveBeenCalled();
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', mockDBRow.id);
      expect(result?.id).toBe(mockDBRow.id);
    });

    it('should return null if PGRST116 (not found) error occurs', async () => {
      mockQueryResult = { data: null, error: { code: 'PGRST116' } };

      const result = await repository.getBuilderById('bad-id');
      expect(result).toBeNull();
    });

    it('should throw on unexpected database error', async () => {
      mockQueryResult = { data: null, error: { message: 'Connection failed', code: '500' } };

      await expect(repository.getBuilderById('id'))
        .rejects.toThrow(/Failed to fetch builder by ID: Connection failed/);
    });
  });

  describe('getBuilderBySlug', () => {
    it('should return mapped builder if found', async () => {
      mockQueryResult = { data: mockDBRow, error: null };

      const result = await repository.getBuilderBySlug(mockDBRow.slug);

      expect(mockSupabase.from).toHaveBeenCalledWith('builders');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('slug', mockDBRow.slug);
      expect(result?.slug).toBe(mockDBRow.slug);
    });

    it('should return null if missing', async () => {
      mockQueryResult = { data: null, error: { code: 'PGRST116' } };
      expect(await repository.getBuilderBySlug('missing')).toBeNull();
    });
  });

  describe('listBuilders', () => {
    it('should call supabase with default pagination', async () => {
      mockQueryResult = { data: [mockDBRow], error: null, count: 1 };

      const result = await repository.listBuilders({});

      expect(mockSupabase.from).toHaveBeenCalledWith('builders');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('*', { count: 'exact' });
      expect(mockQueryBuilder.range).toHaveBeenCalledWith(0, 9);
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should apply search, featured, and active filters', async () => {
      mockQueryResult = { data: [mockDBRow], error: null, count: 1 };

      await repository.listBuilders({ search: 'query', featured: true, active: false });

      expect(mockQueryBuilder.ilike).toHaveBeenCalledWith('name', '%query%');
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('is_featured', true);
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('is_active', false);
    });

    it('should handle custom pagination bounds', async () => {
      mockQueryResult = { data: [], error: null, count: 0 };

      // page 3, limit 5 -> from: 10, to: 14
      await repository.listBuilders({ page: 3, limit: 5 });

      expect(mockQueryBuilder.range).toHaveBeenCalledWith(10, 14);
    });

    it('should throw on list error', async () => {
      mockQueryResult = { data: null, error: { message: 'Failed to list' } };

      await expect(repository.listBuilders({}))
        .rejects.toThrow(/Failed to list builders/);
    });
  });

  describe('updateBuilder', () => {
    it('should successfully update partial payload', async () => {
      mockQueryResult = { data: mockDBRow, error: null };

      const result = await repository.updateBuilder(mockDBRow.id, { name: 'New Name' });

      expect(mockSupabase.from).toHaveBeenCalledWith('builders');
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'New Name' }));
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', mockDBRow.id);
      expect(result.id).toBe(mockDBRow.id);
    });

    it('should return existing builder without updating if payload is empty', async () => {
      // For this, updateBuilder calls getBuilderById internally. 
      // We set mockQueryResult so getBuilderById resolves.
      mockQueryResult = { data: mockDBRow, error: null };
      
      const result = await repository.updateBuilder(mockDBRow.id, {});

      expect(mockQueryBuilder.update).not.toHaveBeenCalled();
      expect(result.id).toBe(mockDBRow.id);
    });

    it('should throw if empty payload and builder not found', async () => {
      mockQueryResult = { data: null, error: { code: 'PGRST116' } };
      
      await expect(repository.updateBuilder(mockDBRow.id, {}))
        .rejects.toThrow(/Builder to update not found/);
    });

    it('should throw on update failure', async () => {
      mockQueryResult = { data: null, error: { message: 'Update failed' } };

      await expect(repository.updateBuilder(mockDBRow.id, { name: 'Fail' }))
        .rejects.toThrow(/Failed to update builder/);
    });
  });

  describe('deactivateBuilder', () => {
    it('should successfully set is_active to false', async () => {
      mockQueryResult = { data: { ...mockDBRow, is_active: false }, error: null };

      const result = await repository.deactivateBuilder(mockDBRow.id);

      expect(mockQueryBuilder.update).toHaveBeenCalledWith({ is_active: false });
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', mockDBRow.id);
      expect(result.isActive).toBe(false);
    });

    it('should throw on deactivate failure', async () => {
      mockQueryResult = { data: null, error: { message: 'Deactivate failed' } };

      await expect(repository.deactivateBuilder(mockDBRow.id))
        .rejects.toThrow(/Failed to deactivate builder/);
    });
  });
});
