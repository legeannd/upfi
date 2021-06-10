import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Card = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type Pages = {
  data: Card[];
  after: number | null;
};

export default function Home(): JSX.Element {
  const getImages = async ({ pageParam = null }): Promise<Pages> => {
    const { data } = await api.get('images', {
      params: {
        after: pageParam,
      },
    });

    return data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<unknown, unknown, Pages>('images', getImages, {
    getNextPageParam: (lastPage: { after: number }) => lastPage.after,
  });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data).flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
