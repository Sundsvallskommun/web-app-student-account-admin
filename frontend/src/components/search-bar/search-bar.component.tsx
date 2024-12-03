import React from 'react';
import { MenuBar, TextField } from '@sk-web-gui/react';
import { Pupil, ResourceData } from '@interfaces/school';

interface SearchBarProps {
  activeMenuIndex: number;
  searchQuery: string;
  onSearchChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMenuChange: (index: number) => void;
  pupilCount: number;
  resourceCount: number;
  pupilSearchResultsLength: number;
  pupilSearchResults: Pupil[];
  resourceSearchResultsLength: number;
  resourceSearchResults: ResourceData[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  activeMenuIndex,
  searchQuery,
  onSearchChangeHandler,
  onMenuChange,
  pupilCount = 0,
  resourceCount = 0,
  pupilSearchResultsLength,
  pupilSearchResults,
  resourceSearchResultsLength,
  resourceSearchResults,
}) => {
  const pupilButtonText = `Elever (${
    activeMenuIndex === 1
      ? '0'
      : pupilSearchResultsLength > 0 && pupilSearchResults.every((result) => result.personNumber !== '')
        ? pupilSearchResultsLength
        : pupilCount
  })`;

  const resourceButtonText = `Resurser (${
    activeMenuIndex === 0
      ? '0'
      : resourceSearchResultsLength > 0 && resourceSearchResults.every((result) => result.name !== '')
        ? resourceSearchResultsLength
        : resourceCount
  })`;

  return (
    <div className="flex items-center my-24">
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
      <TextField
        size="md"
        placeholder={activeMenuIndex === 0 ? 'Sök elevkonton...' : 'Sök resurs...'}
        value={searchQuery}
        onChange={onSearchChangeHandler}
        className="w-[386px] h-[40px] ml-auto"
        aria-label={activeMenuIndex === 0 ? 'Sökfält för elevkonton' : 'Sökfält för resurskonton'}
      />
    </div>
  );
};

export default SearchBar;
