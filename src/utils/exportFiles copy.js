import { formatDateTime, formatDateWithTime } from "./formatDateTime";

const formatValueByType = (value, type) => {
    if (value === undefined || value === null) return "";

    switch (type) {

        case "date":
            return formatDateTime(value);

        case "dateTime":
            return formatDateWithTime(value);
        case "number":
            return (value || 0);

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
export const downloadCSV = (data, configs, fieldsToExport) => {
    if (!data || data.length === 0) return;

    if (!fieldsToExport || fieldsToExport.length === 0) {
        const excludeFields = configs?.exclude || [];
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
        a.download = `${configs?.fileName || 'data'}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return;
    }


    const excludeFields = configs?.exclude || [];
    const validFields = fieldsToExport.filter(field =>
        field.type !== "divider" &&
        field.fieldName &&
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
            return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${configs?.fileName || 'data'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};


export const downloadExcel = (data, configs, fieldsToExport) => {
    if (!data || data.length === 0) return;
    const excludeFields = configs?.exclude || [];
    if (!fieldsToExport || fieldsToExport.length === 0) {
        const headers = Object.keys(data[0]).filter(header => !excludeFields.includes(header));
        if (headers.length === 0) return;

        const worksheet = [headers, ...data.map(row => headers.map(header => row[header] || ""))];
        const ws = XLSX.utils.aoa_to_sheet(worksheet);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${configs?.fileName || 'data'}.xlsx`);
        return;
    }


    const validFields = fieldsToExport.filter(field =>
        field.type !== "divider" &&
        field.fieldName &&
        !excludeFields.includes(field.fieldName)
    );
    const headers = validFields.map(field => field.label);

    const rowsData = data.map(row => {
        return validFields.map(field => {
            // Format the value based on the field type
            return formatValueByType(row[field.fieldName], field.type);
        });
    });

    const worksheet = [headers, ...rowsData];
    const ws = XLSX.utils.aoa_to_sheet(worksheet);

    // Optional: Add some cell styling based on field types
    if (ws['!cols'] === undefined) ws['!cols'] = [];
    validFields.forEach((field, idx) => {
        // Set column width based on size
        const sizeMap = {
            sm: 10,
            md: 15,
            lg: 20,
            xl: 25,
            xxl: 30
        };
        ws['!cols'][idx] = { width: sizeMap[field.size] || 12 };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${configs?.fileName || 'data'}.xlsx`);
};

