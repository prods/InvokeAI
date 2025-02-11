import { makeToast } from 'app/components/Toaster';
import { useAppDispatch } from 'app/store/storeHooks';
import IAIButton from 'common/components/IAIButton';
import IAIIconButton from 'common/components/IAIIconButton';
import { addToast } from 'features/system/store/systemSlice';
import { useTranslation } from 'react-i18next';
import { FaSync } from 'react-icons/fa';
import { useSyncModelsMutation } from 'services/api/endpoints/models';

type SyncModelsButtonProps = {
  iconMode?: boolean;
};

export default function SyncModelsButton(props: SyncModelsButtonProps) {
  const { iconMode = false } = props;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [syncModels, { isLoading }] = useSyncModelsMutation();

  const syncModelsHandler = () => {
    syncModels()
      .unwrap()
      .then((_) => {
        dispatch(
          addToast(
            makeToast({
              title: `${t('modelManager.modelsSynced')}`,
              status: 'success',
            })
          )
        );
      })
      .catch((error) => {
        if (error) {
          dispatch(
            addToast(
              makeToast({
                title: `${t('modelManager.modelSyncFailed')}`,
                status: 'error',
              })
            )
          );
        }
      });
  };

  return !iconMode ? (
    <IAIButton
      isLoading={isLoading}
      onClick={syncModelsHandler}
      minW="max-content"
    >
      Sync Models
    </IAIButton>
  ) : (
    <IAIIconButton
      icon={<FaSync />}
      tooltip={t('modelManager.syncModels')}
      aria-label={t('modelManager.syncModels')}
      isLoading={isLoading}
      onClick={syncModelsHandler}
      size="sm"
    />
  );
}
