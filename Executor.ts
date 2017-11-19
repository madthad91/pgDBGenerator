import { execSync } from 'child_process';

export function execute(command: string, callback: any) {
  callback(execSync(command).toString());
}
