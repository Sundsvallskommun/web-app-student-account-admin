import { Pupil } from '@interfaces/school';
import { generatePupilPassword } from '@services/school.service';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';

type PasswordBtnProps = {
  setPupilData: React.Dispatch<React.SetStateAction<Pupil | null>>;
  onClose: () => void;
  setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const PasswordBtn = ({ setPupilData, onClose, setIsConfirmationModalOpen }: PasswordBtnProps) => {
  const { showConfirmation } = useConfirm();
  const snackbar = useSnackbar();

  const handleNewPasswordClick = async () => {
    const confirmationTitle = 'Skapa nytt lösenord?';
    const confirmationMessage = 'Vill du skapa ett nytt lösenord för användaren?';
    const confirmLabel = 'Ja, skapa nytt lösenord';
    const dismissLabel = 'Avbryt';

    setIsConfirmationModalOpen(true);
    const confirmed = await showConfirmation(confirmationTitle, confirmationMessage, confirmLabel, dismissLabel);
    setIsConfirmationModalOpen(false);

    if (confirmed) {
      const { data, error } = await generatePupilPassword();

      if (error) {
        snackbar({
          message: error.message || 'Problem med att skapa nytt lösenord',
          status: 'error',
          position: 'bottom-right',
          className: 'mr-[7rem]',
        });
      } else {
        // Update the pupilData with the new password
        setPupilData((prev: Pupil) => ({ ...prev, password: data }));

        snackbar({
          message: 'Ett nytt lösenord har skapats',
          status: 'success',
          position: 'bottom-right',
          className: 'mr-[7rem]',
        });
        onClose();
      }
    }
  };
  return (
    <Button type="button" variant="secondary" className="w-[calc(50%-1.5rem)]" onClick={handleNewPasswordClick}>
      Nytt lösenord
    </Button>
  );
};

export default PasswordBtn;
