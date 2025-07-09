"use server";

const baseUrl = "https://content-out.bepress.com/v2/scholarcommons.scu.edu/";
const init = {
  method: "GET", // or 'POST', 'PUT', etc.
  headers: {
    Authorization: process.env.DIGITAL_COMMONS_API_TOKEN, // Add any necessary authorization headers
  },
};

async function validateResponse(response) {
  if (!response.ok) {
    throw new Error("Response status: ${response.status}");
  }

  const resultJson = await response.json();
  return resultJson.results;
}

// Function returns n  of the oldest previous theses that a faculty advisor has advised
// Parameters:
// - facultyName: Name of faculty to search for
// - n: Number of results to return. If not set, will return at most 100 results.
// Invariance: Will throw an error if facultyName is undefined.
// Example:
// const previousAdvisedProjects = await getFacultyPreviousProjects("Jane Doe", 10);
// Returns:
// Array of the 10 oldest theses that Jane Doe has advised.
export async function getFacultyPreviousProjects(facultyName, n) {
  "use server";
  if (facultyName === undefined) {
    throw new Error("Faculty Required to be defined");
  }
  const queryUrl =
    baseUrl +
    "query?virtual_ancestor_link=http://scholarcommons.scu.edu/eng_senior_theses&select_fields=all" +
    (n ? "&limit=" + n : "") +
    "&configured_field_t_advisor=" +
    facultyName;

  const response = await fetch(queryUrl, init);
  return await validateResponse(response);
}

// Function returns n of the oldest previous theses with the filter keywords associated in the abstract
// Parameters:
// - filters: Array of keywords to filter results
// - n: Number of results to return. If not set, will return at most 100 results
// Example:
// const results = wait getThesesWithKeywordFilters(["AI", "Cloud", "HPC"])
// Returns:
// Array of 100 oldest theses that have "AI", "Cloud", or "HPC" in the abstract.
//!@todo: Do we need to remove dups? I.e say an abstract has AI and cloud, on the AI query it will return and the cloud query it will return.
export async function getThesesWithKeywordFilters(filters, n) {
  const limitField = n ? "&limit=" + n : "";

  const queryUrl =
    baseUrl +
    "query?virtual_ancestor_link=http://scholarcommons.scu.edu/eng_senior_theses&select_fields=all" +
    limitField;
  let results = [];
  console.log(filters);
  for (let i = 0; i < filters.length; i++) {
    const requestUrl = queryUrl + "&abstract=" + filters[i];
    console.log(requestUrl);
    const response = await fetch(requestUrl, init);
    const result = await validateResponse(response);
    for (let j = 0; j < result.length; j = j + 1) {
      results.findIndex((item) => {
        return item["context_key"] === result[j]["context_key"];
      }) === -1
        ? results.push(result[j])
        : undefined;
    }
  }
  return results;
}

export async function getThesesWithDepartments(departments, n) {
  const limitField = n ? "&limit=" + n : "";
  console.log(departments);
  const queryUrl =
    baseUrl +
    "query?virtual_ancestor_link=http://scholarcommons.scu.edu/eng_senior_theses&select_fields=all" +
    limitField;
  var results = [];
  // Need to request multiple times as digital commons RESTv2 api doesn't allow for logical filtering.
  for (let i = 0; i < departments.length; i = i + 1) {
    const requestUrl = queryUrl + "&subject_area=" + departments[i];
    console.log(requestUrl);
    const response = await fetch(requestUrl, init);
    const result = await validateResponse(response);
    // For each response make sure that a unique response hasn't already been returned due to interdisciplinary projects
    // @note: This will get slow if we try to request more than 20 at a time.
    for (let j = 0; j < result.length; j = j + 1) {
      results.findIndex((item) => {
        return item["context_key"] === result[j]["context_key"];
      }) === -1
        ? results.push(result[j])
        : undefined;
    }
  }
  //console.log(results);
  return results;
}

export async function getTheses(n) {
  const limitField = n ? "&limit=" + n : "";
  const queryUrl =
    baseUrl +
    "query?virtual_ancestor_link=http://scholarcommons.scu.edu/eng_senior_theses&select_fields=all" +
    limitField;
  const response = await fetch(queryUrl, init);
  return validateResponse(response);
}

export async function getThesisWithContextKey(contextKey) {
  const queryUrl =
    baseUrl +
    "query?virtual_ancestor_link=http://scholarcommons.scu.edu/eng_senior_theses&select_fields=all";
  const requestUrl = queryUrl + "&context_key=" + contextKey;
  console.log(requestUrl);
  const response = await fetch(requestUrl, init);
  return validateResponse(response);
}
