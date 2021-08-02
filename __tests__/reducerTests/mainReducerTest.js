import subject from '../../client/src/Reducers/mainReducer';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
// import testServer from '../../server/server';

describe('Main Reducer - Holds User Details', () => {
  let state;
  beforeEach(() => {
    state = {
      email: '',
      firstName: '',
      arn: '',
      region: '',
      credentials: null,
      credentialsLoading: false,
    };
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await testServer.close();
  });

  describe('Default state', () => {
    it('should return the default state when given an undefined input', () => {
      expect(subject(undefined, { type: undefined })).toEqual(state);
    });
  });

  describe('undeclared action types', () => {
    it('should return the original state without any duplication or additions', () => {
      const action = { type: 'NOT_REAL_TYPE' };
      expect(subject(state, action)).toBe(state);
    });
  });

  describe('ADD_USER_INFO', () => {
    const action = {
      type: 'ADD_USER_INFO',
      payload: { email: 'test@test.com', firstName: 'Nancy' },
    };

    it("adds a user's info", () => {
      const { firstName, email } = subject(state, action);
      expect(firstName).toEqual('Nancy');
      expect(email).toEqual('test@test.com');
    });
  });

  describe('ADD_AWS_ACCOUNT', () => {
    const action = {
      type: 'ADD_AWS_ACCOUNT',
      payload: {
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
        region: 'us-east-2',
      },
    };

    it("add's a user's arn and region to their account after registration", () => {
      const { arn, region } = subject(state, action);
      expect(arn).toEqual('arn:aws:iam::123456789:role/HeliosDelegationRole');
      expect(region).toEqual('us-east-2');
    });
  });

  describe('ADD_REGION', () => {
    const action = {
      type: 'ADD_REGION',
      payload: 'us-east-2',
    };

    it("adds a user's region", () => {
      const { region } = subject(state, action);
      expect(region).toEqual('us-east-2');
    });
  });

  describe('ADD_LOGIN_INFO', () => {
    const action = {
      type: 'ADD_LOGIN_INFO',
      payload: {
        email: 'test@test.com',
        firstName: 'Jillian',
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
        region: 'us-east-2',
      },
    };

    it("adds a user's info after they log in", () => {
      const { email, firstName, arn, region } = subject(state, action);
      expect(email).toEqual('test@test.com');
      expect(firstName).toEqual('Jillian');
      expect(arn).toEqual('arn:aws:iam::123456789:role/HeliosDelegationRole');
      expect(region).toEqual('us-east-2');
    });
  });

  describe('ADD_CREDENTIALS', () => {
    const action = {
      type: 'ADD_CREDENTIALS',
      payload: {
        accessKeyId: 'TESTACCESSKEYID',
        secretAccessKey: 'TESTSECRETACCESSKEY1',
        sessionToken: 'TESTSESSIONTOKEN',
      },
    };

    it("adds a user's credentials", () => {
      const { credentials } = subject(state, action);
      expect(credentials.accessKeyId).toEqual('TESTACCESSKEYID');
      expect(credentials.secretAccessKey).toEqual('TESTSECRETACCESSKEY1');
      expect(credentials.sessionToken).toEqual('TESTSESSIONTOKEN');
    });
  });

  describe('HANDLE_LOGOUT', () => {
    const action = {
      type: 'HANDLE_LOGOUT',
    };

    it('clears the state after a user logs out', () => {
      state = {
        email: 'test@test.com',
        firstName: 'Grisha',
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'TESTACCESSKEYID',
          secretAccessKey: 'TESTSECRETACCESSKEY1',
          sessionToken: 'TESTSESSIONTOKEN',
        },
      };
      const newState = subject(state, action);
      expect(newState.email).toEqual('');
      expect(newState.firstName).toEqual('');
      expect(newState.arn).toEqual('');
      expect(newState.region).toEqual('');
      expect(newState.credentials).toEqual(null);
    });
  });

  describe('UPDATE_EMAIL', () => {
    const action = {
      type: 'UPDATE_EMAIL',
      payload: 'test2@test2.com',
    };
    it('updates the email in the state to the provided one', () => {
      state = {
        email: 'test@test.com',
        firstName: 'Rob',
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'TESTACCESSKEYID',
          secretAccessKey: 'TESTSECRETACCESSKEY1',
          sessionToken: 'TESTSESSIONTOKEN',
        },
      };
      const { email } = subject(state, action);
      expect(email).toEqual('test2@test2.com');
    });
  });

  describe('UPDATE_ARN', () => {
    const action = {
      type: 'UPDATE_ARN',
      payload: 'arn:aws:iam::9876543210:role/HeliosDelegationRole',
    };
    it('updates the arn in the state to the provided one', () => {
      state = {
        email: 'test@test.com',
        firstName: 'Graham',
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'TESTACCESSKEYID',
          secretAccessKey: 'TESTSECRETACCESSKEY1',
          sessionToken: 'TESTSESSIONTOKEN',
        },
      };
      const { arn } = subject(state, action);
      expect(arn).toEqual('arn:aws:iam::9876543210:role/HeliosDelegationRole');
    });
  });

  describe('UPDATE_NAME', () => {
    const action = {
      type: 'UPDATE_NAME',
      payload: 'Katrina',
    };

    it('updates the firstName in the state to the provided one', () => {
      state = {
        email: 'test@test.com',
        firstName: 'Kat',
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'TESTACCESSKEYID',
          secretAccessKey: 'TESTSECRETACCESSKEY1',
          sessionToken: 'TESTSESSIONTOKEN',
        },
      };
      const { firstName } = subject(state, action);
      expect(firstName).toEqual('Katrina');
    });
  });

  describe('UPDATE_USER_DETAILS_AFTER_PROFILE_UPDATE', () => {
    const action = {
      type: 'UPDATE_USER_DETAILS_AFTER_PROFILE_UPDATE',
      payload: {
        email: 'test2@test2.com',
        firstName: 'Nisa',
        arn: 'arn:aws:iam::123456789:role/HeliosDelegationRole',
      },
    };

    it('updates the state to the provided new user details', () => {
      state = {
        email: 'test@test.com',
        firstName: 'Jason',
        arn: 'arn:aws:iam::9876543210:role/HeliosDelegationRole',
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'TESTACCESSKEYID',
          secretAccessKey: 'TESTSECRETACCESSKEY1',
          sessionToken: 'TESTSESSIONTOKEN',
        },
      };
      const { email, firstName, arn } = subject(state, action);
      expect(arn).toEqual('arn:aws:iam::123456789:role/HeliosDelegationRole');
      expect(email).toEqual('test2@test2.com');
      expect(firstName).toEqual('Nisa');
    });
  });
});
