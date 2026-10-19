'use client';

import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Button, Divider } from '@sk-web-gui/react';
import React, { useEffect, useMemo, useState } from 'react';

import { FileIcon, Plus } from 'lucide-react';

import { Class, Pupil, ResourceData, School } from '@interfaces/school';
import useSchoolStore from '@store/useSchoolStore.store';
import { generatePupilPdf } from '@utils/generate-pupil-pdf';

import CreateResursModal from '@components/create-resurs-modal/create-resurs-modal.component';
import DataTypeMenuBar from '@components/data-type-menubar/data-type-menubar.component';
import SearchBar from '@components/search-bar/search-bar.component';

import SchoolClassSelects, { PLACEHOLDER_ID } from './school-class-selects.component';
import StudentAccountContent from './student-account-content.component';
import { useAccountSearch } from './use-account-search.hook';

const isRealSchoolId = (schoolId: string) => Boolean(schoolId) && schoolId !== PLACEHOLDER_ID;

/** Heading for the PDF when a whole class is exported; null when the table holds search results. */
const getExportTitle = (hasSearchResults: boolean, school?: School, schoolClass?: Class) =>
  !hasSearchResults && school && schoolClass ? `${school.name} klass ${schoolClass.name}` : null;

export const StudentAccountAdmin: React.FC = () => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoadingPupils, setIsLoadingPupils] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [searchFieldTouched, setSearchFieldTouched] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCreateResursModalOpen, setCreateResursModalOpen] = useState<boolean>(false);

  const resetClassesAndPupils = useSchoolStore((s) => s.resetClassesAndPupils);
  const resetResources = useSchoolStore((s) => s.resetResources);
  const schools = useSchoolStore((state) => state.schools) as School[];
  const classes = useSchoolStore((state) => state.classes) as Class[];
  const pupils = useSchoolStore((state) => state.pupils) as Pupil[];
  const resources = useSchoolStore((state) => state.resources) as ResourceData[];
  const isLoadingResources = useSchoolStore((state) => state.isLoadingResources);

  const { searchQuery, pupilSearchResults, resourceSearchResults, isSearching, search, resetSearch } =
    useAccountSearch(activeMenuIndex);

  const selectedSchoolName = useMemo(
    () => schools.find((school) => school.schoolId === selectedSchoolId)?.name ?? '',
    [schools, selectedSchoolId]
  );

  useEffect(() => {
    setIsLoadingSchools(true);
    useSchoolStore
      .getState()
      .fetchSchools()
      .then(() => setIsLoadingSchools(false))
      .catch(() => setIsLoadingSchools(false));
  }, []);

  useEffect(() => {
    if (!isRealSchoolId(selectedSchoolId)) return;

    // Reset classes and pupils when a new school is selected
    useSchoolStore.getState().resetClassesAndPupils();
    resetSearch();
    setSelectedClassId('');

    setIsLoadingClasses(true);
    useSchoolStore
      .getState()
      .fetchClasses(selectedSchoolId)
      .then(() => setIsLoadingClasses(false))
      .catch(() => setIsLoadingClasses(false));

    useSchoolStore
      .getState()
      .fetchResources(selectedSchoolId)
      .catch((error) => console.error('Error fetching resources:', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSchoolId]);

  useEffect(() => {
    if (!selectedClassId) return;

    resetSearch();
    setIsLoadingPupils(true);
    useSchoolStore
      .getState()
      .fetchPupils(selectedClassId)
      .then(() => setIsLoadingPupils(false))
      .catch(() => setIsLoadingPupils(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClassId]);

  const transformedPupils = useMemo(
    () =>
      pupils.map((pupil) => ({
        ...pupil,
        displayname: pupil.displayname || 'Unknown',
        personNumber: pupil.personNumber,
        loginname: pupil.loginname,
        name: pupil.name, // The school name
        className: pupil.className,
        isEnabled: pupil.isEnabled,
      })),
    [pupils]
  );

  const generatePDFTable = () => {
    setIsGeneratingPDF(true);
    // Give the table a render pass in print mode before jsPDF reads it from the DOM
    setTimeout(() => {
      const selectedSchool = schools.find((school) => school.schoolId === selectedSchoolId);
      const selectedClass = classes.find((c) => c.groupId === selectedClassId);
      generatePupilPdf(getExportTitle(pupilSearchResults.length > 0, selectedSchool, selectedClass));
      setIsGeneratingPDF(false);
    }, 250);
  };

  const onSearchChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetClassesAndPupils();
    resetResources();
    setSelectedSchoolId('');
    setSelectedClassId('');
    search(e.target.value);
    setSearchFieldTouched(true);
  };

  const onMenuChangeHandler = (newIndex: number) => {
    setActiveMenuIndex(newIndex);
    setSearchFieldTouched(false);
  };

  const isPupilsTab = activeMenuIndex === 0;

  return (
    <DefaultLayout>
      <div className="flex items-center justify-between my-24">
        <DataTypeMenuBar
          activeMenuIndex={activeMenuIndex}
          onMenuChange={onMenuChangeHandler}
          pupils={pupils}
          resources={resources}
          pupilSearchResults={pupilSearchResults}
          resourceSearchResults={resourceSearchResults}
        />
        {isPupilsTab ? (
          <Button
            variant="secondary"
            type="button"
            size="lg"
            aria-label="Generera PDF"
            disabled={isGeneratingPDF}
            loading={isGeneratingPDF}
            onClick={() => generatePDFTable()}
          >
            <FileIcon />
            Visa som PDF
          </Button>
        ) : (
          <Button
            onClick={() => setCreateResursModalOpen(true)}
            aria-label="Generera ny resurs"
            color="vattjom"
            type="button"
            size="lg"
          >
            <Plus /> Ny resurs
          </Button>
        )}
      </div>

      <Divider className="mb-24" strong={false} />

      <div className="flex justify-between items-end mb-24" id="non-printable-section">
        <SchoolClassSelects
          schools={schools}
          classes={classes}
          selectedSchoolId={selectedSchoolId}
          selectedClassId={selectedClassId}
          isLoadingSchools={isLoadingSchools}
          isLoadingClasses={isLoadingClasses}
          showClassSelect={isPupilsTab}
          onSchoolChange={setSelectedSchoolId}
          onClassChange={setSelectedClassId}
          onOpen={resetSearch}
        />
        <SearchBar
          activeMenuIndex={activeMenuIndex}
          searchQuery={searchQuery}
          onSearchChangeHandler={onSearchChangeHandler}
        />
      </div>

      <div aria-live="polite">
        <StudentAccountContent
          activeMenuIndex={activeMenuIndex}
          isLoading={isSearching || isLoadingPupils}
          searchQuery={searchQuery}
          searchFieldTouched={searchFieldTouched}
          pupilSearchResults={pupilSearchResults}
          resourceSearchResults={resourceSearchResults}
          pupils={transformedPupils}
          resources={resources}
          isLoadingResources={isLoadingResources}
          isPrintMode={isGeneratingPDF}
          selectedSchoolId={selectedSchoolId}
          selectedClassId={selectedClassId}
          selectedSchoolName={selectedSchoolName}
        />
      </div>

      {isCreateResursModalOpen && (
        <CreateResursModal
          aria-labelledby="Redigera resurs"
          onClose={() => setCreateResursModalOpen(false)}
          onSave={() => setCreateResursModalOpen(false)}
          show={isCreateResursModalOpen}
          aria-modal="true"
          selectedSchoolId={selectedSchoolId}
          setSelectedSchoolId={setSelectedSchoolId}
          schools={schools}
        />
      )}
    </DefaultLayout>
  );
};

export default StudentAccountAdmin;
