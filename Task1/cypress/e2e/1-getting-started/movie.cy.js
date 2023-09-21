/// <reference types="cypress" />

import login_data from "../../fixtures/login_data.json";
import seats from "../../fixtures/seats.json";
import selectors from "../../fixtures/selectors.json";

describe("check main page", () => {
  it("start page visible", () => {
    cy.visit("http://qamid.tmweb.ru");
    cy.get(selectors.day).should("have.length", 7);
  });
});

describe("check login", () => {
  beforeEach(() => {
    cy.visit("http://qamid.tmweb.ru/admin");
  });

  it("successful login", () => {
    cy.login(login_data.valid_login, login_data.valid_password);
    cy.get(selectors.admin_form).should("be.visible");
  });

  it("unsuccessful login", () => {
    cy.login(login_data.invalid_login, login_data.invalid_password);
    cy.get(selectors.body).should("contain", "Ошибка авторизации!");
  });
});

describe("book tickets", () => {
  it("should book two tickets", () => {
    cy.visit("http://qamid.tmweb.ru");
    cy.get(selectors.day).eq(3).click();
    cy.get(selectors.movie)
      .filter(':contains("Терминатор-заржавел")')
      .contains("10:00")
      .click();
    seats.forEach((seat) => {
      cy.get(
        `${selectors.buying_scheme} > ${selectors.child}(${seat.row}) > ${selectors.child}(${seat.seat})`
      ).click();
    });
    cy.get(selectors.accept_button).click();
    cy.contains("Получить код бронирования").should("be.visible");
  });
});
