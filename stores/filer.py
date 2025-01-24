import pandas as pd
import random
from datetime import datetime

# Create some sample data for 15 Ghanaian students
data = {
    "First Name": ["Kwame", "Ama", "Kofi", "Esi", "Kwabena", "Akosua", "Kojo", "Afia", "Kwame", "Akua", 
                   "Yaw", "Abena", "Kwesi", "Adwoa", "Kojo"],
    "Last Name": ["Asante", "Mensah", "Owusu", "Boateng", "Appiah", "Osei", "Addo", "Tetteh", "Bempong", "Nkrumah", 
                  "Acheampong", "Mensa", "Atta", "Asare", "Ofori"],
    "Gender": ["Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female",
               "Male", "Female", "Male", "Female", "Male"],
    "Nationality": ["Ghanaian"] * 15,
    "Date of Birth (dd-mm-YYYY)": [f"{random.randint(1, 12)}-{random.randint(1, 28)}-2009" for _ in range(15)],
    "Blood Group": ["A", "B", "O", "AB", "A", "B", "O", "AB", "A", "B", "O", "AB", "A", "B", "O"],
    "N.ID or Birth Cert. No": [f"ID{random.randint(1000, 9999)}" for _ in range(15)],
    "Religion": ["Christian", "Muslim", "Christian", "Muslim", "Christian", "Muslim", "Christian", "Muslim", "Christian", 
                 "Muslim", "Christian", "Muslim", "Christian", "Muslim", "Christian"],
    "Contact Phone": [f"024{random.randint(1000000, 9999999)}" for _ in range(15)],
    "Province or State (of origin)": ["Western", "Ashanti", "Greater Accra", "Eastern", "Volta", "Northern", 
                                      "Upper East", "Upper West", "Western", "Central", "Ashanti", "Greater Accra", 
                                      "Eastern", "Volta", "Northern"],
    "ZIP or LGA (of origin)": [f"LGA{random.randint(1, 100)}" for _ in range(15)],
    "Permanent Address": ["Address " + str(i) for i in range(1, 16)],
    "Residential Address": ["Residential Address " + str(i) for i in range(1, 16)],
    "Guardian First Name": ["Kwabena", "Ama", "Kofi", "Esi", "Kwabena", "Akosua", "Kojo", "Afia", "Kwame", "Akua", 
                            "Yaw", "Abena", "Kwesi", "Adwoa", "Kojo"],
    "Guardian Last Name": ["Asante", "Mensah", "Owusu", "Boateng", "Appiah", "Osei", "Addo", "Tetteh", "Bempong", "Nkrumah", 
                           "Acheampong", "Mensa", "Atta", "Asare", "Ofori"],
    "Guardian Full Name": ["Kwabena Asante", "Ama Mensah", "Kofi Owusu", "Esi Boateng", "Kwabena Appiah", "Akosua Osei", 
                           "Kojo Addo", "Afia Tetteh", "Kwame Bempong", "Akua Nkrumah", "Yaw Acheampong", 
                           "Abena Mensa", "Kwesi Atta", "Adwoa Asare", "Kojo Ofori"],
    "Guardian Relationship": ["Father", "Mother", "Father", "Mother", "Father", "Mother", "Father", "Mother", "Father", "Mother",
                              "Father", "Mother", "Father", "Mother", "Father"],
    "Guardian Occupation": ["Farmer", "Teacher", "Trader", "Nurse", "Driver", "Banker", "Teacher", "Doctor", "Driver", "Teacher",
                            "Trader", "Farmer", "Doctor", "Nurse", "Teacher"],
    "Guardian Phone": [f"054{random.randint(1000000, 9999999)}" for _ in range(15)],
    "Guardian Address": ["Guardian Address " + str(i) for i in range(1, 16)],
    "Student Class": ["JHS 3"] * 15
}

# Create a DataFrame
df = pd.DataFrame(data)

# Save the DataFrame to an Excel file
df.to_excel("/mnt/data/PopulatedBulkEnrollStudentsTemplate.xlsx", index=False)

print("Excel file generated successfully!")

