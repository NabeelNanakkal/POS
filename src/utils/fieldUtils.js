import dayjs from 'dayjs';
import { formatAmountWithComma } from './formatAmount';
import { formatDateTime, formatDateWithTime } from './formatDateTime';

export const getFieldSize = (size) => {
    const sizeMapping = {
        xxxs: 1,
        xxs: 2,
        xxsm: 2.5,
        xs: 3,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10,
        xxl: 12,
    };
    return sizeMapping[size] || 6;
};

export const getFormattedValue = (item, data) => {
    const value = data[item?.fieldName];
    if (item.type === 'cash') return formatAmountWithComma(value);
    if (item.type === 'date') return formatDateTime(value);
    if (item.type === 'number') return value || 0;
    if (item.type === 'percentage') return `${value}%` || 0;
    if (item.type === 'dateTime') return formatDateWithTime(value);
    if (item.type === 'duration') return `${((value || 0) / 60).toFixed(2)} Hr`;
    if (item.type === 'distance') return `${((value || 0) / 1000).toFixed(2)} Km`;
    if (item.type === 'url' || item.type === 'redirect') return value ? '' : '';
    return value || '';
};

// utils/fieldVisibility.js
export const checkCondition = (cond, data, role) => {
    if (!cond) return true;

    if (cond.role) {
        if (Array.isArray(cond.role)) {
            return cond.role.includes(role);
        }
        return role === cond.role;
    }

    const value = data?.[cond.field];

    if ('equals' in cond) return value === cond.equals;
    if ('notEquals' in cond) return value !== cond.notEquals;
    if ('presence' in cond) return cond.presence ? !!value : !value;

    return true;
};

export const evaluateConditions = (config, data, role) => {
    if (!config) return true;

    if (config.field || config.role) {
        return checkCondition(config, data, role);
    }

    if (config.conditions) {
        const operator = config.operator || 'AND';
        return operator === 'AND'
            ? config.conditions.every((c) => checkCondition(c, data, role))
            : config.conditions.some((c) => checkCondition(c, data, role));
    }

    return true;
};

export const visibility = (item, data, role) => {
    const show = item.visibleOnly ? evaluateConditions(item.visibleOnly, data, role) : true;
    const hide = item.hideOnly ? evaluateConditions(item.hideOnly, data, role) : false;
    return show && !hide;
};


// Helper function to validate and parse date/time values
export const parseDateValue = (value) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
};


// Helper cell values Visibility in table
export const cellItemVisibility = (item, selectedData) => {
    if (!item.visibleOnly) return true;
    const field = item.visibleOnly.field;
    const equals = item.visibleOnly.equals;
    const presence = item.visibleOnly.presence;
    let isVisible = true;
    if (equals) {
        isVisible = selectedData[field] === equals;
    } else {
        if (selectedData[field]) {
            isVisible = presence;
        } else {
            isVisible = !presence;
        }
    }
    return isVisible;
};