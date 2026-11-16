import os

import requests


BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")


def test_api_root_returns_ready_message():
    response = requests.get(f"{BASE_URL}/api/", timeout=15)
    assert response.status_code == 200
    assert response.json()["message"] == "Just For You is ready"


def test_response_rejects_missing_reason():
    response = requests.post(
        f"{BASE_URL}/api/responses", json={"message": "TEST_no_reason"}, timeout=15
    )
    assert response.status_code == 422
    assert "reason" in response.text


def test_response_returns_clear_configuration_error_when_email_key_missing():
    response = requests.post(
        f"{BASE_URL}/api/responses",
        json={"reason": "TEST_reason", "message": "TEST_message"},
        timeout=15,
    )
    assert response.status_code == 503
    assert response.json()["detail"] == "Email notification is not configured yet"