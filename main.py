from flask import Flask, render_template, request
from app_py.configs import Configs, get_packaged_files_path
from app_py.uipath import UiPath
import webbrowser
import threading
import os
import tkinter as tk

app = Flask(__name__)


# Load Config
packaged_file_path = get_packaged_files_path()
cfg_filepath = os.path.join(packaged_file_path, "config.yaml")
with open(cfg_filepath, 'r') as config_file:
    cfgs = Configs(config_file)


@app.route("/", methods=['GET'])
def index():
    return render_template('index.html', page_title=cfgs.page_title, forms=cfgs.forms, uipath_configs=cfgs.uipath)


@app.route("/submitqueueform", methods=['POST'])
def submitqueueform():
    data = request.get_json()
    uipath_cfg = data["uiPathConfigs"]
    uipath_token = cfgs.uipath_token if uipath_cfg["TOKEN"] == "null" else uipath_cfg["TOKEN"]
    queue_data = data["queueData"]
    uipath = UiPath(
        uipath_cfg["API_ENDPOINT"],
        uipath_cfg["ORGANISATION"],
        uipath_cfg["TENANT_NAME"],
        uipath_cfg["FOLDER_ID"],
        uipath_token
    )
    # Handle Queue Name & Clean up queue data
    queue_type = queue_data["queueType"]
    queue_name = cfgs.forms[queue_type]["Queue Name"]
    queue_data["Requestor Email"] = uipath_cfg["EMAIL"]
    del queue_data["queueType"]
    # Add to queue
    res = uipath.add_queue(
        queue_name,
        uipath_cfg["EMAIL"],
        queue_data
    )
    res_body = res.json()
    res_body["UiPathQueueName"] = queue_name
    return res_body, res.status_code


@app.route("/checkqueuestatus", methods=['GET'])
def checkqueuestatus():
    queue_id = request.args.get("queueID")
    api_endpoint = request.headers.get("Api-Endpoint")
    organisation = request.headers.get("Organisation")
    tenant_name = request.headers.get("Tenant-Name")
    folder_id = request.headers.get("Folder-Id")
    # Get Token, use server token if no token specified
    uipath_token = request.headers.get('Token', cfgs.uipath_token)
    uipath_token = cfgs.uipath_token if uipath_token == "null" else uipath_token
    uipath = UiPath(
        api_endpoint,
        organisation,
        tenant_name,
        folder_id,
        uipath_token,
    )
    res = uipath.get_queue_status(queue_id)
    try:
        res_json = res.json()
        return res_json, res.status_code
    except Exception as e:
        return {"message": f"{res.text}, {e}"}, res.status_code


def run_server(app):
    app.run(debug=cfgs.flask_debug, port=cfgs.flask_port, host=cfgs.flask_host)


# For Tinkter
def open_webpage():
    if cfgs.flask_host == "127.0.0.1":
        webbrowser.open_new(f"http://localhost:{cfgs.flask_port}/")
    else:
        webbrowser.open_new(f"http://{cfgs.flask_host}:{cfgs.flask_port}/")


def exit_program():
    root.quit()


if __name__ == '__main__':
    app.debug = cfgs.flask_debug
    if cfgs.flask_debug:
        run_server(app)
    else:
        root = tk.Tk()
        root.title(cfgs.page_title)
        root.lift()
        root.focus_force()
        root.geometry("300x160")
        button_width, button_height = 20, 3
        open_button = tk.Button(
            root, text="Open Requestor Page", command=open_webpage, width=button_width, height=button_height)
        exit_button = tk.Button(
            root, text="Exit", command=exit_program, width=button_width, height=button_height)
        open_button.pack(pady=10)
        exit_button.pack(pady=10)
        server_thread = threading.Thread(
            target=run_server, args=(app,), daemon=True)
        server_thread.start()
        root.mainloop()
