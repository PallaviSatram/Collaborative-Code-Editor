const judge0Service = require("../services/judge0Service");

const languageIds = {
    javascript: 63,
    python: 71,
    java: 62,
    cpp: 54,
};

const executeCode = async (req, res) => {

    try {

        const {
            sourceCode,
            language,
            stdin = "",
        } = req.body;

        if (!sourceCode) {
            return res.status(400).json({
                success: false,
                message: "Source code is required",
            });
        }

        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required",
            });
        }

        const languageId = languageIds[language];

        if (!languageId) {
            return res.status(400).json({
                success: false,
                message: `Language '${language}' is not supported for execution`,
            });
        }

        const submission =
            await judge0Service.createSubmission({
                sourceCode,
                languageId,
                stdin,
            });

        return res.status(200).json({
            success: true,
            token: submission.token,
        });

    } catch (error) {

        console.error(
            "Code execution error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to submit code for execution",
        });

    }
};

module.exports = {
    executeCode,
};