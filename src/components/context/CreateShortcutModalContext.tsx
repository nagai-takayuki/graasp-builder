import { createContext, useMemo, useState } from 'react';

import {
  DiscriminatedItem,
  Item,
  ItemType,
  ShortcutItemType,
} from '@graasp/sdk';

import { useBuilderTranslation } from '../../config/i18n';
import { mutations } from '../../config/queryClient';
import { HOME_MODAL_ITEM_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { buildShortcutExtra } from '../../utils/itemExtra';
import TreeModal, { TreeModalProps } from '../main/TreeModal';

const CreateShortcutModalContext = createContext({
  openModal: (_newItem: Item) => {
    // do nothing
  },
});

type Props = {
  children: JSX.Element | JSX.Element[];
};

const CreateShortcutModalProvider = ({ children }: Props): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  const { mutate: createShortcut } = mutations.usePostItem();
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<Item | null>(null);

  const openModal = (newItem: Item) => {
    setOpen(true);
    setItem(newItem);
  };

  const onClose = () => {
    setOpen(false);
    setItem(null);
  };

  const onConfirm: TreeModalProps['onConfirm'] = ({ ids: [target], to }) => {
    const shortcut: Partial<ShortcutItemType> &
      Pick<DiscriminatedItem, 'name' | 'type'> & {
        parentId?: string;
      } = {
      name: translateBuilder(BUILDER.CREATE_SHORTCUT_DEFAULT_NAME, {
        name: item?.name,
      }),
      extra: buildShortcutExtra(target),
      type: ItemType.SHORTCUT,
      // set parent id if not root
      parentId: to !== HOME_MODAL_ITEM_ID ? to : undefined,
    };
    createShortcut(shortcut);

    onClose();
  };

  const renderModal = () => {
    if (!item) {
      return null;
    }

    return (
      <TreeModal
        onClose={onClose}
        open={open}
        itemIds={[item.id]}
        onConfirm={onConfirm}
        title={translateBuilder(BUILDER.CREATE_SHORTCUT_MODAL_TITLE)}
      />
    );
  };

  const value = useMemo(() => ({ openModal }), []);

  return (
    <CreateShortcutModalContext.Provider value={value}>
      {renderModal()}
      {children}
    </CreateShortcutModalContext.Provider>
  );
};

export { CreateShortcutModalProvider, CreateShortcutModalContext };
