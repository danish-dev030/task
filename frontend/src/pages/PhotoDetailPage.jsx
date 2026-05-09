import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import CommentSection from '../components/CommentSection';
import usePhoto from '../hooks/usePhoto';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function PhotoDetailPage() {
  const { id } = useParams();
  const { data, refetch } = usePhoto(id);
  const { user } = useAuthStore();
  const [userScore, setUserScore] = useState(null);

  if (!data) return null;
  const { photo, comments, rating } = data;

  return (
    <>
      <Navbar />
      <main className="detail-wrap">
        <img src={photo.imageUrl} alt={photo.title} className="detail-img" />
        <section>
          <h1>{photo.title}</h1>
          <p>{photo.caption}</p>
          <p>{photo.location}</p>
          <div className="tag-list">
            {photo.peopleTagged?.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <StarRating
            rating={rating.avg}
            count={rating.count}
            interactive={user?.role === 'consumer'}
            userScore={userScore}
            onRate={async (score) => {
              await api.post(`/photos/${id}/rate`, { score });
              setUserScore(score);
              refetch();
            }}
          />
        </section>
      </main>
      <main className="page">
        <CommentSection
          photoId={id}
          comments={comments}
          currentUser={user}
          onCreated={() => {
            refetch();
          }}
        />
      </main>
    </>
  );
}
