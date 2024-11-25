import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileEditListOptions from '../FileEditOptions';

describe('FileEditListOptions', () => {
  it('renders all editing tools', () => {
    render(<FileEditListOptions />);

    const tools = [
      'scissors', 
      'move', 
      'resize', 
      'filter', 
      'rotate', 
      'add_object', 
      'delete_object', 
      'upscalling', 
      'style_transfer', 
      'colorize_image'
    ];

    tools.forEach(tool => {
      expect(screen.getByText(tool)).toBeInTheDocument();
    });
  });

  test.skip('calls correct function on tool select', () => {
    const mockSetEditingTool = jest.fn();
    render(<FileEditListOptions setEditingTool={mockSetEditingTool} />);
    
    const scissorsButton = screen.getByText('scissors');
    fireEvent.click(scissorsButton);

    expect(mockSetEditingTool).toHaveBeenCalledWith('Crop');
  });
});
