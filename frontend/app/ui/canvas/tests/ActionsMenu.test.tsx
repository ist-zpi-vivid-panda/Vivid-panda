import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ActionsMenu from '../ActionsMenu';
import { CanvasCRUDOperations, ChangeHistory } from '@/app/lib/canvas/definitions';

// Настройка мокового i18next
const i18nInstance = i18n.createInstance();
i18nInstance.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        save: 'save',
        undo: 'undo',
        redo: 'redo',
        delete: 'delete',
        download: 'download',
      },
    },
  },
});

describe('ActionsMenu', () => {
  const mockCanvasCrudOperations: CanvasCRUDOperations = {
    handleSave: jest.fn(),
    handleDelete: jest.fn(),
    handleDownload: jest.fn(),
  };

  const mockChangeHistoryData: ChangeHistory = {
    handleUndo: jest.fn(),
    handleRedo: jest.fn(),
    canUndo: true,
    canRedo: true,
  };

  const renderWithProviders = (ui: React.ReactElement) =>
    render(<I18nextProvider i18n={i18nInstance}>{ui}</I18nextProvider>);

  it('renders all buttons', () => {
    const { getByLabelText } = renderWithProviders(
      <ActionsMenu
        canvasCrudOperations={mockCanvasCrudOperations}
        changeHistoryData={mockChangeHistoryData}
      />
    );

    expect(getByLabelText('save')).toBeInTheDocument();
    expect(getByLabelText('undo')).toBeInTheDocument();
    expect(getByLabelText('redo')).toBeInTheDocument();
    expect(getByLabelText('delete')).toBeInTheDocument();
    expect(getByLabelText('download')).toBeInTheDocument();
  });

  it('calls handleSave when save button is clicked', () => {
    const { getByLabelText } = renderWithProviders(
      <ActionsMenu
        canvasCrudOperations={mockCanvasCrudOperations}
        changeHistoryData={mockChangeHistoryData}
      />
    );

    fireEvent.click(getByLabelText('save'));
    expect(mockCanvasCrudOperations.handleSave).toHaveBeenCalled();
  });

  it.skip('disables undo button when canUndo is false', () => {
    const { getByLabelText } = renderWithProviders(
      <ActionsMenu
        canvasCrudOperations={mockCanvasCrudOperations}
        changeHistoryData={{ ...mockChangeHistoryData, canUndo: false }}
      />
    );

    const undoButton = getByLabelText('undo');
    expect(undoButton).toBeDisabled();
  });

  it.skip('disables redo button when canRedo is false', () => {
    const { getByLabelText } = renderWithProviders(
      <ActionsMenu
        canvasCrudOperations={mockCanvasCrudOperations}
        changeHistoryData={{ ...mockChangeHistoryData, canRedo: false }}
      />
    );

    const redoButton = getByLabelText('redo');
    expect(redoButton).toBeDisabled();
  });
});
