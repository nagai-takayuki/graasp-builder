import { Stack } from '@mui/material';

import { PermissionLevel } from '@graasp/sdk';
import { ItemRecord } from '@graasp/sdk/frontend';

import { hooks, mutations } from '../../../config/queryClient';
import { ButtonVariants } from '../../../enums';
import { useCurrentUserContext } from '../../context/CurrentUserContext';
import ClearChatButton from './ClearChatButton';
import DownloadChatButton from './DownloadChatButton';

type Props = {
  item: ItemRecord;
};

const AdminChatSettings = ({ item }: Props): JSX.Element | null => {
  const itemId = item.id;
  const { data: itemPermissions, isLoading: isLoadingItemPermissions } =
    hooks.useItemMemberships(item.id);
  const { data: currentMember } = useCurrentUserContext();
  // only show export chat when user has admin right on the item
  const isAdmin = currentMember
    ? itemPermissions?.find((perms) => perms.member.id === currentMember.id)
        ?.permission === PermissionLevel.Admin
    : false;
  const { mutate: clearChatHook } = mutations.useClearItemChat();

  if (!isAdmin || isLoadingItemPermissions) {
    return null;
  }

  return (
    <Stack direction="column" spacing={1}>
      <DownloadChatButton
        variant={ButtonVariants.Button}
        chatId={itemId}
        showInfo
      />
      <ClearChatButton
        variant={ButtonVariants.Button}
        chatId={itemId}
        clearChat={clearChatHook}
      />
    </Stack>
  );
};

export default AdminChatSettings;