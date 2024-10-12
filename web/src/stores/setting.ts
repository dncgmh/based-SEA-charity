import { atom } from 'jotai';

type SettingState = {
  etherPrice: number;
  lastUpdated: number;
};

const settingAtom = atom<SettingState>({
  etherPrice: 0,
  lastUpdated: 0,
});

export default settingAtom;
