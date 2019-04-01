import { reduce, reduced, sort, sum } from 'ramda';
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import {
  AutoSizer,
  Grid,
  ScrollSync,
  SortDirection,
  SortDirectionType,
} from 'react-virtualized';
// import 'react-virtualized/styles.css';
import { css, cx } from 'emotion';

import ResizeObserver from './ResizeObserver';
import Header from './Header';
import { Theme, ThemeContext } from './ThemeContext';
import * as colors from './colors';

function getGridClass(theme: Theme) {
  return css`
    outline: 0;

    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background: transparent;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${colors.OMF_Scrollbar_Thumb_light};
      background-clip: content-box;
      border-radius: 2px;
      border: 3px solid transparent;
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
}

function getHeaderGridClass(theme: Theme) {
  return css`
    outline: 0;
    /* react-virtualized sets this as a style attribute so for this to override
      default behavior we need !important */
    overflow: hidden !important;
  `;
}

function getDataTableClass(theme: Theme) {
  return css`
    position: relative;
    display: flex;
    flex-flow: column nowrap;

    width: 100%;
    height: 100%;

    user-select: none;
  `;
}

function getTableContainerClass(theme: Theme) {
  return css`
    flex: 1;
  `;
}

function getHeaderRowClass(theme: Theme) {
  return css`
    position: relative;
    z-index: 1;
    overflow: visible !important;
    box-sizing: border-box;
  `;
}

function getHeaderCellClass(theme: Theme) {
  return css`
    position: relative;
    box-sizing: border-box;
    height: 45px;
    margin: 0 0 0 3px;
    padding: 0 10px;

    background: linear-gradient(to bottom, #e7e9ee, #dce2ed);
    border-bottom: 1px solid #597897;

    &:after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;

      content: '';
      height: 0;

      background: ${colors.OMF_Blue_06};
      transition: height 150ms ease-out;
    }
  `;
}

function getHeaderCellFirstClass(theme: Theme) {
  return css`
    margin-left: 0;
  `;
}

function getHeaderCellSortedClass(theme: Theme) {
  return css`
    &:after {
      height: 5px;
    }
  `;
}

function getHeaderSortIndicatorClass(theme: Theme) {
  return css`
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;

    height: 6px;
    margin-left: -5px;

    transform: translateY(100%);

    fill: #fff;
    opacity: 0;
    transition: transform 150ms ease-out, opacity 150ms ease-out;
  `;
}

function getHeaderSortIndicatorSortedClass(theme: Theme) {
  return css`
    transform: translateY(1px);
    opacity: 1;
  `;
}

function getHeaderSortIndicatorAscendingClass(theme: Theme) {
  return css`
    transform: translateY(1px) rotateZ(180deg);
  `;
}

function getDataRowOddClass(theme: Theme) {
  return css`
    box-sizing: border-box;
    background: ${colors.OMF_Table_Row_Odd};
  `;
}

function getDataRowEvenClass(theme: Theme) {
  return css`
    box-sizing: border-box;
    background: ${colors.OMF_Table_Row_Even};
  `;
}

function getDataCellClass(theme: Theme) {
  return css`
    box-sizing: border-box;
    height: 37px;
    margin: 3px 0 0 3px;
    padding: 0 10px;

    line-height: 37px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
}

function getDataCellFirstClass(theme: Theme) {
  return css`
    margin-left: 0;
  `;
}

function getHeaderCellSelectedClass(theme: Theme) {
  return css`
    background: ${colors.OMF_Table_Row_Selected};
  `;
}

function getDataCellSelectedClass(theme: Theme) {
  return css`
    background: ${colors.OMF_Table_Row_Selected};
  `;
}

function getResizeIndicatorClass(theme: Theme) {
  return css`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${colors.OMF_Dialog_Background};
  `;
}

function getRowClassName({ index }: { index: number }, theme: Theme): string {
  if (index === -1) return getHeaderRowClass(theme);
  return index % 2 === 0
    ? getDataRowEvenClass(theme)
    : getDataRowOddClass(theme);
}

function sortRows<Row>(
  rows: Array<Row>,
  sortBy: string,
  sortDirection: string,
): Array<Row> {
  if (sortBy) {
    const flip = sortDirection === SortDirection.DESC ? -1 : 1;

    return sort((a: any, b: any) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === bValue) return 0;
      return flip * (aValue > bValue ? 1 : -1);
    }, rows);
  }

  return rows;
}

interface Column<Row> {
  /** Label to be displayed in the column header */
  label: string;
  /** Optional class name applied to the cells */
  className?: string;
  /** Key within each the column should display */
  dataKey: keyof Row & string;
  /** Column width */
  width: number;
  /** Optional custom cell render function; receives the row value at `dataKey`
   * as `options.cellData` and needs to return a valid ReactNode. By default the
   * cell value will be displayed as-is. */
  cellRenderer?: (options: { cellData: Row[keyof Row] }) => React.ReactNode;

  [key: string]: any;
}

interface Props<Row> {
  /** List of column definitions to display */
  columns: Array<Column<Row>>;
  /** List of rows in the table */
  rows: Array<Row>;
  /**
   * Optional callback to provide resizing behavior
   * If set, each column will receive a draggable handle. The component user
   * needs to perform column resize calculations and update the `columns` prop
   * accordingly.
   */
  onResizeColumn?: (dataKey: string, width: number) => void;

  [prop: string]: any;
}

interface State {
  scrollbarOffset: number;
  headerMenu: undefined | string;
  sortBy: string;
  sortDirection: string;
  resized:
  | undefined
  | {
    dataKey: string;
    originalWidth: number;
    width: number;
  };
}

export default class DataTable<Row extends {}> extends React.PureComponent<
  Props<Row>,
  State
  > {
  headerGrid: null | Grid = null;
  dataGrid:
    | null
    | (React.Component<any> & { recomputeGridSize: () => void }) = null;

  constructor(props: Props<Row>) {
    super(props);
    this.state = {
      scrollbarOffset: 0,
      headerMenu: undefined,
      resized: undefined,
      sortBy: props.columns[0].dataKey,
      sortDirection: SortDirection.DESC,
    } as State;
  }

  handleMenu = (dataKey: string, event: React.MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState({
      headerMenu: dataKey,
    });
  };

  handleBlurMenu = (dataKey: string) => {
    if (dataKey === this.state.headerMenu) {
      this.setState({
        headerMenu: undefined,
      });
    }
  };

  handleSort = (dataKey: string) => {
    const { sortBy: lastSortBy, sortDirection: lastSortDirection } = this.state;

    let sortDirection: SortDirectionType = SortDirection.DESC;
    if (lastSortBy === dataKey && lastSortDirection === sortDirection) {
      sortDirection = SortDirection.ASC;
    }

    this.setState({
      sortBy: dataKey,
      sortDirection,
    });
  };

  handleResize = () => {
    if (this.headerGrid) this.headerGrid.recomputeGridSize();
    if (this.dataGrid) this.dataGrid.recomputeGridSize();
  };

  updateScrollbarOffset = () => {
    if (this.dataGrid != null) {
      // @ts-ignore
      const element = findDOMNode(this.dataGrid);
      if (element instanceof HTMLElement) {
        this.setState({
          scrollbarOffset: element.offsetWidth - element.clientWidth,
        });
        return;
      }
    }

    this.setState({ scrollbarOffset: 0 });
  };

  renderHeader = (theme: Theme) => ({
    key,
    columnIndex,
    style,
  }: {
    key: string;
    columnIndex: number;
    style: {};
  }) => {
    const { sortDirection, sortBy } = this.state;
    const column = this.props.columns[columnIndex];

    if (column == null) {
      return (
        <div style={style} key={key}>
          <Header
            className={getHeaderCellClass(theme)}
            sortDirection={undefined}
            onClick={() => { }}
            onContextMenu={() => { }}
            onResize={() => { }}
            onResizeComplete={() => { }}
          />
        </div>
      );
    }

    const dataKey = column.dataKey;
    const label = column.label;

    const sorted = sortBy === dataKey ? sortDirection : undefined;

    return (
      <div style={style} key={key}>
        <Header
          className={cx(getHeaderCellClass(theme), {
            [getHeaderCellFirstClass(theme)]: columnIndex === 0,
            [getHeaderCellSortedClass(theme)]: sorted != null,
            [getHeaderCellSelectedClass(theme)]:
              this.state.headerMenu === dataKey,
          })}
          sortDirection={sortBy === dataKey ? sortDirection : undefined}
          onClick={() => this.handleSort(dataKey)}
          onResize={
            this.props.onResizeColumn
              ? delta => {
                const originalWidth =
                  this.state.resized != null
                    ? this.state.resized.originalWidth
                    : column.width;

                this.setState({
                  resized: {
                    dataKey,
                    originalWidth,
                    width: Math.max(60, originalWidth + delta),
                  },
                });
              }
              : undefined
          }
          onResizeComplete={() => {
            if (this.props.onResizeColumn && this.state.resized != null) {
              const { width, dataKey } = this.state.resized;
              this.props.onResizeColumn(dataKey, width);
              this.setState({
                resized: undefined,
              });
              if (this.headerGrid != null) this.headerGrid.recomputeGridSize();
              if (this.dataGrid != null) this.dataGrid.recomputeGridSize();
            }
          }}
        >
          {label}
          <svg
            viewBox="0 0 10 5"
            className={cx(getHeaderSortIndicatorClass(theme), {
              [getHeaderSortIndicatorSortedClass(theme)]: sorted != null,
              [getHeaderSortIndicatorAscendingClass(theme)]:
                sorted != null && sortDirection === SortDirection.ASC,
            })}
          >
            <path d="M0,0 L10,0 L5,5Z" />
          </svg>
        </Header>
      </div>
    );
  };

  render() {
    const { sortBy, sortDirection, resized, scrollbarOffset } = this.state;
    const { rows, columns, ...extraProps } = this.props;

    const sortedRows = sortRows(rows, sortBy, sortDirection);

    const resizerOffset =
      resized != null
        ? reduce(
          (offset, column) => {
            if (column.dataKey === resized.dataKey) return reduced(offset);
            return offset + column.width;
          },
          0,
          columns,
        )
        : 0;

    const cellRenderer = (columnIndex: number, rowIndex: number) => {
      const column = columns[columnIndex];
      const cellData = sortedRows[rowIndex][column.dataKey];

      if (
        column.cellRenderer != null &&
        typeof column.cellRenderer === 'function'
      ) {
        return column.cellRenderer({ cellData });
      }
      return String(cellData);
    };

    return (
      <ThemeContext.Consumer>
        {theme => (
          <div className={getDataTableClass(theme)}>
            <div className={getTableContainerClass(theme)}>
              <ResizeObserver onResize={this.handleResize}>
                <AutoSizer>
                  {size => (
                    <ScrollSync>
                      {({ onScroll, scrollLeft }) => {
                        const headerHeight = 45;
                        const rowHeight = 40;

                        const fillColumnWidth = Math.max(
                          0,
                          size.width -
                          sum(columns.map(column => column.width)) -
                          scrollbarOffset,
                        );
                        const fillColumnCount = fillColumnWidth > 0 ? 1 : 0;

                        return (
                          <div>
                            <div>
                              <Grid
                                className={getHeaderGridClass(theme)}
                                ref={ref => (this.headerGrid = ref)}
                                width={size.width - scrollbarOffset}
                                height={headerHeight}
                                columnCount={columns.length + fillColumnCount}
                                columnWidth={({ index }) => {
                                  const column = columns[index];
                                  if (column == null) return fillColumnWidth;
                                  return column.width;
                                }}
                                rowCount={1}
                                rowHeight={45}
                                scrollLeft={scrollLeft}
                                style={{ overflow: 'hidden' }}
                                cellRenderer={this.renderHeader(theme)}
                              />
                            </div>
                            <Grid
                              className={getGridClass(theme)}
                              ref={ref => {
                                this.dataGrid = ref;
                                this.updateScrollbarOffset();
                              }}
                              onScrollbarPresenceChange={() => {
                                this.updateScrollbarOffset();
                              }}
                              width={size.width}
                              height={size.height - headerHeight}
                              columnCount={columns.length + fillColumnCount}
                              columnWidth={({ index }) => {
                                const column = columns[index];
                                if (column == null) return fillColumnWidth;
                                return column.width;
                              }}
                              rowCount={Math.max(1, sortedRows.length)}
                              rowHeight={rowHeight}
                              onScroll={onScroll}
                              cellRenderer={({
                                columnIndex,
                                rowIndex,
                                style,
                                key,
                              }) => {
                                const column = columns[columnIndex];

                                // Return an empty spacer if there are no rows
                                // available at this index
                                if (rowIndex >= sortedRows.length) {
                                  return <div style={style} key={key} />;
                                }

                                // Render an empty fill column if required
                                if (column == null) {
                                  return (
                                    <div style={style} key={key}>
                                      <div
                                        className={cx(
                                          getDataCellClass(theme),
                                          getRowClassName(
                                            { index: rowIndex },
                                            theme,
                                          ),
                                        )}
                                      />
                                    </div>
                                  );
                                }

                                return (
                                  <div style={style} key={key}>
                                    <div
                                      className={cx(
                                        getDataCellClass(theme),
                                        getRowClassName(
                                          { index: rowIndex },
                                          theme,
                                        ),
                                        column.className,
                                        {
                                          [getDataCellFirstClass(theme)]:
                                            columnIndex === 0,
                                          [getDataCellSelectedClass(theme)]:
                                            this.state.headerMenu ===
                                            column.dataKey,
                                        },
                                      )}
                                    >
                                      {cellRenderer(columnIndex, rowIndex)}
                                    </div>
                                  </div>
                                );
                              }}
                              {...extraProps}
                            />
                            {resized ? (
                              <div
                                className={getResizeIndicatorClass(theme)}
                                style={{
                                  left:
                                    resizerOffset + resized.width - scrollLeft,
                                }}
                              />
                            ) : null}
                          </div>
                        );
                      }}
                    </ScrollSync>
                  )}
                </AutoSizer>
              </ResizeObserver>
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
export class _Column extends React.Component<Column<any>> {
  render() {
    return null;
  }
}
