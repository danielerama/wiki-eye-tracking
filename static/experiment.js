// Instructions
function showInstructions() {
    let instructions = `
        <p style="text-align: left">
            You are about to start the tasks. Here are some instructions:
            <ul style="text-align: left">
                <li><b>Remember!</b> Keep your head in the same position as in the calibration stap and as still as possible for each task.</li>
                <li>Each task consists of a Wikipedia article and a question to answer.</li>
                <li>Feel free to read any part of the article you think is relavant: written paragraphs, images, captions, etc.</li>
                <li>To find an answer may require up to several minutes, but this task is not about time! Take your time to find the correct information.</li>
                <li>Once you have the answer, just click the <i>Type</i> button. There is also a quick survey to complete.</li>
                <li>In case you were not able to find an answer, just type <i>no answer</i>.</li>
            </ul>
        </p>
    `;

    swal.fire({
        title: "Task",
        html: instructions
    }).then(() => {
        toggleFullScreen();
        getETData();
    })
}

// Get eye-tracking data
function getETData() {
    const t0 = Date.now();

    webgazer.removeMouseEventListeners();

    webgazer.showVideoPreview(false)
        .showPredictionPoints(false)

    webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null) return;
        // const ETData = {};
        // const iframeOffset = document.getElementById("iframe").getBoundingClientRect().y;

        // ETData.t = Date.now() - t0;
        // ETData.elapsedTime = elapsedTime;
        // ETData.clientX = data.x;
        // ETData.clientY = data.y;
        // ETData.iframeOffset = iframeOffset;
        // ETData.scrollTop = $("#iframe").contents().find("body").scrollTop();
        // $.ajax(
        //     {
        //         type: 'POST',
        //         data: JSON.stringify(ETData),
        //         contentType: 'application/json',
        //         url: '/experiment/et-data',
        //         success: function() {
        //             console.log("data saved");
        //         }
        //     }
        // )
    })
}

// Show answer form
function showAnswerBox() {
    webgazer.pause();
    document.getElementById("insert-button").style.display = "none";
    document.getElementById("answer-form").style.display = "block";
}

// Disable text search (i.e., CMD/CTRL + F)
function disableSearch() {
    document.addEventListener("keydown",function (e) {
        if ((e.ctrlKey && e.key === "f") || (e.metaKey && e.key == "f") || (e.key == 114)) { 
            e.preventDefault();
        }
    })

    $('#iframe').load(function(){
        let contents = $(this).contents();
            $(contents).find("body").on('keydown', function(e) { 
            if ((e.ctrlKey && e.key === "f") || (e.metaKey && e.key == "f") || (e.key == 114)) { 
                e.preventDefault();
            }
        });
    });
}

// Fullscreen mode
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }