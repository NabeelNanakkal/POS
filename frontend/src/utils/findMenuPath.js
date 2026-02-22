export function findMenuPathByUrl(menuItems, currentUrl, path = []) {
  for (const item of menuItems) {
    if (item.url === currentUrl) {
      return [...path, item];
    }

    if (item.children) {
      const found = findMenuPathByUrl(item.children, currentUrl, [...path, item]);
      if (found) return found;
    }
  }

  return null;
}
