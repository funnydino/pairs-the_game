'use strict';

(() => {

  document.addEventListener('DOMContentLoaded', () => {

    // My Custom Select and Radio Buttons:

    const selected = document.querySelector('.selected');
    const optionsContainer = document.querySelector('.options-container');
    const optionsList = document.querySelectorAll('.option');
    const difficultyBlock = document.querySelector('.difficulty');

    selected.addEventListener('click', () => {
      optionsContainer.classList.toggle('options-container--active');
    });

    window.addEventListener('click', (event) => {
      if (event.target != selected) {
        optionsContainer.classList.remove('options-container--active');
      }
    });

    optionsList.forEach(o => {
      o.addEventListener('click', () => {
        selected.innerText = o.querySelector('label').innerText;
        selected.setAttribute('value', o.getAttribute('value'));
        difficultyBlock.classList.add('difficulty--active');
        document.querySelector('.start__btn').classList.add('start__btn--active');
        optionsContainer.classList.remove('options-container--active');
      });
    });

    // The Game:

    const cardsArray = [];
    const startBlock = document.querySelector('.start__block');
    const startGameBtn = document.querySelector('.start__btn');
    const restartGameBtn = document.querySelector('.restart__btn');
    const newGameBtn = document.querySelector('.new-game__btn');
    const cardsField = document.querySelector('.cards-field');
    const timerDisplay = document.querySelector('.timer');
    const modal = document.querySelector('.popup');
    const modalClose = document.querySelector('.popup__close');
    let timerStart = null;
    let timerDurationValue;

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      };
    };

    let timerDuration = () => {
      const timerValue = document.querySelector('.difficulty__level input[type="radio"]:checked');
      if (timerValue.getAttribute('id') == 'easy') {
        timerDurationValue = 120;
      } else if (timerValue.getAttribute('id') == 'medium') {
        timerDurationValue = 90;
      } else if (timerValue.getAttribute('id') == 'hard') {
        timerDurationValue = 60;
      };
    };

    let startTimer = () => {
      clearInterval(timerStart);
      timerDuration();
      timerStart = setInterval(function () {
        timerDisplay.textContent = timerDurationValue--;
        if (timerDurationValue < 0) {
          clearInterval(timerStart);
          timerDisplay.textContent = 'Время вышло :(';
          console.log('Время вышло :(');
          timerDisplay.style.color = '#fe6246';
          document.querySelectorAll('.card').forEach(function (el) {
            if (!el.classList.contains('matched')) {
              el.classList.add('is-flipped');
              el.style.pointerEvents = 'none';
              el.querySelector('.card__face--back').classList.add('error');
            };
          });
        };
      }, 1000);
    };

    let finishGame = () => {

      console.log('Игра окончена!');
      clearInterval(timerStart);
      timerDisplay.style.color = '#9cff6e';
      modal.classList.add('popup--active');
      newGameBtn.addEventListener('click', () => {
        location.reload();
      });
      closePopup();

    };

    let closePopup = () => {

      modalClose.addEventListener('click', () => {
        modal.classList.remove('popup--active');
      });

      window.addEventListener('click', (event) => {
        if (event.target == modal) {
          modal.classList.remove('popup--active');
        }
      });

    };

    startGameBtn.addEventListener('click', () => {

      let cardsAmount = parseInt(document.querySelector('.selected').getAttribute('value'));

      console.log(`Вы выбрали: ${cardsAmount} пары карт`);

      startBlock.style.display = 'none';
      restartGameBtn.classList.add('restart__btn--active');
      timerDisplay.classList.remove('timer__hidden');

      startTimer();

      restartGameBtn.addEventListener('click', () => {
        location.reload();
      });

      for (let i = 0; i < cardsAmount; i++) {
        cardsArray.push(i + 1, i + 1);
      };

      shuffleArray(cardsArray);

      let createCard = (cardsArray) => {

        for (let i = 0; i < cardsArray.length; i++) {
          const scene = document.createElement('div');
          const card = document.createElement('a');
          const cardFaceFront = document.createElement('div');
          const cardFaceBack = document.createElement('div');
          cardsField.append(scene);
          scene.classList.add('scene');
          scene.append(card);
          card.classList.add('card');
          card.append(cardFaceFront);
          cardFaceFront.setAttribute('class', 'card__face card__face--front');
          card.append(cardFaceBack);
          cardFaceBack.setAttribute('class', 'card__face card__face--back');
          cardFaceBack.innerText = cardsArray[i];
        };

      };

      createCard(cardsArray);

      let openCard = (cards) => {

        let matchedCardsArray = [];

        for (let i = 0; i < cards.length; i++) {
          cards[i].addEventListener('click', () => {
            if (!cards[i].classList.contains('is-flipped')) {
              cards[i].classList.add('is-flipped');
              matchedCards(cards[i], matchedCardsArray);
            } else {
              cards[i].querySelector('.card__face--back').classList.add('error');
              let clearError = setInterval(function () {
                cards[i].querySelector('.card__face--back').classList.remove('error');
                clearInterval(clearError);
              }, 100);
            };
          });
        };

      };

      let matchedCards = (card, array) => {

        array.push(card.querySelector('.card__face--back').innerText);

        if (array.length > 2 && array[0] != array[1]) {
          array.length = 0;
          document.querySelectorAll('.scene .card').forEach(function (el) {
            if (!el.classList.contains('matched')) {
              el.classList.remove('is-flipped');
            };
          });
        } else if (array.length == 2 && array[0] == array[1]) {
          document.querySelectorAll('.scene .is-flipped').forEach(n => n.style.pointerEvents = 'none');
          document.querySelectorAll('.scene .is-flipped').forEach(n => n.classList.add('matched'));
          array.length = 0;
          cardsAmount -= 1;
          if (cardsAmount === 0) {
            finishGame();
          };
        };

      };

      openCard(document.querySelectorAll('.card'));

    });

  });

})();