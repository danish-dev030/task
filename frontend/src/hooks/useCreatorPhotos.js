import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

const useCreatorPhotos = () =>
  useQuery({
    queryKey: ['creator-photos'],
    queryFn: async () => {
      const { data } = await api.get('/photos/mine/list');
      return data;
    }
  });

export default useCreatorPhotos;
