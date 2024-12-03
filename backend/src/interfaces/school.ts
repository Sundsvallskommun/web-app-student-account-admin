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

export interface Resource {
  createdBy: string;
  loginname: string;
  name: string;
  schoolName: string;
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  additionalProp1?: string;
  additionalProp2?: string;
  additionalProp3?: string;
}
