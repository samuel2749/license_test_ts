class JsonModel {
    public title: string;
    public jsonPath: string;
    constructor(title = '', jsonPath = '') {
        this.title = title;
        this.jsonPath = jsonPath;
    }
}
export default class {
    private jsonModel: JsonModel;
    constructor(type: string) {
        this.jsonModel = this.getQuestionList(type);
    }
    private getQuestionList(type: string): JsonModel {
        switch (type) {
            case 'ebc':
                return new JsonModel('EBC', 'ebc.json');
            case 'erp':
                return new JsonModel('ERP', 'erp.json');
            case 'mkp':
                return new JsonModel('MKP', 'mkp.json');
            case 'bulldozer':
                return new JsonModel('推土機', 'bulldozer.json');
        }
        return new JsonModel();
    }
    public get title(): string {
        return this.jsonModel.title;
    }
    public get jsonPath(): string {
        return this.jsonModel.jsonPath;
    }
}
