import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode;
}

class Portal extends React.Component<Props> {
  portal: null | Element = null;

  componentWillMount() {
    if (this.props.children) {
      this.portal = document.createElement('div');
      if (document.body != null) document.body.appendChild(this.portal);
    }
  }

  componentWillUnmount() {
    // Remove the DOM node
    if (this.portal != null) {
      if (document.body != null) document.body.removeChild(this.portal);
    }
  }

  componentWillUpdate(nextProps: Props) {
    if (this.props.children == null && nextProps.children != null) {
      this.portal = document.createElement('div');
      if (document.body != null) document.body.appendChild(this.portal);
    }

    if (
      this.portal != null &&
      this.props.children != null &&
      nextProps.children == null
    ) {
      if (document.body != null) document.body.removeChild(this.portal);
      this.portal = null;
    }
  }

  render(): null | React.ReactPortal {
    const { children } = this.props;

    if (this.portal != null) {
      return ReactDOM.createPortal(
        children != null ? children : null,
        this.portal,
      );
    }

    return null;
  }
}

export default Portal;
