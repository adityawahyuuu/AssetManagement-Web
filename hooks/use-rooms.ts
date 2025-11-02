"use client"

import useSWR from "swr"

const fetcher = (url: string) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }).then((res) => res.json())
}

export function useRooms() {
  const { data, error, isLoading } = useSWR("/api/rooms", fetcher)

  return {
    rooms: data,
    isLoading,
    isError: !!error,
  }
}
