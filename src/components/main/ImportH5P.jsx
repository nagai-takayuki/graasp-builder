import '@uppy/dashboard/dist/style.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';

import { routines } from '@graasp/query-client';
import { MAX_ZIP_FILE_SIZE } from '@graasp/sdk';

import { Dashboard } from '@uppy/react';

import { useBuilderTranslation } from '../../config/i18n';
import notifier from '../../config/notifier';
import { H5P_DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { BUILDER } from '../../langs/constants';
import { configureH5PImportUppy, humanFileSize } from '../../utils/uppy';

const ImportH5P = () => {
  const [uppy, setUppy] = useState(null);
  const { itemId } = useParams();

  const { t: translateBuilder } = useBuilderTranslation();

  const onComplete = (result) => {
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      notifier({ type: routines.importH5PRoutine.SUCCESS });
    }
  };
  const onError = (error) => {
    notifier({ type: routines.importH5PRoutine.FAILURE, payload: { error } });
  };

  const onUpload = () => {
    notifier({ type: routines.importH5PRoutine.REQUEST });
  };

  const applyUppy = () =>
    setUppy(
      configureH5PImportUppy({
        itemId,
        onComplete,
        onError,
        onUpload,
      }),
    );

  useEffect(() => {
    applyUppy();

    return () => {
      uppy?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyUppy();
    // update uppy configuration each time itemId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!uppy) {
    return null;
  }

  return (
    <Box overflow="auto">
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_INFORMATIONS)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_WARNING)}
      </Typography>
      <Typography variant="body" paragraph>
        {translateBuilder(BUILDER.IMPORT_H5P_LIMITATIONS_TEXT, {
          maxSize: humanFileSize(MAX_ZIP_FILE_SIZE),
        })}
      </Typography>
      <div id={H5P_DASHBOARD_UPLOADER_ID}>
        <Dashboard
          uppy={uppy}
          height={200}
          width="100%"
          proudlyDisplayPoweredByUppy={false}
        />
      </div>
    </Box>
  );
};

export default ImportH5P;
