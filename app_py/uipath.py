import logging
from urllib.parse import urljoin
import requests
import json
from datetime import datetime


def pretty_json(json_object, indent=4):
    return json.dumps(json_object, indent=indent)


class UiPath:
    def __init__(self, api_endpoint: str, org: str, tenant_name: str, folder_id: str, personal_access_token: str):
        self.api_endpoint = api_endpoint
        self.org = org
        self.tenant_name = tenant_name
        self.base_endpoint = urljoin(
            self.api_endpoint, f"{self.org}/{self.tenant_name}/")
        self.auth_header = {
            'Authorization': f"Bearer {personal_access_token}"
        }
        self.folder_id = folder_id

    def request(self, path: str, req_type: str, params=None, headers=None, body=None):
        url = urljoin(self.base_endpoint, path)
        logging.info(f"{req_type.upper()}: {url}")
        # Merge Additional Headers if Available
        if headers:
            headers = headers | self.auth_header
        else:
            headers = self.auth_header
        match req_type.lower():
            case "get":
                res = requests.get(
                    url,
                    headers=headers,
                    params=params
                )
            case "post":
                res = requests.post(
                    url,
                    headers=headers,
                    json=body
                )
            case _:
                logging.info("Error")

        return res

    def add_queue(self, queue_name, reference, data, priority="Normal"):
        path = "odata/Queues/UiPathODataSvc.AddQueueItem"
        now = datetime.utcnow().isoformat(sep='T', timespec='microseconds') + 'Z'
        headers = {
            "X-UIPATH-OrganizationUnitId": self.folder_id,
            "Content-Type": "application/json"
        }
        body = {
            "itemData": {
                "DeferDate": now,
                "DueDate": now,
                "Priority": priority,
                "Name": queue_name,
                "SpecificContent": data,
                "Reference": reference
            }
        }
        res = self.request(path, "post", headers=headers, body=body)
        return res

    def get_queue_status(self, queue_id):
        path = "odata/QueueItems({})"
        path = path.format(queue_id)
        headers = {
            "X-UIPATH-OrganizationUnitId": self.folder_id,
            "Content-Type": "application/json"
        }
        res = self.request(path, "get", headers=headers)
        return res
