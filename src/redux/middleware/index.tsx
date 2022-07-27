import thunk from 'redux-thunk';

const logger = ({ getState }: any) => {
  return (next: any) => (action: any) => {
    const returnVal = next(action);
    return returnVal;
  };
};
export default [thunk, logger];
