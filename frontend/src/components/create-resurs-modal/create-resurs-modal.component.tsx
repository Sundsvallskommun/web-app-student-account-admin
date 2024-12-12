import { School } from '@interfaces/school';
import { addResourceToSchool } from '@services/school.service';
import { Button, FormLabel, Modal, TextField, useSnackbar, Select } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import useSchoolStore from 'src/store/useSchoolStore.store';

export interface CreateResursModalProps {
  onClose: () => void;
  onSave: () => void;
  show: boolean;
  selectedSchoolId: string;
  setSelectedSchoolId: (schoolId: string) => void;
  schools: School[];
}

const CreateResursModal: React.FC<CreateResursModalProps> = ({
  onClose,
  onSave,
  show,
  selectedSchoolId,
  setSelectedSchoolId,
  schools,
}) => {
  const [userName, setUserName] = useState<string>('');

  // Determine if the save button should be enabled
  const hasUserWrittenAUsername = userName.trim().length > 0;
  const hasSchoolBeenSelected = selectedSchoolId !== '';

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const snackbar = useSnackbar();

  const { fetchResources } = useSchoolStore();

  const handleSave = async () => {
    const res = await addResourceToSchool(userName, selectedSchoolId);
    if (!res.error) {
      snackbar({
        message: 'Resursen har skapats',
        status: 'success',
        position: 'bottom-right',
        className: 'mr-[7rem]',
      });
      fetchResources(selectedSchoolId);
      onSave();
    } else {
      snackbar({
        message: 'Resursen kunde inte läggas till',
        status: 'error',
        position: 'bottom-right',
        className: 'mr-[7rem]',
      });
    }
  };

  return (
    <Modal
      aria-label="Lägg till ny resurs"
      show={show}
      label="Lägg till ny resurs"
      onClose={onClose}
      className="h-full w-full z-10 gap-24 md:w-[42rem]"
      aria-labelledby="Lägg till ny resurs"
      aria-describedby="Lägg till ny resurs"
    >
      <div className="">
        <h2
          id="Lägg till ny resurs"
          className="text-2xl self-center overflow-hidden text-ellipsis"
          style={{ fontVariantNumeric: 'lining-nums proportional-nums' }}
        >
          Ny resurs
        </h2>
      </div>
      <div className="flex flex-col gap-16 z-12">
        <FormLabel htmlFor="userName" className="-mb-8 ">
          Användarnamn
        </FormLabel>
        <TextField
          id="userName"
          name="userName"
          type="text"
          aria-label="Användarnamn"
          onChange={handleUserNameChange}
        />

        <FormLabel htmlFor="create resuource school" className="flex items-start flex-col">
          Skola
          <Select
            id="create resuource school"
            aria-label="Ny resurs modal, välj skola"
            className="cursor-pointer w-full mt-8  bg-custom-gray"
            value={selectedSchoolId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSchoolId(e.target.value)}
          >
            <Select.Option disabled value="">
              - Välj skola -
            </Select.Option>
            {schools
              .filter((school) => school.unitId !== '00000000-0000-0000-0000-000000000000') // Filter out the placeholder from the API
              .map((school) => (
                <Select.Option key={school.unitId} value={school.unitId}>
                  {school.name}
                </Select.Option>
              ))}
          </Select>
        </FormLabel>

        <div className="flex justify-between w-full mt-16">
          <Button
            aria-label="Avbryt och stäng modal"
            variant="secondary"
            type="button"
            className="w-[calc(50%-0.75rem)]"
            onClick={onClose}
          >
            Avbryt
          </Button>
          <Button
            aria-label="Spara ändringar"
            variant={hasUserWrittenAUsername && hasSchoolBeenSelected ? 'primary' : 'tertiary'}
            color="vattjom"
            className="w-[calc(50%-0.75rem)]"
            onClick={handleSave}
            disabled={!hasUserWrittenAUsername || !hasSchoolBeenSelected}
          >
            Spara
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateResursModal;
