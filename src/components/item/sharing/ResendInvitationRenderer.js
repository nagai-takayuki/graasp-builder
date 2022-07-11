import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@graasp/ui';
import { useTranslation } from 'react-i18next';
import { MUTATION_KEYS } from '@graasp/query-client';
import { useMutation } from '../../../config/queryClient';
import { PERMISSION_LEVELS } from '../../../enums';

const ResendInvitationRenderer = (item) => {
  const { t } = useTranslation();
  const itemId = item.get('id');
  const { mutate: resendInvitation } = useMutation(
    MUTATION_KEYS.RESEND_INVITATION,
  );

  const ChildComponent = ({ data: invitation }) => {
    const [clicked, setClicked] = useState(false);

    const resendEmail = () => {
      setClicked(true);
      resendInvitation({ itemId, id: invitation.id });
    };

    return (
      <Button variant="outlined" onClick={resendEmail} disabled={clicked}>
        {t('Resend Invitation')}
      </Button>
    );
  };

  ChildComponent.propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      itemPath: PropTypes.string.isRequired,
      permission: PropTypes.oneOf(Object.values(PERMISSION_LEVELS)).isRequired,
      email: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  };
  return ChildComponent;
};

export default ResendInvitationRenderer;