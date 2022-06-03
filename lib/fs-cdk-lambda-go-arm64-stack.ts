import { AssetHashType, Stack, StackProps } from 'aws-cdk-lib';
import { Architecture, Code, Function, FunctionProps, FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda';
import { execSync } from 'child_process';
import { Construct } from 'constructs';
import * as path from 'path';

export class FsCdkLambdaGoArm64Stack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const handler = 'bootstrap';

        const functionProps: FunctionProps = {
            functionName: 'kzero-function-fs-go',
            code: Code.fromAsset(path.join(__dirname, '..', 'lambda'), {
                assetHashType: AssetHashType.OUTPUT,
                bundling: {
                    image: Runtime.GO_1_X.bundlingImage,
                    local: {
                        tryBundle(outputDir: string): boolean {
                            try {
                                execSync('go version', {
                                    stdio: ['ignore', process.stderr, 'inherit'],
                                });
                            } catch {
                                process.stderr.write('not found go');
                                return false;
                            }
                            execSync(
                                [
                                    `GOOS=linux GOARCH=arm64 go build -ldflags="-s -w" -o ${path.join(
                                        outputDir,
                                        handler
                                    )}`,
                                ].join(' && '),
                                {
                                    stdio: ['ignore', process.stderr, 'inherit'],
                                    cwd: path.join(__dirname, '..', 'lambda'),
                                }
                            );
                            return true;
                        },
                    },
                },
            }),
            architecture: Architecture.ARM_64,
            memorySize: 128,
            runtime: Runtime.PROVIDED_AL2,
            handler: 'bootstrap',
        };

        const func = new Function(this, 'kzero-function-fs-go', functionProps);

        const url = func.addFunctionUrl({
            authType: FunctionUrlAuthType.NONE,
        });
    }
}
