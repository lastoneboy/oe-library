import * as React from 'react';
import { cx, css } from 'emotion';

import { getFont1Class } from './typography';
import { getButtonBaseClass, getButtonIconClass } from './controls';
import * as colors from './colors';
import { Theme, ThemeContext } from './ThemeContext';
import { Overwrite } from 'type-zoo/types';
import { SignalingLevel } from './types';

const borderWidth = 0.53;
const controlHeight = 10.05;

function getButtonIconOnlyClass(theme: Theme) {
  return css`
    margin-right: auto;
    margin-left: auto;
  `;
}

function getButtonClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};
    ${getButtonBaseClass(theme)};

    display: inline-flex;
    padding: 0px 2.38mm;
    border: none;
    box-shadow: 0px -1px 0px ${colors.OMF_Button_Shadow_ena} inset;
    box-sizing: border-box;
    min-width: 20.95mm;
    min-height: ${controlHeight}mm;
    max-height: ${controlHeight}mm;
    line-height: ${controlHeight}mm;

    &:enabled:active:hover {
      box-shadow: 0px -1px 0px ${colors.OMF_Button_Shadow_prs} inset;
    }

    &:disabled {
      box-shadow: 0px -1px 0px ${colors.OMF_Button_Shadow_dis} inset;
    }

    &::-moz-focus-inner {
      padding: 0px;
      border-width: 0px;
    }
  `;
}

function getButtonWarningAndAlarmBaseClass(theme: Theme) {
  return css`
    line-height: ${controlHeight - 2 * borderWidth}mm;
    box-shadow: none;
    padding: 0px ${2.38 - borderWidth}mm;

    &:enabled:active:hover {
      box-shadow: none;
    }

    &:disabled {
      box-shadow: none;
    }
  `;
}

function getButtonWarningClass(theme: Theme) {
  return css`
    ${getButtonWarningAndAlarmBaseClass(theme)};
    border: ${borderWidth}mm solid ${colors.OMF_Border_Warning};
  `;
}

function getButtonAlarmClass(theme: Theme) {
  return css`
    ${getButtonWarningAndAlarmBaseClass(theme)};
    border: ${borderWidth}mm solid ${colors.OMF_Border_Alarm};
  `;
}

export interface Props {
  /**
   * Show in enabled state?
   * @default true
   */
  enabled?: boolean;
  /**
   * Current signaling level
   * @default SignalingLevel.None
   */
  level?: SignalingLevel;
  /**
   * An optional leading icon */
  icon?: React.ReactNode;
  /** Optional class name */
  className?: string;
  /** React Children */
  children?: React.ReactNode;
}

export class CommandButton extends React.Component<
  Overwrite<React.ButtonHTMLAttributes<HTMLButtonElement>, Props>
> {
  static defaultProps = {
    enabled: true,
    level: SignalingLevel.None,
  };

  render() {
    const {
      enabled = true,
      level,
      icon,
      children,
      className,
      ...extraProps
    } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <button
            // ref={this.setButtonElement}
            className={cx(
              getButtonClass(theme),
              {
                [getButtonWarningClass(theme)]:
                  level === SignalingLevel.Warning,
                [getButtonAlarmClass(theme)]: level === SignalingLevel.Alarm,
              },
              className,
            )}
            disabled={!enabled}
            {...extraProps}
          >
            {icon != null ? (
              <div
                className={cx(getButtonIconClass(theme), {
                  [getButtonIconOnlyClass(theme)]: children == null,
                })}
              >
                {icon}
              </div>
            ) : null}
            {children}
          </button>
        )}
      </ThemeContext.Consumer>
    );
  }
}

/**
 * Fake component for exporting only the component specific props,
 * so that docz renders a more readable PropsTable.
 */
export class _CommandButton extends React.Component<Props> {
  render() {
    return null;
  }
}
