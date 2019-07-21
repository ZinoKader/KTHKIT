const puppeteer = require("puppeteer-core");
const { getOptions } = require("./options");

const LADOK_LOGIN_URL = "https://www.student.ladok.se/student/loggain";
const LADOK_START_BUTTON = ".btn-primary";
const LADOK_LIST_KTH_SELECTOR =
  "[data-href='https://saml.sys.kth.se/idp/shibboleth']";
const LADOK_CONFIRM_SCHOOL_XPATH = "//a[contains(., 'Proceed to Login')]";

const LADOK_USERNAME_INPUT_SELECTOR = "input[name='username']";
const LADOK_PASSWORD_INPUT_SELECTOR = "input[name='password']";
const LADOK_LOGIN_BUTTON_SELECTOR = "input[name='submit']";

const LADOK_CHANGE_LANG_SELECTOR =
  "#navigation-first-meny > .ldk-visa-desktop > .row > .nav-item:nth-child(2) > .nav-link";
const LADOK_GRADES_URL = "https://www.student.ladok.se/student/#/avslutade";
const LADOK_GRADE_CARD_SELECTOR = "ladok-avslutad-kurs > .card > .card-body";

getGrades = async (username, password) => {
  try {
    const options = await getOptions();
    const browser = await puppeteer.launch(options);

    const page = await browser.newPage();
    await page.goto(LADOK_LOGIN_URL);

    const startButton = await page.$(LADOK_START_BUTTON);
    await startButton.click();

    const schoolItem = await page.waitForSelector(LADOK_LIST_KTH_SELECTOR);
    await schoolItem.click();

    const proceedButton = await page.waitForXPath(LADOK_CONFIRM_SCHOOL_XPATH);
    await proceedButton.click();

    await page
      .waitForSelector(LADOK_USERNAME_INPUT_SELECTOR)
      .then(input => input.type(username));

    await page
      .waitForSelector(LADOK_PASSWORD_INPUT_SELECTOR)
      .then(input => input.type(password));

    await page
      .waitForSelector(LADOK_LOGIN_BUTTON_SELECTOR)
      .then(button => button.click());

    await page
      .waitForSelector(LADOK_CHANGE_LANG_SELECTOR)
      .then(button => button.click());

    await page.goto(LADOK_GRADES_URL);
    await page.waitFor(1000);

    await page.waitForSelector(LADOK_GRADE_CARD_SELECTOR);

    const grades = await page.$$eval(LADOK_GRADE_CARD_SELECTOR, gradeCards => {
      return gradeCards.map(gradeCard => {
        const courseInfo = gradeCard.getElementsByTagName("a")[0].innerText;
        const c = courseInfo.split(" | ");
        const courseName = c[0];
        const courseCredits = parseFloat(
          c[1].replace(/[^0-9,]/g, "").replace(",", ".")
        );
        const courseCode = c[2];
        const courseGrade = gradeCard
          .getElementsByTagName("strong")[0]
          .innerText.replace("Betyg: ", "");
        return { courseCode, courseName, courseCredits, courseGrade };
      });
    });

    await browser.close();
    return grades;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = { getGrades };
