export const APIS = [
  {
    name: 'education',
    version: '2.0',
  },
  {
    name: 'employee',
    version: '2.0',
  },
  {
    name: 'simulatorserver',
    version: '2.0',
  },
  {
    name: 'pupilAccountManager',
    version: '1.0',
  },
] as const;

type ApiName = (typeof APIS)[number]['name'];

export const getApiBase = (name: ApiName) => {
  const api = APIS.find(api => api.name === name);
  return `${api?.name}/${api?.version}`;
};
