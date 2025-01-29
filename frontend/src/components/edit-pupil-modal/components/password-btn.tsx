import { Pupil } from '@interfaces/school';
import { generatePupilPassword } from '@services/school.service';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';
import React from 'react';

type PasswordBtnProps = {
  setPupilData: React.Dispatch<React.SetStateAction<Pupil | null>>;
  onClose: () => void;
  setIsConfirmationModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

const PasswordBtn = ({ setPupilData, setHasChanges }: PasswordBtnProps) => {
  const { showConfirmation } = useConfirm();
  const snackbar = useSnackbar();

  const handleNewPasswordClick = async () => {
    const confirmationTitle = 'Skapa nytt lösenord?';
    const confirmationMessage = 'Vill du skapa ett nytt lösenord för användaren?';
    const confirmLabel = 'Ja, skapa nytt lösenord';
    const dismissLabel = 'Avbryt';

    const confirmed = await showConfirmation(confirmationTitle, confirmationMessage, confirmLabel, dismissLabel);

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
        setPupilData((prev: Pupil) => ({ ...prev, password: data }));
        setHasChanges(true);
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
