import ejs from 'ejs';

export const getHTMLFile = async (path) => {
  const source = await ejs.renderFile(path);
  return source;
};
