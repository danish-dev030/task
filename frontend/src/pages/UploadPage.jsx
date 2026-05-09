import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UploadForm from '../components/UploadForm';

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Link to="/creator">← Back</Link>
        <h1>Upload Photo</h1>
        <UploadForm />
      </main>
    </>
  );
}
