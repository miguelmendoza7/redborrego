
   
const randRoom = () => {
    var result = '';
    var hexChars = '012ab';
    for (var i = 0; i < 5; i += 1) {
        result += hexChars[Math.floor(Math.random() * 5)];
    }
    return result;
}

const randPiece = () => {
    return Math.random() > 0.5 ? 'X':'O'
}

module.exports = {randRoom, randPiece};