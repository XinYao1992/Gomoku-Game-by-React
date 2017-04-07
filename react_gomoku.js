// https://facebook.github.io/react/tutorial/tutorial.html
// class Square extends React.Component {
//   render() {
//     return (
//         <button className="square" onClick={() => this.props.onClick()}>
//           {this.props.value}
//         </button>
//     );
//   }
// }

// it has the same functionality as above
function Square(props) {
  let piece;
  if(props.value == 'X'){
    piece = <BlackPiece />;
  }else if(props.value == 'O'){
    piece = <WhitePiece />
  }else{
    piece = null;
  }
  return (
    <button className="square" onClick={() => props.onClick()}>
      {piece}
    </button>
  );
}

function SmallBlackPiece(props){
    return (
      <svg height="25" width="25">
        <circle cx="12" cy="12" r="10" stroke="black" stroke-width="1" fill="black" />
      </svg> 
    );
}

function SmallWhitePiece(props){
    return (
      <svg height="25" width="25">
        <circle cx="12" cy="12" r="10" stroke="black" stroke-width="1" fill="White" />
      </svg> 
    );
}


class BlackPiece extends React.Component{
  render(){
    return (
      <svg height="100" width="100">
        <circle cx="24" cy="24" r="20" stroke="black" stroke-width="1" fill="black" />
      </svg> 
    );
  }
}

class WhitePiece extends React.Component{
  render(){
    return (
      <svg height="100" width="100">
        <circle cx="24" cy="24" r="20" stroke="black" stroke-width="1" fill="white" />
      </svg> 
    );
  }
}

class Board extends React.Component {

  render() {
    var board = [];
    for(var i = 0; i < 14; i ++){
      var boardRow = [];
      for(var j = 0; j < 14; j ++){
        //Each child in an array or iterator should have a unique "key" prop.
        boardRow.push(i*14 + j);
      }
      var row = boardRow.map((orderNumber) => {
        return <Square key={orderNumber} value={this.props.squares[orderNumber]} onClick={() => this.props.onClick(orderNumber)} />;
      });
      board.push(row);
    }

    return (
      <div>
        <div className="status">{status}</div>
          <div className="board-row">{board[0]}</div>
          <div className="board-row">{board[1]}</div>
          <div className="board-row">{board[2]}</div>
          <div className="board-row">{board[3]}</div>
          <div className="board-row">{board[4]}</div>
          <div className="board-row">{board[5]}</div>
          <div className="board-row">{board[6]}</div>
          <div className="board-row">{board[7]}</div>
          <div className="board-row">{board[8]}</div>
          <div className="board-row">{board[9]}</div>
          <div className="board-row">{board[10]}</div>
          <div className="board-row">{board[11]}</div>
          <div className="board-row">{board[12]}</div>
          <div className="board-row">{board[13]}</div>
      </div>
    );
  }

}

class Game extends React.Component {
  constructor(){
    super();
    this.state = {
      history : [{squares : Array(196).fill(null)}], 
      stepNumber : 0,
      xIsNext : true,
    }
  }

  handleClick(i){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = (this.state.xIsNext) ? 'X' : 'O';
    this.setState({
      history : history.concat([{squares : squares}]),
      xIsNext : !this.state.xIsNext,
      stepNumber : this.state.stepNumber+1
    });
  }

  jumpTo(step){
    var editHistory = this.state.history.slice();// copy history
    editHistory.splice(step+1, (editHistory.length-step-1));// （staring_index(included), number_of_elements_to_remove）

    this.setState({
      stepNumber : step,
      xIsNext : (step % 2 == 0) ? true : false,
      history : editHistory,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]; // the most recently board
    const winner = calculateWinner(current.squares);

    let status;
    let winnerPiece;
    if(winner){
      winnerPiece = (winner == 'X') ?  <SmallBlackPiece /> : <SmallWhitePiece />;
    }else{
      status = this.state.xIsNext ? <SmallBlackPiece /> : <SmallWhitePiece />;
    }

    const moves = history.map((move, step) => {
      const descp = step ? 'Move #' + step : 'Game start';
      return (
        <li key={step}>
          <a href="#" onClick={() => this.jumpTo(step)}>{descp}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="winner">WINNER: {winnerPiece}</div>
          <div className="player">Next player: {status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// =========================================================================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);


function calculateWinner(squares) {
  var row = 14;
  for(var i = 0; i < 196; i ++){
    var r = i/14, c = i%14;
    // This point is the start of the line
    if(squares[i]){
      // back slash
      if(r+4<14 && c+4<14 && squares[i]==squares[i+row+1] && squares[i]==squares[i+2*row+2]
          && squares[i+3*row+3]==squares[i] && squares[i+4*row+4]==squares[i]){
        return squares[i];
      }

      // forward slash
      if(r+4<14 && c-4>=0 && squares[i]==squares[i+1*row-1] && squares[i]==squares[i+2*row-2]
          && squares[i+3*row-3]==squares[i] && squares[i+4*row-4]==squares[i]){
        return squares[i];
      }

      // vertical
      if(r-4>=0 && squares[i]==squares[i-1*row] && squares[i]==squares[i-2*row]
          && squares[i-3*row]==squares[i] && squares[i-4*row]==squares[i]){
        return squares[i];
      }

      //horizontal
      if(c+4<14 && squares[i]==squares[i+1] && squares[i]==squares[i+2]
          && squares[i]==squares[i+3] && squares[i]==squares[i+4]){
        return squares[i];
      }
    }
  }
  return null;
}
