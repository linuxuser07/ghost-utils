const GhostAdminAPI = require('@tryghost/admin-api');
const truncate = require('truncate-html');
import { logError } from '@/utils/logger';

const TRUNCATION_LENGTH = 500;

const api = new GhostAdminAPI({
  url: process.env.GHOST_URL,
  key: process.env.GHOST_ADMIN_KEY,
  version: 'v3',
});

export default async (req, res) => {
  const slug = req.query.slug;
  if (slug) {
    const length = TRUNCATION_LENGTH;
    try {
      const response = await api.posts.read({ slug: slug, formats: 'html' });
      response.html = truncate(response.html, length);
      res.statusCode = 200;
      res.json({ response });
    } catch (error) {
      // logger.error({ error: 'error' });
      // logger.error({ a: 'b' });

      res.statusCode = 500;
      logError(req, res, error);
      res.json({ error });
    }
  } else {
    res.statusCode = 400;
    res.json({ error: 'must provide slug in request query parameter' });
  }
};
