import * as React from 'react';

/**
 * Try to read display name from a given React component.
 */
export default function displayName(
  Component: React.ReactType,
  defaultTo: string = 'Component',
): string {
  if (typeof Component === 'string') {
    return Component;
  }

  if (
    Component.displayName != null &&
    typeof Component.displayName === 'string'
  ) {
    return Component.displayName;
  }

  if (Component.name != null && typeof Component.name === 'string') {
    return Component.name;
  }

  return defaultTo;
}
