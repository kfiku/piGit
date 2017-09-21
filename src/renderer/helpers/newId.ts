let lastId = Date.now();

const newId = (prefix = 'id') => {
  lastId++;
  return `${prefix}-${lastId}`;
};

export default newId;
