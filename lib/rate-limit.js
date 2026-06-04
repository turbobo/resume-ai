// Supabase 限流 — 按 IP + endpoint 计数
//
// 建表 SQL（在 Supabase SQL Editor 中执行）：
//
// create table api_usage (
//   id bigint generated always as identity primary key,
//   identifier text not null,
//   endpoint text not null,
//   created_at timestamptz not null default now()
// );
// create index idx_api_usage_lookup on api_usage (identifier, endpoint, created_at);
//
// -- RLS: 允许 anon 用户插入和读取
// alter table api_usage enable row level security;
// create policy "allow anon insert" on api_usage for insert to anon with check (true);
// create policy "allow anon select" on api_usage for select to anon using (true);
//
// -- 自动清理 7 天前的记录（可选，用 pg_cron 或定期手动执行）：
// -- delete from api_usage where created_at < now() - interval '7 days';

import { supabase } from './supabase'

const DEFAULT_LIMIT = 3
const DEFAULT_WINDOW_MINUTES = 1440 // 24 小时

function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function checkRateLimit(request, endpoint, limit = DEFAULT_LIMIT, windowMinutes = DEFAULT_WINDOW_MINUTES) {
  try {
    const identifier = getClientIP(request)
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()

    const { count, error: countError } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart)

    if (countError) {
      console.warn('限流查询失败，降级放行:', countError.message)
      return { allowed: true, remaining: limit }
    }

    if (count >= limit) {
      return { allowed: false, remaining: 0 }
    }

    await supabase.from('api_usage').insert({ identifier, endpoint })

    return { allowed: true, remaining: limit - count - 1 }
  } catch (err) {
    console.warn('限流检查异常，降级放行:', err.message)
    return { allowed: true, remaining: limit }
  }
}
