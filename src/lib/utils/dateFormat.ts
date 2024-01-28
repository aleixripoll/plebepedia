const dateFormat = (datetime: string | Date) => {
  const dateTime = new Date(datetime);

  const date = dateTime.toLocaleDateString(['es-ES'], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return date;
};

export default dateFormat;
