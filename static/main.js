// Webgazer setup
async function startEyeTracking(clearPreviousData = false) {
    // clear previous data
    if (clearPreviousData) webgazer.clearData();

    // start the webgazer tracker
    await webgazer.setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener(function(data, elapsedTime) {
            if (data == null) return;
        })
        .saveDataAcrossSessions(true)
        .begin();

    webgazer.showVideoPreview(true) /* shows all video previews */
        .showPredictionPoints(true) /* shows a square every 100 milliseconds where current prediction is */
        .applyKalmanFilter(true); /* Kalman Filter defaults to on. Can be toggled by user. */
}