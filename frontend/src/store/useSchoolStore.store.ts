import { create } from 'zustand';
import { School, Class, Pupil } from '@interfaces/school';
import { getSchoolByLoginName, getClassesBySchoolId, getPupilsBySchoolClassId } from '@services/school.service';

interface SchoolState {
  schools: School[];
  classes: Class[];
  pupils: Pupil[];
  fetchSchools: () => Promise<void>;
  fetchClasses: (schoolId: string) => Promise<void>;
  fetchPupils: (classId: string) => Promise<void>;
  resetClassesAndPupils: () => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  classes: [],
  pupils: [],

  fetchSchools: async () => {
    try {
      const response = await getSchoolByLoginName();
      if (response.data) {
        set({ schools: response.data });
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  },

  fetchClasses: async (schoolId: string) => {
    try {
      const response = await getClassesBySchoolId(schoolId);
      if (response.data) {
        set({ classes: response.data });
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  },

  fetchPupils: async (classId: string) => {
    try {
      const response = await getPupilsBySchoolClassId(classId);
      if (response.data) {
        set({ pupils: response.data });
      }
    } catch (error) {
      console.error('Error fetching pupils:', error);
    }
  },

  resetClassesAndPupils: () => set({ classes: [], pupils: [] }),
}));

export default useSchoolStore;
