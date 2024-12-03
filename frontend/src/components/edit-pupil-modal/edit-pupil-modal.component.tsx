import { Pupil } from '@interfaces/school';
import {
  Avatar,
  Button,
  ConfirmationDialogContextProvider,
  FormLabel,
  Modal,
  RadioButton,
  TextField,
} from '@sk-web-gui/react';
import { getInitials } from '@utils/get-initials';
import { useEffect, useState } from 'react';
import PasswordBtn from './components/password-btn';
import HandleSaveBtn from './components/handle-save-btn';
export interface EditPupilModalProps {
  pupil: Pupil;
  onClose: () => void;
  onSave: () => void;
  show: boolean;
}

const EditPupilModal: React.FC<EditPupilModalProps> = ({ pupil, onClose, onSave, show }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [pupilData, setPupilData] = useState<Pupil | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [originalPupilData, setOriginalPupilData] = useState<Pupil | null>(null);

  useEffect(() => {
    if (pupil) {
      setPupilData(pupil);
      setOriginalPupilData(pupil); // Capture original data
      setHasChanges(false);
    }
  }, [pupil]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isConfirmationModalOpen) {
          setIsConfirmationModalOpen(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
    };
  }, [onClose, isConfirmationModalOpen]);

  const checkForChanges = (currentData: Pupil, originalData: Pupil) => {
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPupilData((prev) => {
      if (prev) {
        const newData = { ...prev, [name]: value };
        setHasChanges(checkForChanges(newData, pupil));
        return newData;
      }
      return prev;
    });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIsEnabled = event.target.value === 'Aktiv'; // Convert string to boolean
    setPupilData((prev) => {
      if (prev) {
        const newData = { ...prev, isEnabled: newIsEnabled };
        // Check for changes against the original pupil prop
        setHasChanges(checkForChanges(newData, pupil));
        return newData;
      }
      return prev;
    });
  };

  if (!pupilData) return null;

  return (
    <Modal
      aria-label="Ändra elevkonto"
      show={show}
      label="Ändra elevkonto"
      onClose={onClose}
      className="h-full w-full z-10 gap-14 md:w-[42rem]"
    >
      <div className="flex gap-12">
        <Avatar
          // imageUrl=""
          rounded
          size="lg"
          initials={getInitials(pupilData.displayname)}
          className="flex-shrink-0"
        />
        <h2
          className="text-2xl self-center overflow-hidden text-ellipsis"
          style={{ fontVariantNumeric: 'lining-nums proportional-nums' }}
        >
          {pupilData.displayname}
        </h2>
      </div>
      <div className="flex flex-col gap-14 z-12 mt-16">
        <FormLabel htmlFor="birthdate" className="-mb-8">
          Född datum
        </FormLabel>
        <TextField id="birthdate" value={pupilData.personNumber} type="text" readOnly disabled />

        <FormLabel htmlFor="AD-name" className="-mb-8">
          Visningsnamn i AD
        </FormLabel>
        <TextField
          id="AD-name"
          value={pupilData.displayname}
          name="displayname"
          aria-label="Visningsnamn i AD"
          type="text"
          onChange={handleChange}
        />

        <FormLabel htmlFor="password" className="-mb-8">
          Lösenord
        </FormLabel>
        <div className="flex justify-between w-full ">
          <TextField
            id="password"
            value={pupilData.password}
            className="w-[calc(50%-1.5rem)]"
            type="text"
            readOnly
            disabled
          />
          <ConfirmationDialogContextProvider>
            <PasswordBtn
              setPupilData={setPupilData}
              onClose={onClose}
              setIsConfirmationModalOpen={setIsConfirmationModalOpen}
            />
          </ConfirmationDialogContextProvider>
        </div>

        <FormLabel htmlFor="status" className="-mb-8">
          Status
        </FormLabel>
        <RadioButton.Group
          value={pupilData.isEnabled ? 'Aktiv' : 'Inaktiv'}
          name="isEnabled"
          inline
          onChange={handleStatusChange}
        >
          <RadioButton size="md" id="status-aktiv" value={'Aktiv'}>
            Aktiv
          </RadioButton>
          <RadioButton size="md" id="status-inaktiv" value={'Inaktiv'}>
            Inaktiv
          </RadioButton>
        </RadioButton.Group>

        <div className="flex justify-between w-full mt-16">
          <Button variant="secondary" type="button" className="w-[calc(50%-0.75rem)]" onClick={onClose}>
            Avbryt
          </Button>
          <ConfirmationDialogContextProvider>
            <HandleSaveBtn
              onSave={onSave}
              hasChanges={hasChanges}
              setIsConfirmationModalOpen={setIsConfirmationModalOpen}
              updatedPupil={pupilData}
              originalPupilData={originalPupilData} // Pass original pupil data
            />
          </ConfirmationDialogContextProvider>
        </div>
      </div>
    </Modal>
  );
};

export default EditPupilModal;
