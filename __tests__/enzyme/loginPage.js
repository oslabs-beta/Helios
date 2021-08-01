import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dexie from 'dexie';
import indexedDB from 'fake-indexeddb';
import UserProfile from '../../client/src/Dashboard/views/UserProfile/UserProfile';
import toJson from 'enzyme-to-json';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// const initialState = { output: 10 };

// let store, wrapper;

// beforeEach(() => {
//   store = mockStore(initialState);
//   wrapper = mount(
//     <Provider store={store}>
//       <ConnectedHome />
//     </Provider>
//   );
// });

import SignIn from '../../client/src/Pages/login';

configure({ adapter: new Adapter() });

describe('SignIn page tests', () => {
  const initialState = {};
  const mockStore = configureStore();
  let store;

  describe('SignIn', () => {
    let wrapper;

    beforeAll(() => {
      var db = new Dexie('MyDatabase', { indexedDB: indexedDB });
      store = mockStore(initialState);
      //   wrapper = shallow(<SignIn store={store} />);
      wrapper = shallow(<SignIn store={store} />).dive();
    });

    it('Renders a <Container>', () => {
      console.log(wrapper.debug());
      expect(wrapper.find('WithStyles(ForwardRef(Container))')).toHaveLength(1);
      // expect(wrapper.type()).toEqual('Container');
      // expect(wrapper.find('TextField')).toHaveLength(1);
    });
  });
});
