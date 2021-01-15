export const onlyOnProduction = (action) => {
  if (process.env.NODE_ENV === 'production') {
    action();
  }
};
