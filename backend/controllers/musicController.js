import https from 'https';

export async function handleStreamAudio(req, res) {
  const fileId = req.params.fileId || req.query.id;
  if (!fileId) {
    return res.status(400).json({ error: 'Missing fileId' });
  }

  const gdriveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  };

  if (req.headers.range) {
    headers['Range'] = req.headers.range;
  }

  const driveReq = https.get(gdriveUrl, { headers }, (driveRes) => {
    // Forward status code (200 or 206)
    res.status(driveRes.statusCode || 200);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', driveRes.headers['content-type'] || 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    if (driveRes.headers['content-range']) {
      res.setHeader('Content-Range', driveRes.headers['content-range']);
    }
    if (driveRes.headers['content-length']) {
      res.setHeader('Content-Length', driveRes.headers['content-length']);
    }

    driveRes.pipe(res);
  });

  driveReq.on('error', (err) => {
    console.error('Audio stream proxy error:', err);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Failed to stream audio from Google Drive' });
    }
  });

  req.on('close', () => {
    driveReq.destroy();
  });
}
