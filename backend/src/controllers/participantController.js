const participantService = require("../services/participantService");

class ParticipantController {

    async getRecentRooms(req, res) {

        try {

            const username = req.user.username;

            const page = Math.max(
                parseInt(req.query.page) || 1,
                1
            );

            const limit = Math.min(
                parseInt(req.query.limit) || 5,
                5
            );

            const rooms =
                await participantService.getRecentRooms(
                    username,
                    limit,
                    (page - 1) * limit
                );

            const hasMore =
                rooms.length === limit;

            res.status(200).json({
                rooms,
                page,
                limit,
                hasMore,
            });

        } catch (error) {

            console.error(
                "❌ Get recent rooms error:",
                error
            );

            res.status(500).json({
                message: "Failed to fetch recent rooms",
            });

        }

    }

}

module.exports = new ParticipantController();