import * as React from 'react';
import { css, cx } from 'emotion';

import { Overwrite } from 'type-zoo/types';

import { Theme } from './ThemeContext';
import * as colors from './colors';

function getRadioButtonClass(theme: Theme) {
  return css`
    position: relative;
    /* 28px */
    width: 7.41mm;
    height: 7.41mm;
    -moz-appearance: none;
    -webkit-appearance: none;
    /* appearance: none; */
    background: linear-gradient(
      ${colors.OMF_Button_Gradient_00_ena},
      ${colors.OMF_Button_Gradient_01_ena}
    );
    border: none;
    margin: 0;
    padding: 0;
    box-shadow: 0 -1px 0 ${colors.OMF_Button_Shadow_ena} inset;
    /* 14px */
    border-radius: 50%;
    user-select: none;
    outline: none;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font: inherit;

    &:-moz-focusring {
      border: none;
    }

    &:disabled {
      background-image: linear-gradient(
        ${colors.OMF_Button_Gradient_00_dis},
        ${colors.OMF_Button_Gradient_01_dis}
      );
      box-shadow: 0 -1px 0 ${colors.OMF_Button_Shadow_dis} inset;
    }

    &:enabled:active:hover {
      background-image: linear-gradient(
        ${colors.OMF_Button_Gradient_00_prs},
        ${colors.OMF_Button_Gradient_01_prs}
      );
      box-shadow: 0 -1px 0 ${colors.OMF_Button_Shadow_prs} inset;
    }

    &::before {
      content: '\u200b';
      box-sizing: border-box;
      /* 10px */
      width: 2.65mm;
      height: 2.65mm;
      border-radius: 50%;
      line-height: 2.65mm;
      border: 1px solid ${colors.OMF_Button_Icon_ena};
      background-clip: content-box;
      /* pointer-events: none; */
    }

    &:enabled:active:hover::before {
      border-color: ${colors.OMF_Button_Icon_prs};
    }

    &:disabled::before {
      border-color: ${colors.OMF_Button_Icon_dis};
    }

    &:checked::before {
      border-color: ${colors.OMF_Button_Icon_actena};
      background-color: ${colors.OMF_Button_Icon_actena};
    }

    &:enabled:checked:active:hover::before {
      border-color: ${colors.OMF_Button_Icon_prs};
      background-color: ${colors.OMF_Button_Icon_prs};
    }

    &:checked:disabled::before {
      border-color: ${colors.OMF_Button_Icon_dis};
      background-color: ${colors.OMF_Button_Icon_dis};
    }

    &:focus::after {
      position: absolute;
      content: '';
      /* 2px */
      border: 0.53mm solid ${colors.OMF_Border_Focus};
      /* 16px */
      border-radius: 50%;
      /* -2px */
      top: -0.53mm;
      right: -0.53mm;
      bottom: -0.53mm;
      left: -0.53mm;
    }
  `;
}

interface Props {
  /** Optional class name, default void */
  className?: string;
  /** Show in enabled state, default true */
  enabled?: boolean;
  /** Show in checked state, default false */
  value?: boolean;
  /** Called when the checked state has changed, default void */
  onChange?: (value: boolean) => void;
}

export class RadioButton extends React.PureComponent<
  Overwrite<React.HTMLProps<HTMLInputElement>, Props>
> {
  static defaultProps = {
    value: false,
    enabled: true,
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;

    if (onChange != null) {
      onChange(event.target.checked);
    }
  };

  render() {
    const { className, enabled, value, onChange, ...extraProps } = this.props;

    return (
      <input
        {...extraProps}
        type="radio"
        className={cx(getRadioButtonClass(Theme.Dark), className)}
        checked={value}
        disabled={!enabled}
        onChange={this.handleChange}
      />
    );
  }
}

/**
 * Fake component for exporting only the component specific props,
 * so that docz renders a more readable PropsTable.
 */
export class _RadioButton extends React.Component<Props> {
  render() {
    return null;
  }
}
