const questionParent = document.querySelector(".questions-container"); //done
const optionsParent = document.querySelector(".options-contianer");//
const nextBtn = document.querySelector(".next");    //
const quitBtn = document.querySelector(".quit");   //
const quizCategory = document.querySelector(".quiz-category"); //
const scoreContiner = document.querySelector(".cur-score");  //
const rules = document.querySelector(".rule-book");  //
const quizBook = document.querySelector(".quiz");   //
const playBtn = document.querySelector(".play-btn");  //
const qnsCount = document.querySelector(".qns-count");  //
const result = document.querySelector(".result");

let quizzes = [];
let currentQuestion = 0;
let score = 0;

let getJson = async () => {
  try {
    let {
      data: { results },
    } = await axios.get(
      "https://opentdb.com/api.php?amount=5&category=22&difficulty=easy&type=multiple"
    );
    return results;
  } catch (error) {
    console.log(error);
  }
};

let getData = async () => {
  quizzes = await getJson();
};
getData();
playBtn.addEventListener("click", (event) => {
  rules.classList.add("hide");
  quizBook.classList.remove("hide");
});
let createQuestionAnaOption = (quizzes, currentQuestion) => {
  questionParent.innerHTML = quizzes[currentQuestion].question;
  qnsCount.innerHTML=`Q${currentQuestion+1}/${quizzes.length}`
  scoreContiner.innerHTML= `Score:${score}`
 quizCategory.innerHTML=quizzes[currentQuestion].category
  let options = [
    quizzes[currentQuestion].correct_answer,
    ...quizzes[currentQuestion].incorrect_answers,
  ].sort(()=> Math.random() - 0.5);
  for(let option of options){
    const optionBtn=document.createElement("button")
    optionBtn.classList.add("button","option")
    optionBtn.setAttribute("data-name",option)
    optionBtn.innerText=option
    optionsParent.appendChild(optionBtn)
  }
//   console.log(options)
};
nextBtn.addEventListener("click",(event)=>{
    currentQuestion++;
    optionsParent.innerHTML=""
    questionParent.innerHTML=""
    if(currentQuestion===quizzes.length){
        rules.classList.add("hide");
        quizBook.classList.add("hide");
        result.classList.remove("hide")
        result.innerText=`YOUR SCORE: ${score} OUT OF ${quizzes.length}`
    }else{    
        if(currentQuestion===quizzes.length-1){
        event.target.innerText="Submit"
    }
    createQuestionAnaOption(quizzes,currentQuestion)
}
})
let disabled=(options)=>{
    for(let option of options){
        option.setAttribute("disabled",true)
     }
}
optionsParent.addEventListener("click",(event)=>{
     let options=document.querySelectorAll(".option")
     let name=event.target.dataset.name
     let optionArr=[quizzes[currentQuestion].correct_answer,...quizzes[currentQuestion].incorrect_answers]
     if(optionArr.includes(name)){
     if(name===quizzes[currentQuestion].correct_answer){
        event.target.classList.add("success")
        disabled(options)
        score++
        scoreContiner.innerHTML= `Score:${score}`
     }
     else{
        event.target.classList.add("error")
        for(let option of options){
            if(option.innerText===quizzes[currentQuestion].correct_answer){
                option.classList.add("success")
            }
        }
        disabled(options)
    }
}
})

quitBtn.addEventListener("click",(event)=>{
    currentQuestion=0
    score=0
    optionsParent.innerHTML=""
    createQuestionAnaOption(quizzes,currentQuestion)
    rules.classList.remove("hide");
    quizBook.classList.add("hide");
})
setTimeout(() => {
  createQuestionAnaOption(quizzes, currentQuestion);
  console.log(quizzes);
}, 2000);
