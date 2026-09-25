export const QuizRules = {
    shuffleOptions(question) {
        const qClone = JSON.parse(JSON.stringify(question));
        // Shuffle safe: map original objects, shuffle, keep ID for checking
        qClone.options.sort(() => Math.random() - 0.5);
        return qClone;
    },
    checkAnswer(question, selectedOptionId) {
        return question.correctAnswerId === selectedOptionId;
    }
};
