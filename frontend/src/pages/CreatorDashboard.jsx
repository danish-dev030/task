import Navbar from '../components/Navbar';
import PhotoGrid from '../components/PhotoGrid';
import useCreatorPhotos from '../hooks/useCreatorPhotos';
import api from '../api/axios';
import { useToastStore } from '../store/toastStore';
import { Link } from 'react-router-dom';

export default function CreatorDashboard() {
  const { data = [], refetch } = useCreatorPhotos();
  const { showToast } = useToastStore();
  const totalComments = data.reduce((acc, p) => acc + (p.commentsCount || 0), 0);
  const avgRating = data.length ? data.reduce((acc, p) => acc + (p.rating?.avg || 0), 0) / data.length : 0;

  const onDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/photos/${id}`);
      showToast('Photo deleted', 'success');
      refetch();
    } catch (err) {
      showToast(err?.response?.data?.error || 'Delete failed', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="row">
          <h1>My Photos</h1>
          <Link to="/creator/upload" className="btn">
            Upload New Photo
          </Link>
        </div>
        <div className="stats">
          <div className="stat-card">
            <strong>{data.length}</strong>
            <span>Total Photos</span>
          </div>
          <div className="stat-card">
            <strong>{totalComments}</strong>
            <span>Total Comments</span>
          </div>
          <div className="stat-card">
            <strong>{avgRating.toFixed(1)}</strong>
            <span>Avg Rating</span>
          </div>
        </div>
        <PhotoGrid photos={data} onDelete={onDelete} />
      </main>
    </>
  );
}
