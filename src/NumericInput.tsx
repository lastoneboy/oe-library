import * as React from 'react';
import { Overwrite } from 'type-zoo/types';

import { CommitType } from './types';

interface Props {
  /** Whether to allow and empty value which, default false */
  allowEmpty?: boolean;
  /** Current value */
  value: undefined | number;
  /** Called when the value changes due to input */
  onChange: (value: number) => void;
  /** Formats the value before displaying it */
  format?: (value: undefined | number) => string;
  /** Parses the value before passing it to `onChange` */
  parse?: (value: string) => number;
  /** Called when the component lost focus */
  onBlur?: (event: React.SyntheticEvent<any>) => void;
  /** Specifies when to commit the value (call `onChange`), default 'onChange' */
  commit?: CommitType;
  /** Called when a key is pressed, default void */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

interface State {
  rawValue: undefined | string;
}

export function defaultFormat(value: undefined | number): string {
  return value != null ? String(value) : '';
}

export function defaultParse(value: string): number {
  return Number(value);
}

export default class NumericInput extends React.PureComponent<
  Overwrite<React.HTMLProps<HTMLInputElement>, Props>,
  State
> {
  state: State = {
    rawValue: undefined,
  };

  static defaultProps = {
    allowEmpty: false,
    format: defaultFormat,
    parse: defaultParse,
    commit: CommitType.onChange,
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      allowEmpty,
      parse = defaultParse,
      onChange,
      commit = NumericInput.defaultProps.commit,
    } = this.props;

    this.setState({
      rawValue: event.target.value,
    });

    if (!event.target.value && !allowEmpty) {
      return;
    }

    const numericValue = parse(event.target.value);

    if (isFinite(numericValue) && commit === CommitType.onChange) {
      onChange(numericValue);
    }
  };

  handleBlur = (event: React.SyntheticEvent<any>) => {
    const { onBlur } = this.props;

    this.setState({
      rawValue: undefined,
    });

    if (onBlur != null) {
      onBlur(event);
    }
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onKeyDown, commit, allowEmpty, parse = defaultParse } = this.props;
    const { rawValue } = this.state;
    let onChange;
    if (
      rawValue != null &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      ((event.keyCode === 13 &&
        !event.shiftKey &&
        (commit === CommitType.onEnter ||
          commit === CommitType.onEnterOrTab)) ||
        (event.keyCode === 9 && commit === CommitType.onEnterOrTab))
    ) {
      this.setState({ rawValue: undefined });
      onChange = this.props.onChange;
    }
    if (onKeyDown != null) {
      onKeyDown(event);
    }
    if (onChange != null && rawValue != null && (rawValue || allowEmpty)) {
      const numericValue = parse(rawValue);
      // TODO: check for change of value?
      if (isFinite(numericValue)) {
        onChange(numericValue);
      }
    }
  };

  resetRawValue = () => {
    this.setState({
      rawValue: undefined,
    });
  };

  render() {
    const {
      allowEmpty,
      value,
      onChange,
      format = defaultFormat,
      parse = defaultParse,
      onBlur,
      commit,
      onKeyDown,
      ...props
    } = this.props;
    const { rawValue } = this.state;

    return (
      <input
        {...props}
        value={rawValue != null ? rawValue : format(value)}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
      />
    );
  }
}
