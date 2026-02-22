import React from 'react';
import { Tooltip } from '@mui/material';
import Status from 'components/Status';
import Priority from 'components/Priority';
import { getShortForm } from 'utils/getShortForm';
import { cellItemVisibility } from 'utils/fieldUtils';
import { formatAmountWithComma } from 'utils/formatAmount';
import { formatDateTime, formatDateWithTime, formatTimeOnly } from 'utils/formatDateTime';

const CellDataRenderer = ({ column, row }) => {

  const value = row[column?.fieldName] || row[column?.altFieldName];

  return (
    <>
      {(!column.visibleOnly || cellItemVisibility(column, row)) && (
        <Tooltip
          title={
            column.type === 'cash'
              ? formatAmountWithComma(value)
              : column.type === 'date' || column.type === 'objectDate'
                ? formatDateTime(value)
                : column.type === 'time'
                  ? formatDateTime(value)
                  : column.type === 'dateTime'
                    ? formatDateWithTime(value)
                    : column.type === 'combined'
                      ? column?.fields.map((field) => row[field.fieldName] || '-').join(' - ')
                      : column?.type === 'bracket'
                        ? `${value} ${row[column?.bracketFieldName] !== undefined ? `(${row[column?.bracketFieldName]})` : ''}`
                        : column?.type === 'short-bracket'
                          ? `${value} ${row[column?.bracketFieldName] !== undefined ? `(${getShortForm(row[column?.bracketFieldName])})` : ''}`
                          : value || '-'
          }
          placement="top"
          enterDelay={300}
        >
          <span>
            {column.type === 'cash' ? (
              formatAmountWithComma(value)
            ) : column.type === 'date' ? (
              formatDateTime(value)
            ) : column.type === 'objectDate' ? (
              formatDateTime(value?.iso)
            ) : column.type === 'distance' ? (
              `${((value || 0) / 1000).toFixed(2)} Km`
            ) : column.type === 'dateTime' ? (
              formatDateWithTime(value)
            ) : column.type === 'time' ? (
              formatTimeOnly(value)
            ) : column.type === 'count' ? (
              value || '0'
            ) : column.type === 'status' ? (
              <Status status={value || ''} />
            ) : column.type === 'priority' ? (
              <Priority priority={value || ''} />
            ) : column.type === 'combined' ? (
              column.fields.map((field) => row[field.fieldName] || '-').join(' - ')
            ) : column.type === 'bracket' ? (
              `${value} ${row[column?.bracketFieldName] !== undefined ? `(${row[column?.bracketFieldName]})` : ''}`
            ) : column.type === 'short-bracket' ? (
              `${value} ${row[column?.bracketFieldName] !== undefined ? `(${getShortForm(row[column?.bracketFieldName])})` : ''}`
            ) : (
              value || '-'
            )}
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default CellDataRenderer;
