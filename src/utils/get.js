// @flow

export default function(object: Object, path: string): ?Object {
  if (path == null) {
    return undefined;
  }
  let pathArray = path.split(".");
  if (pathArray.length == 1 && pathArray[0] === "") {
    return undefined;
  }

  let index = 0;
  let result = object;

  while (result != null && index < pathArray.length) {
    result = result[pathArray[index++]];
  }
  return result;
}
