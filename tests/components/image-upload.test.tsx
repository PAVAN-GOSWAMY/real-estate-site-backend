import { render, screen, fireEvent } from '../setup/test-utils';
import userEvent from '@testing-library/user-event';
import { ImageUpload } from '@/components/ui/image-upload';
import { describe, it, expect, vi } from 'vitest';

// Mock URL.createObjectURL since it's not available in jsdom
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

describe('ImageUpload', () => {
  it('renders correctly with default state', () => {
    render(<ImageUpload name="testFile" />);
    expect(screen.getByText(/Click or drag image to upload/i)).toBeInTheDocument();
    expect(screen.getByText(/PNG, JPEG/i)).toBeInTheDocument();
  });

  it('renders default value preview', () => {
    render(<ImageUpload name="testFile" defaultValue="https://example.com/logo.png" />);
    
    const image = screen.getByAltText('Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/logo.png');
  });

  it('handles valid file selection and shows preview', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageUpload name="testFile" />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);
    
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('handles invalid file type gracefully', async () => {
    const { container } = render(<ImageUpload name="testFile" />);
    
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Use fireEvent to bypass the browser/user-event 'accept' attribute filtering
    fireEvent.change(input, { target: { files: [file] } });
    
    // Should show error and not show preview
    expect(screen.getByText(/Please select a PNG, JPEG, or WEBP image/i)).toBeInTheDocument();
    expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
  });

  it('handles remove click', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ImageUpload name="testFile" defaultValue="existing.png" onRemove={onRemove} />);
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);
    
    expect(onRemove).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    const { container } = render(<ImageUpload name="testFile" disabled={true} />);
    
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
