"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useRooms() {
  const { data, error, isLoading } = useSWR("/api/rooms", fetcher)

  return {
    rooms: data,
    isLoading,
    isError: !!error,
  }
}
