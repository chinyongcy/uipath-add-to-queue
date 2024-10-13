function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toggleModalHistory(show) {
  const modal = document.getElementById("historyModal");
  if (show) {
    modal.classList.remove("hidden");
    renderHistory();
  } else {
    modal.classList.add("hidden");
  }
}

function historyPrevPage() {
  if (historyCurPage > 1) historyCurPage--;
  renderHistory();
}

function historyNextPage() {
  if (historyCurPage * historyPageSize < history.length) historyCurPage++;
  renderHistory();
}

function generateRefresh(status, idx) {
  refreshDiv = "";
  if (!["New", "InProgress"].includes(status)) {
    refreshDiv += `
          <td class="p-2 border-b text-left">
              <span class="text-gray-400">-</span>`;
  } else {
    refreshDiv += `<td class="p-2 border-b text-left cursor-pointer" onclick="refreshQueueStatus(event, ${idx})">
                  <span id="refresh${idx}"class="underline text-green-600">Refresh</span>`;
  }
  refreshDiv += "</td>";
  return refreshDiv;
}

function generateStatus(status) {
  let colour = "text-red-600";
  if (["New", "InProgress"].includes(status)) {
    colour = "text-amber-600";
  } else if (["Successful"].includes(status)) {
    colour = "text-green-600";
  }
  return `<span class="${colour}"><b>${status}</b></span>`;
  //   Other Status are Failed, Abandoned, Retired, Deleted
}

function renderHistory() {
  let historytable = document.querySelector("#historyTable tbody");
  let pageNumber = document.getElementById("pageNumber");
  pageNumber.innerHTML = `page ${historyCurPage} of ${Math.ceil(
    history.length / historyPageSize
  )}`;
  let tableData = "";
  let start = (historyCurPage - 1) * historyPageSize;
  let end = start + historyPageSize;

  for (let i = start; i < end && i < history.length; i++) {
    // Code to be executed for each element in the array
    reversedIdx = history.length - i;
    tableData += `
        <tr class="odd:bg-gray-100 hover:bg-yellow-300" onclick="toggleModalHistoryDetails(true, history[${i}], ${reversedIdx})">
            <td class="p-2 border-b text-left">
                ${reversedIdx}
            </td>
            <td class="p-2 border-b text-left">
                ${history[i]["Request Type"]}
            </td>
            <td class="p-2 border-b text-left">
                ${generateStatus(history[i]["Status"])}
            </td>
            <td class="p-2 border-b text-left">
                ${history[i]["Status Last Updated"]}
            </td>
            ${generateRefresh(history[i]["Status"], i)}
            <td class="p-2 border-b text-left cursor-pointer" onclick="deleteHistory(event, ${i})">
                <span class="underline text-red-600">🗑️Delete</span>
            </td>
        </tr>
    `;
  }
  historytable.innerHTML = tableData;
}

async function refreshQueueStatus(event, idx) {
  event.stopPropagation();
  queueID = history[idx]["Queue ID"];
  const response = await fetch(
    `${window.location.origin}/checkqueuestatus?queueID=${queueID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Api-Endpoint": localStorage.getItem("API_ENDPOINT"),
        Organisation: localStorage.getItem("ORGANISATION"),
        "Tenant-Name": localStorage.getItem("TENANT_NAME"),
        "Folder-Id": localStorage.getItem("FOLDER_ID"),
        Token: localStorage.getItem("TOKEN"),
      },
    }
  );
  const response_msg = await response.json();
  if (response.ok) {
    history[idx]["Status Last Updated"] = new Date().toLocaleString();
    history[idx]["Status"] = response_msg["Status"];
    history[idx]["Status Details"] = {
      CreationTime: response_msg["CreationTime"],
      StartProcessing: response_msg["StartProcessing"],
      EndProcessing: response_msg["EndProcessing"],
      Progress: response_msg["EndProcessing"],
      ErrorMsg: null,
    };
  } else {
    history[idx]["Status Last Updated"] = new Date().toLocaleString();
    history[idx]["Status Details"]["ErrorMsg"] = response_msg["message"];
  }
  //   Write back to localstorage
  localStorage.setItem("history", JSON.stringify(history));
  const refreshText = document.getElementById(`refresh${idx}`);
  refreshText.innerHTML = "Refreshed✅";
  await sleep(1000);
  renderHistory();
}

function deleteHistory(event, idx) {
  event.stopPropagation();
  reversedIdx = history.length - idx;
  const result = confirm(
    `Are you sure you want to delete history for #${reversedIdx}?`
  );
  if (result) {
    history.splice(idx, 1);
    //   Write back to localstorage
    localStorage.setItem("history", JSON.stringify(history));
    renderHistory();
  }
}

function deleteAllHistory() {
  const result = confirm(
    `Are you sure you want to delete all history (${history.length} records)?`
  );
  if (result) {
    history = [];
    localStorage.setItem("history", JSON.stringify(history));
    renderHistory();
  }
}
