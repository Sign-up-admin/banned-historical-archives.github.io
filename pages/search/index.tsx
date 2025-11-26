import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Search() {
  const [es_size] = useState(10);
  const [es_from, setFrom] = useState(0);
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<any>();
  async function update(keyword: string, es_size: number, es_from: number) {
    const x = await (
      await fetch(
        `${
          location.hostname == 'localhost' || location.hostname == '127.0.0.1'
            ? `${location.protocol}//${location.host}:9200`
            : `${location.protocol}//${location.hostname}/search_api`
        }/article/_search/?source=${encodeURIComponent(
          JSON.stringify({
            //index: 'article',
            from: es_from,
            size: es_size,
            query: { match_phrase: { content: keyword } },
            highlight: {
              fields: { content: {} },
            },
          }),
        )}&source_content_type=${encodeURIComponent('application/json')}`,
      )
    ).json();
    console.log(x);
    setRes(x.hits);
  }
  const [k, setK] = useState('');
  useEffect(() => {
    const keyword = new URLSearchParams(location.search).get(
      'keyword',
    ) as string;
    setK(keyword);
    update(keyword, es_size, es_from);
  }, [es_size, es_from]);

  useEffect(() => {
    setFrom(es_size * (page - 1));
  }, [page, es_size]);

  if (!res) return null;
  const total = Math.ceil(res.total.value / es_size);
  return (
    <Stack p={2} sx={{ height: '100%', overflow: 'scroll' }}>
      <Head>
        <title>和谐历史档案馆 Banned Historical Archives</title>
      </Head>
      <Typography variant="h4" sx={{ mb: 1 }}>
        搜索:{k}
      </Typography>
      {res.hits.map((i: any) => (
        <div key={i._id}>
          <a
            href={`/articles/${i._source.article_id}?publication_id=${i._source.publication_id}`}
            rel="noreferrer"
            target="_blank"
          >
            {i._source.title}-{i._source.publication_name}
          </a>
          {i.highlight.content.map((j: any) => (
            <div
              key={j}
              style={{ marginLeft: 20, fontSize: 8 }}
              dangerouslySetInnerHTML={{ __html: j }}
            ></div>
          ))}
        </div>
      ))}
      <div>
        <Button
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
        >
          上一页
        </Button>
        {page}/{total}
        <Button
          onClick={() => {
            if (page < total) setPage(page + 1);
          }}
        >
          下一页
        </Button>
      </div>
    </Stack>
  );
}

Search.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
