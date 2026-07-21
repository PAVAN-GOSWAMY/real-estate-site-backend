import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as buildersService from '@/modules/builders/services/builders.service';
import * as repository from '@/modules/builders/repository/builders.repository';
import * as storageService from '@/lib/storage/storage.service';
import { Builder } from '@/modules/builders/types/builder';

vi.mock('@/modules/builders/repository/builders.repository');
vi.mock('@/lib/storage/storage.service');

const mockBuilder: Builder = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test Builder',
  slug: 'test-builder',
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

describe('Builders Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBuilder', () => {
    it('should successfully create a builder', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(null);
      vi.mocked(repository.createBuilder).mockResolvedValue(mockBuilder);

      const input = { name: 'Test Builder' };
      const result = await buildersService.createBuilder(input);

      expect(repository.createBuilder).toHaveBeenCalledWith(expect.objectContaining({ name: 'Test Builder', slug: 'test-builder' }));
      expect(result).toEqual(mockBuilder);
    });

    it('should auto-generate a slug if not provided', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(null);
      vi.mocked(repository.createBuilder).mockResolvedValue(mockBuilder);

      await buildersService.createBuilder({ name: 'Hello World Builder' });

      expect(repository.createBuilder).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'hello-world-builder' })
      );
    });

    it('should use provided custom slug', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(null);
      vi.mocked(repository.createBuilder).mockResolvedValue(mockBuilder);

      await buildersService.createBuilder({ name: 'Hello World', slug: 'custom-slug-123' });

      expect(repository.createBuilder).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'custom-slug-123' })
      );
    });

    it('should throw conflict error on duplicate name', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ 
        items: [{ ...mockBuilder, name: 'Test Builder' }], total: 1, page: 1, limit: 100 
      });

      await expect(buildersService.createBuilder({ name: 'Test Builder' }))
        .rejects.toThrow(/Conflict Error/);
    });

    it('should throw conflict error on duplicate slug', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(mockBuilder);

      await expect(buildersService.createBuilder({ name: 'Test Builder', slug: 'test-builder' }))
        .rejects.toThrow(/Conflict Error/);
    });

    it('should handle logo upload successfully', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(null);
      vi.mocked(repository.createBuilder).mockResolvedValue(mockBuilder);
      vi.mocked(storageService.uploadFile).mockResolvedValue({ path: 'path', publicUrl: 'url' });
      vi.mocked(repository.updateBuilder).mockResolvedValue({ ...mockBuilder, logoUrl: 'url' });

      const mockFile = new File([''], 'logo.png');
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      const result = await buildersService.createBuilder({ name: 'Test' }, mockFile);

      expect(storageService.uploadFile).toHaveBeenCalled();
      expect(repository.updateBuilder).toHaveBeenCalledWith(mockBuilder.id, { logoUrl: 'url' });
      expect(result.logoUrl).toBe('url');
    });

    it('should ignore logo upload failure and still return builder', async () => {
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(null);
      vi.mocked(repository.createBuilder).mockResolvedValue(mockBuilder);
      vi.mocked(storageService.uploadFile).mockRejectedValue(new Error('Upload failed'));

      const mockFile = new File([''], 'logo.png');
      Object.defineProperty(mockFile, 'size', { value: 1024 });
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await buildersService.createBuilder({ name: 'Test' }, mockFile);

      expect(result).toEqual(mockBuilder); // Builder still created
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Logo upload failed'), expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });

  describe('updateBuilder', () => {
    it('should successfully update a builder', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(mockBuilder);
      vi.mocked(repository.updateBuilder).mockResolvedValue({ ...mockBuilder, name: 'New Name' });

      const result = await buildersService.updateBuilder(mockBuilder.id, { name: 'New Name' });
      
      expect(repository.updateBuilder).toHaveBeenCalledWith(mockBuilder.id, expect.objectContaining({ name: 'New Name' }));
      expect(result.name).toBe('New Name');
    });

    it('should throw error if builder not found', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(null);
      
      await expect(buildersService.updateBuilder('bad-id', { name: 'Name' }))
        .rejects.toThrow(/Not Found/);
    });

    it('should regenerate slug if name changes and no slug provided', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(mockBuilder);
      vi.mocked(repository.listBuilders).mockResolvedValue({ items: [], total: 0, page: 1, limit: 100 });
      vi.mocked(repository.getBuilderBySlug).mockResolvedValue(null);
      vi.mocked(repository.updateBuilder).mockResolvedValue(mockBuilder);

      await buildersService.updateBuilder(mockBuilder.id, { name: 'Brand New Builder' });

      expect(repository.updateBuilder).toHaveBeenCalledWith(
        mockBuilder.id, 
        expect.objectContaining({ slug: 'brand-new-builder' })
      );
    });

    it('should handle replacing a logo', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(mockBuilder);
      vi.mocked(storageService.uploadFile).mockResolvedValue({ path: 'path', publicUrl: 'new-url' });
      vi.mocked(repository.updateBuilder).mockResolvedValue({ ...mockBuilder, logoUrl: 'new-url' });

      const mockFile = new File([''], 'logo.png');
      Object.defineProperty(mockFile, 'size', { value: 1024 });

      await buildersService.updateBuilder(mockBuilder.id, {}, mockFile);

      expect(storageService.uploadFile).toHaveBeenCalled();
      expect(repository.updateBuilder).toHaveBeenCalledWith(mockBuilder.id, expect.objectContaining({ logoUrl: 'new-url' }));
    });

    it('should handle removing a logo', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue({ ...mockBuilder, logoUrl: 'existing-url' });
      vi.mocked(storageService.deleteFile).mockResolvedValue(true);
      vi.mocked(repository.updateBuilder).mockResolvedValue({ ...mockBuilder, logoUrl: null });

      await buildersService.updateBuilder(mockBuilder.id, {}, undefined, true);

      expect(storageService.deleteFile).toHaveBeenCalled();
      expect(repository.updateBuilder).toHaveBeenCalledWith(mockBuilder.id, expect.objectContaining({ logoUrl: null }));
    });
  });

  describe('deactivateBuilder', () => {
    it('should deactivate existing builder', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(mockBuilder);
      vi.mocked(repository.deactivateBuilder).mockResolvedValue({ ...mockBuilder, isActive: false });

      const result = await buildersService.deactivateBuilder(mockBuilder.id);
      expect(result.isActive).toBe(false);
      expect(repository.deactivateBuilder).toHaveBeenCalledWith(mockBuilder.id);
    });

    it('should throw error if builder not found', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(null);
      
      await expect(buildersService.deactivateBuilder('bad-id'))
        .rejects.toThrow(/Not Found/);
    });
  });

  describe('listBuilders', () => {
    it('should call repository with filters', async () => {
      const mockResult = { items: [mockBuilder], total: 1, page: 1, limit: 10 };
      vi.mocked(repository.listBuilders).mockResolvedValue(mockResult);

      const filters = { search: 'test', limit: 10 };
      const result = await buildersService.listBuilders(filters);

      expect(repository.listBuilders).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getBuilder', () => {
    it('should return builder if found', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(mockBuilder);
      const result = await buildersService.getBuilder(mockBuilder.id);
      expect(result).toEqual(mockBuilder);
    });

    it('should return null if not found', async () => {
      vi.mocked(repository.getBuilderById).mockResolvedValue(null);
      const result = await buildersService.getBuilder('bad-id');
      expect(result).toBeNull();
    });
  });
});
