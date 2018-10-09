import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TableBody from "@material-ui/core/TableBody";
import MUIDataTableBodyCell from "./MUIDataTableBodyCell";
import MUIDataTableBodyRow from "./MUIDataTableBodyRow";
import MUIDataTableSelectCell from "./MUIDataTableSelectCell";
import { withStyles } from "@material-ui/core/styles";

const defaultBodyStyles = {
  root: {},
  emptyTitle: {
    textAlign: "center",
  },
};

class MUIDataTableBody extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Total number of data rows */
    count: PropTypes.number.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Data used to filter table against */
    filterList: PropTypes.array,
    /** Table rows selected */
    selectedRows: PropTypes.object,
    /** Callback to trigger table row select */
    selectRowUpdate: PropTypes.func,
    /** Data used to search table against */
    searchText: PropTypes.string,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  buildRows(attr = "data") {
    const { data, page, rowsPerPage, count } = this.props;

    let rows = [];
    const totalPages = Math.floor(count / rowsPerPage);
    const fromIndex = page === 0 ? 0 : page * rowsPerPage;
    const toIndex = Math.min(count, (page + 1) * rowsPerPage);

    if (page > totalPages && totalPages !== 0) {
      throw new Error(
        "Provided options.page of `" +
          page +
          "` is greater than the total available page length of `" +
          totalPages +
          "`",
      );
    }

    for (let rowIndex = fromIndex; rowIndex < count && rowIndex < toIndex; rowIndex++) {
      if (this.props[attr][rowIndex] !== undefined) rows.push(this.props[attr][rowIndex]);
    }

    return rows.length ? rows : null;
  }

  getRowIndex(index) {
    const { page, rowsPerPage } = this.props;
    const startIndex = page === 0 ? 0 : page * rowsPerPage;

    return startIndex + index;
  }

  isRowSelected(index) {
    const { selectedRows } = this.props;
    return selectedRows.lookup && selectedRows.lookup[index] ? true : false;
  }

  handleRowSelect = data => {
    this.props.selectRowUpdate("cell", data);
  };

  render() {
    const { classes, columns, options, totals } = this.props;
    const tableRows = this.buildRows();
    const originalRows = this.buildRows("tableData");

    return (
      <TableBody>
        {tableRows ? (
          <React.Fragment>
            {tableRows.map(({ data: row, dataIndex }, rowIndex) => (
              <MUIDataTableBodyRow
                options={options}
                rowSelected={options.selectableRows ? this.isRowSelected(rowIndex) : false}
                row={originalRows[rowIndex]}
                key={rowIndex}>
                {options.selectableRows ? (
                  <MUIDataTableSelectCell
                    radio={options.radio}
                    onChange={this.handleRowSelect.bind(null, {
                      index: this.getRowIndex(rowIndex),
                      dataIndex: dataIndex,
                    })}
                    checked={this.isRowSelected(this.getRowIndex(rowIndex))}
                  />
                ) : (
                  false
                )}
                {row.map(
                  (column, index) =>
                    columns[index].display ? (
                      <MUIDataTableBodyCell
                        rowIndex={rowIndex}
                        colIndex={index}
                        columnHeader={columns[index].name}
                        options={options}
                        key={index}>
                        {column}
                      </MUIDataTableBodyCell>
                    ) : (
                      false
                    ),
                )}
              </MUIDataTableBodyRow>
            ))}
            {totals && (
              <MUIDataTableBodyRow options={options} totalled>
                {totals.map((column, index) => (
                  <MUIDataTableBodyCell
                    rowIndex={tableRows.length}
                    colIndex={index}
                    columnHeader={"Total"}
                    options={options}
                    key={index}>
                    {column}
                  </MUIDataTableBodyCell>
                ))}
              </MUIDataTableBodyRow>
            )}
          </React.Fragment>
        ) : (
          <MUIDataTableBodyRow options={options}>
            <MUIDataTableBodyCell
              colSpan={options.selectableRows ? columns.length + 1 : columns.length}
              options={options}
              colIndex={0}
              rowIndex={0}>
              <Typography variant="subtitle1" className={classes.emptyTitle}>
                {options.textLabels.body.noMatch}
              </Typography>
            </MUIDataTableBodyCell>
          </MUIDataTableBodyRow>
        )}
      </TableBody>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: "MUIDataTableBody" })(MUIDataTableBody);
