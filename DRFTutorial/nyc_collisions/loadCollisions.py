import sys, os, django

sys.path.append('C:\\Users\\Yuhua\\Desktop\\DjangoProjs\\DRFTutorial')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DRFTutorial.settings")
django.setup()

from nyc_collisions.models import Collision
from datetime import datetime
from tqdm import tqdm
import pandas as pd


def create_collision(row):
    record = Collision()
    record.date = datetime.strptime(row[1], '%m/%d/%Y').date()
    record.time = datetime.strptime(row[2], '%H:%M').time()
    record.borough = row[3]
    record.zip_code = int(row[4]) if type(row[4]) != str else None
    record.latitude = float(row[5]) if row[5] != '' else None
    record.longitude = float(row[6]) if row[6] != '' else None
    record.location = row[7]
    record.on_street_name = row[8]
    record.cross_street_name = row[9]
    record.off_street_name = row[10]
    record.number_of_persons_injured = row[11]
    record.number_of_persons_killed = row[12]
    record.number_of_pedestrians_injured = row[13]
    record.number_of_pedestrians_killed = row[14]
    record.number_of_cyclist_injured = row[15]
    record.number_of_cyclist_killed = row[16]
    record.number_of_motorist_injured = row[17]
    record.number_of_motorist_killed = row[18]
    record.contributing_factor_vehicle_1 = row[19]
    record.contributing_factor_vehicle_2 = row[20]
    record.contributing_factor_vehicle_3 = row[21]
    record.contributing_factor_vehicle_4 = row[22]
    record.contributing_factor_vehicle_5 = row[23]
    record.unique_key = row[24]
    record.vehicle_type_code_1 = row[25]
    record.vehicle_type_code_2 = row[26]
    record.vehicle_type_code_3 = row[27]
    record.vehicle_type_code_4 = row[28]
    record.vehicle_type_code_5 = row[29]
    return record


if __name__ == "__main__":
    df = pd.read_csv('C:\\Users\\Yuhua\\Desktop\\VMs\\VMSharedFolder\\datasets\\NYPD_Motor_Vehicle_Collisions.csv')
    df = df.fillna('')

    # collisions = df.apply(lambda x: create_collision(x)).tolist()
    collisions = [create_collision(record) for record in tqdm(list(df.itertuples()))]
    del df
    print("Saving Begins ...")
    Collision.objects.bulk_create(collisions)
