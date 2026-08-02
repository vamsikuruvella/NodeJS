const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");

const connectionModel = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");

cron.schedule("0 8 * * *", async () => {
    try {
        console.log("Running daily summary cron:", new Date());

        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingConnections = await connectionModel
            .find({
                status: "interested",
                createdAt: {
                    $gte: yesterdayStart,
                    $lte: yesterdayEnd,
                },
            })
            .populate("fromUserId", "firstName lastName emailId")
            .populate("toUserId", "firstName lastName emailId");

        console.log(
            `Found ${pendingConnections.length} pending connection requests`
        );

        if (pendingConnections.length === 0) {
            console.log("No pending connections found.");
            return;
        }

        const rows = pendingConnections
            .map(
                (conn) => `
                <tr>
                    <td>${conn.fromUserId.firstName} ${conn.fromUserId.lastName}</td>
                    <td>${conn.fromUserId.emailId}</td>
                    <td>${conn.toUserId.firstName} ${conn.toUserId.lastName}</td>
                    <td>${conn.toUserId.emailId}</td>
                    <td>${conn.status}</td>
                    <td>${new Date(conn.createdAt).toLocaleString()}</td>
                </tr>
            `
            )
            .join("");

        const body = `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:30px;">
            <div style="max-width:900px; margin:auto; background:#fff; padding:30px; border-radius:10px;">
                
                <h2>📊 DevTinder Daily Connection Summary</h2>

                <p>
                    Total new connection requests yesterday:
                    <strong>${pendingConnections.length}</strong>
                </p>

                <table
                    style="width:100%; border-collapse:collapse;"
                    border="1"
                    cellpadding="10"
                >
                    <thead style="background:#4f46e5; color:white;">
                        <tr>
                            <th>From</th>
                            <th>From Email</th>
                            <th>To</th>
                            <th>To Email</th>
                            <th>Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${rows}
                    </tbody>
                </table>

                <p style="margin-top:25px;">
                    This email was generated automatically by the DevTinder daily cron job.
                </p>

            </div>
        </body>
        </html>
        `;

        await sendEmail.run(
            "📊 DevTinder Daily Connection Summary",
            body
        );

        console.log("Daily summary email sent successfully.");

    } catch (error) {
        console.error("Error occurred while running cron job:", error);
    }
});