import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import PhotoGrid from '../components/PhotoGrid';
import SkeletonCard from '../components/SkeletonCard';
import usePhotos from '../hooks/usePhotos';

export default function FeedPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') || '';
  const page = Number(params.get('page') || 1);
  const { data, isLoading } = usePhotos(search, page);

  const photos = data?.photos || [];

  return (
    <>
      <Navbar />
      <main className="page">
        <h1>Discover Photos</h1>
        <SearchBar />
        {isLoading ? (
          <div className="photo-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : photos.length ? (
          <PhotoGrid photos={photos} />
        ) : (
          <p>No photos found</p>
        )}
        {data?.currentPage < data?.totalPages ? (
          <button
            className="btn"
            onClick={() => {
              const next = new URLSearchParams(params);
              next.set('page', String(page + 1));
              setParams(next);
            }}
          >
            Load More
          </button>
        ) : null}
      </main>
    </>
  );
}
