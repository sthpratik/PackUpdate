/**
 * Dependency analysis and resolution
 */
import { OutdatedPackage } from "../types";

/**
 * Resolve update order based on dependencies
 * @param outdatedPackages Packages that need updates
 * @param dependencyTree Project dependency tree
 * @returns Ordered list of packages to update
 */
export const resolveUpdateOrder = (
  outdatedPackages: Record<string, OutdatedPackage>,
  dependencyTree: Record<string, any>
): string[] => {
  const resolvedOrder: string[] = [];
  const visited = new Set<string>();

  const visit = (packageName: string): void => {
    if (visited.has(packageName)) return;
    visited.add(packageName);

    const dependencies = dependencyTree.dependencies?.[packageName]?.requires || {};
    for (const dep of Object.keys(dependencies)) {
      if (outdatedPackages[dep]) visit(dep);
    }
    resolvedOrder.push(packageName);
  };

  for (const pkg of Object.keys(outdatedPackages)) {
    visit(pkg);
  }

  return resolvedOrder;
};

/**
 * Find circular dependencies in dependency tree
 * @param deps Dependency tree
 * @param visited Set of visited packages
 * @param path Current dependency path
 * @returns Array of circular dependency chains
 */
export const findCircularDependencies = (deps: any, visited = new Set(), path: string[] = []): string[] => {
  const circular: string[] = [];
  if (!deps || !deps.dependencies) return circular;
  
  for (const [name, info] of Object.entries(deps.dependencies)) {
    if (visited.has(name)) {
      if (path.includes(name)) {
        circular.push(`${path.join(' → ')} → ${name}`);
      }
      continue;
    }
    visited.add(name);
    circular.push(...findCircularDependencies(info as any, visited, [...path, name]));
  }
  return circular;
};
