import { render, screen } from '../setup/test-utils';
import userEvent from '@testing-library/user-event';
import { BuilderForm } from '@/app/admin/builders/_components/builder-form';
import { describe, it, expect, vi } from 'vitest';

// Mock Next.js navigation hooks if they are used implicitly (none used right now, but good practice if added)
vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

describe('BuilderForm', () => {
  const defaultProps = {
    mode: 'create' as const,
    onSubmit: vi.fn(),
    isPending: false,
  };

  it('renders initial form correctly in create mode', () => {
    render(<BuilderForm {...defaultProps} />);
    
    // Core inputs
    expect(screen.getByLabelText(/name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    
    // Default checkboxes
    const activeCheck = screen.getByLabelText(/active/i) as HTMLInputElement;
    expect(activeCheck.checked).toBe(true);
    
    const featuredCheck = screen.getByLabelText(/featured/i) as HTMLInputElement;
    expect(featuredCheck.checked).toBe(false);
  });

  it('renders correctly in edit mode with initial values', () => {
    render(
      <BuilderForm 
        {...defaultProps} 
        mode="edit" 
        initialData={{ name: 'Acme Corp', website: 'https://acme.com', isActive: false }} 
      />
    );
    
    expect(screen.getByDisplayValue('Acme Corp')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://acme.com')).toBeInTheDocument();
    const activeCheck = screen.getByLabelText(/active/i) as HTMLInputElement;
    expect(activeCheck.checked).toBe(false);
  });

  it('shows client-side validation errors when submitting empty required fields', async () => {
    const user = userEvent.setup();
    render(<BuilderForm {...defaultProps} />);
    
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    // Check that onSubmit was NOT called due to validation failing
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    
    // Accessibility check: Ensure aria-invalid is true on the failed input
    const nameInput = screen.getByLabelText(/name \*/i);
    expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
    
    // Error message rendered
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
  });

  it('disables all inputs when isPending is true', () => {
    render(<BuilderForm {...defaultProps} isPending={true} />);
    
    expect(screen.getByLabelText(/name \*/i)).toBeDisabled();
    expect(screen.getByLabelText(/slug/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /saving\.\.\./i, hidden: true })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i, hidden: true })).toBeDisabled();
  });

  it('submits valid data correctly', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<BuilderForm {...defaultProps} onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/name \*/i), 'Acme Corp');
    await user.type(screen.getByLabelText(/established year/i), '2000');
    
    await user.click(screen.getByRole('button', { name: /save/i }));
    
    expect(onSubmit).toHaveBeenCalledTimes(1);
    
    // Check that FormData passed to onSubmit contains the serialized payload
    const passedFormData = onSubmit.mock.calls[0][0] as FormData;
    const inputString = passedFormData.get('input') as string;
    const parsed = JSON.parse(inputString);
    
    expect(parsed.name).toBe('Acme Corp');
    expect(parsed.establishedYear).toBe(2000);
    expect(parsed.isActive).toBe(true);
  });

  it('renders server errors appropriately', () => {
    render(<BuilderForm {...defaultProps} serverError="Something blew up on the server" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Something blew up on the server');
  });
});
