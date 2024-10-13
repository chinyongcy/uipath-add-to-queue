function sortFields(values) {
  return Object.entries(values).sort((a, b) => {
    return a[1].Order - b[1].Order;
  });
}
function setDefaultConfig(configs) {
  const result = confirm(`Are you sure you want to reset all config settings?`);
  if (result) {
    for (const [key, field] of configs) {
      localStorage.setItem(key, field["Value"]);
    }
    loadConfigDiv(configs);
  }
}

function loadConfig(configs) {
  for (const [key, field] of configs) {
    if (
      !localStorage.hasOwnProperty(key) ||
      localStorage.getItem(key) === "null"
    ) {
      localStorage.setItem(key, field["Value"]);
    }
  }
}

function updateSubmitButton(configs) {
  const allKeysPresent = configs.every(([key, { Optional }]) => {
    const value = localStorage.getItem(key);
    toggleModalConfig;
    // If the key is not optional, it must be present and valid
    if (!Optional) {
      return value !== null && value !== "null"; // Check if value is not null or string 'null'
    } else {
      return true;
    }
  });
  const submitButton = document.getElementById("queueSubmit");
  const submitButtonMsg = document.getElementById("queueSubmitMsg");
  if (allKeysPresent) {
    submitButton.classList.remove("bg-gray-500");
    submitButton.classList.add("bg-blue-500");
    submitButton.classList.add("hover:bg-blue-600");
    submitButton.disabled = false; // Enable the button
    submitButtonMsg.innerHTML = "";
    enableDropdownFormType(true);
  } else {
    submitButton.classList.remove("bg-blue-500");
    submitButton.classList.remove("hover:bg-blue-600");
    submitButton.classList.add("bg-gray-500");
    submitButton.disabled = true; // Disable the button
    submitButtonMsg.innerHTML =
      "Config not complete, please input the uipath config at the top right!";
    enableDropdownFormType(false);
  }
}

function enableDropdownFormType(enable) {
  const formType = document.getElementById("formType");
  if (enable) {
    formType.disabled = false;
    formType.classList.remove("bg-gray-400");
  } else {
    formType.disabled = true;
    formType.classList.add("bg-gray-400");
  }
}

function loadConfigDiv(configs) {
  const configDiv = document.getElementById("configForm");
  configDiv.innerHTML = "";
  // Loop through the sorted fields and create input fields
  for (const [key, field] of configs) {
    if (!field["Hidden"]) {
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
      input.value =
        localStorage.getItem(key) !== "null" ? localStorage.getItem(key) : "";
      if (field["Regex"] != null) {
        input.pattern = field["Regex"];
      }
      if (field["RegexMsg"] != null) {
        input.title = field["RegexMsg"];
      }
      if (field["Optional"] == false) {
        input.required = true;
      }
      wrapperDiv.appendChild(input);

      // Append the wrapper to the formDiv
      configDiv.appendChild(wrapperDiv);
    }
  }
}

function toggleModalConfig(show, configs) {
  const modal = document.getElementById("configModal");
  if (show) {
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
    if (configs !== undefined) {
      updateSubmitButton(configs);
    }
  }
}

function updateConfig(event, configs) {
  event.preventDefault();
  const formFields = document.getElementById("configForm");
  const inputs = formFields.querySelectorAll("input");
  // Loop through each input and get the value or manipulate it
  inputs.forEach((input) => {
    if (input.value != "") {
      localStorage.setItem(input.id, input.value);
    } else {
      localStorage.setItem(input.id, null);
    }
  });
  toggleModalConfig(false, configs);
}
