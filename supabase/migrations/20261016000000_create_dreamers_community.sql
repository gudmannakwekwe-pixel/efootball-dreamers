create table if not exists public.community_posts (
 id uuid primary key default gen_random_uuid(),
 author_id uuid not null references auth.users(id) on delete cascade,
 category text not null default 'COMMUNITY' check (category in ('COMMUNITY','TACTICS','SQUAD SHOWCASE','HELP','FRIENDLY')),
 title text not null check (char_length(title) between 3 and 120),
 body text not null check (char_length(body) between 1 and 2000),
 created_at timestamptz not null default now()
);
create table if not exists public.community_post_reactions (
 post_id uuid not null references public.community_posts(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(post_id,user_id)
);
create table if not exists public.community_comments (
 id uuid primary key default gen_random_uuid(),
 post_id uuid not null references public.community_posts(id) on delete cascade,
 author_id uuid not null references auth.users(id) on delete cascade,
 body text not null check(char_length(body) between 1 and 1000),
 created_at timestamptz not null default now()
);
create index if not exists community_posts_created_at_idx on public.community_posts(created_at desc);
create index if not exists community_comments_post_created_idx on public.community_comments(post_id,created_at asc);
alter table public.community_posts enable row level security;
alter table public.community_post_reactions enable row level security;
alter table public.community_comments enable row level security;
drop policy if exists "Community posts are publicly readable" on public.community_posts;
create policy "Community posts are publicly readable" on public.community_posts for select using(true);
drop policy if exists "Signed in users can publish community posts" on public.community_posts;
create policy "Signed in users can publish community posts" on public.community_posts for insert to authenticated with check(auth.uid()=author_id);
drop policy if exists "Authors can edit their own community posts" on public.community_posts;
create policy "Authors can edit their own community posts" on public.community_posts for update to authenticated using(auth.uid()=author_id) with check(auth.uid()=author_id);
drop policy if exists "Authors can delete their own community posts" on public.community_posts;
create policy "Authors can delete their own community posts" on public.community_posts for delete to authenticated using(auth.uid()=author_id);
drop policy if exists "Reactions are publicly readable" on public.community_post_reactions;
create policy "Reactions are publicly readable" on public.community_post_reactions for select using(true);
drop policy if exists "Users can react as themselves" on public.community_post_reactions;
create policy "Users can react as themselves" on public.community_post_reactions for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "Users can remove their own reactions" on public.community_post_reactions;
create policy "Users can remove their own reactions" on public.community_post_reactions for delete to authenticated using(auth.uid()=user_id);
drop policy if exists "Comments are publicly readable" on public.community_comments;
create policy "Comments are publicly readable" on public.community_comments for select using(true);
drop policy if exists "Signed in users can comment as themselves" on public.community_comments;
create policy "Signed in users can comment as themselves" on public.community_comments for insert to authenticated with check(auth.uid()=author_id);
drop policy if exists "Authors can delete their own comments" on public.community_comments;
create policy "Authors can delete their own comments" on public.community_comments for delete to authenticated using(auth.uid()=author_id);
grant select on public.community_posts,public.community_post_reactions,public.community_comments to anon,authenticated;
grant insert,update,delete on public.community_posts to authenticated;
grant select,insert,delete on public.community_post_reactions to authenticated;
grant select,insert,delete on public.community_comments to authenticated;
