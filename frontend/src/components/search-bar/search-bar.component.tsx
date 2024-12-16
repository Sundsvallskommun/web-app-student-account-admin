import { TextField } from '@sk-web-gui/react';
import React from 'react';

interface SearchBarProps {
  activeMenuIndex: number;
  searchQuery: string;
  onSearchChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ activeMenuIndex, searchQuery, onSearchChangeHandler }) => {
  return (
    <TextField
      size="md"
      placeholder={activeMenuIndex === 0 ? 'Sök elevkonton...' : 'Sök resurs...'}
      value={searchQuery}
      onChange={onSearchChangeHandler}
      className="w-[386px] h-[40px] ml-auto"
      aria-label={activeMenuIndex === 0 ? 'Sökfält för elevkonton' : 'Sökfält för resurskonton'}
    />
  );
};

export default SearchBar;
