import { questions } from "./questions.js"
// Grabbing elements
const startQuizContainer = document.querySelector(".start-quiz");
const questionContainer = document.querySelector(".quiz-questions");
const scoreSection = document.querySelector(".score-section");
const quizRules = document.querySelector(".quiz-rules");
const nextBtn = document.querySelector("#next-question");
const exitBtn = document.querySelector("#exit-button");
const continueBtn = document.querySelector("#continue-button");
const startButton = document.querySelector(".start-button");
const replayBtn = document.querySelector("#replay");
const quitBtn = document.querySelector("#quit");
const timer = document.querySelector(".timer");
const currentScore = document.querySelector(".score-description");
const currentQues = document.querySelector(".current-question");
const totalQuestion = document.querySelector(".total-question");
const allOptions = document.querySelectorAll(".question-body");

let currentQuestion = 0; // question we are currently on
let time = 10; // total time
let score = 0; // score 
let counter; //this variable for timer

// Listeners
startButton.addEventListener("click", ()=>{
    quizRules.classList.remove("none")
    startQuizContainer.classList.add("none")
})
exitBtn.addEventListener("click", ()=>{
    quizRules.classList.add("none")
    startQuizContainer.classList.remove("none")
})
replayBtn.addEventListener("click", ()=>{
    scoreSection.classList.add("none")
    quizRules.classList.add("none")
    startQuizContainer.classList.add("none")
    questionContainer.classList.remove("none")
    score = 0
    currentQuestion = 0
    loadQuestions()
})
quitBtn.addEventListener("click", ()=>{
    scoreSection.classList.add("none")
    quizRules.classList.add("none")
    questionContainer.classList.add("none")
    startQuizContainer.classList.remove("none")
    score = 0
    currentQuestion = 0
})
continueBtn.addEventListener("click", ()=>{
    loadQuestions()
});
// ** Listeners **

// timer that runs on top
function startTimer(timeValue){
    counter = setInterval(runTimer, 1000)
    // alloption refer to all the question options
    allOptions.forEach(option =>{
        // making the option to be enabled
        option.style.pointerEvents = "all"
    })
    function runTimer(){
        timer.textContent = timeValue
        timeValue--
        if(timeValue < 10){
            timer.textContent = `0${timeValue}`
        }
        if(timeValue < 0){
            timer.textContent = `00`
            clearInterval(counter)
             // showing the next button if we select an answer
            nextBtn.classList.remove("none");
            // looping through all the options {This we are doing for selecting correc answers automatically}
            allOptions.forEach(option =>{
                // option.lastElementChild.children refers to each label and inputs
                // option.lastElementChild.children it returns an object so using for of loop
                for(let item of option.lastElementChild.children){
                    // item.childNodes refers to each input value and making it an array
                  item.childNodes.forEach(list => {
                    list.textContent.trim().split(",").filter(correct => {
                        // comparing the correct answer with the textCOntent which we converted to an array and 
                        //when the time finish it will automatically select the right answer
                        if(correct == questions[currentQuestion].options.correct){
                            // adding the correct color to the label
                            item.classList.add("correct")
                            // making no pointer events for all options
                            option.style.pointerEvents = "none"
                        }
                    })
                  });
                }
            })   
        }
    }
}
// the answer which we select if true it will add correct bg-color
function correctAnswer(elem){
    return elem.classList.add("correct")
}
// the answer which we select if false it will add incorrect bg-color
function wrongAnswer(elem){
    // looping throught all the question options 
    allOptions.forEach(option =>{
        // option.lastElementChild.children refers to each label and inputs
        // option.lastElementChild.children it returns an object so using for of loop
        for(let item of option.lastElementChild.children){
             // item.childNodes refers to each input value and making it an array
          item.childNodes.forEach(list => {
            list.textContent.trim().split(",").filter(correct => {
                  // comparing the correct answer with the textContent which we converted to an array and 
                 //if the answer we selct is false it will add both correct and incorrect bg-color 
                 //else it will run the correctAnswer function above
                if(correct == questions[currentQuestion].options.correct){
                    item.classList.add("correct")
                    elem.classList.add("incorrect")
                    // making all the option to pointerevents none if we select
                    option.style.pointerEvents = "none"
                }
            })
          });
        }
    }) 
}

// this function runs once we click on a answer
function selectAnswer(answer, elem, item){
    // console.log(answer, elem);
    clearInterval(counter) //stoping the timer
    //making no pointer if we click an option once 
    item.style.pointerEvents = "none" 
    nextBtn.classList.remove("none")
   
    // correct answer increase scores and running the correctAnswer function
    if(questions[currentQuestion].options.correct == answer){
        correctAnswer(elem)
        score++
        clearInterval(counter)
        //    console.log(score);
    }else{
        //if incorrect answer running the incorrectAnswer function
        wrongAnswer(elem)
        clearInterval(counter) // stopping the timer 
    }


}

nextBtn.addEventListener("click", ()=>{
    time = 10 // reset time to 15 when new question is loaded
    timer.textContent = time //makig timer in dom to be the timer
    nextBtn.classList.add("none") // next btn only visible if we select an answer
    if(currentQuestion < questions.length - 1){
        currentQuestion++ //increasing the question number 
        loadQuestions() //re-render the dom to get questions
    }else{
        loadScore()  //if question finish displaying the score container
    }
})

const loadQuestions = () => {
   startTimer(time) //starting timer everytime new question renders
    currentQues.textContent = `${currentQuestion + 1}` //dom element
    totalQuestion.textContent = `${questions.length}` //dom element
    const questionBody = document.querySelector(".question-body");
    let html;
    // making all the other container to hidden 
    quizRules.classList.add("none")
    startQuizContainer.classList.add("none")
    questionContainer.classList.remove("none")
    
        html = `
        <div class="question">
                    <h3>${questions[currentQuestion].id}.${questions[currentQuestion].question}</h3>
                </div>
                <div class="answer-options" >
                <label for="answer-1">
                <input type="radio" class="answerList" name="answer" id="answer-1">${questions[currentQuestion].options.optionOne}</input>
                </label>
                <label for="answer-2">
                <input type="radio" class="answerList" name="answer" id="answer-2">${questions[currentQuestion].options.optionTwo}</input>
                    </label>
                    <label for="answer-3">
                    <input type="radio" class="answerList" name="answer" id="answer-3">${questions[currentQuestion].options.optionThree}</input>
                    </label>
                    <label for="answer-4">
                    <input type="radio" class="answerList" name="answer" id="answer-4">${questions[currentQuestion].options.optionFour}</input>
                    </label>
                </div>
                `
                questionBody.innerHTML = html // appending html element
                // click event and passing the information to functions
                document.querySelectorAll(".answer-options").forEach(item => {
                    item.addEventListener("click", (e)=>{
                        let inputText = e.target.outerText.trim(),
                        label = e.target
                        selectAnswer(inputText, label, item)
                    })
                })
            }


// console.log(currentScore.innerHTML);

// loading score container
function loadScore(){
    quizRules.classList.add("none")
    startQuizContainer.classList.add("none")
    questionContainer.classList.add("none")
    scoreSection.classList.remove("none")

    currentScore.innerHTML = `
    <p>You've completed the Quiz <br/> and nice,You got <span class="current-question"> ${score}</span>
     out of <span class="total-question"> ${questions.length}</span> questions </p>
    
    `
}

