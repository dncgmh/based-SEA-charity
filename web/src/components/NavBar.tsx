'use client';

import Image from 'next/image';
import Link from 'next/link';
import LoginButton from 'src/components/LoginButton';
import SignupButton from 'src/components/SignupButton';
import { useAccount } from 'wagmi';

export default function NavBar() {
  const { address } = useAccount();
  return (
    <div className="navbar bg-base-100 p-0">
      <div className="flex-1">
        <Image src="/based-sea-charity.svg" width={40} height={40} alt="based sea charity" />
        <Link href={'/'} className="btn btn-ghost p-1 text-xl">
          Based SEA Charity
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal">
          <li className="my-auto">
            <Link href={'/charity'}>Charity</Link>
          </li>
          <li className="my-auto ml-2">
            <Link href={'/project'}>Project</Link>
          </li>
        </ul>
      </div>
      <div>
        <SignupButton />
        &nbsp;
        {!address && <LoginButton />}
      </div>
    </div>
  );
}
