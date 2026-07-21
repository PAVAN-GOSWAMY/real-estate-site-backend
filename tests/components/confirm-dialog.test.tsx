import { render, screen, fireEvent } from '../setup/test-utils';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { describe, it, expect, vi } from 'vitest';

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Are you sure?',
    description: 'This action cannot be undone.',
  };

  it('renders correctly when open', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('does not open the dialog when isOpen is false', () => {
    render(<ConfirmDialog {...defaultProps} isOpen={false} />);
    const dialog = document.querySelector('dialog');
    expect(dialog).not.toHaveAttribute('open');
  });

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);
    
    await user.click(screen.getByRole('button', { name: /cancel/i, hidden: true }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onConfirm when confirm is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...defaultProps} />);
    
    await user.click(screen.getByRole('button', { name: /confirm/i, hidden: true }));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it('disables buttons and shows loading text when isPending is true', () => {
    render(<ConfirmDialog {...defaultProps} isPending={true} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i, hidden: true });
    const confirmButton = screen.getByRole('button', { name: /loading.../i, hidden: true });
    
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });
});
