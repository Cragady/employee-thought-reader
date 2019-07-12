function Thought(thought){
    const {name, currentBeer, currentThought, daydream} = thought;
    this.name = name;
    this.currentBeer = currentBeer;
    this.currentThought = currentThought;
    this.daydream = daydream;
    this.imgUrl = "";
};
module.exports = Thought