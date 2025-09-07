import requests
import sys
from datetime import datetime
import json

class NetSurfAPITester:
    def __init__(self, base_url="https://callflow-netsurf.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                except:
                    print(f"   Response: {response.text}")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text
                })

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e)
            })
            return False, {}

    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("\n" + "="*50)
        print("TESTING HEALTH ENDPOINTS")
        print("="*50)
        
        # Test root endpoint
        self.run_test("Root Endpoint", "GET", "api/", 200)
        
        # Test health endpoint
        self.run_test("Health Check", "GET", "api/health", 200)

    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n" + "="*50)
        print("TESTING AUTHENTICATION")
        print("="*50)
        
        # Test valid login
        valid_data = {
            "email": "test@netsurfdirect.com",
            "password": "Invorto2025"
        }
        self.run_test("Valid Login", "POST", "api/auth/login", 200, data=valid_data)
        
        # Test invalid domain
        invalid_domain_data = {
            "email": "test@gmail.com",
            "password": "Invorto2025"
        }
        self.run_test("Invalid Domain", "POST", "api/auth/login", 401, data=invalid_domain_data)
        
        # Test invalid password
        invalid_password_data = {
            "email": "test@netsurfdirect.com",
            "password": "wrongpassword"
        }
        self.run_test("Invalid Password", "POST", "api/auth/login", 401, data=invalid_password_data)

    def test_call_logging(self):
        """Test call logging endpoints"""
        print("\n" + "="*50)
        print("TESTING CALL LOGGING")
        print("="*50)
        
        # Test create call log
        call_data = {
            "user_email": "test@netsurfdirect.com",
            "phone_number": "9876543210",
            "call_attempted": "No",
            "pcap": "netsurf"
        }
        success, response = self.run_test("Create Call Log", "POST", "api/calls/log", 200, data=call_data)
        
        # Test get call logs
        self.run_test("Get All Call Logs", "GET", "api/calls/logs", 200)
        
        # Test get call logs with filter
        self.run_test("Get Filtered Call Logs", "GET", "api/calls/logs?user_email=test@netsurfdirect.com", 200)

    def test_legacy_endpoints(self):
        """Test legacy status endpoints"""
        print("\n" + "="*50)
        print("TESTING LEGACY ENDPOINTS")
        print("="*50)
        
        # Test create status check
        status_data = {
            "client_name": "test_client"
        }
        self.run_test("Create Status Check", "POST", "api/status", 200, data=status_data)
        
        # Test get status checks
        self.run_test("Get Status Checks", "GET", "api/status", 200)

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("TEST SUMMARY")
        print("="*60)
        print(f"📊 Tests Run: {self.tests_run}")
        print(f"✅ Tests Passed: {self.tests_passed}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print("\n🚨 FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"\n{i}. {test['name']}")
                if 'error' in test:
                    print(f"   Error: {test['error']}")
                else:
                    print(f"   Expected: {test['expected']}, Got: {test['actual']}")
                    print(f"   Response: {test['response']}")
        
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return len(self.failed_tests) == 0

def main():
    print("🚀 Starting NetSurf Direct Call Management API Tests")
    print("="*60)
    
    tester = NetSurfAPITester()
    
    # Run all test suites
    tester.test_health_endpoints()
    tester.test_authentication()
    tester.test_call_logging()
    tester.test_legacy_endpoints()
    
    # Print final summary
    all_passed = tester.print_summary()
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())