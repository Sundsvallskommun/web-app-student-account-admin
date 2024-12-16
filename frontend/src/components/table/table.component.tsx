import EditPupilModal from '@components/edit-pupil-modal/edit-pupil-modal.component';
import { Pupil, ResourceData } from '@interfaces/school';
import { deleteResourceFromSchool } from '@services/school.service';
import { AutoTable, AutoTableHeader, Avatar, Label, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { getInitials } from '@utils/get-initials';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSchoolStore from 'src/store/useSchoolStore.store';

const imageUrlToBase64 = async (url: string) => {
  const response = await fetch(url, { credentials: 'include' });
  const blob = await response.blob();
  return new Promise((onSuccess, onError) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        onSuccess(this.result);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      onError(e);
    }
  });
};

const fetchPrefetchedImages = async (data: Pupil[]): Promise<Record<string, string>> => {
  const imagePromises = data.map(async (pupil) => {
    if (pupil.personId) {
      const base64Image = (await imageUrlToBase64(apiURL(`/image/${pupil.personId}?width=480`))) as string; // Pass the raw ArrayBuffer from the response

      return { [pupil.personId]: base64Image };
    }
    return null;
  });

  const resolvedImages = await Promise.all(imagePromises);

  // Merge all objects into a single object
  return resolvedImages.reduce(
    (acc, curr) => {
      if (curr) {
        Object.assign(acc, curr);
      }
      return acc;
    },
    {} as Record<string, string>
  );
};

interface TableProps {
  data: (Pupil | ResourceData)[];
  activeMenuIndex: number;
  isPrintMode?: boolean;
  selectedSchoolName: string;
  selectedSchoolId?: string;
  selectedClassId?: string;
}

export const Table: React.FunctionComponent<TableProps> = ({
  data,
  activeMenuIndex,
  isPrintMode,
  selectedSchoolId,
  selectedClassId,
}) => {
  const [selectedUser, setSelectedUser] = useState<Pupil | ResourceData | null>(null);
  const [isEditStudentModalOpen, setEditStudentModalOpen] = useState<boolean>(false);
  const [prefetchedImages, setPrefetchedImages] = useState<Record<string, string>>({});

  const { showConfirmation } = useConfirm();
  const snackbar = useSnackbar();

  const { fetchResources, fetchPupils } = useSchoolStore();

  const isPupilType = activeMenuIndex === 0;

  const getPrefetchedImages = async (data) => {
    const prefetchedImages = await fetchPrefetchedImages(data);
    setPrefetchedImages(prefetchedImages);
  };

  useEffect(() => {
    if (isPupilType) {
      getPrefetchedImages(data);
    }
  }, [isPupilType, data]);

  const studentHeaders: AutoTableHeader[] = [
    {
      property: 'image',
      label: 'Bild',
      isShown: true,
      isColumnSortable: false,
      renderColumn: (value: string, obj: any) => (
        <Avatar imageUrl={prefetchedImages[obj.personId]} rounded initials={getInitials(value)} size="md" />
      ),
    },
    {
      property: 'displayname',
      label: 'Namn',
      isShown: true,
      isColumnSortable: true,
      renderColumn: (value: string, obj: any) => <span className="font-bold">{value}</span>,
    },
    { property: 'personNumber', label: 'Född datum', isShown: true, isColumnSortable: true },
    { property: 'loginname', label: 'Användarnamn', isShown: true, isColumnSortable: true },
    { property: 'name', label: 'Skola', isShown: true, isColumnSortable: true },
    { property: 'className', label: 'Klass', isShown: true, isColumnSortable: true },
    {
      property: 'isEnabled',
      label: 'Status',
      isShown: true,
      renderColumn: (value: string) => (
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
      renderColumn: (value, user: Pupil) => (
        <button onClick={() => handleEdit(user)} title="Ändra" aria-label={`Ändra ${user.displayname}`}>
          <Edit className="cursor-pointer ml-[0.7rem]" color="#005595" />
        </button>
      ),
      isColumnSortable: false,
    },
  ]
    .filter((x) => {
      if (isPrintMode) {
        if (['image', 'displayname', 'loginname'].includes(x.property)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    })
    .map((x) =>
      x.property === 'image' && isPrintMode
        ? {
            property: 'image',
            label: 'Bild',
            isShown: true,
            isColumnSortable: false,
            renderColumn: (value: string, obj: any) => (
              <img
                style={{ display: 'inline-block', height: '100%' }}
                src={prefetchedImages[obj.personId]}
                alt="bild på even"
              />
            ),
          }
        : x
    );

  const resursHeaders: AutoTableHeader[] = [
    {
      property: 'name',
      label: 'Namn',
      isShown: true,
      isColumnSortable: true,
    },
    { property: 'loginname', label: 'Användarnamn', isShown: true, isColumnSortable: true },
    {
      property: 'schoolName',
      label: 'Skola',
      isShown: true,
      isColumnSortable: true,
    },
    {
      property: 'delete',
      label: 'Ta bort',
      isShown: true,
      renderColumn: (value: string, user: ResourceData) => (
        <button onClick={() => deleteResource(user)} title={`Ta bort ${user.name}`} aria-label={`Ta bort ${user.name}`}>
          <Trash2 className="cursor-pointer ml-[0.8rem]" color="#005595" />
        </button>
      ),
      isColumnSortable: false,
    },
  ];

  const headers = activeMenuIndex === 0 ? studentHeaders : resursHeaders;

  const handleEdit = (user: Pupil | ResourceData) => {
    setSelectedUser(user);

    if (activeMenuIndex === 0 && 'personId' in user) {
      setEditStudentModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setEditStudentModalOpen(false);
  };

  const handleSavePupil = () => {
    handleCloseModal();
    selectedClassId && fetchPupils(selectedClassId);
  };

  const deleteResource = async (user: ResourceData) => {
    const confirmationTitle = 'Ta bort resurs';
    const confirmationMessage = (
      <>
        <span className="block font-bold text-[28px] mb-24">Vill du ta bort resursen?</span>
        <span className="block">Kopplingen till resursen kommer att tas bort.</span>
      </>
    );
    const confirmLabel = 'Ta bort';
    const dismissLabel = 'Avbryt';
    const dialogType = 'error';

    const confirmed = await showConfirmation(
      confirmationTitle,
      confirmationMessage,
      confirmLabel,
      dismissLabel,
      dialogType
    );

    if (confirmed) {
      try {
        await deleteResourceFromSchool(user.loginname, selectedSchoolId);
        await fetchResources(selectedSchoolId);
        snackbar({
          message: 'Resursen har tagits bort',
          status: 'error',
          position: 'bottom-right',
          className: 'mr-[7rem]',
        });
      } catch (error) {
        console.error('Failed to delete resource:', error);
      }
    }
  };

  return (
    <div
      role="main"
      className="mt-6"
      id={isPrintMode ? 'table-to-export' : ''}
      style={isPrintMode ? { display: 'none' } : {}}
      aria-live="polite"
      aria-atomic="true"
    >
      {data && data.length > 0 && (
        <AutoTable
          background={true}
          dense={false}
          autodata={data}
          autoheaders={headers}
          pageSize={isPrintMode ? 100 : 10}
        />
      )}

      {isEditStudentModalOpen && selectedUser && (
        <EditPupilModal
          aria-labelledby="Redigera student"
          pupil={selectedUser as Pupil}
          onClose={handleCloseModal}
          onSave={handleSavePupil}
          show={isEditStudentModalOpen}
          aria-modal="true"
        />
      )}
    </div>
  );
};
