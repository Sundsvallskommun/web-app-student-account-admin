import { Table } from '@components/table/table.component';
import { Pupil, ResourceData } from '@interfaces/school';
import React from 'react';

import { MIN_SEARCH_LENGTH } from './use-account-search.hook';

const MIN_SEARCH_MESSAGE = 'Minsta sökord är på 3 bokstäver. Vill du se vald klass, töm sökfältet.';

const Message = ({ children }: Readonly<{ children: React.ReactNode }>) => <div className="font-bold">{children}</div>;

interface SearchResultsProps {
  activeMenuIndex: number;
  searchQuery: string;
  searchFieldTouched: boolean;
  pupilSearchResults: Pupil[];
  resourceSearchResults: ResourceData[];
  isPrintMode: boolean;
  selectedSchoolName: string;
}

const SearchResults = ({
  activeMenuIndex,
  searchQuery,
  searchFieldTouched,
  pupilSearchResults,
  resourceSearchResults,
  isPrintMode,
  selectedSchoolName,
}: Readonly<SearchResultsProps>) => {
  const results = activeMenuIndex === 0 ? pupilSearchResults : resourceSearchResults;

  if (results.length === 0) {
    const tooShort = searchQuery.length < MIN_SEARCH_LENGTH && searchFieldTouched;
    return <Message>{tooShort ? MIN_SEARCH_MESSAGE : 'Ingen data hittades...'}</Message>;
  }

  return (
    <Table
      data={results}
      activeMenuIndex={activeMenuIndex}
      isPrintMode={isPrintMode}
      selectedSchoolName={selectedSchoolName}
    />
  );
};

interface PupilsContentProps {
  pupils: Pupil[];
  selectedSchoolId: string;
  selectedClassId: string;
  selectedSchoolName: string;
  searchFieldTouched: boolean;
  isPrintMode: boolean;
}

const PupilsContent = ({
  pupils,
  selectedSchoolId,
  selectedClassId,
  selectedSchoolName,
  searchFieldTouched,
  isPrintMode,
}: Readonly<PupilsContentProps>) => {
  if (!selectedSchoolId) return <Message>Välj först en skola och sedan en klass.</Message>;
  if (!selectedClassId) return <Message>Välj en klass.</Message>;
  if (pupils.length === 0) {
    return <Message>{searchFieldTouched ? MIN_SEARCH_MESSAGE : 'Ingen elevdata tillgänglig.'}</Message>;
  }

  return (
    <Table
      data={pupils}
      activeMenuIndex={0}
      isPrintMode={isPrintMode}
      selectedSchoolName={selectedSchoolName}
      selectedClassId={selectedClassId}
    />
  );
};

interface ResourcesContentProps {
  resources: ResourceData[];
  isLoadingResources: boolean;
  selectedSchoolId: string;
  selectedSchoolName: string;
}

const ResourcesContent = ({
  resources,
  isLoadingResources,
  selectedSchoolId,
  selectedSchoolName,
}: Readonly<ResourcesContentProps>) => {
  if (isLoadingResources) return <Message>Laddar resurser...</Message>;
  if (!selectedSchoolId) return <Message>Välj en skola.</Message>;
  if (resources.length === 0) return <Message>Ingen resursdata tillgänglig.</Message>;

  return (
    <Table
      data={resources}
      activeMenuIndex={1}
      selectedSchoolName={selectedSchoolName}
      selectedSchoolId={selectedSchoolId}
    />
  );
};

export interface StudentAccountContentProps extends PupilsContentProps, ResourcesContentProps {
  activeMenuIndex: number;
  isLoading: boolean;
  searchQuery: string;
  pupilSearchResults: Pupil[];
  resourceSearchResults: ResourceData[];
}

/** The area under the filters: a status message or the pupils/resources table. */
const StudentAccountContent = (props: Readonly<StudentAccountContentProps>) => {
  const { activeMenuIndex, isLoading, searchQuery } = props;

  if (isLoading) return <Message>Laddar data...</Message>;
  if (searchQuery) return <SearchResults {...props} />;
  if (activeMenuIndex === 0) return <PupilsContent {...props} />;
  if (activeMenuIndex === 1) return <ResourcesContent {...props} />;
  return null;
};

export default StudentAccountContent;
