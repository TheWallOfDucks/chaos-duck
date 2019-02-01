import { answerPrompt } from '../helpers/answer_prompts';
const { spawnSync, spawn } = require('child_process');
const info = require('../../../package.json');

describe('chaos-duck', () => {
    describe('--version', () => {
        it('should return the correct version', (done) => {
            try {
                const command = spawnSync('node', ['lib/src/bin/index.js', '--version']);
                const version = command.stdout.toString().trim();
                expect(version).toBe(info.version);
            } catch (error) {
                fail(error);
            }

            done();
        });
    });

    describe('config', () => {
        it('should display prompts', (done) => {
            try {
                const child = spawn('node', ['lib/src/bin/index.js', 'config']);
                child.stdout.setEncoding('utf8');
                child.stdin.setEncoding('utf8');

                child.stdout.on('data', (data: Buffer) => {
                    const question = data.toString().trim();
                    if (question.charAt(0) === '?') {
                        console.log('question => ', question);
                        const answer = answerPrompt(data.toString());
                        console.log('answer => ', answer);
                        // child.stdout.pipe(process.stdout);
                        child.stdin.write(`${answer}\n`);
                        // child.stdin.write(answer);
                        // child.stdin.end();
                    }
                });

                child.on('exit', (code: number) => {
                    console.log('code => ', code);
                    done();
                });
            } catch (error) {
                fail(error);
            }
        }, 10000);
    });
});
