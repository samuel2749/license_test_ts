import QuestionModel from './QuestionModel';
export default class extends QuestionModel {
    public wrongAnswer: string[];
    constructor(wrongAnswer: string[] = []) {
        super();
        this.wrongAnswer = wrongAnswer;
    }
}
