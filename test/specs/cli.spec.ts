import { answerPrompt } from '../helpers/answer_prompts';
import * as faker from 'faker';

const { spawnSync, spawn } = require('child_process');
const info = require('../../../package.json');
const suppose = require('suppose');
const fs = require('fs');

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
            // try {
            // console.log(child.stdout.toString().trim());
            // child.stdout.setEncoding('utf8');
            // child.stdin.setEncoding('utf8');
            // child.stdout.on('data', (data: Buffer) => {
            //     let question = '';
            //     let answer = '';
            //     question = data.toString().trim();
            //     if (question.charAt(0) === '?') {
            //         console.log('question => ', question);
            //         answer = answerPrompt(data.toString());
            //         console.log('answer => ', answer);
            //         // child.stdout.pipe(process.stdout);
            //         child.stdin.write(`${answer}\n`);
            //         // child.stdin.write(answer);
            //     }
            // });
            // child.on('exit', (code: number) => {
            //     child.stdin.end();
            //     console.log('code => ', code);
            //     done();
            // });
            // } catch (error) {
            //     fail(error);
            // }
            try {
                const child = spawn('node', ['lib/src/bin/index.js', 'config']);
                const questions = [];
                // child.stdout.setEncoding('utf8');
                child.stdin.setEncoding('utf-8');
                // child.stdout.pipe(process.stdout);
                // process.stdin.pipe(child.stdin);

                child.stdout.on('data', async (data: Buffer) => {
                    // console.log(process.stdout.toString());
                    let question = '';
                    let answer = '';
                    question = data.toString().trim();
                    // console.log(questions);
                    if (question.charAt(0) === '?' && !questions.includes(question)) {
                        questions.push(question);
                        console.log('question => ', question);
                        answer = answerPrompt(data.toString());
                        console.log('answer => ', answer);
                        // child.stdout.pipe(process.stdout);
                        // child.stdin.write(`${new Buffer(answer)}\r\n`);
                        await child.stdin.write(`${answer}\n`);
                    }
                });

                child.on('exit', (code: number) => {
                    child.stdin.end();
                    console.log('code => ', code);
                    done();
                });

                child.stdout.on('write', (data) => {
                    console.log(data);
                });

                child.stdout.on('end', (data) => {
                    console.log('end');
                    console.log(data);
                });
            } catch (error) {
                fail(error);
            }
        }, 10000);
    });
});
