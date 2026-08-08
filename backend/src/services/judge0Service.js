const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

async function createSubmission({
    sourceCode,
    languageId,
    stdin = "",
}) {

    const response = await fetch(
        `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                source_code: sourceCode,
                language_id: languageId,
                stdin,
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Judge0 submission failed: ${errorText}`
        );
    }

    return await response.json();
}

async function getSubmission(token) {

    const response = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
        {
            method: "GET",
            headers,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Judge0 result fetch failed: ${errorText}`
        );
    }

    return await response.json();
}

module.exports = {
    createSubmission,
    getSubmission,
};