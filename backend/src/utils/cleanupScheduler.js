const roomService = require("../services/roomService");

function startCleanupScheduler() {

    console.log("🧹 Room cleanup scheduler started.");

    const cleanupInterval =
        Number(process.env.ROOM_CLEANUP_INTERVAL_MS) ||
        24 * 60 * 60 * 1000;

    setInterval(async () => {

        console.log("🧹 Running room cleanup...");

        await roomService.cleanupInactiveRooms();

    }, cleanupInterval);

}

module.exports = startCleanupScheduler;