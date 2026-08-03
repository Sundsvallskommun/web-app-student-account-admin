/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface PAMGroup {
  /** @format uuid */
  groupId?: string;
  name?: string | null;
  /** @format int32 */
  sortCol?: number;
}

export interface PAMPatchPupil {
  isEnabled?: boolean | null;
  displayname?: string | null;
  password?: string | null;
}

export interface PAMSchool {
  /** @format uuid */
  schoolId?: string;
  name?: string | null;
  /** @format int32 */
  sortCol?: number;
}

export interface PAMSchoolClassPupil {
  /** @format uuid */
  personId?: string;
  personNumber?: string | null;
  /** @format uuid */
  userId?: string;
  givenname?: string | null;
  lastname?: string | null;
  loginname?: string | null;
  password?: string | null;
  displayname?: string | null;
  isEnabled?: boolean;
  /** @format int32 */
  domainId?: number;
  primaryEMailAddress?: string | null;
  name?: string | null;
  yearGroup?: string | null;
  typeOfSchool?: string | null;
  programme?: string | null;
  yearCode?: string | null;
  className?: string | null;
  isWriteable?: boolean;
}

export interface PAMSchoolResource {
  name?: string | null;
  loginname?: string | null;
  schoolName?: string | null;
  createdBy?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}
