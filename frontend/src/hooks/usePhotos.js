import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const usePhotos = (searchQuery, page) =>
  useQuery({
    queryKey: ['photos', searchQuery, page],
    queryFn: async () => {
      const { data } = await api.get('/photos', {
        params: { search: searchQuery || '', page, limit: 12 }
      });
      return data;
    }
  });

export default usePhotos;
