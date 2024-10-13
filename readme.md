## Python

1. Have python installed `https://www.python.org/downloads/`
2. Run `pip install -r requirements.txt`

## NPX Generate Class

- This is not necessary, unless you want to change the style!

### Pre-requisite

1. Need to install npm `https://nodejs.org/en/download/package-manager`
2. After that run `npm install` at the root of this repo

### During development or before package

- If you have made changes to the style, new classes are introduce you can run the following to generate new css
- `npx tailwindcss -i ./static/css/style.css -o ./static/css/output-style.css --watch`

## Packaging into EXE

- Ensure pyinstaller is installed `https://pyinstaller.org/en/stable/`
- Ensure you have a `config.yaml` file. See `config.sample.yaml`. Remember to make a copy and rename to `config.yaml`
- At this project root folder run the following:
- `pyinstaller -w -F --add-data "templates;templates" --add-data "static;static" --add-data "config.yaml;." main.py`
- .exe file should appear in `dist` folder as `main.exe`

## UiPath API

- Permission: `https://docs.uipath.com/orchestrator/automation-cloud/latest/api-guide/permissions-per-endpoint`
- Adding Queue Item: `https://docs.uipath.com/orchestrator/automation-cloud/latest/api-guide/transactions-requests#adding-a-queue-item`
- Queue Items Request: `https://docs.uipath.com/orchestrator/automation-cloud/latest/api-guide/queue-items-requests`
