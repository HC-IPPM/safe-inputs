from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import time
from dotenv import load_dotenv
import os



# Load .env file
load_dotenv(dotenv_path='../.env')
# homepage_url = os.getenv('HOMEPAGE_URL')
# homepage_url="https://8080-cs-281831690367-default.cs-us-east1-pkhd.cloudshell.dev/"
# homepage_url = "http://127.0.0.1:8080/"
homepage_url = "http://ui:8080"

def login_to_safe_inputs():
    # # Set up Selenium WebDriver
    # options = webdriver.ChromeOptions()
    # options.add_argument('--proxy-server=http://localhost:8090')  # Route traffic through ZAP proxy
    # driver = webdriver.Chrome(options=options)

    # For selenium container 
    # Connect to the Selenium container
    selenium_host = os.getenv('SELENIUM_HOST', '127.0.0.1')
    selenium_port = os.getenv('SELENIUM_PORT', '4444')

    # Set up remote WebDriver
    driver = webdriver.Remote(
        command_executor=f'http://{selenium_host}:{selenium_port}/wd/hub',
        options=webdriver.ChromeOptions()
    )

    try:
        # Navigate to the login page
        driver.get(homepage_url)
        print("Navigated to homepage!")

               # Debugging: Save raw page source
        raw_html = driver.page_source
        with open("page_source_raw.html", "w", encoding="utf-8") as file:
            file.write(raw_html)

        # Pretty-print HTML using BeautifulSoup
        soup = BeautifulSoup(raw_html, "html.parser")
        formatted_html = soup.prettify()
        with open("page_source_pretty.html", "w", encoding="utf-8") as file:
            file.write(formatted_html)

        # Save a screenshot
        driver.save_screenshot("login_page_screenshot.png")
        print("Debugging artifacts saved.")


        # # print(driver.page_source)
        # with open("formatted_page_source.html", "w", encoding="utf-8") as file:
        #     file.write(formatted_html)

        # Fill in the email field
        email_field = driver.find_element(By.ID, 'email')
        # email_field = WebDriverWait(driver, 10).until(
        #     EC.presence_of_element_located((By.ID, 'email'))
        # )
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
