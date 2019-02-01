import * as faker from 'faker';

export function answerPrompt(question?: string) {
    try {
        if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        if (question.includes('What is your AWS account number?')) return faker.random.number(12);
        if (question.includes('What is the profile you are using to assume the role?')) return 'default';
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        // if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        return 'test';
    } catch (error) {
        throw new Error(error);
    }
}
