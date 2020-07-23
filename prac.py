from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

path = "D:/chromedriver_win32/chromedriver"
driver = webdriver.Chrome(path)
driver.get("https://kr.investing.com/stock-screener/?sp=country::5|sector::a|industry::a|equityType::a%3Ceq_market_cap;1")

wait = WebDriverWait(driver, 30)
element = wait.until(EC.element_to_be_clickable((By.ID, 'resultsTable')))

driver.find_element_by_xpath("//i[@class='popupCloseIcon largeBannerCloser']").click()

