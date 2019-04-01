import * as React from 'react';
import { Overwrite } from 'type-zoo';

import { Theme, ThemeContext } from './ThemeContext';
import { css, cx } from 'emotion';
import { getFont1Class, getFont4Class } from './typography';
import * as colors from './colors';
import {
  getInputClass as getInputBaseClass,
  getInputDisabledClass,
  getInputReadOnlyClass,
} from './controls';
import { SignalingLevel, CommitType } from './types';

function getTextFieldClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};
    ${getInputBaseClass(theme)};

    display: inline-flex;
    position: relative;
    box-sizing: border-box;
    /* 2px */
    border: 0.53mm solid ${colors.OMF_Textcomponent_Border_ena};
    /* 76px */
    min-width: 20.11mm;
    /* 38 px */
    min-height: 10.05mm;
    /* 38px */
    max-height: 10.05mm;

    &[data-signal-level='${SignalingLevel.None}']::before {
      position: absolute;
      content: '';
      border-bottom: 1px solid ${colors.OMF_Textcomponent_Shadow_ena};
      /* 2px */
      left: -0.53mm;
      right: -0.53mm;
      bottom: -0.53mm;
    }

    &[data-readonly='true'] {
      ${getInputReadOnlyClass(theme)};
      border-color: ${colors.OMF_Textcomponent_Border_Readonly_ena};
    }

    &[data-readonly='true'][data-signal-level='${
      SignalingLevel.None
    }']::before {
      border-bottom-color: ${colors.OMF_Textcomponent_Shadow_Readonly_ena};
    }

    &[data-disabled='true'] {
      ${getInputDisabledClass(theme)};
      border-color: ${colors.OMF_Textcomponent_Border_dis};
    }

    &[data-disabled='true'][data-signal-level='${
      SignalingLevel.None
    }']::before {
      border-bottom-color: ${colors.OMF_Textcomponent_Shadow_dis};
    }

    &[data-signal-level='${SignalingLevel.Warning}'] {
      border-color: ${colors.OMF_Border_Warning};
    }

    &[data-signal-level='${SignalingLevel.Alarm}'] {
      border-color: ${colors.OMF_Border_Alarm};
    }

    &[data-focused='true'] {
      /* 2px */
      outline: 0.53mm solid ${colors.OMF_Border_Focus};
    }
`;
}

function getIconClass(theme: Theme) {
  return css`
    /* 19px */
    width: 5.03mm;
    /* 7px */
    padding-left: calc(2.38mm - 0.53mm);
    fill: ${colors.OMF_Textcomponent_Icon_ena};
    flex: none;

    display: inline-flex;
    align-items: center;

    & svg {
      width: 100%;
    }

    &[data-readonly='true'] {
      fill: ${colors.OMF_Textcomponent_Icon_Readonly_ena};
    }

    &[data-disabled='true'] {
      fill: ${colors.OMF_Textcomponent_Icon_dis};
    }
  `;
}

function getInputWrapperClass(theme: Theme) {
  return css`
    display: flex;
    position: relative;
    flex: 1 1 0px;
    min-width: 0px;
  `;
}

function getInputClass(theme: Theme) {
  return css`
    font: inherit;
    color: inherit;
    background-color: transparent;
    box-sizing: border-box;
    /* 72px */
    min-width: 19.05mm;
    /* 7px */
    padding: 0px calc(2.38mm - 0.53mm);
    border: none;
    outline: none;
    flex: 1 1 0px;

    &[data-align='${TextAlign.End}'] {
      text-align: end;
    }

    &[data-has-icon='true'] {
      /* 9px */
      padding-left: 2.38mm;
      /* 44px */
      min-width: 11.64mm;
    }

    &[data-has-old-value='true'] {
      padding-bottom: 7px;
    }
  `;
}

function getAlignClass(theme: Theme) {
  return css`
    /* 34px */
    line-height: 8.99mm;
  `;
}

function getOldValueClass(theme: Theme) {
  return css`
    ${getFont4Class(theme)};

    position: absolute;
    line-height: normal;
    left: 0px;
    right: 0px;
    bottom: -1px;
    /* 7px */
    padding: 0px calc(2.38mm - 0.53mm);
    white-space: nowrap;
    overflow: hidden;

    &[data-align='${TextAlign.End}'] {
      text-align: end;
    }

    &[data-has-icon='true'] {
      /* 9px */
      padding-left: 2.38mm;
    }
  `;
}

export enum TextAlign {
  Start,
  End,
}

interface Props {
  /** The current value, default void */
  value?: number | string;
  /** The old value if any, default void */
  oldValue?: string;
  /**
   * Specifies whether enabled
   * @default true
   */
  enabled?: boolean;
  /**
   * Specifies whether readonly
   * @default false
   */
  readonly?: boolean;
  /**
   * Specifies whether for input a password
   * @default false
   */
  password?: boolean;
  /**
   * Current signaling level
   * @default SignalingLevel.None
   */
  level?: SignalingLevel;
  /** The icon to display inside the component */
  icon?: React.ReactNode;
  /**
   * Alignment of the text in the input element
   * @default TextAlign.Start
   */
  textAlign?: TextAlign;
  /** The minimum length of the value, default void */
  minLength?: number;
  /** The maximum length of the value, default void */
  maxLength?: number;
  /** Called when the value changes, default void */
  onChange?: (value: string) => void;
  /** Called when the control gains focus, default void */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when the control looses focus, default void */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Called when a key is pressed, default void */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /** Additional class name */
  className?: string;
  /** Additial class name for the input field */
  inputClassName?: string;
  /**
   * Specifies when to commit the value
   * @default CommitType.OnChange
   */
  commit?: CommitType;
  // Deleted props
  disabled?: boolean;
}

interface State {
  editValue: undefined | string;
  focussed: boolean;
}

/** Component for input a text or password */
export default class TextField extends React.PureComponent<
  Overwrite<React.HTMLProps<HTMLDivElement>, Props>,
  State
> {
  static defaultProps = {
    enabled: true,
    readonly: false,
    level: SignalingLevel.None,
    textAlign: TextAlign.Start,
    commit: CommitType.onChange,
  };

  state: State = {
    editValue: undefined,
    focussed: false,
  };
  inputElement: null | HTMLInputElement = null;

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange, minLength, value, commit } = this.props;
    let { editValue } = this.state;
    let newValue = event.target.value;

    if (editValue == null) editValue = String(value);
    if (
      minLength != null &&
      minLength > 0 &&
      editValue != null &&
      editValue.length >= minLength &&
      newValue.length < minLength
    ) {
      newValue = editValue;
    }

    this.setState({ editValue: newValue });
    if (onChange != null && commit === CommitType.onChange) {
      onChange(newValue);
    }
  };
  handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;
    this.setState({ focussed: true });
    if (onFocus != null) {
      onFocus(event);
    }
  };
  handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onBlur } = this.props;
    this.setState({ editValue: undefined, focussed: false });
    if (onBlur != null) {
      onBlur(event);
    }
  };
  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, commit } = this.props;
    const { editValue } = this.state;
    let onChange;
    if (
      editValue != null &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      ((event.keyCode === 13 &&
        !event.shiftKey &&
        (commit === CommitType.onEnter ||
          commit === CommitType.onEnterOrTab)) ||
        (event.keyCode === 9 && commit === CommitType.onEnterOrTab))
    ) {
      this.setState({ editValue: undefined });
      onChange = this.props.onChange;
    }
    if (onKeyDown != null) {
      onKeyDown(event);
    }
    // TODO: check for change of value?
    if (onChange != null && editValue != null) {
      onChange(editValue);
    }
  };
  handleIconMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    const element = this.inputElement;
    if (element != null && this.props.enabled === true) {
      event.stopPropagation();
      event.preventDefault();
      element.focus();
    }
  };
  setInputElement = (element: null | HTMLInputElement) => {
    this.inputElement = element;
  };
  render() {
    const {
      value,
      oldValue,
      enabled,
      readonly,
      password,
      level,
      icon,
      textAlign,
      minLength,
      maxLength,
      onFocus,
      onChange,
      onBlur,
      onKeyDown,
      className,
      inputClassName,
      commit,
      disabled: _del0,
      ...extraProps
    } = this.props;

    const { editValue, focussed } = this.state;
    const readonlyAndEnabled = readonly === true && enabled;
    const hasOldValue = oldValue != null && oldValue.length !== 0;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            data-signal-level={level}
            data-readonly={readonlyAndEnabled}
            data-disabled={!enabled}
            data-focused={focussed}
            className={cx(getTextFieldClass(theme), className)}
            {...extraProps}
          >
            <div className={getAlignClass(theme)}>{'\u200B'}</div>
            {icon != null ? (
              <div
                data-readonly={readonlyAndEnabled}
                data-disabled={!enabled}
                className={getIconClass(theme)}
                onMouseDown={this.handleIconMouseDown}
              >
                {icon}
              </div>
            ) : null}
            <div className={getInputWrapperClass(theme)}>
              <input
                data-align={textAlign}
                data-has-icon={icon != null}
                data-has-old-value={hasOldValue}
                className={cx(getInputClass(theme), inputClassName)}
                type={password === true ? 'password' : 'text'}
                disabled={!enabled}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                onKeyDown={this.handleKeyDown}
                value={
                  editValue != null ? editValue : value != null ? value : ''
                }
                readOnly={readonly}
                minLength={
                  minLength != null && minLength >= 0 ? minLength : undefined
                }
                maxLength={
                  maxLength != null && maxLength > 0 ? maxLength : undefined
                }
                ref={this.setInputElement}
              />
              {hasOldValue ? (
                <div
                  data-align={textAlign}
                  data-has-icon={icon != null}
                  className={getOldValueClass(theme)}
                >
                  {oldValue}
                </div>
              ) : null}
            </div>
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
export class _TextField extends React.Component<Props> {
  render() {
    return null;
  }
}
