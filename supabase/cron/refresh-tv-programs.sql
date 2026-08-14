-- À exécuter dans le SQL Editor Supabase après déploiement de la fonction refresh-tv-programs.
-- 02:00 heure de Paris varie selon heure d'été/hiver : ce cron UTC est à ajuster saisonnièrement
-- ou remplacé par un second déclenchement si l'on veut une heure locale stricte.

select cron.schedule(
  'onlive-refresh-tv-programs',
  '0 0 * * *',
  $$
  select net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/refresh-tv-programs',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer YOUR_SERVICE_OR_FUNCTION_SECRET'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Option recommandée plus tard : un deuxième refresh vers midi pour absorber les changements de grille.
