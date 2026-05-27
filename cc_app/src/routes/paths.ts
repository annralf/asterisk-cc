import { paramCase } from 'src/utils/change-case';
import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[ 1 ];
const MOCK_TITLE = _postTitles[ 2 ];

const ROOTS = {
  AUTH: '/auth',
  AGENT: '/agent',
  USER: '/user',
  SERVICE: '/service',
  MONITORING: '/monitoring',
  CLIENTS: '/clients',
  SETUP: '/setup',
  EXTENSIONS: '/extensions',
  CAMPAIGN: '/queue',
  CATEGORIES: '/categories',
  CONTEXT_SETUP: '/context',
  INIT:'/init',
  CONSOLE:'/console'
};

// ----------------------------------------------------------------------

export const paths = {
  product: {
    root: '/product',
    checkout: '/product/checkout',
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: '/post',
    details: (title: string) => `/post/${paramCase(title)}`,
    demo: { details: `/post/${paramCase(MOCK_TITLE)}` },
  },
  extensions: {
    main: ROOTS.EXTENSIONS,
    new: `${ROOTS.EXTENSIONS}/new`,
    edit: (id: string) => `${ROOTS.EXTENSIONS}/edit/${id}`,
    details: (id: string) => `${ROOTS.EXTENSIONS}/details/${id}`,
  },
  categories: {
    main: ROOTS.CATEGORIES,
    new: `${ROOTS.CATEGORIES}/new`,
    edit: (id: string) => `${ROOTS.CATEGORIES}/edit/${id}`,
    details: (id: string) => `${ROOTS.CATEGORIES}/${id}`,
  },
  context_setup: {
    main: ROOTS.CONTEXT_SETUP,
    new: `${ROOTS.CONTEXT_SETUP}/new`,
    edit: (id: string) => `${ROOTS.CONTEXT_SETUP}/edit/${id}`,
    details: (id: string) => `${ROOTS.CONTEXT_SETUP}/${id}`,
  },
  init: {
    main: ROOTS.INIT,
    test: `${ROOTS.INIT}/testing`,
  },
  console: {
    main: ROOTS.CONSOLE,
    list: `${ROOTS.CONSOLE}/list`,
  },
  service: {
    main: ROOTS.SERVICE,
    new: `${ROOTS.SERVICE}/new`,
    edit: (id: string) => `${ROOTS.SERVICE}/edit/${id}`,
    details: (id: string) => `${ROOTS.SERVICE}/details/${id}`,
  },
  monitoring: {
    main: ROOTS.MONITORING,
    new: `${ROOTS.MONITORING}/new`,
    observations: `${ROOTS.MONITORING}/observations`,
    edit: (id: string) => `${ROOTS.MONITORING}/edit/${id}`,
    details: (id: string) => `${ROOTS.MONITORING}/details/${id}`,
  },
  agent: {
    main: `${ROOTS.CONSOLE}`,
    new: `${ROOTS.AGENT}/new`,
    edit: (id: string) => `${ROOTS.AGENT}/edit/${id}`,
    details: (id: string) => `${ROOTS.AGENT}/details/${id}`

  },
  admin: {
    main: `${ROOTS.SETUP}`,
    new: `${ROOTS.AGENT}/new`,
    edit: (id: string) => `${ROOTS.AGENT}/edit/${id}`,
    details: (id: string) => `${ROOTS.AGENT}/details/${id}`

  },
  monitor: {
    main: `${ROOTS.MONITORING}`,
    new: `${ROOTS.AGENT}/new`,
    edit: (id: string) => `${ROOTS.AGENT}/edit/${id}`,
    details: (id: string) => `${ROOTS.AGENT}/details/${id}`

  },
  clients: {
    main: `${ROOTS.CLIENTS}`,
    new: `${ROOTS.CLIENTS}/new`,
    edit: (id: string) => `${ROOTS.CLIENTS}/edit/${id}`,
    details: (id: string) => `${ROOTS.CLIENTS}/details/${id}`

  },
  campaign: {
    main: `${ROOTS.CAMPAIGN}`,
    new: `${ROOTS.CAMPAIGN}/new`,
    edit: (id: string) => `${ROOTS.CAMPAIGN}/edit/${id}`,
    details: (id: string) => `${ROOTS.CAMPAIGN}/${id}`
  },
  setup: {
    main: `${ROOTS.SETUP}`,
    monitor: `${ROOTS.SETUP}/monitor`,
    server: `${ROOTS.SETUP}/server`,
    extension: {
      main: `${ROOTS.SETUP}/extension`,
      new: `${ROOTS.SETUP}/extension/new`,
      edit: (id: string) => `${ROOTS.SETUP}/extension/edit/${id}`,
      details: (id: string) => `${ROOTS.SETUP}/extension/details/${id}`
    }
  },
  user: {
    main: `${ROOTS.USER}/`,
    new: `${ROOTS.USER}/new`,
    edit: (id: string) => `${ROOTS.USER}/edit/${id}`,
    details: (id: string) => `${ROOTS.USER}/details/${id}`
  },
  /*  client:'/clients', */
  support: '/support',
  users: `${ROOTS.USER}/users`,
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  }
};
