/**
 * Version comparison utilities
 */

/**
 * Check if update is a minor version change (same major version)
 * @param current Current version string
 * @param latest Latest version string
 * @returns True if it's a minor update
 */
export const isMinorUpdate = (current: string, latest: string): boolean => {
  const currentParts = current.replace(/[^0-9.]/g, '').split('.').map(Number);
  const latestParts = latest.replace(/[^0-9.]/g, '').split('.').map(Number);
  
  if (currentParts.length < 2 || latestParts.length < 2) return false;
  
  // Same major version, different minor or patch
  return currentParts[0] === latestParts[0] && 
         (currentParts[1] !== latestParts[1] || currentParts[2] !== latestParts[2]);
};
