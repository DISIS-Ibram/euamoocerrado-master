INSERT INTO public.especie_imagemespecie(
            created_at, imagem, especie_id, user_id)
            SELECT created_at, nome || '.png', id, user_id FROM public.especie_tipoespecie;


INSERT INTO public.especie_fruto(
            tipoespecie_ptr_id)  
SELECT id FROM public.especie_tipoespecie where tipo = 'fruto';


INSERT INTO public.especie_ave(
            tipoespecie_ptr_id)  
SELECT id FROM public.especie_tipoespecie where tipo = 'ave';


INSERT INTO public.especie_mamifero(
            tipoespecie_ptr_id)  
SELECT id FROM public.especie_tipoespecie where tipo = 'mamifero';

INSERT INTO public.especie_arvore(
            tipoespecie_ptr_id)
SELECT id FROM public.especie_tipoespecie where tipo = 'arvore';

