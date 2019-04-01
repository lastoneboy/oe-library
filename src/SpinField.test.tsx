import * as React from 'react';
import * as renderer from 'react-test-renderer';

import SpinField from './SpinField';

describe('SpinField', () => {
  it('should render correctly', () => {
    const tree1 = renderer
      .create(<SpinField onChange={() => {}} value={1} />)
      .toJSON();
    expect(tree1).toMatchSnapshot();

    const tree2 = renderer
      .create(<SpinField onChange={() => {}} value={1} enabled />)
      .toJSON();
    expect(tree2).toMatchSnapshot();

    const tree3 = renderer
      .create(<SpinField onChange={() => {}} value={1} readonly />)
      .toJSON();
    expect(tree3).toMatchSnapshot();
  });
});
