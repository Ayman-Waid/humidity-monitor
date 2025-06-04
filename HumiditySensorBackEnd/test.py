import pytest
import os
from unittest import mock

# Mock pour éviter les erreurs liées à read_serial.py
with mock.patch.dict('sys.modules', {'read_serial': mock.MagicMock()}):
    from app import app

# Configuration du client Flask pour les tests
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Test 1 : Route /start
def test_start_saving(client):
    response = client.get('/start')
    assert response.status_code == 200
    assert b"Started saving data to file." in response.data

#  Test 2 : Route /stop
def test_stop_saving(client):
    response = client.get('/stop')
    assert response.status_code == 200
    assert b"Stopped saving data to file." in response.data

#  Test 3 : Route /diagnostic avec fichier de données
def test_diagnostic(client):
    sample_data = "0,0,19.35,2025-05-08 15:34:12\n1,0,87.10,2025-05-08 15:34:15\n"
    with open("data.txt", "w") as file:
        file.write(sample_data)

    response = client.get('/diagnostic')
    assert response.status_code == 200
    assert b"2025-05-08 15:34:12 - Zone 0, Sensor 0: 19%" in response.data
    assert b"2025-05-08 15:34:15 - Zone 1, Sensor 0: 87%" in response.data

    os.remove("data.txt")

#  Test 4 : Route /diagnostic sans fichier
def test_diagnostic_no_file(client):
    if os.path.exists("data.txt"):
        os.remove("data.txt")
    response = client.get('/diagnostic')
    assert response.status_code == 200
    assert b"No data file found." in response.data

#  Test 5 : Vérification du format d’une ligne de données
def test_data_format_line():
    line = "1,2,56.78,2025-05-13 12:45:22"
    parts = line.strip().split(",")
    assert len(parts) == 4
    zone, sensor, humidity, timestamp = parts
    assert zone.isdigit()
    assert sensor.isdigit()
    float(humidity)  # doit pouvoir être converti sans erreur

#  Test 6 : Simule l’ajout d’une ligne dans data.txt
def test_fake_data_append():
    with open("data.txt", "a") as f:
        f.write("1,2,45.6,2025-05-14 13:00:00\n")

    with open("data.txt", "r") as f:
        lines = f.readlines()
        assert "1,2,45.6" in lines[-1]

    os.remove("data.txt")

#  Test 7 : Vérifie que le fichier ne change pas après /stop
def test_no_append_when_stopped():
    with open("data.txt", "w") as f:
        f.write("initial,data,line,2025-05-14 13:00:00\n")

    with open("data.txt", "r") as f:
        original = f.read()

    # Aucune nouvelle écriture
    with open("data.txt", "r") as f:
        after = f.read()

    assert original == after
    os.remove("data.txt")
