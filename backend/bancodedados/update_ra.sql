UPDATE public.parque_parque
   SET       regiao_administrativa=m
       FROM 

       (SELECT 
  parque_parque.id, 
  substring(replace((array_agg(regiao_administrativa.nome))::text, '"', ''), 2, length(replace((array_agg(regiao_administrativa.nome))::text, '"', ''))-2) as m
  FROM 
  public.regiao_administrativa, 
  public.parque_parque where st_intersects(parque_parque.geom, regiao_administrativa.geom) group by parque_parque.id order by parque_parque.id
) AS foo
 WHERE foo.id = parque_parque.id;


UPDATE public.trilha_trilha
   SET       regiao_administrativa=m
       FROM 

       (SELECT 
  trilha_trilha.id, 
  substring(replace((array_agg(regiao_administrativa.nome))::text, '"', ''), 2, length(replace((array_agg(regiao_administrativa.nome))::text, '"', ''))-2) as m
  FROM 
  public.regiao_administrativa, 
  public.trilha_trilha where st_intersects(trilha_trilha.geom, regiao_administrativa.geom) group by trilha_trilha.id order by trilha_trilha.id
) AS foo
 WHERE foo.id = trilha_trilha.id;
