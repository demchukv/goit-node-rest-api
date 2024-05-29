import {defaults} from 'jest-config';

const config = {
  verbose: true,
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
};

export default config;
