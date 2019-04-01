import * as React from 'react';
import * as cx from 'classnames';
import { css } from 'emotion';

import { Theme, ThemeContext } from './ThemeContext';
import { getFont1Class } from './typography';
import * as colors from './colors';

function getNavigationPathClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};

    --grad_ena: linear-gradient(
      ${colors.OMF_Navigation_Path_Gradient_00_ena},
      ${colors.OMF_Navigation_Path_Gradient_01_ena}
    );
    --grad_prs: linear-gradient(
      ${colors.OMF_Navigation_Path_Gradient_00_prs},
      ${colors.OMF_Navigation_Path_Gradient_01_prs}
    );
    --grad_ena_last: linear-gradient(
      ${colors.OMF_Navigation_Path_Last_Entry_Gradient_00_ena},
      ${colors.OMF_Navigation_Path_Last_Entry_Gradient_01_ena}
    );
    --grad_prs_last: linear-gradient(
      ${colors.OMF_Navigation_Path_Last_Entry_Gradient_00_prs},
      ${colors.OMF_Navigation_Path_Last_Entry_Gradient_01_prs}
    );

    line-height: 38px;
    display: flex;
    background: ${colors.OMF_Application_Background_std};
    white-space: nowrap;
    cursor: default;
  `;
}

function getRootButtonClass(theme: Theme) {
  return css`
    display: flex;
    align-items: center;
    box-sizing: border-box;
    background: ${colors.OMF_Navigation_Path_Root_Background_ena};
    border: 2px solid ${colors.OMF_Navigation_Path_Root_Border_ena};
    min-width: 76px;
    height: 38px;
    padding-right: 9px;
    margin-right: 4px;
    line-height: normal;

    & div svg {
      vertical-align: middle;
    }
  `;
}

function getRootLabelClass(theme: Theme) {
  return css`
    color: ${colors.OMF_Navigation_Path_Root_Text_ena};
    font-weight: bold;
  `;
}

function getRootIconClass(theme: Theme) {
  return css`
    width: 36px;
    fill: ${colors.OMF_Navigation_Path_Root_Icon_ena};
  `;
}

function getPathButtonClass(theme: Theme) {
  return css`
    display: flex;
    height: 38px;
    color: ${colors.OMF_Navigation_Path_Text_ena};
    /* Only for mouse clicks, not for painting */
    clip-path: polygon(
      0% 0%,
      calc(100% - 13px) 0%,
      100% 50%,
      calc(100% - 13px) 100%,
      0% 100%
    );

    &:active {
      color: ${colors.OMF_Navigation_Path_Text_prs};
    }
  `;
}

function getPathButtonLastClass(theme: Theme) {
  return css`
    color: ${colors.OMF_Navigation_Path_Last_Entry_Text_ena};

    &:active {
      color: ${colors.OMF_Navigation_Path_Last_Entry_Text_prs};
    }
  `;
}

function getPathButtonNotFirstClass(theme: Theme) {
  return css`
    margin-left: -9px;
    clip-path: polygon(
      0% 0%,
      calc(100% - 13px) 0%,
      100% 50%,
      calc(100% - 13px) 100%,
      0% 100%,
      13px 50%
    );
  `;
}

function getLeftArrowsClass(theme: Theme) {
  return css`
    width: 13px;
    overflow: hidden;
  `;
}

function getLeftUpperArrowClass(theme: Theme) {
  return css`
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: var(--grad_ena);
    transform-origin: 0 0;
    transform: skewX(34.38deg);
    box-shadow: 1px 0 0 ${colors.OMF_Navigation_Path_Shadow_ena} inset;

    .${getPathButtonClass(theme)}:active & {
      background: var(--grad_prs);
      box-shadow: 1px 0 0 ${colors.OMF_Navigation_Path_Shadow_prs} inset;
    }

    .${getPathButtonLastClass(theme)} & {
      background: var(--grad_ena_last);
    }

    .${getPathButtonLastClass(theme)}:active & {
      background: var(--grad_prs_last);
    }
  `;
}

function getLeftLowerArrowClass(theme: Theme) {
  return css`
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    background: var(--grad_ena);
    transform-origin: 0 100%;
    transform: translateY(-100%) skewX(-34.38deg);
    box-shadow: 0 -1px 0 ${colors.OMF_Navigation_Path_Shadow_ena} inset;

    .${getPathButtonClass(theme)}:active & {
      background: var(--grad_prs);
      box-shadow: 0 -1px 0 ${colors.OMF_Navigation_Path_Shadow_prs} inset;
    }

    .${getPathButtonLastClass(theme)} & {
      background: var(--grad_ena_last);
    }

    .${getPathButtonLastClass(theme)}:active & {
      background: var(--grad_prs_last);
    }
  `;
}

function getRightArrowsClass(theme: Theme) {
  return css`
    width: 13px;
    margin-left: -1px;
    overflow: hidden;
    background: var(--grad_ena);

    .${getPathButtonClass(theme)}:active & {
      background-image: var(--grad_prs);
    }

    .${getPathButtonLastClass(theme)} & {
      background-image: var(--grad_ena_last);
    }

    .${getPathButtonLastClass(theme)}:active & {
      background-image: var(--grad_prs_last);
    }
  `;
}

function getRightUpperArrowClass(theme: Theme) {
  return css`
    height: 50%;
    width: 100%;
    box-sizing: border-box;
    background-color: ${colors.OMF_Application_Background_std};

    transform-origin: 0 0;
    transform: skewX(34.38deg);
  `;
}

function getRightLowerArrowClass(theme: Theme) {
  return css`
    height: 50%;
    width: 100%;
    box-sizing: border-box;
    background-color: ${colors.OMF_Application_Background_std};
    transform-origin: 0 100%;
    transform: skewX(-34.38deg);
    box-shadow: -1px 0 0 ${colors.OMF_Navigation_Path_Shadow_ena};

    .${getPathButtonClass(theme)}:active & {
      box-shadow: -1px 0 0 ${colors.OMF_Navigation_Path_Shadow_prs};
    }
  `;
}

function getLabelClass(theme: Theme) {
  return css`
    min-width: 81px;
    padding: 0 8px;
    background: var(--grad_ena);
    box-shadow: 0 -1px 0 ${colors.OMF_Navigation_Path_Shadow_ena} inset;

    .${getPathButtonNotFirstClass(theme)} & {
      min-width: 68px;
    }

    .${getPathButtonClass(theme)}:active & {
      background: var(--grad_prs);
      box-shadow: 0 -1px 0 ${colors.OMF_Navigation_Path_Shadow_prs} inset;
    }

    .${getPathButtonLastClass(theme)} & {
      background: var(--grad_ena_last);
    }

    .${getPathButtonLastClass(theme)}:active & {
      background: var(--grad_prs_last);
    }
  `;
}

interface Props {
  /** An array with path element, default ['Root'] */
  path?: Array<React.ReactNode>;
  /** Icon of the root button */
  icon: React.ReactNode;
  /** Optional class name */
  className?: string;
  /** Called when a path button is clicked */
  onClick?: (index: number, source: NavigationPath) => void;
}

/** Component for the navigation path */
export default class NavigationPath extends React.Component<Props> {
  static defaultProps = {
    path: ['Root'],
  };

  handleClick = (index: number) => () => {
    const { onClick } = this.props;
    if (onClick != null) {
      onClick(index, this);
    }
  };

  render() {
    const {
      path = NavigationPath.defaultProps.path,
      icon,
      className,
      onClick,
      ...props
    } = this.props;
    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            className={cx(getNavigationPathClass(theme), className)}
            {...props}
          >
            {path.map(
              (value, i) =>
                i === 0 ? (
                  <div
                    key={i}
                    className={getRootButtonClass(theme)}
                    onClick={this.handleClick(0)}
                  >
                    <div className={getRootIconClass(theme)}>{icon}</div>
                    <div className={getRootLabelClass(theme)}>{value}</div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className={cx(getPathButtonClass(theme), {
                      [getPathButtonLastClass(theme)]: i === path.length - 1,
                      [getPathButtonNotFirstClass(theme)]: i > 1,
                    })}
                    onClick={this.handleClick(i)}
                  >
                    {i > 1 && (
                      <div className={getLeftArrowsClass(theme)}>
                        <div className={getLeftUpperArrowClass(theme)} />
                        <div className={getLeftLowerArrowClass(theme)} />
                      </div>
                    )}
                    <span className={getLabelClass(theme)}>{value}</span>
                    <div className={getRightArrowsClass(theme)}>
                      <div className={getRightUpperArrowClass(theme)} />
                      <div className={getRightLowerArrowClass(theme)} />
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
