function Thought(thought){
    const {name, currentBeer, currentThought, daydream} = thought;
    this.name = name;
    this.currentBeer = currentBeer;
    this.currentThought = currentThought;
    this.daydream = daydream;
    this.imgUrl = "";
    this.tStamp = getUtc();
    this.isDisabled = false;
};

function getUtc(){
    const datArr = ['FullYear()', 'Month()', 'Date()', 'Hours()', 'Minutes()', 'Seconds()', 'Milliseconds()'],
        date = new Date(),
        datLead = 'date.getUTC';
    let datString = '';    
    for(let i = 0; i < datArr.length; i++){
        let datVal = eval(datLead + datArr[i]),
            leadZero = '0' + datVal;
        leadZero = leadZero.slice(-2);    
        if(i !== datArr.length - 1){
            datString += leadZero;
        } else {
            datString += '.' + datVal;
        }    
    };    
    return parseFloat(datString);
};    

module.exports = Thought