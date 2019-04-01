import * as React from 'react';
import { css, cx } from 'emotion';

import PulldownItem from './PulldownItem';
import { Theme, ThemeContext } from './ThemeContext';
import { getFont3Class } from './typography';
import * as colors from './colors';

function getPulldownGroupClass(theme: Theme) {
  return css`
    cursor: default;
  `;
}

function getPulldownGroupHeaderClass(theme: Theme) {
  return css`
    display: flex;
    align-items: flex-end;
    user-select: none;
    box-sizing: border-box;
    /* 38px */
    height: 10.05mm;
    /* 4px */
    padding-bottom: 1.06mm;

    .${getPulldownGroupClass(theme)}:first-child & {
      /* 28px */
      height: 6.41mm;
    }
  `;
}

function getPulldownGroupCaptionClass(theme: Theme) {
  return css`
    ${getFont3Class(theme)};

    color: ${colors.OMF_Pulldown_Group_Text_std};
    white-space: nowrap;
  `;
}

export interface Props {
  /** String for group text, required */
  caption: string;
  /** Items in the group, default none */
  children?: React.ReactNode;
  /** Optional class name, default none */
  className?: string;
  /** Called when an enabled item is clicked */
  onClick?: (group: undefined | PulldownGroup, item: PulldownItem) => void;
}

/** Component for a group with items inside a Pulldown */
export default class PulldownGroup extends React.PureComponent<Props> {
  handleItemClick = (
    itemClick: (group: undefined | PulldownGroup, item: PulldownItem) => void,
  ) => (group: undefined | PulldownGroup, item: PulldownItem) => {
    if (itemClick != null) itemClick(this, item);
    const { onClick } = this.props;
    if (onClick != null) onClick(this, item);
  };

  render() {
    const { caption, children, className, onClick, ...props } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            className={cx(getPulldownGroupClass(theme), className)}
            {...props}
          >
            <div className={getPulldownGroupHeaderClass(theme)}>
              <span className={getPulldownGroupCaptionClass(theme)}>
                {caption}
              </span>
            </div>
            {children != null
              ? React.Children.map(children, child => {
                  if (typeof child === 'number') return child;
                  if (typeof child === 'string') return child;

                  const { onClick: itemClick, ...childProps } = child.props;
                  return React.cloneElement(child, {
                    ...childProps,
                    onClick: this.handleItemClick(itemClick),
                  });
                })
              : null}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
