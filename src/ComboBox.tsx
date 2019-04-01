import * as React from 'react';
import { List } from 'react-virtualized';
import { cx, css } from 'emotion';
import { equals } from 'ramda';
import { Overwrite } from 'type-zoo/types';

import Portal from './Portal';
import { getFont1Class } from './typography';
import { getButtonBaseClass } from './controls';
import * as colors from './colors';
import { ThemeContext, Theme } from './ThemeContext';

function getItemClass(theme: Theme) {
  return css`
    box-sizing: border-box;
    height: 10mm;
    line-height: 10mm;
    padding: 0 2.5mm;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: ${colors.OMF_Dropdown_Entry_Row_Odd};
    color: ${colors.OMF_Dropdown_Entry_Text_ena};

    &:nth-child(2n) {
      background: ${colors.OMF_Dropdown_Entry_Row_Even};
    }

    &:hover {
      background: ${colors.OMF_Dropdown_Entry_Selected};
      color: ${colors.OMF_Dropdown_Entry_Text_Selected};
    }
  `;
}

function getItemActiveClass(theme: Theme) {
  return css`
    background: ${colors.OMF_Dropdown_Entry_Selected};
    color: ${colors.OMF_Dropdown_Entry_Text_Selected};

    &:nth-child(2n) {
      background: ${colors.OMF_Dropdown_Entry_Selected};
      color: ${colors.OMF_Dropdown_Entry_Text_Selected};
    }
  `;
}

function getDropDownClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};
    position: fixed;
    z-index: 10;
  `;
}

function getListClass(theme: Theme) {
  return css`
    box-sizing: border-box;
    background: ${colors.OMF_Dropdown_Entry_Row_Odd};
    border: 2px solid ${colors.OMF_Dropdown_Border};
    outline: none;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      background: ${colors.OMF_Scrollbar_Background_light};
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${colors.OMF_Scrollbar_Thumb_light};
      background-clip: content-box;
      border-radius: 2px;
      border: 3px solid transparent;
    }
  `;
}

function getComboBoxClass(theme: Theme) {
  return css`
    ${getFont1Class(theme)};
    position: relative;
    user-select: none;
    min-width: 30mm;
    box-sizing: border-box;
    height: 38px;
    border: 2px solid
      ${theme === Theme.Dark ? 'black' : colors.OMF_Textcomponent_Border_ena};
    display: inline-flex;

    &[disabled] {
      border: 2px solid ${colors.OMF_Textcomponent_Border_dis};
    }

    &::before {
      content: '';
      position: absolute;
      right: -2px;
      bottom: -2px;
      left: -2px;
      border-bottom: 1px solid ${colors.OMF_Textcomponent_Shadow_ena};
    }

    &[disabled]::before {
      border-bottom-color: ${colors.OMF_Textcomponent_Shadow_dis};
    }
  `;
}

function getValueClass(theme: Theme) {
  return css`
    height: 100%;
    line-height: 34px;
    flex: 1;
    padding: 0 7px;
    cursor: pointer;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: ${colors.OMF_Textcomponent_Text_ena};
    background: ${colors.OMF_Textcomponent_Background_ena};
  `;
}

function getValueDisabledClass(theme: Theme) {
  return css`
    cursor: default;
    background: ${colors.OMF_Textcomponent_Background_dis};
    color: ${colors.OMF_Textcomponent_Text_dis};
    pointer-events: none;
  `;
}

function getValueHandleClass(theme: Theme) {
  return css`
    ${getButtonBaseClass(theme)};
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 100%;
    color: inherit;

    & svg {
      display: block;
      width: 16px;
      height: 9px;
      margin-top: 0.5mm;
      fill: ${colors.OMF_Button_Icon_ena};
    }

    .${getValueClass(theme)}:active ~ & {
      background: linear-gradient(
        180deg,
        ${colors.OMF_Button_Gradient_00_prs},
        ${colors.OMF_Button_Gradient_01_prs}
      );
    }
  `;
}

const defaultRender = (item: React.ReactNode) => item;

interface Props<T> {
  renderItem?: (item: T) => React.ReactNode;
  visibleItems?: number;
  items: Array<T>;
  value: undefined | T;
  onChange: (value: T) => void;
  className?: string;

  // TODO: This state does not appear to be specified. Added because it seems
  // probable that it's actually needed.
  disabled?: boolean;
}

interface State {
  isOpen: boolean;
}

export class ComboBox<T> extends React.PureComponent<
  Overwrite<React.HTMLProps<HTMLDivElement>, Props<T>>,
  State
> {
  state = {
    isOpen: false,
  };

  element: null | Element = null;

  static defaultProps = {
    renderItem: defaultRender,
    disabled: false,
    visibleItems: 5,
  };

  componentDidMount() {
    const options = { capture: true, passive: true };
    window.addEventListener('resize', this.updateDropDown, options);
    window.addEventListener('scroll', this.updateDropDown, options);
  }

  componentWillUnmount() {
    const options = { capture: true, passive: true };
    window.removeEventListener('resize', this.updateDropDown, options);
    window.removeEventListener('scroll', this.updateDropDown, options);
  }

  updateDropDown = () => {
    if (this.state.isOpen) {
      this.forceUpdate();
    }
  };

  toggleOpen = (event: React.SyntheticEvent<any>) => {
    event.stopPropagation();

    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  selectItem = (item: T) => (event: React.SyntheticEvent<any>) => {
    const { value } = this.props;

    event.stopPropagation();

    if (!equals(item, value)) {
      this.props.onChange(item);
    }

    this.setState({
      isOpen: false,
    });
  };

  renderRow = (theme: Theme) => ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: Object;
  }) => {
    const {
      renderItem = ComboBox.defaultProps.renderItem,
      items,
      value,
    } = this.props;

    const item = items[index];

    return (
      <div
        key={key}
        className={cx(getItemClass(theme), {
          [getItemActiveClass(theme)]: equals(item, value),
        })}
        onClick={this.selectItem(item)}
        style={style}
      >
        {renderItem(item)}
      </div>
    );
  };

  renderDropDown(theme: Theme) {
    const {
      visibleItems = ComboBox.defaultProps.visibleItems,
      items,
    } = this.props;
    const { element } = this;

    if (element == null) {
      return null;
    }

    const rect = element.getBoundingClientRect();
    const itemHeight = rect.height;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Base height: show visible items of a height that is same as value line.
    let height = Math.min(items.length, visibleItems) * itemHeight;

    // Open dropdown above combo box when not enough space below and there is
    // more space above combo box than below available.
    const showAbove = spaceBelow < height && spaceAbove > spaceBelow;

    // Clip dropdown height to available height below (or above) combo box.
    height = Math.min(height, showAbove ? spaceAbove : spaceBelow);

    const style = showAbove
      ? {
          top: rect.top - height,
          left: rect.left,
        }
      : {
          top: rect.bottom,
          left: rect.left,
        };

    return (
      <div className={getDropDownClass(theme)} style={style}>
        <List
          className={getListClass(theme)}
          height={height}
          rowCount={items.length}
          rowHeight={itemHeight}
          rowRenderer={this.renderRow(theme)}
          width={rect.width}
        />
      </div>
    );
  }

  render() {
    const {
      renderItem = ComboBox.defaultProps.renderItem,
      visibleItems = ComboBox.defaultProps.visibleItems,
      disabled = ComboBox.defaultProps.disabled,
      items,
      value,
      onChange,
      className,
      ...props
    } = this.props;
    const { isOpen } = this.state;

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div
            className={cx(getComboBoxClass(theme), className)}
            {...props}
            onClick={disabled === false ? this.toggleOpen : undefined}
            ref={element => (this.element = element)}
          >
            <div
              className={cx(getValueClass(theme), {
                [getValueDisabledClass(theme)]: disabled,
              })}
            >
              {value != null ? renderItem(value) : 'Please select …'}
            </div>
            <div className={getValueHandleClass(theme)}>
              <svg viewBox="0 0 16 9">
                <path d="M0,0 L16,0 L8,9 Z" />
              </svg>
            </div>

            {isOpen ? <Portal>{this.renderDropDown(theme)}</Portal> : null}
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
export class _ComboBox<T> extends React.Component<Props<T>> {
  render() {
    return null;
  }
}
