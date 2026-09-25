-- Wave8 Ask6: successor-URL stamp fingerprint (tier-1 accepted tips)
-- Predecessor tip whose source_url path embeds successor product slug.
SELECT p.id AS predecessor_id,
       p.generation, p.generation_rank, p.successor_plugin_id,
       vo.observed_version AS tip, vo.confidence, vo.source_url,
       s.id AS successor_id, svo.observed_version AS successor_tip
FROM plugin_version_current pvc
JOIN version_observations vo ON vo.id = pvc.observation_id
JOIN plugins p ON p.id = pvc.plugin_id
JOIN manufacturers m ON m.id = p.manufacturer_id
JOIN plugins s ON s.id = p.successor_plugin_id
LEFT JOIN plugin_version_current spvc ON spvc.plugin_id = s.id
LEFT JOIN version_observations svo ON svo.id = spvc.observation_id
WHERE vo.status = 'accepted'
  AND COALESCE(p.popularity_tier, m.popularity_tier) = 1
  AND (
    REPLACE(LOWER(vo.source_url), '-', '_') LIKE '%' || REPLACE(LOWER(REPLACE(s.id, p.manufacturer_id || '--', '')), '-', '_') || '%'
  );
