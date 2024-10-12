import { ShieldCheck, DollarSign, Heart } from 'lucide-react';

export default function BlockchainBenefits() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-center font-bold text-4xl">Why Use Blockchain in Charity</h1>

      {/* Flexbox layout to align cards in one line */}
      <div className="flex flex-col justify-center gap-6 md:flex-row">
        {/* Transparency and Accountability */}
        <div className="card w-full bg-base-100 p-5 shadow-lg md:w-1/3">
          <div className="mb-3 flex items-center">
            <ShieldCheck className="mr-2 h-6 w-6 text-blue-500" />
            <h2 className="font-semibold text-2xl">Transparency and Accountability</h2>
          </div>
          <ul className="list-disc space-y-2 pl-6">
            <li>Blockchain provides an immutable and transparent record of all transactions.</li>
            <li>Donors can track their contributions and see exactly how funds are being used.</li>
            <li>Reduces the risk of fraud and mismanagement of funds.</li>
          </ul>
        </div>

        {/* Efficiency and Cost Reduction */}
        <div className="card w-full bg-base-100 p-5 shadow-lg md:w-1/3">
          <div className="mb-3 flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-green-500" />
            <h2 className="font-semibold text-2xl">Efficiency and Cost Reduction</h2>
          </div>
          <ul className="list-disc space-y-2 pl-6">
            <li>Smart contracts can automate many processes, reducing administrative overhead.</li>
            <li>Direct peer-to-peer transactions can cut out intermediaries, lowering costs.</li>
            <li>Faster transfer of funds, especially for international donations.</li>
          </ul>
        </div>

        {/* Increased Trust and Donor Engagement */}
        <div className="card w-full bg-base-100 p-5 shadow-lg md:w-1/3">
          <div className="mb-3 flex items-center">
            <Heart className="mr-2 h-6 w-6 text-red-500" />
            <h2 className="font-semibold text-2xl">Increased Trust and Donor Engagement</h2>
          </div>
          <ul className="list-disc space-y-2 pl-6">
            <li>The transparency offered by blockchain can help build trust with donors.</li>
            <li>Donors can see the direct impact of their contributions in real-time.</li>
            <li>Potential for tokenization allows for new forms of engagement and recognition.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
