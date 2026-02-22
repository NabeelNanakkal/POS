import { formatDateTime, formatDateWithTime } from "./formatDateTime";
import * as XLSX from 'xlsx';
import { formatCamelCaseToTitle } from "./formateCamelCaseString";

const formatValueByType = (value, type) => {
    if (value === undefined || value === null) return "";

    switch (type) {

        case "date":
            return formatDateTime(value);

        case "dateTime":
            return formatDateWithTime(value);
        case "number":
            return (value || 0);
        case "cash":
            return (value);

        case "distance":
            return typeof value === 'number'
                ? `${(value / 1000).toFixed(2)} Km`
                : value;
        case "duration":
            return typeof value === 'number'
                ? `${(value / 60).toFixed(2)} Hr`
                : value;
        default:
            return value || "";
    }
};

const itemVisibility = (item, selectedData) => {
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

export const downloadCSV = (fileName, data, fieldsToExport, exclude) => {
    if (!fieldsToExport || fieldsToExport.length === 0) {
        const excludeFields = exclude || [];
        const headers = Object.keys(data[0]).filter(header => !excludeFields.includes(header));
        if (headers.length === 0) return;
        const csvRows = [];
        csvRows.push(headers.join(","));
        for (const row of data) {
            const values = headers.map(header => {
                const escaped = ("" + (row[header] || "")).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(","));
        }
        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName || 'data'}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
    }


    const excludeFields = exclude || [];
    const validFields = fieldsToExport.filter(field =>
        field.type !== "divider" &&
        field.type !== "button" &&
        // field.fieldName &&
        !excludeFields.includes(field.fieldName)
    );

    if (validFields.length === 0) return;

    const headers = validFields.map(field => field.label);
    const csvRows = [];
    csvRows.push(headers.join(","));
    for (const row of data) {
        const values = validFields.map(field => {
            const formattedValue = formatValueByType(row[field.fieldName], field.type);
            const escaped = ("" + (formattedValue || "")).replace(/"/g, '""');
            if (field.visibleOnly && !itemVisibility(field, row)) {
                return `""`;
            } else {
                return `"${escaped}"`;
            }
        });
        csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || 'data'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};


export const downloadExcel = (fileName, data, fieldsToExport, exclude) => {
    if (!data || data.length === 0) return;
    const excludeFields = exclude || [];
    let worksheet;

    if (!fieldsToExport || fieldsToExport.length === 0) {
        const headersRaw = Object.keys(data[0]).filter(
            (header) => !excludeFields.includes(header)
        );
        if (headersRaw.length === 0) return;

        const headers = headersRaw.map(formatCamelCaseToTitle);
        const worksheetData = data.map((row) =>
            headersRaw.map((header) => row[header] || "")
        );
        worksheet = [headers, ...worksheetData];
    } else {
        const validFields = fieldsToExport.filter(field =>
            field.type !== "divider" &&
            field.type !== "button" &&
            field.fieldName &&
            !excludeFields.includes(field.fieldName)
        );

        const headers = validFields.map(field => field.label);
        const rowsData = data.map(row =>
            validFields.map(field => {

                if (field.visibleOnly && !itemVisibility(field, row)) {
                    return ""
                } else {
                    return formatValueByType(row[field.fieldName], field.type)

                }
            })
        );

        worksheet = [headers, ...rowsData];
    }
    const ws = XLSX.utils.aoa_to_sheet(worksheet);
    const colCount = worksheet[0].length;
    ws['!cols'] = Array(colCount).fill({ wch: 20 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName || 'data'}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

