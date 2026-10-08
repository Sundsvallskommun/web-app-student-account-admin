import { Pupil, ResourceData } from '@interfaces/school';
import { searchPupils, searchResources } from '@services/school.service';
import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';

export const MIN_SEARCH_LENGTH = 3;

/**
 * Debounced free-text search for pupils (tab 0) or resources (tab 1).
 * Queries shorter than MIN_SEARCH_LENGTH clear the results without calling the API.
 */
export const useAccountSearch = (activeMenuIndex: number) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pupilSearchResults, setPupilSearchResults] = useState<Pupil[]>([]);
  const [resourceSearchResults, setResourceSearchResults] = useState<ResourceData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const activeMenuIndexRef = useRef(activeMenuIndex);

  useEffect(() => {
    activeMenuIndexRef.current = activeMenuIndex;
  }, [activeMenuIndex]);

  const runSearch = async (query: string) => {
    if (query.length < MIN_SEARCH_LENGTH) return;
    try {
      if (activeMenuIndexRef.current === 0) {
        const response = await searchPupils({ searchString: query });
        setPupilSearchResults(response.data || []);
      } else if (activeMenuIndexRef.current === 1) {
        const response = await searchResources(query);
        setResourceSearchResults(response.data || []);
      }
    } catch (error) {
      setPupilSearchResults([]);
      setResourceSearchResults([]);
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  // The debounced function only reads activeMenuIndexRef when lodash invokes it later (never during
  // render); the react-hooks/refs rule cannot see through debounce() and flags it anyway.
  // eslint-disable-next-line react-hooks/refs
  const debouncedSearch = useMemo(() => debounce(runSearch, 500), []);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const resetSearch = () => {
    setSearchQuery('');
    setPupilSearchResults([]);
    setResourceSearchResults([]);
  };

  const search = (query: string) => {
    setSearchQuery(query);
    if (query.length >= MIN_SEARCH_LENGTH) {
      setIsSearching(true);
      debouncedSearch(query);
    } else {
      setIsSearching(false);
      setPupilSearchResults([]);
      setResourceSearchResults([]);
    }
  };

  return { searchQuery, pupilSearchResults, resourceSearchResults, isSearching, search, resetSearch };
};
