interface MetaData {
  title: string;
  description: string;
  keywords?: string;
}

export const setMetaData = ({ title, description, keywords }: MetaData) => {
  document.title = title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
  if (keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }
  }
};