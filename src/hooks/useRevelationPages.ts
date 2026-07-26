"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

type PostItem = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  readingTime: number;
  isDream?: boolean;
};

const BATCH_SIZE = 12;

export function useRevelationPages(posts: PostItem[]) {
  return useInfiniteQuery({
    queryKey: ["revelations", posts],
    queryFn: ({ pageParam = 0 }) => {
      const start = pageParam * BATCH_SIZE;
      const end = start + BATCH_SIZE;
      const page = posts.slice(start, end);
      return {
        items: page,
        nextPage: end < posts.length ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    initialData: {
      pages: [
        {
          items: posts.slice(0, BATCH_SIZE),
          nextPage: BATCH_SIZE < posts.length ? 1 : undefined,
        },
      ],
      pageParams: [0],
    },
  });
}
