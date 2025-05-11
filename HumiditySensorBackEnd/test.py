import pytest
import os
from unittest import mock

#  Mock read_serial pour casser l'import circulaire
with mock.patch.dict('sys.modules', {'read_serial': mock.MagicMock()}):
    from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_start_saving(client):
    response = client.get('/start')
    assert response.status_code == 200
    assert b"Started saving data to file." in response.data

def test_stop_saving(client):
    response = client.get('/stop')
    assert response.status_code == 200
    assert b"Stopped saving data to file." in response.data

def test_diagnostic(client):
    # Simule des données de diagnostic
    sample_data = "0,0,19.35,2025-05-08 15:34:12\n1,0,87.10,2025-05-08 15:34:15\n"
    with open("data.txt", "w") as file:
        file.write(sample_data)

    response = client.get('/diagnostic')
    assert response.status_code == 200
    assert b"2025-05-08 15:34:12 - Zone 0, Sensor 0: 19%" in response.data
    assert b"2025-05-08 15:34:15 - Zone 1, Sensor 0: 87%" in response.data

    os.remove("data.txt")
