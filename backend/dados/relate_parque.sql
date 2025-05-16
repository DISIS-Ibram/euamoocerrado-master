UPDATE public.parque_benfeitoria
   SET parque_id=p_id 
FROM
       (SELECT 
  parque_parque.id as p_id, 
  parque_benfeitoria.id b_id
FROM 
  public.parque_benfeitoria, 
  public.parque_parque where st_intersects (  parque_parque.geom, parque_benfeitoria.geom))
  as foo 
  where b_id=id;



UPDATE public.parque_atrativo
   SET parque_id=p_id 
FROM
       (SELECT 
  parque_parque.id as p_id, 
  parque_atrativo.id b_id
FROM 
  public.parque_atrativo, 
  public.parque_parque where st_intersects (  parque_parque.geom, parque_atrativo.geom))
  as foo 
  where b_id=id;



UPDATE public.trilha_trilha
   SET parque_id=p_id 
FROM
       (SELECT 
  parque_parque.id as p_id, 
  trilha_trilha.id b_id
FROM 
  public.trilha_trilha, 
  public.parque_parque where st_intersects (  parque_parque.geom, trilha_trilha.geom))
  as foo 
  where b_id=id;
