export interface School {
  unitId: string;
  name: string;
  sortCol: number;
}

export interface Class {
  unitId: string;
  name: string;
  sortCol: number;
}

export interface Pupil {
  personId: string;
  personNumber: string;
  userId: string;
  givenname: string;
  lastname: string;
  loginname: string;
  password: string;
  displayname: string;
  isEnabled: boolean;
  domainId: number;
  primaryEMailAddress: string;
  name: string;
  yearGroup: string;
  typeOfSchool: string;
  programme: string;
  yearCode: string;
  className: string;
  isWriteable: boolean;
}
