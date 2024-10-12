import { api } from '@/lib/api';
import { PlusCircle, X } from 'lucide-react';
import { useState } from 'react';
const linkTypes = ['website', 'facebook', 'instagram', 'tiktok', 'youtube'];

export default function UpdateCharityModal({ charity, onUpdate }) {
  const [formData, setFormData] = useState({
    name: charity.name,
    description: charity.description,
    address: charity.address,
    phoneNumber: charity.phoneNumber,
    links: charity.links,
  });

  const onClose = () => {
    const modal: any = document.getElementById('update-charity');
    modal.close();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('links', JSON.stringify(formData.links));

      const { data: updatedCharity } = await api.charity.update(charity._id, formDataToSend);
      onUpdate(updatedCharity);
    } catch (error) {
      console.error('Failed to update charity:', error);
    }
  };

  return (
    <dialog id="update-charity" className="modal">
      <div className="modal-box">
        <h3 className="mb-4 font-bold text-lg">Edit Charity Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text">Charity Name</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Description</span>
            </label>
            <textarea
              rows={5}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              defaultValue={charity.description}
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="address">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              defaultValue={charity.address}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="phoneNumber">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              defaultValue={charity.phoneNumber}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Links</span>
            </div>
            {formData.links.map((link, index) => (
              <div key={index} className="mb-2 flex gap-2">
                <select
                  value={link.type}
                  onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                  className="select select-bordered w-1/3"
                >
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
            <button type="button" onClick={addLink} className="btn btn-outline btn-sm">
              <PlusCircle size={20} /> Add Link
            </button>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-info">
              Update Charity
            </button>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
