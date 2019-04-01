import * as React from 'react';
import { css, cx } from 'emotion';
import { findDOMNode } from 'react-dom';
import { Overwrite } from 'type-zoo';

import PulldownGroup from './PulldownGroup';
import PulldownItem from './PulldownItem';
import Pulldown, { PulldownProps } from './Pulldown';
import { Theme, ThemeContext } from './ThemeContext';
import * as colors from './colors';

const controlHeight = 10.05;

function getPulldownMenuBoxClass(theme: Theme) {
  return css`
    position: relative;
    display: inline-block;
  `;
}

function getPulldownMenuButtonClass(theme: Theme) {
  return css`
    border: none;
    padding: 0;
    margin: 0;
    -moz-appearance: none;
    -webkit-appearance: none;
    outline: none;
    width: ${controlHeight}mm;
    height: ${controlHeight}mm;
    background: linear-gradient(
      to bottom,
      ${colors.OMF_Interest_Menu_Gradient_00_ena},
      ${colors.OMF_Interest_Menu_Gradient_01_ena}
    );
    box-shadow: 0px -1px 0px ${colors.OMF_Pulldown_Shadow_actena} inset;
    font-size: 0;

    &::-moz-focus-inner {
      padding: 0px;
      border-width: 0px;
    }

    &:active {
      background-image: linear-gradient(
        to bottom,
        ${colors.OMF_Interest_Menu_Gradient_00_prs},
        ${colors.OMF_Interest_Menu_Gradient_01_prs}
      );
      box-shadow: 0px -1px 0px ${colors.OMF_Pulldown_Shadow_actprs} inset;
    }
  `;
}

function getPulldownMenuButtonIconClass(theme: Theme) {
  return css`
    width: 100%;
    fill: ${colors.OMF_Interest_Menu_Icon_ena};
    vertical-align: middle;

    .${getPulldownMenuButtonClass(theme)}:active & {
      fill: ${colors.OMF_Interest_Menu_Icon_prs};
    }
  `;
}

function getPulldownClass(theme: Theme) {
  return css`
    margin-top: 1px;
  `;
}

export interface Props {
  /** Items or groups with items for the Pulldown */
  children?: React.ReactNode;
  /** Optional class name, default empty */
  className?: string;
  /** Optional props for the pulldown */
  pulldownProps?: PulldownProps;
  /** Called when the button is clicked */
  onClick?: (e: React.UIEvent<HTMLElement>) => void;
  /** Called to render a button that can be focussed, default renders a hamburger button */
  renderButton?: () => React.ReactElement<any>;
  /**
   * Optional default icon
   */
  icon?: React.ReactNode;
}

interface State {
  menuState: 'closed' | 'opening' | 'open' | 'closing';
}

const _isIPhone = /\b(iPhone|iPad)\b/.test(window.navigator.userAgent);

/** Component for a pulldown menu button with a pulldown with group or items */
export default class PulldownMenuButton extends React.PureComponent<
  Overwrite<React.HTMLProps<HTMLDivElement>, Props>,
  State
> {
  buttonElement: null | HTMLElement = null;
  pulldownElement: null | Element = null;
  state: State = { menuState: 'closed' };

  handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    const { menuState } = this.state;
    if (menuState === 'opening' || menuState === 'open') {
      if (event.relatedTarget instanceof Node) {
        let focussingElement: null | Node = event.relatedTarget;
        while (focussingElement != null) {
          if (
            focussingElement === this.buttonElement ||
            focussingElement === this.pulldownElement
          ) {
            return;
          }

          if (!(focussingElement instanceof Node)) break;

          focussingElement = focussingElement.parentElement;
        }
      }

      this.setState({ menuState: 'closing' });
    }
  };

  handleButtonClick = (e: React.UIEvent<HTMLElement>) => {
    const { menuState } = this.state;
    if (menuState === 'closed' || menuState === 'closing') {
      this.setState({ menuState: 'opening' });
    } else {
      this.setState({ menuState: 'closing' });
    }

    const { onClick } = this.props;
    if (onClick != null) onClick(e);
  };

  handleButtonMouseDown = (e: React.UIEvent<HTMLElement>) => {
    if (_isIPhone && this.buttonElement != null) {
      this.buttonElement.focus();
      e.preventDefault();
    }
  };

  handleOpenedClosed = (opened: boolean) => {
    if (opened) this.setState({ menuState: 'open' });
    else this.setState({ menuState: 'closed' });
  };

  handlePulldownClick = (
    pulldownClick?: (
      group: undefined | PulldownGroup,
      item: PulldownItem,
    ) => void,
  ) => (group: undefined | PulldownGroup, item: PulldownItem) => {
    this.setState({ menuState: 'closing' });
    if (pulldownClick != null) pulldownClick(group, item);
  };

  setButtonElement = (element: null | HTMLElement) => {
    this.buttonElement = element;
  };

  setPulldownElement = (element: null | React.ReactInstance) => {
    // @ts-ignore Port to new Ref API
    this.pulldownElement = element != null ? findDOMNode(element) : null;
  };

  renderButton(theme: Theme) {
    const { icon, ...props } = this.props;

    return (
      <button className={getPulldownMenuButtonClass(theme)}>
        {icon != null ? (
          <div className={getPulldownMenuButtonIconClass(theme)}>{icon}</div>
        ) : null}
      </button>
    );
  }

  render() {
    const {
      children,
      className,
      pulldownProps,
      onClick,
      renderButton,
      ...props
    } = this.props;

    const { menuState } = this.state;
    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            className={cx(getPulldownMenuBoxClass(theme), className)}
            {...props}
          >
            {React.cloneElement(
              renderButton != null ? renderButton() : this.renderButton(theme),
              {
                onBlur: this.handleBlur,
                onClick: this.handleButtonClick,
                onMouseDown: this.handleButtonMouseDown,
                ref: this.setButtonElement,
              },
            )}
            {children != null && menuState !== 'closed' ? (
              <Pulldown
                className={getPulldownClass(theme)}
                ref={this.setPulldownElement}
                {...pulldownProps}
                onBlur={this.handleBlur}
                onOpenedClosed={this.handleOpenedClosed}
                isOpen={menuState === 'opening' || menuState === 'open'}
                onClick={this.handlePulldownClick(
                  pulldownProps != null ? pulldownProps.onClick : undefined,
                )}
              >
                {children}
              </Pulldown>
            ) : null}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}

/**
 * Fake component for exporting only the component specific props,
 * so that docz renders a more readable PropsTable.
 */
export class _PulldownMenuButton extends React.Component<Props> {
  render() {
    return null;
  }
}
