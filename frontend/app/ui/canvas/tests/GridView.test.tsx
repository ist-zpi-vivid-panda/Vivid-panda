import { render, screen } from '@testing-library/react';
import GridView from '../GridView';
import ActionsMenu from '../ActionsMenu';
import FileEditListOptions from '../FileEditOptions';

// Мокаем дочерние компоненты
jest.mock('../ActionsMenu', () => jest.fn(() => <div>ActionsMenu</div>));
jest.mock('../FileEditOptions', () => jest.fn(() => <div>FileEditListOptions</div>));
jest.mock('../../themed/TrayCard', () => jest.fn(({ children }) => <div>TrayCard {children}</div>));

describe('GridView', () => {
  const mockCanvasCrudOperations = {
    handleSave: jest.fn(),
    handleDelete: jest.fn(),
    handleDownload: jest.fn(),
  };

  const mockChangeHistoryData = {
    handleUndo: jest.fn(),
    handleRedo: jest.fn(),
    canUndo: true,
    canRedo: false,
  };

  const mockSetEditingTool = jest.fn();
  const mockSetAiFunction = jest.fn();

  it('renders ActionsMenu, FileEditListOptions, TrayCard, and children', () => {
    render(
      <GridView
        canvasCrudOperations={mockCanvasCrudOperations}
        changeHistoryData={mockChangeHistoryData}
        setEditingTool={mockSetEditingTool}
        setAiFunction={mockSetAiFunction}
        currentEditComponent={<div>Edit Component</div>}
      >
        <div>Main Content</div>
      </GridView>
    );

    // Проверяем, что все компоненты рендерятся
    expect(screen.getByText('ActionsMenu')).toBeInTheDocument();
    expect(screen.getByText('FileEditListOptions')).toBeInTheDocument();
    expect(screen.getByText('TrayCard')).toBeInTheDocument();
    expect(screen.getByText('Edit Component')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });
});
