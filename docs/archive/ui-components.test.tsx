import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Input, Select, Modal, Alert } from '@/components/ui';

describe('UI Components', () => {
  describe('Button', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-lime-500');
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-500');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('shows loading state', () => {
      render(<Button loading>Loading</Button>);
      
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    it('handles click events', async () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Input', () => {
    it('renders with label', () => {
      render(<Input label="Email" />);
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    it('shows error state', () => {
      render(<Input label="Email" error="Invalid email" />);
      
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toHaveClass('border-red-300');
    });

    it('handles input changes', async () => {
      const handleChange = jest.fn();
      render(<Input label="Email" onChange={handleChange} />);
      
      const input = screen.getByLabelText(/email/i);
      await userEvent.type(input, 'test@example.com');
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Select', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    it('renders with options', () => {
      render(<Select label="Choose option" options={options} />);
      
      const select = screen.getByLabelText(/choose option/i);
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('handles selection changes', async () => {
      const handleChange = jest.fn();
      render(<Select label="Choose option" options={options} onChange={handleChange} />);
      
      const select = screen.getByLabelText(/choose option/i);
      await userEvent.selectOptions(select, 'option2');
      
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Modal', () => {
    it('renders when open', () => {
      render(
        <Modal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      
      const closeButton = screen.getByLabelText(/close/i);
      await userEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Alert', () => {
    it('renders with different types', () => {
      const { rerender } = render(
        <Alert type="success">Success message</Alert>
      );
      expect(screen.getByText('Success message')).toBeInTheDocument();
      expect(screen.getByText('Success message').closest('div')).toHaveClass('bg-green-50');

      rerender(<Alert type="error">Error message</Alert>);
      expect(screen.getByText('Error message').closest('div')).toHaveClass('bg-red-50');
    });

    it('shows title when provided', () => {
      render(
        <Alert type="info" title="Information">
          Info message
        </Alert>
      );
      
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
      const handleClose = jest.fn();
      render(
        <Alert type="warning" onClose={handleClose}>
          Warning message
        </Alert>
      );
      
      const closeButton = screen.getByLabelText(/dismiss/i);
      await userEvent.click(closeButton);
      
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});

