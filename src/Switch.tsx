import * as React from 'react';
import { css, cx } from 'emotion';

import { Theme, ThemeContext } from './ThemeContext';
import * as colors from './colors';

function getContainerDisabledBaseClass(theme: Theme) {
  return css`
    background: linear-gradient(
      ${colors.OMF_Button_Gradient_00_dis},
      ${colors.OMF_Button_Gradient_01_dis}
    );
    box-shadow: 0px -1px 0px ${colors.OMF_Button_Shadow_dis} inset;
  `;
}

function getContainerDisabledClass(theme: Theme) {
  return css`
    ${getContainerDisabledBaseClass(theme)};

    &:active:hover {
      ${getContainerDisabledBaseClass(theme)};
    }
  `;
}

function getContainerClass(theme: Theme) {
  return css`
    position: relative;
    display: inline-block;
    background: linear-gradient(
      ${colors.OMF_Button_Gradient_00_ena},
      ${colors.OMF_Button_Gradient_01_ena}
    );
    box-shadow: 0px -1px 0px ${colors.OMF_Button_Shadow_ena} inset;
    /* 14px */
    border-radius: 3.704mm;
    user-select: none;

    &:active:hover {
      background: linear-gradient(
        ${colors.OMF_Button_Gradient_00_prs},
        ${colors.OMF_Button_Gradient_01_prs}
      );
      box-shadow: 0px -1px 0px ${colors.OMF_Button_Shadow_prs} inset;
    }
  `;
}

function getContainerFocusClass(theme: Theme) {
  return css`
    position: absolute;
    box-sizing: border-box;
    /* 60px */
    width: 15.875mm;
    /* 32px */
    height: 8.467mm;
    /* 2px */
    border: 0.529mm solid ${colors.OMF_Border_Focus};
    /* 16px */
    border-radius: 4.233mm;
    top: -0.529mm;
    left: -0.529mm;
  `;
}

function getContainerNoFocusClass(theme: Theme) {
  return css`
    display: none;
  `;
}

function getSwitchContainerClass(theme: Theme) {
  return css`
    position: relative;
    display: block;
    /* 56px*/
    width: 14.82mm;
    /* 28px */
    height: 7.41mm;
    cursor: pointer;

    .${getContainerDisabledClass(theme)} > & {
      cursor: default;
    }
  `;
}

function getSwitchCheckBoxClass(theme: Theme) {
  return css`
    position: absolute;
    -webkit-appearance: none;
    -moz-appearance: none;
    /* for iOS */
    width: 0;
    height: 0;
    border: none;

    &:focus {
      outline: none;
    }

    &:-moz-focusring {
      border: none;
    }
  `;
}

function getPathClass(theme: Theme) {
  return css`
    margin: auto;
    margin-left: 6.08mm; /* 2.38mm + width of thumb */
    margin-right: 2.38mm;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 0px;
    border: 1px solid ${colors.OMF_Button_Icon_ena};

    .${getSwitchCheckBoxClass(theme)}:checked + div > & {
      border-color: ${colors.OMF_Button_Icon_actena};
      margin-left: 2.38mm;
      margin-right: 6.08mm; /* 2.38mm + width of thumb */
    }
    
    .${getContainerClass(theme)}:not(.${getContainerDisabledClass(
    theme,
  )}):active:hover
      .${getSwitchCheckBoxClass(theme)}
      + div
      > & {
      border-color: ${colors.OMF_Button_Icon_prs};
    }
  `;
}

function getPathDisabledClass(theme: Theme) {
  return css`
    border-color: ${colors.OMF_Button_Icon_dis};

    .${getSwitchCheckBoxClass(theme)}:checked + div > & {
      border-color: ${colors.OMF_Button_Icon_dis};
      margin-left: 2.38mm;
    }
  `;
}

function getThumbClass(theme: Theme) {
  return css`
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 3.7mm;
    height: 3.7mm;
    background: transparent;
    border: 1px solid ${colors.OMF_Button_Icon_ena};
    border-radius: 1.85mm;
    margin-left: 2.38mm;

    .${getSwitchCheckBoxClass(theme)}:checked + div > & {
      right: 2.38mm;
      background-color: ${colors.OMF_Button_Icon_actena};
      border-color: transparent;
    }

    .${getContainerClass(theme)}:not(.${getContainerDisabledClass(
    theme,
  )}):active:hover
      .${getSwitchCheckBoxClass(theme)}
      + div
      > & {
      border-color: ${colors.OMF_Button_Icon_prs};
    }

    .${getContainerClass(theme)}:not(.${getContainerDisabledClass(
    theme,
  )}):active:hover .${getSwitchCheckBoxClass(theme)}:checked + div > & {
      background-color: ${colors.OMF_Button_Icon_prs};
    }
  `;
}

function getThumbDisabledClass(theme: Theme) {
  return css`
    border-color: ${colors.OMF_Button_Icon_dis};

    .${getSwitchCheckBoxClass(theme)}:checked + div > & {
      right: 2.38mm;
      background-color: ${colors.OMF_Button_Icon_dis};
      border-color: transparent;
    }
  `;
}

interface Props {
  value?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

interface State {
  isFocused: boolean;
}

export class Switch extends React.PureComponent<Props, State> {
  static defaultProps = {
    value: false,
    disabled: false,
  };

  state = { isFocused: false };

  handleChange = () => {
    const { value, onChange } = this.props;

    if (onChange != null) {
      onChange(!value);
    }
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { value, disabled } = this.props;
    const { isFocused } = this.state;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            className={`${getContainerClass(theme)} ${cx({
              [getContainerDisabledClass(theme)]: disabled,
            })}`}
          >
            <div
              className={
                isFocused
                  ? getContainerFocusClass(theme)
                  : getContainerNoFocusClass(theme)
              }
            />
            <label className={getSwitchContainerClass(theme)}>
              <input
                type="checkbox"
                name="switch"
                className={getSwitchCheckBoxClass(theme)}
                onChange={this.handleChange}
                checked={value}
                disabled={disabled}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
              />
              <div>
                <div
                  className={cx(getThumbClass(theme), {
                    [getThumbDisabledClass(theme)]: disabled,
                  })}
                />
                <div
                  className={cx(getPathClass(theme), {
                    [getPathDisabledClass(theme)]: disabled,
                  })}
                />
              </div>
            </label>
          </div>
        )}
      </ThemeContext.Consumer>
    );
  }
}
