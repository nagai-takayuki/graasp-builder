import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import { useTranslation } from 'react-i18next';
import truncate from 'lodash.truncate';
import MenuItem from '@material-ui/core/MenuItem';
import { useCurrentMember } from '../../hooks';
import {
  AUTHENTICATION_HOST,
  USERNAME_MAX_LENGTH,
} from '../../config/constants';
import { buildSignInPath } from '../../api/routes';
import {
  HEADER_USER_ID,
  USER_MENU_SIGN_OUT_OPTION_ID,
} from '../../config/selectors';
import Loader from './Loader';
import { SIGN_OUT_MUTATION_KEY } from '../../config/keys';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  username: {
    margin: theme.spacing(0, 2),
    maxWidth: 100,
  },
}));

function SettingsHeader() {
  const { data: user, isLoading, isError } = useCurrentMember();
  const classes = useStyles();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const { mutate: signOut } = useMutation(SIGN_OUT_MUTATION_KEY);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  const renderMenu = () => {
    if (user.isEmpty()) {
      return (
        <MenuItem
          component="a"
          href={`${AUTHENTICATION_HOST}/${buildSignInPath()}`}
        >
          {t('Sign In')}
        </MenuItem>
      );
    }

    return (
      <MenuItem onClick={handleSignOut} id={USER_MENU_SIGN_OUT_OPTION_ID}>
        {t('Sign Out')}
      </MenuItem>
    );
  };

  if (isLoading || !user) {
    return <Loader />;
  }

  if (isError) {
    return 'error';
  }

  const username = user.get('name');
  // todo: necessary broken image to display a letter
  const avatarImage = 'a missing avatar';

  return (
    <>
      <Box
        className={classes.wrapper}
        onClick={handleClick}
        id={HEADER_USER_ID}
      >
        <Tooltip title={username ?? t('You are not signed in.')}>
          <Avatar className={classes.avatar} alt={username} src={avatarImage} />
        </Tooltip>
        {username && (
          <Typography variant="subtitle1" className={classes.username}>
            {truncate(username, { length: USERNAME_MAX_LENGTH })}
          </Typography>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {renderMenu()}
      </Menu>
    </>
  );
}

export default SettingsHeader;
