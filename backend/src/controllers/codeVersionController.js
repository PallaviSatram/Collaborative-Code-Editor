const codeVersionService = require("../services/codeVersionService");

// Save a new version
const createVersion = async (req, res) => {

    try {

        const {
            roomId,
            message,
            code,
            language,
        } = req.body;

        // Validate required fields
        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required",
            });
        }

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Version message is required",
            });
        }

        if (code === undefined || code === null) {
            return res.status(400).json({
                success: false,
                message: "Code is required",
            });
        }

        if (!language) {
            return res.status(400).json({
                success: false,
                message: "Language is required",
            });
        }

        // Get authenticated user
        const userId = req.user.id;
        const username = req.user.username;

        const version = await codeVersionService.createVersion({
            roomId,
            userId,
            username,
            message: message.trim(),
            code,
            language,
        });

        return res.status(201).json({
            success: true,
            version,
        });

    } catch (error) {

        console.error(
            "❌ Create version error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to save code version",
        });
    }
};


// Get all versions for a room
const getRoomVersions = async (req, res) => {

    try {

        const { roomId } = req.params;

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room ID is required",
            });
        }

        const versions =
            await codeVersionService.getRoomVersions(roomId);

        return res.status(200).json({
            success: true,
            versions,
        });

    } catch (error) {

        console.error(
            "❌ Get versions error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch code versions",
        });
    }
};


// Get one specific version
const getVersion = async (req, res) => {

    try {

        const { versionId } = req.params;

        if (!versionId) {
            return res.status(400).json({
                success: false,
                message: "Version ID is required",
            });
        }

        const version =
            await codeVersionService.getVersion(versionId);

        if (!version) {
            return res.status(404).json({
                success: false,
                message: "Version not found",
            });
        }

        return res.status(200).json({
            success: true,
            version,
        });

    } catch (error) {

        console.error(
            "❌ Get version error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch version",
        });
    }
};


module.exports = {
    createVersion,
    getRoomVersions,
    getVersion,
};