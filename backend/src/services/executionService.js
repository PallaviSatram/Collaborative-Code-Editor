const axios = require("axios");

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";

const languageIds = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
    go: 60,
    rust: 73,
};

class ExecutionService {

    async executeCode(language, code, stdin = "") {

        const languageId = languageIds[language];

        if (!languageId) {
            throw new Error(
                `Language '${language}' is not supported for execution.`
            );
        }

        // Step 1: Create submission
        const submissionResponse = await axios.post(
            `${JUDGE0_URL}/submissions`,
            {
                source_code: code,
                language_id: languageId,
                stdin: stdin,
            },
            {
                params: {
                    base64_encoded: "false",
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                },
            }
        );

        const token = submissionResponse.data.token;

        console.log("Judge0 Submission Token:", token);

        // Step 2: Wait for execution result
        let result;

        while (true) {

            const response = await axios.get(
                `${JUDGE0_URL}/submissions/${token}`,
                {
                    params: {
                        base64_encoded: "false",
                    },
                    headers: {
                        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
                    },
                }
            );

            result = response.data;

            console.log(
                "Judge0 Status:",
                result.status?.description
            );

            // Status 1 = In Queue
            // Status 2 = Processing
            if (
                result.status?.id !== 1 &&
                result.status?.id !== 2
            ) {
                break;
            }

            // Wait 500ms before checking again
            await new Promise((resolve) => {
                setTimeout(resolve, 500);
            });
        }

        return {
            stdout: result.stdout || "",
            stderr: result.stderr || "",
            compileOutput: result.compile_output || "",
            status: result.status?.description || "Unknown",
            time: result.time || null,
            memory: result.memory || null,
        };
    }
}

module.exports = new ExecutionService();