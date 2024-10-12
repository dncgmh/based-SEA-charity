import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { cn, text as dsText, pressable } from '@coinbase/onchainkit/theme';
import type { WalletDropdownDisconnectReact } from '@coinbase/onchainkit/wallet';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function WalletDropdownDisconnect({ className, text = 'Disconnect' }: WalletDropdownDisconnectReact) {
  const { disconnect, connectors } = useDisconnect();
  const { logout } = useAuth();
  const handleDisconnect = useCallback(() => {
    connectors.map((connector) => disconnect({ connector }));
  }, [disconnect, connectors]);
  const handleLogout = () => {
    handleDisconnect();
    logout();
    // window.location.reload();
  };

  return (
    <button
      type="button"
      className={cn(pressable.default, 'relative flex w-full items-center px-4 pt-3 pb-4', className)}
      onClick={handleLogout}
    >
      <div className="absolute left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
        <LogOut size={18} />
      </div>
      <span className={cn(dsText.body, 'pl-6')}>{text}</span>
    </button>
  );
}
