import * as faker from 'faker';

export function answerPrompt(question?: string) {
    try {
        if (question.includes('What is your AWS role to assume?')) return faker.random.word();
        if (question.includes('What is your AWS account number?')) return '012345678901';
        if (question.includes('What is the profile you are using to assume the role?')) return 'default';
        if (question.includes('What is the name of your AWS account?')) return faker.random.word();
        if (question.includes('What stage do you want to deploy Chaos Duck in?')) return 'dev';
        if (question.includes('Would you like to receive notifications from Chaos Duck?')) return 'No';
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
