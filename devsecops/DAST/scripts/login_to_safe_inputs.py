from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
import time
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv(dotenv_path='../.env')
homepage_url = os.getenv('HOMEPAGE_URL')

def login_to_safe_inputs():
    # Set up Selenium WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument('--proxy-server=http://localhost:8090')  # Route traffic through ZAP proxy
    driver = webdriver.Chrome(options=options)

    try:
        # Navigate to the login page
        driver.get(homepage_url)

        # Fill in the email field
        email_field = driver.find_element(By.ID, 'email')
        email_field.send_keys('owner-axe@phac-aspc.gc.ca')

        # Click the Sign In button
        sign_in_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        sign_in_button.click()

        # Handle dev environment bypass
        bypass_link = driver.find_element(By.XPATH, "//text()[contains(.,'Or click here to complete authentication')]/..")
        bypass_link.click()

        # Wait for navigation to complete
        time.sleep(5)

        print("Login successful, session is now authenticated.")

    finally:
        # Keep the browser open or close it
        driver.quit()

if __name__ == "__main__":
    login_to_safe_inputs()
