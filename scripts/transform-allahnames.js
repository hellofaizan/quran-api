const fs = require("fs");
const path = require("path");

// Read the original allahnames.json
const namesPath = path.join(__dirname, "../data/allahnames.json");
const namesData = require(namesPath);

// Transform the data by removing summary field
const transformedData = namesData.map(name => {
  const { summary, location, description, ...nameWithoutSummary } = name;
  return nameWithoutSummary;
});

// Write the transformed data back to allahnames.json
const jsonString = JSON.stringify(transformedData, null, 2);
fs.writeFileSync(namesPath, jsonString);

console.log("Successfully removed summary field from allahnames.json");
