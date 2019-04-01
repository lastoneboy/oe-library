import * as React from 'react';
import Draggable from 'react-draggable';
import { css } from 'emotion';

import { Theme, ThemeContext } from './ThemeContext';
import { getFont8Class } from './typography';

function getHeaderClass(theme: Theme) {
  return css`
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    cursor: pointer;
  `;
}

function getCaptionClass(theme: Theme) {
  return css`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    height: 100%;
    flex: 1;
  `;
}

function getCaptionTextClass(theme: Theme) {
  return css`
    ${getFont8Class(theme)};

    overflow: hidden;
    text-transform: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
}

function getFilterButtonClass(theme: Theme) {
  return css`
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-end;
    box-sizing: border-box;
    height: 100%;
    padding: 6px;

    &:before {
      content: '';
      display: block;
      width: 17px;
      height: 17px;
    }
  `;
}

function getResizeHandleClass(theme: Theme) {
  return css`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 10px;
    transform: none !important;
    cursor: ew-resize;
  `;
}

interface Props {
  children?: React.ReactNode;
  sortDirection: undefined | string;
  onClick: () => void;
  onResize?: (delta: number) => void;
  onResizeComplete: (delta?: number) => void;

  [prop: string]: any;
}

export default class Header extends React.PureComponent<Props> {
  render() {
    const {
      children,
      sortDirection,
      onClick,
      onResize,
      onResizeComplete,
      ...extraProps
    } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div className={getHeaderClass(theme)} {...extraProps}>
            <div className={getCaptionClass(theme)} onClick={onClick}>
              <div className={getCaptionTextClass(theme)}>{children}</div>
            </div>

            <div className={getFilterButtonClass(theme)} />

            {onResize ? (
              <Draggable
                axis="x"
                position={{ x: 0, y: 0 }}
                onDrag={(event, data) => {
                  onResize(data.x);
                }}
                onStop={() => {
                  this.props.onResizeComplete();
                }}
              >
                <div className={getResizeHandleClass(theme)} />
              </Draggable>
            ) : null}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
