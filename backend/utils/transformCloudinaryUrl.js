function transformCloudinaryUrl(url) {
    const regex = /https:\/\/res\.cloudinary\.com\/([^\/]+)\/image\/upload\/([^\/]+)\/(.+)/;
    const match = url.match(regex);
    
    if (!match) {
      console.warn('Could not parse Cloudinary URL, returning original URL');
      return url;
    }
    
    const [_, cloudName, uploadParams, path] = match;
  
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_1280,c_limit,q_70,f_webp/${path}`;
  }
  
  module.exports = transformCloudinaryUrl;
  