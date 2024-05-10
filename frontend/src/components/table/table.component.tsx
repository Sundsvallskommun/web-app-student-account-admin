import EditPupilModal from '@components/edit-pupil-modal/edit-pupil-modal.component';
import EditResursModal, { Resurs } from '@components/edit-resurs-modal/edit-resurs-modal.component';
import { Pupil } from '@interfaces/school';
import { Avatar, DataTable, DataTableHeader, Label } from '@sk-web-gui/react';
import { getInitials } from '@utils/get-initials';
import { Edit } from 'lucide-react';
import { useState } from 'react';

interface TableProps {
  data: (Pupil | Resurs)[];
  activeMenuIndex: number;
}

export const Table: React.FunctionComponent<TableProps> = ({ data, activeMenuIndex }) => {
  const [selectedUser, setSelectedUser] = useState<Pupil | Resurs | null>(null);
  const [isEditStudentModalOpen, setEditStudentModalOpen] = useState<boolean>(false);
  const [isEditResursModalOpen, setEditResursModalOpen] = useState<boolean>(false);

  const studentHeaders: DataTableHeader[] = [
    {
      property: 'displayname',
      label: 'Namn',
      isShown: true,
      renderColumn: (value) => (
        <div className="flex items-center gap-2">
          <Avatar
            // imageUrl=""
            rounded
            initials={getInitials(value)}
            size="sm"
          />
          <span className="ml-8 font-bold">{value}</span>
        </div>
      ),
      isColumnSortable: true,
    },
    { property: 'personNumber', label: 'Född datum', isShown: true, isColumnSortable: true },
    { property: 'loginname', label: 'Användarnamn', isShown: true, isColumnSortable: true },
    { property: 'name', label: 'Skola', isShown: true, isColumnSortable: true },
    { property: 'className', label: 'Klass', isShown: true, isColumnSortable: true },
    {
      property: 'isEnabled',
      label: 'Status',
      isShown: true,
      renderColumn: (value) => (
        <Label rounded title="Status" color={value ? 'gronsta' : 'error'} inverted>
          {value ? 'Aktiv' : 'Inaktiv'}
        </Label>
      ),
      isColumnSortable: true,
    },
    {
      property: 'change',
      label: 'Ändra',
      isShown: true,
      renderColumn: (value, user) => (
        <button onClick={() => handleEdit(user)} aria-label={`Redigera ${user.displayname}`}>
          <Edit className="cursor-pointer" color="#005595" />
        </button>
      ),
      isColumnSortable: false,
    },
  ];

  const resursHeaders: DataTableHeader[] = [
    {
      property: 'name',
      label: 'Namn',
      isShown: true,
      renderColumn: (value) => (
        <div className="flex items-center gap-2">
          <Avatar
            // imageUrl=""
            rounded
            initials={getInitials(value)}
          />
          <span className="ml-8 font-bold">{value}</span>
        </div>
      ),
      isColumnSortable: true,
    },
    { property: 'personalNumber', label: 'Personnummer', isShown: true, isColumnSortable: true },

    {
      property: 'itResourceStatus',
      label: 'IT-resurs',
      isShown: true,
      renderColumn: (value) => (
        <Label rounded title="IT-resurs" color={value === 'Aktiv' ? 'gronsta' : 'error'} inverted>
          {value}
        </Label>
      ),
      isColumnSortable: true,
    },

    {
      property: 'resource1Status',
      label: 'Resurs 1',
      isShown: true,
      renderColumn: (value) => (
        <Label rounded title="Resurs 1" color={value === 'Aktiv' ? 'gronsta' : 'error'} inverted>
          {value}
        </Label>
      ),
      isColumnSortable: true,
    },

    {
      property: 'resource2Status',
      label: 'Resurs 2',
      isShown: true,
      renderColumn: (value) => (
        <Label rounded title="Resurs 2" color={value === 'Aktiv' ? 'gronsta' : 'error'} inverted>
          {value}
        </Label>
      ),
      isColumnSortable: true,
    },

    {
      property: 'generalStatus',
      label: 'Status',
      isShown: true,
      renderColumn: (value) => (
        <Label rounded title="Status" color={value === 'Aktiv' ? 'gronsta' : 'error'} inverted>
          {value}
        </Label>
      ),
      isColumnSortable: true,
    },
    {
      property: 'change',
      label: 'Ändra',
      isShown: true,
      renderColumn: (value, user) => (
        <button onClick={() => handleEdit(user)} aria-label={`Redigera ${user.displayname}`}>
          <Edit color="#005595" />
        </button>
      ),
      isColumnSortable: false,
    },
  ];

  const headers = activeMenuIndex === 0 ? studentHeaders : resursHeaders;

  let lastFocusedElement: HTMLElement | null = null;

  const handleEdit = (user: Pupil | Resurs) => {
    lastFocusedElement = document.activeElement as HTMLElement;
    setSelectedUser(user);

    if (activeMenuIndex === 0 && 'personId' in user) {
      setEditStudentModalOpen(true);
    } else if (activeMenuIndex === 1 && 'user' in user) {
      setEditResursModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setEditStudentModalOpen(false);
    setEditResursModalOpen(false);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null; // Reset to null after focusing
    }
  };

  return (
    <div role="main" className=" mt-6" id="table-to-export" aria-live="polite" aria-atomic="true">
      {data && data.length > 0 && (
        <DataTable variant="datatable" background={true} dense={false} data={data} headers={headers} pageSize={10} />
      )}

      {isEditStudentModalOpen && selectedUser && (
        <EditPupilModal
          aria-labelledby="Redigera student"
          pupil={selectedUser as Pupil}
          onClose={handleCloseModal}
          onSave={handleCloseModal}
          show={isEditStudentModalOpen}
          aria-modal="true"
        />
      )}
      {isEditResursModalOpen && selectedUser && (
        <EditResursModal
          aria-labelledby="Redigera resurs"
          user={selectedUser as Resurs}
          onClose={handleCloseModal}
          onSave={handleCloseModal}
          show={isEditResursModalOpen}
          aria-modal="true"
        />
      )}
    </div>
  );
};
