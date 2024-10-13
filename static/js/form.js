function populateForm() {
  const selectedType = document.getElementById("formType").value;
  const formValues = formsData[selectedType]["Values"];

  // Clear previous fields
  const formDiv = document.getElementById("dynamicForm");
  formDiv.innerHTML = "";

  // Create an array from the formValues and sort it based on the "Order" key
  const sortedFields = sortFields(formValues);

  // Loop through the sorted fields and create input fields
  for (const [key, field] of sortedFields) {
    // Create a wrapper div for the label and input
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "mb-4";

    // Create the label
    const label = document.createElement("label");
    label.className = "block text-gray-700 text-sm font-bold mb-2";
    label.setAttribute("for", key);
    label.innerHTML = key + ":";
    wrapperDiv.appendChild(label);

    // Create the input field
    const input = document.createElement("input");
    input.className =
      "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"; // Added placeholder color
    input.id = key;
    input.type = "text";
    input.name = key;
    input.placeholder = field["Placeholder"] || "";
    input.value = field["Default"] || "";
    if (field["Regex"] != null) {
      input.pattern = field["Regex"];
    }
    if (field["RegexMsg"] != null) {
      input.title = field["RegexMsg"];
    }
    if (field["Optional"] != false) {
      input.required = true;
    }
    wrapperDiv.appendChild(input);

    // Append the wrapper to the formDiv
    formDiv.appendChild(wrapperDiv);
  }
}

async function submitQueueForm(event) {
  event.preventDefault();
  const form = event.target;
  // Gather the form data
  const formData = new FormData(form);
  const queueData = Object.fromEntries(formData.entries());
  const { queueType, ...queueDataWithoutType } = queueData;
  // Build Request Body
  const requestBody = {
    uiPathConfigs: {
      API_ENDPOINT: localStorage.getItem("API_ENDPOINT"),
      TENANT_NAME: localStorage.getItem("TENANT_NAME"),
      FOLDER_ID: localStorage.getItem("FOLDER_ID"),
      TOKEN: localStorage.getItem("TOKEN"),
      ORGANISATION: localStorage.getItem("ORGANISATION"),
      EMAIL: localStorage.getItem("EMAIL"),
    },
    queueData: Object.fromEntries(formData.entries()),
  };

  let new_history = {
    "Request Type": queueData["queueType"],
    "Request Value": queueDataWithoutType,
    "Request Date": new Date().toLocaleString(),
    Status: "Pending",
    "Status Details": "Pending",
    "Status Last Updated": new Date().toLocaleString(),
    "Queue ID": null,
    "UiPath Configs": requestBody["uiPathConfigs"],
  };

  try {
    // Make the API call using fetch
    const response = await fetch(window.location.origin + "/submitqueueform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const response_msg = await response.json();
    console.log(response_msg);
    // Check if the response is successful
    if (response.ok) {
      new_history["Status Last Updated"] = new Date().toLocaleString();
      new_history["Status"] = response_msg["Status"];
      new_history["Status Details"] = {
        CreationTime: response_msg["CreationTime"],
        StartProcessing: response_msg["StartProcessing"],
        EndProcessing: response_msg["EndProcessing"],
        Progress: response_msg["EndProcessing"],
        ErrorMsg: null,
      };
      new_history["Queue ID"] = response_msg["Id"];
      new_history["UiPath Configs"]["Queue Name"] =
        response_msg["UiPathQueueName"];
      history = [new_history, ...history];
      localStorage.setItem("history", JSON.stringify(history));
      alert(
        "✅ Request submitted successfully! You can check the status at the history page."
      );
    } else {
      new_history["Status"] = "Error";
      new_history["Status Details"] = {
        CreationTime: null,
        StartProcessing: null,
        EndProcessing: null,
        Progress: null,
        ErrorMsg: JSON.stringify(response_msg),
      };
      new_history["Queue ID"] = null;
      new_history["UiPath Configs"]["Queue Name"] =
        response_msg["UiPathQueueName"];
      history = [new_history, ...history];
      localStorage.setItem("history", JSON.stringify(history));
      alert(
        "❌ Request failed! Please check the history page for more details!"
      );
    }
    console.log(new_history);
  } catch (error) {
    new_history["Status"] = "Error";
    new_history["Status Details"] = {
      CreationTime: null,
      StartProcessing: null,
      EndProcessing: null,
      Progress: null,
      ErrorMsg: JSON.stringify(response_msg),
    };
    new_history["Queue ID"] = null;
    history = [new_history, ...history];
    localStorage.setItem("history", JSON.stringify(history));
    alert("❌ Request failed! Please check the history page for more details!");
  }
  location.reload();
}
