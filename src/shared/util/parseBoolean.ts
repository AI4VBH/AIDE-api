export const parseBoolean = (value: string): boolean => {
  switch (value) {
    case 'false':
    case 'False':
      return false;
    case 'true':
    case 'True':
      return true;

    default:
      return false;
  }
};
