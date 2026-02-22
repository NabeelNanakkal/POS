export const itemVisibility = (item) => {
    if (!item.visibleOnly) return true;
    const field = item.visibleOnly.field;
    const equals = item.visibleOnly.equals;
    const presence = item.visibleOnly.presence
    let isVisible = true
    if (equals) {
      isVisible = selectedData[field] === equals;
    }
    else {
      if (selectedData[field]) {
        isVisible = presence
      } else {
        isVisible = !presence
      }
    }
    return isVisible;
  };