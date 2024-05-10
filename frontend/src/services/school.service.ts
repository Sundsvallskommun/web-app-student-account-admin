import { ApiResponse, apiService } from './api-service';
import { School, Class, Pupil } from '@interfaces/school';

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
  newPassword: string;
}): Promise<{ data?: string; message: string; error?: Error }> => {
  try {
    const response = await apiService.patch<ApiResponse<string>>(`/pupil/pupilLoginName`, pupilData);
    // const response = await apiService.patch<ApiResponse<string>>(`/pupil/${pupilData.pupilLoginName}`, pupilData);
    // const response = await apiService.patch<ApiResponse<string>>(`/pupil/${pupilData.loginname}`, pupilData);
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
