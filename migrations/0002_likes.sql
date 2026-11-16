create table if not exists site_likes (
  id int primary key,
  count int not null default 0
);

insert into site_likes (id, count)
select 1, 0
where not exists (select 1 from site_likes where id = 1);
