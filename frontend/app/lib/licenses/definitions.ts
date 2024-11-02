// dont include paths
export type License = {
  key: string;
  licenses: string;
  repository?: string;
  publisher?: string;
  email?: string;
  url?: string;
  name: string;
  version: string;
  licenseText: string;
  copyright?: string;
};
