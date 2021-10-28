import React, { useContext, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Loader } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import { Divider, makeStyles } from '@material-ui/core';
import ItemMembershipsTable from './ItemMembershipsTable';
import SharingLink from './SharingLink';
import VisibilitySelect from './VisibilitySelect';
import CreateItemMembershipForm from './CreateItemMembershipForm';
import { hooks } from '../../../config/queryClient';
import {
  membershipsWithoutUser,
  isItemUpdateAllowedForUser,
} from '../../../utils/membership';
import { PSEUDONIMIZED_USER_MAIL } from '../../../config/constants';
import { getItemLoginSchema } from '../../../utils/itemExtra';
import { LayoutContext } from '../../context/LayoutContext';

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 0,
    padding: 0,
  },
  wrapper: {
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
}));

const ItemSharingTab = ({ item }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const id = item.get('id');
  const {
    data: memberships,
    isLoading: isMembershipsLoading,
  } = hooks.useItemMemberships(id);
  const {
    data: currentMember,
    isLoadingCurrentMember,
  } = hooks.useCurrentMember();
  const canEdit = isItemUpdateAllowedForUser({
    memberships,
    memberId: currentMember?.get('id'),
  });
  const { data: members } = hooks.useMembers(
    memberships?.map(({ memberId }) => memberId),
  );
  const { setIsItemSharingOpen } = useContext(LayoutContext);

  useEffect(
    () => () => {
      setIsItemSharingOpen(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (isMembershipsLoading || isLoadingCurrentMember) {
    return <Loader />;
  }

  const renderMembershipSettings = () => {
    // do not display settings if cannot access memberships
    if (!memberships || !canEdit) {
      return null;
    }

    const membershipsWithoutSelf = membershipsWithoutUser(
      memberships,
      currentMember.get('id'),
    );

    const authorizedMemberships = membershipsWithoutSelf.filter(
      ({ memberId }) => {
        const member = members?.find(({ id: mId }) => mId === memberId);
        return !member?.email?.includes(PSEUDONIMIZED_USER_MAIL);
      },
    );

    const authenticatedMemberships = membershipsWithoutSelf.filter(
      ({ memberId }) => {
        const member = members?.find(({ id: mId }) => mId === memberId);
        return member?.email?.includes(PSEUDONIMIZED_USER_MAIL);
      },
    );

    return (
      <>
        <Divider className={classes.divider} />

        <Typography variant="h5" className={classes.title}>
          {t('Authorized Members')}
        </Typography>
        {canEdit && <CreateItemMembershipForm id={item.get('id')} />}
        <ItemMembershipsTable
          id={item.get('id')}
          emptyMessage={t('No user has access to this item.')}
          memberships={authorizedMemberships}
        />

        {/* show authenticated members if login schema is defined
        todo: show only if item is pseudomized
        */}
        {getItemLoginSchema(item?.get('extra')) && (
          <>
            <Divider className={classes.divider} />
            <Typography variant="h5" className={classes.title}>
              {t('Authenticated Members')}
            </Typography>
            <ItemMembershipsTable
              id={item.get('id')}
              memberships={authenticatedMemberships}
              emptyMessage={t('No user has authenticated to this item yet.')}
            />
          </>
        )}
      </>
    );
  };

  return (
    <Container disableGutters className={classes.wrapper}>
      <Typography variant="h4" className={classes.title}>
        {t('Sharing')}
      </Typography>

      <SharingLink itemId={item.get('id')} />

      <VisibilitySelect item={item} edit={canEdit} />

      {renderMembershipSettings()}
    </Container>
  );
};
ItemSharingTab.propTypes = {
  item: PropTypes.instanceOf(Map).isRequired,
};
export default ItemSharingTab;