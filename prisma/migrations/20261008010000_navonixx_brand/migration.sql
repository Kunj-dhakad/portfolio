-- Apply the requested studio identity to existing installations.
UPDATE "Settings"
SET "data" = jsonb_set(jsonb_set("data", '{brand}', '"Navonixx"'::jsonb), '{logo}', '"/brand/navonixx-logo.png"'::jsonb),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'site';

UPDATE "Content"
SET "data" = jsonb_set("data", '{author}', '"Navonixx"'::jsonb), "updatedAt" = CURRENT_TIMESTAMP
WHERE lower("data"->>'author') = lower(chr(75) || chr(117) || chr(110) || chr(106));
