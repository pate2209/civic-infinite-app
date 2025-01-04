"use client";

import '../styles.css';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

const fetchNumbers = async ({ pageParam = 0 }) => {
  const limit = 10;
  const response = await fetch(`/api/numbers?cursor=${pageParam}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch numbers');
  }
  return response.json();
};

const InfiniteScrollingPage = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['numbers'],
    queryFn: fetchNumbers,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialPageParam: 0,
  });

  const allRows = data ? data.pages.flatMap((page) => page.rows) : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length, 
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, 
    overscan: 5, 
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <div className="bg-gray-300 min-h-screen"> 

      <header className="bg-gray-100 py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-400">
          Infinite Scrolling Application
        </h1>
        <span className="text-xl font-bold text-gray-500">Aastha Patel</span>
      </header>

  
      {status === 'error' ? (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <p className="text-4xl font-bold text-center text-gray-500">
            Error fetching data.
          </p>
        </div>
      ) : (
        <div className="grid grid-rows-[auto,auto,auto] grid-cols-3 gap-4 bg-gray-200 p-6 min-h-[calc(100vh-4rem)]">

          <div className="fix top-0 left-0 flex w-full col-span-3 justify-center items-center">
            <p className="text-center text-gray-400 py-4 text-lg">
                Welcome to the infinite scrolling application. Scroll down to explore:
            </p>
          </div>

          <div className="info-section">
            <div className="info-card">
              <header className="info-header">How To Use This Application</header>
              <p className = "info-text">Navigating this application is simple - keep scrolling down the list of numbers! You can also use the scroll bar.</p>
            </div>
            <div className="info-card">
              <header className="info-header">Development Skills</header>
              <p className = "info-text">Technologies used to create this application include React, TanStack, HTML, CSS, TypeScript, and APIs!</p>
            </div>
          </div>

          <div className = "items-center">
            <div className= "bg-gray-400/50 rounded-2xl shadow-xl w-full max-h-[500px] overflow-auto border-8 border-gray-100"
            ref={parentRef}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const isLoaderRow = virtualRow.index > allRows.length - 1;
                const number = allRows[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    className="scrollTab"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow
                      ? hasNextPage
                        ? 'Loading more numbers...'
                        : 'No more data to load'
                      :  number}
                  </div>
                );
              })}
            </div>
            </div>
          </div>

          <div className="info-section">
            <div className="info-card">
              <header className = "info-header">Uses for This Application</header>
              <p className = "info-text">This application allows you to scroll through numbers to what seems like infinity. It can be used
                for entertainment or represent endless scrolls through your email inbox.
              </p>
            </div>
            <div className="info-card">
              <header className="info-header">Favorite Parts of Development</header>
              <p className = "info-text"> My favorite parts of developing this application include incorporating React Query for data fetching and experimenting with the UI to make it more appealing!</p>
            </div>
          </div>

        </div>
      )}

      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-20 h-20 border-4 border-t-4 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default InfiniteScrollingPage;