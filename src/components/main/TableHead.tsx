import Checkbox from '@mui/material/Checkbox';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';

import { FC } from 'react';

import { BUILDER } from '@graasp/translations';

import { useBuilderTranslation } from '../../config/i18n';
import { Ordering } from '../../enums';

type Props = {
  classes: {
    visuallyHidden: string;
  };
  numSelected: number;
  onRequestSort: (event: Event, property: string) => void;
  onSelectAllClick: () => void;
  order: 'asc' | 'desc';
  orderBy: string;
  rowCount: number;
  headCells: (TableCellProps & { id: string; label: string })[];
};

const CustomTableHead: FC<Props> = (props) => {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
  } = props;
  const { t: translateBuilder } = useBuilderTranslation();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': translateBuilder(BUILDER.TABLE_SELECT_ALL_LABEL),
            }}
            color="primary"
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : null}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === Ordering.DESC
                    ? translateBuilder(BUILDER.TABLE_DESC_SORT_LABEL)
                    : translateBuilder(BUILDER.TABLE_ASC_SORT_LABEL)}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHead;