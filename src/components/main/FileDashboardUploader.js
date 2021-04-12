import React, { useEffect, useState } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { Dashboard } from '@uppy/react';
import { useRouteMatch } from 'react-router';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { FILE_UPLOAD_MAX_FILES, UPLOAD_METHOD } from '../../config/constants';
import configureUppy from '../../utils/uppy';
import { DASHBOARD_UPLOADER_ID } from '../../config/selectors';
import { buildItemPath } from '../../config/paths';
import { FILE_UPLOAD_MUTATION_KEY } from '../../config/keys';

const FileDashboardUploader = () => {
  const [uppy, setUppy] = useState(null);
  const match = useRouteMatch(buildItemPath());
  const itemId = match?.params?.itemId;
  const { t } = useTranslation();
  const { mutate: onFileUploadComplete } = useMutation(
    FILE_UPLOAD_MUTATION_KEY,
  );

  const onComplete = (result) => {
    // update app on complete
    // todo: improve with websockets or by receiving corresponding items
    if (!result?.failed.length) {
      onFileUploadComplete(itemId);
    }

    return false;
  };

  const applyUppy = () =>
    setUppy(
      configureUppy({
        itemId,
        onComplete,
        method: UPLOAD_METHOD,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  if (!uppy) {
    return null;
  }

  return (
    <div id={DASHBOARD_UPLOADER_ID}>
      <Dashboard
        uppy={uppy}
        height={200}
        proudlyDisplayPoweredByUppy={false}
        note={t(`You can upload up to FILE_UPLOAD_MAX_FILES files at a time`, {
          maxFiles: FILE_UPLOAD_MAX_FILES,
        })}
        locale={{
          strings: {
            // Text to show on the droppable area.
            // `%{browse}` is replaced with a link that opens the system file selection dialog.
            dropPaste: `${t('Drop here or')} %{browse}`,
            // Used as the label for the link that opens the system file selection dialog.
            browse: t('Browse'),
          },
        }}
      />
    </div>
  );
};

export default FileDashboardUploader;
