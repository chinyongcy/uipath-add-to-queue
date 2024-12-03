import requests
import json

for x in range(10):
    url = "https://cloud.uipath.com/thatcy/DefaultTenant/odata/Jobs?$filter=State eq 'Running'"

    payload = {}
    headers = {
        'Authorization': 'Bearer rt_C70B63527A6D7FCFEE15DC1AF6C87547DF091FFD8AA772A18446FB60B55B0CAA-1',
        'Content-Type': 'application/json'
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    values = response.json()['value']

    ids = [x['Id'] for x in values]

    print(f"Found: {len(ids)} Jobs")
    if len(ids) > 1:
        url = "https://cloud.uipath.com/thatcy/DefaultTenant/odata/Jobs/UiPath.Server.Configuration.OData.StopJobs"

        payload = json.dumps({
            "jobIds": ids,
            "strategy": "2"
        })
        headers = {
            'Authorization': 'Bearer rt_C70B63527A6D7FCFEE15DC1AF6C87547DF091FFD8AA772A18446FB60B55B0CAA-1',
            'X-UIPATH-OrganizationUnitId': '5005121',
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)

        print(response.status_code)
