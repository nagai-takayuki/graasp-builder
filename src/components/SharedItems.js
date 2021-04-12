import React from 'react';
import { List } from 'immutable';
import { useTranslation } from 'react-i18next';
import { SHARED_ITEMS_ID } from '../config/selectors';
import ItemHeader from './item/header/ItemHeader';
import Items from './main/Items';
import { useSharedItems } from '../hooks';
import Loader from './common/Loader';

const SharedItems = () => {
  const { t } = useTranslation();
  const { data: sharedItems, isLoading, isError, error } = useSharedItems();

  if (isError) {
    return error;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <ItemHeader />
      <Items
        id={SHARED_ITEMS_ID}
        title={t('Items Shared With Me')}
        items={List(sharedItems)}
      />
    </>
  );
};

export default SharedItems;
