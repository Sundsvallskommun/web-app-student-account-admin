import { Pupil, ResourceData } from '@interfaces/school';
import { useUserStore } from '@services/user-service/user-service';
import { NavigationBar } from '@sk-web-gui/react';
import React from 'react';

interface DataTypeMenuBarProps {
  activeMenuIndex: number;
  onMenuChange: (index: number) => void;
  pupils: Pupil[];
  resources: ResourceData[];
  pupilSearchResults: Pupil[];
  resourceSearchResults: ResourceData[];
}

const DataTypeMenuBar: React.FC<DataTypeMenuBarProps> = ({
  activeMenuIndex,
  onMenuChange,
  pupils,
  resources,
  pupilSearchResults,
  resourceSearchResults,
}) => {
  const { user } = useUserStore();

  const pupilButtonText = `Elever (${
    pupilSearchResults?.length > 0 ? pupilSearchResults?.length : (pupils?.length ?? 0)
  })`;

  const resourceButtonText = `Resurser (${
    resourceSearchResults?.length > 0 ? resourceSearchResults?.length : (resources?.length ?? 0)
  })`;

  return (
    <NavigationBar color="vattjom" current={activeMenuIndex} showBackground={false}>
      <NavigationBar.Item>
        <button onClick={() => onMenuChange(0)} className="min-w-[12rem]">
          {pupilButtonText}
        </button>
      </NavigationBar.Item>
      {user.role === 'admin' ? (
        <NavigationBar.Item>
          <button onClick={() => onMenuChange(1)} className="min-w-[12rem]">
            {resourceButtonText}
          </button>
        </NavigationBar.Item>
      ) : null}
    </NavigationBar>
  );
};

export default DataTypeMenuBar;
