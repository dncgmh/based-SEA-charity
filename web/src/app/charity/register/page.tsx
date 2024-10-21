'use client';

import { PlusCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useAccount, useSignMessage } from 'wagmi';
import { useAuth } from '@/hooks/use-auth';
import { navigate } from '@/app/actions';
import { getName } from '@coinbase/onchainkit/identity';
import { base } from 'wagmi/chains';

const linkTypes = ['website', 'facebook', 'instagram', 'tiktok', 'youtube'];

export default function CharityRegisterPage() {
  const { address } = useAccount();
  const [basename, setBasename] = useState('');
  const { data: signMessageData, signMessage, variables } = useSignMessage();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    onchainAddress: '',
    description: '',
    phoneNumber: '',
    email: '',
    type: '',
    logo: null,
    links: [{ type: '', url: '' }],
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      getName({ address: address, chain: base }).then((basename) => setBasename(basename));
      setFormData((prevData) => ({
        ...prevData,
        onchainAddress: address,
      }));
    }
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      logo: e.target.files[0],
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const addLink = () => {
    setFormData((prevData) => ({
      ...prevData,
      links: [...prevData.links, { type: '', url: '' }],
    }));
  };

  const removeLink = (index) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      links: newLinks,
    }));
  };

  const handleSign = async (e) => {
    e.preventDefault();
    const message = `I authorize the registration of charity: ${formData.name}`;
    setFormData((prevData) => ({
      ...prevData,
      message,
    }));
    signMessage({ message });
  };

  useEffect(() => {
    (async () => {
      if (variables?.message && signMessageData) {
        handleSubmit();
      }
    })();
  }, [signMessageData, variables?.message]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'links') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'logo') {
          if (formData[key]) {
            formDataToSend.append(key, formData[key], 'logo');
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      if (!signMessageData) {
        toast.error('Signature failed');
        return;
      }
      formDataToSend.append('signature', signMessageData);

      const response = await api.charity.register(formDataToSend);
      const { data: charity, accessToken } = response;
      login(accessToken, charity);
      toast.success('Registration successful');
      navigate('/charity/me');
    } catch (_error) {
      toast.error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-sky-200">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="hidden lg:block">
            <img src="/charity-image.png" alt="Charity" className="h-auto w-full rounded-lg object-cover" />
          </div>

          <div className="my-4">
            <form onSubmit={handleSign} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6 font-bold text-2xl">Register Your Charity</h2>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Charity name</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your charity name"
                    className="input input-bordered w-full"
                    required={true}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Logo</span>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Phone Number</span>
                  </div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="input input-bordered w-full"
                    required={true}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Charity Address</span>
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    className="input input-bordered w-full"
                    required={true}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Onchain Address</span>
                  </div>
                  <input
                    disabled={true}
                    type="text"
                    name="onchainAddress"
                    value={formData.onchainAddress}
                    readOnly={true}
                    className="input input-bordered w-full"
                    required={true}
                  />
                  <div className="label">
                    <span className="label-text-alt text-sky-600">{basename}</span>
                  </div>
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Description</span>
                  </div>
                  <textarea
                    rows={5}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered"
                    placeholder="Enter Description"
                    required={true}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Charity Email</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Email"
                    className="input input-bordered w-full"
                    required={true}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Type</span>
                  </div>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="select select-bordered w-full"
                    required={true}>
                    <option value="" disabled={true}>
                      Select your charity type
                    </option>
                    <option value="individual">Individual</option>
                    <option value="organization">Organization</option>
                  </select>
                </label>

                <div className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Links</span>
                  </div>
                  {formData.links.map((link, index) => (
                    <div key={index} className="mb-2 flex gap-2">
                      <select
                        value={link.type}
                        onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                        className="select select-bordered w-1/3">
                        <option value="">Select Type</option>
                        {linkTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                        placeholder="URL"
                        className="input input-bordered w-2/3"
                      />
                      <button type="button" onClick={() => removeLink(index)} className="btn btn-square btn-sm">
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addLink} className="btn btn-outline btn-sm mt-2">
                    <PlusCircle size={20} /> Add Link
                  </button>
                </div>

                <div className="card-actions mt-6 justify-end">
                  <button type="submit" className={'btn btn-primary '} disabled={isLoading || !address}>
                    {isLoading && <span className="loading loading-spinner" />}
                    Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
