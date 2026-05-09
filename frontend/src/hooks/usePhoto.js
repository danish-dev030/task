import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const usePhoto = (id) =>
  useQuery({
    queryKey: ['photo', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await api.get(`/photos/${id}`);
      return data;
    }
  });

export default usePhoto;
