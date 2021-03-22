import ejs from 'ejs';

export const getHTMLFile = async (path, data) => {
  const source = await ejs.renderFile(path, data);
  return source;
};
