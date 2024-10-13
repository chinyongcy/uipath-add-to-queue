import yaml
import sys


def get_packaged_files_path():
    """Location of relative paths """
    if getattr(sys, 'frozen', False):
        path = sys._MEIPASS
    else:
        path = '.'
    return path


class Configs:
    def __init__(self, file) -> None:

        self.configs = yaml.safe_load(file)

        self.flask_debug = self.configs["Flask"]["Debug"]
        self.flask_host = self.configs["Flask"]["Host"]
        self.page_title = self.configs["PageTitle"]
        try:
            self.flask_port = self.configs["Flask"]["Port"]
        except ValueError:
            raise ValueError("Ensure Flask port is an integer!")

        self.init_form_config()
        self.init_uipath_config()
        # self.keys = list(self.data.keys())

    def init_form_config(self):
        forms_fields_default = self.configs["FormsFieldsDefault"]
        self.forms = self.configs["Forms"]
        for form, form_details in self.forms.items():
            # Check Value
            if "Values" not in form_details:
                raise Exception(f"Configs: No 'Value' found in {form}")
            # Check Queue Name
            if "Queue Name" not in form_details:
                raise Exception(f"Configs: No 'Queue Name' found in {form} ")
            # Normalise Configs with default values
            for idx, (value, configs) in enumerate(form_details["Values"].items()):
                if configs:
                    form_details["Values"][value] = forms_fields_default | configs
                else:
                    form_details["Values"][value] = forms_fields_default.copy()
                form_details["Values"][value]["Order"] = idx
        return self.forms

    def init_uipath_config(self):
        uipath_default = self.configs["UiPathDefault"]
        self.uipath_token = self.configs["UiPath"]["TOKEN"]["Value"]
        self.uipath = self.configs["UiPath"]

        for idx, (cfg_name, cfg_values) in enumerate(self.uipath.items()):
            if cfg_values:
                self.uipath[cfg_name] = uipath_default | cfg_values
            else:
                self.uipath[cfg_name] = uipath_default.copy()
            self.uipath[cfg_name]["Order"] = idx
        # Remove default token Values first
        self.uipath["TOKEN"]["Value"] = None
        return self.uipath
