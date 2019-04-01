import * as React from 'react';
import { css, cx } from 'emotion';

import { HoldableButton } from './decorators/holdable';
import NumericInput, { defaultFormat, defaultParse } from './NumericInput';
import { Theme, ThemeContext } from './ThemeContext';
import * as colors from './colors';
import { getFont1Class, getFont4Class, getFont3Class } from './typography';
import {
  getInputClass,
  getInputReadOnlyClass,
  getButtonBaseClass,
} from './controls';

function getSpinFieldClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};
    position: relative;
    display: inline-flex;
    outline: 0;
  `;
}

function getControlClass(theme: Theme) {
  return css`
    position: relative;
    z-index: 1;
    display: inline-flex;
    border: 0.5mm solid #c2dbf2;
    color: ${colors.OMF_Button_Text_ena};
    box-shadow: 0 1px 0 ${colors.OMF_Button_Shadow_ena};
  `;
}

function getControlDisabledClass(theme: Theme) {
  return css`
    box-shadow: 0 1px 0 ${colors.OMF_Button_Shadow_dis};
  `;
}

function getControlWarningClass(theme: Theme) {
  return css`
    border-color: ${colors.OMF_Border_Warning};
  `;
}

function getControlAlarmClass(theme: Theme) {
  return css`
    border-color: ${colors.OMF_Border_Alarm};
  `;
}

function getControlFocusClass(theme: Theme) {
  return css`
    border-color: ${colors.OMF_Blue_08};
  `;
}

function getSpinFieldInputWrapClass(theme: Theme) {
  return css`
    position: relative;
    display: flex;
    align-items: center;
  `;
}

function getSpinFieldInputClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};
    ${getInputClass(theme)};
    padding: 0;
    padding-right: 2.5mm;
    padding-left: 2.5mm;
    border: 0;
    width: 30mm;
    height: 10mm;
    box-sizing: border-box;
    text-align: right;

    &:focus {
      outline: 0;
    }
  `;
}

function getSpinFieldInputReadOnlyClass(theme: Theme) {
  return css`
    ${getInputReadOnlyClass(theme)};
  `;
}

function getSpinFieldIncrementClass(theme: Theme) {
  return css`
    ${getButtonBaseClass(theme)};
    width: 10mm;
    height: 10mm;
    border: 0;
    padding: 0;
    font-size: 20pt;
    margin-right: -1px;
  `;
}

function getSpinFieldDecrementClass(theme: Theme) {
  return getSpinFieldIncrementClass(theme);
}

function getSpinFieldSideValueClass(theme: Theme) {
  return css`
    ${getFont4Class(theme)};
    position: absolute;
    bottom: 0.1mm;
    right: 2.5mm;
    color: ${colors.OMF_Textcomponent_Text_ena};
  `;
}

function getSpinFieldSideValueDisabledClass(theme: Theme) {
  return css`
    color: ${colors.OMF_Textcomponent_Text_dis};
  `;
}

function getSpinFieldSideValueReadOnlyClass(theme: Theme) {
  return css`
    color: ${colors.OMF_Textcomponent_Text_ena};
  `;
}

function getRangeClass(theme: Theme) {
  return css`
    ${getFont3Class(theme)};

    position: absolute;
    top: -4mm;
    left: 0;
    right: 0;
    bottom: 100%;

    display: flex;
    justify-content: space-between;

    pointer-events: none;

    background: ${colors.OMF_Button_Row_Background_std};
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 90ms ease-out, transform 90ms ease-out;

    &:before {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;

      border-top: 1px solid #fff;
      content: '';
    }
  `;
}

function getRangeFocusClass(theme: Theme) {
  return css`
    opacity: 1;
    transform: translateY(0);
  `;
}

function getRangeLimitClass(theme: Theme) {
  return css`
    position: relative;
    line-height: normal;
    padding-left: 0.5mm;
    padding-right: 0.5mm;
    background: ${colors.OMF_Button_Row_Background_std};
    color: ${colors.OMF_Button_Row_Text_std};
  `;
}

interface Props {
  /** Show in enabled state */
  enabled?: boolean;

  /** Show in readonly state */
  readonly?: boolean;

  /** Show in focussed state */
  focus?: boolean;

  /** Current warn level */
  level?: 'warning' | 'alarm' | void;

  /** Current value */
  value: undefined | number;

  /** Current (optional) side value */
  sideValue?: number;

  /** Minimum value */
  minValue?: number;

  /** Maximum value */
  maxValue?: number;

  /** Step size when incrementing/decrementing the value */
  stepSize?: number;

  /** Formats the value before displaying it */
  format?: (value: undefined | number) => string;

  /** Parses the value before passing it to `onChange` it */
  parse?: (value: string) => number;

  /** Called when the value changes due to input or increment/decrement
   * operations */
  onChange: (nextValue: number) => void;
}

interface State {
  focus: boolean;
}

// State Setters
//
const setFocus = () => ({ focus: true });
const setBlur = () => ({ focus: false });

/**
 * Spin Field Component
 */
export default class SpinField extends React.PureComponent<Props, State> {
  static defaultProps = {
    enabled: false,
    readonly: false,
    stepSize: 1,
    format: defaultFormat,
    parse: defaultParse,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      focus: props.focus != null ? props.focus : false,
    };
  }

  render() {
    const {
      enabled = SpinField.defaultProps.enabled,
      readonly = SpinField.defaultProps.readonly,
      level,
      value,
      sideValue,
      minValue,
      maxValue,
      stepSize = SpinField.defaultProps.stepSize,
      format = SpinField.defaultProps.format,
      parse = SpinField.defaultProps.parse,
      onChange,
    } = this.props;
    const { focus } = this.state;

    const canDecrement =
      value != null &&
      !readonly &&
      enabled &&
      (minValue == null || value > minValue);
    const canIncrement =
      value != null &&
      !readonly &&
      enabled &&
      (maxValue == null || value < maxValue);

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            onFocus={enabled ? () => this.setState(setFocus) : undefined}
            onBlur={enabled ? () => this.setState(setBlur) : undefined}
            className={getSpinFieldClass(theme)}
            tabIndex={-1}
          >
            {/* Spin Field Control */}
            <div
              className={cx(getControlClass(theme), {
                [getControlDisabledClass(theme)]: !enabled,
                [getControlFocusClass(theme)]: focus,
                [getControlWarningClass(theme)]: level === 'warning',
                [getControlAlarmClass(theme)]: level === 'alarm',
              })}
            >
              {/* Decrement Button */}
              <HoldableButton
                className={getSpinFieldDecrementClass(theme)}
                disabled={!canDecrement}
                onHold={() => {
                  if (value == null) return false;
                  if (canDecrement) onChange(value - stepSize);
                  return canDecrement;
                }}
                tabIndex={-1}
              >
                -
              </HoldableButton>

              {/* Input */}
              <div className={getSpinFieldInputWrapClass(theme)}>
                <NumericInput
                  disabled={readonly || !enabled}
                  className={cx(getSpinFieldInputClass(theme), {
                    [getSpinFieldInputReadOnlyClass(theme)]: readonly,
                  })}
                  onChange={onChange}
                  value={value}
                  format={format}
                  parse={parse}
                  tabIndex={0}
                />
                {sideValue != null ? (
                  <div
                    className={cx(getSpinFieldSideValueClass(theme), {
                      [getSpinFieldSideValueDisabledClass(theme)]: !enabled,
                      [getSpinFieldSideValueReadOnlyClass(theme)]: readonly,
                    })}
                  >
                    {format(sideValue)}
                  </div>
                ) : null}
              </div>

              {/* Increment Button */}
              <HoldableButton
                className={getSpinFieldIncrementClass(theme)}
                disabled={!canIncrement}
                onHold={() => {
                  if (value == null) return false;
                  if (canIncrement) onChange(value + stepSize);
                  return canIncrement;
                }}
                tabIndex={-1}
              >
                +
              </HoldableButton>
            </div>

            {/* Focus Information */}
            {minValue != null || maxValue != null ? (
              <div
                className={cx(getRangeClass(theme), {
                  [getRangeFocusClass(theme)]: focus,
                })}
              >
                <span className={getRangeLimitClass(theme)}>{minValue}</span>
                <span className={getRangeLimitClass(theme)}>{maxValue}</span>
              </div>
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
export class _SpinField extends React.Component<Props> {
  render() {
    return null;
  }
}
