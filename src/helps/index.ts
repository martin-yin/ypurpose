/**
 * @description 根据业务类型更改 version 版本。
 * @param currentVersion
 * @param type
 * @returns
 */
export function changeVersionByType(currentVersion: string, type: 'fix' | 'business' | 'major' = 'fix') {
  const versionArray = currentVersion.split(/[.|-]/);

  const b = Number(versionArray[0] || 0);
  const m = Number(versionArray[1] || 0);
  const s = Number(parseInt(versionArray[2]) || 0);
  const bigVersion = b || b === 0 ? b + 1 : 0; // 大版本更新
  const midVersion = m || m === 0 ? m + 1 : 0; // 业务版本迭代
  const smallVersion = s || s === 0 ? s + 1 : 0; // bug修复，优化等
  const version = [`${bigVersion}.0.0`, `${b}.${midVersion}.0`, `${b}.${m}.${smallVersion}`];

  if (type === 'major') {
    return version[0];
  }
  if (type === 'business') {
    return version[1];
  }
  return version[2];
}
