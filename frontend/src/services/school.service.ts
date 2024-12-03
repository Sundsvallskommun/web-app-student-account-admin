import { ApiResponse, apiService } from './api-service';
import { School, Class, Pupil, ResourceData } from '@interfaces/school';

const emptySchool: School = {
  unitId: '',
  name: '',
  sortCol: 0,
};

const emptyClass: Class = {
  unitId: '',
  name: '',
  sortCol: 0,
};

const emptyPupil: Pupil = {
  personId: '',
  personNumber: '',
  userId: '',
  givenname: '',
  lastname: '',
  loginname: '',
  password: '',
  displayname: '',
  isEnabled: true,
  domainId: 0,
  primaryEMailAddress: '',
  name: '',
  yearGroup: '',
  typeOfSchool: '',
  programme: '',
  yearCode: '',
  className: '',
  isWriteable: true,
};

const emptyResource: ResourceData = {
  createdBy: '',
  loginname: '',
  name: '',
  schoolName: '',
  type: '',
  title: '',
  status: 0,
  detail: '',
  instance: '',
  additionalProp1: '',
  additionalProp2: '',
  additionalProp3: '',
};

export const getSchoolByLoginName = async (): Promise<{ data: School[]; error?: Error; status?: number }> => {
  try {
    const response = await apiService.get<ApiResponse<School[]>>(`/schools`);
    return { data: response.data.data, status: 200 };
  } catch (e) {
    return {
      data: [emptySchool],
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
      status: e.response?.status,
    };
  }
};

export const getClassesBySchoolId = async (
  schoolId: string
): Promise<{ data: Class[]; error?: Error; status?: number }> => {
  try {
    const response = await apiService.get<ApiResponse<Class[]>>(`/school/${schoolId}/classes`);
    return { data: response.data.data, status: 200 };
  } catch (e) {
    return {
      data: [emptyClass],
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
      status: e.response?.status,
    };
  }
};

export const getPupilsBySchoolClassId = async (
  schoolClassId: string
): Promise<{ data: Pupil[]; error?: Error; status?: number }> => {
  try {
    const response = await apiService.get<ApiResponse<Pupil[]>>(`/schoolclass/${schoolClassId}/pupils`);
    return { data: response.data.data, status: 200 };
  } catch (e) {
    return {
      data: [emptyPupil],
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
      status: e.response?.status,
    };
  }
};

export const searchPupils = async (searchParams: {
  searchString: string;
}): Promise<{ data: Pupil[]; error?: Error; status?: number }> => {
  try {
    const response = await apiService.get<ApiResponse<Pupil[]>>(`/pupil/search`, { params: searchParams });
    return { data: response.data.data, status: 200 };
  } catch (e) {
    return {
      data: [emptyPupil],
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
      status: e.response?.status,
    };
  }
};

export const generatePupilPassword = async (): Promise<{ data?: string; message?: string; error?: Error }> => {
  try {
    const response = await apiService.get<ApiResponse<string>>(`/pupil/password`);
    return { data: response.data.data, message: 'Password generated successfully' };
  } catch (e) {
    return {
      message: e.message || 'Password generation failed',
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
    };
  }
};

export const updatePupil = async (pupilData: {
  pupilLoginName: string;
  isEnabled: boolean;
  displayname: string;
  password: string;
}): Promise<{ data?: string; message: string; error?: Error }> => {
  try {
    const pupildataBody = {
      isEnabled: pupilData.isEnabled,
      displayname: pupilData.displayname,
      password: pupilData.password,
    };
    const response = await apiService.patch<ApiResponse<string>>(`/pupil/${pupilData.pupilLoginName}`, pupildataBody);
    return { data: response.data.data, message: 'Pupil updated successfully' };
  } catch (e) {
    return {
      message: e.message || 'Pupil update failed',
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
    };
  }
};

// Resources

export const getResourcesByUnitId = async (
  unitId: string
): Promise<{ data: ResourceData[]; error?: Error; status?: number }> => {
  try {
    const response = await apiService.get<ApiResponse<ResourceData[]>>(`/resources/${unitId}`);
    return { data: response.data.data, status: 200 };
  } catch (e) {
    return {
      data: [emptyResource],
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
      status: e.response?.status,
    };
  }
};

export const addResourceToSchool = async (resourceLoginName: string, unitId: string) => {
  try {
    const response = await apiService.post(`/resource`, {
      resourceLoginName,
      unitId,
    });
    return { data: response.data, message: 'Resource added successfully' };
  } catch (e) {
    return {
      message: e.message || 'Failed to add resource',
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
    };
  }
};

export const deleteResourceFromSchool = async (resourceLoginName: string, unitId: string) => {
  try {
    const queryParams = new URLSearchParams({ resourceLoginName, unitId }).toString();

    const response = await apiService.delete(`/resource?${queryParams}`);

    return { data: response.data, message: 'Resource deleted successfully' };
  } catch (e) {
    return {
      message: e.message || 'Failed to delete resource',
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
    };
  }
};

export const searchResources = async (
  searchTerm: string
): Promise<{ data: ResourceData[]; error?: Error; status?: number }> => {
  try {
    const response = await apiService.get<ApiResponse<ResourceData[]>>(`/resources/search/${searchTerm}`);
    return { data: response.data.data, status: 200 };
  } catch (e) {
    return {
      data: [emptyResource],
      error: e.response?.status
        ? new Error(`Error ${e.response.status}: ${e.response.statusText}`)
        : new Error('An unknown error occurred'),
      status: e.response?.status,
    };
  }
};
