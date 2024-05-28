'use client'

import { Container } from "@/components/Container"
import { getArticles } from "@/queries/getArtciles"
import { supabase } from "@/utils/supabase/server"
import Link from "next/link"
import { useEffect, useState } from "react"

type Articles = Omit<Article, 'description' | 'url'>[]

export default function News() {
  const [articles, setAricles] = useState<Articles>([])

  useEffect(() => {
    getArticles()
      .then((data) => {
        setAricles(data.data as Articles)
      })
  }, [])

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-4 text-center">
        News
      </h1>

      <ul className="flex gap-4 p-4 flex-col">
        {articles?.map(({ title, id }) => (
          <li key={id} className="list-none p-2 text-2xl hover:underline ">
            <Link href={`news/${id}`}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}