import sqlite3
import os.path
import logging


def create_sqlite_database(filename):
    """  """

    conn = None
    try:
        conn = sqlite3.connect(filename)
        print(sqlite3.sqlite_version)
    except sqlite3.Error as e:
        print(e)
    finally:
        if conn:
            conn.close()


class Database:
    def __init__(self, db_file_path):
        """Check if db file exists"""
        self.conn = sqlite3.connect(db_file_path)
