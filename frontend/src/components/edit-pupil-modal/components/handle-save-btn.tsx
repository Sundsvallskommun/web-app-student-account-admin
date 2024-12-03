import { Pupil } from '@interfaces/school';
import { updatePupil } from '@services/school.service';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';

type HandleSaveBtnProps = {
  onSave: () => void;
  hasChanges: boolean;
  setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updatedPupil: Pupil;
  originalPupilData: Pupil;
};

const HandleSaveBtn = ({
  onSave,
  hasChanges,
  setIsConfirmationModalOpen,
  updatedPupil,
  originalPupilData,
}: HandleSaveBtnProps) => {
  const { showConfirmation } = useConfirm();
  const snackbar = useSnackbar();

  const handleSave = async () => {
    const payload = {
      pupilLoginName: updatedPupil.loginname,
      isEnabled: updatedPupil.isEnabled,
      displayname: updatedPupil.displayname,
      password: updatedPupil.password,
    };

    // Check for changes and only include changed fields in the payload
    if (updatedPupil.displayname !== originalPupilData.displayname) {
      payload.displayname = updatedPupil.displayname;
    } else {
      delete payload.displayname;
    }
    if (updatedPupil.isEnabled !== originalPupilData.isEnabled) {
      payload.isEnabled = updatedPupil.isEnabled;
    } else {
      delete payload.isEnabled;
    }
    if (updatedPupil.password && updatedPupil.password !== originalPupilData.password) {
      payload.password = updatedPupil.password;
    } else {
      delete payload.password;
    }

    const confirmationTitle = 'Bekräfta ändringar';
    const confirmationMessage = 'Är du säker på att du vill spara dessa ändringar?';
    const confirmLabel = 'Ja, spara';
    const dismissLabel = 'Avbryt';

    setIsConfirmationModalOpen(true);
    const confirmed = await showConfirmation(confirmationTitle, confirmationMessage, confirmLabel, dismissLabel);
    setIsConfirmationModalOpen(false);

    if (confirmed) {
      try {
        const response = await updatePupil(payload);

        if (response.error) {
          snackbar({
            message: response.message,
            status: 'error',
            position: 'bottom-right',
            className: 'mr-[7rem]',
          });
        } else {
          snackbar({
            message: 'Ändringarna har sparats',
            status: 'success',
            position: 'bottom-right',
            className: 'mr-[7rem]',
          });
          onSave();
        }
      } catch (error) {
        snackbar({
          message: error.message || 'Något gick fel',
          status: 'error',
          position: 'bottom-right',
          className: 'mr-[7rem]',
        });
      }
    }
  };

  return (
    <Button
      variant={hasChanges ? 'primary' : 'tertiary'}
      color="vattjom"
      className="w-[calc(50%-0.75rem)]"
      onClick={handleSave}
      disabled={!hasChanges}
    >
      Spara ändringar
    </Button>
  );
};

export default HandleSaveBtn;
