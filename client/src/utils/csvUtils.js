// Function to convert the JSON (array of objects) to CSV.
const arrayToCsv = (headers, data) => {
  const csvRows = [];

  // Get header labels and push as comma separated values.
  const headerValues = headers.map((header) => header.label);
  csvRows.push(headerValues.join(","));

  // Get rows and push as comma separated values.
  for (const row of data) {
    const rowValues = headers.map((header) => {
      const escaped = ("" + row[header.key]).replace(/"/g, '\\"'); // Escape quotes.
      return `"${escaped}"`; // Escape commas in addresses.
    });
    csvRows.push(rowValues.join(",")); // Push rows as comma separated values.
  }

  return csvRows.join("\n"); // Separate rows by new line.
};

// Function to download the generated CSV as a .csv file.
const download = (data, fileName) => {
  const blob = new Blob([data], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Main function to generate and download the CSV file.
export const generateCSV = (header, data, filename) => {
  const csvData = arrayToCsv(header, data);
  download(csvData, filename);
};
