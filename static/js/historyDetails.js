function toggleModalHistoryDetails(show, historydetails, idx) {
  const modal = document.getElementById("historyDetailsModal");
  if (show) {
    renderHistoryDetails(historydetails, idx);
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}
function mapToString(map) {
  let result = "";

  // Loop through each key-value pair in the map
  for (const [key, value] of Object.entries(map)) {
    result += `<b>${key}:</b> <i>${value}</i><br />`; // Append key-value pair to result string
  }
  return result.trim(); // Remove any trailing newline character
}

function renderHistoryDetails(historydetails, idx) {
  const title = document.getElementById("historyDetailTitle");
  title.innerHTML = `#${idx} - ${historydetails["Request Type"]}`;
  const historyDetailsDiv = document.getElementById("historyDetails");
  details = "";
  details += `
    <div>
        <b><u>Request Info</u></b></br/>
        <b>Request Type:</b> ${historydetails["Request Type"]}<br />
        <b>Request Date:</b> ${historydetails["Request Date"]}<br />
        
        <br/><b><u>Request Values</u></b><br/>
        ${mapToString(historydetails["Request Value"])}
    </div>

    <div>
        <b><u>UiPath Status Info</u></b></br/>
        <b>Status Last Refeshed:</b> 
            ${historydetails["Status Last Updated"]}<br />
        <b>Status:</b> ${historydetails["Status"]}<br />
        <b>Queue ID:</b> ${historydetails["Queue ID"]}<br />
        <b>CreationTime</b>: ${
          historydetails["Status Details"]["CreationTime"]
        }<br />
        <b>Progress</b>: ${historydetails["Status Details"]["Progress"]}<br />
        <b>StartProcessing</b>: ${
          historydetails["Status Details"]["StartProcessing"]
        }<br />
        <b>EndProcessing</b>: ${
          historydetails["Status Details"]["EndProcessing"]
        }<br />
        <b>ErrorMsg</b>: ${historydetails["Status Details"]["ErrorMsg"]}<br />
    </div>
    <div>
        <b><u>UiPath Config</u></b></br/>
        ${mapToString(historydetails["UiPath Configs"])}
    </div>
  `;
  historyDetailsDiv.innerHTML = details;
}
