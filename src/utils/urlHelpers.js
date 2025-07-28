export const validateGoogleDriveUrl = (url) => {
  const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  return driveRegex.test(url);
};

export const validateYouTubeUrl = (url) => {
  const youtubeRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  return youtubeRegex.test(url);
};

export const extractGoogleDriveId = (url) => {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const extractYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const createGoogleDriveViewUrl = (driveUrl) => {
  const fileId = extractGoogleDriveId(driveUrl);
  return fileId ? `https://drive.google.com/uc?id=${fileId}` : null;
};