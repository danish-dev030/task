import PhotoCard from './PhotoCard';

export default function PhotoGrid({ photos, onDelete }) {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <PhotoCard key={photo._id} photo={photo} onDelete={onDelete} />
      ))}
    </div>
  );
}
