import { Pupil, ResourceData } from '@interfaces/school';
import { MenuBar } from '@sk-web-gui/react';
import React from 'react';

interface DataTypeMenuBarProps {
  activeMenuIndex: number;
  onMenuChange: (index: number) => void;
  pupilCount: number;
  resourceCount: number;
  pupilSearchResults: Pupil[];
  resourceSearchResults: ResourceData[];
}

const DataTypeMenuBar: React.FC<DataTypeMenuBarProps> = ({
  activeMenuIndex,
  onMenuChange,
  pupilCount = 0,
  resourceCount = 0,
  pupilSearchResults,
  resourceSearchResults,
}) => {
  const pupilButtonText = `Elever (${
    pupilSearchResults?.length > 0 && pupilSearchResults.every((result) => result.personNumber !== '')
      ? pupilSearchResults?.length
      : pupilCount
  })`;

  const resourceButtonText = `Resurser (${
    resourceSearchResults?.length > 0 && resourceSearchResults.every((result) => result.name !== '')
      ? resourceSearchResults?.length
      : resourceCount
  })`;

  return (
    <MenuBar color="vattjom" current={activeMenuIndex} showBackground={false}>
      <MenuBar.Item>
        <button onClick={() => onMenuChange(0)} className="min-w-[12rem]">
          {pupilButtonText}
        </button>
      </MenuBar.Item>
      <MenuBar.Item>
        <button onClick={() => onMenuChange(1)} className="min-w-[12rem]">
          {resourceButtonText}
        </button>
      </MenuBar.Item>
    </MenuBar>
  );
};

export default DataTypeMenuBar;
