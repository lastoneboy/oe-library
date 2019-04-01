import * as PropTypes from 'prop-types';
import * as React from 'react';
import { css, keyframes, cx } from 'emotion';
import { Overwrite } from 'type-zoo';

import PulldownGroup, { Props as PulldownGroupProps } from './PulldownGroup';
import PulldownItem, { Props as PulldownItemProps } from './PulldownItem';
import PulldownMenuButton from './PulldownMenuButton';
import { Theme, ThemeContext } from './ThemeContext';
import * as colors from './colors';

function getPulldownClass(theme: Theme) {
  return css`
    display: block;
    position: absolute;
    z-index: 1;
    /* 9px */
    padding-top: 2.38mm;
    padding-bottom: 2.38mm;
    padding-left: 2.38mm;
    /* 4px */
    padding-right: 1.06mm;
    background: ${colors.OMF_Pulldown_Background_std};
    outline: none;
  `;
}

/* https://bugzilla.mozilla.org/show_bug.cgi?id=1307693 */
/* https://test1.bugzilla.mozilla.org/show_bug.cgi?id=764076 */
/* https://test1.bugzilla.mozilla.org/show_bug.cgi?id=1335265 */
function getPulldownScrollBoxClass(theme: Theme) {
  return css`
    /* 5px*/
    padding-right: 1.32mm;
    /* 316px */
    max-height: 83.61mm;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${colors.OMF_Scrollbar_Thumb_dark};
      background-clip: content-box;
      border-radius: 2px;
      border: 3px solid transparent;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
}

function getPulldownScrollBoxIPhoneClass(theme: Theme) {
  return css`
    /* 5px + 8px */
    padding-right: 3.44rem;
  `;
}

function getAnimationClass(theme: Theme) {
  return css`
    transform-origin: left top;
    transform: scaleY(0);
  `;
}

function getAnimationChildClass(theme: Theme) {
  return css`
    opacity: 0;

    &[data-animation-open='true'] {
      animation: ${show} 200ms ease-out 250ms forwards;
    }

    &[data-animation-open='false'] {
      animation: ${hide} 150ms ease-out both;
    }
  `;
}

function getAnimationOpenClass(theme: Theme) {
  return css`
    animation: ${grow} 300ms ease-in-out forwards;
  `;
}

function getAnimationCloseClass(theme: Theme) {
  return css`
    animation: ${shrink} 200ms ease-in-out 100ms both;
  `;
}

const grow = keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

const shrink = keyframes`
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(0);
  }
`;

const show = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const hide = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export interface Props {
  /** Items or groups with items for the Pulldown */
  children?: React.ReactNode;
  /** Whether to show in open state, default false */
  isOpen?: boolean;
  /** Optional class name, default empty */
  className?: string;
  /** Optional class name, default empty */
  pulldownScrollBoxClassName?: string;
  /** Called when an enabled item is clicked */
  onClick?: (group: undefined | PulldownGroup, item: PulldownItem) => void;
  /** Called when the pulldown is fully opened or closed */
  onOpenedClosed?: (opened: boolean) => void;
}

interface State {
  hasVScrollBar: boolean;
}

type OpenCloseCallback = (opened: boolean) => void;

const _isIPhone = /\b(iPhone|iPad)\b/.test(window.navigator.userAgent);

function hasVerticalScrollBar(element: undefined | HTMLElement) {
  return element != null && element.clientWidth != element.offsetWidth;
}

/** Component for a pulldown with group or items */
export default class Pulldown extends React.Component<
  Overwrite<React.AllHTMLAttributes<HTMLDivElement>, Props>,
  State
> {
  static childContextTypes = {
    subscribeOpenClose: PropTypes.func.isRequired,
    unsubscribeOpenClose: PropTypes.func.isRequired,
  };
  state = { hasVScrollBar: false };

  scrollBoxElement: null | HTMLElement = null;

  openCloseCallbacks: Array<OpenCloseCallback> = [];

  componentDidUpdate(prevProps: Props) {
    if (
      this.scrollBoxElement != null &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasVScrollBar: hasVerticalScrollBar(this.scrollBoxElement),
      });
    }
  }

  getChildContext() {
    return {
      subscribeOpenClose: (callback: OpenCloseCallback) => {
        this.openCloseCallbacks.push(callback);
      },
      unsubscribeOpenClose: (callback: OpenCloseCallback) => {
        this.openCloseCallbacks = this.openCloseCallbacks.filter(
          fn => callback !== fn,
        );
      },
    };
  }

  handleItemClick = (
    itemClick?: (group: undefined | PulldownGroup, item: PulldownItem) => void,
  ) => (group: undefined | PulldownGroup, item: PulldownItem) => {
    if (itemClick != null) itemClick(group, item);
    const { onClick } = this.props;
    if (onClick != null) onClick(group, item);
  };

  handleAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
    const { isOpen, onOpenedClosed } = this.props;
    if (onOpenedClosed != null) {
      if (isOpen === true && event.target !== event.currentTarget) {
        onOpenedClosed(true);
        this.openCloseCallbacks.forEach(f => {
          f(true);
        });
      } else if (isOpen !== true && event.target === event.currentTarget) {
        onOpenedClosed(false);
        this.openCloseCallbacks.forEach(f => {
          f(false);
        });
      }
    }
  };

  setScrollBoxElement = (element: null | HTMLElement) => {
    this.scrollBoxElement = element;
    if (element != null) {
      this.setState({ hasVScrollBar: hasVerticalScrollBar(element) });
    }
  };

  render() {
    const {
      children,
      className,
      pulldownScrollBoxClassName,
      isOpen,
      onClick,
      onOpenedClosed,
      ...extraProps
    } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            className={cx(
              getPulldownClass(theme),
              getAnimationClass(theme),
              isOpen === true
                ? getAnimationOpenClass(theme)
                : getAnimationCloseClass(theme),
              className,
            )}
            {...extraProps}
            onAnimationEnd={this.handleAnimationEnd}
            tabIndex={0}
          >
            <div
              data-animation-open={isOpen}
              className={cx(
                getPulldownScrollBoxClass(theme),
                getAnimationChildClass(theme),
                {
                  [getPulldownScrollBoxIPhoneClass(theme)]:
                    _isIPhone && this.state.hasVScrollBar,
                },
                pulldownScrollBoxClassName,
              )}
              ref={this.setScrollBoxElement}
            >
              {children != null
                ? React.Children.map(children, child => {
                    if (typeof child === 'string') return child;
                    if (typeof child === 'number') return child;

                    const { onClick: itemClick, ...childProps } = child.props;
                    return React.cloneElement(child, {
                      ...childProps,
                      onClick: this.handleItemClick(itemClick),
                    });
                  })
                : null}
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

export { PulldownGroup, PulldownItem, PulldownMenuButton };
export { Props as PulldownProps };
