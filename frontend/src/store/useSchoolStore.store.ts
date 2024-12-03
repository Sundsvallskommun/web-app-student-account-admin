import { create } from 'zustand';
import { School, Class, Pupil, ResourceData } from '@interfaces/school';
import {
  getSchoolByLoginName,
  getClassesBySchoolId,
  getPupilsBySchoolClassId,
  getResourcesByUnitId,
} from '@services/school.service';

interface SchoolState {
  schools: School[];
  classes: Class[];
  pupils: Pupil[];
  resources: ResourceData[];
  fetchSchools: () => Promise<void>;
  fetchClasses: (schoolId: string) => Promise<void>;
  fetchPupils: (classId: string) => Promise<void>;
  resetClassesAndPupils: () => void;
  fetchResources: (unitId: string) => Promise<void>;
  isLoadingResources: boolean;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  classes: [],
  pupils: [],
  resources: [],
  isLoadingResources: null,

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

  fetchResources: async (unitId: string) => {
    set({ isLoadingResources: true });

    try {
      const response = await getResourcesByUnitId(unitId);
      if (response.data) {
        set({ resources: response.data, isLoadingResources: false });
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      set({ isLoadingResources: false });
    }
  },
}));

export default useSchoolStore;
