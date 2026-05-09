import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TagInput from './TagInput';
import { useToastStore } from '../store/toastStore';

export default function UploadForm() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: { title: '', caption: '', location: '', peopleTagged: [] }
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    if (!file) return showToast('Please select an image', 'error');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', values.title);
      formData.append('caption', values.caption || '');
      formData.append('location', values.location || '');
      formData.append('peopleTagged', JSON.stringify(values.peopleTagged || []));
      await api.post('/photos', formData);
      showToast('Photo published', 'success');
      navigate('/creator');
    } catch (err) {
      showToast(err?.response?.data?.error || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit(onSubmit)}>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <input placeholder="Title" {...register('title', { required: true })} />
      <textarea placeholder="Caption" rows={4} {...register('caption')} />
      <input placeholder="Location" {...register('location')} />
      <Controller name="peopleTagged" control={control} render={({ field }) => <TagInput {...field} />} />
      <button className="btn" disabled={loading}>
        {loading ? 'Publishing...' : 'Publish Photo'}
      </button>
    </form>
  );
}
