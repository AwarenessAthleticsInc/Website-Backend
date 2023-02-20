

exports.config = (app) => {
    const cluster = require("cluster");
    const os = require("os");
    const NumCpu = os.cpus().length;
    if (cluster.isMaster) {
        require('../configs/automation').config();
        for (var i = 0; i < NumCpu; i++) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code, singal) => {
            // console.log("worker " + worker.process.pid + " died");
            cluster.fork();
        })
    } else {
        if (process.env.NODE_ENV === "development") {
            app.listen(5000, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Started PID: " + process.pid + " @ localhost:5000");
            });
        } else {
            app.listen(function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("Started PID: " + process.pid + " @ localhost:5000");
            });
        }
    }
}