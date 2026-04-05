export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    unlinkedOfficers: '/auth/unlinked-officers',
    me: '/auth/me',
  },
  assets: {
    list: '/assets',
    create: '/assets',
    get: (id: string) => `/assets/${id}`,
    update: (id: string) => `/assets/${id}`,
    delete: (id: string) => `/assets/${id}`,
  },
  officers: {
    list: '/officers',
    create: '/officers',
    get: (id: string) => `/officers/${id}`,
    update: (id: string) => `/officers/${id}`,
    delete: (id: string) => `/officers/${id}`,
  },
  branches: {
    list: '/branches',
    create: '/branches',
    get: (id: string) => `/branches/${id}`,
    update: (id: string) => `/branches/${id}`,
    delete: (id: string) => `/branches/${id}`,
    assets: (id: string) => `/branches/${id}/assets`,
  },
  assignments: {
    list: '/assignments',
    issue: '/assignments/issue',
    return: (id: string) => `/assignments/return/${id}`,
    get: (id: string) => `/assignments/${id}`,
  }
};

