import PropTypes from 'prop-types';
import React from 'react';
import EditButton from '../common/EditButton';
import ItemMenu from '../main/ItemMenu';
import { hooks } from '../../config/queryClient';
import FavoriteButton from '../common/FavoriteButton';
import PinButton from '../common/PinButton';
import { isItemUpdateAllowedForUser } from '../../utils/membership';

const { useCurrentMember, useItemMemberships } = hooks;

const ActionsCellRenderer = ({ data: item }) => {
  const { data: member } = useCurrentMember();

  const { data: memberships } = useItemMemberships(item.id);
  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: member?.get('id'),
  });

  return (
    <>
      {!member.isEmpty() && <FavoriteButton member={member} item={item} />}
      {canEdit && (
        <>
          <EditButton item={item} />
          <PinButton item={item} />
        </>
      )}
      <ItemMenu item={item} member={member} />
    </>
  );
};

ActionsCellRenderer.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default ActionsCellRenderer;