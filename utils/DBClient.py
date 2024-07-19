from sqlalchemy import create_engine, text

class DBClient:
    def __init__(self, user, password, host, port, database):
        self.user = user
        self.password = password
        self.host = host
        self.port = port
        self.database = database
        self.engine = self.connect()

    def connect(self):
        connection_string = f"sqlanywhere://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"
        engine = create_engine(connection_string)
        return engine

    def insert_to_database(self, table, data):
        """
        Inserts data into the specified table.
        
        Parameters:
        table (str): The name of the table to insert data into.
        data (dict): A dictionary containing the column names as keys and the corresponding data as values.
        """
        with self.engine.connect() as connection:
            columns = ', '.join(data.keys())
            values = ', '.join([f":{key}" for key in data.keys()])
            query = text(f"INSERT INTO {table} ({columns}) VALUES ({values})")
            connection.execute(query, **data)

    def fetch_from_database(self, query):
        """
        Fetches data from the database based on the provided query.
        
        Parameters:
        query (str): The SQL query to execute.
        
        Returns:
        result (list): A list of dictionaries where each dictionary represents a row.
        """
        with self.engine.connect() as connection:
            result = connection.execute(text(query))
            rows = result.fetchall()
            result_list = [dict(row) for row in rows]
            return result_list

# Example usage:
if __name__ == "__main__":
    
    
    # Inserting data into the table
    data = {
        'column1': 'value1',
        'column2': 'value2'
    }
    db_client.insert_to_database('table_name', data)
    
    # Fetching data from the database
    query = "SELECT * FROM table_name"
    results = db_client.fetch_from_database(query)
    print(results)
