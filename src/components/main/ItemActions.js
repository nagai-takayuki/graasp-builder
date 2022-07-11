import PropTypes from 'prop-types';
import React from 'react';
import {
  ITEMS_TABLE_COPY_SELECTED_ITEMS_ID,
  ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID,
  ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID,
} from '../../config/selectors';
import MoveButton from '../common/MoveButton';
import RecycleButton from '../common/RecycleButton';
import CopyButton from './CopyButton';

const ItemActionsRenderer = ({ selectedIds }) => (
  <>
    <MoveButton
      id={ITEMS_TABLE_MOVE_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
    <CopyButton
      id={ITEMS_TABLE_COPY_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
    <RecycleButton
      id={ITEMS_TABLE_RECYCLE_SELECTED_ITEMS_ID}
      color="secondary"
      itemIds={selectedIds}
    />
  </>
);
// };
ItemActionsRenderer.propTypes = {
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default ItemActionsRenderer;