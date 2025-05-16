export default (message: string, key?: string) => key === undefined
  ? message
  : `${key}: ${message}`;
