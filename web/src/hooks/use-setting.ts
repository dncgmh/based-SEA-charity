import { api } from '@/lib/api';
import settingAtom from '@/stores/setting';
import { useAtom } from 'jotai';
import { useState, useEffect, useCallback, useRef } from 'react';

// Global variable to track the last update time
let lastUpdateTime = 0;
// Global promise to handle concurrent requests
let updatePromise = null;

export function useSetting() {
  const [globalSetting, setGlobalSetting] = useAtom(settingAtom);
  const [localSetting, setLocalSetting] = useState(globalSetting);
  const isMounted = useRef(true);

  const refreshSetting = useCallback(async () => {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime < 60000 && updatePromise) {
      const result = await updatePromise;
      setLocalSetting(result);
      return result;
    }

    if (!updatePromise) {
      updatePromise = api.setting
        .get()
        .then(({ data: settingData }) => {
          lastUpdateTime = currentTime;
          const newSetting = { ...settingData, lastUpdated: currentTime };
          if (isMounted.current) {
            setGlobalSetting(newSetting);
            setLocalSetting(newSetting);
          }
          updatePromise = null;
          return newSetting;
        })
        .catch((error) => {
          console.error('Failed to fetch settings:', error);
          updatePromise = null;
          throw error;
        });
    }

    const result = await updatePromise;
    setLocalSetting(result);
    return result;
  }, [setGlobalSetting]);

  useEffect(() => {
    refreshSetting();
    return () => {
      isMounted.current = false;
    };
  }, [refreshSetting]);

  return { setting: localSetting, refreshSetting };
}
