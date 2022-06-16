// Instructions
function showInstructions() {
    let instructions = `
        <p style="text-align: left">
            Before running the experiment, the eye-tracker needs to be calibrated:
            <ul style="text-align: left">
                <li>Wait until the video loads and the tracker starts capturing your face.</li>
                <li>For the eye-tracker to function properly, make sure you have good ambient light conditions and, if possible, do not wear glasses. This may reduce the eye-tracker accuracy.
                <li>Also, please <b>*remember*</b> to keep your head in the same position and as still as possible for the duration of the experiment.</li>
                <li>To calibrate your eye movements, click on each point repeatedly until it disappears.</li>
                <li>The floating red dot shows your real time gaze prediction on the screen.</li>
            </ul>
        </p>
    `;

    swal.fire({
        title: "Calibration",
        html: instructions
    }).then(() => {
        webgazer.showVideo(false);
        calibration();
    })
}

// Calibration points
function calibration() {
    let canvas = document.getElementById('plotting_canvas');

    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.backgroundColor = "white";

        class Circle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.radius = 10;
                this.nClicked = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fillStyle = `rgba(255,  0, 0, ${1 - 1/maxClicks * this.nClicked})`;
                ctx.fill();
                if (canvas.style.backgroundColor == "white") {
                    ctx.strokeStyle = "black";
                } else {
                    ctx.strokeStyle = "white";
                }
                ctx.stroke();
            }
        }

        function drawCircle(i) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            calibrationPoints = setCalibrationPoints(canvas.width, canvas.height);

            circle.x = calibrationPoints[i].x; 
            circle.y = calibrationPoints[i].y;
            circle.draw();
        }

        // function drawRandomPoint() {
        //     canvas.style.backgroundColor = "black";
        //     ctx.clearRect(0, 0, canvas.width, canvas.height);

        //     circle.x = Math.floor(Math.random() * canvas.width);
        //     circle.y = Math.floor(Math.random() * canvas.height);
        //     circle.draw();
        // }

        function gazeInside(gazeX, gazeY, trueX, trueY, radius) {
             return Math.sqrt( (trueX - gazeX)*(trueX - gazeX) + (trueY - gazeY)*(trueY - gazeY) ) < radius;
        }

        function setCalibrationPoints(cw, ch) {
            return [
                {x: cw*0.05, y: ch*0.05},
                {x: cw*0.35, y: ch*0.05},
                {x: cw*0.65, y: ch*0.05},
                {x: cw*0.95, y: ch*0.05},
                {x: cw*0.95, y: ch*0.35},
                {x: cw*0.65, y: ch*0.35},
                {x: cw*0.35, y: ch*0.35},
                {x: cw*0.05, y: ch*0.35},
                {x: cw*0.05, y: ch*0.65},
                {x: cw*0.35, y: ch*0.65},
                {x: cw*0.65, y: ch*0.65},
                {x: cw*0.95, y: ch*0.65},
                {x: cw*0.95, y: ch*0.95},
                {x: cw*0.65, y: ch*0.95},
                {x: cw*0.35, y: ch*0.95},
                {x: cw*0.05, y: ch*0.95}
            ];
        }

        let calibrationPoints = setCalibrationPoints(canvas.width, canvas.height);
        let nPointsClicked = 0;
        const maxClicks = 5;
        const dataX = [];
        const dataY = [];

        // Step 1
        circle = new Circle();
        drawCircle(nPointsClicked);
        
        addEventListener("mousedown", function(e) {
            if (gazeInside(e.clientX, e.clientY, circle.x, circle.y, circle.radius)) {
                circle.nClicked++;
                if (circle.nClicked == maxClicks) {
                    circle.nClicked = 0;
                    nPointsClicked++;
                }
                if (nPointsClicked < calibrationPoints.length) {
                    drawCircle(nPointsClicked);
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // swal.fire({
                    //     title: "Calculating accuracy",
                    //     text: "Please don't move your mouse and stare at the middle dot for the next 5 seconds. This will allow us to calculate the accuracy of our predictions.",
                    //     allowEscapeKey: false,
                    //     allowOutsideClick: false
                    // }).then(() => {
                    //     ctx.beginPath();
                    //     ctx.arc(canvas.width/2, canvas.height/2, 100, 0, Math.PI * 2, true);
                    //     ctx.closePath();
                    //     ctx.fillStyle = "red";
                    //     ctx.fill();

                    //     webgazer.setGazeListener(function(data) {
                    //         dataX.push(data.x);
                    //         dataY.push(data.y);
                    //     });

                    //     setTimeout(() => {
                    //         let precision = calculatePrecision(dataX, dataY);
                    //         let precisionString;
                    //         let nextPage;

                    //         if (precision < 10) {
                    //             precisionString = "Please do the calibration again.";
                    //             nextPage = "{{ url_for('calibration') }}";
                    //         } else {
                    //             precisionString = "Great! Let's try the experiment.";
                    //             nextPage = "{{ url_for('experiment') }}";
                    //         }

                    //         swal.fire({
                    //             title: "Your accuracy measure is: " + precision + "%",
                    //             text: precisionString,
                    //         }).then(() => {
                    //             window.location.href = nextPage;
                    //         })
                    //     }, 5000);
                    // })
                    setTimeout(() => {
                    	webgazer.showPredictionPoints(false);
                    	swal.fire({
                    		title: "Calibrated!",
                    		// text: "Your accuracy is: ",
                    		icon: "success",
                    		allowOutsideClick: false,
                    		// confirmButtonColor: '#3085d6',
                    		// confirmButtonText: "OK"
                    	}).then(() => {
                    		window.location.href = "/experiment";
                    	});
                    }, 200);
                }
            }
        });

        function calculatePrecision(dataX, dataY) {
            let precision = 0;

            for (let i=0; i<dataX.length; i++) {
                precision = precision + gazeInside(dataX[i], dataY[i], canvas.width/2, canvas.height/2, 100);
            }
            precision = Math.floor(precision/dataX.length * 100);

            return precision;
        }

        // Resize canvas
        addEventListener("resize", () => {
            canvas.height = innerHeight;
            canvas.width = innerWidth;
            drawCircle(nPointsClicked);
        });
    } else {
        console.log("Canvas API not supported");
    }
}		