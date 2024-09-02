const selectFilter = (input, option) => {
  return option?.label?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0;
};

export { selectFilter };
