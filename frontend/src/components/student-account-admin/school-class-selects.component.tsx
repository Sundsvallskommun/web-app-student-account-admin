import { Class, School } from '@interfaces/school';
import { FormLabel, Select } from '@sk-web-gui/react';
import React from 'react';

/** The API returns this id as a placeholder row; it is never a real school or class. */
export const PLACEHOLDER_ID = '00000000-0000-0000-0000-000000000000';

interface SchoolClassSelectsProps {
  schools: School[];
  classes: Class[];
  selectedSchoolId: string;
  selectedClassId: string;
  isLoadingSchools: boolean;
  isLoadingClasses: boolean;
  showClassSelect: boolean;
  onSchoolChange: (schoolId: string) => void;
  onClassChange: (classId: string) => void;
  onOpen: () => void;
}

const SchoolClassSelects: React.FC<SchoolClassSelectsProps> = ({
  schools,
  classes,
  selectedSchoolId,
  selectedClassId,
  isLoadingSchools,
  isLoadingClasses,
  showClassSelect,
  onSchoolChange,
  onClassChange,
  onOpen,
}) => {
  const schoolOptions = schools.filter((school) => school.schoolId !== PLACEHOLDER_ID);
  const classOptions = classes.filter((classItem) => classItem.groupId !== PLACEHOLDER_ID);

  return (
    <div className="flex gap-24">
      <FormLabel htmlFor="school" className="flex items-start flex-col">
        Skola
        <Select
          id="school"
          aria-label="Välj skola"
          className="cursor-pointer w-[33rem] mt-8 bg-custom-gray"
          value={selectedSchoolId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSchoolChange(e.target.value)}
          onClick={onOpen}
          readOnly={isLoadingSchools}
          aria-busy={isLoadingSchools}
        >
          <Select.Option disabled value="">
            {isLoadingSchools ? 'Laddar skolor...' : '- Välj skola -'}
          </Select.Option>
          {schoolOptions.map((school) => (
            <Select.Option key={school.schoolId} value={school.schoolId}>
              {school.name}
            </Select.Option>
          ))}
        </Select>
      </FormLabel>
      {showClassSelect && (
        <FormLabel htmlFor="class" className="flex items-start flex-col">
          Klass
          <Select
            id="class"
            aria-label="Välj klass"
            className={`w-[33rem] mt-8 ${selectedSchoolId ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            value={selectedSchoolId ? selectedClassId : ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onClassChange(e.target.value)}
            onClick={onOpen}
            disabled={!selectedSchoolId}
            readOnly={isLoadingSchools || isLoadingClasses}
            aria-busy={isLoadingClasses}
          >
            {selectedSchoolId ? (
              <>
                <Select.Option disabled value="">
                  {isLoadingClasses ? 'Laddar klasser...' : '- Välj klass -'}
                </Select.Option>
                {classOptions.map((classItem) => (
                  <Select.Option key={classItem.groupId} value={classItem.groupId}>
                    {classItem.name}
                  </Select.Option>
                ))}
              </>
            ) : (
              <Select.Option value=""> </Select.Option>
            )}
          </Select>
        </FormLabel>
      )}
    </div>
  );
};

export default SchoolClassSelects;
