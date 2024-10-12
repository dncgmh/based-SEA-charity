import { atom } from 'jotai';

type AuthState = {
  isAuthenticated: boolean;
  charity?: null | Record<string, any>;
  charityId?: null | string;
  accessToken: string | null;
};

const authAtom = atom<AuthState>({
  isAuthenticated: false,
  charity: null,
  charityId: null,
  accessToken: null,
});

export default authAtom;
