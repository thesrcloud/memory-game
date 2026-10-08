"use strict";

const body = document.querySelector("body");
let totalCardsValue = 16;
let cardsClasses = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];
let cardsInGame = [];
let cardsData = getCardsData(cardsClasses, 2, totalCardsValue);

addElement(body, "header", { class: "header" });
addElement(document.querySelector("header"), "div", {
  class: "header__wrapper container",
});
addElement(
  document.querySelector(".header__wrapper"),
  "h1",
  { class: "header__title" },
  "#RandomGame",
);
addElement(document.querySelector(".header__wrapper"), "div", {
  class: "header__btn-block",
});

addElement(
  document.querySelector(".header__btn-block"),
  "span",
  { class: "header__game-steps", id: "steps" },
  "Steps: 0",
);

addElement(
  document.querySelector(".header__btn-block"),
  "button",
  { class: "header__btn new__game", id: "new__game" },
  "New Game",
);
addElement(
  document.querySelector(".header__btn-block"),
  "button",
  { class: "header__btn score", id: "score" },
  "Leaders",
);
addElement(body, "main", { class: "main" });
addElement(document.querySelector("main"), "div", {
  class: "main__wrapper container",
});
addElement(document.querySelector(".main__wrapper"), "div", {
  class: "main__grid",
});

addElement(body, "div", {
  class: "modal",
});

addElement(document.querySelector(".modal"), "div", {
  class: "modal__content",
});

addElement(
  document.querySelector(".modal"),
  "button",
  {
    class: "modal__new-game",
  },
  "New Game",
);

addElement(
  document.querySelector(".modal"),
  "button",
  {
    class: "modal__close",
  },
  "Close",
);

let grid = document.querySelector(".main__grid");
let steps = document.querySelector("#steps");
let newGame = document.querySelector("#new__game");
let openedPair = 0;
let gameSteps = 0;
let lastOpenedCardId;
let lastOpenedCards = [];
let appStatus = "normal";

getCards(cardsData, grid);

grid.addEventListener("click", (e) => {
  if (appStatus != "paused") {
    let gElem = e.target;

    if (
      gElem.classList.contains("grid__card") &&
      !gElem.classList.contains("blocked") &&
      lastOpenedCardId != gElem.getAttribute("id")
    ) {
      lastOpenedCards.push(gElem);
      lastOpenedCardId = gElem.getAttribute("id");

      gElem.classList.remove("closed");

      if (lastOpenedCards.length == 2) {
        appStatus = "paused";
        gameSteps++;
        steps.textContent = `Steps: ${gameSteps}`;

        setTimeout(() => {
          if (
            lastOpenedCards[0].getAttribute("data-card-name") !=
            lastOpenedCards[1].getAttribute("data-card-name")
          ) {
            lastOpenedCards.forEach((item) => {
              item.classList.add("closed");
            });
          } else {
            lastOpenedCards.forEach((item) => {
              item.classList.add("blocked");
            });
            openedPair++;

            if (openedPair == totalCardsValue / 2) {
              getModal("Win");
            }
          }
          lastOpenedCards.length = 0;
          lastOpenedCardId = null;
          appStatus = "normal";
        }, 700);
      }
    }
  }
});

newGame.addEventListener("click", resetGame);

function resetGame() {
  Array.from(grid.children).forEach((item) => {
    item.remove();
  });

  openedPair = 0;
  gameSteps = 0;
  lastOpenedCardId;
  lastOpenedCards.length = 0;
  appStatus = "normal";

  steps.textContent = `Steps: ${gameSteps}`;
  cardsData = getCardsData(cardsClasses, 2, totalCardsValue);
  getCards(cardsData, grid);
}

function addElement(parent, element, attrs, textContent = null) {
  let elem = document.createElement(element);
  for (let key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }

  if (textContent != null) elem.textContent = textContent;
  parent.append(elem);
}

function getCards(data, parent) {
  for (let id in data) {
    addElement(parent, "div", {
      class: `grid__card ${data[id]} closed`,
      id: `id-${id}`,
      "data-card-name": `${data[id]}`,
    });
  }
}

function getCardsData(classes, repeatValue, numberOfCards) {
  let generatedData = {};
  let names = [...classes];
  let usedIndexes = [];
  let counter = 0;

  while (names.length != 0 && usedIndexes.length != numberOfCards) {
    let randomValue = Math.round(Math.random() * numberOfCards);

    if (!usedIndexes.includes(randomValue)) {
      usedIndexes.push(randomValue);
      generatedData[randomValue] = names[names.length - 1];
      counter++;

      if (counter == repeatValue) {
        names.pop();
        counter = 0;
      }
    } else {
      continue;
    }
  }

  return generatedData;
}
