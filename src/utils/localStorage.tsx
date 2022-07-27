/**
 * The setValue() method of the Storage interface, when passed a key name and value, will add that key to the given Storage object, or update that key's value if it already exists.
 * @param {string} key
 * @param {any} value
 * @returns {any}
 */
const setValue = (key: string, value: any) => {
  try {
    if (typeof value === "object") value = JSON.stringify(value);
    window.localStorage.setItem(key, value);
  } catch (e) {}
};

/**
 * The getValue() method of the Storage interface, when passed a key name, will return that key's value, or null if the key does not exist, in the given Storage object.
 * @param {string} key
 * @returns {any}
 */
const getValue = (key: string) => {
  const value: any = window.localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
};

const localStorage = {
  setValue,
  getValue,
};
export default localStorage;
