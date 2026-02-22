export const formatDateWithTime = (dateString) => {
  if (!dateString) {
    return ''; // fallback
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  return new Intl.DateTimeFormat('en-GB', options)
    .format(date)
    .replace(' ', ' ')
};

export const formatTimeOnly = (dateString) => {
  if (!dateString) {
    return ''; // Return fallback for null or undefined
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true // 12-hour clock format with AM/PM
  };

  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) {
    return '-'; // Return fallback for null or undefined
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return '';
  }

  const options = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  };

  const [day, month, year] = new Intl.DateTimeFormat('en-GB', options).format(date).split(' ');

  return `${day} ${month}, ${year}`;
};
