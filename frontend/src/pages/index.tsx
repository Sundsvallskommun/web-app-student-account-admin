import { Table } from '@components/table/table.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Button, Divider, FormLabel, Select } from '@sk-web-gui/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { FileIcon, Plus } from 'lucide-react';

import { Class, Pupil, ResourceData, School } from '@interfaces/school';
import { searchPupils, searchResources } from '@services/school.service';
import useSchoolStore from 'src/store/useSchoolStore.store';

import debounce from 'lodash/debounce';

import CreateResursModal from '@components/create-resurs-modal/create-resurs-modal.component';
import DataTypeMenuBar from '@components/data-type-menubar/data-type-menubar.component';
import SearchBar from '@components/search-bar/search-bar.component';
import { setTimeout } from 'timers';

function fitImage(targetWidth, targetHeight, imageWidth, imageHeight) {
  // Calculate aspect ratios
  const targetRatio = targetWidth / targetHeight;
  const imageRatio = imageWidth / imageHeight;

  // Initialize the dimensions of the scaled image
  let scaledWidth, scaledHeight;

  if (imageRatio > targetRatio) {
    // Image is wider than target area
    scaledWidth = targetWidth;
    scaledHeight = targetWidth / imageRatio;
  } else {
    // Image is taller than target area
    scaledHeight = targetHeight;
    scaledWidth = targetHeight * imageRatio;
  }

  return {
    width: scaledWidth,
    height: scaledHeight,
  };
}

export const Elevkontohantering: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pupilSearchResults, setPupilSearchResults] = useState<Pupil[]>([]);
  const [resourceSearchResults, setResourceSearchResults] = useState<ResourceData[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>(0);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [searchFieldTouched, setSearchFieldTouched] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>('');
  const [isCreateResursModalOpen, setCreateResursModalOpen] = useState<boolean>(false);

  const resetClassesAndPupils = useSchoolStore((s) => s.resetClassesAndPupils);
  const resetResources = useSchoolStore((s) => s.resetResources);

  const resetSearch = () => {
    setSearchQuery('');
    setPupilSearchResults([]);
    setResourceSearchResults([]);
  };

  const debouncedSearchFunction = async (query: string) => {
    if (query.length > 2) {
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
        setIsLoading(false);
      }
    }
  };
  const debouncedSearch = useMemo(() => debounce(debouncedSearchFunction, 500), []);

  const activeMenuIndexRef = useRef(activeMenuIndex);

  useEffect(() => {
    activeMenuIndexRef.current = activeMenuIndex;
  }, [activeMenuIndex]);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    setIsLoadingSchools(true);
    useSchoolStore
      .getState()
      .fetchSchools()
      .then(() => setIsLoadingSchools(false))
      .catch(() => setIsLoadingSchools(false));
  }, []);

  useEffect(() => {
    if (selectedSchoolId && selectedSchoolId !== '00000000-0000-0000-0000-000000000000') {
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
        .then(() => {
          const selectedSchool = schools.find((school) => school.unitId === selectedSchoolId);
          setSelectedSchoolName(selectedSchool ? selectedSchool.name : '');
        })
        .catch((error) => console.error('Error fetching resources:', error));
    }
  }, [selectedSchoolId]);

  useEffect(() => {
    if (selectedClassId) {
      resetSearch();
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
  const resources = useSchoolStore((state) => state.resources) as ResourceData[];

  const transformedPupils = useMemo(
    () =>
      pupils?.map((pupil) => ({
        ...pupil,
        displayname: pupil.displayname || 'Unknown',
        personNumber: pupil.personNumber,
        loginname: pupil.loginname,
        name: pupil.name, // The school name
        className: pupil.className,
        isEnabled: pupil.isEnabled,
      })) || [],
    [pupils]
  );

  const generatePDFTable = () => {
    setIsGeneratingPDF(true);
    setTimeout(() => {
      const doc = new jsPDF();

      const SKLogob64 = `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`;
      const logoAspectRatio = 2.5181818182;
      const logoSize = 15;
      const padding = 7;
      const fontSize = 19;
      const selectedSchool = schools.find((school) => school.unitId === selectedSchoolId);
      const selectedClass = classes.find((c) => c.unitId === selectedClassId);
      const isExportingClass = !pupilSearchResults.length && selectedSchool && selectedClass;
      const cellPadding = 10;

      doc.addImage(SKLogob64, 'JPEG', 15, 15, logoSize * logoAspectRatio, logoSize);

      if (isExportingClass) {
        doc.setFontSize(fontSize);
        doc.text(`${selectedSchool.name} klass ${selectedClass.name}`, 15, logoSize + fontSize + padding);
      }

      autoTable(doc, {
        startY: logoSize + padding * 2 + (isExportingClass ? fontSize : padding),
        html: '#table-to-export .sk-table',
        tableWidth: 'auto',
        theme: 'plain',
        tableLineColor: [0, 0, 0],
        tableLineWidth: 1,
        styles: {
          cellPadding: cellPadding,
          fontSize: 12,
          lineColor: [0, 0, 0],
          lineWidth: 1,
        },

        didDrawCell: function (data) {
          if (data.cell.section === 'body') {
            const td = data.cell.raw as HTMLTableCellElement;
            const images = td.getElementsByTagName('img');
            if (images.length) {
              const img = images[0];

              const { x, y } = data.cell;
              const { height, width } = data.cell;

              // Set fallback size to 1 to avoid division by zero
              const imgSize = fitImage(width, height, img.naturalWidth || 1, img.naturalHeight || 1);

              let paddingY = 0;
              let paddingX = 0;

              if (data.cell.height > imgSize.height) {
                paddingY = (data.cell.height - imgSize.height) / 2;
              }
              if (data.cell.width > imgSize.width) {
                paddingX = (data.cell.width - imgSize.width) / 2;
              }
              console.log('img', img);
              console.log('imgSize', imgSize);
              console.log('x', x);
              console.log('y', y);
              console.log('paddingX', paddingX);
              console.log('paddingY', paddingY);
              if (img) {
                doc.addImage({
                  imageData: img.src,
                  x: x + paddingX,
                  y: y + paddingY,
                  width: imgSize.width,
                  height: imgSize.height,
                  format: 'JPEG',
                });
              }
            }
          }
        },
      });
      const filename = isExportingClass ? `${selectedSchool.name} klass ${selectedClass.name}` : 'table_export.pdf';
      doc.save(filename);
      setIsGeneratingPDF(false);
    }, 250);
  };

  const onSearchChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    resetClassesAndPupils();
    resetResources();
    setSelectedSchoolName('');
    setSelectedSchoolId('');
    setSelectedClassId('');
    setSearchQuery(e.target.value);
    if (e.target.value.length > 2) {
      setIsLoading(true);
      debouncedSearch(e.target.value);
    } else {
      setIsLoading(false);
      setPupilSearchResults([]);
      setResourceSearchResults([]);
    }
    setSearchFieldTouched(true);
  }, []);

  const onMenuChangeHandler = (newIndex: number) => {
    setActiveMenuIndex(newIndex);
    setSearchFieldTouched(false);
  };

  return (
    <DefaultLayout title={`Elevkontohantering`}>
      <div className="flex items-center justify-between my-24">
        <DataTypeMenuBar
          activeMenuIndex={activeMenuIndex}
          onMenuChange={onMenuChangeHandler}
          pupils={pupils}
          resources={resources}
          pupilSearchResults={pupilSearchResults}
          resourceSearchResults={resourceSearchResults}
        />
        {activeMenuIndex === 0 && (
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
        )}
        {activeMenuIndex === 1 ? (
          <Button
            onClick={() => setCreateResursModalOpen(true)}
            aria-label="Generera ny resurs"
            color="vattjom"
            type="button"
            size="lg"
          >
            <Plus /> Ny resurs
          </Button>
        ) : null}
      </div>

      <Divider className="mb-24" strong={false} />

      <div className="flex justify-between items-end mb-24" id="non-printable-section">
        <div className="flex gap-24">
          <FormLabel htmlFor="school" className="flex items-start flex-col">
            Skola
            <Select
              id="school"
              aria-label="Välj skola"
              className="cursor-pointer w-[33rem] mt-8  bg-custom-gray"
              value={selectedSchoolId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSchoolId(e.target.value)}
              onClick={() => resetSearch()}
            >
              <Select.Option disabled value="">
                - Välj skola -
              </Select.Option>
              {schools
                .filter((school) => school.unitId !== '00000000-0000-0000-0000-000000000000') // Filter out the placeholder from the API
                .map((school) => (
                  <Select.Option key={school.unitId} value={school.unitId}>
                    {school.name}
                  </Select.Option>
                ))}
            </Select>
          </FormLabel>
          {activeMenuIndex === 0 && (
            <FormLabel htmlFor="class" className="flex items-start flex-col">
              Klass
              <Select
                id="class"
                aria-label="Välj klass"
                className={`w-[33rem] mt-8 ${
                  !selectedSchoolId || isLoadingSchools ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                value={selectedSchoolId ? selectedClassId || '' : ''}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedClassId(e.target.value)}
                onClick={() => resetSearch()}
                disabled={!selectedSchoolId || isLoadingSchools}
              >
                {selectedSchoolId ? (
                  <>
                    <Select.Option disabled value="">
                      - Välj klass -
                    </Select.Option>
                    {classes
                      ?.filter((classItem) => classItem.unitId !== '00000000-0000-0000-0000-000000000000')
                      .map((classItem) => (
                        <Select.Option key={classItem.unitId} value={classItem.unitId}>
                          {classItem.name}
                        </Select.Option>
                      ))}
                  </>
                ) : (
                  // This empty option will be the only content when no school is selected and the select is disabled
                  <Select.Option value=""> </Select.Option>
                )}
              </Select>
            </FormLabel>
          )}
        </div>
        <SearchBar
          activeMenuIndex={activeMenuIndex}
          searchQuery={searchQuery}
          onSearchChangeHandler={onSearchChangeHandler}
        />
      </div>

      <div aria-live="polite">
        {isLoading ? (
          <div className="font-bold">Laddar data...</div>
        ) : searchQuery ? (
          (activeMenuIndex === 0 && pupilSearchResults.length > 0) ||
          (activeMenuIndex === 1 && resourceSearchResults.length > 0) ? (
            <>
              <Table
                data={activeMenuIndex === 0 ? pupilSearchResults : resourceSearchResults}
                activeMenuIndex={activeMenuIndex}
                isPrintMode={isGeneratingPDF}
                selectedSchoolName={selectedSchoolName}
              />
            </>
          ) : (
            <div className="font-bold">
              {searchQuery.length < 3 && searchFieldTouched
                ? `Minsta sökord är på 3 bokstäver. Vill du se vald klass, töm sökfältet.`
                : 'Ingen data hittades...'}
            </div>
          )
        ) : activeMenuIndex === 0 && !selectedSchoolId ? (
          <div className="font-bold">Välj först en skola och sedan en klass.</div>
        ) : activeMenuIndex === 0 && selectedSchoolId && !selectedClassId ? (
          <div className="font-bold">Välj en klass.</div>
        ) : activeMenuIndex === 0 ? (
          transformedPupils.length > 0 ? (
            <>
              <Table
                data={transformedPupils}
                activeMenuIndex={activeMenuIndex}
                isPrintMode={isGeneratingPDF}
                selectedSchoolName={selectedSchoolName}
                selectedClassId={selectedClassId}
              />
            </>
          ) : (
            <div className="font-bold">
              {searchFieldTouched
                ? `Minsta sökord är på 3 bokstäver. Vill du se vald klass, töm sökfältet.`
                : 'Ingen elevdata tillgänglig.'}
            </div>
          )
        ) : activeMenuIndex === 1 ? (
          selectedSchoolId ? (
            resources.length > 0 ? (
              <Table
                data={resources}
                activeMenuIndex={activeMenuIndex}
                selectedSchoolName={selectedSchoolName}
                selectedSchoolId={selectedSchoolId}
              />
            ) : (
              <div className="font-bold">{resources.length === 0 ? 'Ingen resursdata tillgänglig.' : ''}</div>
            )
          ) : (
            <div className="font-bold">Välj en skola.</div>
          )
        ) : null}
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

export default Elevkontohantering;
