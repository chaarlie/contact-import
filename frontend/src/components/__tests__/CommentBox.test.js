// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CommentBox from '../CommentBox';

configure({ adapter: new Adapter() });
// test file
import { shallow, mount, render } from 'enzyme';

const wrapper = shallow(<CommentBox />);

afterEach(() => {
    wrapper.unmount();
})

it('should verify there is CommentBox', () => {
   wrapper.find('textarea').simulate('change', { 
       target:  {value: 'new comment'}
   });
   wrapper.update();

   expect(wrapper.find('textarea').prop('value')).toEqual('new comment');
})