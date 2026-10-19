import { render, screen } from '@testing-library/react';
import StudentAccountAdmin from '../student-account-admin.component';

jest.mock('jspdf', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('jspdf-autotable', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const mockFetchSchools = jest.fn(() => new Promise<void>(() => undefined)); // never resolves

jest.mock('@store/useSchoolStore.store', () => {
  const { create } = jest.requireActual('zustand');
  const store = create(() => ({
    schools: [],
    classes: [],
    pupils: [],
    resources: [],
    isLoadingResources: false,
    fetchSchools: () => mockFetchSchools(),
    fetchClasses: () => Promise.resolve(),
    fetchPupils: () => Promise.resolve(),
    fetchResources: () => Promise.resolve(),
    resetClassesAndPupils: () => undefined,
    resetResources: () => undefined,
  }));
  return { __esModule: true, default: store, useSchoolStore: store };
});

describe('StudentAccountAdmin loading states', () => {
  it('shows a loading placeholder in the school select while schools are fetched', () => {
    render(<StudentAccountAdmin />);

    expect(mockFetchSchools).toHaveBeenCalled();
    expect(screen.getByRole('combobox', { name: 'Välj skola' })).toHaveAttribute('readonly');
    expect(screen.getByRole('option', { name: 'Laddar skolor...' })).toBeInTheDocument();
    // The status line below the filters must not repeat the text.
    expect(screen.queryByText('Laddar skolor...', { selector: 'div' })).not.toBeInTheDocument();
  });
});
