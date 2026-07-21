import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidatePath } from 'next/cache';
import * as buildersService from '@/modules/builders/services/builders.service';
import { createBuilderAction } from '@/modules/builders/actions/create-builder.action';
import { updateBuilderAction } from '@/modules/builders/actions/update-builder.action';
import { getBuilderAction } from '@/modules/builders/actions/get-builder.action';
import { listBuildersAction } from '@/modules/builders/actions/list-builders.action';
import { deactivateBuilderAction } from '@/modules/builders/actions/deactivate-builder.action';
import { Builder } from '@/modules/builders/types/builder';

// Mock Next.js cache revalidation
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Builders Service
vi.mock('@/modules/builders/services/builders.service');

const mockBuilder: Builder = {
  id: '123',
  name: 'Action Builder',
  slug: 'action-builder',
  logoUrl: null,
  description: null,
  establishedYear: null,
  headquarters: null,
  website: null,
  email: null,
  phone: null,
  isFeatured: false,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Builders Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBuilderAction', () => {
    it('should successfully create a builder and revalidate cache', async () => {
      vi.mocked(buildersService.createBuilder).mockResolvedValue(mockBuilder);

      const formData = new FormData();
      formData.append('input', JSON.stringify({ name: 'Action Builder' }));

      const result = await createBuilderAction(formData);

      expect(buildersService.createBuilder).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/admin/builders');
      expect(result).toEqual({ success: true, data: mockBuilder });
    });

    it('should handle validation errors', async () => {
      vi.mocked(buildersService.createBuilder).mockRejectedValue(new Error('Validation Error: name is too short'));

      const formData = new FormData();
      formData.append('input', JSON.stringify({ name: 'A' }));

      const result = await createBuilderAction(formData);

      expect(revalidatePath).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false, error: 'Validation Error: name is too short' });
    });

    it('should handle conflict errors', async () => {
      vi.mocked(buildersService.createBuilder).mockRejectedValue(new Error('Conflict Error: Name already exists'));

      const formData = new FormData();
      formData.append('input', JSON.stringify({ name: 'Action Builder' }));

      const result = await createBuilderAction(formData);

      expect(result).toEqual({ success: false, error: 'Conflict Error: Name already exists' });
    });

    it('should obfuscate unexpected errors', async () => {
      vi.mocked(buildersService.createBuilder).mockRejectedValue(new Error('Database explosion'));
      // suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const formData = new FormData();
      formData.append('input', JSON.stringify({ name: 'Action Builder' }));

      const result = await createBuilderAction(formData);

      expect(result).toEqual({ success: false, error: 'An unexpected error occurred. Please try again later.' });
      consoleSpy.mockRestore();
    });
  });

  describe('updateBuilderAction', () => {
    it('should successfully update a builder and revalidate cache', async () => {
      vi.mocked(buildersService.updateBuilder).mockResolvedValue(mockBuilder);

      const formData = new FormData();
      formData.append('input', JSON.stringify({ name: 'New Name' }));

      const result = await updateBuilderAction('123', formData);

      expect(buildersService.updateBuilder).toHaveBeenCalledWith('123', { name: 'New Name' }, undefined, false);
      expect(revalidatePath).toHaveBeenCalledWith('/admin/builders');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/builders/123');
      expect(result).toEqual({ success: true, data: mockBuilder });
    });

    it('should pass removeLogo flag to service', async () => {
      vi.mocked(buildersService.updateBuilder).mockResolvedValue(mockBuilder);

      const formData = new FormData();
      formData.append('input', JSON.stringify({ name: 'New Name' }));
      formData.append('removeLogo', 'true');

      await updateBuilderAction('123', formData);

      expect(buildersService.updateBuilder).toHaveBeenCalledWith('123', { name: 'New Name' }, undefined, true);
    });

    it('should handle builder not found', async () => {
      vi.mocked(buildersService.updateBuilder).mockRejectedValue(new Error('Not Found: Builder missing'));

      const formData = new FormData();
      formData.append('input', JSON.stringify({}));

      const result = await updateBuilderAction('bad-id', formData);

      expect(result).toEqual({ success: false, error: 'Not Found: Builder missing' });
    });

    it('should handle conflict errors', async () => {
      vi.mocked(buildersService.updateBuilder).mockRejectedValue(new Error('Conflict Error: Slug exists'));

      const formData = new FormData();
      formData.append('input', JSON.stringify({}));

      const result = await updateBuilderAction('123', formData);

      expect(result).toEqual({ success: false, error: 'Conflict Error: Slug exists' });
    });

    it('should handle validation errors', async () => {
      vi.mocked(buildersService.updateBuilder).mockRejectedValue(new Error('Validation Error: invalid email'));

      const formData = new FormData();
      formData.append('input', JSON.stringify({}));

      const result = await updateBuilderAction('123', formData);

      expect(result).toEqual({ success: false, error: 'Validation Error: invalid email' });
    });
  });

  describe('getBuilderAction', () => {
    it('should return successfully if builder exists', async () => {
      vi.mocked(buildersService.getBuilder).mockResolvedValue(mockBuilder);

      const result = await getBuilderAction('123');
      
      expect(buildersService.getBuilder).toHaveBeenCalledWith('123');
      expect(result).toEqual({ success: true, data: mockBuilder });
    });

    it('should return null data if builder not found', async () => {
      vi.mocked(buildersService.getBuilder).mockResolvedValue(null);

      const result = await getBuilderAction('bad-id');
      
      expect(result).toEqual({ success: true, data: null });
    });

    it('should return generic error if service throws unexpected error', async () => {
      vi.mocked(buildersService.getBuilder).mockRejectedValue(new Error('DB failure'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await getBuilderAction('123');
      
      expect(result.success).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('listBuildersAction', () => {
    it('should return successfully with data', async () => {
      const paginatedData = { items: [mockBuilder], total: 1, page: 1, limit: 10 };
      vi.mocked(buildersService.listBuilders).mockResolvedValue(paginatedData);

      const result = await listBuildersAction({ page: 1 });
      
      expect(buildersService.listBuilders).toHaveBeenCalledWith({ page: 1 });
      expect(result).toEqual({ success: true, data: paginatedData });
    });

    it('should return empty list if none found', async () => {
      const paginatedData = { items: [], total: 0, page: 1, limit: 10 };
      vi.mocked(buildersService.listBuilders).mockResolvedValue(paginatedData);

      const result = await listBuildersAction();
      
      expect(result).toEqual({ success: true, data: paginatedData });
    });

    it('should handle service failures gracefully', async () => {
      vi.mocked(buildersService.listBuilders).mockRejectedValue(new Error('List failed'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await listBuildersAction();
      
      expect(result.success).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('deactivateBuilderAction', () => {
    it('should successfully deactivate and revalidate cache', async () => {
      vi.mocked(buildersService.deactivateBuilder).mockResolvedValue({ ...mockBuilder, isActive: false });

      const result = await deactivateBuilderAction('123');

      expect(buildersService.deactivateBuilder).toHaveBeenCalledWith('123');
      expect(revalidatePath).toHaveBeenCalledWith('/admin/builders');
      expect(result).toEqual({ success: true, data: { ...mockBuilder, isActive: false } });
    });

    it('should handle not found error', async () => {
      vi.mocked(buildersService.deactivateBuilder).mockRejectedValue(new Error('Not Found: Builder missing'));

      const result = await deactivateBuilderAction('bad-id');

      expect(result).toEqual({ success: false, error: 'Not Found: Builder missing' });
    });
  });
});
