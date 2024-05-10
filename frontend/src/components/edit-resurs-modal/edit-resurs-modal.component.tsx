import { Avatar, Button, FormLabel, Modal, RadioButton, TextField, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { useCallback, useEffect, useState } from 'react';

export interface EditResursModalProps {
  user: Resurs;
  onClose: () => void;
  onSave: () => void;
  show: boolean;
}

export interface Resurs {
  personalNumber: string;
  itResourceStatus: string;
  resource1Status: string;
  resource2Status: string;
  generalStatus: string;
  name: string;
}

const EditResursModal: React.FC<EditResursModalProps> = ({ user, onClose, onSave, show }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [resursData, setResursData] = useState<Resurs>({ ...user });

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

  const checkForChanges = useCallback(
    (currentData: Resurs) => {
      return JSON.stringify(currentData) !== JSON.stringify(user);
    },
    [user]
  );

  const handleStatusChange = useCallback(
    (statusType: keyof Resurs, newValue: string) => {
      setResursData((prev) => {
        const newData = { ...prev, [statusType]: newValue };
        setHasChanges(checkForChanges(newData));
        return newData;
      });
    },
    [checkForChanges]
  );

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

  return (
    <Modal
      aria-label="Ändra resursinformation"
      show={show}
      label="Ändra resurs"
      onClose={onClose}
      className="h-full w-full z-10 gap-14 md:w-[42rem]"
    >
      <div className="flex gap-3">
        <Avatar
          // imageUrl=""
          rounded
          size="lg"
          // initials={getInitials(pupilData.displayname)}
        />
        <h2 className="text-2xl self-center" style={{ fontVariantNumeric: 'lining-nums proportional-nums' }}>
          {resursData.name}
        </h2>
      </div>
      <div className="flex flex-col gap-14 z-12 mt-16">
        <FormLabel htmlFor="personalNumber" className="-mb-8">
          Personnummer
        </FormLabel>
        <TextField
          id="personalNumber"
          value={resursData.personalNumber}
          name="personalNumber"
          type="text"
          readOnly
          disabled
          aria-label="Personnummer"
        />

        <FormLabel htmlFor="itResourceStatus" className="-mb-8">
          IT-resurs
        </FormLabel>
        <RadioButton.Group
          value={resursData.itResourceStatus}
          name="itResourceStatus"
          inline
          onChange={(e) => handleStatusChange('itResourceStatus', e.target.value)}
        >
          <RadioButton aria-label="Ange status som aktiv" size="md" id="it-resource-status-active" value={'Aktiv'}>
            Aktiv
          </RadioButton>
          <RadioButton aria-label="Ange status som inaktiv" size="md" id="it-resurs-status-inactive" value={'Inaktiv'}>
            Inaktiv
          </RadioButton>
        </RadioButton.Group>

        <FormLabel className="-mb-8">Resurs 1</FormLabel>
        <RadioButton.Group
          value={resursData.resource1Status}
          name="resource1Status"
          inline
          onChange={(e) => handleStatusChange('resource1Status', e.target.value)}
        >
          <RadioButton aria-label="Ange status som aktiv" size="md" id="resource1-status-active" value={'Aktiv'}>
            Aktiv
          </RadioButton>
          <RadioButton aria-label="Ange status som inaktiv" size="md" id="resource1-status-inactive" value={'Inaktiv'}>
            Inaktiv
          </RadioButton>
        </RadioButton.Group>

        <FormLabel className="-mb-8">Resurs 2</FormLabel>
        <RadioButton.Group
          value={resursData.resource2Status}
          name="resource2Status"
          inline
          onChange={(e) => handleStatusChange('resource2Status', e.target.value)}
        >
          <RadioButton aria-label="Ange status som aktiv" size="md" id="resource2-status-active" value={'Aktiv'}>
            Aktiv
          </RadioButton>
          <RadioButton aria-label="Ange status som inaktiv" size="md" id="resource2-status-inactive" value={'Inaktiv'}>
            Inaktiv
          </RadioButton>
        </RadioButton.Group>

        <FormLabel className="-mb-8">Status</FormLabel>
        <RadioButton.Group
          value={resursData.generalStatus}
          name="generalStatus"
          inline
          onChange={(e) => handleStatusChange('generalStatus', e.target.value)}
        >
          <RadioButton aria-label="Ange status som aktiv" size="md" id="general-status-active" value={'Aktiv'}>
            Aktiv
          </RadioButton>
          <RadioButton aria-label="Ange status som inaktiv" size="md" id="general-status-inactive" value={'Inaktiv'}>
            Inaktiv
          </RadioButton>
        </RadioButton.Group>

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

export default EditResursModal;
