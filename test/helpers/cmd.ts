const { existsSync } = require('fs');
const { constants } = require('os');
const { spawn } = require('child_process');
const concat = require('concat-stream');
const PATH = process.env.PATH;

const DOWN = '\x1B\x5B\x42';
const UP = '\x1B\x5B\x41';
const ENTER = '\x0D';
const SPACE = '\x20';

function spawnProcess(path: string, args = [], env = null) {
    if (!path || !existsSync(path)) {
        throw new Error(`Invalid process path: ${path}`);
    }

    const fullArgs = [path].concat(args);

    return spawn('node', fullArgs, {
        env: Object.assign(
            {
                NODE_ENV: 'test',
                preventAutoStart: false,
                PATH,
            },
            env,
        ),
        stdio: [null, null, null, 'ipc'],
    });
}

function executeWithInput(path: string, args: string[] = [], inputs: string[] = [], options: any = {}) {
    const { env = null, timeout = 100, maxTimeout = 10000 } = options;
    const process = spawnProcess(path, args, env);
    let inputTimeout;
    let killTimeout;
    process.stdin.setEncoding('utf-8');

    const input = (inputs) => {
        if (inputs.length === 0) {
            process.stdin.end();

            killTimeout = setTimeout(() => {
                console.error('Error: Reached I/O timeout');
                process.kill(constants.signals.SIGTERM);
            }, maxTimeout);

            return;
        }

        inputTimeout = setTimeout(() => {
            process.stdin.write(inputs[0]);
            input(inputs.slice(1));
        }, timeout);
    };

    const promise: any = new Promise((resolve, reject) => {
        process.stderr.once('data', (err) => {
            process.stdin.end();

            if (inputTimeout) {
                clearTimeout(inputTimeout);
                inputs = [];
            }
            reject(err.toString());
        });

        process.on('error', reject);

        input(inputs);

        process.stdout.pipe(
            concat((result) => {
                if (killTimeout) {
                    clearTimeout(killTimeout);
                }

                resolve(result.toString());
            }),
        );
    });

    promise.attachedProcess = process;
    return promise;
}

export { spawnProcess, executeWithInput, DOWN, UP, ENTER, SPACE };
