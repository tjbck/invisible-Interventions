const tracking = (user_id, extension_id) => {
  console.log(user_id, extension_id);
  // User Tracking
  setInterval(async () => {
    if (!document.hidden) {
      const res = await fetch(
        `https://interventions.sfu.jryng.com/tracking/usage`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_id,
            extension_id: extension_id,
          }),
        }
      )
        .then(async (res) => {
          if (!res.ok) throw await res.json();
          return await res.json();
        })
        .catch((err) => {
          console.log("tracking", err);

          if (err.detail === "User ID not found") {
            chrome.storage.local.clear().then(() => {
              console.log("Value is set");
            });
            window.location.reload();
          }

          return null;
        });
      console.log("tracking", res);
    }
  }, 5000);
};

function showModal(
  text = "From now on, you will be unable to save your credentials. You will have to log in each time you open up Tik Tok. ",
  title = "activated"
) {
  // Create the modal container
  const modal = document.createElement("div");

  // Function to hide the modal
  function hideModal() {
    console.log("hideModal");
    modal.remove();
  }

  modal.style.display = "flex";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "999999999";

  // Create the modal content
  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "5px";
  modalContent.style.textAlign = "center";
  modalContent.innerHTML += `<p> <span style="font-weight:bold;">Your extension has been ${title} </span><br/>${text}</p>`;

  // Create the close button
  const closeButtonElement = document.createElement("div");
  closeButtonElement.style.cssText =
    "width:100%; cursor: pointer; margin-top: 0.5rem; font-weight: 600; padding-top: 0.5rem; padding-bottom: 0.5rem;border-radius: 0.5rem; background-color: rgb(220 252 231 / 1); color: rgb(22 101 52 / 1);";
  closeButtonElement.innerHTML += "Okay";
  closeButtonElement.style.cursor = "pointer";

  modalContent.appendChild(closeButtonElement);

  modal.appendChild(modalContent);

  // Append the modal to the document body

  document.body.insertBefore(modal, document.body.firstChild);

  // Add click event to close the modal
  closeButtonElement.onclick = () => {
    hideModal();
  };
}

chrome.storage.local.get().then((result) => {
  console.log("Stored: " + JSON.stringify(result));
  console.log(Math.round(Date.now() / 1000));

  if (!result.installation_timestamp) {
    // Save the timestamp when the user first installs the extension
    chrome.storage.local
      .set({ installation_timestamp: Math.round(Date.now() / 1000) })
      .then(() => {
        console.log("Value is set");
      });
  }

  if (!result.user_id) {
    // If user_id cannot be found in the extension
    // Open the pre-exp survey
    chrome.runtime.sendMessage({ action: "survey" }, function (response) {
      console.log("Response: ", response);
    });

    // Block app access
    // Click on the button to reload the page with the user_id
    const reloadButton = document.createElement("div");
    reloadButton.style.cssText =
      "width:100vw; height: 100vh;background:rgb(250, 250, 250); color: black; display: flex;justify-content: center; align-items: center;text-align: center; border-right: solid 0.5px gray;";
    reloadButton.innerHTML += "Click me after the survey to access the app!";
    reloadButton.onclick = () => {
      window.location.reload();
    };

    document.body.innerHTML = "";
    document.body.insertBefore(reloadButton, document.body.firstChild);
  } else {
    //////////////////
    // MAIN
    //////////////////

    // if user_id % 2 == 0, Activate the intervention now and disable after a week
    // if user_id % 2 == 1, Activate the intervention after a week (60sec * 60 * 24 * 7)
    if (
      (result.user_id % 2 == 0 &&
        Math.round(Date.now() / 1000) <
          result.installation_timestamp + 60 * 60 * 24 * 2) ||
      (result.user_id % 2 == 1 &&
        Math.round(Date.now() / 1000) >
          result.installation_timestamp + 60 * 60 * 24 * 2)
    ) {
      // Activate only if not already activated
      chrome.storage.local.get("activated", (result) => {
        if (result.activated === undefined) {
          chrome.storage.local.set({ activated: true }, () => {
            showModal(
              "Starting now, every 3 minutes, you'll receive a prompt to gently shake your phone in order to continue using the app. This feature is designed to encourage periodic breaks and mindfulness, helping you maintain a healthier balance with your screen time. We hope it supports you in staying in control of your usage while enjoying your app."
            );
            console.log("Intervention activated for the first time");
          });
        } else {
          console.log("The intervention is currently active");
        }
      });

      tracking(result.user_id, "shake-to-continue");

      //////////////////
      // Intervention
      //////////////////

      // Create the modal container
      const modal = document.createElement("div");

      // Function to hide the modal
      function hideModal() {
        console.log("hideModal");
        modal.remove();
      }

      modal.style.display = "flex";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.zIndex = "999999999";

      // Create the modal content
      const modalContent = document.createElement("div");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.padding = "20px";
      modalContent.style.borderRadius = "5px";
      modalContent.style.textAlign = "center";
      modalContent.innerHTML += `<p> <span style="font-weight:bold;">Shake your phone!</span><br/>Please shake your phone in order to continue using the app. This feature is designed to encourage periodic breaks and mindfulness, helping you maintain a healthier balance with your screen time.</p>`;
      modal.appendChild(modalContent);

      const vibrate = () => {
        navigator.vibrate([500]);
      };

      if ("LinearAccelerationSensor" in window) {
        // Create a new LinearAccelerationSensor
        const sensor = new LinearAccelerationSensor({ frequency: 10 });

        // Initialize variables
        let lastAcceleration = { x: 0, y: 0, z: 0 };

        // Event handler for sensor data
        sensor.onreading = () => {
          const currentAcceleration = {
            x: sensor.x,
            y: sensor.y,
            z: sensor.z,
          };

          // Calculate the magnitude of acceleration change
          const accelerationMagnitude = Math.abs(
            currentAcceleration.x -
              lastAcceleration.x +
              currentAcceleration.y -
              lastAcceleration.y +
              currentAcceleration.z -
              lastAcceleration.z
          );

          // Threshold for shake detection (you can adjust this value)
          const shakeThreshold = 15;

          // Check if the acceleration change exceeds the threshold
          if (accelerationMagnitude > shakeThreshold) {
            vibrate();
            hideModal();
          }

          // Update last acceleration
          lastAcceleration = currentAcceleration;
        };

        // Start the sensor
        sensor.start();
      }

      setInterval(() => {
        console.log("times up");
        // Append the modal to the document body
        document.body.insertBefore(modal, document.body.firstChild);
      }, 3 * 60 * 1000);
    } else {
      // Activate only if intervention has been activated before
      chrome.storage.local.get("activated", (result) => {
        if (result.activated === true) {
          chrome.storage.local.set({ activated: false }, () => {
            showModal(
              "The intervention has been disabled, feel free to use the app as you normally would for another week.",
              "disabled"
            );
            console.log("Intervention disabled for the first time");
          });
        } else {
          console.log("The intervention is currently disabled");
        }
      });

      tracking(result.user_id, "inactive");
    }
  }
});
