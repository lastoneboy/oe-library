import * as React from 'react';

interface Props {
  onResize?: () => any;
  children: any;
}

export default class ResizeObserver extends React.Component<Props> {
  componentDidMount() {
    document.addEventListener('OE:resizedMain', this.handleResize);
  }

  componentWillUnmount() {
    document.removeEventListener('OE:resizedMain', this.handleResize);
  }

  handleResize = () => {
    if (this.props.onResize) {
      this.props.onResize();
    }
  };

  render() {
    return this.props.children;
  }
}
