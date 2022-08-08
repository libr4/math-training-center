const reducer = (state, action) => {
    switch(action.type) {
        case "MAKE_EXPRESSION":
            return {
                ...state,
                expression:action.payload
            }
        case "CALL_NEXT_QUESTION":
            return {
                ...state,
                question: action.payload
            }
        case "UPDATE_POINTS":
            return {
                ...state,
                points: state.points + action.payload
            }
        case "QUESTION_TIME":
            return {
                ...state,
                questionTime: action.payload
            }
        case "ANSWER_TIME":
            return {
                ...state,
                answerTime: action.payload.answerTime,
                totalTime: action.payload.totalTime
            }
        case "VELOCITY_CALC":
            return {
                ...state,
                velocity: action.payload
            }
        case "SET_DIFFICULTY":
            return {
                ...state,
                level:action.payload
            }


    }
}

export default reducer;