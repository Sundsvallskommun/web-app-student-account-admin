import DefaultLayout from '@layouts/default-layout/default-layout.component';
// import { useUserStore } from '@services/user-service/user-service';
import {
  Button,
  ConfirmationDialogContextProvider,
  Divider,
  FormLabel,
  MenuBar,
  Select,
  TextField,
} from '@sk-web-gui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { shallow } from 'zustand/shallow';

import { Table } from '@components/table/table.component';

import { FileIcon } from 'lucide-react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import useSchoolStore from 'src/store/useSchoolStore.store';
// import { searchPupils } from '@services/school.service';
import { Class, Pupil, School, ResursData } from '@interfaces/school';

export const Exempelsida: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  // const [searchResults, setSearchResults] = useState<Pupil[]>([]);

  // const debouncedSearchFunction = async (query) => {
  //   if (query.length > 2) {
  //     try {
  //       const response = await searchPupils({ searchString: query });
  //       setSearchResults(response.data || []);
  //     } catch (error) {
  //       console.error('Search error:', error);
  //       // Optionally update the state to indicate an error occurred
  //     }
  //   }
  // };

  // const debouncedSearch = useMemo(() => debounce(debouncedSearchFunction, 500), []);

  // useEffect(() => {
  //   debouncedSearch(searchQuery);
  //   return () => {
  //     debouncedSearch.cancel();
  //   };
  // }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    setIsLoadingSchools(true);
    useSchoolStore
      .getState()
      .fetchSchools()
      .then(() => setIsLoadingSchools(false))
      .catch(() => setIsLoadingSchools(false));
  }, []);

  useEffect(() => {
    if (selectedSchoolId) {
      // Reset classes and pupils when a new school is selected
      useSchoolStore.getState().resetClassesAndPupils();

      setIsLoadingClasses(true);
      useSchoolStore
        .getState()
        .fetchClasses(selectedSchoolId)
        .then(() => setIsLoadingClasses(false))
        .catch(() => setIsLoadingClasses(false));
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedClassId) {
      setIsLoading(true);
      useSchoolStore
        .getState()
        .fetchPupils(selectedClassId)
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [selectedClassId]);

  const schools = useSchoolStore((state) => state.schools) as School[];
  const classes = useSchoolStore((state) => state.classes) as Class[];
  const pupils = useSchoolStore((state) => state.pupils) as Pupil[];

  const transformedPupils = useMemo(
    () =>
      pupils?.map((pupil) => ({
        ...pupil,
        displayname: pupil.displayname || 'Unknown', // Provide a fallback
        personNumber: pupil.personNumber,
        loginname: pupil.loginname,
        name: pupil.name, // The school name
        className: pupil.className,
        isEnabled: pupil.isEnabled,
      })) || [],
    [pupils]
  );

  const studentSearchableFields = ['displayname', 'personNumber', 'loginname', 'name', 'className', 'isEnabled'];

  const resursSearchableFields = [
    'name',
    'personalNumber',
    'user',
    'status',
    'itResourceStatus',
    'resource1Status',
    'resource2Status',
    'generalStatus',
  ];

  const resursData = []; // This will be replaced by actual API data later

  let data: Pupil[] | ResursData[];
  let searchableFields: string[];

  if (activeMenuIndex === 0) {
    data = transformedPupils;
    searchableFields = studentSearchableFields;
  } else {
    data = resursData;
    searchableFields = resursSearchableFields;
  }

  const filteredUsers = useMemo(() => {
    if (activeMenuIndex === 0) {
      // Handle the case when user is a Pupil
      return transformedPupils.filter((pupil) => {
        return studentSearchableFields.some((field) => {
          const value = pupil[field as keyof Pupil];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    } else {
      // Handle the case when user is a ResursData
      return resursData.filter((resurs) => {
        return resursSearchableFields.some((field) => {
          const value = resurs[field as keyof ResursData];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        });
      });
    }
  }, [activeMenuIndex, transformedPupils, resursData, searchQuery]);

  const onSearchChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    // TODO Kommer jag behöva använda GET /pupil/search api anropet? Tor inte det..

    // if (e.target.value.length > 2) {
    //   // Adding a condition to avoid too many requests
    //   try {
    //     const response = await searchPupils({ searchString: e.target.value });
    //     if (response.data) {
    //       setSearchResults(response.data);
    //     }
    //   } catch (error) {
    //     console.error('Search error:', error);
    //   }
    // }
  }, []);

  const generatePDF = useCallback(async () => {
    try {
      const element = document.getElementById('table-to-export');
      if (!element) {
        console.error('Element to export not found!');
        return;
      }
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('table.pdf');
    } catch (error) {
      console.error('Error generating PDF', error);
    }
  }, []);

  return (
    <ConfirmationDialogContextProvider>
      <DefaultLayout title={`Elevkontohantering`}>
        <MenuBar color="vattjom" showBackground={false} className="flex items-center my-24">
          <MenuBar.Item current={activeMenuIndex === 0} menuIndex={0}>
            <button
              className="w-[11rem]"
              onClick={() => {
                setActiveMenuIndex(0);
                setSearchQuery('');
              }}
            >
              Elever ({pupils?.length})
            </button>
          </MenuBar.Item>
          <MenuBar.Item current={activeMenuIndex === 1} menuIndex={1}>
            <button
              className="w-[13.1rem]"
              onClick={() => {
                setActiveMenuIndex(1);
                setSearchQuery('');
              }}
            >
              Resurser ({resursData.length})
            </button>
          </MenuBar.Item>
          <TextField
            size="md"
            placeholder={activeMenuIndex === 0 ? 'Sök elevkonton...' : 'Sök resurs...'}
            value={searchQuery}
            onChange={onSearchChangeHandler}
            className="w-[386px] h-[40px] ml-auto"
            aria-label="Sökfält för elevkonton"
          ></TextField>
        </MenuBar>

        <Divider className="mb-24" strong={false} />

        {activeMenuIndex === 0 && (
          <div className="flex justify-between items-end mb-24">
            <div className="flex gap-24">
              <FormLabel htmlFor="school" className="flex items-start flex-col">
                Skola
                <Select
                  id="school"
                  aria-label="Välj skola"
                  className="cursor-pointer w-[33rem]"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSchoolId(e.target.value)}
                >
                  {isLoadingSchools ? (
                    <Select.Option>Laddar skolor...</Select.Option>
                  ) : (
                    schools?.map((school) => (
                      <Select.Option key={school.unitId} value={school.unitId}>
                        {school.name}
                      </Select.Option>
                    ))
                  )}
                </Select>
              </FormLabel>
              <FormLabel htmlFor="class" className="flex items-start flex-col">
                Klass
                <Select
                  id="class"
                  aria-label="Välj klass"
                  className={`w-[33rem] ${!selectedSchoolId || isLoadingSchools ? '' : 'cursor-pointer'}`}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClassId(e.target.value)}
                  disabled={!selectedSchoolId || isLoadingSchools}
                >
                  {selectedSchoolId && !isLoadingClasses ? (
                    classes?.map((classItem) => (
                      <Select.Option key={classItem.unitId} value={classItem.unitId}>
                        {classItem.name}
                      </Select.Option>
                    ))
                  ) : (
                    <Select.Option>Välj en klass...</Select.Option>
                  )}
                </Select>
              </FormLabel>
            </div>

            <Button variant="secondary" type="button" rounded onClick={generatePDF} aria-label="Generera PDF">
              <FileIcon />
              Visa som PDF
            </Button>
          </div>
        )}

        <div aria-live="polite" className="font-bold">
          {isLoading ? (
            <div>Laddar data...</div>
          ) : filteredUsers.length > 0 ? (
            <Table data={filteredUsers} activeMenuIndex={activeMenuIndex} />
          ) : searchQuery && filteredUsers.length === 0 ? (
            <div>Ingen data hittades...</div>
          ) : activeMenuIndex === 0 ? (
            <div>Ingen data tillgänglig. Välj först en skola och sedan en klass.</div>
          ) : (
            <div>Ingen data för resurser tillgänglig.</div>
          )}
        </div>
      </DefaultLayout>
    </ConfirmationDialogContextProvider>
  );
};

export default Exempelsida;
