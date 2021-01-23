export class SerialCodeGenerator {
    /**
     * Default character set
     */
    private characters: string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private charLimit: number = this.characters.length - 1;
    private charToIndexMap: Map<string, number> = new Map();

    /**
     * 
     * @param characters :(optional) characters set for a unique code
     * Note: Avoid duplicate character to avoid collision 
     */
    constructor(characters?: string) {
        if (characters != null) {
            this.characters = characters;
            this.charLimit = characters.length - 1;
        }
        this.setCharToIndexMap(this.characters);
    }

    private setCharToIndexMap(characters: string) {
        let char = null;
        for (let i = 0; i < characters.length; i++) {
            char = characters[i];
            this.charToIndexMap[char] = i;
        }
    }

    private getNextSequenceCode(sequenceCode: number[]) {
        let pos = sequenceCode.length - 1;
        while (pos >= 0 && sequenceCode[pos] == this.charLimit) {
            pos -= 1;
        }
        // In case we are not at the end of sequence , generate a sequenceCode 
        if (pos >= 0) {
            sequenceCode[pos] += 1;
            // reset all the char after this pos
            for (let right = pos + 1; right < sequenceCode.length; right++) {
                sequenceCode[right] = 0;
            }
            return sequenceCode;
        }
        // End of sequence -> reset the sequence sequenceCode
        for (let pos = 0; pos < sequenceCode.length; pos++) {
            sequenceCode[pos] = 0;
        }
        return sequenceCode;
    }

    /**
     * @description this function will convert code to sequenceCode
     * @param sequenceCode : ex. 'abc' maps to sequnceCode [indexOf a, indexOf b,indexOf c]
     */
    private convertToSequenceCode(code: string): number[] {
        try {
            let sequenceCode = [];
            for (let char of code) {
                sequenceCode.push(this.charToIndexMap[char]);
            }
            return sequenceCode;
        }
        catch (e) {
            console.log("Error while generating SequenceCode", e);
            return null;
        }
    }

    /**
     * @description this function will convert sequenceCode to uniqueCode
     * @param sequenceCode : ex. [1,2,3,4,5] maps to unique code [char at index 1, char at index 2,char at index 3 and so on...]
     */
    private getUniqueCode(sequenceCode: number[]) {
        let uniqueCode = "";
        for (const num of sequenceCode) {
            uniqueCode += this.characters[num];
        }
        return uniqueCode;
    }

    /**
     * 
     * @param code : For example 'abbbc'  is the provided code , and our characters set have only abc character that
     * are allowed to use in this code then this function will return next unique code which is abbca
     * Note: In case previous code no available then pass the inital code for ex 'aaaaaa'
     */
    public getNextUniqueSerialCode(code: string) {
        let sequenceCode = this.convertToSequenceCode(code);
        let nextSequenceCode = this.getNextSequenceCode(sequenceCode);
        return this.getUniqueCode(nextSequenceCode);
    }
}