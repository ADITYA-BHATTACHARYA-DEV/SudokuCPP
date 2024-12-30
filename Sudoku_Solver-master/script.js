var arr = [[], [], [], [], [], [], [], [], []];

for (var i = 0; i < 9; i++) {
  for (var j = 0; j < 9; j++) {
    arr[i][j] = document.getElementById(i * 9 + j);
  }
}

var board = [[], [], [], [], [], [], [], [], []];

function FillBoard(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[i][j] !== 0) {
        arr[i][j].innerText = board[i][j];
      } else {
        arr[i][j].innerText = '';
      }
    }
  }
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.onload = function () {
    if (xhrRequest.status === 200) {
      var response = JSON.parse(xhrRequest.responseText);
      console.log(response);
      board = response.board;
      FillBoard(board);
    } else {
      console.error('Failed to fetch puzzle. Status:', xhrRequest.status);
    }
  };
  xhrRequest.onerror = function () {
    console.error('Network error while fetching puzzle.');
  };
  xhrRequest.open('GET', 'https://sugoku.herokuapp.com/board?difficulty=easy');
  // You can change the difficulty to medium, hard, or random
  xhrRequest.send();
};

SolvePuzzle.onclick = () => {
  SudokuSolver(board, 0, 0, 9);
};

function isValid(board, i, j, num, n) {
  // Row and column check
  for (let x = 0; x < n; x++) {
    if (board[i][x] === num || board[x][j] === num) {
      return false;
    }
  }

  // Subgrid check
  let rn = Math.sqrt(n);
  let si = i - (i % rn);
  let sj = j - (j % rn);

  for (let x = si; x < si + rn; x++) {
    for (let y = sj; y < sj + rn; y++) {
      if (board[x][y] === num) {
        return false;
      }
    }
  }

  return true;
}

function SudokuSolver(board, i, j, n) {
  // Base Case: If we've reached the end of the board
  if (i === n) {
    FillBoard(board);
    return true;
  }

  // If we're outside the current row
  if (j === n) {
    return SudokuSolver(board, i + 1, 0, n);
  }

  // If the cell is already filled, move ahead
  if (board[i][j] !== 0) {
    return SudokuSolver(board, i, j + 1, n);
  }

  // Try placing numbers 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, i, j, num, n)) {
      board[i][j] = num;
      let subAns = SudokuSolver(board, i, j + 1, n);

      if (subAns) {
        return true;
      }

      // Backtracking: Undo the change
      board[i][j] = 0;
    }
  }

  return false;
}
