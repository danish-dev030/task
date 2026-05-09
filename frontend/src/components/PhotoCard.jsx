import { Link } from 'react-router-dom';

export default function PhotoCard({ photo, onDelete }) {
  return (
    <div className="photo-card">
      {onDelete ? (
        <button className="delete-btn" onClick={() => onDelete(photo._id)}>
          🗑
        </button>
      ) : null}
      <Link to={`/photo/${photo._id}`}>
        <img src={photo.imageUrl} alt={photo.title} className="photo-img" />
        <div className="photo-body">
          <h3>{photo.title}</h3>
          <p className="muted">
            {photo.creatorId?.name} · {photo.location || 'Unknown'}
          </p>
        </div>
      </Link>
    </div>
  );
}
