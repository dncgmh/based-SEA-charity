'use client';
import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import { cn, pressable } from '@coinbase/onchainkit/theme';
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownFundLink } from '@coinbase/onchainkit/wallet';
import { HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { navigate } from 'src/app/actions';
import { WalletDropdownDisconnect } from './WalletDisconnect';
import { api } from 'src/lib/api';
import { useAccount, useSignMessage } from 'wagmi';
import { useAuth } from '@/hooks/use-auth';

type WalletWrapperParams = {
  text?: string;
  className?: string;
  withWalletAggregator?: boolean;
};

export default function WalletWrapper({ className, text, withWalletAggregator = false }: WalletWrapperParams) {
  const { isConnected, address } = useAccount();
  const { data: signMessageData, signMessage, variables } = useSignMessage();
  const [isRegisterCharity, setIsRegisterCharity] = useState<boolean>(false);
  const { auth, login } = useAuth();

  useEffect(() => {
    if (isConnected && address) {
      api.charity.getList({ onchainAddress: address }).then((res) => {
        setIsRegisterCharity(res.data.length > 0);
      });
    }
  }, [isConnected, address]);

  useEffect(() => {
    const handleSignMessageEffect = async () => {
      if (variables?.message && signMessageData) {
        try {
          const { accessToken, data: charity } = await api.charity.login({
            onchainAddress: address,
            signature: signMessageData,
            message: variables.message,
          });
          if (accessToken) {
            toast.success('Login successful');
            login(accessToken, charity);
            navigate('/charity/me');
          } else {
            toast.error('Login failed');
          }
        } catch (error) {
          console.error('Login error:', error);
          toast.error('Login failed');
        }
      }
    };

    handleSignMessageEffect();
  }, [signMessageData, variables?.message, address]);

  const handleSign = async (e) => {
    e.preventDefault();
    const message = 'Sign this message to login to your charity account.';
    signMessage({ message });
  };

  const renderCharityButton = () => {
    if (!isConnected) {
      return <></>;
    }
    if (!isRegisterCharity) {
      return (
        <Link href="/charity/register">
          <button
            type="button"
            className={cn(pressable.default, 'relative flex w-full items-center px-4 pt-3 pb-4', className)}
          >
            <div className="absolute left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
              <HeartHandshake size={18} />
            </div>
            <span className={cn('pl-6')}>Register Your Charity</span>
          </button>
        </Link>
      );
    }

    if (isRegisterCharity) {
      if (auth.isAuthenticated) {
        return (
          <Link href="/charity/me">
            <button
              type="button"
              className={cn(pressable.default, 'relative flex w-full items-center px-4 pt-3 pb-4', className)}
            >
              <div className="absolute left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
                <HeartHandshake size={18} />
              </div>
              <span className={cn('pl-6')}>Your Charity</span>
            </button>
          </Link>
        );
      }
      return (
        <button
          type="button"
          className={cn(pressable.default, 'relative flex w-full items-center px-4 pt-3 pb-4', className)}
          onClick={handleSign}
        >
          <div className="absolute left-4 flex h-[1.125rem] w-[1.125rem] items-center justify-center">
            <HeartHandshake size={18} />
          </div>
          <span className={cn('pl-6')}>Login Your Charity</span>
        </button>
      );
    }

    return null;
  };

  return (
    <Wallet>
      <ConnectWallet withWalletAggregator={withWalletAggregator} text={text} className={className}>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true}>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        {renderCharityButton()}
        <WalletDropdownFundLink />
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}
