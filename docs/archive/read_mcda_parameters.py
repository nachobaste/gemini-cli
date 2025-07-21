import pandas as pd

def read_excel_parameters(file_path):
    df = pd.read_excel(file_path)
    parameters = []
    for index, row in df.iterrows():
        parameters.append({
            "category": row["Section"],
            "parameter": row["Parameter"],
            "description": row["Description"],
            "evaluation_criteria": row["Evaluation Criteria (1 = Least Favorable, 5 = Most Favorable)"],
            "score": row["Score"]
        })
    return parameters

file_path = "/home/ubuntu/upload/MCDAParameters.xlsx"
parameters_data = read_excel_parameters(file_path)

# Print the extracted data to a file for later use
with open("/home/ubuntu/mcd_parameters.txt", "w") as f:
    for param in parameters_data:
        f.write(str(param) + "\n")


