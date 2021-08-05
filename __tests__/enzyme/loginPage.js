import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import UserProfile from '../../client/src/Dashboard/views/UserProfile/UserProfile';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import SignIn from '../../client/src/Pages/login';

configure({ adapter: new Adapter() });

describe('SignIn page tests', () => {
  const initialState = {
    email: '',
    firstName: '',
    arn: '',
    region: '',
    credentials: null,
    credentialsLoading: false,
  };
  const mockStore = configureStore();
  let store;

  describe('SignIn', () => {
    let wrapper;

    beforeAll(() => {
      store = mockStore(initialState);
      wrapper = shallow(<SignIn store={store} />).dive();
      global.fetch = jest.fn();
    });

    it('Renders a <Container>', () => {
      expect(wrapper.find('WithStyles(ForwardRef(Container))')).toHaveLength(1);
      expect(wrapper.find('div')).toHaveLength(1);
    });

    it('Renders the logo image', () => {
      expect(wrapper.find('img')).toHaveLength(1);
      expect(wrapper.find('img').props().alt).toEqual('Helios Logo');
    });

    it('Renders the Sign in header', () => {
      expect(wrapper.find('WithStyles(ForwardRef(Typography))')).toHaveLength(
        1
      );
      expect(
        wrapper.find('WithStyles(ForwardRef(Typography))').props().variant
      ).toEqual('h5');
      expect(wrapper.find('WithStyles(ForwardRef(Typography))').text()).toMatch(
        'Sign in'
      );
    });

    it('Renders TextFields for email and password', () => {
      expect(wrapper.find('WithStyles(ForwardRef(TextField))')).toHaveLength(2);
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#email').props().name
      ).toEqual('email');
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#email').props().label
      ).toEqual('Email Address');
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#password').props().name
      ).toEqual('password');
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#password').props().label
      ).toEqual('Password');
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#password').props().type
      ).toEqual('password');
    });

    it("The TextFields' values change when typed into", () => {
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#email').props().value
      ).toEqual('');
      wrapper
        .find('WithStyles(ForwardRef(TextField))#email')
        .simulate('change', { target: { value: 'test' } });
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#email').props().value
      ).toEqual('test');
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#password').props().value
      ).toEqual('');
      wrapper
        .find('WithStyles(ForwardRef(TextField))#password')
        .simulate('change', { target: { value: 'test' } });
      expect(
        wrapper.find('WithStyles(ForwardRef(TextField))#password').props().value
      ).toEqual('test');
    });

    it('Should send a fetch when Sign In button is clicked', () => {
      fetch.mockImplementation(() => {
        return Promise.resolve({
          status: 200,
          json: () => {
            return Promise.resolve({
              confirmed: true,
              userInfo: {
                firstName: 'TestName',
                email: 'test@test.com',
                arn: 'testARN',
                region: 'us-test-1',
              },
            });
          },
        });
      });
      wrapper.find('WithStyles(ForwardRef(Button))').simulate('click');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });
});
