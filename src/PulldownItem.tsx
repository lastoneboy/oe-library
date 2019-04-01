import * as React from 'react';
import { css, cx } from 'emotion';
import * as PropTypes from 'prop-types';

import PulldownGroup from './PulldownGroup';
import { Theme, ThemeContext } from './ThemeContext';
import { getFont1Class } from './typography';
import * as colors from './colors';

function getPulldownItemClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};

    display: flex;
    user-select: none;
    /* 245px */
    min-width: 64.82mm;
    /* 47px */
    height: 12.44mm;
    line-height: 12.44mm;
    background: linear-gradient(
      ${colors.OMF_Pulldown_Entry_Gradient_00_ena},
      ${colors.OMF_Pulldown_Entry_Gradient_01_ena}
    );
    margin-bottom: 1px;
    box-shadow: 0 -1px 0 ${colors.OMF_Pulldown_Shadow_ena} inset;
    white-space: nowrap;
    cursor: default;
    outline: none;

    &:last-child {
      margin-bottom: 0;
    }

    &[data-disabled='false']:active:hover {
      background: linear-gradient(
        ${colors.OMF_Pulldown_Entry_Gradient_00_prs},
        ${colors.OMF_Pulldown_Entry_Gradient_01_prs}
      );
      color: ${colors.OMF_Pulldown_Text_prs};
      box-shadow: 0 -1px 0 ${colors.OMF_Pulldown_Shadow_prs} inset;
    }
  `;
}

function getPulldownItemActiveClass(theme: Theme) {
  return css`
    &[data-disabled='false'] {
      background: linear-gradient(
        ${colors.OMF_Pulldown_Entry_Gradient_00_actena},
        ${colors.OMF_Pulldown_Entry_Gradient_01_actena}
      );
      color: ${colors.OMF_Pulldown_Text_actena};
      box-shadow: 0 -1px 0 ${colors.OMF_Pulldown_Shadow_actena} inset;
    }

    &[data-disabled='false']:active:hover {
      background: linear-gradient(
        ${colors.OMF_Pulldown_Entry_Gradient_00_actprs},
        ${colors.OMF_Pulldown_Entry_Gradient_01_actprs}
      );
      color: ${colors.OMF_Pulldown_Text_actprs};
      box-shadow: 0 -1px 0 ${colors.OMF_Pulldown_Shadow_actprs} inset;
    }
  `;
}

function getPulldownItemDisabledClass(theme: Theme) {
  return css`
    background: linear-gradient(
      ${colors.OMF_Pulldown_Entry_Gradient_00_dis},
      ${colors.OMF_Pulldown_Entry_Gradient_01_dis}
    );
    color: ${colors.OMF_Pulldown_Text_dis};
    box-shadow: 0 -1px 0 ${colors.OMF_Pulldown_Shadow_dis} inset;
  `;
}

function getPulldownItemIconOnlyClass(theme: Theme) {
  return css`
    justify-content: center;
  `;
}

function getPulldownItemIconClass(theme: Theme) {
  return css`
    flex: none;

    display: flex;
    /* 32px */
    width: 8.47mm;
    /* 25px */
    height: 6.61mm;
    /* 9px */
    padding-left: 2.38mm;
    fill: ${colors.OMF_Pulldown_Icon_ena};
    align-self: center;

    & svg {
      height: 100%;
    }

    &[data-icon-only='true'] {
      /* 9px */
      padding-right: 2.38mm;
    }
  `;
}

function getPulldownItemIconActiveClass(theme: Theme) {
  return css`
    fill: ${colors.OMF_Pulldown_Icon_actena};
  `;
}

function getPulldownItemIconDisabledClass(theme: Theme) {
  return css`
    fill: ${colors.OMF_Pulldown_Icon_dis};
  `;
}

function getPulldownItemCaptionClass(theme: Theme) {
  return css`
    flex: 1;
    /* 9px */
    padding: 0 2.38mm;
  `;
}

export interface Props {
  /** Item text, default none */
  caption?: string;
  /** Item icon, default none  */
  icon?: React.ReactNode;
  /** Whether to show in disabled state, default false */
  disabled?: boolean;
  /** Whether to show in active state, default false */
  isActive?: boolean;
  /** Optional css class name, default none */
  className?: string;
  /** general purpose data, default none */
  data?: any;
  /** Called when an enabled item is clicked */
  onClick?: (group: undefined | PulldownGroup, item: PulldownItem) => void;
}

/** Component for an item inside a Pulldown or PulldownGroup */
export default class PulldownItem extends React.PureComponent<Props> {
  static defaultProps = {
    disabled: false,
    isActive: false,
  };
  static contextTypes = {
    subscribeOpenClose: PropTypes.func.isRequired,
    unsubscribeOpenClose: PropTypes.func.isRequired,
  };
  element: null | HTMLElement = null;

  componentWillMount() {
    this.context.subscribeOpenClose(this.handleOpenClose);
  }

  /*componentDidMount() {
    if (this.element != null && this.props.isActive === true) {
      this.element.scrollIntoView({ block: 'center' });
    }
  }*/

  componentWillUnmount() {
    this.context.unsubscribeOpenClose(this.handleOpenClose);
  }

  handleClick = () => {
    const { onClick, disabled } = this.props;
    if (disabled === false && onClick != null) onClick(undefined, this);
  };

  handleOpenClose = (open: boolean) => {
    const element = this.element;
    if (open && element != null && this.props.isActive === true) {
      // [TODO] Try to refactor in favor of feature detection or graceful
      // degradation approach.
      const isChrome = /\bChrome\/(6[1-9]|[7-9]|[0-9]{3,})/.test(
        window.navigator.userAgent,
      );

      const options = isChrome
        ? { block: 'center', behavior: 'smooth' }
        : { block: 'end', behavior: 'smooth' };

      // [TODO] Triggering scrolling from deeply nested components can lead to
      // hard-to-predict behavior. If this is required, it should be passed off
      // to a high-level API.
      // @ts-ignore
      element.scrollIntoView(options);
    }
  };

  setElement = (element: null | HTMLElement) => {
    this.element = element;
  };

  render() {
    const {
      caption,
      icon,
      disabled,
      isActive,
      className,
      data,
      onClick,
      ...props
    } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            data-disabled={disabled === true}
            className={cx(getPulldownItemClass(theme), className, {
              [getPulldownItemActiveClass(theme)]: isActive === true,
              [getPulldownItemDisabledClass(theme)]: disabled === true,
              [getPulldownItemIconOnlyClass(theme)]:
                icon != null && caption == null,
            })}
            onClick={this.handleClick}
            {...props}
            ref={this.setElement}
            tabIndex={0}
          >
            {icon != null ? (
              <div
                data-icon-only={icon != null && caption == null}
                className={cx(getPulldownItemIconClass(theme), {
                  [getPulldownItemIconActiveClass(theme)]: isActive === true,
                  [getPulldownItemIconDisabledClass(theme)]: disabled === true,
                })}
              >
                {icon}
              </div>
            ) : null}
            {caption != null ? (
              <span className={getPulldownItemCaptionClass(theme)}>
                {caption}
              </span>
            ) : null}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
