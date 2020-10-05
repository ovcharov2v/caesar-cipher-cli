const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');

module.exports = (input, step) => {
  step = step % 26;

  return input.split('').map((ch, index, input)=>{

    let isUpperCase = (ch == ch.toUpperCase()) ? true : false;

    //Filter non english ch
    if(chars.indexOf(ch.toLowerCase()) == -1) return ch;

    let chPos = chars.indexOf(ch.toLowerCase())+step;
    if(chPos > input.length) chPos -= 26;
    if(chPos < 0) chPos += 26;
    
    return isUpperCase ? chars[chPos].toUpperCase() : chars[chPos];
  }).join('');
};