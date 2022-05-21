const getCurrentDateString = (): string => {
  const day = String(new Date().getDate()).length === 1 ? `0${String(new Date().getDate())}` : String(new Date().getDate());
  const month = String(new Date().getMonth() + 1).length === 1 ? `0${String(new Date().getMonth() + 1)}` : String(new Date().getMonth() + 1);
  const year = new Date().getFullYear();
  return `${day}.${month}.${year}`;
};

export default getCurrentDateString;
