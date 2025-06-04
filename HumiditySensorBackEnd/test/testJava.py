import pytest
from py4j.java_gateway import JavaGateway
import requests
import socket

# ----------------------------
# 1. Test Py4J vers Java RMI
# ----------------------------
def test_send_data_to_rmi():
    gateway = JavaGateway()
    try:
        gateway.entry_point.sendDataToRMI("0,0,19.35")
        gateway.entry_point.sendDataToRMI("0,1,87.10")
    except Exception as e:
        pytest.fail(f"Py4J sendDataToRMI failed: {e}")

# -------------------------------------------------
# 2. Test HTTP Java API : /api/sensor?zone=0&sensor=0
# -------------------------------------------------
def test_http_sensor():
    try:
        r = requests.get("http://localhost:8080/api/sensor?zone=0&sensor=0")
        assert r.status_code == 200
        assert "value" in r.json()
    except Exception as e:
        pytest.fail(f"HTTP sensor API failed: {e}")

# --------------------------------------------
# 3. Test HTTP Java API : /api/zones
# --------------------------------------------
def test_http_zones():
    try:
        r = requests.get("http://localhost:8080/api/zones")
        assert r.status_code == 200
        json = r.json()
        assert "zones" in json
        assert "averageMoisture" in json
    except Exception as e:
        pytest.fail(f"HTTP zones API failed: {e}")

# ------------------------------------------
# 4. Test bas niveau : socket brut HTTP Java
# ------------------------------------------
def test_socket_java_http():
    try:
        with socket.socket() as s:
            s.connect(("localhost", 8080))
            s.sendall(b"GET /api/sensor?zone=0&sensor=1 HTTP/1.1\r\nHost: localhost\r\n\r\n")
            resp = s.recv(4096).decode()
            assert "HTTP/1.1 200 OK" in resp
    except Exception as e:
        pytest.fail(f"Socket HTTP failed: {e}")
