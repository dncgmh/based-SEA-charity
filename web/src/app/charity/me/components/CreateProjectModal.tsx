import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function CreateProjectModal({ onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: [],
    link: '',
    tags: [],
    startDate: '',
    endDate: '',
    targetAmount: '',
  });
  const [tagInput, setTagInput] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...acceptedFiles].slice(0, 10),
    }));
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      images: [],
      link: '',
      tags: [],
      startDate: '',
      endDate: '',
      targetAmount: '',
    });
    setTagInput('');
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxFiles: 10,
    maxSize: 1024 * 1024 * 5, // 5MB
  });

  const onClose = () => {
    const modal = document.getElementById('create-project');
    modal.close();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      for (const key in formData) {
        switch (key) {
          case 'images':
            formData.images.forEach((file) => formDataToSend.append(key, file, file.name));
            break;
          case 'tags':
            formData.tags.forEach((tag) => formDataToSend.append(key, tag));
            break;
          default:
            formDataToSend.append(key, formData[key]);
            break;
        }
      }
      const { data: newProject } = await api.project.create(formDataToSend);
      toast.success('Project created successfully');
      onClose();
      resetForm();
      onCreate(newProject);
    } catch (error) {
      toast.error('Failed to create project');
      console.error('Failed to create project:', error);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <dialog id="create-project" className="modal">
      <div className="modal-box">
        <h3 className="mb-4 font-bold text-lg">Create New Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="title">
              <span className="label-text">Project Title</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text">Project Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Images (Max 10)</span>
            </label>
            <div
              {...getRootProps()}
              className={`dropzone rounded-box border-2 border-dashed p-4 ${isDragActive ? 'bg-base-200' : ''}`}
            >
              <input {...getInputProps()} />
              <p className="text-center">
                {isDragActive ? 'Drop the files here...' : "Drag 'n' drop some files here, or click to select files"}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="btn btn-circle btn-xs absolute top-0 right-0 bg-error text-white"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="link">
              <span className="label-text">Project Link</span>
            </label>
            <input
              type="text"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="form-control">
              <label className="label" htmlFor="startDate">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="endDate">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="targetAmount">
              <span className="label-text">Target Amount (USD)</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="input input-bordered w-full"
                step="1"
                min="0"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label" htmlFor="tags">
              <span className="label-text">Tags</span>
            </label>
            <div className="flex items-center">
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="input input-bordered flex-grow"
                placeholder="Enter a tag"
              />
              <button type="button" onClick={handleAddTag} className="btn btn-info ml-2">
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="badge badge-info gap-2">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="btn btn-ghost btn-xs">
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <button type="submit" className="btn btn-info">
              Create Project
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
