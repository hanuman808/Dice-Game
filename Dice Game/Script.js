const dicePatterns = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };

    const playerNames = {
      1: ["You", "Computer"],
      2: ["Player 1", "Player 2"],
      3: ["Player 1", "Player 2", "Player 3"],
      4: ["Player 1", "Player 2", "Player 3", "Player 4"]
    };

    let currentPlayerIndex = 0;
    let totalPlayers = 4;
    let rolls = [];

    function createDice(face) {
      const dice = document.createElement('div');
      dice.classList.add('dice');
      for (let i = 0; i < 9; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (dicePatterns[face].includes(i)) {
          dot.classList.add('show');
        }
        dice.appendChild(dot);
      }
      return dice;
    }

    function setupPlayers() {
      const count = parseInt(document.getElementById('player-count').value);
      totalPlayers = count === 1 ? 2 : count;
      currentPlayerIndex = 0;
      rolls = new Array(totalPlayers).fill(null);

      const container = document.getElementById('dice-container');
      container.innerHTML = '';

      const names = playerNames[count];

      for (let i = 0; i < names.length; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.innerHTML = `
          <h2>${names[i]}</h2>
          <div class="dice" id="dice-${i}"></div>
        `;
        container.appendChild(playerDiv);
      }

      highlightPlayer(0);
      document.getElementById('result').textContent = `${names[0]}'s turn. Click to roll.`;
    }

    function highlightPlayer(index) {
      const players = document.querySelectorAll('.dice');
      players.forEach(d => d.classList.remove('highlight'));
      if (players[index]) players[index].classList.add('highlight');
    }

    function rollForCurrentPlayer() {
      const sound = document.getElementById("dice-sound");
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch(() => {});

      const roll = Math.floor(Math.random() * 6) + 1;
      rolls[currentPlayerIndex] = roll;

      const diceDiv = document.getElementById(`dice-${currentPlayerIndex}`);
      const newDice = createDice(roll);
      newDice.id = `dice-${currentPlayerIndex}`;
      diceDiv.replaceWith(newDice);

      const playerType = document.getElementById('player-count').value;
      const names = playerNames[playerType];

      currentPlayerIndex++;

      if (currentPlayerIndex < totalPlayers) {
        highlightPlayer(currentPlayerIndex);
        document.getElementById('result').textContent = `${names[currentPlayerIndex]}'s turn. Click to roll.`;
      } else {
        determineWinner();
      }
    }

    function determineWinner() {
      const maxRoll = Math.max(...rolls);
      const playerType = document.getElementById('player-count').value;
      const names = playerNames[playerType];

      const winners = rolls
        .map((val, i) => val === maxRoll ? names[i] : null)
        .filter(v => v !== null);

      document.getElementById('result').textContent = winners.length === 1
        ? `🏆 ${winners[0]} wins with ${maxRoll}!`
        : `🤝 It's a tie between: ${winners.join(', ')} with ${maxRoll}`;

      currentPlayerIndex = 0;
      rolls = [];

      setTimeout(() => setupPlayers(), 4000);
    }

    setupPlayers();