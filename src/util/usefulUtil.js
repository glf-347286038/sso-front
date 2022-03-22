/**
 * 获取url上的数据
 * http://www.runoob.com/index.php?id=1&image=awesome.jpg
 * getQueryVariable("id") 返回 1
 * @param variable   有用的
 * @returns {string|boolean}
 */
export function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (const index in vars) {
    let pair = vars[index].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return "";
}

