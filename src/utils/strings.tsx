const makeFirstCharUppercase = (s: string) =>
  `${s[0].toUpperCase()}${s.slice(1, s.length)}`;


const getStringValue = (value: any): string => {
  return value.toString();
}
const stringUtils = {
  makeFirstCharUppercase,
  getStringValue
};

export default stringUtils;
