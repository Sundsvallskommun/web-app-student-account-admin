import { Pupil } from '@interfaces/school';
import { generatePupilPassword } from '@services/school.service';
import { Avatar, Button, FormLabel, Modal, RadioButton, TextField, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { getInitials } from '@utils/get-initials';
import { useEffect, useRef, useState } from 'react';

export interface EditPupilModalProps {
  pupil: Pupil;
  onClose: () => void;
  onSave: () => void;
  show: boolean;
}

const EditPupilModal: React.FC<EditPupilModalProps> = ({ pupil, onClose, onSave, show }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [pupilData, setPupilData] = useState<Pupil | null>(null);

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pupil) {
      setPupilData(pupil);
      setHasChanges(false);
    }
  }, [pupil]);

  useEffect(() => {
    if (pupil) {
      setPupilData(pupil);
      setHasChanges(false);

      setTimeout(() => {
        const inputField = document.getElementById('AD-name');
        if (inputField) {
          inputField.focus();
        }
      }, 0);
    }
  }, [pupil]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown as unknown as EventListener);
    return () => {
      document.removeEventListener('keydown', handleKeyDown as unknown as EventListener);
    };
  }, [onClose]);

  const { showConfirmation } = useConfirm();

  const snackbar = useSnackbar();

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

  const handleSave = async () => {
    const confirmationTitle = 'Bekräfta ändringar';
    const confirmationMessage = 'Är du säker på att du vill spara dessa ändringar?';
    const confirmLabel = 'Ja, spara';
    const dismissLabel = 'Avbryt';

    const confirmed = await showConfirmation(confirmationTitle, confirmationMessage, confirmLabel, dismissLabel);

    if (confirmed) {
      // Your logic to save changes goes here

      snackbar({
        message: 'Ändringarna har sparats',
        status: 'success',
        position: 'bottom-right',
      });
    }
    onSave();
  };

  console.log('pupilData', pupilData);

  const handleNewPasswordClick = async () => {
    const confirmationTitle = 'Vänligen bekräfta ditt val.';
    const confirmationMessage = 'Vill du skapa ett nytt lösenord för användaren?';
    const confirmLabel = 'Ja, skapa nytt lösenord';
    const dismissLabel = 'Avbryt';

    const confirmed = await showConfirmation(confirmationTitle, confirmationMessage, confirmLabel, dismissLabel);
    if (confirmed) {
      const { data, message, error } = await generatePupilPassword();

      if (error) {
        snackbar({
          message: error.message || 'Error generating new password',
          status: 'error',
          position: 'bottom-right',
        });
      } else {
        // Update the pupilData with the new password
        setPupilData((prev) => ({ ...prev, password: data }));

        snackbar({
          message: message || 'Ett nytt lösenord har skapats',
          status: 'success',
          position: 'bottom-right',
        });
      }
    }
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
      <div className="flex gap-3">
        <Avatar
          // imageUrl=""
          rounded
          size="lg"
          initials={getInitials(pupilData.displayname)}
        />
        <h2 className="text-2xl self-center" style={{ fontVariantNumeric: 'lining-nums proportional-nums' }}>
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
          ref={firstInputRef}
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
          <Button
            size="lg"
            type="button"
            variant="secondary"
            className="w-[calc(50%-1.5rem)]"
            onClick={handleNewPasswordClick}
          >
            Nytt lösenord
          </Button>
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
          <Button
            variant={hasChanges ? 'primary' : 'tertiary'}
            color="vattjom"
            className="w-[calc(50%-0.75rem)]"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Spara ändringar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditPupilModal;
